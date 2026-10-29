"""Banda sonora original de la versión promocional (60 s), sintetizada desde cero.

Piano de fieltro + pad cálido + bajo y pulso suaves, con acentos sincronizados a la acción
(clics del simulador, pagos y la verificación). Sin samples ni material de terceros.
Uso: python3 -I music.py salida.wav
"""
import sys
import numpy as np

SR = 48000
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, t0, pan=0.0, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    sig = sig[: N - i0] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i0:i0 + len(sig)] += sig * l
    R[i0:i0 + len(sig)] += sig * r


def piano(m, vel=0.6, dur=3.5):
    f = midi(m)
    t = np.arange(int(SR * dur)) / SR
    tau = np.interp(m, [36, 96], [3.2, 0.9])
    out = np.zeros_like(t)
    bright = 1.2 + (1 - vel) * 1.4  # más suave = menos armónicos (fieltro)
    for k in range(1, 9):
        fk = k * f * np.sqrt(1 + 0.00035 * k * k)
        if fk > 9000:
            break
        out += np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) / k ** bright * np.exp(-t * k * 0.35 / tau)
    env = np.minimum(1, t / 0.006) * np.exp(-t / tau)
    hammer = rng.normal(0, 1, len(t)) * np.exp(-t / 0.004) * 0.02
    return (out * env + hammer) * vel * 0.22


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):  # un polo, suficiente para suavizar
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def pad(notes, t0, dur, gain=0.05):
    t = np.arange(int(SR * (dur + 2.5))) / SR
    sig = np.zeros_like(t)
    for m in notes:
        for det in (-7, 0, 6):
            f = midi(m) * 2 ** (det / 1200)
            ph = (f * t + rng.uniform()) % 1.0
            sig += (2 * ph - 1) * 0.33
    sig = lowpass(sig, 750)
    env = np.minimum(1, t / 1.4) * np.where(t < dur, 1, np.exp(-(t - dur) / 0.9))
    add(sig * env, t0, pan=-0.2, gain=gain / len(notes))
    add(sig * env, t0 + 0.012, pan=0.2, gain=gain / len(notes))


def bass(m, t0, dur, gain=0.16):
    t = np.arange(int(SR * dur)) / SR
    f = midi(m)
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    env = np.minimum(1, t / 0.03) * np.exp(-t / 2.2) * np.minimum(1, (dur - t) / 0.2)
    add(sig * env, t0, gain=gain)


def thump(t0, gain=0.12):
    t = np.arange(int(SR * 0.35)) / SR
    f = 52 + 40 * np.exp(-t / 0.02)
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.09)
    add(sig, t0, gain=gain)


def tick(t0, gain=0.05):
    t = np.arange(int(SR * 0.09)) / SR
    sig = np.sin(2 * np.pi * 2350 * t) * np.exp(-t / 0.012) + rng.normal(0, 0.3, len(t)) * np.exp(-t / 0.004)
    add(sig, t0, pan=0.15, gain=gain)


def coin(t0, gain=0.07):
    for k, m in enumerate((86, 93)):
        t = np.arange(int(SR * 1.6)) / SR
        f = midi(m)
        sig = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2.0 * f * t)) * np.exp(-t / 0.35)
        add(sig, t0 + k * 0.09, pan=0.25, gain=gain)


def bell(t0, gain=0.09):
    for m, g in ((86, 1.0), (93, 0.6), (98, 0.35)):
        t = np.arange(int(SR * 4)) / SR
        f = midi(m)
        sig = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.5) + 0.12 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / 0.2)) * np.exp(-t / 1.4)
        add(sig, t0, pan=-0.1, gain=gain * g)


def swell(t0, dur, gain=0.05):
    t = np.arange(int(SR * dur)) / SR
    sig = lowpass(lowpass(rng.normal(0, 1, len(t)), 900), 900) * (t / dur) ** 2.2
    add(sig, t0, pan=-0.3, gain=gain)
    add(np.roll(sig, 480), t0, pan=0.3, gain=gain)


# Acordes (MIDI, de grave a agudo) — compás de 3 s (4 tiempos a 80 bpm)
CH = {
    'Bm': [47, 54, 59, 62, 66], 'G': [43, 50, 55, 59, 62], 'D': [50, 57, 62, 66, 69],
    'A': [45, 52, 57, 61, 64], 'Ac': [49, 57, 61, 64, 69], 'Em': [40, 52, 55, 59, 64],
}
PROG = ['Bm', 'G', 'D', 'A', 'Bm', 'G', 'A', 'D', 'Ac', 'Bm', 'G', 'D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'D', 'D']
BAR, BEAT, E8 = 3.0, 0.75, 0.375

for i, name in enumerate(PROG):
    t0 = i * BAR
    c = CH[name]
    root = c[0]
    arp = [c[1] + 12, c[2] + 12, c[3] + 12, c[4] + 12, c[2] + 24, c[4] + 12, c[3] + 12, c[2] + 12]
    if t0 < 6:  # apertura: piano desnudo, notas sueltas
        for k, n in ((0, arp[0]), (2, arp[2]), (4, arp[4]), (6, arp[3])):
            add(piano(n, 0.42), t0 + k * E8, pan=-0.1 + 0.05 * k)
        add(piano(root + 12, 0.35, 5), t0, pan=-0.3)
    elif t0 < 21:  # datos y personas: arpegio liviano + pad bajo
        for k in range(8):
            if k % 2 == 0 or t0 >= 12:
                add(piano(arp[k], 0.36 + 0.08 * (k == 0)), t0 + k * E8, pan=-0.25 + 0.07 * k)
        add(piano(root + 12, 0.4, 5), t0, pan=-0.3)
        pad(c[1:], t0, BAR, gain=0.035 if t0 < 12 else 0.05)
    elif t0 < 51:  # marca y demo: pulso, bajo y arpegio completo
        tutor = 33 <= t0 < 36
        for k in range(8):
            add(piano(arp[k], 0.4 if not tutor else 0.32), t0 + k * E8, pan=-0.25 + 0.07 * k)
        add(piano(root + 12, 0.48, 5), t0, pan=-0.3)
        pad(c[1:], t0, BAR, gain=0.07)
        bass(root - 12 if root > 45 else root, t0, BAR - 0.05, gain=0.13 if not tutor else 0.08)
        if not tutor:
            for b in range(4):
                thump(t0 + b * BEAT, gain=0.07 if b % 2 else 0.1)
    else:  # cierre: se abre y resuelve
        if t0 < 57:
            for k in (0, 2, 4, 6):
                add(piano(arp[k], 0.38), t0 + k * E8, pan=-0.2 + 0.08 * k)
            pad(c[1:], t0, BAR, gain=0.06)
            bass(root - 12 if root > 45 else root, t0, BAR, gain=0.1)
        else:
            add(piano(62, 0.4, 6), t0)
            add(piano(69, 0.32, 6), t0 + 0.02)
            add(piano(74, 0.3, 6), t0 + 0.04)
            pad([57, 62, 66], t0, 2.0, gain=0.045)

# Acentos sincronizados con la imagen
swell(19.6, 1.45, gain=0.05)
bell(21.0, gain=0.05)                       # aparece Brote / la marca
for t in (26.0, 28.8, 35.8, 40.8):          # cambio de paso
    tick(t, 0.045)
for t in (27.3, 30.84, 32.0, 42.88):        # clics del simulador
    tick(t, 0.03)
for t in (37.3, 39.16):                     # pagos de tramo
    coin(t, 0.06)
bell(44.29, gain=0.08)                      # "Pago verificado"

# Reverb por convolución con una cola de ruido decreciente (2,6 s)
irn = int(SR * 2.6)
tt = np.arange(irn) / SR
irL = rng.normal(0, 1, irn) * np.exp(-tt / 0.55)
irR = rng.normal(0, 1, irn) * np.exp(-tt / 0.55)
irL[:int(0.02 * SR)] = 0
irR[:int(0.025 * SR)] = 0


def conv(x, ir):
    n = len(x) + len(ir)
    nf = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[:len(x)]


wetL, wetR = conv(L, irL), conv(R, irR)
wetL *= 0.32 * np.std(L) / (np.std(wetL) + 1e-9)
wetR *= 0.32 * np.std(R) / (np.std(wetR) + 1e-9)
outL, outR = L + wetL, R + wetR

# Entrada y salida suaves; saturación leve para unir la mezcla
t = np.arange(N) / SR
fade = np.minimum(1, t / 0.4) * np.clip((DUR - t) / 2.5, 0, 1) ** 1.5
outL, outR = np.tanh(outL * 1.3) * fade, np.tanh(outR * 1.3) * fade
peak = max(np.abs(outL).max(), np.abs(outR).max())
outL, outR = outL / peak * 0.89, outR / peak * 0.89

pcm = (np.stack([outL, outR], 1) * 32767).astype('<i2')
import wave
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('ok', sys.argv[1], f'{DUR}s')
