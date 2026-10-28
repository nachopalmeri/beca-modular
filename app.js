import { initScholarship } from './scholarship-ui.mjs';
import { initYield } from './yield.mjs';
import { financial, scenarios, initialSession, transition } from './model.mjs';
const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
const usd = (n) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const num = (n) => new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(n);
const cents = (n) => (n/100).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
$('#menu').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));});
$$('#nav a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}));
const stages=[
 ['El sponsor financia el programa.','Define presupuesto, beneficiario, importe y calendario de cuotas, autoridad verificadora y reglas de pausa, apelación y saldo no comprometido.','Responsable: sponsor + administrador. El dinero educativo no es ingreso de la plataforma.'],
 ['La institución confirma la inscripción.','Una persona verifica requisitos y consentimiento con un proceso definido. No se decide elegibilidad con un puntaje automático.','Responsable: institución. Identidad y expediente académico quedan fuera de cadena.'],
 ['La institución certifica un hito.','Un firmante autorizado registra un resultado concreto; su firma prueba quién lo emitió, no que la calificación sea objetivamente correcta.','Responsable: evaluador humano. Debe existir corrección y apelación.'],
 ['El programa libera la cuota acordada.','Comprueba programa, wallet, importe, secuencia, vencimiento y nonce. Un hito usado no vuelve a habilitar otra cuota.','Responsable: contrato propuesto. La web actual solo simula esta operación.'],
 ['El estudiante puede pedir una pausa.','Se detienen nuevas cuotas mientras una persona revisa el caso. La pausa no recupera pagos ya hechos ni habilita reasignación automática.','Responsable: estudiante + administrador. Silencio no significa abandono.'],
 ['Se cierra el programa con reglas públicas.','El sponsor decide el saldo futuro no comprometido tras aviso y apelación. Solo el excedente expresamente autorizado puede considerarse para una estrategia aparte.','Responsable: sponsor + administrador. MVP sin inversión del principal.']
];
$$('[data-stage]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.stage);$$('[data-stage]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});$('#stage-number').textContent=String(i+1).padStart(2,'0');$('#stage-title').textContent=stages[i][0];$('#stage-copy').textContent=stages[i][1];$('#stage-trust').textContent=stages[i][2];}));
const roles={
 sponsor:{eyebrow:'SPONSOR DEMO / PROGRAMA DE BECAS',title:'Cada cuota tiene reglas visibles.',menu:'Mi programa',stats:[['Fondo ilustrativo','1.000 USD'],['Pagado al alumno','350 USD'],['Comprometido a futuro','650 USD']],rows:[['Hito académico 1','Verificado por institución','200 USD'],['Hito académico 2','Verificado por institución','150 USD'],['Cuotas futuras','Siguen reservadas','650 USD']],note:'Escenario conceptual. No refleja alumnos, fondos o pagos reales.'},
 student:{eyebrow:'ESTUDIANTE DEMO / BECA POR HITOS',title:'Sabés qué libera cada cuota.',menu:'Mi beca',stats:[['Beca asignada','100 USD'],['Recibido','20 USD'],['próxima cuota','20 USD']],rows:[['Hito 1','Aprobación de institución','Pagado'],['Hito 2','Pendiente de evaluación','En revisión'],['Pausa / apelación','Solicitar revisión humana','Disponible']],note:'El historial es una vista local de ejemplo. La institución conserva la responsabilidad académica.'},
 institution:{eyebrow:'INSTITUCIÓN DEMO / VERIFICACIÓN',title:'La firma habilita una sola cuota.',menu:'Hitos y revisión',stats:[['Programas','1 ilustrativo'],['Hitos para revisar','2'],['Repetidos rechazados','1 demo']],rows:[['Hito 2','Pendiente de revisión','Revisar'],['Hito 3','Aún no presentado','Pendiente'],['Clave de evaluación','Autorización propuesta','Fuera de cadena']],note:'La firma acredita el origen de la declaración, no su verdad independiente. Existe apelación humana.'},
 admin:{eyebrow:'ADMINISTRACIÓN DEMO / REVISIÓN HUMANA',title:'Reglas claras. Espacio para pausar.',menu:'Revisiones',stats:[['Estudiantes de ejemplo','10'],['Cupos en pausa','1'],['Casos en revisión','1']],rows:[['Pausa solicitada','No reasignar fondos comprometidos','Revisión'],['Catálogo','Precio y proveedor aceptados','Aprobado'],['Saldo educativo','350 entregado + 650 reservado','1.000 USD']],note:'La IA no determina elegibilidad ni abandono. El administrador documenta decisiones y apelaciones.'}
};
function renderRole(key){const r=roles[key];$('#role-eyebrow').textContent=r.eyebrow;$('#role-title').textContent=r.title;$('#role-menu').textContent=r.menu;$('#role-stats').innerHTML=r.stats.map(([label,value])=>`<div><small>${label}</small><strong>${value}</strong></div>`).join('');$('#role-content').innerHTML=r.rows.map(([label,detail,value])=>`<div class="mini-row"><span>${label}<br><small>${detail}</small></span><span class="mini-status">${value}</span></div>`).join('')+`<p class="source-note">${r.note}</p>`;}
$$('[data-role]').forEach(b=>b.addEventListener('click',()=>{$$('[data-role]').forEach(other=>{other.classList.toggle('active',other===b);other.setAttribute('aria-pressed',String(other===b));});renderRole(b.dataset.role);}));renderRole('sponsor');
let session=initialSession();let events=[];
function log(text,reject=false){events.push({text,reject});const li=document.createElement('li');li.textContent=text;if(reject)li.className='reject';if(events.length===1)$('#event-log').replaceChildren();$('#event-log').append(li);li.scrollIntoView({block:'nearest',behavior:'instant'});}
function renderSession(){const open=session.status==='open';$('#session-state').textContent=session.status==='idle'?'Sin abrir':session.status==='closed'?'Cerrada':session.paused?'En pausa':'Abierta';$('#authorized').textContent=cents(session.authorized);$('#remaining').textContent=cents(session.status==='closed'?0:session.cap-session.authorized);$('#fund-used').style.width=`${session.authorized/session.cap*100}%`;$('#open-session').disabled=session.status!=='idle';$('#pause-session').disabled=!open;$('#pause-session').textContent=session.paused?'Reanudar':'Pausar';$('#close-session').disabled=!open;$('#test-cap').disabled=!open||session.paused;$('#test-duplicate').disabled=!open||session.paused||session.units.length===0;$$('[data-unit]').forEach(b=>{b.disabled=!open||session.paused||session.units.includes(b.dataset.unit);b.querySelector('b span').textContent=session.units.includes(b.dataset.unit)?'✓':'+';});$('#settlement').hidden=session.status!=='closed';$('#settled').textContent=cents(session.settled)+' USDC';$('#returned').textContent=cents(session.returned)+' USDC';}
function act(action,description){try{session=transition(session,action);log(description);renderSession();}catch(error){log(error.message,true);}}
$('#open-session').addEventListener('click',()=>act({type:'open'},'Reserva ilustrativa abierta: límite 10,00 USDC.'));
$$('[data-unit]').forEach(b=>b.addEventListener('click',()=>act({type:'consume',id:b.dataset.unit,price:Number(b.dataset.price)},`Entrega de ejemplo ${b.dataset.unit}. Acumulado local: ${cents(session.authorized+Number(b.dataset.price))} USDC.`)));
$('#pause-session').addEventListener('click',()=>act({type:'pause'},session.paused?'Reanudación aprobada en la simulación.':'Pausa: no se autorizan nuevas unidades.'));
$('#close-session').addEventListener('click',()=>act({type:'close'},`Cierre local: ${cents(session.authorized)} al proveedor y ${cents(session.cap-session.authorized)} al fondo. Sin transacción de red.`));
$('#test-duplicate').addEventListener('click',()=>act({type:'consume',id:session.units[0],price:200},'Prueba de duplicado: el segundo intento debe rechazarse.'));
$('#test-cap').addEventListener('click',()=>act({type:'consume',id:'over-cap',price:1100},'Prueba de límite: el importe que excede el fondo debe rechazarse.'));
$('#reset-session').addEventListener('click',()=>{session=initialSession();events=[];$('#event-log').innerHTML='<li>Esperando autorización de ejemplo.</li>';renderSession();});renderSession();
const routes={data:{name:'Datos para dar el primer paso',units:['Consultar una tabla SQL','Filtrar y ordenar datos','Proyecto con revisión docente'],reason:'La consulta y el filtrado son prerrequisitos del proyecto. La evaluación final requiere una persona.'},web:{name:'Una primera página publicable',units:['Estructura semántica HTML','Diseño adaptable con CSS','Proyecto con revisión docente'],reason:'La estructura precede al diseño. La revisión del proyecto comprueba comprensión; abrir contenido no la sustituye.'},finance:{name:'Decisiones con un presupuesto claro',units:['Ingresos y gastos','Reservas y prioridades','Ejercicio con revisión docente'],reason:'El registro precede a la planificación. Esta ruta enseña conceptos generales y no recomienda inversiones.'}};
function recommend(){const r=routes[$('#learning-goal').value];const hours=Number($('#learning-time').value);$('#recommendation').innerHTML=`<span class="eyebrow">RUTA ILUSTRATIVA / REGLAS LOCALES</span><h3>${r.name}</h3><ol>${r.units.map(u=>`<li>${u}</li>`).join('')}</ol><p>${r.reason}</p><p>${hours===2?'Ritmo sugerido: una unidad por semana.':'Ritmo sugerido: hasta dos unidades por semana.'} Adaptalo con tu docente.</p><small>Catálogo aprobado de ejemplo · decisión final del estudiante · precio sujeto al programa.</small>`;}
$('#recommend').addEventListener('click',recommend);recommend();
function flow(){const n=Number($('#flow-milestones-range').value),paid=n*20,left=100-paid;$('#flow-completed-label').textContent=`${n} de 5`;$('#flow-paid').textContent=paid+' USD';$('#flow-return').textContent=left+' USD';$('#allocation-strip').innerHTML=Array.from({length:5},(_,i)=>`<i style="background:${i<n?'var(--mint)':'#263d30'}"></i>`).join('');$('#allocation-strip').setAttribute('aria-label',`${n} de 5 hitos aprobados; ${paid} dólares pagados y ${left} comprometidos`);}
$('#flow-milestones-range').addEventListener('input',flow);flow();
function readAssumptions(){return Object.fromEntries([...$('#finance-form').elements].filter(e=>e.name).map(e=>[e.name,e.valueAsNumber]));}
function financialTable(items,caption){return `<table><caption>${caption}</caption><thead><tr><th>Escenario</th><th>Cupos</th><th>Fondo educativo</th><th>Cuotas al estudiante</th><th>Ingreso plataforma</th><th>Costos directos</th><th>Resultado*</th></tr></thead><tbody>${items.map(([label,r])=>`<tr><td>${label}</td><td>${num(r.learners)}</td><td>${usd(r.allocated)}</td><td>${usd(r.payouts)}</td><td>${usd(r.revenue)}</td><td>${usd(r.cogs)}</td><td class="${r.result<0?'negative':'positive'}">${usd(r.result)}</td></tr>`).join('')}</tbody></table>`;}
function renderFinance(){const form=$('#finance-form');if(!form.checkValidity()){$('#finance-error').hidden=false;$('#profit-note').textContent='Resultados anteriores: no actualizados hasta corregir los valores.';return;}try{const a=readAssumptions();const r=financial(a);$('#finance-error').hidden=true;$('#profit').textContent=usd(r.result);$('#profit').className=r.result<0?'negative':'positive';$('#profit-note').textContent='Proyección hipotética · licencia + comisión aprobada − servicio − operación fija';const kpis=[['Cupos financiados',num(r.learners)],['Principal de becas',usd(r.allocated)],['Cuotas al alumno',usd(r.payouts)],['Facturación plataforma',usd(r.revenue)],['Contribución antes de fijos',usd(r.contribution)],['Saldo pendiente',usd(r.unused)]];$('#finance-kpis').innerHTML=kpis.map(([label,value])=>`<div><small>${label}</small><strong>${value}</strong></div>`).join('');$('#payout-bar').style.width=r.utilization+'%';$('#unused-bar').style.width=(100-r.utilization)+'%';$('#payout-value').textContent=usd(r.payouts);$('#unused-value').textContent=usd(r.unused);const bars=[['Licencia',r.subscriptionRevenue],['Comisión al sponsor',r.feeRevenue],['Pagos / FX',r.payment],['Infraestructura',r.infraCost],['IA opcional',r.aiCost],['Acompañamiento',r.supportCost],['Operación fija',r.fixed]];const max=Math.max(...bars.map(x=>x[1]),1);$('#cost-chart').innerHTML=bars.map(([label,value])=>`<div class="bar-row"><span>${label}</span><div class="bar-track"><span style="width:${value/max*100}%"></span></div><strong>${usd(value)}</strong></div>`).join('');$('#break-even').textContent=r.breakEven===null?'No alcanzable':num(r.breakEven);$('#sensitivity-table').innerHTML=financialTable([['Licencia −20%',financial({...a,subscription:a.subscription*.8})],['Supuestos actuales',r],['Soporte +50%',financial({...a,support:a.support*1.5})],['Cuotas +10 pp',financial({...a,utilization:Math.min(100,a.utilization+10)})]],'Sensibilidad sobre los supuestos actuales · resultado mensual después de fijos');}catch{$('#finance-error').hidden=false;}}
function applyScenario(key){for(const [name,value]of Object.entries(scenarios[key]))$('#finance-form').elements.namedItem(name).value=value;$$('[data-scenario]').forEach(b=>{b.classList.toggle('active',b.dataset.scenario===key);b.setAttribute('aria-pressed',String(b.dataset.scenario===key));});$('#scenario-name').textContent=`Escenario ${{conservative:'conservador',base:'base',optimistic:'optimista'}[key]} · hipotético`;renderFinance();}
$$('[data-scenario]').forEach(b=>b.addEventListener('click',()=>applyScenario(b.dataset.scenario)));
$('#finance-form').addEventListener('submit',e=>e.preventDefault());$('#finance-form').addEventListener('input',()=>{$$('[data-scenario]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});$('#scenario-name').textContent='Supuestos personalizados · hipotéticos';renderFinance();});
$('#scenario-table').innerHTML=financialTable(Object.entries(scenarios).map(([k,a])=>[{conservative:'Conservador',base:'Base',optimistic:'Optimista'}[k],financial(a)]),'Escenarios predefinidos · valores de referencia, independientes de tus cambios');applyScenario('base');
$('#copy-pitch').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#pitch-text').textContent);$('#copy-status').textContent=' Guion copiado.';}catch{$('#copy-status').textContent=' Seleccioná el texto del guion para copiarlo manualmente.';}});
let announceTimer;
new MutationObserver(()=>{clearTimeout(announceTimer);announceTimer=setTimeout(()=>{$('#financial-status').textContent=`Modelo actualizado. Resultado operativo mensual: ${$('#profit').textContent}. Proyección basada en supuestos.`;},350);}).observe($('#profit'),{childList:true});

// Academic scholarship demonstration: local state only, no grade verification or payment.
initScholarship();

initYield();

// Page-wide navigation and scroll feedback.
const header=$('.header');
const progress=document.createElement('div');
progress.className='scroll-progress';progress.setAttribute('role','presentation');
progress.innerHTML='<span></span>';document.body.append(progress);
let ticking=false;
function updateScroll(){
 const max=document.documentElement.scrollHeight-innerHeight;
 progress.firstElementChild.style.transform=`scaleX(${max>0?scrollY/max:0})`;
 header.classList.toggle('is-scrolled',scrollY>36);
 ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});
addEventListener('resize',updateScroll,{passive:true});updateScroll();

// Reveal smaller content blocks so long sections never move as a single layer.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
 }), {threshold: .12});
 $$('.split-heading,.section>h2,.three-cols>article,.video-feature,.stage-detail,.university-card,.openarg-map-card,.openarg-map-links>article,.product-window,.demo-grid,.protocol-flow,.money-flow,.ai-grid,.architecture,.pitch-grid,.closing>h2').forEach(block => {
  block.classList.add('reveal-on-scroll'); observer.observe(block);
 });
}
// Only the roadmap is a lateral narrative. FAQ and source links stay in readable grids.
$$('.roadmap').forEach((row,index) => {
 row.classList.add('horizontal-track'); row.id = 'roadmap-track-'+index;
 row.setAttribute('tabindex','0'); row.setAttribute('aria-label','Etapas del proyecto: desplazamiento horizontal');
 const controls=document.createElement('div'); controls.className='track-controls';
 const hint=document.createElement('span'); hint.textContent='Recorré las etapas';
 const previous=document.createElement('button'); previous.type='button'; previous.textContent='←'; previous.setAttribute('aria-label','Etapa anterior'); previous.setAttribute('aria-controls',row.id);
 const next=document.createElement('button'); next.type='button'; next.textContent='→'; next.setAttribute('aria-label','Etapa siguiente'); next.setAttribute('aria-controls',row.id);
 const status=document.createElement('span'); status.className='track-status'; status.setAttribute('aria-live','polite');
 controls.append(hint,previous,status,next); row.before(controls);
 function updateTrack(){const max=row.scrollWidth-row.clientWidth; previous.disabled=row.scrollLeft<2; next.disabled=row.scrollLeft>=max-2; status.textContent=String(Math.min(row.children.length,Math.round(row.scrollLeft/(row.firstElementChild.getBoundingClientRect().width+20))+1)).padStart(2,'0')+' / '+String(row.children.length).padStart(2,'0');}
 function advance(direction){row.scrollBy({left:direction*(row.firstElementChild.getBoundingClientRect().width+20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 previous.addEventListener('click',()=>advance(-1)); next.addEventListener('click',()=>advance(1));
 row.addEventListener('keydown',event=>{if(event.target===row&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();advance(event.key==='ArrowRight'?1:-1);}});
 row.addEventListener('scroll',updateTrack,{passive:true}); addEventListener('resize',updateTrack,{passive:true}); updateTrack();
});
