"""Control técnico de los entregables: especificaciones, negros, congelamientos y unión del loop.
Uso: python3 -I tools/qc.py   (desde video/)
"""
import json
import re
import subprocess


def run(*a):
    return subprocess.run(a, capture_output=True, text=True)


def probe(f):
    r = run('ffprobe', '-v', 'error', '-show_entries',
            'format=duration,size,bit_rate:stream=codec_type,codec_name,profile,width,height,r_frame_rate,pix_fmt,display_aspect_ratio,nb_frames,sample_rate,channels',
            '-of', 'json', f)
    return json.loads(r.stdout)


def detect(f, filt):
    r = run('ffmpeg', '-v', 'info', '-i', f, '-vf', filt, '-an', '-f', 'null', '-')
    return r.stderr


def decode_ok(f):
    r = run('ffmpeg', '-v', 'error', '-i', f, '-f', 'null', '-')
    return r.stderr.strip() == ''


def frame_diff(f, a, b):
    """PSNR entre el cuadro a y el cuadro b (índices) del mismo archivo."""
    r = run('ffmpeg', '-v', 'info', '-i', f, '-i', f, '-lavfi',
            f'[0:v]select=eq(n\\,{a}),setpts=PTS-STARTPTS[x];[1:v]select=eq(n\\,{b}),setpts=PTS-STARTPTS[y];[x][y]psnr', '-frames:v', '1', '-f', 'null', '-')
    m = re.search(r'average:([\d.inf]+)', r.stderr)
    return m.group(1) if m else '?'


report = []
for name in ('beca-modular-promo.mp4', 'beca-modular-loop.mp4'):
    f = f'out/{name}'
    p = probe(f)
    v = next(s for s in p['streams'] if s['codec_type'] == 'video')
    a = [s for s in p['streams'] if s['codec_type'] == 'audio']
    blacks = re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', detect(f, 'blackdetect=d=0.25:pix_th=0.06'))
    freezes = re.findall(r'freeze_start: ([\d.]+)|freeze_end: ([\d.]+)', detect(f, 'freezedetect=n=0.0008:d=2.5'))
    line = {
        'archivo': f, 'duración_s': round(float(p['format']['duration']), 3), 'tamaño_MB': round(int(p['format']['size']) / 1e6, 2),
        'bitrate_kbps': round(int(p['format']['bit_rate']) / 1000), 'video': f"{v['codec_name']} {v.get('profile')} {v['width']}x{v['height']} {v['r_frame_rate']} fps {v['pix_fmt']} DAR {v.get('display_aspect_ratio')}",
        'cuadros': v.get('nb_frames'), 'audio': f"{a[0]['codec_name']} {a[0]['sample_rate']} Hz {a[0]['channels']} ch" if a else 'sin audio',
        'decodifica_sin_errores': decode_ok(f), 'tramos_negros': blacks, 'congelamientos>2.5s': [x for x in freezes],
    }
    if 'loop' in name:
        n = int(v['nb_frames'])
        line['unión_loop_PSNR_último→primero'] = frame_diff(f, n - 1, 0)
        line['PSNR_típico_cuadros_vecinos'] = [frame_diff(f, k, k + 1) for k in (60, 400, 900)]
    report.append(line)

for r in report:
    print(json.dumps(r, ensure_ascii=False, indent=1))
