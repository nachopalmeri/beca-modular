# Videos de Beca Modular

Dos piezas hechas con el mismo material:

| Archivo | Para qué | Duración | Formato | Audio |
|---|---|---|---|---|
| `out/beca-modular-promo.mp4` | Publicidad, redes y jurado. Se entiende sin haber escuchado el pitch. | 60 s | 1920×1080 · 16:9 · 30 fps · H.264 High · ~24 MB | Música original, AAC 48 kHz estéreo, ≈ −15 LUFS |
| `out/beca-modular-loop.mp4` | Fondo en pantalla mientras se presenta. Corre en bucle sin corte visible. | 45 s | 1920×1080 · 16:9 · 30 fps · H.264 High · ~21 MB | Sin audio (a propósito) |

## Cómo reproducirlos

- **Promo:** con cualquier reproductor, navegador, Keynote, PowerPoint o Google Slides.
- **Loop en pantalla:** activar la repetición.
  - VLC: *Reproducción → Repetir uno*.
  - Navegador: `<video src="beca-modular-loop.mp4" autoplay muted loop playsinline>`.
  - PowerPoint: *Reproducción → Repetir la reproducción hasta su interrupción*.
  - Keynote: *Repetir: Bucle*.
- **Sin audio:** todo se entiende sin sonido. La música de la promo se puede silenciar sin perder información.

## Qué muestra

**Promo, de 0 a 60 s:**
1. Estudiante haciendo cuentas de noche: "Estudiar cuesta todos los meses."
2. La web real, escena 1. Mapa de abandono interanual de DiNIEE 2024-25, con las 24 marcas rojas que aparecen una por provincia.
3. La web real, escena 3. Valor real de Progresar desde septiembre de 2024, calculado con IPC-INDEC.
4. Una aportante: "Y hay personas que quieren ayudar."
5. La web real, escena 2. El árbol crece; cada hoja es un aporte (ilustrativo).
6. Presentación de marca: Brote entra caminando y salta. Aparecen la marca y los cuatro tramos.
7. "Cómo funciona", con la web real dentro de una ventana y cuatro pasos:
   1. Se sellan las reglas.
   2. Se reciben aportes en sats y se completa la meta.
   3. Una tutora valida el hito (con su escena) y se paga el tramo.
   4. El verificador comprueba `SHA-256(preimage) = payment hash`.
8. Estudiante en el pasillo: "Cada tramo, cuando se gana. Lo que no se usa vuelve a cada sponsor."
9. Cierre: Brote se gradúa y descansa. Aparecen la marca, `beca-clara.vercel.app` y la aclaración "La web simula los pagos: no recibe fondos".

**Loop:** biblioteca → mapa → árbol → curva → pagos por hito → verificación → pasillo → Brote → biblioteca.
- Marca fija abajo a la izquierda y etiquetas cortas que quedan al menos 4 s en pantalla.
- El último cuadro coincide con el primero: la toma de la biblioteca entra en fundido sobre el cierre con la misma posición de cámara que tiene en el segundo 0.

## Fidelidad al producto

- Las tomas de la web son **capturas reales del sitio publicado**, servido localmente desde `main`. Todas las interacciones se hicieron de verdad:
  - sellar reglas;
  - aportar;
  - completar con un segundo sponsor;
  - validar dos hitos;
  - verificar el recibo.
- El cursor se agregó para que las acciones se lean en video.
- La web se renderizó con Gelasio en lugar de Georgia (mismas métricas, licencia OFL) y JetBrains Mono en lugar de Cascadia Code, porque Linux no trae esas fuentes. En Windows y Mac la web usa Georgia: la diferencia es mínima.
- No se muestran funciones inexistentes:
  - el simulador figura como "Simulación · sin dinero real";
  - el cierre aclara que la web no recibe fondos.
- Los datos que aparecen en pantalla son los mismos de la web, con sus fuentes:
  - DiNIEE, abandono interanual 2024-25;
  - IPC-INDEC (serie 148.3);
  - el árbol, marcado como ilustrativo.

## Origen de cada recurso

| Recurso | Origen |
|---|---|
| Tomas de la web, Brote vectorial, tipografías de marca y paleta | Propios del proyecto (`index.html`, `brote-rig.mjs`, `styles.css`) |
| `assets/photos/library.png` | Ya existía en el repo (`assets/beca-library-hero.png`) |
| `kitchen`, `supporter`, `tutor`, `hallway` (`.png`) | Generadas con IA en Canva (*generate-image*) para esta pieza. Exportadas a 1920×1080 desde el diseño de Canva "Blank dark green desktop wallpaper". |
| Música | Original, sintetizada con `tools/music.py` (numpy). No usa samples. |
| Gelasio (fuente de render) | Google Fonts, licencia OFL |

Las personas de las fotos **no existen** y no son usuarios ni testimonios de Beca Modular. Las fotos no contienen texto generado: todo el texto se compone encima.

**Material descartado:** `assets/beca-modular-intro.mp4`, el video de 15 s de octubre (también está en Drive). Tiene:
- texto de interfaz ilegible generado por IA ("Sudachie wendl…");
- "USD 100" y "5 hitos", que ya no corresponden al producto actual en sats/ARS;
- una paleta violeta y turquesa ajena a la identidad actual.

No se modificó ni se borró.

## Volver a renderizar

Requisitos: Node 18+ con Playwright y Chromium, FFmpeg, y Python 3 con numpy.

```bash
./video/build.sh                 # graba la web, compone, musicaliza, exporta y controla
SKIP_CAPTURE=1 ./video/build.sh  # reutiliza las capturas de video/plates/
```

**Partes del proyecto:**
- `tools/vclock.js`: reloj virtual. Reemplaza tiempo, timers, `requestAnimationFrame` y animaciones CSS para que cada cuadro sea exacto y repetible.
- `tools/capture.cjs`: graba las tomas de la web (`story`, `sim`) en `plates/`, a 1440×810 CSS px con DPR 1,5.
- `src/compose.html`, `compose.css`, `compose.mjs`: la composición. `renderAt(t)` dibuja el segundo `t`.
  - `?mode=promo` o `?mode=loop` para elegir la pieza.
  - Se puede abrir en el navegador en `http://localhost:4178/video/src/compose.html?mode=promo`.
- `tools/render.cjs`: captura cada cuadro y lo pasa a FFmpeg (x264, CRF 17, perfil High, `+faststart`).
  - Para un borrador rápido: `--every 10`.
  - Para un tramo: `--from 20 --to 30`.
- `tools/music.py`: banda sonora de la promo. Los acentos están sincronizados con los clics, los pagos y el ✓.
- `tools/qc.py`: especificaciones, cuadros negros, congelamientos y comparación del último cuadro del loop con el primero.
- `tools/play.cjs`: reproducción real en Chrome. La promo completa y el loop dos ciclos seguidos.

**Para cambiar textos o tiempos:** editar `src/compose.mjs`. Cada plano es una llamada `photo(...)`, `plate(...)` o `shot(...)` con su inicio y su fin en segundos.

## Otros formatos de pantalla

Todo lo importante está dentro de un margen de 64 px.

- **Vertical 9:16 (redes):** conviene recomponer en vez de recortar, porque la ventana del simulador ocupa todo el ancho. Se puede cambiar `#stage` a 1080×1920 y reacomodar la columna de pasos sobre la ventana.
- **Pantallas 16:10 o 4:3:** usar *letterbox*, sin recortar:

  ```bash
  ffmpeg -i out/beca-modular-loop.mp4 -vf "scale=1920:-2,pad=1920:1200:(ow-iw)/2:(oh-ih)/2:color=0x0f1812" -c:v libx264 -crf 18 -an loop-16x10.mp4
  ```

  El color del relleno es el fondo de marca.
- **4K:** volver a renderizar con `deviceScaleFactor: 2` en `render.cjs`. Las capturas de la web soportan hasta 1,5× sin perder nitidez.
