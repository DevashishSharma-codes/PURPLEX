import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --ink:#2c1f14;--ink2:#5a3e2b;--ink3:#9c7e6a;
  --paper:#f7f2e8;--paper2:#efe7d6;--paper3:#e6dac8;
  --dash:rgba(44,31,20,0.15);
  --accent:#c4714a;--accent2:#d4896a;
}
html{scroll-behavior:smooth}
body{font-family:'Geist',sans-serif;background:var(--paper);color:var(--ink);overflow-x:hidden;margin:0}

@keyframes bpulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fpop{0%,80%,100%{transform:scale(1);opacity:.4}40%{transform:scale(1.4);opacity:1}}
@keyframes win{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

.px-nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;height:58px;background:rgba(247,242,232,0.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(44,31,20,0.08)}
.px-logo{font-family:'Libre Baskerville',serif;font-size:1.3rem;color:var(--ink);letter-spacing:-0.02em;display:flex;align-items:center;gap:8px;cursor:pointer;text-decoration:none}
.px-logo-mark{width:22px;height:22px;border:1.5px solid rgba(44,31,20,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:600;font-family:'Geist',sans-serif;color:var(--ink)}
.px-nav-links{display:flex;gap:0;list-style:none;position:relative}
.px-nav-item{position:relative}
.px-nav-item>a,.px-nav-item>button{font-size:0.78rem;letter-spacing:0.04em;color:rgba(44,31,20,0.45);text-decoration:none;text-transform:uppercase;transition:color .2s;background:none;border:none;cursor:pointer;font-family:'Geist',sans-serif;padding:.4rem 1rem;display:flex;align-items:center;gap:4px;height:58px}
.px-nav-item>a:hover,.px-nav-item>button:hover{color:rgba(44,31,20,.85)}
.px-chevron{font-size:.55rem;opacity:.5;transition:transform .2s}
.px-nav-item.open .px-chevron{transform:rotate(180deg)}
.px-dropdown{position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);background:rgba(247,242,232,0.98);border:1px solid rgba(44,31,20,.08);border-radius:10px;padding:.5rem;min-width:240px;box-shadow:0 20px 60px rgba(44,20,10,.1);animation:slideDown .18s ease both;z-index:300}
.px-dropdown-item{display:flex;align-items:flex-start;gap:10px;padding:.65rem .8rem;border-radius:7px;cursor:pointer;transition:background .15s;text-decoration:none}
.px-dropdown-item:hover{background:var(--paper2)}
.px-di-icon{width:28px;height:28px;border-radius:6px;background:rgba(196,113,74,.12);border:1px solid rgba(196,113,74,.2);display:flex;align-items:center;justify-content:center;font-size:.8rem;flex-shrink:0;margin-top:1px}
.px-di-title{font-size:.75rem;color:var(--ink2);font-family:'Geist',sans-serif;font-weight:500;margin-bottom:.15rem}
.px-di-sub{font-size:.65rem;color:var(--ink3);font-family:'Geist',sans-serif;line-height:1.4}
.px-nav-right{display:flex;align-items:center;gap:.75rem}
.px-btn-ghost-nav{font-family:'Geist',sans-serif;font-size:.8rem;color:var(--ink3);background:none;border:none;cursor:pointer;padding:.4rem .8rem}
.px-btn-nav{font-family:'Geist',sans-serif;font-size:.8rem;font-weight:500;background:var(--accent);color:#f7f0e6;border:none;padding:.5rem 1.2rem;cursor:pointer;border-radius:6px;transition:background .2s}
.px-btn-nav:hover{background:#a85c38}

.px-hero-wrap{background:var(--paper);position:relative;overflow:hidden;padding-top:58px;min-height:100vh;display:flex;flex-direction:column}
.px-ascii-canvas{position:relative;width:100%;height:280px;display:block;flex-shrink:0;z-index:2}
.px-hero-inner{position:relative;z-index:4;flex:1;display:flex;flex-direction:column;align-items:center;max-width:1200px;margin:0 auto;padding:2rem 2.5rem 4rem;width:100%;animation:fadeUp .9s ease both}
.px-hero-left{display:flex;flex-direction:column;align-items:center;text-align:center;width:100%;margin-bottom:3rem}
.px-hero-right{width:100%;display:flex;align-items:flex-start;justify-content:center;animation:fadeUp .9s .22s ease both}
.px-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(196,113,74,0.1);border:1px solid rgba(196,113,74,0.22);border-radius:999px;padding:.35rem 1.1rem;font-size:.7rem;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--accent2);margin-bottom:1.5rem}
.px-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:bpulse 2s infinite;flex-shrink:0}
.px-h1{font-family:'Libre Baskerville',serif;font-size:clamp(3.2rem,5.5vw,6rem);line-height:1.05;letter-spacing:-.04em;color:var(--ink);margin-bottom:1.4rem}
.px-h1 em{font-style:italic;color:var(--ink3)}
.px-hero-p{font-size:1rem;font-weight:300;color:var(--ink3);line-height:1.75;max-width:480px;margin:0 0 2.2rem}
.px-hero-btns{display:flex;align-items:center;justify-content:center;gap:1rem;flex-wrap:wrap}
.px-btn-cta{font-family:'Geist',sans-serif;font-size:.9rem;font-weight:500;background:var(--accent);color:#f7f0e6;border:none;padding:.8rem 2rem;cursor:pointer;border-radius:7px;transition:background .2s,transform .15s}
.px-btn-cta:hover{background:#a85c38;transform:translateY(-1px)}
.px-btn-ghost2{font-size:.9rem;color:var(--ink2);display:flex;align-items:center;gap:6px;cursor:pointer;background:none;border:1px solid rgba(44,31,20,0.18);padding:.8rem 1.6rem;border-radius:7px;font-family:'Geist',sans-serif;transition:all .2s}
.px-btn-ghost2:hover{color:var(--ink);border-color:rgba(44,31,20,.35)}

.px-mac-window{background:#faf5ec;border:1px solid rgba(44,31,20,0.1);border-radius:12px 12px 0 0;overflow:hidden;width:100%;max-width:900px;box-shadow:0 0 0 1px rgba(44,31,20,.03),0 40px 80px rgba(44,20,10,0.1)}
.px-mac-bar{display:flex;align-items:center;gap:8px;padding:.72rem 1.1rem;background:#ede6d5;border-bottom:1px solid rgba(44,31,20,.06)}
.px-mac-dot{width:11px;height:11px;border-radius:50%}
.px-mac-url{flex:1;margin:0 .8rem;background:rgba(44,31,20,.05);border-radius:5px;padding:.28rem .85rem;font-size:.7rem;color:var(--ink3);font-family:'Geist',sans-serif;display:flex;align-items:center;gap:6px}
.px-mac-content{padding:.9rem 1.4rem;min-height:180px;position:relative;overflow:hidden;background:#f5ede0}
.px-search-bar{display:flex;align-items:center;gap:10px;background:#faf5ec;border:1px solid rgba(44,31,20,.1);border-radius:7px;padding:.7rem 1.1rem;margin-bottom:1.25rem}
.px-brand-tag{font-family:'Libre Baskerville',serif;font-size:.75rem;color:var(--ink3);display:flex;align-items:center;gap:5px;flex-shrink:0;border-right:1px solid rgba(44,31,20,.08);padding-right:12px}
.px-brand-dot{width:6px;height:6px;border-radius:50%;background:var(--accent)}
.px-stext{font-size:.85rem;color:var(--ink);font-family:'Geist',sans-serif;font-weight:300;flex:1;min-height:20px}
.px-cursor{display:inline-block;width:2px;height:14px;background:rgba(196,113,74,.9);margin-left:1px;vertical-align:middle;animation:blink 1s step-end infinite}
.px-sbtn{font-family:'Geist',sans-serif;font-size:.7rem;font-weight:500;background:var(--accent);color:#f7f0e6;border:none;padding:.35rem .9rem;border-radius:5px;cursor:pointer;flex-shrink:0}
.px-fetch-row{display:flex;gap:6px;align-items:center;margin-bottom:1.1rem;transition:opacity .4s}
.px-fdot{width:6px;height:6px;border-radius:50%;background:rgba(196,113,74,.7);animation:fpop 1.2s ease infinite}
.px-fdot:nth-child(2){animation-delay:.2s}.px-fdot:nth-child(3){animation-delay:.4s}
.px-flbl{font-size:.63rem;color:var(--ink3);font-family:'Geist',sans-serif;letter-spacing:.04em}
.px-flow-area{display:flex;gap:1rem;align-items:flex-start}
.px-flow-main{flex:1;min-width:0}
.px-flow-side{width:220px;flex-shrink:0}
.px-abox{background:#faf5ec;border:1px solid rgba(44,31,20,.07);border-radius:7px;padding:.9rem 1rem}
.px-albl{font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:rgba(196,113,74,.85);margin-bottom:.7rem;font-family:'Geist',sans-serif;display:flex;align-items:center;gap:6px}
.px-albl::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;animation:bpulse 1.5s infinite}
.px-atxt{font-size:.78rem;color:var(--ink2);font-family:'Geist',sans-serif;font-weight:300;line-height:1.75}
.px-aword{opacity:0;display:inline}
.px-aword.show{animation:win .15s ease forwards}
.px-spanel{background:#faf5ec;border:1px solid rgba(44,31,20,.07);border-radius:7px;padding:.85rem}
.px-slbl{font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:.75rem;font-family:'Geist',sans-serif}
.px-sitem{display:flex;align-items:center;gap:8px;padding:.4rem 0;border-bottom:1px solid rgba(44,31,20,.05);opacity:0;transform:translateX(8px);transition:opacity .4s,transform .4s}
.px-sitem.show{opacity:1;transform:translateX(0)}
.px-sitem:last-child{border-bottom:none}
.px-sfav{width:16px;height:16px;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.52rem;font-weight:700;color:#fff;font-family:'Geist',sans-serif}
.px-sdom{font-size:.6rem;color:var(--ink2);font-family:'Geist',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.px-stitl{font-size:.56rem;color:var(--ink3);font-family:'Geist',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.px-chips{display:flex;gap:5px;flex-wrap:wrap;margin-top:.8rem}
.px-chip{font-size:.6rem;font-family:'Geist',sans-serif;background:rgba(196,113,74,.1);color:rgba(196,113,74,.9);border:1px solid rgba(196,113,74,.22);padding:.2rem .55rem;border-radius:4px;opacity:0;transition:opacity .3s}
.px-chip.show{opacity:1}

.px-page{max-width:1200px;margin:0 auto;border-left:1px dashed var(--dash);border-right:1px dashed var(--dash)}
.px-flabel{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-bottom:1rem}

.px-stats-bento{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px dashed var(--dash)}
.px-stat{padding:2.5rem 3rem;border-right:1px dashed var(--dash)}
.px-stat:last-child{border-right:none}
.px-stat-num{font-family:'Libre Baskerville',serif;font-size:2.8rem;letter-spacing:-.04em;color:var(--ink);line-height:1;margin-bottom:.4rem}
.px-stat-num sup{font-size:1.2rem;vertical-align:super}
.px-stat-lbl{font-size:.78rem;color:var(--ink3);letter-spacing:.04em;text-transform:uppercase}

.px-mq-wrap{background:var(--paper3);border-bottom:1px dashed var(--dash);padding:1rem 0;overflow:hidden}
.px-mq-track{display:flex;gap:3rem;animation:mq 18s linear infinite;width:max-content}
.px-mq-item{font-family:'Libre Baskerville',serif;font-size:.85rem;font-style:italic;color:var(--ink3);white-space:nowrap;display:flex;align-items:center;gap:1rem}
.px-mq-sep{width:4px;height:4px;border-radius:50%;background:var(--ink3);flex-shrink:0}

.px-graph-bento{display:grid;grid-template-columns:1fr 2fr;border-bottom:1px dashed var(--dash);min-height:500px}
.px-graph-intro{padding:4rem 3rem;border-right:1px dashed var(--dash);display:flex;flex-direction:column;justify-content:center}
.px-graph-intro h2{font-family:'Libre Baskerville',serif;font-size:1.9rem;line-height:1.2;letter-spacing:-.025em;color:var(--ink);margin-bottom:1rem}
.px-graph-intro h2 em{font-style:italic;color:var(--ink3)}
.px-graph-intro p{font-size:.85rem;color:var(--ink3);line-height:1.75;font-weight:300}
.px-graph-cell{background:var(--paper2);position:relative;overflow:hidden;min-height:500px}
.px-graph-cell::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(44,31,20,0.09) 1px,transparent 1px);background-size:24px 24px;pointer-events:none;z-index:0}
.px-graph-canvas{display:block;width:100%;height:100%;position:absolute;inset:0;z-index:1}

.px-feat-bento{display:grid;grid-template-columns:1fr 2fr;border-bottom:1px dashed var(--dash)}
.px-feat-intro{padding:4rem 3rem;border-right:1px dashed var(--dash);display:flex;flex-direction:column;justify-content:center}
.px-feat-h{font-family:'Libre Baskerville',serif;font-size:1.9rem;line-height:1.2;letter-spacing:-.025em;color:var(--ink)}
.px-feat-h em{font-style:italic;color:var(--ink3)}
.px-feat-grid{display:grid;grid-template-columns:1fr 1fr}
.px-feat-item{padding:2.25rem 2.5rem;border-bottom:1px dashed var(--dash);border-right:1px dashed var(--dash);transition:background .2s}
.px-feat-item:nth-child(2n){border-right:none}
.px-feat-item:nth-last-child(-n+2){border-bottom:none}
.px-feat-item:hover{background:var(--paper2)}
.px-feat-n{font-family:'Libre Baskerville',serif;font-size:.8rem;color:var(--ink3);margin-bottom:1rem;font-style:italic}
.px-feat-item h3{font-family:'Libre Baskerville',serif;font-size:1rem;color:var(--ink);margin-bottom:.5rem;letter-spacing:-.01em}
.px-feat-item p{font-size:.82rem;color:var(--ink3);line-height:1.7;font-weight:300}

.px-features-section{border-top:1px dashed var(--dash)}
.px-features-hero{padding:5rem 3rem 4rem;border-bottom:1px dashed var(--dash);display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.px-features-hero-left h2{font-family:'Libre Baskerville',serif;font-size:clamp(1.8rem,3vw,2.6rem);line-height:1.15;letter-spacing:-.03em;color:var(--ink);margin-bottom:1.25rem;margin-top:.75rem}
.px-features-hero-left h2 em{font-style:italic;color:var(--ink3)}
.px-features-hero-left p{font-size:.88rem;color:var(--ink3);font-weight:300;line-height:1.8}
.px-feat-pill-row{display:flex;flex-direction:column;gap:.9rem}
.px-feat-pill{display:flex;align-items:center;gap:1rem;background:var(--paper2);border:1px dashed var(--dash);border-radius:10px;padding:1rem 1.25rem;transition:border-color .2s,background .2s;cursor:default}
.px-feat-pill:hover{background:var(--paper3);border-color:rgba(196,113,74,.3)}
.px-feat-pill-icon{width:34px;height:34px;border-radius:8px;background:rgba(196,113,74,.1);border:1px solid rgba(196,113,74,.2);display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0}
.px-feat-pill-text h4{font-family:'Geist',sans-serif;font-size:.82rem;font-weight:500;color:var(--ink);margin-bottom:.18rem}
.px-feat-pill-text p{font-size:.72rem;color:var(--ink3);line-height:1.45;font-weight:300}
.px-deep-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px dashed var(--dash)}
.px-deep-cell{padding:2.5rem;border-right:1px dashed var(--dash);border-bottom:1px dashed var(--dash);transition:background .2s}
.px-deep-cell:nth-child(3n){border-right:none}
.px-deep-cell:nth-last-child(-n+3){border-bottom:none}
.px-deep-cell:hover{background:var(--paper2)}
.px-deep-icon{font-size:1.3rem;margin-bottom:.9rem}
.px-deep-cell h4{font-family:'Libre Baskerville',serif;font-size:.93rem;color:var(--ink);margin-bottom:.45rem}
.px-deep-cell p{font-size:.77rem;color:var(--ink3);line-height:1.7;font-weight:300}

.px-pricing-wrap{padding:5rem 3rem}
.px-pricing-top{text-align:center;margin-bottom:4rem}
.px-pricing-top h2{font-family:'Libre Baskerville',serif;font-size:clamp(2rem,3.5vw,3rem);line-height:1.1;letter-spacing:-.03em;color:var(--ink);margin-bottom:1rem;margin-top:.75rem}
.px-pricing-top h2 em{font-style:italic;color:var(--ink3)}
.px-pricing-top>p{font-size:.9rem;color:var(--ink3);font-weight:300;line-height:1.75}
.px-toggle-row{display:flex;align-items:center;justify-content:center;gap:.75rem;margin-top:1.75rem}
.px-toggle-lbl{font-size:.78rem;color:var(--ink3);font-family:'Geist',sans-serif}
.px-toggle{width:42px;height:24px;background:var(--paper3);border:1px solid var(--dash);border-radius:999px;position:relative;cursor:pointer;transition:background .2s}
.px-toggle.on{background:var(--accent)}
.px-toggle-thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.px-toggle.on .px-toggle-thumb{transform:translateX(18px)}
.px-save-badge{font-size:.62rem;background:rgba(196,113,74,.1);color:var(--accent);border:1px solid rgba(196,113,74,.22);border-radius:999px;padding:.2rem .6rem;font-family:'Geist',sans-serif;font-weight:500}
.px-plans{display:grid;grid-template-columns:repeat(3,1fr);border:1px dashed var(--dash);border-radius:12px;overflow:hidden}
.px-plan{padding:2.5rem 2rem;border-right:1px dashed var(--dash);transition:background .2s}
.px-plan:last-child{border-right:none}
.px-plan:hover{background:var(--paper2)}
.px-plan.featured{background:#3d2415}
.px-plan.featured:hover{background:#331d10}
.px-plan-badge{display:inline-block;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;background:rgba(196,113,74,.12);color:var(--accent2);border:1px solid rgba(196,113,74,.22);border-radius:999px;padding:.2rem .65rem;margin-bottom:1.25rem;font-family:'Geist',sans-serif}
.px-plan.featured .px-plan-badge{background:rgba(196,113,74,.25);color:#f0c4a0;border-color:rgba(196,113,74,.4)}
.px-plan-name{font-family:'Libre Baskerville',serif;font-size:1.1rem;color:var(--ink);margin-bottom:.5rem}
.px-plan.featured .px-plan-name{color:#ecdcc8}
.px-plan-price{font-family:'Libre Baskerville',serif;font-size:2.6rem;letter-spacing:-.04em;color:var(--ink);line-height:1;margin-bottom:.35rem}
.px-plan.featured .px-plan-price{color:#f5ede0}
.px-plan-price sup{font-size:1rem;vertical-align:super}
.px-plan-price sub{font-size:.75rem;font-family:'Geist',sans-serif;font-weight:300;letter-spacing:0;vertical-align:baseline}
.px-plan-desc{font-size:.77rem;color:var(--ink3);font-weight:300;line-height:1.65;margin-bottom:1.75rem}
.px-plan.featured .px-plan-desc{color:rgba(236,220,200,.45)}
.px-plan-divider{border:none;border-top:1px dashed var(--dash);margin-bottom:1.5rem}
.px-plan.featured .px-plan-divider{border-color:rgba(255,255,255,.07)}
.px-plan-features{list-style:none;display:flex;flex-direction:column;gap:.6rem;margin-bottom:2rem}
.px-plan-features li{font-size:.77rem;color:var(--ink2);font-family:'Geist',sans-serif;display:flex;align-items:flex-start;gap:.55rem;line-height:1.45}
.px-plan.featured .px-plan-features li{color:rgba(236,220,200,.65)}
.px-feat-check{color:var(--accent);font-size:.68rem;margin-top:.1rem;flex-shrink:0}
.px-plan.featured .px-feat-check{color:var(--accent2)}
.px-plan-btn{width:100%;font-family:'Geist',sans-serif;font-size:.82rem;font-weight:500;padding:.7rem 1rem;border-radius:7px;cursor:pointer;transition:all .2s;border:1px solid var(--dash);background:none;color:var(--ink)}
.px-plan-btn:hover{background:var(--paper3)}
.px-plan.featured .px-plan-btn{background:var(--accent);border-color:var(--accent);color:#f7f0e6}
.px-plan.featured .px-plan-btn:hover{background:#a85c38}
.px-pricing-note{text-align:center;margin-top:1.75rem;font-size:.74rem;color:var(--ink3);font-weight:300}
.px-pricing-note a{color:var(--accent);text-decoration:none}

.px-blog-header{padding:5rem 3rem 3.5rem;border-bottom:1px dashed var(--dash);display:flex;align-items:flex-end;justify-content:space-between;gap:2rem}
.px-blog-header-left h2{font-family:'Libre Baskerville',serif;font-size:clamp(1.8rem,3vw,2.8rem);line-height:1.1;letter-spacing:-.03em;color:var(--ink);margin-top:.75rem}
.px-blog-header-left h2 em{font-style:italic;color:var(--ink3)}
.px-btn-text{font-family:'Geist',sans-serif;font-size:.78rem;color:var(--accent);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;transition:gap .2s;white-space:nowrap}
.px-btn-text:hover{gap:9px}
.px-blog-featured{display:grid;grid-template-columns:2fr 1fr;border-bottom:1px dashed var(--dash)}
.px-blog-main{padding:3rem;border-right:1px dashed var(--dash);cursor:pointer;transition:background .2s}
.px-blog-main:hover{background:var(--paper2)}
.px-post-cat{display:inline-flex;align-items:center;gap:6px;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);font-family:'Geist',sans-serif;margin-bottom:1.25rem}
.px-post-cat-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0}
.px-blog-main h3{font-family:'Libre Baskerville',serif;font-size:1.55rem;line-height:1.25;letter-spacing:-.025em;color:var(--ink);margin-bottom:1rem}
.px-blog-main>p{font-size:.87rem;color:var(--ink3);line-height:1.8;font-weight:300;margin-bottom:1.5rem;max-width:480px}
.px-post-meta{display:flex;align-items:center;gap:.85rem;font-size:.7rem;color:var(--ink3);font-family:'Geist',sans-serif}
.px-post-avatar{width:24px;height:24px;border-radius:50%;background:var(--ink2);display:flex;align-items:center;justify-content:center;font-size:.58rem;color:#f7f0e6;font-weight:600;flex-shrink:0}
.px-post-meta-sep{width:3px;height:3px;border-radius:50%;background:var(--ink3);flex-shrink:0}
.px-blog-side{display:flex;flex-direction:column}
.px-blog-small{padding:2rem;border-bottom:1px dashed var(--dash);cursor:pointer;transition:background .2s;flex:1}
.px-blog-small:last-child{border-bottom:none}
.px-blog-small:hover{background:var(--paper2)}
.px-blog-small h4{font-family:'Libre Baskerville',serif;font-size:.93rem;line-height:1.35;color:var(--ink);margin-bottom:.55rem}
.px-blog-small>p{font-size:.74rem;color:var(--ink3);line-height:1.65;font-weight:300;margin-bottom:.85rem}
.px-blog-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px dashed var(--dash)}
.px-blog-card{padding:2.5rem 2rem;border-right:1px dashed var(--dash);cursor:pointer;transition:background .2s}
.px-blog-card:last-child{border-right:none}
.px-blog-card:hover{background:var(--paper2)}
.px-blog-card h4{font-family:'Libre Baskerville',serif;font-size:.92rem;line-height:1.35;color:var(--ink);margin-bottom:.6rem}
.px-blog-card>p{font-size:.74rem;color:var(--ink3);line-height:1.65;font-weight:300;margin-bottom:1rem}

.px-docs-layout{display:grid;grid-template-columns:240px 1fr;min-height:70vh}
.px-docs-sidebar{padding:2.5rem 1.5rem;border-right:1px dashed var(--dash);position:sticky;top:58px;height:calc(100vh - 58px);overflow-y:auto}
.px-docs-sidebar-title{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);margin-bottom:1.25rem;font-family:'Geist',sans-serif}
.px-docs-nav-group{margin-bottom:1.75rem}
.px-docs-nav-group-label{font-size:.63rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-bottom:.55rem;font-family:'Geist',sans-serif;padding:.1rem 0}
.px-docs-nav-item{display:flex;align-items:center;gap:8px;font-size:.77rem;color:var(--ink2);font-family:'Geist',sans-serif;padding:.38rem .6rem;border-radius:5px;cursor:pointer;transition:background .15s,color .15s;font-weight:300}
.px-docs-nav-item:hover{background:var(--paper2);color:var(--ink)}
.px-docs-nav-item.active{background:rgba(196,113,74,.08);color:var(--accent);font-weight:500}
.px-docs-nav-dot{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.4;flex-shrink:0}
.px-docs-main{padding:3.5rem 3rem}
.px-docs-breadcrumb{font-size:.7rem;color:var(--ink3);font-family:'Geist',sans-serif;margin-bottom:1.75rem;display:flex;align-items:center;gap:.45rem}
.px-docs-breadcrumb span{opacity:.5}
.px-docs-main h2{font-family:'Libre Baskerville',serif;font-size:1.9rem;letter-spacing:-.025em;color:var(--ink);margin-bottom:.7rem}
.px-docs-main>p{font-size:.88rem;color:var(--ink3);line-height:1.8;font-weight:300;margin-bottom:2.25rem;max-width:580px}
.px-docs-quickstart{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:2.5rem}
.px-docs-card{background:var(--paper2);border:1px dashed var(--dash);border-radius:8px;padding:1.4rem;cursor:pointer;transition:border-color .2s,background .2s}
.px-docs-card:hover{border-color:rgba(196,113,74,.4);background:var(--paper3)}
.px-docs-card-icon{font-size:1.15rem;margin-bottom:.7rem}
.px-docs-card h4{font-family:'Libre Baskerville',serif;font-size:.88rem;color:var(--ink);margin-bottom:.35rem}
.px-docs-card p{font-size:.73rem;color:var(--ink3);line-height:1.6;font-weight:300}
.px-docs-divider{border:none;border-top:1px dashed var(--dash);margin:2.25rem 0}
.px-docs-step-list{display:flex;flex-direction:column;gap:1.4rem;margin-bottom:2.25rem}
.px-docs-step{display:flex;gap:1rem}
.px-docs-step-num{width:26px;height:26px;border-radius:50%;background:rgba(196,113,74,.1);border:1px solid rgba(196,113,74,.25);display:flex;align-items:center;justify-content:center;font-size:.63rem;font-weight:600;color:var(--accent);font-family:'Geist',sans-serif;flex-shrink:0;margin-top:.05rem}
.px-docs-step h4{font-family:'Geist',sans-serif;font-size:.84rem;font-weight:500;color:var(--ink);margin-bottom:.3rem}
.px-docs-step p{font-size:.77rem;color:var(--ink3);line-height:1.65;font-weight:300}
.px-docs-code-block{background:#2c1f14;border-radius:8px;overflow:hidden;margin-bottom:2rem}
.px-docs-code-bar{display:flex;align-items:center;justify-content:space-between;padding:.55rem 1rem;border-bottom:1px solid rgba(255,255,255,.06)}
.px-docs-code-lang{font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.28);font-family:'Geist',sans-serif}
.px-docs-code-copy{font-size:.62rem;color:rgba(196,113,74,.8);font-family:'Geist',sans-serif;background:none;border:none;cursor:pointer;transition:color .2s}
.px-docs-code-copy:hover{color:var(--accent2)}
.px-docs-code-body{padding:1.25rem 1.5rem;font-family:'Courier New',monospace;font-size:.77rem;line-height:1.85;color:rgba(230,210,185,.7);overflow-x:auto;white-space:pre}
.px-kw{color:#d4896a}.px-str{color:#a8c8a0}.px-cm{color:rgba(255,255,255,.26);font-style:italic}

.px-cta-bento{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px dashed var(--dash)}
.px-cta-l{padding:5rem 3rem;border-right:1px dashed var(--dash);display:flex;align-items:center}
.px-cta-l h2{font-family:'Libre Baskerville',serif;font-size:clamp(2rem,3.5vw,3rem);line-height:1.1;letter-spacing:-.03em;color:var(--ink)}
.px-cta-l h2 em{font-style:italic;color:var(--ink3)}
.px-cta-r{padding:5rem 3rem;display:flex;flex-direction:column;justify-content:center}
.px-cta-r>p{font-size:1rem;color:var(--ink3);font-weight:300;line-height:1.7;margin-bottom:2rem}
.px-cta-acts{display:flex;gap:1rem;flex-wrap:wrap}
.px-btn-ac{font-family:'Geist',sans-serif;font-size:.875rem;font-weight:500;background:var(--accent);color:#f7f0e6;border:none;padding:.75rem 1.75rem;cursor:pointer;border-radius:6px;transition:background .2s}
.px-btn-ac:hover{background:var(--ink)}
.px-btn-ol{font-family:'Geist',sans-serif;font-size:.875rem;background:none;color:var(--ink);border:1px dashed var(--dash);padding:.75rem 1.75rem;cursor:pointer;border-radius:6px;transition:border-color .2s}
.px-btn-ol:hover{border-color:var(--ink3)}
.px-footer{background:var(--paper2);padding:3rem;display:grid;grid-template-columns:200px 1fr auto;gap:3rem;align-items:start}
.px-footer-brand p{font-size:.77rem;color:var(--ink3);font-weight:300;line-height:1.7;margin-top:.7rem}
.px-footer-links-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2rem}
.px-footer-col-title{font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin-bottom:1rem;font-family:'Geist',sans-serif}
.px-footer-col a{display:block;font-size:.77rem;color:var(--ink2);text-decoration:none;font-family:'Geist',sans-serif;margin-bottom:.45rem;transition:color .2s;font-weight:300}
.px-footer-col a:hover{color:var(--ink)}
.px-footer-right{display:flex;flex-direction:column;align-items:flex-end;gap:1rem}
.px-footer-socials{display:flex;gap:.5rem}
.px-social-btn{width:32px;height:32px;border-radius:6px;background:none;border:1px dashed var(--dash);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.75rem;transition:border-color .2s,background .2s;color:var(--ink2)}
.px-social-btn:hover{background:var(--paper3);border-color:var(--ink3)}
.px-footer-copy{font-size:.68rem;color:var(--ink3)}
`;

function AsciiCanvas() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const ALL = ["$","$","$","$","S","0","s","o","$","S","0","s","8","B","&","%"];
    const CELL = 8;
    let grid = [], cw = 0, ch = 0, rafId;
    function init() {
      const dpr = window.devicePixelRatio || 1;
      cw = window.innerWidth; ch = 280;
      cv.style.width = cw + "px"; cv.style.height = ch + "px";
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
      ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
      const cols = Math.floor(cw / CELL), rows = Math.floor(ch / CELL);
      const off = document.createElement("canvas"); off.width = cw; off.height = ch;
      const octx = off.getContext("2d");
      octx.fillStyle = "#ffffff"; octx.fillRect(0, 0, cw, ch);
      const fs = Math.floor(ch * 0.80);
      octx.font = `italic 900 ${fs}px 'Libre Baskerville',Georgia,serif`;
      octx.textAlign = "center"; octx.textBaseline = "middle"; octx.fillStyle = "#000";
      octx.fillText("Purplex", cw / 2, ch / 2 + fs * 0.04);
      const { data } = octx.getImageData(0, 0, cw, ch);
      grid = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const px = Math.min(Math.round(c * CELL + CELL/2), cw-1), py = Math.min(Math.round(r * CELL + CELL/2), ch-1);
        const darkness = 1 - data[(py * cw + px) * 4] / 255;
        if (darkness < 0.04) continue;
        // Sepia-toned: muted warm terracotta, less saturated
        const a = darkness > 0.55
          ? 0.82 + Math.random() * 0.12
          : darkness > 0.20
          ? 0.50 + darkness * 0.50
          : 0.22 + darkness * 1.1;
        grid.push({ c, r, darkness, baseAlpha: Math.min(a, 1), char: ALL[Math.floor(Math.random() * ALL.length)], timer: Math.floor(Math.random() * 40), flipSpeed: 8 + Math.floor(Math.random() * 32) });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, cw, ch);
      ctx.font = `bold ${CELL}px 'Courier New',monospace`; ctx.textAlign = "left"; ctx.textBaseline = "top";
      for (const cell of grid) {
        if (--cell.timer <= 0) {
          cell.timer = cell.flipSpeed + Math.floor(Math.random() * cell.flipSpeed);
          cell.char = ALL[Math.floor(Math.random() * ALL.length)];
        }
        const { darkness: d, baseAlpha: a } = cell;
        // Sepia terracotta: core ~#c4714a, dim edges ~#a05a38 — muted & warm
        const rC = Math.round(180 + d * 36);   // 180→216
        const gC = Math.round(90 + d * 28);    // 90→118
        const bC = Math.round(55 + d * 20);    // 55→75
        ctx.fillStyle = `rgba(${rC},${gC},${bC},${a.toFixed(3)})`;
        ctx.fillText(cell.char, cell.c * CELL, cell.r * CELL);
      }
      rafId = requestAnimationFrame(draw);
    }
    init(); setTimeout(() => { init(); draw(); }, 300);
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("resize", init); };
  }, []);
  return <canvas ref={cvRef} className="px-ascii-canvas" />;
}

function GraphCanvas() {
  const cvRef = useRef(null);
  useEffect(() => {
    const canvas = cvRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const wrap = canvas.parentElement;
    let rafId, nodes = {}, edges = [], adj = {};
    function W() { return wrap.clientWidth; } function H() { return wrap.clientHeight; }
    function resize() { const d = window.devicePixelRatio || 1; canvas.width = W()*d; canvas.height = H()*d; ctx.scale(d, d); }
    resize();
    function buildGraph() {
      const w = W(), h = H();
      nodes = { Q:{x:w*.50,y:h*.09,label:"Query",r:7},R1:{x:w*.18,y:h*.30,label:"Fetch",r:5},R2:{x:w*.50,y:h*.28,label:"Fetch",r:5},R3:{x:w*.82,y:h*.30,label:"Fetch",r:5},S1:{x:w*.08,y:h*.54,label:"wired",r:4},S2:{x:w*.28,y:h*.56,label:"arxiv",r:4},S3:{x:w*.50,y:h*.55,label:"reddit",r:4},S4:{x:w*.72,y:h*.56,label:"github",r:4},S5:{x:w*.92,y:h*.54,label:"linkedin",r:4},M:{x:w*.50,y:h*.75,label:"Merge",r:6},A:{x:w*.50,y:h*.91,label:"Answer",r:7} };
      edges = [["Q","R1"],["Q","R2"],["Q","R3"],["R1","S1"],["R1","S2"],["R2","S2"],["R2","S3"],["R2","S4"],["R3","S4"],["R3","S5"],["S1","M"],["S2","M"],["S3","M"],["S4","M"],["S5","M"],["M","A"],["A","Q"]];
      adj = {}; Object.keys(nodes).forEach(k => adj[k] = []); edges.forEach(([f,t]) => adj[f].push(t));
    }
    buildGraph();
    let pulseT = 0; const TRAIL = 14, particles = [];
    class P {
      constructor(ek, to) { this.ek=ek; this.from=nodes[ek[0]]; this.to=nodes[ek[1]]; this.t=to; this.spd=0.004+Math.random()*0.003; this.trail=[]; }
      nextEdge() { const o=adj[this.ek[1]]||[]; return o.length?[this.ek[1],o[Math.floor(Math.random()*o.length)]]:null; }
      update() { this.t+=this.spd; const x=this.from.x+(this.to.x-this.from.x)*Math.min(this.t,1),y=this.from.y+(this.to.y-this.from.y)*Math.min(this.t,1); this.trail.push({x,y}); if(this.trail.length>TRAIL)this.trail.shift(); if(this.t>=1){const n=this.nextEdge();if(n){this.ek=n;this.from=nodes[n[0]];this.to=nodes[n[1]];}this.t=0;this.trail=[];} }
      // Sepia-toned particles: muted terracotta
      draw() { if(this.trail.length<2)return; for(let i=1;i<this.trail.length;i++){const a=i/this.trail.length;ctx.beginPath();ctx.moveTo(this.trail[i-1].x,this.trail[i-1].y);ctx.lineTo(this.trail[i].x,this.trail[i].y);ctx.strokeStyle=`rgba(180,100,65,${(a*.65).toFixed(3)})`;ctx.lineWidth=1.8*a;ctx.lineCap="round";ctx.stroke();} const h=this.trail[this.trail.length-1];ctx.beginPath();ctx.arc(h.x,h.y,3,0,Math.PI*2);ctx.fillStyle="#b46441";ctx.fill();ctx.beginPath();ctx.arc(h.x,h.y,1.4,0,Math.PI*2);ctx.fillStyle="#f7f0e6";ctx.fill(); }
    }
    function spawn() { particles.length=0; const n=edges.length; for(let i=0;i<28;i++)particles.push(new P(edges[i%n],i/28)); }
    spawn();
    function loop() {
      ctx.clearRect(0,0,W(),H()); pulseT+=0.025;
      edges.forEach(([f,t])=>{const fn=nodes[f],tn=nodes[t];ctx.beginPath();ctx.moveTo(fn.x,fn.y);ctx.lineTo(tn.x,tn.y);ctx.strokeStyle="rgba(44,31,20,0.18)";ctx.lineWidth=1;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);});
      particles.forEach(p=>{p.update();p.draw();});
      Object.values(nodes).forEach(n=>{const ps=1+Math.sin(pulseT+n.x*.01)*.4;ctx.beginPath();ctx.arc(n.x,n.y,(n.r+5)*ps,0,Math.PI*2);ctx.fillStyle="rgba(180,100,65,0.08)";ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle="rgba(60,40,25,0.78)";ctx.fill();ctx.beginPath();ctx.arc(n.x,n.y,n.r+2.5,0,Math.PI*2);ctx.strokeStyle="rgba(90,62,43,0.6)";ctx.lineWidth=.75;ctx.setLineDash([2,3]);ctx.stroke();ctx.setLineDash([]);ctx.font="300 10px 'Geist',sans-serif";ctx.fillStyle="rgba(90,62,43,0.9)";ctx.textAlign="center";ctx.textBaseline="bottom";ctx.fillText(n.label,n.x,n.y-n.r-4);});
      rafId=requestAnimationFrame(loop);
    }
    loop();
    const ro = new ResizeObserver(() => { resize(); buildGraph(); spawn(); }); ro.observe(wrap);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);
  return <canvas ref={cvRef} className="px-graph-canvas" />;
}

const QS = [
  {q:"best AI search engine in 2026",a:"Purplex leads 2026 benchmarks with sub-300ms first-token latency. It reads live sources — not a frozen training snapshot — and returns a single cited answer instead of ten blue links.",s:[{bg:"#b05030",l:"W",d:"wired.com",t:"Best AI search 2026"},{bg:"#5a7fa0",l:"L",d:"linkedin.com",t:"AI trends this quarter"},{bg:"#c04a30",l:"R",d:"reddit.com",t:"r/MachineLearning"},{bg:"#3a2a1e",l:"A",d:"arxiv.org",t:"RAG benchmarks 2026"},{bg:"#2e3830",l:"G",d:"github.com",t:"vector-db benchmarks"}],ch:["wired.com","arxiv.org","linkedin.com"]},
  {q:"how does RAG differ from fine-tuning?",a:"RAG retrieves external documents at inference time — no weights change. Fine-tuning bakes knowledge into weights permanently. RAG wins on freshness and cost; fine-tuning wins on latency.",s:[{bg:"#3a2a1e",l:"A",d:"arxiv.org",t:"RAG vs Fine-Tuning"},{bg:"#2e3830",l:"G",d:"github.com",t:"llama-index examples"},{bg:"#b06040",l:"H",d:"huggingface.co",t:"PEFT vs RAG guide"},{bg:"#5a7fa0",l:"L",d:"linkedin.com",t:"LLM digest"},{bg:"#6a5a90",l:"O",d:"openai.com",t:"Fine-tuning cookbook"}],ch:["arxiv.org","huggingface.co","github.com"]},
  {q:"what is vector similarity search?",a:"Vector similarity search finds nearest neighbours to a query embedding in high-dimensional space. HNSW and FAISS are the dominant index structures used in production RAG pipelines.",s:[{bg:"#3a2a1e",l:"A",d:"arxiv.org",t:"HNSW paper 2016"},{bg:"#2e3830",l:"G",d:"github.com",t:"faiss — facebook"},{bg:"#b05030",l:"W",d:"wired.com",t:"Vector DBs explained"},{bg:"#3a7060",l:"P",d:"pinecone.io",t:"Pinecone index guide"},{bg:"#6a5a90",l:"C",d:"chroma.dev",t:"ChromaDB quickstart"}],ch:["arxiv.org","pinecone.io","faiss"]},
];
const FETCH_STAGES = ["searching the web...","reading 5 sources...","cross-referencing...","synthesising answer..."];

function MacWindow() {
  const [searchText, setSearchText] = useState("");
  const [fetchOpacity, setFetchOpacity] = useState(0);
  const [fetchLabel, setFetchLabel] = useState("searching the web...");
  const [answerWords, setAnswerWords] = useState([]);
  const [chips, setChips] = useState([]);
  const [sources, setSources] = useState([false,false,false,false,false]);
  const [qi, setQi] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    let tids = [];
    const T = (fn, ms) => { const id = setTimeout(fn, ms); tids.push(id); return id; };
    const ok = () => alive.current;
    function cycle(idx) {
      if (!ok()) return;
      const d = QS[idx % QS.length];
      setQi(idx % QS.length);
      setSearchText(""); setFetchOpacity(0); setFetchLabel("searching the web...");
      setAnswerWords([]); setChips([]); setSources([false,false,false,false,false]);
      let i = 0;
      function typeChar() {
        if (!ok()) return;
        if (i < d.q.length) { i++; setSearchText(d.q.slice(0, i)); T(typeChar, 46); }
        else {
          T(() => {
            if (!ok()) return;
            setFetchOpacity(1);
            FETCH_STAGES.forEach((s, si) => T(() => { if (ok()) setFetchLabel(s); }, si * 650));
            d.s.forEach((_, si) => T(() => { if (ok()) setSources(p => { const n=[...p]; n[si]=true; return n; }); }, si * 320 + 150));
            T(() => {
              if (!ok()) return;
              setFetchOpacity(0.3); setFetchLabel(`done — ${d.s.length} sources`);
              const ws = d.a.split(" ");
              ws.forEach((_, wi) => T(() => { if (ok()) setAnswerWords(p => [...p, ws[wi]]); }, wi * 34));
              T(() => {
                d.ch.forEach((c, ci) => T(() => { if (ok()) setChips(p => [...p, c]); }, ci * 140));
                T(() => {
                  if (!ok()) return;
                  let txt = d.q;
                  function erase() { if (!ok()) return; if (txt.length > 0) { txt=txt.slice(0,-1); setSearchText(txt); T(erase,28); } else { setAnswerWords([]); setChips([]); setSources([false,false,false,false,false]); T(()=>cycle(idx+1),400); } }
                  erase();
                }, 3200 + d.a.split(" ").length * 34 + 200);
              }, d.a.split(" ").length * 34 + 200);
            }, FETCH_STAGES.length * 650 + 500);
          }, 380);
        }
      }
      T(typeChar, 46);
    }
    T(() => cycle(0), 900);
    return () => { alive.current = false; tids.forEach(clearTimeout); };
  }, []);

  const d = QS[qi];
  return (
    <div className="px-mac-window">
      <div className="px-mac-bar">
        <span className="px-mac-dot" style={{background:"#c0614a"}}/><span className="px-mac-dot" style={{background:"#c09040"}}/><span className="px-mac-dot" style={{background:"#60a060"}}/>
        <div className="px-mac-url"><span style={{fontSize:".6rem",opacity:.35}}>🔒</span>purplex.ai</div>
      </div>
      <div className="px-mac-content">
        <div className="px-search-bar">
          <div className="px-brand-tag"><span className="px-brand-dot"/>purplex</div>
          <div className="px-stext">{searchText}<span className="px-cursor"/></div>
          <button className="px-sbtn">Search</button>
        </div>
        <div className="px-fetch-row" style={{opacity:fetchOpacity}}>
          <span className="px-fdot"/><span className="px-fdot"/><span className="px-fdot"/>
          <span className="px-flbl">{fetchLabel}</span>
        </div>
        <div className="px-flow-area">
          <div className="px-flow-main">
            <div className="px-abox">
              <div className="px-albl">Purplex answer</div>
              <div className="px-atxt">{answerWords.map((w,i)=><span key={i} className="px-aword show">{w} </span>)}</div>
              <div className="px-chips">{chips.map((c,i)=><span key={i} className="px-chip show">{c}</span>)}</div>
            </div>
          </div>
          <div className="px-flow-side">
            <div className="px-spanel">
              <div className="px-slbl">Sources retrieved</div>
              {[0,1,2,3,4].map(i=>(
                <div key={i} className={`px-sitem${sources[i]?" show":""}`}>
                  <div className="px-sfav" style={{background:d.s[i]?.bg}}>{d.s[i]?.l}</div>
                  <div style={{minWidth:0}}><div className="px-sdom">{d.s[i]?.d}</div><div className="px-stitl">{d.s[i]?.t}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEAT_DROPDOWN = [
  {icon:"⚡",title:"Live Web Retrieval",sub:"Real-time source fetching on every query"},
  {icon:"🧠",title:"Deep Reasoning",sub:"Cross-source synthesis, not just retrieval"},
  {icon:"🔗",title:"Full Citation Trail",sub:"Every claim linked to its source"},
  {icon:"📡",title:"Streaming Answers",sub:"First token under 300ms"},
];
const DOCS_DROPDOWN = [
  {icon:"🚀",title:"Quick Start",sub:"Up and running in 5 minutes"},
  {icon:"📦",title:"API Reference",sub:"Full endpoint and SDK documentation"},
  {icon:"🔌",title:"Integrations",sub:"Next.js, Python, REST, and more"},
];

function Dropdown({items}) {
  return (
    <div className="px-dropdown">
      {items.map((item,i) => (
        <a key={i} href="#" className="px-dropdown-item" onClick={e=>e.preventDefault()}>
          <div className="px-di-icon">{item.icon}</div>
          <div><div className="px-di-title">{item.title}</div><div className="px-di-sub">{item.sub}</div></div>
        </a>
      ))}
    </div>
  );
}

const DOCS_NAV = [
  {group:"Getting Started",items:["Introduction","Quick Start","Authentication","First Query"]},
  {group:"Core Concepts",items:["How Retrieval Works","Reasoning Modes","Citations","Streaming"]},
  {group:"API Reference",items:["POST /search","GET /status","Webhooks","Rate Limits"]},
  {group:"SDKs",items:["JavaScript","Python","Go","REST"]},
];
const MQ_ITEMS = ["Live web retrieval","Deep reasoning mode","Cited sources","Streaming answers","SOC 2 Type II","One-line API","No data logging"];

export default function Purplex() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [openNav, setOpenNav] = useState(null);
  const [annual, setAnnual] = useState(true);
  const [docsActive, setDocsActive] = useState("Quick Start");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!document.getElementById("px-css")) {
      const s = document.createElement("style"); s.id = "px-css"; s.textContent = GLOBAL_CSS; document.head.appendChild(s);
    }
    const close = () => setOpenNav(null);
    document.addEventListener("click", close);
    return () => { document.removeEventListener("click", close); const el=document.getElementById("px-css"); if(el)el.remove(); };
  }, []);

  function navToggle(e, name) { e.stopPropagation(); setOpenNav(p => p === name ? null : name); }
  function scrollTo(id) { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpenNav(null); }

  const prices = { Starter:{m:0,a:0}, Pro:{m:29,a:23}, Team:{m:99,a:79} };
  const P = (plan) => annual ? prices[plan].a : prices[plan].m;

  return (
    <>
      <nav className="px-nav">
        <a className="px-logo" href="#" onClick={e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"});}}>
          <div className="px-logo-mark">P</div>purplex
        </a>
        <ul className="px-nav-links">
          <li className={`px-nav-item${openNav==="features"?" open":""}`}>
            <button onClick={e=>navToggle(e,"features")}>Features <span className="px-chevron">▾</span></button>
            {openNav==="features" && <Dropdown items={FEAT_DROPDOWN}/>}
          </li>
          <li className="px-nav-item"><a href="#" onClick={e=>{e.preventDefault();scrollTo("pricing");}}>Pricing</a></li>
          <li className="px-nav-item"><a href="#" onClick={e=>{e.preventDefault();scrollTo("blog");}}>Blog</a></li>
          <li className={`px-nav-item${openNav==="docs"?" open":""}`}>
            <button onClick={e=>navToggle(e,"docs")}>Docs <span className="px-chevron">▾</span></button>
            {openNav==="docs" && <Dropdown items={DOCS_DROPDOWN}/>}
          </li>
        </ul>
        <div className="px-nav-right">
          <button className="px-btn-ghost-nav" onClick={() => navigate("/login")}>Sign in</button>
          <button className="px-btn-nav" onClick={() => navigate("/register")}>Get started →</button>
        </div>
      </nav>

      <div className="px-hero-wrap">
        <AsciiCanvas/>
        <div className="px-hero-inner">
          <div className="px-hero-left">
            <div className="px-badge"><span className="px-badge-dot"/>v1.0 release — now in public beta</div>
            <h1 className="px-h1">search that<br/><em>reasons,</em> not retrieves.</h1>
            <p className="px-hero-p">Purplex doesn't hand you ten blue links. It reads the web, thinks through it, and gives you one answer you can trust.</p>
            <div className="px-hero-btns">
              <button className="px-btn-cta" onClick={() => navigate("/register")}>Try Purplex free</button>
              <button className="px-btn-ghost2" onClick={()=>scrollTo("features")}>See how it works →</button>
            </div>
          </div>
          <div className="px-hero-right"><MacWindow/></div>
        </div>
      </div>

      <div style={{background:"var(--paper)"}}>
        <div className="px-page">
          <div className="px-stats-bento">
            <div className="px-stat"><div className="px-stat-num">40<sup>k</sup></div><div className="px-stat-lbl">Active builders</div></div>
            <div className="px-stat"><div className="px-stat-num">&lt;300<sup>ms</sup></div><div className="px-stat-lbl">First token latency</div></div>
            <div className="px-stat"><div className="px-stat-num">99.9<sup>%</sup></div><div className="px-stat-lbl">Uptime SLA</div></div>
          </div>
          <div className="px-mq-wrap">
            <div className="px-mq-track">
              {[...MQ_ITEMS,...MQ_ITEMS].map((item,i)=>(
                <span key={i} className="px-mq-item">{item}<span className="px-mq-sep"/></span>
              ))}
            </div>
          </div>
          <div className="px-graph-bento">
            <div className="px-graph-intro">
              <p className="px-flabel">How it works</p>
              <h2>query flows<br/>through the <em>web,</em><br/>not around it.</h2>
              <p>Every search fans out across live sources simultaneously — each node a real page being read, each edge a reasoning step connecting evidence into one coherent answer.</p>
            </div>
            <div className="px-graph-cell"><GraphCanvas/></div>
          </div>
          <div className="px-feat-bento">
            <div className="px-feat-intro">
              <p className="px-flabel">Why Purplex</p>
              <h2 className="px-feat-h">built for questions<br/>that <em>deserve</em><br/>real answers</h2>
            </div>
            <div className="px-feat-grid">
              {[{n:"01",h:"Live web grounding",p:"Every answer pulls from the live web — no stale training data, no confident hallucinations."},{n:"02",h:"Cross-source reasoning",p:"Deep mode reads across sources, resolves contradictions, and synthesises one coherent answer."},{n:"03",h:"Streaming first",p:"First token in under 300ms. You see the answer form in real time — no loading spinners."},{n:"04",h:"Full citation trail",p:"Every claim links to its source. Click to verify. Zero black boxes, full transparency."}].map((f,i)=>(
                <div key={i} className="px-feat-item"><div className="px-feat-n">{f.n}</div><h3>{f.h}</h3><p>{f.p}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div id="features" style={{background:"var(--paper)"}}>
        <div className="px-page px-features-section">
          <div className="px-features-hero">
            <div className="px-features-hero-left">
              <p className="px-flabel">Features</p>
              <h2>everything you need<br/>to ship <em>smarter</em> search</h2>
              <p>Purplex is a complete search intelligence layer — from raw retrieval to reasoned answers. Drop it in, ship it fast, trust the output.</p>
            </div>
            <div className="px-feat-pill-row">
              {[{icon:"⚡",title:"Sub-300ms to first token",desc:"Streaming architecture means users see answers forming instantly — no skeleton screens."},{icon:"🌐",title:"Live web, every time",desc:"No cached index. Every query reaches the live web for current, accurate answers."},{icon:"🔍",title:"Multi-source synthesis",desc:"Reads 5–20 sources simultaneously and resolves contradictions before answering."},{icon:"🔒",title:"Privacy-first by default",desc:"No query logging, no data retention. SOC 2 Type II certified."}].map((pill,i)=>(
                <div key={i} className="px-feat-pill">
                  <div className="px-feat-pill-icon">{pill.icon}</div>
                  <div className="px-feat-pill-text"><h4>{pill.title}</h4><p>{pill.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-deep-grid">
            {[{icon:"📡",h:"Streaming API",p:"Server-sent events for real-time token delivery. Works with any HTTP client."},{icon:"🧩",h:"One-line integration",p:"npm install purplex. Import. Drop the component. You're done."},{icon:"🗂️",h:"Namespace isolation",p:"Multi-tenant ready. Each workspace gets isolated retrieval and answer context."},{icon:"🔗",h:"Citation metadata",p:"Every claim returns source URL, title, and extracted snippet for verification."},{icon:"📊",h:"Usage analytics",p:"Query volume, latency percentiles, and source diversity — all in your dashboard."},{icon:"🛡️",h:"Content safety",p:"Built-in filtering for harmful, misleading, or off-topic retrieval results."}].map((cell,i)=>(
              <div key={i} className="px-deep-cell"><div className="px-deep-icon">{cell.icon}</div><h4>{cell.h}</h4><p>{cell.p}</p></div>
            ))}
          </div>
        </div>
      </div>

      <div id="pricing" style={{background:"var(--paper)"}}>
        <div className="px-page" style={{borderTop:"1px dashed var(--dash)"}}>
          <div className="px-pricing-wrap">
            <div className="px-pricing-top">
              <p className="px-flabel">Pricing</p>
              <h2>simple, <em>honest</em> pricing</h2>
              <p>Start free. Scale without surprises. No seat fees, no hidden retrieval costs.</p>
              <div className="px-toggle-row">
                <span className="px-toggle-lbl">Monthly</span>
                <div className={`px-toggle${annual?" on":""}`} onClick={()=>setAnnual(p=>!p)}><div className="px-toggle-thumb"/></div>
                <span className="px-toggle-lbl">Annual</span>
                {annual && <span className="px-save-badge">Save 20%</span>}
              </div>
            </div>
            <div className="px-plans">
              {[
                {name:"Starter",badge:"Free forever",price:null,desc:"Perfect for personal projects and tinkering.",features:["100 queries / month","3 sources per query","Standard latency","Community support","Public API access"],btn:"Start free",featured:false},
                {name:"Pro",badge:"Most popular",price:P("Pro"),desc:"For teams shipping products with search intelligence.",features:["10,000 queries / month","20 sources per query","Priority latency < 300ms","Email & chat support","Analytics dashboard","Custom namespaces"],btn:"Get started",featured:true},
                {name:"Team",badge:"For scale",price:P("Team"),desc:"Unlimited queries, dedicated infra, SLA guarantees.",features:["Unlimited queries","40 sources per query","Dedicated latency SLA","Slack + priority support","SSO & audit logs","Custom retention policy","99.9% uptime SLA"],btn:"Talk to sales",featured:false},
              ].map((plan,i)=>(
                <div key={i} className={`px-plan${plan.featured?" featured":""}`}>
                  <div className="px-plan-badge">{plan.badge}</div>
                  <div className="px-plan-name">{plan.name}</div>
                  <div className="px-plan-price">{plan.price===null?"Free":<><sup>$</sup>{plan.price}<sub>{annual?" /mo billed ann.":" /mo"}</sub></>}</div>
                  <div className="px-plan-desc">{plan.desc}</div>
                  <hr className="px-plan-divider"/>
                  <ul className="px-plan-features">{plan.features.map((f,fi)=><li key={fi}><span className="px-feat-check">✓</span>{f}</li>)}</ul>
                  <button className="px-plan-btn" onClick={() => navigate(plan.name === "Team" ? "/login" : "/register")}>{plan.btn}</button>
                </div>
              ))}
            </div>
            <p className="px-pricing-note">All plans include SSL and GDPR compliance. Questions? <a href="#">Talk to us →</a></p>
          </div>
        </div>
      </div>

      <div id="blog" style={{background:"var(--paper)"}}>
        <div className="px-page" style={{borderTop:"1px dashed var(--dash)"}}>
          <div className="px-blog-header">
            <div className="px-blog-header-left">
              <p className="px-flabel">Blog</p>
              <h2>thinking about<br/><em>search, reasoning,</em> and the web</h2>
            </div>
            <button className="px-btn-text">All posts →</button>
          </div>
          <div className="px-blog-featured">
            <div className="px-blog-main">
              <div className="px-post-cat"><span className="px-post-cat-dot"/>Engineering</div>
              <h3>Why retrieval-augmented generation is finally production-ready in 2026</h3>
              <p>For years RAG was a research idea — great in demos, brittle in production. Here's what changed: latency, tooling, and a new generation of vector indices that actually scale.</p>
              <div className="px-post-meta"><div className="px-post-avatar">JK</div><span>James Kim</span><span className="px-post-meta-sep"/><span>May 8, 2026</span><span className="px-post-meta-sep"/><span>8 min read</span></div>
            </div>
            <div className="px-blog-side">
              {[{cat:"Product",title:"Introducing deep reasoning mode",desc:"A new way to answer questions that require synthesising conflicting information across dozens of sources.",author:"Ana Reyes",date:"May 3"},{cat:"Research",title:"Benchmarking AI search in 2026",desc:"We ran 10,000 queries through seven AI search engines. Here's what the data says about accuracy and hallucination rates.",author:"Dev Patel",date:"Apr 28"}].map((post,i)=>(
                <div key={i} className="px-blog-small">
                  <div className="px-post-cat"><span className="px-post-cat-dot"/>{post.cat}</div>
                  <h4>{post.title}</h4><p>{post.desc}</p>
                  <div className="px-post-meta"><div className="px-post-avatar" style={{fontSize:".55rem"}}>{post.author.split(" ").map(w=>w[0]).join("")}</div><span>{post.author}</span><span className="px-post-meta-sep"/><span>{post.date}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-blog-grid">
            {[{cat:"Tutorial",title:"Build a cited Q&A bot in 20 lines of JS",desc:"Walk through the Purplex API to build a fully cited, streaming question-answering widget.",date:"Apr 22"},{cat:"Opinion",title:"The search bar is the last UI that hasn't changed",desc:"We rebuilt search from first principles. Here's why the ten blue links model was never going to survive AI.",date:"Apr 15"},{cat:"Engineering",title:"How we hit sub-300ms p99 latency at scale",desc:"A deep dive into our streaming pipeline, edge caching strategy, and the trade-offs we made.",date:"Apr 9"}].map((card,i)=>(
              <div key={i} className="px-blog-card"><div className="px-post-cat"><span className="px-post-cat-dot"/>{card.cat}</div><h4>{card.title}</h4><p>{card.desc}</p><div className="px-post-meta"><span>{card.date}</span></div></div>
            ))}
          </div>
        </div>
      </div>

      <div id="docs" style={{background:"var(--paper)"}}>
        <div className="px-page" style={{borderTop:"1px dashed var(--dash)"}}>
          <div className="px-docs-layout">
            <div className="px-docs-sidebar">
              <div className="px-docs-sidebar-title">Documentation</div>
              {DOCS_NAV.map((group,gi)=>(
                <div key={gi} className="px-docs-nav-group">
                  <div className="px-docs-nav-group-label">{group.group}</div>
                  {group.items.map((item,ii)=>(
                    <div key={ii} className={`px-docs-nav-item${docsActive===item?" active":""}`} onClick={()=>setDocsActive(item)}><span className="px-docs-nav-dot"/>{item}</div>
                  ))}
                </div>
              ))}
            </div>
            <div className="px-docs-main">
              <div className="px-docs-breadcrumb">Docs <span>›</span> Getting Started <span>›</span> <strong style={{color:"var(--ink)"}}>{docsActive}</strong></div>
              <h2>{docsActive}</h2>
              <p>Get up and running with Purplex in minutes. This guide walks you through installing the SDK, making your first search query, and understanding the response format.</p>
              <div className="px-docs-quickstart">
                {[{icon:"📦",title:"Install the SDK",desc:"npm, pip, or plain REST — your choice."},{icon:"🔑",title:"Get your API key",desc:"Free tier, no credit card required."},{icon:"⚡",title:"Make your first query",desc:"One function call, one cited answer."},{icon:"📊",title:"Explore the dashboard",desc:"Analytics, logs, and usage in one place."}].map((card,i)=>(
                  <div key={i} className="px-docs-card"><div className="px-docs-card-icon">{card.icon}</div><h4>{card.title}</h4><p>{card.desc}</p></div>
                ))}
              </div>
              <hr className="px-docs-divider"/>
              <div className="px-docs-step-list">
                {[{n:"01",title:"Install",body:"Add the Purplex SDK to your project. Works with Node.js 18+, Python 3.10+, or any HTTP client via REST."},{n:"02",title:"Authenticate",body:"Create a free account at purplex.ai and copy your API key from the dashboard. Pass it as an environment variable."},{n:"03",title:"Query",body:"Call purplex.search() with your question. You'll receive a streaming response with the answer and full source citations."}].map((step,i)=>(
                  <div key={i} className="px-docs-step"><div className="px-docs-step-num">{step.n}</div><div><h4>{step.title}</h4><p>{step.body}</p></div></div>
                ))}
              </div>
              <div className="px-docs-code-block">
                <div className="px-docs-code-bar"><span className="px-docs-code-lang">JavaScript</span><button className="px-docs-code-copy" onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?"Copied ✓":"Copy"}</button></div>
                <div className="px-docs-code-body">
                  <span className="px-cm">{"// Install: npm install purplex\n"}</span>
                  <span className="px-kw">import</span>{" Purplex "}<span className="px-kw">from</span>{" "}<span className="px-str">'purplex'</span>{";\n\n"}
                  <span className="px-kw">const</span>{" client = "}<span className="px-kw">new</span>{" Purplex({\n  apiKey: process.env."}<span className="px-str">PURPLEX_API_KEY</span>{",\n});\n\n"}
                  <span className="px-kw">const</span>{" stream = "}<span className="px-kw">await</span>{" client.search({\n  query: "}<span className="px-str">'best AI search engine in 2026'</span>{",\n  mode: "}<span className="px-str">'deep'</span>{",\n});\n\n"}
                  <span className="px-kw">for await</span>{" ("}<span className="px-kw">const</span>{" chunk "}<span className="px-kw">of</span>{" stream) {\n  process.stdout.write(chunk.text);\n  "}<span className="px-cm">{"// chunk.sources[] has citations\n"}</span>{"}"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:"var(--paper)"}}>
        <div className="px-page" style={{borderTop:"1px dashed var(--dash)"}}>
          <div className="px-cta-bento">
            <div className="px-cta-l"><h2>stop searching.<br/><em>start knowing.</em></h2></div>
            <div className="px-cta-r">
              <p>Purplex is free to start. No credit card. No setup. Drop one component and you're shipping AI-powered search in minutes.</p>
              <div className="px-cta-acts"><button className="px-btn-ac" onClick={() => navigate("/register")}>Start for free</button><button className="px-btn-ol" onClick={()=>scrollTo("docs")}>Read the docs</button></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:"var(--paper2)",borderTop:"1px dashed var(--dash)"}}>
        <div className="px-page">
          <footer className="px-footer">
            <div className="px-footer-brand">
              <div className="px-logo" style={{color:"var(--ink2)"}}><div className="px-logo-mark" style={{border:"1.5px dashed var(--dash)",color:"var(--ink2)"}}>P</div>purplex</div>
              <p>The AI search layer for the modern web. Reasoned answers, full citations, zero hallucinations.</p>
            </div>
            <div className="px-footer-links-grid">
              {[{title:"Product",links:["Features","Pricing","Changelog","Roadmap"]},{title:"Developers",links:["Docs","API Reference","SDKs","Status"]},{title:"Company",links:["About","Blog","Careers","Press"]},{title:"Legal",links:["Privacy","Terms","Security","GDPR"]}].map((col,i)=>(
                <div key={i} className="px-footer-col"><div className="px-footer-col-title">{col.title}</div>{col.links.map(l=><a key={l} href="#">{l}</a>)}</div>
              ))}
            </div>
            <div className="px-footer-right">
              <div className="px-footer-socials">{["𝕏","in","gh","▶"].map((s,i)=><button key={i} className="px-social-btn">{s}</button>)}</div>
              <p className="px-footer-copy">© 2026 Purplex Inc. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}