import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(path.join(root, 'scripts', 'presentation-videos.json'), 'utf8'));
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
const presentationHtml = readFileSync(path.join(root, 'presentacion.html'), 'utf8');

test('presentation MP4s are HD, narrated, captioned, and match the source scripts', () => {
  for (const video of manifest.videos) {
    assert.ok(presentationHtml.includes(`assets/presentaciones/${video.id}.mp4`), `${video.id} must be linked from the page`);
    for (const beat of video.beats) assert.ok(presentationHtml.includes(beat.narration), `${video.id} narration should have a matching readable transcript`);
    const file = path.join(root, 'assets', 'presentaciones', `${video.id}.mp4`);
    assert.ok(statSync(file).size > 300_000, `${video.id} MP4 should be a finished render`);
    assert.deepEqual(readFileSync(path.join(root, 'dist', 'assets', 'presentaciones', `${video.id}.mp4`)), readFileSync(file), `${video.id} source/dist MP4 must match`);
    const info = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], { encoding: 'utf8' }));
    const visual = info.streams.find(stream => stream.codec_type === 'video');
    const audio = info.streams.find(stream => stream.codec_type === 'audio');
    const captions = info.streams.find(stream => stream.codec_type === 'subtitle');
    assert.equal(visual.codec_name, 'h264');
    assert.equal(visual.width, 1920);
    assert.equal(visual.height, 1080);
    assert.equal(audio.codec_name, 'aac');
    assert.ok(captions, `${video.id} needs a selectable subtitle track`);
    assert.ok(Number(info.format.duration) > 30 && Number(info.format.duration) < 75);
    assert.ok(statSync(path.join(root, 'assets', 'presentaciones', `${video.id}.vtt`)).size > 100);
    assert.ok(statSync(path.join(root, 'assets', 'presentaciones', `${video.id}-poster.jpg`)).size > 10_000);
  }
});
