import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {useChat} from "../hooks/useChat.js";
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }

:root {
  --ink: #0f0d0b;
  --ink2: #3a3530;
  --ink3: #857e76;
  --paper: #f2ece0;
  --paper2: #ebe3d4;
  --paper3: #e1d8c6;
  --dash: rgba(15,13,11,0.16);
  --accent: #c8501a;
  --accent-soft: rgba(200,80,26,0.07);
  --accent-border: rgba(200,80,26,0.2);
  --hatch-color: rgba(15,13,11,0.13);
  --hatch-size: 12px;
}

.px-root {
  background-color: var(--paper);
  background-image:
    radial-gradient(ellipse 1100px 700px at -5% -10%, rgba(230,140,80,0.28) 0%, transparent 55%),
    radial-gradient(ellipse 800px 600px at 105% 110%, rgba(180,140,220,0.18) 0%, transparent 50%);
}

@keyframes bpulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes tdot    { 0%,80%,100%{transform:scale(.65);opacity:.3} 40%{transform:scale(1);opacity:1} }
@keyframes slideIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }

/* ── SIDEBAR ── */
.px-sidebar {
  width: 236px; flex-shrink: 0;
  background: rgba(242,236,224,0.92);
  border-right: 1px dashed var(--dash);
  display: flex; flex-direction: column;
  height: 100%; overflow: hidden;
  position: relative; z-index: 10;
}
.px-sidebar-logo {
  padding: 1rem 1.25rem;
  border-bottom: 1px dashed var(--dash);
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; flex-shrink: 0;
}
.px-logo-mark {
  width: 24px; height: 24px; border-radius: 50%;
  border: 1.5px dashed var(--dash);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Libre Baskerville', serif; font-size: 0.62rem; font-weight: 700;
  color: var(--ink2); flex-shrink: 0;
}
.px-logo-text { font-family: 'Libre Baskerville', serif; font-size: 1.05rem; color: var(--ink); letter-spacing: -0.02em; }

.px-new-chat-btn {
  display: flex; align-items: center; gap: 8px; width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--accent-soft); border: 1px dashed var(--accent-border);
  cursor: pointer; color: var(--accent);
  font-family: 'Geist', sans-serif; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.03em; transition: background 0.15s;
  flex-shrink: 0;
}
.px-new-chat-btn:hover { background: rgba(200,80,26,0.13); }

.px-section-label {
  font-size: 0.57rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink3); padding: 0.65rem 1.1rem 0.3rem;
  font-family: 'Geist', sans-serif; flex-shrink: 0;
}
.px-sidebar-chats { flex: 1; overflow-y: auto; min-height: 0; }
.px-sidebar-chats::-webkit-scrollbar { width: 2px; }
.px-sidebar-chats::-webkit-scrollbar-thumb { background: var(--dash); border-radius: 2px; }

.px-chat-item {
  display: flex; align-items: center; gap: 8px;
  padding: 0.42rem 1.1rem; cursor: pointer;
  border-bottom: 1px dashed rgba(15,13,11,0.06);
  transition: background 0.12s; position: relative;
}
.px-chat-item:hover { background: rgba(15,13,11,0.03); }
.px-chat-item.active { background: var(--accent-soft); }
.px-chat-item.active::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--accent);
}
.px-chat-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink3); flex-shrink: 0; }
.px-chat-item.active .px-chat-dot { background: var(--accent); }
.px-chat-title {
  font-size: 0.72rem; color: var(--ink2);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-weight: 300; line-height: 1.4; flex: 1; min-width: 0;
  font-family: 'Geist', sans-serif;
}
.px-chat-item.active .px-chat-title { color: var(--accent); font-weight: 500; }
.px-chat-time { font-size: 0.57rem; color: var(--ink3); flex-shrink: 0; }

.px-sidebar-bottom {
  border-top: 1px dashed var(--dash); padding: 0.65rem 0.75rem;
  display: flex; flex-direction: column; gap: 1px; flex-shrink: 0;
}
.px-sidebar-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 0.4rem 0.55rem; cursor: pointer;
  color: var(--ink3); font-size: 0.71rem;
  font-family: 'Geist', sans-serif; font-weight: 300;
  background: none; border: none; width: 100%; text-align: left;
  transition: background 0.12s, color 0.12s;
}
.px-sidebar-btn:hover { background: rgba(15,13,11,0.04); color: var(--ink2); }
.px-sidebar-btn.danger:hover { color: var(--accent); background: var(--accent-soft); }

/* ═══════════════════════════════════════
   HATCH WRAPPER — padding approach
   Padding on the wrapper reveals the hatch
   bg behind the inner content box.
═══════════════════════════════════════ */
.px-main-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 14px;
  background-image: repeating-linear-gradient(
    -45deg,
    var(--hatch-color) 0px,
    var(--hatch-color) 1px,
    transparent 1px,
    transparent var(--hatch-size)
  );
  background-color: var(--paper);
}

/* Inner content box sits on top — fills the padded space */
.px-main-inner {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--paper);
  background-image:
    radial-gradient(ellipse 900px 600px at 10% 0%, rgba(230,140,80,0.14) 0%, transparent 55%),
    radial-gradient(ellipse 700px 500px at 90% 100%, rgba(180,140,220,0.10) 0%, transparent 50%);
  outline: 1px solid rgba(15,13,11,0.12);
}

/* ── TOPBAR ── */
.px-topbar {
  height: 52px; flex-shrink: 0;
  border-bottom: 1px dashed var(--dash);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(242,236,224,0.88);
}
.px-topbar-title {
  font-family: 'Libre Baskerville', serif; font-size: 0.88rem;
  color: var(--ink3); font-style: italic; letter-spacing: -0.01em;
}
.px-topbar-actions { display: flex; align-items: center; gap: 0.5rem; }

.px-mode-toggle { display: flex; border: 1px dashed var(--dash); overflow: hidden; }
.px-mode-btn {
  padding: 0.28rem 0.72rem; font-size: 0.63rem;
  font-family: 'Geist', sans-serif; font-weight: 400; letter-spacing: 0.04em;
  background: none; border: none; cursor: pointer; color: var(--ink3);
  transition: background 0.15s, color 0.15s;
  border-right: 1px dashed var(--dash);
}
.px-mode-btn:last-child { border-right: none; }
.px-mode-btn.active { background: var(--ink); color: #f5f0e8; }

.px-live-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent-soft); border: 1px dashed var(--accent-border);
  padding: 0.22rem 0.75rem;
  font-size: 0.6rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--accent); font-family: 'Geist', sans-serif;
}
.px-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: bpulse 2s infinite; flex-shrink: 0; }

.px-topbar-icon-btn {
  width: 30px; height: 30px; border: 1px dashed var(--dash); background: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink3); transition: background 0.15s, color 0.15s;
}
.px-topbar-icon-btn:hover { background: rgba(15,13,11,0.05); color: var(--ink2); }

/* ── HERO SCREEN ── */
.px-hero-screen {
  flex: 1; min-height: 0;
  display: flex; flex-direction: column; align-items: center;
  overflow: hidden; position: relative;
}
.px-hero-rails { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.px-rail {
  position: absolute; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(180deg,
    rgba(200,80,26,0.4) 0%, rgba(200,80,26,0.08) 20%,
    rgba(15,13,11,0.06) 50%, transparent 100%);
}
.px-rail-l { left: 72px; }
.px-rail-r { right: 72px; }
.px-hero-hline2 {
  position: absolute; left: 72px; right: 72px; bottom: 80px;
  height: 1px; background: var(--dash); pointer-events: none; z-index: 1;
}

.px-hero-section {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  padding-top: 44px; text-align: center;
  animation: fadeUp 0.75s ease both;
}
.px-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  border: 1px dashed var(--dash); padding: 0.25rem 0.85rem;
  font-size: 0.65rem; font-weight: 400; letter-spacing: 0.07em; text-transform: uppercase;
  color: var(--ink3); font-family: 'Geist', sans-serif;
  margin-bottom: 1.4rem; background: rgba(242,236,224,0.6);
}
.px-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: bpulse 2s infinite; }
.px-hero-title {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(2.8rem, 5vw, 4.6rem);
  font-weight: 400; line-height: 1.05; letter-spacing: -0.03em; color: var(--ink);
}
.px-hero-title em { font-style: italic; color: var(--ink3); }
.px-hero-sub {
  margin-top: 1.1rem; max-width: 500px;
  color: var(--ink3); font-size: 0.9rem;
  font-family: 'Geist', sans-serif; font-weight: 300; line-height: 1.75;
  padding: 0 1rem; animation: fadeUp 0.75s ease 0.15s both;
}

/* ── COMPOSER FRAME ── */
.px-composer-frame {
  position: relative; z-index: 3;
  width: min(100% - 144px, 760px);
  margin: 2.5rem auto 0;
  animation: fadeUp 0.75s ease 0.3s both;
  border: 1px dashed var(--dash);
  padding: 1px; background: var(--paper2);
}
.px-composer-frame::before {
  content: ''; position: absolute; inset: 6px;
  border: 1px dashed rgba(15,13,11,0.08);
  pointer-events: none; z-index: 0;
}
.px-mac-bar {
  display: flex; align-items: center; gap: 7px;
  padding: 0.55rem 0.9rem;
  background: var(--paper3); border-bottom: 1px dashed var(--dash);
  position: relative; z-index: 1;
}
.px-mac-dot { width: 10px; height: 10px; border-radius: 50%; }
.px-mac-filename {
  font-family: 'Geist', monospace; font-size: 0.65rem;
  color: var(--ink3); margin-left: auto; margin-right: auto;
}
.px-frame-body { background: var(--paper2); position: relative; z-index: 1; }
.px-stage-textarea {
  display: block; width: 100%; resize: none; outline: none; border: none;
  background: transparent; color: var(--ink2);
  padding: 1.2rem 1.4rem 0.8rem;
  font-family: 'Geist', monospace; font-size: 0.82rem; line-height: 1.75;
  height: 126px;
}
.px-stage-textarea::placeholder { color: var(--ink3); opacity: 0.55; }
.px-frame-footer {
  display: flex; align-items: center; gap: 8px;
  padding: 0.55rem 0.9rem;
  border-top: 1px dashed var(--dash); background: var(--paper3);
}
.px-frame-tag {
  display: flex; align-items: center; gap: 5px;
  font-family: 'Geist', monospace; font-size: 0.63rem;
  color: var(--ink3); border: 1px dashed var(--dash);
  padding: 0.2rem 0.55rem; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.px-frame-tag:hover { border-color: rgba(15,13,11,0.35); color: var(--ink2); }
.px-frame-send {
  margin-left: auto; display: flex; align-items: center; gap: 7px;
  padding: 0.35rem 0.95rem; background: var(--accent); border: none;
  cursor: pointer; color: #fff;
  font-family: 'Geist', sans-serif; font-size: 0.7rem; font-weight: 500;
  transition: background 0.15s;
}
.px-frame-send:hover { background: #a84016; }

/* ── CHAT VIEW ── */
.px-chat-view {
  flex: 1; min-height: 0;
  display: flex; flex-direction: column; overflow: hidden;
}
.px-chat-area {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 2rem 0;
  display: flex; flex-direction: column; align-items: center;
}
.px-chat-area::-webkit-scrollbar { width: 2px; }
.px-chat-area::-webkit-scrollbar-thumb { background: var(--dash); border-radius: 2px; }
.px-messages-wrap {
  width: 100%; max-width: 660px; padding: 0 1.5rem;
  display: flex; flex-direction: column; gap: 2rem;
}
.px-msg { display: flex; flex-direction: column; gap: 6px; animation: fadeUp 0.35s ease both; }
.px-msg-role {
  font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink3); font-family: 'Geist', sans-serif;
  display: flex; align-items: center; gap: 6px;
}
.px-msg-role-accent { width: 14px; height: 1px; background: var(--accent); opacity: 0.5; }
.px-msg-bubble {
  font-size: 0.85rem; line-height: 1.85;
  font-weight: 300; color: var(--ink2); font-family: 'Geist', sans-serif;
}
.px-msg.user .px-msg-bubble {
  background: var(--paper2); border: 1px dashed var(--dash);
  padding: 0.75rem 1rem;
}
.px-msg-sources { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.85rem; }
.px-source-chip {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.6rem; font-family: 'Geist', sans-serif;
  background: var(--paper2); border: 1px dashed var(--dash);
  padding: 0.2rem 0.55rem; color: var(--ink3);
}
.px-source-fav {
  width: 12px; height: 12px; display: flex; align-items: center; justify-content: center;
  font-size: 0.48rem; font-weight: 700; color: #fff; flex-shrink: 0;
}

/* search status */
.px-search-status { display: flex; flex-direction: column; gap: 8px; animation: slideIn 0.3s ease both; }
.px-search-status-header { display: flex; align-items: center; gap: 8px; }
.px-search-dots { display: flex; gap: 3px; align-items: center; }
.px-search-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); animation: tdot 1.4s ease infinite; }
.px-search-dot:nth-child(2){animation-delay:.18s} .px-search-dot:nth-child(3){animation-delay:.36s}
.px-search-label { font-size: 0.7rem; color: var(--ink3); font-family: 'Geist', sans-serif; font-style: italic; }
.px-search-sources-row { display: flex; gap: 5px; flex-wrap: wrap; }
.px-search-source-pill {
  display: flex; align-items: center; gap: 4px;
  background: var(--paper2); border: 1px dashed var(--dash);
  padding: 0.16rem 0.5rem;
  font-size: 0.58rem; color: var(--ink3); font-family: 'Geist', sans-serif;
  animation: slideIn 0.3s ease both;
}
.px-search-source-fav { width: 10px; height: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.42rem; font-weight: 700; color: #fff; }

/* ── CHAT COMPOSER ── */
.px-chat-composer {
  flex-shrink: 0;
  border-top: 1px dashed var(--dash);
  background: rgba(242,236,224,0.92);
  padding: 0.85rem 1.5rem 1rem;
}
.px-chat-composer-inner { max-width: 660px; margin: 0 auto; }
.px-chat-composer-box {
  border: 1px dashed var(--dash); background: var(--paper2); position: relative;
}
.px-chat-composer-box::before {
  content: ''; position: absolute; inset: 5px;
  border: 1px dashed rgba(15,13,11,0.07); pointer-events: none;
}
.px-chat-composer-dark { background: var(--paper2); margin: 1px; }
.px-chat-textarea {
  display: block; width: 100%; resize: none; outline: none; border: none;
  background: transparent; color: var(--ink2);
  padding: 0.8rem 1rem 0.6rem;
  font-family: 'Geist', monospace; font-size: 0.78rem; line-height: 1.65;
  min-height: 68px; max-height: 150px;
}
.px-chat-textarea::placeholder { color: var(--ink3); opacity: 0.6; }
.px-chat-composer-footer {
  display: flex; align-items: center; gap: 8px;
  padding: 0.4rem 0.75rem;
  border-top: 1px dashed var(--dash); background: var(--paper3);
}
.px-cc-tag {
  display: flex; align-items: center; gap: 5px;
  padding: 0.2rem 0.55rem; border: 1px dashed var(--dash);
  cursor: pointer; color: var(--ink3);
  font-family: 'Geist', monospace; font-size: 0.6rem;
  transition: border-color 0.15s, color 0.15s;
}
.px-cc-tag:hover { border-color: rgba(15,13,11,0.35); color: var(--ink2); }
.px-cc-send {
  margin-left: auto; display: flex; align-items: center; gap: 6px;
  padding: 0.3rem 0.85rem; border: none; background: var(--accent);
  cursor: pointer; color: #fff;
  font-family: 'Geist', sans-serif; font-size: 0.68rem; font-weight: 500;
  transition: background 0.15s;
}
.px-cc-send:hover { background: #a84016; }
.px-composer-hint {
  text-align: center; font-size: 0.6rem; color: var(--ink3);
  margin-top: 0.55rem; font-family: 'Geist', sans-serif; font-weight: 300; letter-spacing: 0.02em;
}
`;

const SEARCH_SOURCES = [
  { label: "W", bg: "#c0392b", domain: "wired.com" },
  { label: "A", bg: "#1a1a2e", domain: "arxiv.org" },
  { label: "L", bg: "#0077b5", domain: "linkedin.com" },
  { label: "R", bg: "#ff4500", domain: "reddit.com" },
  { label: "G", bg: "#24292e", domain: "github.com" },
];

const INITIAL_CHATS = [
  { group: "Today", items: [
    { id: 1, title: "Best AI search engines 2026", time: "2m" },
    { id: 2, title: "RAG vs fine-tuning differences", time: "1h" },
    { id: 3, title: "Vector similarity search HNSW", time: "3h" },
  ]},
  { group: "Yesterday", items: [
    { id: 4, title: "Next.js 15 streaming patterns", time: "1d" },
    { id: 5, title: "PostgreSQL full-text search", time: "1d" },
    { id: 6, title: "Supabase edge functions", time: "1d" },
  ]},
  { group: "This week", items: [
    { id: 7, title: "Semantic caching strategies", time: "3d" },
    { id: 8, title: "Multi-agent orchestration", time: "4d" },
    { id: 9, title: "LLM evaluation frameworks", time: "5d" },
    { id: 10, title: "Pinecone vs Weaviate vs Chroma", time: "6d" },
  ]},
];

const SEED_MESSAGES = [
  { role: "user", text: "best AI search engine in 2026", sources: [] },
  {
    role: "assistant",
    text: "Purplex leads 2026 benchmarks with sub-300ms first-token latency. It reads live sources — not a frozen training snapshot — and returns a single cited answer instead of ten blue links.",
    sources: [
      { label: "W", bg: "#c0392b", domain: "wired.com" },
      { label: "A", bg: "#1a1a2e", domain: "arxiv.org" },
      { label: "L", bg: "#0077b5", domain: "linkedin.com" },
    ],
  },
];

const MODES = ["Search", "Deep", "Reason"];

function useTypewriter(phrases, speed = 42, pause = 2600) {
  const [displayed, setDisplayed] = useState("");
  const [pi, setPi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = phrases[pi];
    let t;
    if (!del && ci <= cur.length) {
      t = setTimeout(() => { setDisplayed(cur.slice(0, ci)); setCi(c => c + 1); }, speed);
    } else if (!del && ci > cur.length) {
      t = setTimeout(() => setDel(true), pause);
    } else if (del && ci >= 0) {
      t = setTimeout(() => { setDisplayed(cur.slice(0, ci)); setCi(c => c - 1); }, speed / 2.2);
    } else {
      setDel(false); setPi(i => (i + 1) % phrases.length);
    }
    return () => clearTimeout(t);
  }, [ci, del, pi, phrases, speed, pause]);
  return displayed;
}

const PLACEHOLDERS = [
  "$ ask — best AI search engine in 2026...",
  "$ ask — how does RAG differ from fine-tuning...",
  "$ ask — build a real-time dashboard with WebSockets...",
  "$ ask — what are vector embeddings...",
];

const Ic = {
  Plus:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
  User:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Settings: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12"/></svg>,
  Logout:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Share:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  More:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  Send:     () => <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M5 11h10.5l-3.8-3.8L13.4 5 21 12l-7.6 7-1.7-2.2 3.8-3.8H5z"/></svg>,
  Attach:   () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Nodes:    () => <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" opacity="0.7"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="5" r="2.2"/><circle cx="19" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/></svg>,
};

function SearchStatus({ phase }) {
  const [visibleSources, setVisibleSources] = useState([]);
  const phases = ["Searching the live web…", "Reading sources…", "Cross-referencing…", "Synthesising answer…"];
  const label = phases[Math.min(phase, phases.length - 1)];
  useEffect(() => {
    setVisibleSources([]);
    const timers = SEARCH_SOURCES.map((s, i) =>
      setTimeout(() => setVisibleSources(prev => [...prev, s]), i * 280 + 200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div className="px-search-status">
      <div className="px-search-status-header">
        <div className="px-search-dots">
          <div className="px-search-dot"/><div className="px-search-dot"/><div className="px-search-dot"/>
        </div>
        <span className="px-search-label">{label}</span>
      </div>
      <div className="px-search-sources-row">
        {visibleSources.map((s, i) => (
          <div key={i} className="px-search-source-pill" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="px-search-source-fav" style={{ background: s.bg }}>{s.label}</div>
            {s.domain}
          </div>
        ))}
      </div>
    </div>
  );
}

function Message({ role, text, sources, searching, searchPhase }) {
  const isUser = role === "user";
  return (
    <div className={`px-msg${isUser ? " user" : ""}`}>
      <div className="px-msg-role">
        <div className="px-msg-role-accent" />
        {isUser ? "You" : "Purplex"}
      </div>
      <div className="px-msg-bubble">
        {searching ? <SearchStatus phase={searchPhase || 0} /> : text}
        {!searching && sources?.length > 0 && (
          <div className="px-msg-sources">
            {sources.map((s, i) => (
              <div key={i} className="px-source-chip">
                <div className="px-source-fav" style={{ background: s.bg }}>{s.label}</div>
                {s.domain}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeroScreen({ onSend }) {
  const [value, setValue] = useState("");
  const placeholder = useTypewriter(PLACEHOLDERS, 38, 2600);

  function send() {
    const text = value.trim() || "best AI search engines in 2026";
    onSend(text);
  }
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="px-hero-screen">
      <div className="px-hero-rails" aria-hidden="true">
        <div className="px-rail px-rail-l" />
        <div className="px-rail px-rail-r" />
        <div className="px-hero-hline2" />
      </div>
      <section className="px-hero-section">
        <div className="px-hero-eyebrow">
          <span className="px-eyebrow-dot" />
          v1.0 — now in public beta
        </div>
        <h1 className="px-hero-title">
          search that<br /><em>reasons,</em> not retrieves.
        </h1>
        <p className="px-hero-sub">
          Purplex reads the live web, thinks through it, and gives you one answer you can trust.<br />
          No ten blue links. One cited answer.
        </p>
      </section>
      <div className="px-composer-frame">
        <div className="px-mac-bar">
          <span className="px-mac-dot" style={{ background: "#ff5f57" }} />
          <span className="px-mac-dot" style={{ background: "#febc2e" }} />
          <span className="px-mac-dot" style={{ background: "#27c93f" }} />
          <span className="px-mac-filename">purplex / search.query.tsx</span>
        </div>
        <div className="px-frame-body">
          <textarea
            className="px-stage-textarea"
            spellCheck={false}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
          />
          <div className="px-frame-footer">
            <div className="px-frame-tag"><Ic.Nodes /> /web-search</div>
            <div className="px-frame-tag"><Ic.Attach /> attach</div>
            <button className="px-frame-send" onClick={send}>
              try purplex &nbsp;<Ic.Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatView({ messages, onSend }) {
  const [value, setValue] = useState("");
  const areaRef = useRef(null);
  const taRef = useRef(null);
  
  useEffect(() => {
    if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight;
  }, [messages]);

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  }
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }
  function send() {
    const text = value.trim(); if (!text) return;
    onSend(text); setValue(""); if (taRef.current) taRef.current.style.height = "auto";
  }

  return (
    <div className="px-chat-view">
      <div className="px-chat-area" ref={areaRef}>
        <div className="px-messages-wrap">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} text={m.text} sources={m.sources}
              searching={m.searching} searchPhase={m.searchPhase} />
          ))}
        </div>
      </div>
      <div className="px-chat-composer">
        <div className="px-chat-composer-inner">
          <div className="px-chat-composer-box">
            <div className="px-chat-composer-dark">
              <textarea
                ref={taRef}
                className="px-chat-textarea"
                placeholder="$ ask — search the live web for anything…"
                value={value}
                onChange={e => { setValue(e.target.value); autoResize(e.target); }}
                onKeyDown={handleKey}
                spellCheck={false}
              />
              <div className="px-chat-composer-footer">
                <div className="px-cc-tag"><Ic.Nodes /> /web-search</div>
                <div className="px-cc-tag"><Ic.Attach /> attach</div>
                <button className="px-cc-send" onClick={send}>send &nbsp;<Ic.Send /></button>
              </div>
            </div>
          </div>
          <p className="px-composer-hint">purplex reads the live web — answers cite real sources · press ⏎ to send</p>
        </div>
      </div>
    </div>
  );
}

export default function PurplexDashboard() {
  const [chatGroups, setChatGroups] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeTitle, setActiveTitle] = useState("New search");
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState("Search");
  const nextId = useRef(100);
  const searchTimers = useRef([]);
  const {user} = useSelector(state => state.auth);
  const chat = useChat();

  useEffect(() => {
 chat.initializeSocketConnection();
  },[])

  useEffect(() => {
    const id = "purplex-dash-css-v4";
    if (!document.getElementById(id)) {
      const s = document.createElement("style"); s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById(id); if (el) el.remove();
      searchTimers.current.forEach(clearTimeout);
    };
  }, []);

  function selectChat(id, title) {
    setActiveChatId(id); setActiveTitle(title); setMessages(SEED_MESSAGES);
  }
  function newChat() {
    setActiveChatId(null); setActiveTitle("New search"); setMessages([]);
    searchTimers.current.forEach(clearTimeout);
  }
  function handleSend(text) {
    const shortTitle = text.length > 42 ? text.slice(0, 42) + "…" : text;
    if (activeChatId === null) {
      const id = nextId.current++;
      setChatGroups(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], items: [{ id, title: shortTitle, time: "now" }, ...updated[0].items] };
        return updated;
      });
      setActiveChatId(id); setActiveTitle(shortTitle);
      setMessages([
        { role: "user", text, sources: [] },
        { role: "assistant", searching: true, searchPhase: 0, text: "", sources: [] },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        { role: "user", text, sources: [] },
        { role: "assistant", searching: true, searchPhase: 0, text: "", sources: [] },
      ]);
      setActiveTitle(shortTitle);
    }
    [0,1,2,3].forEach((ph, i) => {
      const t = setTimeout(() => {
        setMessages(prev => {
          const u = [...prev]; const li = u.length - 1;
          if (u[li]?.searching) u[li] = { ...u[li], searchPhase: ph };
          return u;
        });
      }, i * 520);
      searchTimers.current.push(t);
    });
    const ans = setTimeout(() => {
      setMessages(prev => {
        const u = [...prev]; const li = u.length - 1;
        if (u[li]?.searching) {
          u[li] = {
            role: "assistant", searching: false,
            text: "Based on live web sources retrieved in real time, here's a synthesised answer cross-referenced for accuracy and completeness across multiple authoritative references.",
            sources: [
              { label: "W", bg: "#c0392b", domain: "wired.com" },
              { label: "A", bg: "#1a1a2e", domain: "arxiv.org" },
              { label: "L", bg: "#0077b5", domain: "linkedin.com" },
            ],
          };
        }
        return u;
      });
    }, 2400);
    searchTimers.current.push(ans);
  }

  const isHero = activeChatId === null;

  return (
    <div className="px-root" style={{
      display: "flex", height: "100vh", width: "100vw",
      fontFamily: "'Geist', sans-serif", overflow: "hidden",
    }}>
      {/* SIDEBAR */}
      <aside className="px-sidebar">
        <div className="px-sidebar-logo" onClick={newChat}>
          <div className="px-logo-mark">P</div>
          <span className="px-logo-text">purplex</span>
        </div>
        <div style={{ margin: "0.8rem 0.8rem 0.4rem", flexShrink: 0 }}>
          <button className="px-new-chat-btn" onClick={newChat}>
            <Ic.Plus /> New search
          </button>
        </div>
        <div className="px-sidebar-chats">
          {chatGroups.map((group, gi) => (
            <div key={gi}>
              <div className="px-section-label" style={gi > 0 ? { marginTop: "0.4rem" } : {}}>
                {group.group}
              </div>
              {group.items.map(item => (
                <div
                  key={item.id}
                  className={`px-chat-item${activeChatId === item.id ? " active" : ""}`}
                  onClick={() => selectChat(item.id, item.title)}
                >
                  <div className="px-chat-dot" />
                  <span className="px-chat-title">{item.title}</span>
                  <span className="px-chat-time">{item.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="px-sidebar-bottom">
          <button className="px-sidebar-btn"><Ic.User /> Account</button>
          <button className="px-sidebar-btn"><Ic.Settings /> Settings</button>
          <button className="px-sidebar-btn danger"><Ic.Logout /> Sign out</button>
        </div>
      </aside>

      {/* MAIN — hatch border via padding, inner box fills remaining space */}
      <div className="px-main-wrapper">
        <div className="px-main-inner">
          {/* TOPBAR */}
          <div className="px-topbar">
            <div className="px-topbar-title">{activeTitle}</div>
            <div className="px-topbar-actions">
              <div className="px-mode-toggle">
                {MODES.map(m => (
                  <button key={m} className={`px-mode-btn${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="px-live-badge"><span className="px-badge-dot" />Live</div>
              <button className="px-topbar-icon-btn"><Ic.Share /></button>
              <button className="px-topbar-icon-btn"><Ic.More /></button>
            </div>
          </div>

          {isHero
            ? <HeroScreen onSend={handleSend} />
            : <ChatView messages={messages} onSend={handleSend} />
          }
        </div>
      </div>
    </div>
  );
}