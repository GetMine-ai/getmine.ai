// @ts-nocheck
// getmine.ai site interactivity. Verbatim port of the original three inline
// <script> blocks (hero canvas + waitlist/beta/CTA flows), consolidated into a
// single module to preserve their shared-scope semantics. Inline on* handlers
// are re-exposed on window at the end (ES modules are scoped, classic scripts were not).

// ── LOGOS ────────────────────────────────────────────────────────
const L={
 you:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0A2828"/><circle cx="32" cy="24" r="11" fill="#1DDEC8"/><path d="M10 58C10 44 54 44 54 58" fill="#1DDEC8"/></svg>`,
 family:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0A2015"/><circle cx="20" cy="26" r="8" fill="#4CD680"/><circle cx="36" cy="24" r="10" fill="#1DDEC8"/><circle cx="50" cy="28" r="6" fill="#4CD680" opacity=".7"/><path d="M6 56C6 44 32 44 32 56" fill="#4CD680" opacity=".7"/><path d="M20 56C20 42 52 42 52 56" fill="#1DDEC8" opacity=".7"/></svg>`,
 nhsapp:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#005EB8"/><text x="32" y="43" text-anchor="middle" font-size="23" font-weight="900" fill="white" font-family="Arial Black,sans-serif">NHS</text></svg>`,
 nhsgp:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#00692A"/><rect x="26" y="34" width="12" height="3" rx="1.5" fill="white"/><rect x="30.5" y="28" width="3" height="12" rx="1.5" fill="white"/><text x="32" y="24" text-anchor="middle" font-size="8.5" fill="rgba(255,255,255,.6)" font-family="Arial,sans-serif">NHS GP</text></svg>`,
 privgp:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0D2B16"/><text x="32" y="30" text-anchor="middle" font-size="10" font-weight="500" fill="#4CD680" font-family="Arial,sans-serif">Private</text><text x="32" y="47" text-anchor="middle" font-size="20" font-weight="900" fill="white" font-family="Arial Black,sans-serif">GP</text></svg>`,
 spec:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1E0A38"/><text x="32" y="27" text-anchor="middle" font-size="8.5" fill="#A78BFA" font-family="Arial,sans-serif">Specialist</text><rect x="24" y="34" width="16" height="3" rx="1.5" fill="#A78BFA"/><rect x="30.5" y="28" width="3" height="14" rx="1.5" fill="#A78BFA"/></svg>`,
 axa:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#C8102E"/><text x="32" y="44" text-anchor="middle" font-size="28" font-weight="900" fill="white" font-family="Arial Black,sans-serif">AXA</text></svg>`,
 bupa:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0033A0"/><text x="32" y="42" text-anchor="middle" font-size="21" font-weight="900" fill="white" font-family="Arial Black,sans-serif">BUPA</text></svg>`,
 apple:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#F0F0F0"/><path d="M32 46C20 39 15 29 18 20C21 12 28 13 32 18C36 13 43 12 46 20C49 29 44 39 32 46Z" fill="#FF3B30"/><path d="M32 17C32 13 34 10 37 10C34 14 33 16 32 17Z" fill="#CC2B20"/></svg>`,
 oura:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#141416"/><circle cx="32" cy="32" r="16" fill="none" stroke="#C8A96E" stroke-width="5"/><circle cx="32" cy="32" r="6" fill="#C8A96E"/></svg>`,
 garmin:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#003865"/><text x="32" y="47" text-anchor="middle" font-size="36" font-weight="900" fill="white" font-family="Arial Black,sans-serif">G</text></svg>`,
 whoop:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#111"/><path d="M14 20L24 44L32 30L40 44L50 20" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 fitbit:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#00B0B9"/><circle cx="32" cy="21" r="4.5" fill="white"/><circle cx="32" cy="43" r="4.5" fill="white"/><circle cx="19" cy="32" r="3.5" fill="white" opacity=".7"/><circle cx="45" cy="32" r="3.5" fill="white" opacity=".7"/><circle cx="22" cy="21" r="2.5" fill="white" opacity=".4"/><circle cx="42" cy="21" r="2.5" fill="white" opacity=".4"/></svg>`,
 polar:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#C8000A"/><text x="32" y="42" text-anchor="middle" font-size="19" font-weight="900" fill="white" font-family="Arial Black,sans-serif">POLAR</text></svg>`,
 zoe:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#E64A19"/><text x="32" y="43" text-anchor="middle" font-size="24" font-weight="900" fill="white" font-family="Arial Black,sans-serif">ZOE</text></svg>`,
 skinme:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#8B1B5F"/><text x="32" y="30" text-anchor="middle" font-size="13" font-weight="600" fill="white" font-family="Arial,sans-serif">Skin</text><text x="32" y="48" text-anchor="middle" font-size="15" font-weight="700" fill="#FFB3D9" font-family="Arial,sans-serif">+Me</text></svg>`,
 thriva:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#3B0764"/><text x="32" y="47" text-anchor="middle" font-size="37" font-weight="900" fill="white" font-family="Arial Black,sans-serif">T</text></svg>`,
 medichecks:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#004F9F"/><text x="32" y="45" text-anchor="middle" font-size="30" font-weight="900" fill="white" font-family="Arial Black,sans-serif">M</text></svg>`,
 nuffield:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#004B2D"/><text x="32" y="30" text-anchor="middle" font-size="11" font-weight="600" fill="white" font-family="Arial,sans-serif">Nuffield</text><text x="32" y="46" text-anchor="middle" font-size="10" fill="rgba(255,255,255,.5)" font-family="Arial,sans-serif">Health</text></svg>`,
 chatgpt:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0D9373"/><circle cx="32" cy="29" r="13" fill="none" stroke="white" stroke-width="2.5" opacity=".85"/><text x="32" y="34" text-anchor="middle" font-size="12" font-weight="700" fill="white" font-family="Arial,sans-serif">GPT</text></svg>`,
 claude:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#C96640"/><text x="32" y="31" text-anchor="middle" font-size="13" font-weight="400" fill="white" font-family="Georgia,serif" font-style="italic">Claude</text><text x="32" y="46" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,.48)" font-family="Arial,sans-serif">Anthropic</text></svg>`,
 gemini:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0D0D1F"/><defs><linearGradient id="gm2" x1="20" y1="10" x2="44" y2="54"><stop offset="0%" stop-color="#4285F4"/><stop offset="50%" stop-color="#34A853"/><stop offset="100%" stop-color="#FBBC04"/></linearGradient></defs><path d="M32 10C32 10 39 24 48 32C39 40 32 54 32 54C32 54 25 40 16 32C25 24 32 10 32 10Z" fill="url(#gm2)"/></svg>`,
 perplexity:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#180D2E"/><path d="M32 14L16 24V38L24 42V34L32 38L40 34V42L48 38V24Z" fill="#7B61FF"/><rect x="24" y="34" width="16" height="12" rx="1.5" fill="#7B61FF"/></svg>`,
 copilot:`<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0A0A0A"/><rect x="13" y="13" width="16" height="16" rx="3.5" fill="#F25022"/><rect x="35" y="13" width="16" height="16" rx="3.5" fill="#7FBA00"/><rect x="13" y="35" width="16" height="16" rx="3.5" fill="#00A4EF"/><rect x="35" y="35" width="16" height="16" rx="3.5" fill="#FFB900"/></svg>`,
};
const LI={};
Object.keys(L).forEach(k=>{const i=new Image();i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(L[k]);i.onload=()=>LI[k]=i;});

// ── WAVES CONFIG ─────────────────────────────────────────────────
const WAVES=[
 {ico:'🏥',eye:'Wave 1',title:'NHS & primary care',gate:12,add:22,
  sub:'The NHS App connects your GP history, blood results, medications, and vaccinations in one place.',
  trust:true, multi:true,
  items:[{id:'nhsapp',label:'NHS App',logo:'nhsapp',glow:'#4BA3E3'},{id:'nhsgp',label:'NHS GP',logo:'nhsgp',glow:'#4CD680'}]},
 {ico:'💼',eye:'Wave 2',title:'Private healthcare',gate:34,add:18,sub:'Your private records, connected and controlled by you.',multi:true,
  items:[{id:'privgp',label:'Private GP',logo:'privgp',glow:'#4CD680'},{id:'spec',label:'Specialist',logo:'spec',glow:'#A78BFA'},{id:'axa',label:'AXA Health',logo:'axa',glow:'#FF6B6B'},{id:'bupa',label:'Bupa',logo:'bupa',glow:'#4BA3E3'}]},
 {ico:'⌚',eye:'Wave 3',title:'Wearables & trackers',gate:52,add:20,sub:'Mina reads your sleep, activity, and recovery data from every device.',multi:true,
  items:[{id:'apple',label:'Apple Health',logo:'apple',glow:'#FF3B30'},{id:'oura',label:'Oura Ring',logo:'oura',glow:'#C8A96E'},{id:'garmin',label:'Garmin',logo:'garmin',glow:'#4BA3E3'},{id:'whoop',label:'Whoop',logo:'whoop',glow:'#aaa'},{id:'fitbit',label:'Fitbit',logo:'fitbit',glow:'#00B0B9'},{id:'polar',label:'Polar',logo:'polar',glow:'#FF4040'}]},
 {ico:'🔬',eye:'Wave 4',title:'Health services',gate:72,add:16,sub:'Test results, skin care, nutrition data, all in one place.',multi:true,
  items:[{id:'zoe',label:'Zoe',logo:'zoe',glow:'#FF7043'},{id:'skinme',label:'Skin+Me',logo:'skinme',glow:'#F472B6'},{id:'thriva',label:'Thriva',logo:'thriva',glow:'#A78BFA'},{id:'medichecks',label:'Medichecks',logo:'medichecks',glow:'#60A5FA'},{id:'nuffield',label:'Nuffield Health',logo:'nuffield',glow:'#4CD680'}]},
 {ico:'🤖',eye:'Wave 5',title:'AI tools you already use',gate:88,add:12,sub:'When Mina has built your health story, every AI tool you use gets better.',multi:true,
  items:[{id:'chatgpt',label:'ChatGPT',logo:'chatgpt',glow:'#10A37F'},{id:'claude',label:'Claude',logo:'claude',glow:'#C96640'},{id:'gemini',label:'Gemini',logo:'gemini',glow:'#4285F4'},{id:'perplexity',label:'Perplexity',logo:'perplexity',glow:'#7B61FF'},{id:'copilot',label:'Copilot',logo:'copilot',glow:'#0078D4'}]},
 {ico:'🫶',eye:'Wave 0',title:'Just you, or your family too?',gate:100,add:0,sub:'Mina can build and manage a health account for everyone you care for.',multi:false,
  items:[{id:'you',label:'Just me',logo:'you',glow:'#1DDEC8'},{id:'family',label:'Me + family',logo:'family',glow:'#4CD680'}]},
];

// ── ANIMATION STATE ──────────────────────────────────────────────
let t=0,mSc=1.45,mTSc=1.45,mYf=.42,mTYf=.42;
let comp=0,compT=0,compAnim;
let orb=[],fly=[];
let selectedIds=new Set();
// ── HEALTH WORLD CONSTELLATION ───────────────────────────────────
const wlCv=document.getElementById('wl-cv');
const wlCtx=wlCv.getContext('2d');
let WL_W,WL_H,WL_CX,WL_CY;

function resizeWL(){
  WL_W=wlCv.width=window.innerWidth;
  WL_H=wlCv.height=window.innerHeight;
  WL_CX=WL_W/2; WL_CY=WL_H/2;
}
resizeWL();
window.addEventListener('resize',resizeWL);

// Nodes definition
const HW_NODES=[
  {label:'',icon:'person',glow:'#1DDEC8',angle:0,r:0,alpha:0,px:0,py:0,tx:0,ty:0,active:false},
  {label:'',icon:'nhs',glow:'#005EB8',angle:0,r:0,alpha:0,px:0,py:0,tx:0,ty:0,active:false},
  {label:'',icon:'shield',glow:'#4CD680',angle:0,r:0,alpha:0,px:0,py:0,tx:0,ty:0,active:false},
  {label:'',icon:'insurance',glow:'#A78BFA',angle:0,r:0,alpha:0,px:0,py:0,tx:0,ty:0,active:false},
  {label:'',icon:'wearable',glow:'#F59E0B',angle:0,r:0,alpha:0,px:0,py:0,tx:0,ty:0,active:false},
];
const NODE_ANGLES=[Math.PI*1.5, Math.PI*1.9, Math.PI*0.3, Math.PI*0.9, Math.PI*1.2];
const NODE_R=160;
let hwSpin=0;

function fireNode(i,label){
  const nd=HW_NODES[i];
  nd.label=label; nd.active=true;
  nd.angle=NODE_ANGLES[i];
  nd.tx=WL_CX+Math.cos(nd.angle)*NODE_R;
  nd.ty=WL_CY+Math.sin(nd.angle)*NODE_R;
  nd.px=WL_CX; nd.py=WL_CY;
  nd.alpha=0; nd.r=0;
  // spring animation
  let startT=Date.now();
  function spring(){
    const p=Math.min(1,(Date.now()-startT)/600);
    const ease=1-Math.pow(1-p,4);
    nd.px=WL_CX+(nd.tx-WL_CX)*ease;
    nd.py=WL_CY+(nd.ty-WL_CY)*ease;
    nd.alpha=ease;
    nd.r=ease;
    if(p<1)requestAnimationFrame(spring);
  }
  requestAnimationFrame(spring);
  // pulse glow
  setTimeout(()=>{nd.r=1.3;setTimeout(()=>{nd.r=1;},300);},620);
}

function drawNodeIcon(ctx,x,y,icon,alpha){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.beginPath();
  ctx.arc(x,y,22,0,Math.PI*2);
  ctx.fillStyle='rgba(6,12,20,0.9)';
  ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.15)';
  ctx.lineWidth=1.5;
  ctx.stroke();
  ctx.font='bold 12px DM Sans,sans-serif';
  ctx.fillStyle='#F0F4F8';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  const labels={person:'You',nhs:'NHS',shield:'Private',insurance:'Insured',wearable:'Wearable'};
  ctx.fillStyle=icon==='nhs'?'#FFFFFF':icon==='wearable'?'#F59E0B':icon==='insurance'?'#A78BFA':icon==='shield'?'#4CD680':'#1DDEC8';
  ctx.fillText(labels[icon]||'',x,y);
  ctx.restore();
}

function drawHW(){
  wlCtx.clearRect(0,0,WL_W,WL_H);
  hwSpin+=0.004;
  // ambient dust
  for(let i=0;i<40;i++){
    const a=i/40*Math.PI*2+hwSpin*.3;
    const r=80+Math.sin(i*2.1+t)*60;
    const x=WL_CX+Math.cos(a)*r*2.5, y=WL_CY+Math.sin(a)*r*2.5;
    wlCtx.beginPath();wlCtx.arc(x,y,0.8,0,Math.PI*2);
    wlCtx.fillStyle=`rgba(29,222,200,${0.03+Math.sin(i+t)*.015})`;wlCtx.fill();
  }
  // connection lines
  HW_NODES.forEach(nd=>{
    if(!nd.active||nd.alpha<0.05)return;
    wlCtx.beginPath();wlCtx.moveTo(WL_CX,WL_CY);wlCtx.lineTo(nd.px,nd.py);
    wlCtx.strokeStyle=`rgba(29,222,200,${0.18*nd.alpha})`;wlCtx.lineWidth=1;wlCtx.stroke();
    // glow around node
    const gc=nd.glow;
    const rr=parseInt(gc.slice(1,3),16),gg=parseInt(gc.slice(3,5),16),bb=parseInt(gc.slice(5,7),16);
    const g=wlCtx.createRadialGradient(nd.px,nd.py,0,nd.px,nd.py,40*nd.r);
    g.addColorStop(0,`rgba(${rr},${gg},${bb},${0.2*nd.alpha})`);g.addColorStop(1,'transparent');
    wlCtx.beginPath();wlCtx.arc(nd.px,nd.py,40*nd.r,0,Math.PI*2);wlCtx.fillStyle=g;wlCtx.fill();
    drawNodeIcon(wlCtx,nd.px,nd.py,nd.icon,nd.alpha);
    // label
    wlCtx.save();wlCtx.globalAlpha=nd.alpha*.7;
    wlCtx.font="300 10px 'DM Sans',sans-serif";
    wlCtx.fillStyle='rgba(240,244,248,0.55)';
    wlCtx.textAlign='center';wlCtx.textBaseline='top';
    wlCtx.fillText(nd.label,nd.px,nd.py+28);
    wlCtx.restore();
  });
  // The M. mark at centre — the mascot was retired (branding ruling, 2026-07-07)
  // and the mark replaces it. Drawn upright, never spun: it is a signature, not
  // a character.
  const minaY=WL_CY-120;
  wlCtx.save();wlCtx.translate(WL_CX,minaY);
  wlCtx.beginPath();wlCtx.arc(0,0,34,0,Math.PI*2);
  wlCtx.fillStyle='#0B1420';wlCtx.fill();
  wlCtx.lineWidth=1;wlCtx.strokeStyle='rgba(232,250,248,0.14)';wlCtx.stroke();
  wlCtx.font="italic 400 32px Georgia, 'Times New Roman', serif";
  wlCtx.textAlign='center';wlCtx.textBaseline='middle';
  wlCtx.fillStyle='#E8FAF8';wlCtx.fillText('M',-4,2);
  wlCtx.fillStyle='#1DBFB0';wlCtx.fillText('.',14,2);
  wlCtx.restore();
  // centre glow
  const cg=wlCtx.createRadialGradient(WL_CX,minaY,0,WL_CX,minaY,70);
  cg.addColorStop(0,'rgba(29,222,200,0.1)');cg.addColorStop(1,'transparent');
  wlCtx.beginPath();wlCtx.arc(WL_CX,minaY,70,0,Math.PI*2);wlCtx.fillStyle=cg;wlCtx.fill();
}

// ── ACCESS REQUEST ───────────────────────────────────────────────
// Astro exposes only PUBLIC_* variables to browser code. Keeping the base
// here makes the website endpoint configurable without duplicating URLs.
// Sign-ups go straight to Brevo's double-opt-in list (ruled 2026-07-26): Brevo
// owns intake, so no route of ours ever accepts an email address from the open
// internet. Posted from here rather than with Brevo's own embed script, so no
// third-party code or fonts load on getmine.ai — the visitor's browser only ever
// contacts Brevo at the moment they choose to submit.
const WAITLIST_ENDPOINT=String(
  import.meta.env.PUBLIC_WAITLIST_ENDPOINT
  ||'https://f3cde459.sibforms.com/serve/MUIFAPkIttg9_w9drKl1pUH19xvaHSB6th2O_Uk7AMjGv6Yks09ls0EtOJ6n5sYr_dL_TrtArIYmoXK4dIp-183Oxac9u5FLhBTU7DZX1lAwkdefJAlLv7e0yqZMIq_grAsEXXYEqFPnRr8llU_6kHz5oT1mLU6xrIyqIABJ9a6NgG8lPR-YTOe3vNY7_OOFVmmb_PYkuekUN62fXw==',
).trim();
const MOBILE_MQ='(max-width: 880px)';
const ACCESS_COPY={
  label:'GetMine open beta',
  invalid:'Enter a valid email address.',
  network:'We couldn’t send your request. Check your connection and try again.',
  rateLimited:'Too many attempts. Please wait a moment and try again.',
  pending:'Sending…',
  submit:'Join the waiting list',
};
const ACCESS_IN_FLIGHT={hw:false,mw:false};

let activeAccessModal:HTMLElement|null=null;
let accessReturnFocus:HTMLElement|null=null;

function accessTriggers(){
  return Array.from(document.querySelectorAll<HTMLElement>('[onclick*="openWaitlist"]'));
}

function setAccessExpanded(expanded:boolean){
  accessTriggers().forEach(trigger=>{
    trigger.setAttribute('aria-controls','waitlist mobile-waitlist');
    trigger.setAttribute('aria-expanded',String(expanded));
  });
}

function beginAccessModal(modal:HTMLElement){
  accessReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  activeAccessModal=modal;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  setAccessExpanded(true);
  document.body.style.overflow='hidden';
}

function endAccessModal(modal:HTMLElement){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  if(activeAccessModal===modal) activeAccessModal=null;
  setAccessExpanded(false);
  document.body.style.overflow='';
  const returnTarget=accessReturnFocus;
  accessReturnFocus=null;
  returnTarget?.focus();
}

function modalFocusables(modal:HTMLElement){
  const selector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  return Array.from(modal.querySelectorAll<HTMLElement>(selector)).filter(el=>{
    const style=window.getComputedStyle(el);
    return style.display!=='none'&&style.visibility!=='hidden';
  });
}

document.addEventListener('keydown',event=>{
  const modal=activeAccessModal;
  if(!modal) return;
  if(event.key==='Escape'){
    event.preventDefault();
    modal.id==='mobile-waitlist'?closeMobileWaitlist():closeWaitlist();
    return;
  }
  if(event.key!=='Tab') return;
  const focusable=modalFocusables(modal);
  if(focusable.length===0){
    event.preventDefault();
    modal.focus();
    return;
  }
  const first=focusable[0];
  const last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){
    event.preventDefault();
    last.focus();
  } else if(!event.shiftKey&&document.activeElement===last){
    event.preventDefault();
    first.focus();
  }
});

async function postAccess(email:string){
  try{
    // Brevo's own field names. `email_address_check` is their honeypot: it must
    // be present and empty — bots fill it, people never see it.
    const body=new FormData();
    body.append('EMAIL',email);
    body.append('email_address_check','');
    body.append('locale','en');
    const response=await fetch(WAITLIST_ENDPOINT,{method:'POST',body});
    if(response.status===429) return 'rate-limited';
    if(!response.ok) return 'network';
    return 'ok';
  } catch{
    return 'network';
  }
}

function validEmail(input:HTMLInputElement){
  const value=input.value.trim();
  return input.validity.valid&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function submitAccess(prefix:'hw'|'mw'){
  const email=document.getElementById(`${prefix}-email`) as HTMLInputElement|null;
  const status=document.getElementById(`${prefix}-error`);
  const submit=document.getElementById(`${prefix}-submit`) as HTMLButtonElement|null;
  if(!email||!status||!submit) return;

  status.textContent='';
  if(!validEmail(email)){
    status.textContent=ACCESS_COPY.invalid;
    email.focus();
    return;
  }
  if(ACCESS_IN_FLIGHT[prefix]) return;

  ACCESS_IN_FLIGHT[prefix]=true;
  submit.disabled=true;
  const originalLabel=submit.textContent;
  submit.textContent=ACCESS_COPY.pending;

  const result=await postAccess(email.value.trim());
  ACCESS_IN_FLIGHT[prefix]=false;
  submit.disabled=false;
  submit.textContent=originalLabel||ACCESS_COPY.submit;

  if(result==='rate-limited'){
    status.textContent=ACCESS_COPY.rateLimited;
    return;
  }
  if(result==='network'){
    status.textContent=ACCESS_COPY.network;
    return;
  }

  if(prefix==='mw'){
    _mwShowStage('mw-stage-done');
    const modal=document.getElementById('mobile-waitlist');
    if(modal) modal.scrollTop=0;
  } else {
    document.getElementById('hw-capture')?.classList.remove('active');
    document.getElementById('hw-done')?.classList.add('active');
  }
}

function submitDesktopAccessRequest(){
  return submitAccess('hw');
}

function startHW(){
  HW_NODES.forEach(nd=>{nd.active=false;nd.alpha=0;});
  const capture=document.getElementById('hw-capture');
  capture?.classList.add('active');
  document.getElementById('hw-done')?.classList.remove('active');
  const error=document.getElementById('hw-error');
  if(error) error.textContent='';
  const label=document.getElementById('hw-label');
  if(label) label.textContent=ACCESS_COPY.label;
  const submit=document.getElementById('hw-submit') as HTMLButtonElement|null;
  if(submit){submit.disabled=false;submit.textContent=ACCESS_COPY.submit;}
}

function openWaitlist(){
  if(window.matchMedia?.(MOBILE_MQ).matches){
    openMobileWaitlist();
    return;
  }
  const modal=document.getElementById('waitlist');
  if(!modal) return;
  startHW();
  beginAccessModal(modal);
  setTimeout(()=>document.getElementById('hw-email')?.focus(),250);
}

// ── MOBILE WAITLIST ──────────────────────────────────────────────
function _mwShowStage(id){
  document.querySelectorAll('#mobile-waitlist .mw-stage').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id);
  if(el) el.classList.add('active');
}
// Pause/resume the hero video — even though the overlay covers it visually,
// browsers keep decoding video frames in hidden elements, which burns mobile
// CPU/battery while the user is in the waitlist form.
function _pauseBackgroundMedia(pause:boolean){
  document.querySelectorAll<HTMLVideoElement>('video').forEach(v=>{
    if(pause){
      // Remember whether it was playing so we can resume only those that were.
      (v as any)._wasPlaying = !v.paused;
      v.pause();
    } else if((v as any)._wasPlaying){
      v.play().catch(()=>{ /* autoplay rules may block — ignore */ });
      (v as any)._wasPlaying = false;
    }
  });
}

function openMobileWaitlist(){
  _mwShowStage('mw-stage-form');
  const ov=document.getElementById('mobile-waitlist');
  if(!ov) return;
  beginAccessModal(ov);
  _pauseBackgroundMedia(true);
  const err=document.getElementById('mw-error'); if(err) err.textContent='';
  const btn=document.getElementById('mw-submit') as HTMLButtonElement|null;
  if(btn){btn.disabled=false;btn.textContent=ACCESS_COPY.submit;}
  setTimeout(()=>document.getElementById('mw-email')?.focus(),250);
}
function closeMobileWaitlist(){
  const ov=document.getElementById('mobile-waitlist');
  if(!ov) return;
  endAccessModal(ov);
  _pauseBackgroundMedia(false);
}

// ── MOBILE MENU DRAWER ──────────────────────────────────────────
function openMobileMenu(){
  const mm=document.getElementById('mobile-menu');
  const hamburger=document.querySelector('.nav-hamburger');
  if(!mm) return;
  mm.classList.add('open');
  mm.setAttribute('aria-hidden','false');
  if(hamburger) hamburger.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeMobileMenu(){
  const mm=document.getElementById('mobile-menu');
  const hamburger=document.querySelector('.nav-hamburger');
  if(!mm) return;
  mm.classList.remove('open');
  mm.setAttribute('aria-hidden','true');
  if(hamburger) hamburger.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
async function submitMobileWaitlist(){
  return submitAccess('mw');
}

// ── HEX HELPER ───────────────────────────────────────────────────
function hx(h){const n=parseInt(h.replace('#',''),16);return[(n>>16)&255,(n>>8)&255,n&255];}

// ── HERO CANVAS — ambient orbs only, no Mina ─────────────────────
const heroCv=document.getElementById('hero-cv'), hCtx=heroCv.getContext('2d');
let HW2,HH2,HCX,HCY;
function resizeHero(){HW2=heroCv.width=heroCv.offsetWidth;HH2=heroCv.height=heroCv.offsetHeight;HCX=HW2/2;HCY=HH2/2;}
resizeHero();window.addEventListener('resize',resizeHero);
const heroOrbs=Array.from({length:65},()=>({a:Math.random()*Math.PI*2,r:60+Math.random()*400,sp:(Math.random()-.5)*.0022,sz:.5+Math.random()*1.3,op:.025+Math.random()*.085,ph:Math.random()*Math.PI*2}));
function drawHero(){
  hCtx.clearRect(0,0,HW2,HH2);
  heroOrbs.forEach(d=>{d.a+=d.sp;const p=Math.sin(t*.75+d.ph)*.22+.78;hCtx.beginPath();hCtx.arc(HCX+Math.cos(d.a)*d.r,HCY+Math.sin(d.a)*d.r,d.sz*p,0,Math.PI*2);hCtx.fillStyle=`rgba(29,222,200,${d.op*p})`;hCtx.fill();});
  const g=hCtx.createRadialGradient(HCX,HCY,0,HCX,HCY,Math.min(HW2,HH2)*.48);g.addColorStop(0,'rgba(29,222,200,.035)');g.addColorStop(1,'transparent');hCtx.beginPath();hCtx.arc(HCX,HCY,Math.min(HW2,HH2)*.48,0,Math.PI*2);hCtx.fillStyle=g;hCtx.fill();
}

// ── MINA DRAW (Design D — calm agent, no antennas) ───────────────


// ── MAIN RAF LOOP ─────────────────────────────────────────────────
function tick(){
  t+=0.016;
  drawHero();
  if(document.getElementById('waitlist').classList.contains('open'))drawHW();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function closeWaitlist(){
  const modal=document.getElementById('waitlist');
  if(modal) endAccessModal(modal);
}

// ── HERO MEMORY CARDS — sync to the video's actual currentTime, no drift ──
(function(){
  const video=document.querySelector('.hero-phone-video');
  if(!video) return;
  // Each card's visibility window (in seconds, matching video beats)
  const schedule=[
    {sel:'.hero-cue-a', from:1.8,  to:7.0},
    {sel:'.hero-cue-b', from:8.0,  to:13.5},
    {sel:'.hero-cue-c', from:16.0, to:24.0},
    {sel:'.hero-cue-d', from:25.0, to:29.0},
  ];
  const els=schedule.map(s=>({...s, el:document.querySelector(s.sel)})).filter(s=>s.el);
  function tick(){
    const t=video.currentTime;
    els.forEach(s=>s.el.classList.toggle('is-visible', t>=s.from && t<=s.to));
  }
  video.addEventListener('timeupdate', tick);
  video.addEventListener('seeking', tick);
  video.addEventListener('play', tick);
  tick();
})();

// ── NAV SCROLL (background-blur trigger only) ─────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scroll',window.scrollY>40);
});

// ── REVEAL ON SCROLL (IntersectionObserver — Tier-1 motion) ───────
if('IntersectionObserver' in window){
  const revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  },{threshold:.15,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal, .reveal-stagger, .constellation-hub').forEach(el=>revealObs.observe(el));
}else{
  // Fallback: show everything immediately
  document.querySelectorAll('.reveal, .reveal-stagger, .constellation-hub').forEach(el=>el.classList.add('in'));
}

// ── SCROLL TO SECTION ─────────────────────────────────────────────
function scrollToSection(id){
  const el=document.getElementById(id);
  if(!el)return;
  const navH=document.getElementById('nav')?.offsetHeight||80;
  // Scroll INTO the section past most of its top-padding, so the eyebrow lands
  // just below the nav with a small breathing gap (instead of section's outer edge
  // landing there and the eyebrow being ~144px lower)
  const sectionPadTop=parseFloat(getComputedStyle(el).paddingTop)||0;
  const breathing=32;
  const top=el.getBoundingClientRect().top+window.scrollY+sectionPadTop-navH-breathing;
  window.scrollTo({top,behavior:'smooth'});
}

// Scroll reveal on load
window.dispatchEvent(new Event('scroll'));


// ── Re-expose inline on* handler entry points on window ──
setAccessExpanded(false);
Object.assign(window, {
  openWaitlist,
  closeWaitlist,
  scrollToSection,
  submitDesktopAccessRequest,
  openMobileWaitlist,
  closeMobileWaitlist,
  submitMobileWaitlist,
  openMobileMenu,
  closeMobileMenu,
});
