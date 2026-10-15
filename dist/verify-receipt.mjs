import {readFile} from 'node:fs/promises';
import {verifyPublicReceipt} from './scholarship.mjs';
const [file,flag,fingerprint]=process.argv.slice(2);
if(!file||flag!=='--trusted-fingerprint'||!fingerprint){console.error('Uso: node verify-receipt.mjs comprobante.json --trusted-fingerprint HUELLA_COMPLETA');process.exitCode=2;}
else{try{const proof=JSON.parse(await readFile(file,'utf8'));const result=await verifyPublicReceipt(proof,fingerprint);console.log('Firma ECDSA válida para la autoridad de prueba fijada.');console.log('Programa: '+result.claim.programId+' | Hito: '+result.claim.milestone+' | Importe firmado: '+result.claim.amount+' centavos simulados.');console.log('Verifica una atestación histórica; no demuestra pago, inscripción, nota ni saldo real. La contabilidad adjunta no está firmada.');}catch(error){console.error('RECHAZADO: '+error.message);process.exitCode=1;}}
