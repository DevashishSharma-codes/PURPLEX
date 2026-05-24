import { useState, useRef, useEffect } from "react";

const CYAN = "#00d8ed";
const CYAN_SOFT = "rgba(0,216,237,0.48)";
const ACCENT = "#c8501a";
const BG = "#070808";
const PANEL = "#0d0e0f";
const GRID = "rgba(255,255,255,0.012)";
const TEXT_PRIMARY = "#e8dcc8";
const TEXT_SECONDARY = "rgba(232,220,200,0.5)";
const TEXT_MUTED = "rgba(232,220,200,0.28)";
const BORDER = "rgba(255,255,255,0.07)";
const BORDER_SOFT = "rgba(255,255,255,0.04)";
const ACCENT_SOFT = "rgba(200,80,26,0.08)";
const ACCENT_BORDER = "rgba(200,80,26,0.25)";
const LINE = "rgba(255,255,255,0.12)";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; background: ${BG}; }

@keyframes bpulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes tdot    { 0%,80%,100%{transform:scale(.7);opacity:.4} 40%{transform:scale(1);opacity:1} }

@keyframes beamVertical {
  0%   { top: -110px; opacity: 0; }
  5%   { opacity: 1; }
  95%  { top: 100%; opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
@keyframes beamHLeft {
  0%   { left: 100%;  opacity: 0; }
  5%   { opacity: 1; }
  95%  { left: -80px; opacity: 1; }
  100% { left: -80px; opacity: 0; }
}
@keyframes beamHRight {
  0%   { left: -80px; opacity: 0; }
  5%   { opacity: 1; }
  95%  { left: 100%;  opacity: 1; }
  100% { left: 100%;  opacity: 0; }
}

/* ── SCROLLBARS ── */
.px-sidebar-chats::-webkit-scrollbar { width: 2px; }
.px-sidebar-chats::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
.px-chat-area::-webkit-scrollbar { width: 3px; }
.px-chat-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

/* ── SIDEBAR ── */
.px-sidebar {
  width: 240px; flex-shrink: 0;
  background: ${PANEL};
  border-right: 1px solid ${BORDER_SOFT};
  display: flex; flex-direction: column;
  height: 100%; position: relative; z-index: 10; overflow: hidden;
}
.px-sidebar::after {
  content: '';
  position: absolute; right: 0; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(180deg, rgba(200,80,26,0.3), rgba(200,80,26,0.06) 14%, transparent 40%);
  pointer-events: none;
}
.px-sidebar-logo {
  padding: 1.1rem 1.25rem 0.9rem;
  border-bottom: 1px solid ${BORDER_SOFT};
  display: flex; align-items: center; gap: 9px; cursor: pointer; flex-shrink: 0;
}
.px-logo-mark {
  width: 22px; height: 22px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Geist', sans-serif; font-size: 0.6rem; font-weight: 600;
  color: ${TEXT_PRIMARY}; flex-shrink: 0;
}
.px-logo-text {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.05rem; color: ${TEXT_PRIMARY}; letter-spacing: -0.02em;
}
.px-new-chat-btn {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 0.55rem 0.8rem;
  background: ${ACCENT_SOFT}; border: 1px solid ${ACCENT_BORDER};
  border-radius: 6px; cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  color: rgba(200,80,26,0.9);
  font-family: 'Geist', sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 0.03em;
}
.px-new-chat-btn:hover { background: rgba(200,80,26,0.16); border-color: rgba(200,80,26,0.4); }
.px-section-label {
  font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${TEXT_MUTED}; padding: 0.75rem 1.1rem 0.35rem;
  font-family: 'Geist', sans-serif;
}
.px-sidebar-chats { flex: 1; overflow-y: auto; padding-bottom: 0.5rem; }
.px-chat-item {
  display: flex; align-items: center; gap: 8px;
  padding: 0.45rem 1.1rem; cursor: pointer;
  transition: background 0.12s; position: relative;
}
.px-chat-item:hover { background: rgba(255,255,255,0.035); }
.px-chat-item.active { background: rgba(200,80,26,0.08); }
.px-chat-item.active::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: ${ACCENT};
}
.px-chat-dot { width: 4px; height: 4px; border-radius: 50%; background: ${TEXT_MUTED}; flex-shrink: 0; margin-top: 1px; }
.px-chat-item.active .px-chat-dot { background: ${ACCENT}; }
.px-chat-title {
  font-size: 0.74rem; color: ${TEXT_SECONDARY};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-weight: 300; line-height: 1.35; flex: 1; min-width: 0;
}
.px-chat-item.active .px-chat-title { color: rgba(200,80,26,0.88); font-weight: 400; }
.px-chat-time { font-size: 0.58rem; color: ${TEXT_MUTED}; flex-shrink: 0; }
.px-sidebar-divider { border: none; border-top: 1px dashed rgba(255,255,255,0.06); margin: 0 0.85rem 0.25rem; }
.px-sidebar-bottom {
  border-top: 1px solid ${BORDER_SOFT}; padding: 0.75rem 0.85rem;
  display: flex; flex-direction: column; gap: 2px; flex-shrink: 0;
}
.px-sidebar-btn {
  display: flex; align-items: center; gap: 9px;
  padding: 0.45rem 0.6rem; border-radius: 5px; cursor: pointer;
  transition: background 0.12s, color 0.12s;
  color: ${TEXT_MUTED}; font-size: 0.72rem;
  font-family: 'Geist', sans-serif; font-weight: 300;
  background: none; border: none; width: 100%; text-align: left;
}
.px-sidebar-btn:hover { background: rgba(255,255,255,0.035); color: ${TEXT_SECONDARY}; }
.px-sidebar-btn.danger { color: rgba(200,80,26,0.5); }
.px-sidebar-btn.danger:hover { color: rgba(200,80,26,0.8); }

/* ── MAIN ── */
.px-main {
  flex: 1; display: flex; flex-direction: column; min-width: 0;
  position: relative; overflow: hidden;
}

/* ── TOPBAR ── */
.px-topbar {
  height: 54px; border-bottom: 1px solid ${BORDER_SOFT};
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(7,8,8,0.85); backdrop-filter: blur(12px);
  flex-shrink: 0; position: relative; z-index: 20;
}
.px-topbar-title {
  font-family: 'Libre Baskerville', serif; font-size: 0.88rem;
  color: ${TEXT_SECONDARY}; font-style: italic; letter-spacing: -0.01em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px;
}
.px-topbar-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.px-mode-toggle { display: flex; border: 1px solid ${BORDER}; border-radius: 5px; overflow: hidden; }
.px-mode-btn {
  padding: 0.28rem 0.7rem; font-size: 0.65rem;
  font-family: 'Geist', sans-serif; font-weight: 400; letter-spacing: 0.04em;
  background: none; border: none; cursor: pointer; color: ${TEXT_MUTED};
  transition: background 0.15s, color 0.15s;
}
.px-mode-btn.active { background: rgba(255,255,255,0.06); color: ${TEXT_PRIMARY}; }
.px-live-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: ${ACCENT_SOFT}; border: 1px solid ${ACCENT_BORDER};
  border-radius: 999px; padding: 0.25rem 0.75rem;
  font-size: 0.62rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  color: rgba(200,80,26,0.85);
}
.px-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: ${ACCENT}; animation: bpulse 2s infinite; flex-shrink: 0; }
.px-topbar-icon-btn {
  width: 32px; height: 32px; border: 1px solid ${BORDER}; background: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border-radius: 5px; color: ${TEXT_MUTED};
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.px-topbar-icon-btn:hover { background: rgba(255,255,255,0.035); color: ${TEXT_SECONDARY}; }

/* ── HERO / WELCOME SCREEN (original Kreona layout) ── */
.px-hero-screen {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:
    linear-gradient(${GRID} 1px, transparent 1px),
    linear-gradient(90deg, ${GRID} 1px, transparent 1px),
    radial-gradient(circle at 50% 9%, rgba(255,255,255,0.035), transparent 25%),
    ${BG};
  background-size: 24px 24px, 24px 24px, auto, auto;
}

/* vertical rail lines */
.px-hero-screen::before, .px-hero-screen::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(180deg, rgba(0,216,237,0.4), rgba(0,216,237,0.05) 14%, transparent 45%);
  pointer-events: none; z-index: 1;
}
.px-hero-screen::before { left: 58px; }
.px-hero-screen::after  { right: 58px; }

/* beam animations */
.px-beam-v {
  position: absolute; width: 1px; height: 110px; pointer-events: none; z-index: 10;
  top: -110px; animation: beamVertical 3.5s cubic-bezier(0.4,0,0.6,1) infinite;
  background: linear-gradient(180deg, transparent 0%, ${CYAN} 50%, transparent 100%);
}
.px-beam-vl { left: 58px; }
.px-beam-vr { right: 58px; }
.px-beam-h {
  position: absolute; height: 2px; width: 80px; pointer-events: none; z-index: 10; top: -1px;
}
.px-beam-hl {
  animation: beamHLeft 3.5s cubic-bezier(0.4,0,0.6,1) infinite;
  background: linear-gradient(90deg, transparent 0%, ${CYAN} 50%, transparent 100%);
}
.px-beam-hr {
  animation: beamHRight 3.5s cubic-bezier(0.4,0,0.6,1) infinite;
  background: linear-gradient(90deg, transparent 0%, ${CYAN} 50%, transparent 100%);
}

/* hero text */
.px-hero-section {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  padding-top: 42px; text-align: center;
  animation: fadeIn 0.8s ease both;
}
.px-hero-title {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(3.2rem, 6.5vw, 5.4rem);
  font-weight: 400; line-height: 0.99; letter-spacing: -0.03em;
  color: transparent;
  background: linear-gradient(90deg, #eeeeef 0%, #b8b8bb 47%, #5d5d61 82%, rgba(75,75,79,0.45) 100%);
  -webkit-background-clip: text; background-clip: text;
}
.px-hero-sub {
  margin-top: 22px; max-width: 640px;
  color: rgba(232,220,200,0.55); font-size: 1rem;
  font-family: 'Geist', sans-serif; font-weight: 300; line-height: 1.5;
  padding: 0 18px;
  animation: fadeIn 0.8s ease 0.2s both;
}

/* stage area */
.px-stage {
  position: relative; z-index: 2;
  width: min(100%, 1200px);
  height: 460px;
  margin: 50px auto 0;
  animation: fadeIn 0.8s ease 0.4s both;
}
/* cyan rule */
.px-cyan-rule {
  position: absolute; left: 0; right: 0; top: 29px; height: 1px;
  background: linear-gradient(90deg, rgba(0,216,237,0.48), transparent 16%, transparent 84%, rgba(0,216,237,0.48));
  overflow: visible;
}
/* CTA row */
.px-cta-row {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; align-items: center;
}
.px-cta-line-l {
  height: 1px; flex: 1;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.11));
  position: relative; overflow: hidden;
}
.px-cta-line-r {
  height: 1px; flex: 1;
  background: linear-gradient(90deg, rgba(255,255,255,0.11), transparent);
  position: relative; overflow: hidden;
}
.px-cta-btn {
  width: 220px; height: 55px;
  border: 2px solid rgba(255,255,255,0.94); background: #090a0a;
  color: #fff; cursor: pointer; font-size: 14px; font-weight: 700;
  letter-spacing: 0.04em;
  font-family: 'Geist', sans-serif;
  transition: border-color 160ms, color 160ms;
  white-space: nowrap;
}
.px-cta-btn:hover { border-color: ${CYAN}; color: ${CYAN}; }

/* command frame lines */
.px-frame-line-h {
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent);
}

/* feature icons in corners */
.px-feat {
  position: absolute; z-index: 2; width: 90px; text-align: center;
  color: rgba(146,147,154,0.6);
  font-family: ui-monospace, Menlo, monospace; font-size: 11px;
}
.px-feat-icon {
  width: 64px; height: 64px;
  display: grid; place-items: center;
  border: 1px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.035);
  margin: 0 auto 11px;
}

/* composer */
.px-composer-stage {
  position: absolute; z-index: 3;
  left: 170px; right: 170px; top: 128px;
  height: 210px;
  border: 1px solid rgba(255,255,255,0.17);
  background: #101113; padding: 8px;
}
.px-stage-textarea {
  display: block; width: 100%; height: 140px; resize: none; outline: none;
  border: 1px solid rgba(255,255,255,0.11);
  background: #18191c; color: #c6c9d6;
  padding: 20px 22px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px; line-height: 1.5;
}
.px-stage-textarea::placeholder { color: #535966; }
.px-stage-footer {
  height: 55px; display: flex; align-items: center; gap: 10px;
}
.px-stage-icon-btn {
  width: 38px; height: 38px; display: grid; place-items: center;
  border: 1px solid rgba(255,255,255,0.13); background: #18191c; color: ${CYAN};
  cursor: pointer; transition: border-color 150ms, background 150ms;
}
.px-stage-icon-btn:hover { border-color: rgba(0,216,237,0.55); background: rgba(0,216,237,0.08); }
.px-stage-search-btn {
  height: 38px; min-width: 160px; display: flex; align-items: center; gap: 9px; padding: 0 14px;
  border: 1px solid rgba(255,255,255,0.13); background: #18191c; color: ${CYAN};
  font-family: ui-monospace, Menlo, monospace; font-size: 12px;
  cursor: pointer; transition: border-color 150ms, background 150ms;
}
.px-stage-search-btn:hover { border-color: rgba(0,216,237,0.55); background: rgba(0,216,237,0.08); }
.px-stage-send-btn {
  width: 38px; height: 38px; display: grid; place-items: center; margin-left: auto;
  border: 1px solid rgba(255,255,255,0.13); background: #18191c;
  cursor: pointer; transition: border-color 150ms, background 150ms;
}
.px-stage-send-btn:hover { border-color: rgba(0,216,237,0.55); background: rgba(0,216,237,0.08); }

/* ── CHAT VIEW ── */
.px-chat-view {
  flex: 1; display: flex; flex-direction: column;
  background:
    linear-gradient(${GRID} 1px, transparent 1px),
    linear-gradient(90deg, ${GRID} 1px, transparent 1px),
    ${BG};
  background-size: 24px 24px, 24px 24px;
  overflow: hidden;
}
.px-chat-area {
  flex: 1; overflow-y: auto;
  padding: 2rem 0;
  display: flex; flex-direction: column; align-items: center;
}
.px-messages-wrap {
  width: 100%; max-width: 680px; padding: 0 1.5rem;
  display: flex; flex-direction: column; gap: 1.75rem;
}
.px-msg { display: flex; flex-direction: column; gap: 4px; animation: fadeUp 0.35s ease both; }
.px-msg-role {
  font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${TEXT_MUTED}; font-family: 'Geist', sans-serif;
  padding: 0 2px; display: flex; align-items: center; gap: 6px;
}
.px-msg-role-dot { width: 4px; height: 4px; border-radius: 50%; background: ${ACCENT}; }
.px-msg-role-dot.user { background: rgba(0,216,237,0.6); }
.px-msg-bubble {
  font-size: 0.85rem; line-height: 1.8;
  font-weight: 300; color: ${TEXT_SECONDARY}; padding: 0 2px;
}
.px-msg.user .px-msg-bubble {
  background: rgba(255,255,255,0.03); border: 1px solid ${BORDER_SOFT};
  border-radius: 6px; padding: 0.75rem 1rem; color: rgba(232,220,200,0.72);
}
.px-msg-sources { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.75rem; }
.px-source-chip {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.6rem; font-family: 'Geist', sans-serif;
  background: rgba(255,255,255,0.03); border: 1px solid ${BORDER_SOFT};
  padding: 0.2rem 0.55rem; border-radius: 4px; color: ${TEXT_MUTED};
}
.px-source-fav {
  width: 13px; height: 13px; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.5rem; font-weight: 700; color: #fff; flex-shrink: 0;
}
.px-typing-dots { display: flex; gap: 4px; align-items: center; padding: 4px 2px; }
.px-typing-dot { width: 5px; height: 5px; border-radius: 50%; background: ${ACCENT}; animation: tdot 1.2s ease infinite; }
.px-typing-dot:nth-child(2){animation-delay:.2s} .px-typing-dot:nth-child(3){animation-delay:.4s}

/* ── CHAT COMPOSER (bottom bar in chat view) ── */
.px-chat-composer {
  border-top: 1px solid ${BORDER_SOFT};
  background: rgba(7,8,8,0.7); backdrop-filter: blur(12px);
  padding: 0.85rem 1.5rem 1rem; flex-shrink: 0; position: relative; z-index: 5;
}
.px-chat-composer-inner { max-width: 680px; margin: 0 auto; }
.px-chat-composer-box {
  border: 1px solid rgba(255,255,255,0.11); background: #18191c;
  border-radius: 6px; overflow: hidden; transition: border-color 0.2s;
}
.px-chat-composer-box:focus-within { border-color: rgba(255,255,255,0.2); }
.px-chat-textarea {
  display: block; width: 100%; resize: none; outline: none; border: none;
  background: transparent; color: #c6c9d6;
  padding: 0.85rem 1rem 0.6rem;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.8rem; line-height: 1.6;
  min-height: 72px; max-height: 180px;
}
.px-chat-textarea::placeholder { color: #42474f; }
.px-chat-composer-footer {
  display: flex; align-items: center; gap: 8px;
  padding: 0.45rem 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.px-cc-icon-btn {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.1); background: none; border-radius: 4px;
  cursor: pointer; color: ${TEXT_MUTED};
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.px-cc-icon-btn:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.16); color: ${TEXT_SECONDARY}; }
.px-cc-search-btn {
  display: flex; align-items: center; gap: 7px; height: 30px; padding: 0 10px;
  border: 1px solid rgba(255,255,255,0.1); background: none; border-radius: 4px;
  cursor: pointer; color: ${TEXT_MUTED};
  font-family: ui-monospace, monospace; font-size: 0.68rem;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.px-cc-search-btn:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.16); color: ${TEXT_SECONDARY}; }
.px-cc-send {
  width: 30px; height: 30px; border: 1px solid rgba(255,255,255,0.13);
  background: #18191c; display: flex; align-items: center; justify-content: center;
  border-radius: 4px; cursor: pointer; margin-left: auto;
  transition: border-color 0.15s, background 0.15s;
}
.px-cc-send:hover { border-color: rgba(0,216,237,0.4); background: rgba(0,216,237,0.06); }
.px-composer-hint {
  text-align: center; font-size: 0.62rem; color: ${TEXT_MUTED};
  margin-top: 0.5rem; font-family: 'Geist', sans-serif; font-weight: 300; letter-spacing: 0.02em;
}

/* toast */
.px-toast {
  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
  border: 1px solid rgba(0,216,237,0.24); background: rgba(8,10,11,0.92);
  color: #cdd2d9; padding: 11px 16px; max-width: 600px;
  font-size: 12px; font-family: ui-monospace, Menlo, monospace;
  white-space: nowrap; transition: opacity 180ms ease; pointer-events: none; z-index: 100;
}
`;

// ── typewriter hook (for hero placeholder) ───────────────────
function useTypewriter(phrases, speed = 40, pause = 2400) {
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
      t = setTimeout(() => { setDisplayed(cur.slice(0, ci)); setCi(c => c - 1); }, speed / 2);
    } else {
      setDel(false); setPi(i => (i + 1) % phrases.length);
    }
    return () => clearTimeout(t);
  }, [ci, del, pi, phrases, speed, pause]);
  return displayed;
}

const PLACEHOLDERS = [
  "ASK: Generate a complex component architecture...",
  "ASK: Build a real-time dashboard with WebSockets...",
  "ASK: Create a design system with dark mode support...",
  "ASK: Scaffold a Next.js app with auth and DB...",
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
      { label: "W", bg: "#e34c26", domain: "wired.com" },
      { label: "A", bg: "#1a1a2e", domain: "arxiv.org" },
      { label: "L", bg: "#0077b5", domain: "linkedin.com" },
    ],
  },
];

const MODES = ["Search", "Deep", "Reason"];

// ── ICONS ────────────────────────────────────────────────────
const Ic = {
  Plus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>,
  User: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Settings: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12"/></svg>,
  Logout: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Share: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  More: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" width="14" height="14" fill={CYAN} strokeWidth="0"><path d="M5 11h10.5l-3.8-3.8L13.4 5 21 12l-7.6 7-1.7-2.2 3.8-3.8H5z"/></svg>,
  Nodes: () => <svg viewBox="0 0 24 24" width="12" height="12" fill={CYAN}><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="5" r="2.2"/><circle cx="19" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/></svg>,
  Clear: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v4m0 6v4M5 12h4m6 0h4"/><circle cx="12" cy="12" r="7" opacity=".2"/></svg>,
  Attach: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  CodeGen: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6b6c72" strokeWidth="1.6"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Design: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6b6c72" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12"/></svg>,
  Deploy: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6b6c72" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6b6c72" strokeWidth="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

// ── MESSAGE ──────────────────────────────────────────────────
function Message({ role, text, sources, typing }) {
  const isUser = role === "user";
  return (
    <div className={`px-msg${isUser ? " user" : ""}`}>
      <div className="px-msg-role">
        <span className={`px-msg-role-dot${isUser ? " user" : ""}`} />
        {isUser ? "You" : "Purplex"}
      </div>
      <div className="px-msg-bubble">
        {typing
          ? <div className="px-typing-dots"><div className="px-typing-dot"/><div className="px-typing-dot"/><div className="px-typing-dot"/></div>
          : text}
        {!typing && sources?.length > 0 && (
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

// ── HERO SCREEN (original Kreona design, now with sidebar) ───
function HeroScreen({ onSend }) {
  const [value, setValue] = useState("");
  const placeholder = useTypewriter(PLACEHOLDERS, 38, 2600);

  function send() {
    const text = value.trim() || PLACEHOLDERS[0].replace("ASK: ", "").replace("...", "");
    onSend(text);
  }
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="px-hero-screen">
      {/* beams */}
      <div className="px-beam-v px-beam-vl" aria-hidden="true" />
      <div className="px-beam-v px-beam-vr" aria-hidden="true" />

      {/* hero text */}
      <section className="px-hero-section" aria-label="Studio">
        <h1 className="px-hero-title">
          AI-Powered Code &amp;<br />Architecture Design
        </h1>
        <p className="px-hero-sub">
          Kreona Studio is your source for high-quality, scalable web assembly.<br />
          Generate components, create designs, and chat with AI in seconds.
        </p>
      </section>

      {/* stage */}
      <section
        style={{ position: "relative", zIndex: 2, width: "min(100%, 1200px)", height: 440, margin: "48px auto 0" }}
        aria-label="Command center"
      >
        {/* cyan rule */}
        <div className="px-cyan-rule" aria-hidden="true" />

        {/* CTA row */}
        <div className="px-cta-row">
          <div className="px-cta-line-l">
            <div className="px-beam-h px-beam-hl" />
          </div>
          <button className="px-cta-btn" onClick={send}>START BUILDING FREE</button>
          <div className="px-cta-line-r">
            <div className="px-beam-h px-beam-hr" />
          </div>
        </div>

        {/* frame horizontal lines */}
        <div className="px-frame-line-h" style={{ position: "absolute", top: 85 + 48, left: 90, right: 90 }} />
        <div className="px-frame-line-h" style={{ position: "absolute", bottom: 68, left: 90, right: 90 }} />

        {/* Feature: Code Gen — top left */}
        <div className="px-feat" style={{ left: 90 - 45, top: 85 - 36 }}>
          <div className="px-feat-icon"><Ic.CodeGen /></div>
          <span>Code Gen</span>
        </div>
        {/* Feature: Design Sys — top right */}
        <div className="px-feat" style={{ right: 90 - 45, top: 85 - 36 }}>
          <div className="px-feat-icon"><Ic.Design /></div>
          <span>Design Sys</span>
        </div>
        {/* Feature: Deploy — bottom left */}
        <div className="px-feat" style={{ left: 90 - 45, bottom: 30 }}>
          <div className="px-feat-icon"><Ic.Deploy /></div>
          <span>Deploy</span>
        </div>
        {/* Feature: AI Chat — bottom right */}
        <div className="px-feat" style={{ right: 90 - 45, bottom: 30 }}>
          <div className="px-feat-icon"><Ic.Chat /></div>
          <span>AI Chat</span>
        </div>

        {/* Composer */}
        <div className="px-composer-stage">
          <textarea
            className="px-stage-textarea"
            spellCheck={false}
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
          />
          <div className="px-stage-footer">
            <button className="px-stage-icon-btn" onClick={() => setValue("")} aria-label="Clear">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={CYAN} strokeWidth="2"><path d="M12 5v4m0 6v4M5 12h4m6 0h4"/><circle cx="12" cy="12" r="7" opacity=".25"/></svg>
            </button>
            <button className="px-stage-search-btn">
              <Ic.Nodes /><span>/Search-Command</span>
            </button>
            <button className="px-stage-send-btn" onClick={send} aria-label="Send">
              <Ic.Send />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── CHAT VIEW ────────────────────────────────────────────────
function ChatView({ messages, isTyping, onSend }) {
  const [value, setValue] = useState("");
  const areaRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (areaRef.current) areaRef.current.scrollTop = areaRef.current.scrollHeight;
  }, [messages, isTyping]);

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
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
            <Message key={i} role={m.role} text={m.text} sources={m.sources} />
          ))}
          {isTyping && <Message role="assistant" typing />}
        </div>
      </div>
      <div className="px-chat-composer">
        <div className="px-chat-composer-inner">
          <div className="px-chat-composer-box">
            <textarea
              ref={taRef}
              className="px-chat-textarea"
              placeholder="ASK: Search the live web for anything…"
              value={value}
              onChange={e => { setValue(e.target.value); autoResize(e.target); }}
              onKeyDown={handleKey}
              spellCheck={false}
            />
            <div className="px-chat-composer-footer">
              <button className="px-cc-icon-btn" onClick={() => setValue("")}><Ic.Clear /></button>
              <button className="px-cc-search-btn"><Ic.Nodes />/Search-Command</button>
              <button className="px-cc-icon-btn"><Ic.Attach /></button>
              <button className="px-cc-send" onClick={send}><Ic.Send /></button>
            </div>
          </div>
          <p className="px-composer-hint">purplex reads the live web — answers cite real sources &nbsp;·&nbsp; press ⏎ to send</p>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────
export default function PurplexDashboard() {
  const [chatGroups, setChatGroups] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(null); // null = hero
  const [activeTitle, setActiveTitle] = useState("New search");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("Search");
  const [toast, setToast] = useState({ text: "", visible: false });
  const toastTimer = useRef(null);
  const nextId = useRef(100);

  useEffect(() => {
    const id = "purplex-dash-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style"); s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  function showToast(msg) {
    clearTimeout(toastTimer.current);
    setToast({ text: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3800);
  }

  function selectChat(id, title) {
    setActiveChatId(id);
    setActiveTitle(title);
    setMessages(SEED_MESSAGES);
    setIsTyping(false);
  }

  function newChat() {
    setActiveChatId(null);
    setActiveTitle("New search");
    setMessages([]);
    setIsTyping(false);
  }

  function handleSend(text) {
    const shortTitle = text.length > 40 ? text.slice(0, 40) + "…" : text;

    // If coming from hero, create new chat
    if (activeChatId === null) {
      const id = nextId.current++;
      setChatGroups(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], items: [{ id, title: shortTitle, time: "now" }, ...updated[0].items] };
        return updated;
      });
      setActiveChatId(id);
      setActiveTitle(shortTitle);
      setMessages([{ role: "user", text, sources: [] }]);
    } else {
      setMessages(prev => [...prev, { role: "user", text, sources: [] }]);
      setActiveTitle(shortTitle);
    }

    showToast("Searching live web…");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Based on live web sources retrieved in real time, here's a synthesised answer cross-referenced for accuracy and completeness across multiple authoritative references.",
        sources: [
          { label: "W", bg: "#e34c26", domain: "wired.com" },
          { label: "A", bg: "#1a1a2e", domain: "arxiv.org" },
        ],
      }]);
    }, 2000);
  }

  const isHero = activeChatId === null;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", background: BG, color: TEXT_PRIMARY, fontFamily: "'Geist', sans-serif", overflow: "hidden" }}>
      {/* ── SIDEBAR ── */}
      <aside className="px-sidebar">
        <div className="px-sidebar-logo" onClick={newChat}>
          <div className="px-logo-mark">P</div>
          <span className="px-logo-text">purplex</span>
        </div>
        <div style={{ margin: "0.9rem 0.85rem 0.5rem" }}>
          <button className="px-new-chat-btn" onClick={newChat}><Ic.Plus /> New search</button>
        </div>
        <div className="px-sidebar-chats">
          {chatGroups.map((group, gi) => (
            <div key={gi}>
              <div className="px-section-label" style={gi > 0 ? { marginTop: "0.5rem" } : {}}>{group.group}</div>
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
          <hr className="px-sidebar-divider" />
          <button className="px-sidebar-btn"><Ic.User /> Account</button>
          <button className="px-sidebar-btn"><Ic.Settings /> Settings</button>
          <button className="px-sidebar-btn danger"><Ic.Logout /> Sign out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="px-main">
        {/* topbar always visible */}
        <div className="px-topbar">
          <div className="px-topbar-title">{activeTitle}</div>
          <div className="px-topbar-actions">
            <div className="px-mode-toggle">
              {MODES.map(m => (
                <button key={m} className={`px-mode-btn${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>{m}</button>
              ))}
            </div>
            <div className="px-live-badge"><span className="px-badge-dot" />Live</div>
            <button className="px-topbar-icon-btn"><Ic.Share /></button>
            <button className="px-topbar-icon-btn"><Ic.More /></button>
          </div>
        </div>

        {/* hero or chat */}
        {isHero
          ? <HeroScreen onSend={handleSend} />
          : <ChatView messages={messages} isTyping={isTyping} onSend={handleSend} />
        }
      </main>

      {/* toast */}
      <div className="px-toast" role="status" aria-live="polite" style={{ opacity: toast.visible ? 1 : 0 }}>
        {toast.text}
      </div>
    </div>
  );
}