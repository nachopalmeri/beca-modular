# Respaldo local de Beca Modular

Esta copia contiene la demo sintética y los archivos que necesita. No incluye mapas externos, datos personales, pagos ni conexión a una institución. Los enlaces internos de la demo vuelven al índice de esta copia (`index.html`); la landing completa ya no es necesaria para la demo.

## Requisito

Node.js instalado. No hace falta internet, build ni instalar paquetes.

## Arranque

1. Extraé `beca-demo-offline.zip` en una carpeta.
2. Abrí PowerShell o una terminal dentro de esa carpeta.
3. Ejecutá `node server.mjs`.
4. Abrí `http://127.0.0.1:4178/demo.html` en el navegador.
5. En **Pago Lightning**, generá el QR SIMULADO, confirmá el fondeo de prueba, aprobá un hito y devolvé el saldo no usado. El QR no es una factura BOLT11, no se puede pagar desde una wallet y no mueve fondos.
6. En el simulador anterior, elegí **Iniciar demo · 2 aportes ficticios**, registrá una **Constancia institucional de prueba** y reintentá el comprobante para mostrar el rechazo de una repetición.

El servidor escucha sólo en la propia computadora. Para cerrarlo, volvé a la terminal y presioná Ctrl+C.
