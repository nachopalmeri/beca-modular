import {initialScholarship,createAttestor,signMilestone,releaseScholarship,pauseScholarship,reassignScholarship,publicKeyFingerprint} from './scholarship.mjs';
export async function initScholarship(root=document){
 const find=id=>root.querySelector('#'+id);
 const approve=find('scholar-approve'),pause=find('scholar-pause'),reassign=find('scholar-reassign'),reset=find('scholar-reset'),replay=find('scholar-replay'),tamper=find('scholar-tamper'),download=find('scholar-download');
 let state=initialScholarship(),authority=null,lastReceipt=null,fingerprint='',busy=false;
 const log=find('scholar-log');
 function event(message,type='info'){if(!log)return;const item=document.createElement('li');item.className='proof-event '+type;item.textContent=message;log.append(item);log.scrollTop=log.scrollHeight;}
 function render(message){
  find('scholar-paid').textContent=state.paid/100+' USD';find('scholar-left').textContent=state.remaining/100+' USD';find('scholar-reassigned').textContent=state.reassigned/100+' USD';
  approve.disabled=busy||!authority||state.status!=='active';pause.disabled=busy||!authority||state.status!=='active';if(reassign)reassign.disabled=busy||state.status!=='paused';reset.disabled=busy;
  if(replay)replay.disabled=busy||!lastReceipt;if(tamper)tamper.disabled=busy||!lastReceipt;if(download)download.disabled=busy||!lastReceipt;
  if(message)find('scholar-status').textContent=message;
  if(find('scholar-count'))find('scholar-count').textContent=state.receipts.length+' / 5 hitos';
  if(find('scholar-fingerprint'))find('scholar-fingerprint').textContent=fingerprint?fingerprint.slice(0,16)+'…':'Generando clave de prueba…';
  if(find('scholar-proof'))find('scholar-proof').textContent=lastReceipt?JSON.stringify({authorityFingerprint:fingerprint,attestation:lastReceipt},null,2):'Aprobá un hito para ver la atestación y su firma.';
 }
 async function run(operation){if(busy||!authority)return;busy=true;render();try{await operation();}catch(error){const message=error instanceof Error?error.message:'No se pudo completar la prueba.';event(message,'rejected');render(message);}finally{busy=false;render();}}
 approve.addEventListener('click',()=>run(async()=>{const receipt=await signMilestone(state,authority.privateKey);const next=await releaseScholarship(state,receipt,{trustedPublicKey:authority.publicKey});state=next;lastReceipt=receipt;const text='Hito '+state.receipts.length+': firma ECDSA verificada. Se asignan 20 USD simulados al estudiante.';event(text,'accepted');render(text);}));
 pause.addEventListener('click',()=>run(()=>{state=pauseScholarship(state);const text='Pausa solicitada. Los '+state.remaining/100+' USD pendientes siguen reservados; se bloquean nuevos tramos.';event(text);render(text);}));
 if(reassign)reassign.addEventListener('click',()=>run(()=>{state=reassignScholarship(state);const text='Escenario administrativo simulado: '+state.reassigned/100+' USD futuros reasignados. Los '+state.paid/100+' USD ya recibidos se conservan. No se verifica aquí un proceso real de apelación.';event(text);render(text);}));
 if(replay)replay.addEventListener('click',()=>run(async()=>{await releaseScholarship(state,lastReceipt,{trustedPublicKey:authority.publicKey});throw new Error('La prueba no rechazó el duplicado. Reiniciá antes de presentar.');}));
 if(tamper)tamper.addEventListener('click',()=>run(async()=>{const altered={...lastReceipt,claim:{...lastReceipt.claim,amount:lastReceipt.claim.amount+100}};await releaseScholarship(state,altered,{trustedPublicKey:authority.publicKey});throw new Error('La prueba no rechazó el importe alterado. Reiniciá antes de presentar.');}));
 if(download)download.addEventListener('click',()=>{if(!lastReceipt||busy)return;const receipt={format:'beca-modular-local-proof-v1',scope:'Atestación local con autoridad sintética; sin pago ni contrato en red.',publicKey:authority.publicJwk,authorityFingerprint:fingerprint,attestation:lastReceipt,accounting:{total:state.total,paid:state.paid,reserved:state.remaining,reassigned:state.reassigned,currency:'USD_SIMULATED',unit:'cents'}};const url=URL.createObjectURL(new Blob([JSON.stringify(receipt,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='beca-modular-comprobante.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);event('Comprobante público descargado. Contiene firma y clave pública; ninguna clave privada.');});
 async function initialize(){busy=true;authority=null;state=initialScholarship();lastReceipt=null;fingerprint='';if(log)log.replaceChildren();render('Preparando la autoridad de prueba…');try{const fresh=await createAttestor();const fp=await publicKeyFingerprint(fresh.publicJwk);authority=fresh;fingerprint=fp;state=initialScholarship();lastReceipt=null;if(log)log.replaceChildren();event('Programa local preparado: 100 USD simulados, cinco tramos de 20.');render('Beca activa. Clave de prueba lista. Ningún tramo liberado.');}catch{render('Este navegador no pudo iniciar WebCrypto. Usá Chrome o Edge actualizado sobre HTTPS o localhost.');}finally{busy=false;render();}}
 reset.addEventListener('click',()=>{if(!busy)initialize();});
 if(document.body.classList.contains('judge-page'))document.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select,button,a,summary'))return;const buttons={'1':approve,'2':replay,'3':tamper,'0':reset};const button=buttons[event.key];if(button&&!button.disabled){event.preventDefault();button.click();}});
 await initialize();
}
