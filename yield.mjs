// Hypothetical simple interest. No RPC, custody, trading, or real protocol rates.
export function projectYield(a) {
 const keys=['capital','months','reserve','rate','cost','loss'];
 for(const key of keys) if(!Number.isFinite(a[key])) throw new RangeError('Completá todos los valores con números válidos.');
 if(a.capital<0||a.capital>1e8||!Number.isInteger(a.months)||a.months<1||a.months>24||a.reserve<0||a.reserve>100||a.rate< -20||a.rate>30||a.cost<0||a.cost>1e6||a.loss<0||a.loss>100) throw new RangeError('Revisá los límites de los supuestos.');
 if(!['fund','student','split'].includes(a.recipient)) throw new RangeError('Destino no válido.');
 const exposure=a.capital*(1-a.reserve/100), rows=[];
 let gross=0;
 for(let i=0;i<a.months;i++) {
  const opening=exposure*(1-i/a.months), interest=opening*a.rate/100/12;
  gross+=interest; rows.push({month:i+1,opening,interest});
 }
 const loss=exposure*a.loss/100, net=gross-a.cost-loss, positive=Math.max(0,net);
 const student=a.recipient==='student'?positive:a.recipient==='split'?positive/2:0;
 return {exposure,gross,loss,net,student,fund:positive-student,shortfall:Math.max(0,-net),rows};
}
const options={
 cash:{label:'PUNTO DE PARTIDA DEL MVP',state:'Sin búsqueda de rendimiento',title:'Reserva líquida para los desembolsos.',description:'Mantener el presupuesto disponible evita agregar un protocolo de inversión al primer MVP. No produce intereses por sí mismo; siguen existiendo riesgos del activo, custodia y red.',source:'No hay rendimiento modelado para esta alternativa.',risk:'Disponibilidad según custodia y red; riesgo de pérdida de paridad o bloqueo del activo.',fit:'Primero demostrar autorización de hitos, pago al alumno y manejo del remanente. Sin prometer capital garantizado.',url:'docs/yield-strategy.md'},
 aave:{label:'CANDIDATO PARA UN SPIKE',state:'Interés variable',title:'Aave: aportar liquidez a un mercado de préstamos.',description:'El saldo autorizado se aporta a un pool. Los préstamos generan intereses variables para los proveedores de liquidez. El escrow necesitaría controlar la posición y retirar antes de pagar.',source:'Intereses de prestatarios; la tasa cambia con utilización y parámetros del mercado.',risk:'Contratos, stablecoin, deuda incobrable y liquidez. Retirar depende de fondos disponibles; una tasa alta no garantiza poder pagar a tiempo.',fit:'Probar un activo y una red EVM, sin pedir préstamos ni usar apalancamiento. No está integrado; validar direcciones, permisos y mercado concreto.',url:'https://aave.com/help/supplying/supply-tokens'},
 savings:{label:'ALTERNATIVA DE TESORERÍA',state:'Depende del producto',title:'Sky / Spark: ahorro de protocolo y vaults.',description:'Evaluar sUSDS y los productos Spark por separado. Sus fuentes, operadores, activos y reglas varían. No basta con comprar una stablecoin para asumir que está generando rendimiento.',source:'Sky Savings Rate según condiciones del protocolo; Spark documenta distintos vaults, algunos con asignaciones mediante su Liquidity Layer.',risk:'Contratos, gobernanza, activos subyacentes, conversiones y disponibilidad de retiros. Tasas no garantizadas; puede recibirse menos de lo depositado.',fit:'Comparar el producto exacto y su ruta de retiro. No mezclar productos bajo una sola etiqueta de riesgo. Extensión posterior al escrow básico.',url:'https://docs.spark.finance/products/spark-savings'},
 morpho:{label:'ALTERNATIVA CON MÁS DECISIONES DE RIESGO',state:'Vault y curador específicos',title:'Morpho: vaults con políticas de asignación.',description:'Un vault asigna capital mediante adaptadores habilitados por su curador. Puede facilitar una estrategia, pero agrega decisiones y roles que Beca Modular debe evaluar.',source:'Intereses y otras fuentes aprobadas por la estrategia. Las comisiones de gestión y desempeño reducen el resultado del depositante.',risk:'Deuda incobrable, oráculos, contratos, liquidez y poderes de curador/owner. Dos vaults Morpho pueden tener exposiciones muy distintas.',fit:'Comparar asignación, comisiones y liquidez antes de elegir. No recomendar un vault por el APY de portada. No implementado.',url:'https://docs.morpho.org/learn/resources/risks/'},
 rwa:{label:'INVESTIGACIÓN / FUERA DEL MVP',state:'Derechos y acceso por verificar',title:'Activos tokenizados: el token no explica los derechos.',description:'Investigar instrumentos de deuda o fondos y distinguirlos de exposición a acciones. Robinhood Classic Stock Tokens son contratos derivados, no acciones en propiedad. No asumimos acceso desde Argentina ni una API abierta para nuestra tesorería.',source:'Depende del instrumento: interés de deuda, distribuciones o ajustes contractuales. Una acción o exposición tokenizada también puede perder valor.',risk:'Emisor, custodia, mercado, regulación, elegibilidad y rescates. Un dividendo eventual no garantiza la devolución del capital de una beca.',fit:'No usar exposición accionaria para respaldar pagos educativos prometidos. Falta seleccionar un instrumento elegible y verificar acceso e integración.',url:'https://robinhood.com/eu/en/support/articles/about-stock-tokens/'},
 creator:{label:'APORTE EXTERNO / NO INVERSIÓN DEL PRINCIPAL',state:'Ingresos no previsibles',title:'Creator fees: un aporte voluntario al fondo.',description:'Pump documenta reparto de comisiones del creador entre direcciones configuradas. Un creador podría destinar parte al fondo educativo si el mecanismo y sus permisos lo admiten. No necesitamos emitir ni comprar un memecoin.',source:'Comisiones de trading efectivamente acumuladas. No son intereses sobre la beca, dividendos de empresas ni pagos automáticos a todos los holders.',risk:'Volumen especulativo, continuidad del creador, permisos y reputación. No hay creador asociado ni ingresos comprometidos para Beca Modular.',fit:'Contabilizar como donación adicional al recibirse. Nunca prometer becas futuras contra volumen de trading. Reutilizar código requiere revisar la licencia del componente.',url:'https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md'}
};
export function initYield() {
 const $=s=>document.querySelector(s), form=$('#yield-form'); if(!form)return;
 const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 document.querySelectorAll('[data-yield-option]').forEach(button=>button.addEventListener('click',()=>{
  const o=options[button.dataset.yieldOption];
  document.querySelectorAll('[data-yield-option]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  for(const key of ['label','state','title','description','source','risk','fit'])$('#yield-'+key).textContent=o[key];
  $('#yield-reference').href=o.url;$('#yield-reference').textContent='Ver documentación y límites ↗';
 }));
 function render(){
  const a=Object.fromEntries(new FormData(form));for(const k of ['capital','months','reserve','rate','cost','loss'])a[k]=a[k]===''?NaN:Number(a[k]);
  try{
   const r=projectYield(a);$('#yield-error').hidden=true;
   for(const [id,value]of [['exposure',r.exposure],['gross',r.gross],['net',r.net],['drag',a.cost+r.loss]])$('#yield-'+id).textContent=money(value);
   $('#yield-distribution').textContent='Apoyo adicional al estudiante: '+money(r.student)+' · Futuras becas: '+money(r.fund)+'.';
   $('#yield-warning').textContent=r.shortfall>0?'Déficit del escenario: '+money(r.shortfall)+'. No se reparte rendimiento. Falta definir quién cubre la pérdida; este modelo no garantiza los desembolsos.':'Distribución hipotética después de costos. No incluye todas las pérdidas ni demuestra liquidez real. La selección de protocolo no cambia los supuestos del cálculo.';
   const ledger=$('#yield-ledger');ledger.replaceChildren();
   const head=document.createElement('div');head.className='ledger-head';for(const t of ['MES','INVERTIDO AL INICIO','INTERÉS DEL MES']){const span=document.createElement('span');span.textContent=t;head.append(span);}ledger.append(head);
   for(const row of r.rows){const div=document.createElement('div');for(const t of [String(row.month),money(row.opening),money(row.interest)]){const span=document.createElement('span');span.textContent=t;div.append(span);}ledger.append(div);}
  }catch(e){$('#yield-error').hidden=false;$('#yield-error').textContent=e.message;for(const id of ['exposure','gross','net','drag'])$('#yield-'+id).textContent='—';$('#yield-distribution').textContent='Cálculo suspendido: corregí los datos.';$('#yield-warning').textContent='';$('#yield-ledger').replaceChildren();}
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',render);form.addEventListener('change',render);
 $('#yield-stress').addEventListener('click',()=>{form.elements.loss.value='5';render();});
 $('#yield-default').addEventListener('click',()=>{form.reset();render();});render();
}
