# 12 — Recomendación ejecutiva

Fecha: 2026-10-26. Base: docs 01–11 de esta carpeta y `data/`.

## Recomendación

**Construir Tramo**: complementos de beca condicionados a hitos académicos, pagados por Lightning en segundos, con recibo verificable por pago, reglas ancladas en Bitcoin y devolución exacta del saldo no usado.
**Track primario: Inclusión Financiera.** Encuadre alternativo: Nueva Educación. Reserva táctica: Puente (microayudas de emergencia, mismo motor), si el desafío del día 1 lo pide.

**Qué se conserva de Beca Modular**: el problema, las reglas (fondeo completo, pausa ≠ abandono, no clawback, devolución prorrata, datos personales fuera del registro público) y la contabilidad de `funding-model.mjs`.
**Qué se abandona**: Sepolia/ERC-20/escrow EVM, aportes "por materia desde 1 USD" como eje, el checklist con IA, el laboratorio (MPP, yield, firma P-256).

## Por qué (evidencia)

1. **Problema con números oficiales verificados por nosotros**: Progresar congelado en $35.000 → –42% real (IPC INDEC, sept-24 a ago-26); 1.767.524 inscriptos vs 953.169 becarios en 2025; decil más pobre 7,9% → 1,1% entre 1.º y 5.º año.
2. **Corrección de la intuición inicial**: no hay "plata de becas sin usar": Presupuesto Abierto muestra que Progresar 2025 ejecutó el 99% del crédito vigente después de un recorte de ~$95.700 M. El faltante es de monto y cobertura, no de distribución. Por eso el producto no promete destrabar fondos públicos: crea un riel para **dinero privado adicional**.
3. **Mecanismo con respaldo empírico**: las becas por desempeño muestran efectos modestos pero positivos en RCT (MDRC). No prometemos reducir el abandono.
4. **Ajuste al evento**: el jurado son referentes de Bitcoin. La demo mueve sats reales en vivo, con participación del jurado. Bitcoin cumple un rol esencial (pagos chicos instantáneos y globales, prueba de pago, anclaje temporal), no decorativo.
5. **Benchmark**: en hackathons Bitcoin los ganadores son herramientas nativas y terminadas (Bitcoin 2025: 0/12 de accesibilidad). En hackathons estudiantiles generalistas, accesibilidad está ~2× sobre-representada, pero lo que se transfiere es el mecanismo *usuario concreto + cambio visible*, no el tema.
6. **Robustez ante lo desconocido**: el motor (fondeo → validación → pago → recibo → devolución) sirve para los tracks de Inclusión Financiera, Nueva Educación e Impacto y Comunidad.

## OpenARG
- **No verificado** que alguien de OpenARG/Colossus Lab sea jurado. Hecho: Colossus Lab figura como partner/mentor en Luma y Martín Yeza (Head del Consejo Asesor de Colossus Lab) dio la charla del bootcamp "Cómo reconocer un problema y atacarlo".
- **No aporta una ventaja técnica sustancial** al núcleo: IPC y presupuesto están disponibles sin clave en datos.gob.ar y Presupuesto Abierto. Queda como proveedor opcional, con atribución y caché. Nunca en vivo en el pitch.

## Riesgos principales

| Riesgo | Severidad | Respuesta |
|---|---|---|
| **Inscripción**: cierre 25/10 (o 16/10); el repo la marcaba pendiente el 14/10 | **Bloqueante** | Verificar hoy en Luma y por mail |
| Demanda de sponsors no validada | Alta | Primer experimento (abajo) |
| Red del predio | Alta | 2 hotspots + VPS + video de respaldo |
| Custodia / PSAV | Media (pitch), alta (producción) | Declararlo; MVP con fondos propios; roadmap multisig |
| Desafío del track incompatible | Media | Reencuadre Puente/Tutorías sobre el mismo motor |
| Percepción de trabajo previo | Baja-media | Código nuevo en el evento; declarar qué existía |
| Volatilidad | Baja | Montos en ARS, conversión al pagar |

## Primer experimento (hacer antes del jueves 29)

**Hipótesis**: existe al menos un sponsor real dispuesto a comprometer dinero para pagar complementos por hito a estudiantes, y valora pago inmediato + recibo verificable por sobre una transferencia.

**Procedimiento (48 h, costo ≈ 0)**:
1. Escribir a 10 posibles sponsors concretos: grupos de egresados de UADE/otras universidades, 2 empresas que contratan pasantes, 3 referentes de comunidades bitcoiner argentinas (vía grupo de WhatsApp del EDU HUB o LABITCONF), y **2 programas de becas existentes** (p.ej. el área de becas de una fundación empresaria o Cimientos). A estos últimos, la pregunta es otra: *"¿Cuánto les cuesta administrar y controlar las cuotas y la renovación? ¿Pagarían por hito si fuera igual de simple?"* (doc 04 §4b).
2. Mensaje: una pantalla con la propuesta y una pregunta cerrada: *"¿Comprometerías X sats / $Y para 1 estudiante de 1.er año, pagados sólo si aprueba su primer parcial, con recibo público? Sí / No / Sí, si…"*.
3. En paralelo, 3 estudiantes que cobran Progresar: ¿tienen Lemon, Belo u otra wallet que reciba Lightning? ¿Qué hito les parece justo?
4. Verificar técnicamente que Lemon/Belo reciben Lightning hoy (pago de 100 sats).

**Criterio de decisión**:
- ≥2 "sí" con monto concreto → ir con Tramo y citar en Q&A ("dos sponsors ya se comprometieron a…" — sólo si es verdad).
- 0 "sí" pero varios "sí, si fuera en pesos" → mantener la demo Lightning (ajuste al evento) y decir en Q&A que el piloto evaluará un riel en pesos.
- Si ningún estudiante tiene cómo recibir Lightning y las apps locales no lo soportan → priorizar el voucher QR en la demo.

## Próximas 24 horas
1. Confirmar inscripción del equipo (bloqueante).
2. Enviar el mail a contacto@labitconf.com (doc 02 §6).
3. Lanzar el primer experimento.
4. Abrir la cuenta Blink y hacer un pago de prueba de 100 sats con preimage (spike descartable).
5. Decidir si se actualiza o se despublica la landing.
