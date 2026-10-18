// Original choreography. Every pose is a function of scroll, so reversing is exact.
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
export function openingPose(progress) {
  const p = clamp(progress);
  if (p < .12) { const t = ease(p / .12); return { phase:'enter', x:mix(-1,0,t), ground:24, shadow:1, lift:mix(22,0,t), tilt:mix(-12,0,t), left:0, right:mix(-70,0,t), stride:0, opacity:t }; }
  if (p < .5) { const t = (p-.12)/.38, step = Math.sin(t*Math.PI*12); return { phase:'walk', x:t*.82, ground:24, shadow:1-Math.abs(step)*.15, lift:-Math.abs(step)*8, tilt:step*3, left:step*20, right:-step*20, stride:step*22, opacity:1 }; }
  if (p < .68) { const t = (p-.5)/.18, arc=Math.sin(t*Math.PI); return { phase:'hop', x:mix(.82,1,ease(t)), ground:mix(24,0,ease(t)), shadow:1-arc*.65, lift:-arc*64, tilt:arc*-9, left:mix(0,-35,ease(t)), right:mix(0,-30,ease(t)), stride:arc*-16, opacity:1 }; }
  if (p < .87) { const t = ease((p-.68)/.19); return { phase:'rest', x:1, ground:0, shadow:1, lift:0, tilt:mix(0,-8,t), left:mix(-35,12,t), right:mix(-30,-48,t), stride:0, opacity:1 }; }
  const t = ease((p-.87)/.13);
  return { phase:'exit', x:mix(1,2,t), ground:0, shadow:1-t, lift:-t*18, tilt:mix(-8,4,t), left:mix(12,-20,t), right:mix(-48,-65,t), stride:Math.sin(t*Math.PI*4)*18, opacity:1-t };
}

let puppetId = 0;
function addPuppet(figure) {
  const image = figure.querySelector('img');
  if (!image || figure.querySelector('.brote-puppet')) return;
  const rig = document.createElement('span');
  rig.className = 'brote-puppet';
  rig.setAttribute('aria-hidden','true');
  const shade = 'brote-paper-' + (++puppetId);
  // Leaf shoes and paper arms belong to Brote; no reference-site asset is used.
  rig.innerHTML = `<svg class="brote-limbs" viewBox="0 0 240 280" aria-hidden="true" focusable="false"><defs><linearGradient id="${shade}" x2="1" y2="1"><stop stop-color="#fff2d6"/><stop offset="1" stop-color="#c5b58b"/></linearGradient></defs><g class="brote-leg brote-leg-left"><path d="M96 194 Q76 218 86 250"/><path class="brote-shoe" d="M88 243 Q64 240 57 259 Q86 270 103 256Z"/></g><g class="brote-leg brote-leg-right"><path d="M151 194 Q171 221 160 250"/><path class="brote-shoe" d="M158 243 Q181 239 190 259 Q165 271 146 256Z"/></g><g class="brote-arm brote-arm-left"><path d="M68 109 Q43 124 39 153 Q31 170 41 174 Q48 177 52 161 Q60 145 79 137Z" fill="url(#${shade})"/></g><g class="brote-arm brote-arm-right"><path d="M175 112 Q199 125 201 151 Q213 166 203 174 Q194 178 190 160 Q182 144 164 139Z" fill="url(#${shade})"/></g></svg>`;
  image.before(rig);
  rig.append(image);
}
function limbs(figure, pose) {
  figure.style.setProperty('--brote-arm-left',pose.left+'deg');
  figure.style.setProperty('--brote-arm-right',pose.right+'deg');
  figure.style.setProperty('--brote-stride',pose.stride+'deg');
}
export function renderBroteChapter(visual, progress, index, moving) {
  const figure=visual.querySelector('.story-mascot');
  const step=moving?Math.sin(progress*Math.PI*12):0;
  const actions=['wave','point','guide','rest'];
  figure.dataset.broteAction=actions[index];
  visual.style.setProperty('--brote-walk-x',moving?(progress*10)+'%':'0%');
  visual.style.setProperty('--brote-lift',(-Math.abs(step)*5)+'px');
  visual.style.setProperty('--brote-tilt',(index===3?-8:step*3)+'deg');
  limbs(figure,{left:index===1?-55:step*18,right:index===0?-55+step*18:index===2?-35:0,stride:step*20});
}
export function mountBroteStory() {
  document.querySelectorAll('.story-mascot,.brote-opening-mascot').forEach(addPuppet);
  const root=document.querySelector('.brote-opening'), stage=root?.querySelector('.brote-opening-stage'), figure=root?.querySelector('.brote-opening-mascot'), word=root?.querySelector('[data-brote-landing]');
  if(!root||!stage||!figure||!word)return;
  const media=matchMedia('(min-width: 900px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)');
  const shadow=document.createElement('span');
  shadow.className='brote-contact-shadow';shadow.setAttribute('aria-hidden','true');stage.append(shadow);
  const ending=root.querySelector('[data-brote-reveal]');
  let scheduled=false;
  function render(){
    scheduled=false;root.classList.toggle('is-animated',media.matches);
    if(!media.matches){figure.style.transform='';figure.style.opacity='';figure.dataset.broteAction='static';ending?.style.removeProperty('--brote-reveal');return;}
    const section=root.getBoundingClientRect(), frame=stage.getBoundingClientRect(), anchor=word.getBoundingClientRect();
    const top=scrollY+section.top-88, travel=Math.max(1,root.offsetHeight-stage.offsetHeight), progress=clamp((scrollY-top)/travel), pose=openingPose(progress);
    const width=figure.offsetWidth,height=figure.offsetHeight;
    const landing=Math.max(24,Math.min(frame.width-width-24,anchor.left-frame.left+anchor.width*.45-width*.35));
    const start=Math.max(24,landing-Math.min(400,frame.width*.35));
    // Entry/exit clear the viewport; the middle path lands on the measured word.
    const x=pose.x<0?mix(-width,start,pose.x+1):pose.x>1?mix(landing,frame.width,pose.x-1):mix(start,landing,pose.x);
    // Inline boxes include font leading; align shoes with the visible capitals.
    const contact=anchor.top-frame.top+parseFloat(getComputedStyle(word).fontSize)*.44;
    const y=contact-height*.95+pose.ground+pose.lift;
    figure.style.transform=`translate3d(${x}px,${y}px,0) rotate(${pose.tilt}deg)`;
    figure.style.opacity=String(pose.opacity);figure.dataset.broteAction=pose.phase;figure.dataset.broteProgress=progress.toFixed(4);limbs(figure,pose);
    shadow.style.transform=`translate3d(${x+width*.5}px,${contact+pose.ground}px,0) scaleX(${pose.shadow})`;
    shadow.style.opacity=String(pose.opacity*pose.shadow*.35);
    ending?.style.setProperty('--brote-reveal',String(.7+.3*ease((progress-.12)/.38)));
  }
  const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(render);}};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});media.addEventListener('change',request);render();
}
