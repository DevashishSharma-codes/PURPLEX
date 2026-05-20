import { useEffect, useRef, useState, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@300;400;500;600;700&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
:root{
  --acc:#00d4e8;--acc2:#26eeff;
  --bg:#0b0a0a;--bg2:#080808;
  --bd:rgba(255,255,255,0.08);
  --t:#d8cfc4;--t2:rgba(216,207,196,0.5);--t3:rgba(216,207,196,0.22);
}
html,body{height:100%;width:100%;background:var(--bg);color:var(--t);font-family:'Geist',sans-serif;overflow:hidden}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes tdot{0%,80%,100%{opacity:.2}40%{opacity:1}}

.root{display:flex;height:100vh;width:100vw;overflow:hidden}

/* SIDEBAR */
.sb{width:220px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--bd);display:flex;flex-direction:column;height:100vh;overflow:hidden;transition:width .26s cubic-bezier(.4,0,.2,1)}
.sb.off{width:0;border-right:none}
.sb-inner{width:220px;display:flex;flex-direction:column;height:100%;overflow:hidden}
.sb-head{padding:.75rem .85rem .65rem;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.logo{font-family:'Libre Baskerville',serif;font-size:.95rem;color:var(--t);display:flex;align-items:center;gap:7px;letter-spacing:-.02em;cursor:pointer}
.logo-mark{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(0,212,232,.4);display:flex;align-items:center;justify-content:center;font-size:.5rem;font-weight:700;color:var(--acc2)}
.ico-btn{width:22px;height:22px;background:none;border:1px solid var(--bd);color:var(--t3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.ico-btn:hover{background:rgba(255,255,255,.04);color:var(--t2)}
.new-chat{margin:.6rem .65rem .3rem;background:rgba(0,212,232,.08);border:1px solid rgba(0,212,232,.22);padding:.48rem .8rem;font-size:.7rem;font-weight:500;color:var(--acc2);cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .18s;font-family:'Geist',sans-serif;width:calc(100% - 1.3rem)}
.new-chat:hover{background:rgba(0,212,232,.15);border-color:rgba(0,212,232,.36)}
.sb-search{padding:.1rem .65rem .3rem;flex-shrink:0}
.sb-search-inner{width:100%;background:rgba(255,255,255,.02);border:1px solid var(--bd);padding:.35rem .6rem;font-size:.66rem;color:var(--t3);display:flex;align-items:center;gap:5px}
.chat-list{flex:1;overflow-y:auto;padding:.1rem .35rem .5rem}
.chat-list::-webkit-scrollbar{width:2px}
.chat-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06)}
.sec-lbl{font-size:.55rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);padding:.45rem .45rem .18rem}
.chat-row{display:flex;align-items:center;padding:.35rem .45rem;cursor:pointer;transition:background .12s;margin-bottom:1px;font-size:.69rem;color:var(--t2);font-weight:300}
.chat-row:hover{background:rgba(255,255,255,.04);color:var(--t)}
.chat-row.on{background:rgba(0,212,232,.08);color:rgba(216,207,196,.85)}
.chat-row-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.sb-foot{padding:.55rem .65rem;border-top:1px solid var(--bd);flex-shrink:0}
.user-row{display:flex;align-items:center;gap:7px;padding:.35rem .45rem;cursor:pointer;transition:background .15s}
.user-row:hover{background:rgba(255,255,255,.04)}
.avatar{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#00bcd4,#26e5ff);display:flex;align-items:center;justify-content:center;font-size:.5rem;font-weight:700;color:#fff;flex-shrink:0}
.user-name{font-size:.67rem;color:var(--t);font-weight:500}
.user-plan{font-size:.57rem;color:var(--t3)}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;position:relative}
.topbar{height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:flex-end;padding:0 1.1rem;border-bottom:1px solid var(--bd);background:rgba(10,9,9,.97);z-index:20;position:relative}
.topbar-l{display:flex;align-items:center;gap:.6rem;position:absolute;left:1.1rem}
.model-pill{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.03);border:1px solid var(--bd);padding:.24rem .55rem;font-size:.63rem;color:var(--t2);cursor:pointer}
.model-dot{width:5px;height:5px;border-radius:50%;background:var(--acc2);animation:pulse 2s infinite;flex-shrink:0}
.content{flex:1;overflow-y:auto;overflow-x:hidden;position:relative}
.content::-webkit-scrollbar{width:3px}
.content::-webkit-scrollbar-thumb{background:rgba(255,255,255,.05)}
.dot-grid{position:absolute;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:28px 28px}

/* HOME */
.home{
  width:100%;height:100%;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  position:relative;z-index:1;
  gap:0;
}

.hero-title-wrap{
  text-align:center;
  padding:0 1rem 1.5rem;
  flex-shrink:0;
}
.hero-title{
  font-family:'Libre Baskerville',serif;
  font-size:clamp(1.8rem,4vw,3.2rem);
  font-weight:700;color:var(--t);
  line-height:1.08;letter-spacing:-.025em;
}
.hero-sub{
  font-size:.78rem;color:var(--t2);
  margin-top:.6rem;line-height:1.7;font-weight:300;
}

/*
  ═══════════════════════════════════════════════════
  THE WRAPPER:
  - .cta-outer is a full-width block
  - Its top line IS the outer-rect top border
  - The CTA button floats centered on that top line
  - Below the line: the outer-rect body (cards + textarea)
  ═══════════════════════════════════════════════════
*/

/* The full-width outer border box */
.outer-rect{
  width:100%;
  flex-shrink:0;
  position:relative;
  border:1px solid rgba(255,255,255,0.12);
}

/* Beam canvases — sit exactly ON the border lines */
.cv-vl{position:absolute;top:0;left:-1px;width:2px;height:100%;display:block;pointer-events:none;z-index:10}
.cv-vr{position:absolute;top:0;right:-1px;width:2px;height:100%;display:block;pointer-events:none;z-index:10}
.cv-hl{position:absolute;top:-1px;left:0;height:2px;display:block;pointer-events:none;z-index:10}
.cv-hr{position:absolute;top:-1px;left:0;height:2px;display:block;pointer-events:none;z-index:10}

/*
  CTA button floats centered on the TOP border of outer-rect.
  It sits in an absolutely-positioned row at top:-1px,
  so the border line runs through the vertical center of the button.
  background:var(--bg) hides the border behind the button.
*/
.cta-float{
  position:absolute;
  top:-1px;left:0;right:0;
  height:0;
  display:flex;
  justify-content:center;
  align-items:center;
  pointer-events:none;
  z-index:12;
}
.cta-btn{
  transform:translateY(-50%);
  font-family:'Geist',sans-serif;
  font-size:.74rem;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--t);
  background:var(--bg);
  border:1px solid rgba(255,255,255,.22);
  padding:.78rem 2rem;
  cursor:pointer;
  transition:border-color .2s,color .2s;
  white-space:nowrap;
  pointer-events:all;
  flex-shrink:0;
}
.cta-btn:hover{border-color:rgba(0,212,232,.5);color:var(--acc2)}

/*
  INNER LAYOUT inside outer-rect:
  3-column grid: [card col 160px] [center] [card col 160px]
  Each card col has 2 cards: one at top, one at bottom.
  Center col has the textarea box.
*/
.rect-inner{
  display:grid;
  grid-template-columns:160px 1fr 160px;
  grid-template-rows:1fr;
  width:100%;
  padding:1.8rem 0 1.6rem;
  min-height:280px;
}

/* Left and right card columns */
.card-col{
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  align-items:center;
  padding:0 1.2rem;
}

.card-item{
  display:flex;flex-direction:column;align-items:center;gap:.45rem;
}

.card-box{
  width:66px;height:66px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.09);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:background .2s,border-color .2s;
}
.card-box:hover{background:rgba(0,212,232,.06);border-color:rgba(0,212,232,.22)}
.card-box svg{width:27px;height:27px;fill:none;stroke:#5e5852;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.card-lbl{font-size:.56rem;color:var(--t3);letter-spacing:.07em;text-align:center;text-transform:uppercase}

/* Center col: textarea */
.center-col{
  display:flex;
  flex-direction:column;
  justify-content:center;
}

.chat-box{
  border:1px solid rgba(255,255,255,0.09);
  background:#0f0e0e;
  display:flex;flex-direction:column;
}
.big-ta{
  flex:1;background:transparent;border:none;outline:none;resize:none;
  font-family:'Geist',monospace;font-size:.82rem;font-weight:300;
  color:rgba(216,207,196,.3);
  padding:1.2rem 1.3rem;line-height:1.65;
  min-height:150px;
}
.big-ta::placeholder{color:rgba(216,207,196,.14)}
.toolbar{
  border-top:1px solid rgba(255,255,255,.055);
  display:flex;align-items:center;padding:.5rem .85rem;gap:.5rem;
  background:#0f0e0e;
}
.tb-btn{width:30px;height:30px;background:rgba(0,212,232,.07);border:1px solid rgba(0,212,232,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;flex-shrink:0}
.tb-btn:hover{background:rgba(0,212,232,.16);border-color:rgba(0,212,232,.44)}
.sc-btn{display:flex;align-items:center;gap:5px;background:rgba(0,212,232,.06);border:1px solid rgba(0,212,232,.2);padding:.3rem .75rem;font-size:.67rem;font-weight:500;color:var(--acc2);cursor:pointer;transition:all .18s;font-family:'Geist',sans-serif}
.sc-btn:hover{background:rgba(0,212,232,.13);border-color:rgba(0,212,232,.44)}
.send-btn{margin-left:auto;width:30px;height:30px;background:rgba(0,212,232,.1);border:1px solid rgba(0,212,232,.26);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;flex-shrink:0}
.send-btn:hover{background:rgba(0,212,232,.22);border-color:rgba(0,212,232,.52)}

/* CHAT */
.msgs{padding:1.5rem 2rem;display:flex;flex-direction:column;gap:1.4rem;max-width:760px;margin:0 auto;width:100%}
.msg{animation:msgIn .26s ease both}
.msg-user{display:flex;justify-content:flex-end}
.msg-user-bubble{background:rgba(0,212,232,.07);border:1px solid rgba(0,212,232,.13);padding:.6rem .9rem;font-size:.8rem;color:var(--t);max-width:68%;font-weight:300;line-height:1.65}
.msg-ai{display:flex;gap:.7rem;align-items:flex-start}
.ai-av{width:20px;height:20px;flex-shrink:0;margin-top:2px;background:rgba(0,212,232,.1);border:1px solid rgba(0,212,232,.22);display:flex;align-items:center;justify-content:center;font-size:.48rem;font-weight:700;color:var(--acc2);font-family:'Libre Baskerville',serif;border-radius:50%}
.ai-body{flex:1;min-width:0}
.ai-who{font-size:.55rem;color:var(--t3);margin-bottom:.3rem;letter-spacing:.06em;text-transform:uppercase}
.ai-txt{font-size:.8rem;color:var(--t2);font-weight:300;line-height:1.75;white-space:pre-line}
.sources{display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.55rem}
.src{font-size:.57rem;background:rgba(255,255,255,.03);border:1px solid var(--bd);padding:.12rem .4rem;color:var(--t3);cursor:pointer;transition:all .15s}
.src:hover{border-color:rgba(0,212,232,.3);color:var(--acc2)}
.typing-dots{display:flex;gap:4px;align-items:center;padding:.3rem 0}
.td{width:4px;height:4px;border-radius:50%;background:var(--t3);animation:tdot 1.2s ease infinite}
.td:nth-child(2){animation-delay:.18s}
.td:nth-child(3){animation-delay:.36s}
.btm{border-top:1px solid var(--bd);background:rgba(10,9,9,.96);padding:.65rem 1.8rem;flex-shrink:0}
.btm-inner{max-width:760px;margin:0 auto;display:flex;align-items:flex-end;gap:.55rem}
.btm-ta{flex:1;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);padding:.5rem .8rem;font-family:'Geist',sans-serif;font-size:.78rem;color:var(--t);resize:none;outline:none;min-height:36px;max-height:120px;transition:border-color .15s}
.btm-ta::placeholder{color:var(--t3)}
.btm-ta:focus{border-color:rgba(0,212,232,.25)}
`;

/* BEAM DRAW */
function drawVBeam(canvas, dpr, pos, goingDown) {
  const ctx = canvas.getContext("2d");
  const H = canvas.height / dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,2,H);
  const x=1, y=goingDown?pos*H:(1-pos)*H;
  const TRAIL=Math.min(H*.3,100), TIP=16, d=goingDown?-1:1;
  ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);
  ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;ctx.stroke();
  const tg=ctx.createLinearGradient(x,y+d*TRAIL,x,y);
  tg.addColorStop(0,"rgba(0,190,210,0)");tg.addColorStop(.6,"rgba(0,212,232,.25)");tg.addColorStop(1,"rgba(0,212,232,.75)");
  ctx.beginPath();ctx.moveTo(x,y+d*TRAIL);ctx.lineTo(x,y);ctx.strokeStyle=tg;ctx.lineWidth=1.5;ctx.stroke();
  const eg=ctx.createLinearGradient(x,y+d*TIP,x,y);
  eg.addColorStop(0,"rgba(0,212,232,.1)");eg.addColorStop(1,"rgba(38,238,255,1)");
  ctx.beginPath();ctx.moveTo(x,y+d*TIP);ctx.lineTo(x,y);ctx.strokeStyle=eg;ctx.lineWidth=2;ctx.stroke();
  const grd=ctx.createRadialGradient(x,y,0,x,y,10);
  grd.addColorStop(0,"rgba(38,238,255,.9)");grd.addColorStop(.4,"rgba(0,212,232,.3)");grd.addColorStop(1,"rgba(0,190,210,0)");
  ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
}

function drawHBeam(canvas, dpr, pos, goingRight) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width / dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,2);
  const y=1, x=goingRight?pos*W:(1-pos)*W;
  const TRAIL=Math.min(W*.3,110), TIP=16, d=goingRight?-1:1;
  ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);
  ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=1;ctx.stroke();
  const tg=ctx.createLinearGradient(x+d*TRAIL,y,x,y);
  tg.addColorStop(0,"rgba(0,190,210,0)");tg.addColorStop(.6,"rgba(0,212,232,.25)");tg.addColorStop(1,"rgba(0,212,232,.75)");
  ctx.beginPath();ctx.moveTo(x+d*TRAIL,y);ctx.lineTo(x,y);ctx.strokeStyle=tg;ctx.lineWidth=1.5;ctx.stroke();
  const eg=ctx.createLinearGradient(x+d*TIP,y,x,y);
  eg.addColorStop(0,"rgba(0,212,232,.1)");eg.addColorStop(1,"rgba(38,238,255,1)");
  ctx.beginPath();ctx.moveTo(x+d*TIP,y);ctx.lineTo(x,y);ctx.strokeStyle=eg;ctx.lineWidth=2;ctx.stroke();
  const grd=ctx.createRadialGradient(x,y,0,x,y,10);
  grd.addColorStop(0,"rgba(38,238,255,.9)");grd.addColorStop(.4,"rgba(0,212,232,.3)");grd.addColorStop(1,"rgba(0,190,210,0)");
  ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
}

/* DATA */
const HISTORY=[
  {id:1,text:"What is RAG vs fine-tuning?",sec:"Today"},
  {id:2,text:"Best vector DB for production scale",sec:"Today"},
  {id:3,text:"How does HNSW indexing work?",sec:"Today"},
  {id:4,text:"Purplex API streaming setup",sec:"Yesterday"},
  {id:5,text:"Compare Pinecone vs Weaviate 2026",sec:"Yesterday"},
  {id:6,text:"LLM hallucination reduction patterns",sec:"Yesterday"},
  {id:7,text:"Building cited Q&A bot in JS",sec:"Last 7 days"},
  {id:8,text:"Sub-300ms latency architecture",sec:"Last 7 days"},
];
const DEMO=[
  {role:"user",text:"What is the difference between RAG and fine-tuning?"},
  {role:"ai",text:"RAG retrieves external documents at inference time and feeds them as context — no weights change. Fine-tuning permanently bakes knowledge into model weights.\n\nRAG wins on freshness, cost, and explainability. Fine-tuning wins on speed and task fluency — but knowledge goes stale and hallucinations are harder to trace.",sources:["arxiv.org","huggingface.co","github.com"]},
];
const AI_REPLIES=[
  "Based on the most current data across arxiv, Wired, and GitHub: the RAG landscape has shifted significantly in 2026. New retrieval architectures are hitting sub-180ms median latency while maintaining citation accuracy above 96% on factual benchmarks.",
  "Great question. The key insight is that both approaches complement each other — many production systems now use fine-tuned base models with RAG overlays to get both task fluency and fresh, citable context.",
  "Purplex Deep v1.0 uses a hybrid approach: lightweight fine-tuned retrieval heads combined with real-time web context. This gives you the best of both worlds with minimal latency overhead.",
];
const IS={fill:"none",stroke:"#5e5852",strokeWidth:1.4,strokeLinecap:"round",strokeLinejoin:"round"};

function GearSVG({color="var(--acc2)",size=14}){return<svg viewBox="0 0 24 24"width={size}height={size}fill="none"stroke={color}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><circle cx="12"cy="12"r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;}
function GridSVG({color="var(--acc2)",size=13}){return<svg viewBox="0 0 16 16"width={size}height={size}fill="none"stroke={color}strokeWidth="1.4"strokeLinecap="round"strokeLinejoin="round"><rect x="1"y="1"width="6"height="6"rx=".5"/><rect x="9"y="1"width="6"height="6"rx=".5"/><rect x="1"y="9"width="6"height="6"rx=".5"/><rect x="9"y="9"width="6"height="6"rx=".5"/></svg>;}
function ArrowSVG({color="var(--acc2)",size=12}){return<svg viewBox="0 0 24 24"width={size}height={size}fill="none"stroke={color}strokeWidth="2.2"strokeLinecap="round"strokeLinejoin="round"><line x1="5"y1="12"x2="19"y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;}

export default function Dashboard() {
  const [sbOpen,setSbOpen]=useState(true);
  const [activeId,setActiveId]=useState(null);
  const [mode,setMode]=useState("home");
  const [messages,setMessages]=useState([]);
  const [inputVal,setInputVal]=useState("");
  const [typing,setTyping]=useState(false);
  const aiIdxRef=useRef(0);
  const contentRef=useRef(null);
  const outerRef=useRef(null);
  const cvVL=useRef(null);
  const cvVR=useRef(null);
  const cvHL=useRef(null);
  const cvHR=useRef(null);
  const phaseRef=useRef(0);
  const rafRef=useRef(null);
  const dpr=typeof window!=="undefined"?(window.devicePixelRatio||1):1;

  useEffect(()=>{
    const id="px-v5";
    if(!document.getElementById(id)){const s=document.createElement("style");s.id=id;s.textContent=CSS;document.head.appendChild(s);}
    return()=>document.getElementById(id)?.remove();
  },[]);

  useEffect(()=>{
    if(mode!=="home")return;
    const SPEED=0.0012;

    function size(){
      const el=outerRef.current;if(!el)return;
      const W=el.offsetWidth,H=el.offsetHeight;
      [cvVL.current,cvVR.current].forEach(cv=>{
        if(!cv)return;
        cv.width=Math.ceil(2*dpr);cv.height=Math.ceil(H*dpr);
        cv.style.height=H+"px";
      });
      [cvHL.current,cvHR.current].forEach(cv=>{
        if(!cv)return;
        cv.width=Math.ceil(W*dpr);cv.height=Math.ceil(2*dpr);
        cv.style.width=W+"px";
      });
    }

    const t=setTimeout(()=>{
      size();
      const ro=new ResizeObserver(size);
      if(outerRef.current)ro.observe(outerRef.current);
      function loop(){
        phaseRef.current=(phaseRef.current+SPEED)%1;
        const p=phaseRef.current;
        if(cvVL.current)drawVBeam(cvVL.current,dpr,p,true);
        if(cvVR.current)drawVBeam(cvVR.current,dpr,(p+.5)%1,false);
        if(cvHL.current)drawHBeam(cvHL.current,dpr,p,true);
        if(cvHR.current)drawHBeam(cvHR.current,dpr,(p+.5)%1,false);
        rafRef.current=requestAnimationFrame(loop);
      }
      loop();
      return()=>{cancelAnimationFrame(rafRef.current);ro.disconnect();};
    },60);
    return()=>{clearTimeout(t);cancelAnimationFrame(rafRef.current);};
  },[mode,dpr]);

  useEffect(()=>{
    if(contentRef.current)contentRef.current.scrollTop=contentRef.current.scrollHeight;
  },[messages,typing]);

  const goHome=useCallback(()=>{setActiveId(null);setMessages([]);setMode("home");setInputVal("");},[]);
  const loadChat=useCallback((id)=>{setActiveId(id);setMessages(DEMO);setMode("chat");},[]);
  const send=useCallback((txt)=>{
    if(!txt.trim())return;
    setMessages(prev=>[...prev,{role:"user",text:txt.trim()}]);
    setMode("chat");setInputVal("");setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      const reply=AI_REPLIES[aiIdxRef.current%AI_REPLIES.length];
      aiIdxRef.current++;
      setMessages(prev=>[...prev,{role:"ai",text:reply,sources:["wired.com","arxiv.org","github.com"]}]);
    },2100);
  },[]);

  const secs=["Today","Yesterday","Last 7 days"];

  return(
    <div className="root">
      {/* SIDEBAR */}
      <div className={`sb${sbOpen?"":" off"}`}>
        <div className="sb-inner">
          <div className="sb-head">
            <div className="logo" onClick={goHome}><div className="logo-mark">P</div>purplex</div>
            <button className="ico-btn" onClick={()=>setSbOpen(false)}>
              <svg viewBox="0 0 24 24"width="11"height="11"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"><line x1="18"y1="6"x2="6"y2="18"/><line x1="6"y1="6"x2="18"y2="18"/></svg>
            </button>
          </div>
          <button className="new-chat" onClick={goHome}>+ New search</button>
          <div className="sb-search">
            <div className="sb-search-inner">
              <svg viewBox="0 0 24 24"width="10"height="10"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"style={{opacity:.3}}><circle cx="11"cy="11"r="8"/><line x1="21"y1="21"x2="16.65"y2="16.65"/></svg>
              <span>Search chats</span>
            </div>
          </div>
          <div className="chat-list">
            {secs.map(sec=>{
              const items=HISTORY.filter(c=>c.sec===sec);
              if(!items.length)return null;
              return(<div key={sec}><div className="sec-lbl">{sec}</div>{items.map(c=>(<div key={c.id}className={`chat-row${activeId===c.id?" on":""}`}onClick={()=>loadChat(c.id)}><span className="chat-row-txt">{c.text}</span></div>))}</div>);
            })}
          </div>
          <div className="sb-foot">
            <div className="user-row">
              <div className="avatar">JK</div>
              <div style={{flex:1,minWidth:0}}><div className="user-name">James Kim</div><div className="user-plan">Pro · 8,342 queries left</div></div>
              <button className="ico-btn"><GearSVG color="var(--t3)"size={11}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-l">
            {!sbOpen&&(<button className="ico-btn"onClick={()=>setSbOpen(true)}><svg viewBox="0 0 24 24"width="11"height="11"fill="none"stroke="currentColor"strokeWidth="2"strokeLinecap="round"><line x1="3"y1="6"x2="21"y2="6"/><line x1="3"y1="12"x2="21"y2="12"/><line x1="3"y1="18"x2="21"y2="18"/></svg></button>)}
            {!sbOpen&&<div className="logo"onClick={goHome}style={{fontSize:".82rem"}}><div className="logo-mark">P</div>purplex</div>}
            {mode==="chat"&&<span style={{fontSize:".73rem",color:"var(--t2)",fontWeight:300}}>{activeId?HISTORY.find(c=>c.id===activeId)?.text:"New search"}</span>}
          </div>
          <div className="model-pill"><span className="model-dot"/>Purplex Deep · v1.0<span style={{opacity:.3,fontSize:".53rem",marginLeft:2}}>▾</span></div>
        </div>

        <div className="content" ref={contentRef}>
          <div className="dot-grid"/>

          {mode==="home"?(
            <div className="home">

              {/* TITLE */}
              <div className="hero-title-wrap">
                <div className="hero-title">AI-Powered Code &<br/>Architecture Design</div>
                <div className="hero-sub">Purplex is your source for high-quality, scalable web assembly.<br/>Generate components, create designs, and chat with AI in seconds.</div>
              </div>

              {/*
                OUTER RECT — the big full-width border rectangle.
                - border on all 4 sides
                - CTA button floats on the TOP border via .cta-float
                - beam canvases on all 4 border edges
                - inside: 3-col grid [left cards][textarea][right cards]
                - cards top and bottom of each side col → 4 corners
              */}
              <div className="outer-rect" ref={outerRef}>

                {/* CTA floating on the top border */}
                <div className="cta-float">
                  <button className="cta-btn" onClick={()=>send("Tell me about Purplex")}>START BUILDING FREE</button>
                </div>

                {/* Beam canvases */}
                <canvas ref={cvVL} className="cv-vl" style={{width:"2px"}}/>
                <canvas ref={cvVR} className="cv-vr" style={{width:"2px"}}/>
                <canvas ref={cvHL} className="cv-hl" style={{height:"2px"}}/>
                <canvas ref={cvHR} className="cv-hr" style={{height:"2px"}}/>

                {/* 3-col inner grid */}
                <div className="rect-inner">

                  {/* LEFT card column */}
                  <div className="card-col">
                    <div className="card-item">
                      <div className="card-box">
                        <svg viewBox="0 0 24 24"{...IS}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      </div>
                      <div className="card-lbl">Code Gen</div>
                    </div>
                    <div className="card-item">
                      <div className="card-box">
                        <svg viewBox="0 0 24 24"{...IS}><rect x="3"y="3"width="7"height="7"/><rect x="14"y="3"width="7"height="7"/><rect x="14"y="14"width="7"height="7"/><rect x="3"y="14"width="7"height="7"/></svg>
                      </div>
                      <div className="card-lbl">Components</div>
                    </div>
                  </div>

                  {/* CENTER: textarea + toolbar */}
                  <div className="center-col">
                    <div className="chat-box">
                      <textarea
                        className="big-ta"
                        placeholder="ASK: Generate a complex component architecture..."
                        value={inputVal}
                        onChange={e=>setInputVal(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(inputVal);}}}
                        rows={7}
                      />
                      <div className="toolbar">
                        <button className="tb-btn"><GearSVG/></button>
                        <button className="sc-btn"><GridSVG/>/Search-Command</button>
                        <button className="send-btn"onClick={()=>send(inputVal)}><ArrowSVG/></button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT card column */}
                  <div className="card-col">
                    <div className="card-item">
                      <div className="card-box">
                        <svg viewBox="0 0 24 24"{...IS}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                      </div>
                      <div className="card-lbl">Design Sys</div>
                    </div>
                    <div className="card-item">
                      <div className="card-box">
                        <svg viewBox="0 0 24 24"{...IS}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </div>
                      <div className="card-lbl">AI Support</div>
                    </div>
                  </div>

                </div>{/* rect-inner */}
              </div>{/* outer-rect */}

            </div>
          ):(
            <div className="msgs">
              {messages.map((m,i)=>(
                <div key={i}className="msg">
                  {m.role==="user"?(
                    <div className="msg-user"><div className="msg-user-bubble">{m.text}</div></div>
                  ):(
                    <div className="msg-ai">
                      <div className="ai-av">P</div>
                      <div className="ai-body">
                        <div className="ai-who">Purplex</div>
                        <div className="ai-txt">{m.text}</div>
                        {m.sources&&<div className="sources">{m.sources.map((s,si)=><span key={si}className="src">{s}</span>)}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {typing&&(
                <div className="msg msg-ai">
                  <div className="ai-av">P</div>
                  <div className="ai-body">
                    <div className="ai-who">Purplex</div>
                    <div className="typing-dots"><span className="td"/><span className="td"/><span className="td"/></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {mode==="chat"&&(
          <div className="btm">
            <div className="btm-inner">
              <textarea className="btm-ta"placeholder="Ask a follow-up..."rows={1}value={inputVal}
                onChange={e=>setInputVal(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(inputVal);}}}
              />
              <button className="tb-btn"><GearSVG/></button>
              <button className="sc-btn"style={{whiteSpace:"nowrap"}}><GridSVG/>/Search-Command</button>
              <button className="send-btn"onClick={()=>send(inputVal)}><ArrowSVG/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}