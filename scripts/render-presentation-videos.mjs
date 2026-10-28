import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'scripts', 'presentation-videos.json');
const rendererPath = path.join(root, 'scripts', 'presentation-renderer.html');
const outputDirectory = path.join(root, 'assets', 'presentaciones');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
const fps = 24;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', windowsHide: true, ...options });
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}): ${result.stderr || result.stdout}`);
  return result.stdout.trim();
}

function duration(file) {
  return Number(run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file]));
}

function srtTimestamp(seconds) {
  const ms = Math.round(seconds * 1000), hours = Math.floor(ms / 3_600_000), minutes = Math.floor(ms / 60_000) % 60;
  const secs = Math.floor(ms / 1000) % 60, millis = ms % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

function wavHeader(sampleCount, sampleRate = 48_000) {
  const header = Buffer.alloc(44), bytes = sampleCount * 2;
  header.write('RIFF', 0); header.writeUInt32LE(36 + bytes, 4); header.write('WAVE', 8); header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(bytes, 40);
  return header;
}

async function writeAmbientBed(file, seconds) {
  const rate = 48_000, count = Math.ceil(seconds * rate), chords = [[110, 146.83, 174.61], [98, 130.81, 164.81], [130.81, 164.81, 196], [87.31, 130.81, 174.61]];
  const data = Buffer.alloc(count * 2);
  for (let i = 0; i < count; i++) {
    const t = i / rate, chord = chords[Math.floor(t / 7) % chords.length], x = (t % 7) / 7;
    const envelope = Math.min(1, x * 3, (1 - x) * 3) * (0.72 + 0.28 * Math.sin(t * Math.PI / 7));
    const pad = chord.reduce((sum, hz, index) => sum + Math.sin(2 * Math.PI * hz * t + index * .13) * (index === 0 ? .023 : .014), 0);
    const bell = Math.pow(Math.max(0, Math.sin(2 * Math.PI * (t / 3.5))), 9) * Math.sin(2 * Math.PI * (chord[2] * 2) * t) * .008;
    data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round((pad * envelope + bell * envelope) * 32767))), i * 2);
  }
  await writeFile(file, Buffer.concat([wavHeader(count), data]));
}

function requirePlaywright() {
  const known = process.env.PLAYWRIGHT_PATH || 'C:/Users/Nacho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
  return createRequire(import.meta.url)(known);
}

async function renderVideo(spec, renderer, workDirectory, browser) {
  const audioDirectory = path.join(workDirectory, spec.id);
  const sentenceFiles = spec.beats.map((_, index) => path.join(audioDirectory, `beat-${String(index).padStart(2, '0')}.wav`));
  const silenceFile = path.join(workDirectory, 'pause.wav');
  const concatList = path.join(audioDirectory, 'voice-list.txt');
  const voiceFile = path.join(workDirectory, `${spec.id}-voice.wav`);
  const bedFile = path.join(workDirectory, `${spec.id}-bed.wav`);
  const captionsFile = path.join(workDirectory, `${spec.id}.srt`);
  const webvttFile = path.join(outputDirectory, `${spec.id}.vtt`);
  const framesDirectory = path.join(workDirectory, `${spec.id}-frames`);
  await mkdir(framesDirectory, { recursive: true });

  const timings = [];
  let cursor = 0;
  const list = [];
  const cues = [];
  for (let index = 0; index < sentenceFiles.length; index++) {
    const file = sentenceFiles[index], clipDuration = duration(file), pause = .28;
    timings.push({ start: cursor, duration: clipDuration + pause, end: cursor + clipDuration + pause });
    cues.push(`${cues.length + 1}\n${srtTimestamp(cursor)} --> ${srtTimestamp(cursor + clipDuration)}\n${spec.beats[index].narration}\n`);
    list.push(`file '${file.replaceAll('\\', '/')}'`, `file '${silenceFile.replaceAll('\\', '/')}'`);
    cursor += clipDuration + pause;
  }
  await writeFile(concatList, list.join('\n'), 'utf8');
  await writeFile(captionsFile, cues.join('\n'), 'utf8');
  await writeFile(webvttFile, `WEBVTT\n\n${cues.join('\n').replace(/^(\d+)\n/gm, '').replaceAll(',', '.').trim()}\n`, 'utf8');
  run(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', concatList, '-c:a', 'pcm_s16le', voiceFile]);
  const totalDuration = duration(voiceFile);
  await writeAmbientBed(bedFile, totalDuration);

  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const html = renderer.replace('/*__VIDEO_SPEC__*/', JSON.stringify({ spec, timings }));
  await page.setContent(html, { waitUntil: 'load' });

  const posterPath = path.join(outputDirectory, `${spec.id}-poster.jpg`);
  for (let frame = 0; frame < Math.ceil(totalDuration * fps); frame++) {
    const time = frame / fps;
    await page.evaluate(value => window.renderAt(value), time);
    await page.screenshot({ path: path.join(framesDirectory, `frame-${String(frame).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 91 });
    if (frame === Math.round(2.4 * fps)) await page.screenshot({ path: posterPath, type: 'jpeg', quality: 93 });
    if (frame % (fps * 10) === 0) console.log(`${spec.id}: ${frame}/${Math.ceil(totalDuration * fps)} frames (${time.toFixed(1)}s)`);
  }
  await context.close();

  const videoPath = path.join(outputDirectory, `${spec.id}.mp4`);
  run(ffmpeg, [
    '-y', '-framerate', String(fps), '-i', path.join(framesDirectory, 'frame-%06d.jpg'), '-i', voiceFile, '-i', bedFile, '-i', captionsFile,
    '-filter_complex', '[1:a]highpass=f=75,lowpass=f=11500,volume=1.15[voice];[2:a]volume=0.22[bed];[voice][bed]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[audio]',
    '-map', '0:v:0', '-map', '[audio]', '-map', '3:s:0', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps),
    '-c:a', 'aac', '-b:a', '192k', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=spa', '-metadata', `title=${spec.title} | Beca Modular`, '-metadata', 'comment=Animación original con datos ficticios; no representa pagos, validaciones ni impacto real.', '-movflags', '+faststart', videoPath,
  ]);

  const subtitlePath = path.join(outputDirectory, `${spec.id}.srt`);
  await copyFile(captionsFile, subtitlePath);
  console.log(`Rendered ${videoPath} (${totalDuration.toFixed(1)}s, ${Math.ceil(totalDuration * fps)} frames)`);
  return { id: spec.id, title: spec.title, duration: totalDuration, videoPath, posterPath, subtitlePath };
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const renderer = await readFile(rendererPath, 'utf8');
  await mkdir(outputDirectory, { recursive: true });
  const workRoot = process.env.BECA_VIDEO_TMP || 'D:/Dev/temp/opencode';
  await mkdir(workRoot, { recursive: true });
  const workDirectory = await mkdtemp(path.join(workRoot, 'beca-modular-video-'));
  try {
    run('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(root, 'scripts', 'render-presentation-audio.ps1'), '-ManifestPath', manifestPath, '-OutputDirectory', workDirectory]);
    run(ffmpeg, ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', '0.28', '-c:a', 'pcm_s16le', path.join(workDirectory, 'pause.wav')]);
    const { chromium } = requirePlaywright();
    const browser = await chromium.launch({ headless: true, executablePath: process.env.BECA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    try {
      for (const spec of manifest.videos) await renderVideo(spec, renderer, workDirectory, browser);
    } finally {
      await browser.close();
    }
    const distDirectory = path.join(root, 'dist', 'assets', 'presentaciones');
    await mkdir(distDirectory, { recursive: true });
    for (const name of await readdir(outputDirectory)) await copyFile(path.join(outputDirectory, name), path.join(distDirectory, name));
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) await main();
