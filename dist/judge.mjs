import {initScholarship} from './scholarship-ui.mjs';
initScholarship();
const button=document.querySelector('#start-timer'),output=document.querySelector('#demo-timer'),status=document.querySelector('#timer-status');
let interval=null,deadline=0;
function draw(){const seconds=Math.max(0,Math.ceil((deadline-performance.now())/1000));output.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');if(seconds===0){clearInterval(interval);interval=null;button.textContent='Reiniciar ensayo';status.textContent='Terminó el minuto. Pasá a las preguntas del jurado.';}}
button.addEventListener('click',()=>{if(interval){clearInterval(interval);interval=null;output.textContent='00:55';button.textContent='Iniciar ensayo';status.textContent='Ensayo restablecido.';return;}deadline=performance.now()+55000;status.textContent='Ensayo de 55 segundos en curso. Los controles de la demo siguen siendo manuales.';button.textContent='Restablecer cronómetro';draw();interval=setInterval(draw,250);});
