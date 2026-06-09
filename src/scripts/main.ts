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
  // Mina centre
  wlCtx.save();wlCtx.translate(WL_CX,WL_CY);wlCtx.rotate(hwSpin);
  drawMinaOn(wlCtx,0,0,1.6,t);wlCtx.restore();
  // centre glow
  const cg=wlCtx.createRadialGradient(WL_CX,WL_CY,0,WL_CX,WL_CY,70);
  cg.addColorStop(0,'rgba(29,222,200,0.1)');cg.addColorStop(1,'transparent');
  wlCtx.beginPath();wlCtx.arc(WL_CX,WL_CY,70,0,Math.PI*2);wlCtx.fillStyle=cg;wlCtx.fill();
}

// ── QUESTION LOGIC ────────────────────────────────────────────────
// ── WAITLIST CAPTURE ─────────────────────────────────────────────
// Google Apps Script Web App URL — paste the /exec URL after deploying.
const WAITLIST_ENDPOINT='https://script.google.com/macros/s/AKfycbx9H97Mv1t9HgSs4fn-vdiecye3PgmV_mIc5h7gZD4QALH3q87Ukg2tbjd9KOZZuP3Z/exec';
const HW_ANSWERS={};
const HW_QUESTION_KEYS=['q1_household','q2_nhs_app','q3_care_mix','q4_insurance','q5_wearables'];

let hwCurrentQ=0;
function selectOption(qIdx,label,icon){
  HW_ANSWERS[HW_QUESTION_KEYS[qIdx]]=label;
  // Mark selected
  const q=document.getElementById('hwq-'+qIdx);
  q.querySelectorAll('.hw-opt').forEach(b=>b.classList.remove('selected'));
  event.target.classList.add('selected');
  HW_NODES[qIdx].icon=icon;
  // Fire node
  fireNode(qIdx,label);
  // After brief pause, advance to next question
  setTimeout(()=>{
    q.classList.remove('active');
    if(qIdx+1<5){
      const next=document.getElementById('hwq-'+(qIdx+1));
      if(next){next.classList.add('active'); hwCurrentQ=qIdx+1;}
    } else {
      // All done — show capture
      document.getElementById('hw-questions').style.opacity='0';
      setTimeout(()=>{
        document.getElementById('hw-questions').style.display='none';
        const cap=document.getElementById('hw-capture');
        cap.classList.add('active');
      },400);
    }
  },600);
}

function submitHW(){
  const name=document.getElementById('hw-name').value.trim();
  const email=document.getElementById('hw-email').value.trim();
  const phone=document.getElementById('hw-phone').value.trim();
  if(!name||!email){
    document.getElementById('hw-email').focus();return;
  }
  // Fire-and-forget POST to Google Apps Script. Uses form-urlencoded to
  // avoid a CORS preflight (Apps Script doPost accepts e.parameter).
  if(WAITLIST_ENDPOINT && WAITLIST_ENDPOINT.startsWith('http')){
    const body=new URLSearchParams({
      name,email,phone,
      q1_household:HW_ANSWERS.q1_household||'',
      q2_nhs_app:HW_ANSWERS.q2_nhs_app||'',
      q3_care_mix:HW_ANSWERS.q3_care_mix||'',
      q4_insurance:HW_ANSWERS.q4_insurance||'',
      q5_wearables:HW_ANSWERS.q5_wearables||'',
      user_agent:navigator.userAgent,
      referrer:document.referrer||''
    });
    fetch(WAITLIST_ENDPOINT,{method:'POST',body}).catch(err=>console.error('waitlist submit failed',err));
  }
  // Hide capture
  document.getElementById('hw-capture').style.opacity='0';
  setTimeout(()=>{
    document.getElementById('hw-capture').style.display='none';
    // Show done
    const done=document.getElementById('hw-done');
    document.getElementById('hw-done-name').textContent=name+'.';
    done.classList.add('active');
    // Pulse all nodes
    HW_NODES.forEach(nd=>{if(nd.active){nd.r=1.5;setTimeout(()=>{nd.r=1;},400);}});
    // Show label
    document.getElementById('hw-label').classList.add('on');
    document.getElementById('hw-label').textContent='Your health world is reserved.';
  },500);
}

// Show label on open
function startHW(){
  hwCurrentQ=0;
  HW_NODES.forEach(nd=>{nd.active=false;nd.alpha=0;});
  document.getElementById('hw-questions').style.display='';
  document.getElementById('hw-questions').style.opacity='1';
  document.getElementById('hw-capture').style.display='none';
  document.getElementById('hw-capture').style.opacity='1';
  document.getElementById('hw-capture').classList.remove('active');
  document.getElementById('hw-done').classList.remove('active');
  document.querySelectorAll('.hw-q').forEach((q,i)=>q.classList.toggle('active',i===0));
  document.getElementById('hw-label').classList.remove('on');
  setTimeout(()=>document.getElementById('hw-label').classList.add('on'),600);
}

// Route based on viewport: mobile gets the lightweight single-screen form,
// desktop gets the elaborate canvas-animated CTA overlay.
const MOBILE_MQ = '(max-width: 880px)';
function openWaitlist(){
  if(typeof window!=='undefined' && window.matchMedia && window.matchMedia(MOBILE_MQ).matches){
    openMobileWaitlist();
  } else {
    window._ctaOpen && window._ctaOpen();
  }
}

// ── MOBILE WAITLIST ──────────────────────────────────────────────
// Simple, animation-free, single-screen form. Posts to the same Apps
// Script endpoint as submitCtaWaitlist (and submitHW). Used in place of
// cta-overlay on ≤880px viewports — see openWaitlist() above.
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
  ov.classList.add('open');
  ov.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  _pauseBackgroundMedia(true);
  // Reset any previous error + button label + focus the first field.
  const err=document.getElementById('mw-error'); if(err) err.textContent='';
  const btn=document.getElementById('mw-submit') as HTMLButtonElement|null;
  if(btn){ btn.disabled=false; btn.textContent='Reserve my spot →'; }
  setTimeout(()=>{const i=document.getElementById('mw-name') as HTMLInputElement|null;if(i)i.focus();},250);
}
function closeMobileWaitlist(){
  const ov=document.getElementById('mobile-waitlist');
  if(!ov) return;
  ov.classList.remove('open');
  ov.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
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
  const nameEl =document.getElementById('mw-name')  as HTMLInputElement|null;
  const emailEl=document.getElementById('mw-email') as HTMLInputElement|null;
  const phoneEl=document.getElementById('mw-phone') as HTMLInputElement|null;
  const errEl  =document.getElementById('mw-error');
  const btn    =document.getElementById('mw-submit') as HTMLButtonElement|null;
  if(!nameEl||!emailEl||!errEl||!btn) return;

  const name =nameEl.value.trim();
  const email=emailEl.value.trim();
  const phone=(phoneEl?.value||'').trim();
  errEl.textContent='';

  if(!name){ errEl.textContent='Please enter your first name.'; nameEl.focus(); return; }
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    errEl.textContent='Please enter a valid email address.';
    emailEl.focus(); return;
  }
  if(!WAITLIST_ENDPOINT||!WAITLIST_ENDPOINT.startsWith('http')){
    errEl.textContent='Waitlist endpoint not configured.'; return;
  }

  btn.disabled=true;
  const originalLabel=btn.textContent;
  btn.textContent='Saving…';

  const body=new URLSearchParams({
    name,email,phone,
    q1_household:'',q2_nhs_app:'',q3_care_mix:'',q4_insurance:'',q5_wearables:'',
    source:'mobile-waitlist',
    user_agent:navigator.userAgent,
    referrer:document.referrer||''
  });
  try{
    await fetch(WAITLIST_ENDPOINT,{method:'POST',body});
    // Apps Script no-cors returns opaque — we treat any non-thrown response as success.
    const nameDot=document.getElementById('mw-done-name');
    if(nameDot){
      const first=name.split(/\s+/)[0];
      nameDot.textContent=', '+first+'.';
    }
    _mwShowStage('mw-stage-done');
    // Scroll the done stage into view in case the success message is below
    // the fold (the form may have been scrolled up by the iOS keyboard).
    const ov=document.getElementById('mobile-waitlist');
    if(ov) ov.scrollTop=0;
  } catch(err){
    console.error('mobile waitlist submit failed',err);
    errEl.textContent='Sorry, something went wrong. Try again in a moment.';
    btn.disabled=false;
    btn.textContent=originalLabel;
  }
}

// ── BETA PORTAL ───────────────────────────────────────────────────
// Email-gated access for beta cohorts. Hits the same Apps Script endpoint
// as the waitlist with mode=check_beta; on match, reveals the install view.
let BETA_VERIFIED_EMAIL = '';

function _bpShowStage(id){
  document.querySelectorAll('#beta-portal .bp-stage').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id);
  if(el) el.classList.add('active');
}

function openBetaPortal(){
  resetBetaPortal();
  const portal=document.getElementById('beta-portal');
  portal.classList.add('open');
  document.body.style.overflow='hidden';
  setTimeout(()=>{const i=document.getElementById('bp-email');if(i) i.focus();},300);
}

function closeBetaPortal(){
  document.getElementById('beta-portal').classList.remove('open');
  document.body.style.overflow='';
}

function resetBetaPortal(){
  BETA_VERIFIED_EMAIL='';
  const email=document.getElementById('bp-email');
  if(email) email.value='';
  const err=document.getElementById('bp-error');
  if(err) err.textContent='';
  const submit=document.getElementById('bp-submit');
  if(submit) submit.disabled=false;
  _bpShowStage('bp-stage-gate');
  setTimeout(()=>{const i=document.getElementById('bp-email');if(i) i.focus();},200);
}

async function submitBetaCheck(){
  const emailEl=document.getElementById('bp-email');
  const errEl=document.getElementById('bp-error');
  const submitEl=document.getElementById('bp-submit');
  const email=emailEl.value.trim();
  errEl.textContent='';

  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    errEl.textContent='Please enter a valid email address.';
    emailEl.focus();
    return;
  }
  if(!WAITLIST_ENDPOINT||!WAITLIST_ENDPOINT.startsWith('http')){
    errEl.textContent='Beta endpoint not configured. Please email beta@getmine.ai';
    return;
  }

  submitEl.disabled=true;
  _bpShowStage('bp-stage-checking');

  try{
    const body=new URLSearchParams({
      mode:'check_beta',
      email,
      user_agent:navigator.userAgent,
      referrer:document.referrer||''
    });
    const res=await fetch(WAITLIST_ENDPOINT,{method:'POST',body});
    const data=await res.json();
    if(data&&data.ok&&data.allowed){
      BETA_VERIFIED_EMAIL=email;
      const niceName=(data.name&&String(data.name).trim().split(/\s+/)[0])||'there';
      document.getElementById('bp-greet-name').textContent=niceName;
      const cohort=(data.cohort&&String(data.cohort).trim())||'Beta';
      const pill=document.getElementById('bp-cohort-pill');
      pill.textContent=cohort.charAt(0).toUpperCase()+cohort.slice(1).replace(/-/g,' ');
      _bpShowStage('bp-stage-install');
    } else {
      _bpShowStage('bp-stage-denied');
    }
  } catch(err){
    console.error('beta check failed',err);
    errEl.textContent='Sorry, something went wrong. Try again in a moment.';
    submitEl.disabled=false;
    _bpShowStage('bp-stage-gate');
  }
}

function logBetaDownload(os){
  // Fire-and-forget. Doesn't gate the click — just records it for the access log.
  if(!WAITLIST_ENDPOINT||!WAITLIST_ENDPOINT.startsWith('http')) return;
  if(!BETA_VERIFIED_EMAIL) return;
  const body=new URLSearchParams({
    mode:'log_download',
    email:BETA_VERIFIED_EMAIL,
    os,
    user_agent:navigator.userAgent,
    referrer:document.referrer||''
  });
  fetch(WAITLIST_ENDPOINT,{method:'POST',body}).catch(err=>console.error('download log failed',err));
}

// Allow Escape to close the portal.
document.addEventListener('keydown',ev=>{
  if(ev.key==='Escape'&&document.getElementById('beta-portal').classList.contains('open')){
    closeBetaPortal();
  }
});

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
function drawMinaOn(c,x,y,sc,tt){
  const b=Math.sin(tt*.72)*.018+1,s=sc*b;
  c.save();c.translate(x,y);

  // ── Body hint (soft ellipse below face) ──
  c.beginPath();c.ellipse(0,52*s,30*s,20*s,0,0,Math.PI*2);
  c.fillStyle='rgba(29,222,200,.28)';c.fill();

  // ── Feet — two solid pads with toe dots ──
  const footA=Math.max(0,Math.min(1,(sc-.28)/.5));
  if(footA>.02){
    c.globalAlpha=footA;
    [-14*s,14*s].forEach(dx=>{
      c.beginPath();c.ellipse(dx,68*s,11*s,7*s,dx>0?.15:-.15,0,Math.PI*2);
      c.fillStyle='#1DDEC8';c.fill();
      [-3.5*s,0,3.5*s].forEach((tx,ti)=>{
        c.beginPath();c.arc(dx+tx,63*s-Math.abs(ti-1)*s,2.8*s,0,Math.PI*2);
        c.fillStyle='#0FB5A8';c.fill();
      });
    });
    c.globalAlpha=1;
  }

  // ── Side arms — solid ovals, no transparency ──
  const armA=Math.max(0,Math.min(1,(sc-.28)/.5));
  if(armA>.02){
    c.globalAlpha=armA;
    [-1,1].forEach(side=>{
      c.beginPath();c.ellipse(side*46*s,32*s,10*s,7*s,side*.1,0,Math.PI*2);
      c.fillStyle='#1DDEC8';c.fill();
    });
    c.globalAlpha=1;
  }

  // ── Teal ring (framing the face) ──
  const fr=48*s;
  const rg=c.createLinearGradient(0,-fr,0,fr);
  rg.addColorStop(0,'#1DDEC8');rg.addColorStop(1,'#4CD680');
  c.beginPath();c.arc(0,0,fr+6*s,0,Math.PI*2);
  c.strokeStyle=rg;c.lineWidth=6*s;c.stroke();

  // ── Face — large, fills ring ──
  const fg=c.createRadialGradient(0,0,0,0,0,fr);
  fg.addColorStop(0,'#5ADB9A');fg.addColorStop(0.6,'#2AAA70');fg.addColorStop(1,'#1A7A4A');
  c.beginPath();c.arc(0,0,fr,0,Math.PI*2);c.fillStyle=fg;c.fill();

  // blush
  c.globalAlpha=.28;c.fillStyle='#FF8FA0';
  c.beginPath();c.ellipse(-fr*.5,fr*.1,fr*.22,fr*.13,-.15,0,Math.PI*2);c.fill();
  c.beginPath();c.ellipse( fr*.5,fr*.1,fr*.22,fr*.13, .15,0,Math.PI*2);c.fill();
  c.globalAlpha=1;

  // eyebrows
  c.strokeStyle='#4CD680';c.lineWidth=fr*.06;c.lineCap='round';
  c.beginPath();c.arc(-fr*.36,-fr*.3,fr*.18,Math.PI*1.15,Math.PI*1.85);c.stroke();
  c.beginPath();c.arc( fr*.36,-fr*.3,fr*.18,Math.PI*1.15,Math.PI*1.85);c.stroke();

  // eyes with slow blink
  const bl=Math.max(0,Math.sin(tt*.16)),blH=bl>.96?Math.max(0,(bl-.96)/.04):1;
  const eR=fr*.21,eY=-fr*.08,eX=fr*.34;
  [[-eX,eY],[eX,eY]].forEach(([ex,ey])=>{
    c.beginPath();c.arc(ex,ey,eR,0,Math.PI*2);c.fillStyle='white';c.fill();
    if(blH<1){c.fillStyle='white';c.fillRect(ex-eR,ey-eR,eR*2,eR*2*(1-blH));}
    c.beginPath();c.arc(ex+eR*.2,ey+eR*.2,eR*.58,0,Math.PI*2);
    c.fillStyle='#08101A';c.globalAlpha=blH;c.fill();c.globalAlpha=1;
    // small crisp shine dot — not a blob
    c.beginPath();c.arc(ex-eR*.3,ey-eR*.3,eR*.18,0,Math.PI*2);
    c.fillStyle='rgba(255,255,255,.9)';c.fill();
  });

  // calm smile
  c.beginPath();c.arc(0,fr*.28,fr*.24,.18*Math.PI,.82*Math.PI);
  c.strokeStyle='white';c.lineWidth=fr*.075;c.lineCap='round';c.stroke();

  c.restore();
}


// ── MAIN RAF LOOP ─────────────────────────────────────────────────
function tick(){
  t+=0.016;
  drawHero();
  if(document.getElementById('waitlist').classList.contains('open'))drawHW();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function closeWaitlist(){
  document.getElementById('waitlist').classList.remove('open');
  document.body.style.overflow='';
}
function closeCta(){
  const o=document.getElementById('cta-overlay');
  if(o) o.classList.remove('open');
  document.body.style.overflow='';
  // Clear constellation: remove every dynamically-added child of #cosmo (the chip divs have no id)
  const cosmo=document.getElementById('cosmo');
  if(cosmo){
    Array.from(cosmo.children).forEach(el=>{ if(!el.id) el.remove(); });
  }
  // Clear cosmo-svg contents (rings + lines)
  const cosmoSvg=document.getElementById('cosmo-svg');
  if(cosmoSvg){ while(cosmoSvg.firstChild) cosmoSvg.removeChild(cosmoSvg.firstChild); }
  // Hide any NHS prompt that was shown at end-of-flow
  const nhsP=document.getElementById('nhs-prompt');
  if(nhsP){ nhsP.style.display='none'; nhsP.style.animation=''; }
}
function closeCtaAndScroll(id){
  closeCta();
  setTimeout(()=>{ if(typeof scrollToSection==='function') scrollToSection(id); },120);
}
window.closeCta=closeCta;
window.closeCtaAndScroll=closeCtaAndScroll;
// Close overlays on Escape
window.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  closeWaitlist();
  closeCta();
});

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

(function(){

// ══ STATE ══
const S={name:'',email:'',mobile:''};
const progMap={'w1':0,'w2':33,'w-nhs':50,'w3':66,'w4':100};
let cur='w1', seqIdx=0, t=0;
const ctxs={};
const SCALE=2.5;

// ══ MINA DRAW ══
function drawMina(c,x,y,sc,tt){
  const b=Math.sin(tt*.72)*.018+1,s=sc*b;
  c.save();c.translate(x,y);
  c.beginPath();c.ellipse(0,52*s,30*s,20*s,0,0,Math.PI*2);c.fillStyle='rgba(29,222,200,.28)';c.fill();
  const fA=Math.max(0,Math.min(1,(sc-.28)/.5));
  if(fA>.02){
    c.globalAlpha=fA;
    [-14*s,14*s].forEach(dx=>{
      c.beginPath();c.ellipse(dx,68*s,11*s,7*s,dx>0?.15:-.15,0,Math.PI*2);c.fillStyle='#1DDEC8';c.fill();
      [-3.5*s,0,3.5*s].forEach((tx,ti)=>{c.beginPath();c.arc(dx+tx,63*s-Math.abs(ti-1)*s,2.8*s,0,Math.PI*2);c.fillStyle='#0FB5A8';c.fill();});
    });
    c.globalAlpha=1;
    [-1,1].forEach(sd=>{c.beginPath();c.ellipse(sd*46*s,32*s,10*s,7*s,sd*.1,0,Math.PI*2);c.fillStyle='#1DDEC8';c.fill();});
  }
  const fr=48*s,rg=c.createLinearGradient(0,-fr,0,fr);
  rg.addColorStop(0,'#1DDEC8');rg.addColorStop(1,'#4CD680');
  c.beginPath();c.arc(0,0,fr+6*s,0,Math.PI*2);c.strokeStyle=rg;c.lineWidth=6*s;c.stroke();
  const fg=c.createRadialGradient(0,0,0,0,0,fr);
  fg.addColorStop(0,'#5ADB9A');fg.addColorStop(.6,'#2AAA70');fg.addColorStop(1,'#1A7A4A');
  c.beginPath();c.arc(0,0,fr,0,Math.PI*2);c.fillStyle=fg;c.fill();
  c.globalAlpha=.28;c.fillStyle='#FF8FA0';
  c.beginPath();c.ellipse(-fr*.5,fr*.1,fr*.22,fr*.13,-.15,0,Math.PI*2);c.fill();
  c.beginPath();c.ellipse(fr*.5,fr*.1,fr*.22,fr*.13,.15,0,Math.PI*2);c.fill();
  c.globalAlpha=1;
  c.strokeStyle='#4CD680';c.lineWidth=fr*.06;c.lineCap='round';
  c.beginPath();c.arc(-fr*.36,-fr*.3,fr*.18,Math.PI*1.15,Math.PI*1.85);c.stroke();
  c.beginPath();c.arc(fr*.36,-fr*.3,fr*.18,Math.PI*1.15,Math.PI*1.85);c.stroke();
  const bl=Math.max(0,Math.sin(tt*.16)),blH=bl>.96?Math.max(0,(bl-.96)/.04):1;
  const eR=fr*.21,eY=-fr*.08,eX=fr*.34;
  [[-eX,eY],[eX,eY]].forEach(([ex,ey])=>{
    c.beginPath();c.arc(ex,ey,eR,0,Math.PI*2);c.fillStyle='white';c.fill();
    if(blH<1){c.fillStyle='white';c.fillRect(ex-eR,ey-eR,eR*2,eR*2*(1-blH));}
    c.beginPath();c.arc(ex+eR*.2,ey+eR*.2,eR*.58,0,Math.PI*2);c.fillStyle='#08101A';c.globalAlpha=blH;c.fill();c.globalAlpha=1;
    c.beginPath();c.arc(ex-eR*.3,ey-eR*.3,eR*.18,0,Math.PI*2);c.fillStyle='rgba(255,255,255,.9)';c.fill();
  });
  c.beginPath();c.arc(0,fr*.28,fr*.24,.18*Math.PI,.82*Math.PI);c.strokeStyle='white';c.lineWidth=fr*.075;c.lineCap='round';c.stroke();
  c.restore();
}

function loop(){
  t+=0.016;
  ['cv1','cv2','cv3','cv4'].forEach(id=>{
    const cv=document.getElementById(id),ctx=ctxs[id];
    if(!ctx||!cv)return;
    ctx.clearRect(0,0,480,560);
    ctx.save();ctx.translate(240,280);drawMina(ctx,0,0,SCALE,t);ctx.restore();
    const gr=ctx.createRadialGradient(240,280,0,240,280,148);
    gr.addColorStop(0,'rgba(29,222,200,.09)');gr.addColorStop(1,'transparent');
    ctx.beginPath();ctx.arc(240,280,148,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
  });
  requestAnimationFrame(loop);
}

// ── CTA-OVERLAY WAITLIST POST ────────────────────────────────────
// Fire-and-forget POST of the user's captured CTA-flow data to the Apps
// Script Waitlist tab. Triggered once when the user transitions w3 → w4
// (i.e. clicks "See my health world" or "Skip this step" at the end of
// the chip-questionnaire — strong intent signal, all data we'll get).
// Fixes #1 on GetMine-ai/getmine.ai: the CTA flow used to collect into
// JS state and never send anything.
function submitCtaWaitlist(){
  const name =(document.getElementById('in0') as HTMLInputElement|null)?.value.trim() || '';
  const email=(document.getElementById('in1') as HTMLInputElement|null)?.value.trim() || '';
  const phone=(document.getElementById('in2') as HTMLInputElement|null)?.value.trim() || '';
  if(!email) return;                                            // need at least an email
  if(!WAITLIST_ENDPOINT || !WAITLIST_ENDPOINT.startsWith('http')) return;

  // Selected chips per group → comma-joined string (one or many).
  const chipsIn=(groupId:string)=>Array.from(document.querySelectorAll('#'+groupId+' .chip.sel'))
    .map(c=>(c as HTMLElement).dataset.v||'').filter(Boolean).join(', ');

  const body=new URLSearchParams({
    name,email,phone,
    q1_household: chipsIn('g-household'),
    q2_nhs_app:   chipsIn('g-nhs'),
    q3_care_mix:  chipsIn('g-coverage'),
    q4_insurance: '',                                           // not currently asked in CTA flow
    q5_wearables: chipsIn('g-wear'),
    // Extra chip groups the current sheet schema doesn't have columns for —
    // bundled into a single field so we don't lose the signal.
    extra:        [chipsIn('g-tests'),chipsIn('g-clinical'),chipsIn('g-pharma')].filter(Boolean).join(' | '),
    user_agent:   navigator.userAgent,
    referrer:     document.referrer||''
  });
  fetch(WAITLIST_ENDPOINT,{method:'POST',body}).catch(err=>console.error('cta waitlist submit failed',err));
}

// ══ NAVIGATION ══
function go(next){
  const curEl=document.getElementById(cur);
  curEl.classList.add('out');
  setTimeout(()=>curEl.classList.remove('active','out'),440);
  setTimeout(()=>{
    const nxtEl=document.getElementById(next);
    nxtEl.classList.add('active');
    cur=next;
    document.getElementById('prog-bar').style.width=(progMap[next]||0)+'%';
    if(next==='w4'){
      // POST is now triggered at the actual submit point (btn1 click for
      // the short path, "See my health world" for the questionnaire path)
      // — no longer at w4 entry, so we don't double-post.
      requestAnimationFrame(()=>buildConstellation());
    }
  },440);
}

// ══ SEQUENTIAL FIELDS ══
const fields=[
  {sf:'sf0',inp:'in0',fw:'fw0',key:'name',label:'Full name'},
  {sf:'sf1',inp:'in1',fw:'fw1',key:'email',label:'Email'},
  {sf:'sf2',inp:'in2',fw:'fw2',key:'mobile',label:'Mobile'},
];

function showField(i){
  document.getElementById(fields[i].sf).classList.add('vis');
  setTimeout(()=>document.getElementById(fields[i].inp).focus(),330);
  document.getElementById('mw1').classList.add('bouncing');
}

function validateField(i){
  const f=fields[i],val=document.getElementById(f.inp).value.trim();
  const fe=document.querySelector('#'+f.fw+' .fe');
  if(i===1&&val&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){if(fe)fe.style.display='block';return null;}
  if(!val){if(fe)fe.style.display='block';return null;}
  if(fe)fe.style.display='none';
  return val;
}

function advanceField(i){
  const val=validateField(i);if(!val)return;
  S[fields[i].key]=val;
  // done badge
  const dl=document.getElementById('done-list');
  const item=document.createElement('div');item.className='done-item';
  item.innerHTML='<div class="tick"><svg viewBox="0 0 18 18" fill="none"><path d="M2 9l5 5 9-9" stroke="#3DD68C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="done-box"><div class="done-val">'+val+'</div><div class="done-lbl">'+fields[i].label+'</div></div>';
  dl.appendChild(item);
  document.getElementById(fields[i].sf).classList.remove('vis');
  seqIdx++;
  if(seqIdx<fields.length){
    showField(seqIdx);
  } else {
    // all done — spin then reveal button
    const mw=document.getElementById('mw1');
    mw.classList.remove('bouncing');
    mw.classList.add('spinning');
    setTimeout(()=>{
      mw.classList.remove('spinning');
      document.getElementById('w1hl').innerHTML='Now, <em>a little about you.</em>';
      document.getElementById('w1sub').textContent='Two quick steps and you\'re done.';
      document.getElementById('btn1').style.display='block';
    },1550);
  }
}

fields.forEach((f,i)=>{
  setTimeout(()=>{
    const inp=document.getElementById(f.inp);
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();advanceField(i);}});
    inp.addEventListener('input',()=>{const fe=document.querySelector('#'+f.fw+' .fe');if(fe)fe.style.display='none';});
    inp.addEventListener('focus',()=>document.getElementById('mw1').classList.add('bouncing'));
    inp.addEventListener('blur',()=>{if(seqIdx===i)document.getElementById('mw1').classList.remove('bouncing');});
  },200);
});
// btn1 = "Reserve my spot" — validate, POST, then skip straight to w4
// (success). The chip questionnaire is now opt-in via btn1-more.
function _validateAllFields(){
  for(let i=0;i<fields.length;i++){
    const val=document.getElementById(fields[i].inp).value.trim();
    const fe=document.querySelector('#'+fields[i].fw+' .fe');
    // Mobile is optional — skip empty check for i===2.
    if(i===2 && !val){ if(fe) fe.style.display='none'; continue; }
    if(!val){ if(fe) fe.style.display='block'; document.getElementById(fields[i].inp).focus(); return false; }
    if(i===1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){
      if(fe) fe.style.display='block'; document.getElementById(fields[i].inp).focus(); return false;
    }
    if(fe) fe.style.display='none';
    S[fields[i].key]=val;
  }
  return true;
}
// Set the success-page first-name immediately on validation pass, so the
// "All set, [name]" copy is ready before the w4 transition / constellation
// finishes (avoids a race where the original code's name-inject ran late).
function _setEndName(){
  const fn=(document.getElementById('in0').value||'').trim().split(/\s+/)[0];
  const el=document.getElementById('end-name');
  if(fn && el) el.textContent=fn;
}
document.getElementById('btn1').addEventListener('click',()=>{
  if(!_validateAllFields()) return;
  _setEndName();
  submitCtaWaitlist();
  go('w4');
});
// btn1-more = "Tell us a bit more (optional)" — still validate basic fields,
// then continue into the chip questionnaire path. POST happens at the end
// of w3 ("See my health world") with the full data.
const btn1more=document.getElementById('btn1-more');
if(btn1more) btn1more.addEventListener('click',()=>{
  if(!_validateAllFields()) return;
  _setEndName();
  go('w2');
});

// ══ W2 CHIP LOGIC ══
const nhsNo={val:false};

function addTag(v, bg, c){
  const row=document.getElementById('tag-row');
  if(row.querySelector('[data-v="'+v+'"]')) return;
  const t=document.createElement('div');
  t.className='w2tag';t.dataset.v=v;
  t.style.background=bg;t.style.color=c;
  t.textContent=v;
  row.appendChild(t);
}
function removeTag(v){
  const row=document.getElementById('tag-row');
  const t=row.querySelector('[data-v="'+v+'"]');
  if(!t)return;
  t.style.animation='tagOut .2s cubic-bezier(.22,1,.36,1) forwards';
  setTimeout(()=>t.remove(),200);
}

function initGroup(grpId, excl){
  document.getElementById(grpId).querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const v=chip.dataset.v, bg=chip.dataset.bg, c=chip.dataset.c;
      const isSel=chip.classList.contains('sel');
      if(excl){
        document.getElementById(grpId).querySelectorAll('.chip.sel').forEach(ch=>{
          ch.classList.remove('sel'); removeTag(ch.dataset.v);
          if(ch.dataset.nhs) nhsNo.val=false;
        });
      }
      if(isSel){
        chip.classList.remove('sel'); removeTag(v);
        if(chip.dataset.nhs==='no') nhsNo.val=false;
      } else {
        chip.classList.add('sel'); addTag(v,bg,c);
        if(chip.dataset.nhs==='no') nhsNo.val=true;
        if(chip.dataset.nhs==='yes') nhsNo.val=false;
      }
    });
  });
}
initGroup('g-household',true);
initGroup('g-nhs',true);
initGroup('g-coverage',false);
document.getElementById('btn2').addEventListener('click',()=>go('w3'));

// ══ W3 CHIP LOGIC ══
function addTag3(v,bg,c){
  const row=document.getElementById('tag-row3');
  if(row.querySelector('[data-v="'+v+'"]')) return;
  const t=document.createElement('div');
  t.className='w2tag'; t.dataset.v=v;
  t.style.background=bg; t.style.color=c;
  t.textContent=v;
  row.appendChild(t);
}
function removeTag3(v){
  const row=document.getElementById('tag-row3');
  const t=row.querySelector('[data-v="'+v+'"]');
  if(!t) return;
  t.style.animation='tagOut .2s cubic-bezier(.22,1,.36,1) forwards';
  setTimeout(()=>t.remove(),200);
}
['g-wear','g-tests','g-clinical','g-pharma'].forEach(grpId=>{
  document.getElementById(grpId).querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const isSel=chip.classList.contains('sel');
      if(isSel){
        chip.classList.remove('sel');
        removeTag3(chip.dataset.v);
      } else {
        chip.classList.add('sel');
        addTag3(chip.dataset.v, chip.dataset.bg, chip.dataset.c);
      }
    });
  });
});

// ══ W4 CONSTELLATION ══
function buildConstellation(){
  const all=[];
  document.querySelectorAll('#w2 .chip.sel, #w3 .chip.sel').forEach(ch=>{
    if(ch.dataset.v==='Not yet') return; // exclude negative signal
    all.push({v:ch.dataset.v, bg:ch.dataset.bg||'#1DDEC8', c:ch.dataset.c||'#060C14'});
  });
  const cosmo=document.getElementById('cosmo');
  const svg=document.getElementById('cosmo-svg');
  const n=all.length; if(!n)return;
  const CX=250,CY=250,R=195;

  // orbit ring
  const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');
  ring.setAttribute('cx',CX);ring.setAttribute('cy',CY);ring.setAttribute('r',R);
  ring.setAttribute('fill','none');ring.setAttribute('stroke','rgba(29,222,200,.1)');
  ring.setAttribute('stroke-width','40');ring.setAttribute('opacity','0');
  ring.style.transition='opacity .8s';
  svg.appendChild(ring);
  const ring2=document.createElementNS('http://www.w3.org/2000/svg','circle');
  ring2.setAttribute('cx',CX);ring2.setAttribute('cy',CY);ring2.setAttribute('r',R);
  ring2.setAttribute('fill','none');ring2.setAttribute('stroke','rgba(29,222,200,.2)');
  ring2.setAttribute('stroke-width','1.5');ring2.setAttribute('stroke-dasharray','4 6');
  ring2.setAttribute('opacity','0');ring2.style.transition='opacity .8s .3s';
  svg.appendChild(ring2);
  setTimeout(()=>{ring.setAttribute('opacity','1');ring2.setAttribute('opacity','1');},100);

  // create all tags first (hidden), then measure and position
  const tags=[];
  all.forEach((item,i)=>{
    const tag=document.createElement('div');
    tag.style.cssText='position:absolute;border-radius:100px;padding:9px 18px;font-size:14px;font-weight:700;white-space:nowrap;visibility:hidden;';
    tag.style.background=item.bg; tag.style.color=item.c;
    tag.textContent=item.v;
    cosmo.appendChild(tag);
    tags.push({el:tag,item,i});
  });

  // after render — measure then position
  requestAnimationFrame(()=>{
    tags.forEach(({el,item,i})=>{
      const angle=(i/n)*Math.PI*2 - Math.PI/2;
      const tx=CX+Math.cos(angle)*R;
      const ty=CY+Math.sin(angle)*R;
      const w=el.offsetWidth, h=el.offsetHeight;
      el.style.left=(tx-w/2)+'px';
      el.style.top=(ty-h/2)+'px';
      el.style.visibility='visible';
      el.style.animation='cIn .5s cubic-bezier(.22,1,.36,1) '+(i*.07+.1)+'s both';

      // line from mina centre to tag centre
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',CX);line.setAttribute('y1',CY);
      line.setAttribute('x2',tx);line.setAttribute('y2',ty);
      line.setAttribute('stroke','rgba(29,222,200,.2)');
      line.setAttribute('stroke-width','1');
      line.setAttribute('stroke-dasharray','3 5');
      line.setAttribute('opacity','0');
      line.style.transition='opacity .5s ease '+(i*.06+.5)+'s';
      svg.appendChild(line);
      setTimeout(()=>line.setAttribute('opacity','1'),(i*60+500));
    });
  });

  // name
  const fn=(document.getElementById('in0').value||'').trim().split(' ')[0];
  if(fn) document.getElementById('end-name').textContent=fn;
  // NHS prompt if user selected Not yet
  if(nhsNo.val){
    const p=document.getElementById('nhs-prompt');
    p.style.display='flex';
    p.style.animation='slideUp .5s cubic-bezier(.22,1,.36,1) .6s both';
  }
}

// ══ KEYBOARD NAV FOR CHIPS ══
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('chip')){
    e.preventDefault();e.target.click();
  }
});

// ══ INIT ══
window.addEventListener('DOMContentLoaded',()=>{
  ['cv1','cv2','cv3','cv4'].forEach(id=>{
    const cv=document.getElementById(id);if(cv)ctxs[id]=cv.getContext('2d');
  });
  showField(0);
  loop();
});

window.ctaGo = go;
window._ctaOpen = function(){
  document.getElementById('cta-overlay').classList.add('open');
  document.body.style.overflow='hidden';
};
// Expose from inside the IIFE so inline onclick handlers in CtaOverlay.astro
// (e.g. "See my health world") can call submitCtaWaitlist. Cannot live in the
// module-level Object.assign below — submitCtaWaitlist is scoped here.
window.submitCtaWaitlist = submitCtaWaitlist;
})();

(function(){
  function drawHeroMina(c, cx, cy, sc) {
    c.beginPath();
    c.ellipse(cx, cy + 52 * sc, 30 * sc, 20 * sc, 0, 0, Math.PI * 2);
    c.fillStyle = "rgba(29,222,200,.3)";
    c.fill();
    [-14 * sc, 14 * sc].forEach(function(dx){
      c.beginPath();
      c.ellipse(cx + dx, cy + 68 * sc, 11 * sc, 7 * sc, dx > 0 ? .15 : -.15, 0, Math.PI * 2);
      c.fillStyle = "#1DDEC8";
      c.fill();
    });
    [-1, 1].forEach(function(side){
      c.beginPath();
      c.ellipse(cx + side * 46 * sc, cy + 32 * sc, 10 * sc, 7 * sc, side * .1, 0, Math.PI * 2);
      c.fillStyle = "#1DDEC8";
      c.fill();
    });
    var fr = 48 * sc;
    var rg = c.createLinearGradient(cx, cy - fr, cx, cy + fr);
    rg.addColorStop(0, "#1DDEC8");
    rg.addColorStop(1, "#4CD680");
    c.beginPath();
    c.arc(cx, cy, fr + 6 * sc, 0, Math.PI * 2);
    c.strokeStyle = rg;
    c.lineWidth = 6 * sc;
    c.stroke();
    var fg = c.createRadialGradient(cx, cy, 0, cx, cy, fr);
    fg.addColorStop(0, "#5ADB9A");
    fg.addColorStop(.6, "#2AAA70");
    fg.addColorStop(1, "#1A7A4A");
    c.beginPath();
    c.arc(cx, cy, fr, 0, Math.PI * 2);
    c.fillStyle = fg;
    c.fill();
    var eR = fr * .21, eY = cy - fr * .08, eX = fr * .34;
    [cx - eX, cx + eX].forEach(function(ex){
      c.beginPath();
      c.arc(ex, eY, eR, 0, Math.PI * 2);
      c.fillStyle = "white";
      c.fill();
      c.beginPath();
      c.arc(ex + eR * .2, eY + eR * .2, eR * .58, 0, Math.PI * 2);
      c.fillStyle = "#08101A";
      c.fill();
    });
    c.beginPath();
    c.arc(cx, cy + fr * .28, fr * .24, .18 * Math.PI, .82 * Math.PI);
    c.strokeStyle = "white";
    c.lineWidth = fr * .075;
    c.lineCap = "round";
    c.stroke();
  }
  var mc = document.getElementById("hero-mina-canvas");
  if (mc) {
    drawHeroMina(mc.getContext("2d"), mc.width / 2, mc.height * .42, mc.width / 168);
  }
})();

// ── Re-expose inline on* handler entry points on window ──
Object.assign(window, { openWaitlist, closeWaitlist, scrollToSection, selectOption, submitHW, openBetaPortal, closeBetaPortal, submitBetaCheck, resetBetaPortal, openMobileWaitlist, closeMobileWaitlist, submitMobileWaitlist, openMobileMenu, closeMobileMenu });
