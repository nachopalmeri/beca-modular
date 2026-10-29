#!/usr/bin/env bash
# Reconstruye los dos videos de Beca Modular desde cero.
#   ./video/build.sh            → captura la web, compone, musicaliza y exporta
#   SKIP_CAPTURE=1 ./video/build.sh  → reutiliza las capturas de video/plates/
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd .. && pwd)

if ! curl -sf -o /dev/null http://localhost:4178/; then
  (cd "$ROOT" && node server.mjs >/dev/null 2>&1 &)
  until curl -sf -o /dev/null http://localhost:4178/; do sleep 0.5; done
fi

if [ -z "${SKIP_CAPTURE:-}" ]; then
  node tools/capture.cjs story
  node tools/capture.cjs sim
fi

mkdir -p build out
python3 -I tools/music.py build/music-promo.wav
node tools/render.cjs promo build/promo-video.mp4 &
node tools/render.cjs loop build/loop-video.mp4 &
wait

ffmpeg -y -v error -i build/promo-video.mp4 -i build/music-promo.wav \
  -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k \
  -shortest -movflags +faststart out/beca-modular-promo.mp4
ffmpeg -y -v error -i build/loop-video.mp4 -map 0:v -c:v copy -an -movflags +faststart out/beca-modular-loop.mp4

python3 -I tools/qc.py
ls -lh out/
