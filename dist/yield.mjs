// Scenario model only: no RPC, custody, protocol quote, or real investment.
const policies = ['education', 'revolving', 'student', 'split', 'sponsor'];
const cents = n => Math.round((n + Number.EPSILON) * 100) / 100;

function validate(a) {
 const numeric = ['capital','obligations','months','payoutMonths','investmentPct','rate','cost','loss','delayDays','noticeDays','studentShare','awardAmount'];
 for (const key of numeric) if (!Number.isFinite(a[key])) throw new RangeError('Completá todos los supuestos con números válidos.');
 if (a.capital < 0 || a.capital > 1e8 || a.obligations < 0 || a.obligations > 1e8 || !Number.isInteger(a.months) || a.months < 1 || a.months > 24 || !Number.isInteger(a.payoutMonths) || a.payoutMonths < 1 || a.payoutMonths > a.months || a.investmentPct < 0 || a.investmentPct > 100 || a.rate < -100 || a.rate > 100 || a.cost < 0 || a.cost > 1e6 || a.loss < 0 || a.loss > 100 || a.delayDays < 0 || a.delayDays > 180 || a.noticeDays < 0 || a.noticeDays > 30 || a.studentShare < 0 || a.studentShare > 100 || Math.round(a.awardAmount * 100) < 1 || a.awardAmount > 1e8) throw new RangeError('Revisá los límites de los supuestos.');
 if (!policies.includes(a.recipient)) throw new RangeError('Destino no válido.');
}

/**
 * Conservative screening model. Student commitments are excluded from the
 * investable amount unless the explicit unsafe stress switch is enabled.
 * The delay test treats a position as unavailable at every due date whenever
 * exitDelay > noticeDays; this is intentionally conservative, not a protocol
 * simulator. Returns are simple, non-compounded scenario assumptions.
 */
export function projectYield(a) {
 validate(a);
 const surplus = Math.max(0, a.capital - a.obligations);
 const investable = a.exposeCommitted ? a.capital : surplus;
 const investment = investable * a.investmentPct / 100;
 const liquidStart = a.capital - investment;
 const capitalLoss = investment * a.loss / 100;
 let position = investment - capitalLoss;
 let gross = 0;
 let liquid = liquidStart;
 let paidOnTime = 0;
 let arrears = 0;
 let peakArrears = 0;
 const totalCents = Math.round(a.obligations * 100);
 const baseCents = Math.floor(totalCents / a.payoutMonths);
 const extraCents = totalCents - baseCents * a.payoutMonths;
 const dueMonths = new Set(Array.from({length:a.payoutMonths},(_,i)=>Math.ceil((i+1)*a.months/a.payoutMonths)));
 const installmentByMonth = new Map();
 let installmentNumber = 0;
 for (let month=1; month<=a.months; month++) if (dueMonths.has(month)) {
  installmentNumber++;
  installmentByMonth.set(month,(baseCents+(installmentNumber<=extraCents?1:0))/100);
 }
 const rows = [];
 const exitOnTime = a.delayDays <= a.noticeDays;

 for (let month = 1; month <= a.months; month++) {
  const openingPosition = position;
  gross += openingPosition * a.rate / 100 / 12;
  const installment = installmentByMonth.get(month);
  if (installment === undefined) continue;
  if (exitOnTime && liquid < installment + arrears) {
   const redemption = Math.min(position, installment + arrears - liquid);
   position -= redemption;
   liquid += redemption;
  }
  const before = liquid;
  const arrearsBefore = arrears;
  const due = installment + arrears;
  const paid = Math.min(liquid, due);
  liquid -= paid;
  arrears = due - paid;
  const paidCurrent = Math.min(installment, Math.max(0, paid - arrearsBefore));
  paidOnTime += paidCurrent;
  peakArrears = Math.max(peakArrears, arrears);
  rows.push({month, openingPosition, installment, liquidBefore:before, paidOnTime:paidCurrent, arrears});
 }

 const net = gross - a.cost - capitalLoss;
 const distributable = Math.max(0, net);
 let student;
 if (a.recipient === 'student') student = distributable;
 else if (a.recipient === 'split') student = distributable * a.studentShare / 100;
 else student = 0;
 const education = ['education','revolving'].includes(a.recipient) ? distributable : a.recipient === 'split' ? distributable - student : 0;
 // Sponsor-directed policy keeps the return in a restricted education-program
 // budget; it is not revenue paid to the sponsor personally.
 const program = a.recipient === 'sponsor' ? distributable : 0;
 // Award equivalents are compared in integer cents so floating point noise
 // (e.g. 199.99999999997 / 100) cannot hide a whole scholarship.
 const educationCents = Math.round((education + Number.EPSILON) * 100);
 const awardCents = Math.round(a.awardAmount * 100);
 const potentialAwards = Math.floor(educationCents / awardCents);
 const remainingEducation = cents((educationCents - potentialAwards * awardCents) / 100);
 const totalCapitalAfterStress = Math.max(0, a.capital - capitalLoss - a.cost + Math.min(0,gross));
 const capitalTopUp = Math.max(0, a.obligations - totalCapitalAfterStress);
 const dueDateTopUp = Math.max(0, a.obligations - paidOnTime);
 return {surplus, investment, liquidStart, capitalLoss, remainingPosition:position, gross:cents(gross), net:cents(net), distributable:cents(distributable), student:cents(student), education:cents(education), program:cents(program), potentialAwards, remainingEducation, totalCapitalAfterStress:cents(totalCapitalAfterStress), capitalTopUp:cents(capitalTopUp), paidOnTime:cents(paidOnTime), dueDateTopUp:cents(dueDateTopUp), peakArrears:cents(peakArrears), exitOnTime, rows};
}

export function stressScenarios(a) {
 const cases = [
  ['Base hipotético', {}],
  ['Rendimiento cero', {rate:0}],
  ['Tasa negativa', {rate:-2}],
  ['Pérdida de capital 5%', {loss:5}],
  ['Pérdida de capital 10%', {loss:10}],
  ['Costos elevados', {cost:Math.max(a.cost, a.capital * 0.03)}],
  ['Retiro 45 días / aviso 14', {delayDays:45, noticeDays:14}],
  ['Retiro 90 días / aviso 14', {delayDays:90, noticeDays:14}],
  ['Todo vence en un mes', {payoutMonths:1}],
  ['Sin excedente libre', {obligations:a.capital, exposeCommitted:false}]
 ];
 return cases.map(([name, patch]) => {
  const result = projectYield({...a, ...patch});
  return {name, invested:result.investment, net:result.net, paidOnTime:result.paidOnTime, topUp:result.dueDateTopUp, status:result.dueDateTopUp > 0 ? 'Riesgo de atraso / fondeo' : 'Compromisos cubiertos en este escenario'};
 });
}

const options={
 cash:{label:'BASE SEGURA PARA EL MVP',state:'Sin inversión del capital comprometido',title:'Primero se protege cada tramo prometido.',description:'La opción de partida es mantener líquidos y segregados todos los pagos comprometidos al estudiante. La simulación solo considera invertir un excedente no comprometido y autorizado; la custodia, paridad del activo y disponibilidad de red siguen teniendo riesgos.',source:'No se proyecta rendimiento para el saldo reservado a becas.',risk:'La reserva líquida evita sumar riesgo de retiro DeFi, pero no elimina custodia, emisor, congelamiento, paridad ni fallos de red.',fit:'Mejor punto de partida para probar la beca por hitos. No requiere mezclar una inversión con la autorización académica.',url:'docs/yield-strategy.md'},
 aave:{label:'CANDIDATO PARA SPIKE FUTURO',state:'Interés variable de préstamos',title:'Aave: la tasa refleja demanda de liquidez.',description:'El rendimiento proviene de intereses pagados por prestatarios. La tasa cambia y el retiro solo es posible hasta la liquidez disponible en el mercado. No equivale a una tasa fija ni garantiza un pago educativo en fecha.',source:'Interés de prestatarios; tasa y disponibilidad dependen del mercado y la reserva exactos.',risk:'Contrato, activo, oráculo, depeg, liquidez y red. Integración EVM aparte del prototipo Solana actual.',fit:'Probar un único activo y retiro completo en testnet/fork antes de evaluar. No integrado y no recomendado para cuotas comprometidas.',url:'https://aave.com/help/supplying/supply-tokens'},
 savings:{label:'PRODUCTOS DIFERENTES: ANALIZAR POR SEPARADO',state:'Tasa variable / salidas distintas',title:'Sky Savings y Spark Vault no son intercambiables.',description:'sUSDS depende de la tasa de ahorro gobernada por Sky; Spark puede asignar activos mediante su Liquidity Layer y sus retiros grandes pueden tener una fase de solicitud/ejecución. La ruta concreta define el riesgo.',source:'Fuentes, activos, operadores y reglas de retiro específicos de cada producto y versión.',risk:'Contrato, gobernanza, paridad de USDS/USDC, estrategia subyacente y posible retiro asíncrono. Ninguna documentación reemplaza una prueba de salida.',fit:'Investigar producto, red y elegibilidad exactos. No usar un APY de portada para calendarizar cuotas.',url:'https://docs.spark.finance/integrators/spark-vaults-v2'},
 morpho:{label:'MÁS GOBERNANZA Y SELECCIÓN',state:'Vault, adaptador y salida específicos',title:'Morpho: el riesgo vive en cada política de vault.',description:'En Vault V2, las vistas ERC-4626 max* genéricas devuelven cero: el integrador debe calcular capacidad con estado fresco y revisar gates. La salida normal considera activos idle y el adaptador de liquidez, no todas las posiciones.',source:'Intereses de prestatarios menos costos; depende de la estrategia y mercados habilitados.',risk:'Liquidez, oráculos, deuda, contratos, curador, adaptador y gates. Una salida in-kind cambia exposición, pero no crea liquidez del activo base.',fit:'Nombrar vault, adaptadores, red y ruta; validar capacidad con SDK/estado fresco y probar el retiro real antes de exponer cualquier excedente.',url:'https://docs.morpho.org/developers/earn/tutorials/assets-flow/'},
 kamino:{label:'OPCIÓN SOLANA PARA INVESTIGAR',state:'Interés variable de préstamos',title:'Kamino KLend: una ruta del mismo ecosistema.',description:'El SDK TypeScript permite consultar mercados y construir instrucciones de depósito; proveedores ganan intereses de prestatarios. No convierte automáticamente un canal MPP en una vault de becas.',source:'Interés de préstamos; la tasa y retiro dependen del reserve exacto.',risk:'Liquidez del reserve, programa y precio del token. SDK MIT no significa que el programa de lending sea MIT: revisar licencias por separado.',fit:'Puede reducir el cambio de ecosistema si se elige Solana, pero exige wallet, autorización y prueba de retirar antes de un vencimiento. No integrado.',url:'https://github.com/Kamino-Finance/klend-sdk'},
 rwa:{label:'NO ADECUADO COMO RESERVA DE CUOTAS',state:'Derechos, rescate y elegibilidad pendientes',title:'Tokenizar un activo no garantiza su liquidez.',description:'Bonos o fondos tokenizados pueden rendir desde instrumentos subyacentes, pero tienen emisor, elegibilidad, custodia y rescate propios. Los Robinhood Stock Tokens documentados son derivados, no propiedad directa de las acciones.',source:'Depende del instrumento y sus documentos; un dividendo o distribución no asegura principal.',risk:'Riesgo de mercado, contraparte, emisor, liquidez, jurisdicción y rescate. Una caída no puede transformarse en deuda del estudiante.',fit:'No respaldar pagos prometidos con acciones o activos cuya salida no se demostró. No hay acceso institucional argentino verificado.',url:'https://robinhood.com/eu/en/support/articles/about-stock-tokens/'},
 creator:{label:'INGRESO EXTERNO, NO RENDIMIENTO',state:'Volátil y no comprometido',title:'Creator fees: una donación posible, nunca una garantía.',description:'Pump documenta distribución de comisiones del creador entre direcciones configuradas. Eso reparte fees efectivamente generados por trading; no genera intereses sobre la beca, dividendos empresariales ni un derecho por holdear.',source:'Fees efectivamente acumulados y voluntariamente asignados por un creador.',risk:'Volumen especulativo, cambios de producto, permisos, volatilidad SOL y reputación. No hay creador ni acuerdo confirmado.',fit:'Contabilizar solo cuando se recibe y convierte; no emitir token ni depender de trading para financiar cuotas.',url:'https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md'}
};

export function initYield() {
 const $=s=>document.querySelector(s), form=$('#yield-form'); if(!form)return;
 const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 document.querySelectorAll('[data-yield-option]').forEach(button=>button.addEventListener('click',()=>{
  const o=options[button.dataset.yieldOption];
  document.querySelectorAll('[data-yield-option]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  for(const key of ['label','state','title','description','source','risk','fit'])$('#yield-'+key).textContent=o[key];
  $('#yield-reference').href=o.url;$('#yield-reference').textContent='Abrir fuente primaria / límites ↗';
 }));
 function render(){
  const raw=Object.fromEntries(new FormData(form));
  const a={};for(const k of ['capital','obligations','months','payoutMonths','investmentPct','rate','cost','loss','delayDays','noticeDays','studentShare','awardAmount'])a[k]=raw[k]===''?NaN:Number(raw[k]);
  a.recipient=raw.recipient;a.exposeCommitted=form.elements.exposeCommitted.checked;
  try{
   const r=projectYield(a),scenarios=stressScenarios(a);$('#yield-error').hidden=true;
   const values=[['surplus',r.surplus],['invested',r.investment],['liquid',r.liquidStart],['gross',r.gross],['net',r.net],['topup',r.dueDateTopUp],['capital-topup',r.capitalTopUp],['education-leftover',r.remainingEducation],['student-benefit-amount',r.student]];
   for(const [id,value]of values){const target=$('#yield-'+id);if(target)target.textContent=money(value);}
   $('#yield-education-awards').textContent=String(r.potentialAwards);
   const denominator=Math.max(a.capital,1);
   $('#yield-committed-bar').style.width=Math.min(100,a.obligations/denominator*100)+'%';
   $('#yield-free-bar').style.width=Math.min(100,r.surplus/denominator*100)+'%';
   $('#yield-return-bar').style.width=Math.max(0,Math.min(100,r.net/denominator*100))+'%';
   $('#yield-committed-value').textContent=`${money(a.obligations)} comprometidos${a.obligations>a.capital?` · brecha ${money(a.obligations-a.capital)}`:''}`;
   $('#yield-free-value').textContent=money(r.surplus);
   $('#yield-return-value').textContent=money(r.net);
   const recipientText={education:'100% para becas futuras del programa',revolving:'100% para un fondo rotatorio de nuevas becas',student:'100% como apoyo adicional para el estudiante',split:`${a.studentShare}% estudiante / ${100-a.studentShare}% futuras becas`,sponsor:'uso educativo predefinido para el programa'}[a.recipient];
   const outcome=r.distributable>0?`Resultado positivo estimado: ${money(r.distributable)}. Política elegida: ${recipientText}. Alumno: ${money(r.student)} · becas futuras: ${money(r.education)} · programa educativo restringido: ${money(r.program)}.`:`No hay resultado positivo distribuible. Pérdida y costos no se trasladan al alumno; la política no crea fondos.`;
   $('#yield-distribution').textContent=outcome;
   const studentBenefit=$('#student-benefit-choice');
   studentBenefit.hidden=r.student<=0;
   const benefitDescriptions={flex:'apoyo flexible adicional',approved:'un gasto educativo aprobado elegido por el estudiante',next:'sumarlo a una cuota futura, con consentimiento'};
   const benefitUse=$('#student-benefit-use').value;
   $('#student-benefit-preview').textContent=r.student>0?`${money(r.student)} disponibles como ${benefitDescriptions[benefitUse]}. La opción existe solo si el sponsor la autorizó antes de inscribir; es una vista simulada.`:'No hay bono neto positivo para asignar.';
   $('#yield-warning').textContent=a.exposeCommitted?'Modo de estrés: se permitió simular inversión de dinero comprometido. NO es una recomendación. Atraso máximo modelado: '+money(r.peakArrears)+'.':r.dueDateTopUp>0?'Incluso con excedente no comprometido, el escenario deja pagos en riesgo: se necesitarían '+money(r.dueDateTopUp)+' de cobertura adicional.':`Protección activa: inversión limitada al excedente de ${money(r.surplus)}. Cuotas puntuales en este cálculo: ${money(r.paidOnTime)} de ${money(a.obligations)}. El modelo supone retiros oportunos cuando el plazo de salida no supera el aviso (${a.noticeDays} días); protocolos reales no lo garantizan.`;
   const ledger=$('#yield-ledger');ledger.replaceChildren();
   const head=document.createElement('div');head.className='ledger-head';head.setAttribute('role','row');for(const t of ['VENCIMIENTO','INVERSIÓN ABIERTA','CUOTA','LIQUIDEZ PREVIA','ATRASO'] ){const span=document.createElement('span');span.setAttribute('role','columnheader');span.textContent=t;head.append(span);}ledger.append(head);
   for(const row of r.rows){const div=document.createElement('div');div.setAttribute('role','row');for(const t of [String(row.month),money(row.openingPosition),money(row.installment),money(row.liquidBefore),money(row.arrears)]){const span=document.createElement('span');span.setAttribute('role','cell');span.textContent=t;div.append(span);}ledger.append(div);}
   const table=$('#yield-stress-table');table.replaceChildren();
   const tableHead=document.createElement('div');tableHead.className='stress-row stress-head';tableHead.setAttribute('role','row');for(const t of ['Escenario','Invertido','Neto supuesto','Pagado a tiempo','Cobertura faltante']){const el=document.createElement('span');el.setAttribute('role','columnheader');el.textContent=t;tableHead.append(el);}table.append(tableHead);
   for(const row of scenarios){const div=document.createElement('div');div.className='stress-row';div.setAttribute('role','row');for(const t of [row.name,money(row.invested),money(row.net),money(row.paidOnTime),money(row.topUp)]){const span=document.createElement('span');span.setAttribute('role','cell');span.textContent=t;div.append(span);}table.append(div);}
  }catch(e){$('#yield-error').hidden=false;$('#yield-error').textContent=e.message;for(const id of ['surplus','invested','liquid','gross','net','topup','capital-topup','education-leftover','student-benefit-amount','committed-value','free-value','return-value']){const el=$('#yield-'+id);if(el)el.textContent='—';}$('#yield-education-awards').textContent='—';for(const id of ['committed-bar','free-bar','return-bar'])$('#yield-'+id).style.width='0%';$('#student-benefit-choice').hidden=true;$('#student-benefit-preview').textContent='';$('#yield-distribution').textContent='Cálculo suspendido: corregí los datos.';$('#yield-warning').textContent='';$('#yield-ledger').replaceChildren();$('#yield-stress-table').replaceChildren();}
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',render);form.addEventListener('change',render);
 $('#student-benefit-use').addEventListener('change',render);
 $('#yield-stress').addEventListener('click',()=>{form.elements.loss.value='5';form.elements.delayDays.value='45';form.elements.noticeDays.value='14';render();});
 $('#yield-default').addEventListener('click',()=>{form.reset();render();});render();
}
