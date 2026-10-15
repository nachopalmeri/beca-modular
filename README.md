# Beca Modular — web de propuesta y roadmap

Web previa a LABITCONF EDU2026. Explica becas por materia con financiación completa o compartida, hitos académicos y devolución proporcional del saldo pendiente. La implementación funcional con Sepolia se planifica para las48h del evento.

## Ver la web

    node server.mjs

Abrir http://127.0.0.1:4178. demo.html es un simulador CONCEPTUAL con importes ficticios. No conecta wallets, cobra aportes, valida notas ni transfiere fondos.

## Recorrido

1. Una persona aporta100USD deejemplo, o varios completan la meta desde1USD.
2. Dos exámenes configurados liberan50/50USD ficticios.
3. Una revisión pausa nuevos tramos. Abandono confirmado devuelve sólo saldo pendiente proporcionalmente.
4. Lo ya ganado queda estudiante.60+40, liberado50 => devuelve30+20.

## Archivos

- index.html: producto, reglas, mapas/video, arquitectura planificada y roadmap.
- demo.html + funding-model.mjs + roadmap.mjs: simulador conceptual y lógica de centavos.
- laboratorio.html + app.js: exploraciones anteriores preservadas, MPP/finanzas/rendimiento/firma local.
- respaldo.html + scholarship.mjs + scholarship-ui.mjs + judge.mjs: pruebaECDSA local con autoridad sintética; no es pagoSepolia.
- contracts/: herramientas de desarrollo instaladas con autorización, sin contrato implementado.
- docs/product-strategy.md, docs/architecture.md: fuente de verdad actual.
- docs/hackathon/kit-presentacion.md y readiness.md: guion, pruebas previstas y pendientes.

## Comprobaciones locales

    node --test tests/funding.test.mjs tests/scholarship.test.mjs tests/model.test.mjs tests/yield.test.mjs

Los tests prueban modelos locales. No prueban un escrow, una institución real ni resultados de mercado. El browser test histórico en tests/browser.cjs corresponde al laboratorio y requiere revisar la etiqueta de cada prueba antes de usarlo como evidencia actual.

## Próximo paso real

Confirmar inscripción/equipo, consigna/rúbrica y permiso de código previo/IA. En48h: contrato/token test enSepolia, roles, aportes, confirmación, desembolso, replay y refunds verificables. No ingresar claves privadas o datos académicos/personales enestaweb.
