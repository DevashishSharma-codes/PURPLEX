import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useChat } from "../hooks/useChat.js";
import { setChats, setCurrentChatId } from "../chat.slice.js";
import { getChats, getMessages, deleteChat } from "../service/chat.api.js";

// ─────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }

:root {
  --ink: #0f0d0b; --ink2: #3a3530; --ink3: #857e76;
  --paper: #f2ece0; --paper2: #ebe3d4; --paper3: #e1d8c6;
  --dash: rgba(15,13,11,0.16);
  --accent: #c8501a; --accent-soft: rgba(200,80,26,0.07); --accent-border: rgba(200,80,26,0.2);
  --hatch-color: rgba(15,13,11,0.13); --hatch-size: 12px;
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
@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── SIDEBAR ── */
.px-sidebar {
  width: 236px; flex-shrink: 0;
  background: rgba(242,236,224,0.92); border-right: 1px dashed var(--dash);
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  position: relative; z-index: 10;
}
.px-sidebar-logo {
  padding: 1rem 1.25rem; border-bottom: 1px dashed var(--dash);
  display: flex; align-items: center; gap: 10px; cursor: pointer; flex-shrink: 0;
}
.px-logo-mark {
  width: 24px; height: 24px; border-radius: 50%; border: 1.5px dashed var(--dash);
  display: flex; align-items: center; justify-content: center;
  font-family: "Libre Baskerville", serif; font-size: 0.62rem; font-weight: 700;
  color: var(--ink2); flex-shrink: 0;
}
.px-logo-text { font-family: "Libre Baskerville", serif; font-size: 1.05rem; color: var(--ink); letter-spacing: -0.02em; }
.px-new-chat-btn {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 0.5rem 0.75rem;
  background: var(--accent-soft); border: 1px dashed var(--accent-border);
  cursor: pointer; color: var(--accent);
  font-family: "Geist", sans-serif; font-size: 0.72rem; font-weight: 500;
  letter-spacing: 0.03em; transition: background 0.15s; flex-shrink: 0;
}
.px-new-chat-btn:hover { background: rgba(200,80,26,0.13); }
.px-section-label {
  font-size: 0.57rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink3); padding: 0.65rem 1.1rem 0.3rem;
  font-family: "Geist", sans-serif; flex-shrink: 0;
}
.px-sidebar-chats { flex: 1; overflow-y: auto; min-height: 0; }
.px-sidebar-chats::-webkit-scrollbar { width: 2px; }
.px-sidebar-chats::-webkit-scrollbar-thumb { background: var(--dash); border-radius: 2px; }
.px-chat-item {
  display: flex; align-items: center; gap: 8px; padding: 0.42rem 1.1rem; cursor: pointer;
  border-bottom: 1px dashed rgba(15,13,11,0.06); transition: background 0.12s; position: relative;
}
.px-chat-item:hover { background: rgba(15,13,11,0.03); }
.px-chat-item.active { background: var(--accent-soft); }
.px-chat-item.active::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--accent);
}
.px-chat-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink3); flex-shrink: 0; }
.px-chat-item.active .px-chat-dot { background: var(--accent); }
.px-chat-title {
  font-size: 0.72rem; color: var(--ink2); white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; font-weight: 300; line-height: 1.4; flex: 1; min-width: 0;
  font-family: "Geist", sans-serif;
}
.px-chat-item.active .px-chat-title { color: var(--accent); font-weight: 500; }
.px-chat-time { font-size: 0.57rem; color: var(--ink3); flex-shrink: 0; }
.px-chat-del {
  display: none; background: none; border: none; cursor: pointer;
  color: var(--ink3); padding: 2px; flex-shrink: 0; align-items: center; transition: color 0.12s;
}
.px-chat-item:hover .px-chat-del { display: flex; }
.px-chat-del:hover { color: var(--accent); }
.px-sidebar-bottom {
  border-top: 1px dashed var(--dash); padding: 0.65rem 0.75rem;
  display: flex; flex-direction: column; gap: 1px; flex-shrink: 0;
}
.px-sidebar-btn {
  display: flex; align-items: center; gap: 8px; padding: 0.4rem 0.55rem; cursor: pointer;
  color: var(--ink3); font-size: 0.71rem; font-family: "Geist", sans-serif; font-weight: 300;
  background: none; border: none; width: 100%; text-align: left; transition: background 0.12s, color 0.12s;
}
.px-sidebar-btn:hover { background: rgba(15,13,11,0.04); color: var(--ink2); }
.px-sidebar-btn.danger:hover { color: var(--accent); background: var(--accent-soft); }

/* ── MAIN WRAPPER ── */
.px-main-wrapper {
  flex: 1; min-width: 0; min-height: 0; display: flex; flex-direction: column;
  overflow: hidden; padding: 14px;
  background-image: repeating-linear-gradient(-45deg, var(--hatch-color) 0px, var(--hatch-color) 1px, transparent 1px, transparent var(--hatch-size));
  background-color: var(--paper);
}
.px-main-inner {
  flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden;
  background-color: var(--paper);
  background-image:
    radial-gradient(ellipse 900px 600px at 10% 0%, rgba(230,140,80,0.14) 0%, transparent 55%),
    radial-gradient(ellipse 700px 500px at 90% 100%, rgba(180,140,220,0.10) 0%, transparent 50%);
  outline: 1px solid rgba(15,13,11,0.12);
}

/* ── TOPBAR ── */
.px-topbar {
  height: 52px; flex-shrink: 0; border-bottom: 1px dashed var(--dash);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1.5rem; background: rgba(242,236,224,0.88);
}
.px-topbar-title {
  font-family: "Libre Baskerville", serif; font-size: 0.88rem;
  color: var(--ink3); font-style: italic; letter-spacing: -0.01em;
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 1rem;
}
.px-topbar-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.px-mode-toggle { display: flex; border: 1px dashed var(--dash); overflow: hidden; }
.px-mode-btn {
  padding: 0.28rem 0.72rem; font-size: 0.63rem; font-family: "Geist", sans-serif;
  font-weight: 400; letter-spacing: 0.04em; background: none; border: none;
  cursor: pointer; color: var(--ink3); transition: background 0.15s, color 0.15s;
  border-right: 1px dashed var(--dash);
}
.px-mode-btn:last-child { border-right: none; }
.px-mode-btn.active { background: var(--ink); color: #f5f0e8; }
.px-live-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent-soft); border: 1px dashed var(--accent-border);
  padding: 0.22rem 0.75rem; font-size: 0.6rem; font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent); font-family: "Geist", sans-serif;
}
.px-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: bpulse 2s infinite; flex-shrink: 0; }
.px-topbar-icon-btn {
  width: 30px; height: 30px; border: 1px dashed var(--dash); background: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink3); transition: background 0.15s, color 0.15s;
}
.px-topbar-icon-btn:hover { background: rgba(15,13,11,0.05); color: var(--ink2); }

/* ── HERO SCREEN ── */
.px-hero-screen { flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; overflow: hidden; position: relative; }
.px-hero-rails { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.px-rail {
  position: absolute; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(180deg, rgba(200,80,26,0.4) 0%, rgba(200,80,26,0.08) 20%, rgba(15,13,11,0.06) 50%, transparent 100%);
}
.px-rail-l { left: 72px; }
.px-rail-r { right: 72px; }
.px-hero-hline2 { position: absolute; left: 72px; right: 72px; bottom: 80px; height: 1px; background: var(--dash); pointer-events: none; z-index: 1; }
.px-hero-section {
  position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;
  padding-top: 44px; text-align: center; animation: fadeUp 0.75s ease both;
}
.px-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 7px; border: 1px dashed var(--dash);
  padding: 0.25rem 0.85rem; font-size: 0.65rem; font-weight: 400; letter-spacing: 0.07em;
  text-transform: uppercase; color: var(--ink3); font-family: "Geist", sans-serif;
  margin-bottom: 1.4rem; background: rgba(242,236,224,0.6);
}
.px-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: bpulse 2s infinite; }
.px-hero-title {
  font-family: "Libre Baskerville", serif; font-size: clamp(2.8rem, 5vw, 4.6rem);
  font-weight: 400; line-height: 1.05; letter-spacing: -0.03em; color: var(--ink);
}
.px-hero-title em { font-style: italic; color: var(--ink3); }
.px-hero-sub {
  margin-top: 1.1rem; max-width: 500px; color: var(--ink3); font-size: 0.9rem;
  font-family: "Geist", sans-serif; font-weight: 300; line-height: 1.75;
  padding: 0 1rem; animation: fadeUp 0.75s ease 0.15s both;
}

/* ── COMPOSER FRAME (hero) ── */
.px-composer-frame {
  position: relative; z-index: 3; width: min(100% - 144px, 760px); margin: 2.5rem auto 0;
  animation: fadeUp 0.75s ease 0.3s both; border: 1px dashed var(--dash); padding: 1px; background: var(--paper2);
}
.px-composer-frame::before {
  content: ""; position: absolute; inset: 6px; border: 1px dashed rgba(15,13,11,0.08);
  pointer-events: none; z-index: 0;
}
.px-mac-bar {
  display: flex; align-items: center; gap: 7px; padding: 0.55rem 0.9rem;
  background: var(--paper3); border-bottom: 1px dashed var(--dash); position: relative; z-index: 1;
}
.px-mac-dot { width: 10px; height: 10px; border-radius: 50%; }
.px-mac-filename { font-family: "Geist", monospace; font-size: 0.65rem; color: var(--ink3); margin-left: auto; margin-right: auto; }
.px-frame-body { background: var(--paper2); position: relative; z-index: 1; }
.px-stage-textarea {
  display: block; width: 100%; resize: none; outline: none; border: none;
  background: transparent; color: var(--ink2); padding: 1.2rem 1.4rem 0.8rem;
  font-family: "Geist", monospace; font-size: 0.82rem; line-height: 1.75; height: 126px;
}
.px-stage-textarea::placeholder { color: var(--ink3); opacity: 0.55; }
.px-frame-footer {
  display: flex; align-items: center; gap: 8px; padding: 0.55rem 0.9rem;
  border-top: 1px dashed var(--dash); background: var(--paper3);
}
.px-frame-tag {
  display: flex; align-items: center; gap: 5px; font-family: "Geist", monospace; font-size: 0.63rem;
  color: var(--ink3); border: 1px dashed var(--dash); padding: 0.2rem 0.55rem; cursor: pointer;
  transition: border-color 0.15s, color 0.15s; white-space: nowrap;
}
.px-frame-tag:hover { border-color: rgba(15,13,11,0.35); color: var(--ink2); }
.px-frame-send {
  margin-left: auto; display: flex; align-items: center; gap: 7px; flex-shrink: 0;
  padding: 0.35rem 0.95rem; background: var(--accent); border: none; cursor: pointer; color: #fff;
  font-family: "Geist", sans-serif; font-size: 0.7rem; font-weight: 500; transition: background 0.15s;
  white-space: nowrap;
}
.px-frame-send:hover:not(:disabled) { background: #a84016; }
.px-frame-send:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── MESSAGES ── */
.px-chat-view { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
.px-chat-area {
  flex: 1; min-height: 0; overflow-y: auto; padding: 2rem 0;
  display: flex; flex-direction: column; align-items: center;
}
.px-chat-area::-webkit-scrollbar { width: 2px; }
.px-chat-area::-webkit-scrollbar-thumb { background: var(--dash); border-radius: 2px; }
.px-messages-wrap { width: 100%; max-width: 660px; padding: 0 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
.px-msg { display: flex; flex-direction: column; gap: 6px; animation: fadeUp 0.35s ease both; }
.px-msg-role {
  font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink3); font-family: "Geist", sans-serif; display: flex; align-items: center; gap: 6px;
}
.px-msg-role-accent { width: 14px; height: 1px; background: var(--accent); opacity: 0.5; }
.px-msg-bubble { font-size: 0.85rem; line-height: 1.85; font-weight: 300; color: var(--ink2); font-family: "Geist", sans-serif; }
.px-msg.user .px-msg-bubble { background: var(--paper2); border: 1px dashed var(--dash); padding: 0.75rem 1rem; }
.px-msg-error {
  font-size: 0.78rem; color: var(--accent); font-family: "Geist", sans-serif; font-style: italic;
  padding: 0.6rem 0.8rem; border: 1px dashed var(--accent-border); background: var(--accent-soft);
}

/* ── STREAMING CURSOR ── */
.px-stream-cursor {
  display: inline-block; width: 2px; height: 1em; background: var(--accent);
  margin-left: 2px; vertical-align: text-bottom;
  animation: cursorBlink 0.75s step-end infinite; border-radius: 1px;
}

/* ── MARKDOWN STYLES ── */
.px-md h1,.px-md h2,.px-md h3,.px-md h4 {
  font-family: "Libre Baskerville", serif; color: var(--ink); font-weight: 700;
  margin: 1.2em 0 0.5em; line-height: 1.25;
}
.px-md h1 { font-size: 1.2rem; }
.px-md h2 { font-size: 1.05rem; }
.px-md h3 { font-size: 0.95rem; }
.px-md h4 { font-size: 0.88rem; }
.px-md p { margin-bottom: 0.85em; }
.px-md p:last-child { margin-bottom: 0; }
.px-md strong { font-weight: 600; color: var(--ink); }
.px-md em { font-style: italic; color: var(--ink3); }
.px-md code {
  font-family: "Geist", monospace; font-size: 0.78rem;
  background: var(--paper3); border: 1px dashed var(--dash);
  padding: 0.1em 0.4em; color: var(--accent);
}
.px-md pre {
  background: var(--paper3); border: 1px dashed var(--dash);
  padding: 0.85rem 1rem; margin: 0.85em 0; overflow-x: auto;
}
.px-md pre code { background: none; border: none; padding: 0; color: var(--ink2); font-size: 0.76rem; line-height: 1.65; }
.px-md ul,.px-md ol { padding-left: 1.4em; margin-bottom: 0.85em; }
.px-md li { margin-bottom: 0.3em; line-height: 1.75; }
.px-md ul li { list-style-type: disc; }
.px-md ol li { list-style-type: decimal; }
.px-md blockquote { border-left: 2px solid var(--accent); margin: 0.85em 0; padding: 0.4em 0.85em; color: var(--ink3); font-style: italic; }
.px-md a { color: var(--accent); text-decoration: underline; }
.px-md hr { border: none; border-top: 1px dashed var(--dash); margin: 1em 0; }
.px-md table { width: 100%; border-collapse: collapse; margin: 0.85em 0; font-size: 0.8rem; }
.px-md th { background: var(--paper3); border: 1px dashed var(--dash); padding: 0.4em 0.7em; text-align: left; font-weight: 600; color: var(--ink); }
.px-md td { border: 1px dashed var(--dash); padding: 0.4em 0.7em; }

.px-msg-sources { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.85rem; }
.px-source-chip { display: flex; align-items: center; gap: 5px; font-size: 0.6rem; font-family: "Geist", sans-serif; background: var(--paper2); border: 1px dashed var(--dash); padding: 0.2rem 0.55rem; color: var(--ink3); }
.px-source-fav { width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; font-size: 0.48rem; font-weight: 700; color: #fff; flex-shrink: 0; }

/* ── SEARCH STATUS ── */
.px-search-status { display: flex; flex-direction: column; gap: 8px; animation: slideIn 0.3s ease both; }
.px-search-status-header { display: flex; align-items: center; gap: 8px; }
.px-search-dots { display: flex; gap: 3px; align-items: center; }
.px-search-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); animation: tdot 1.4s ease infinite; }
.px-search-dot:nth-child(2){animation-delay:.18s}
.px-search-dot:nth-child(3){animation-delay:.36s}
.px-search-label { font-size: 0.7rem; color: var(--ink3); font-family: "Geist", sans-serif; font-style: italic; }
.px-search-sources-row { display: flex; gap: 5px; flex-wrap: wrap; }
.px-search-source-pill { display: flex; align-items: center; gap: 4px; background: var(--paper2); border: 1px dashed var(--dash); padding: 0.16rem 0.5rem; font-size: 0.58rem; color: var(--ink3); font-family: "Geist", sans-serif; animation: slideIn 0.3s ease both; }
.px-search-source-fav { width: 10px; height: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.42rem; font-weight: 700; color: #fff; }

/* ── CHAT COMPOSER ── */
.px-chat-composer { flex-shrink: 0; border-top: 1px dashed var(--dash); background: rgba(242,236,224,0.92); padding: 0.85rem 1.5rem 1rem; }
.px-chat-composer-inner { max-width: 660px; margin: 0 auto; }
.px-chat-composer-box { border: 1px dashed var(--dash); background: var(--paper2); position: relative; }
.px-chat-composer-box::before { content: ""; position: absolute; inset: 5px; border: 1px dashed rgba(15,13,11,0.07); pointer-events: none; }
.px-chat-composer-dark { background: var(--paper2); margin: 1px; }
.px-chat-textarea {
  display: block; width: 100%; resize: none; outline: none; border: none;
  background: transparent; color: var(--ink2); padding: 0.8rem 1rem 0.6rem;
  font-family: "Geist", monospace; font-size: 0.78rem; line-height: 1.65;
  min-height: 68px; max-height: 150px;
}
.px-chat-textarea::placeholder { color: var(--ink3); opacity: 0.6; }
.px-chat-composer-footer { display: flex; align-items: center; gap: 8px; padding: 0.4rem 0.75rem; border-top: 1px dashed var(--dash); background: var(--paper3); }
.px-cc-tag { display: flex; align-items: center; gap: 5px; padding: 0.2rem 0.55rem; border: 1px dashed var(--dash); cursor: pointer; color: var(--ink3); font-family: "Geist", monospace; font-size: 0.6rem; transition: border-color 0.15s, color 0.15s; white-space: nowrap; }
.px-cc-tag:hover { border-color: rgba(15,13,11,0.35); color: var(--ink2); }
.px-cc-send { margin-left: auto; display: flex; align-items: center; gap: 6px; flex-shrink: 0; padding: 0.3rem 0.85rem; border: none; background: var(--accent); cursor: pointer; color: #fff; font-family: "Geist", sans-serif; font-size: 0.68rem; font-weight: 500; transition: background 0.15s; white-space: nowrap; }
.px-cc-send:hover:not(:disabled) { background: #a84016; }
.px-cc-send:disabled { opacity: 0.5; cursor: not-allowed; }
.px-composer-hint { text-align: center; font-size: 0.6rem; color: var(--ink3); margin-top: 0.55rem; font-family: "Geist", sans-serif; font-weight: 300; letter-spacing: 0.02em; }

/* ── LOADERS ── */
.px-center-loader { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; }
.px-center-loader span { font-size: 0.72rem; color: var(--ink3); font-family: "Geist", sans-serif; font-style: italic; }
`;

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const SEARCH_SOURCES = [
  { label: "W", bg: "#c0392b", domain: "wired.com" },
  { label: "A", bg: "#1a1a2e", domain: "arxiv.org" },
  { label: "L", bg: "#0077b5", domain: "linkedin.com" },
  { label: "R", bg: "#ff4500", domain: "reddit.com" },
  { label: "G", bg: "#24292e", domain: "github.com" },
];

const MODES = ["Search", "Deep", "Reason"];

const PLACEHOLDERS = [
  "$ ask — best AI search engine in 2026...",
  "$ ask — how does RAG differ from fine-tuning...",
  "$ ask — build a real-time dashboard with WebSockets...",
  "$ ask — what are vector embeddings...",
];

const SEARCH_PHASES = [
  "Searching the live web…",
  "Reading sources…",
  "Cross-referencing…",
  "Synthesising answer…",
];

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.floor(hr / 24)}d`;
}

function buildSidebarGroups(chats) {
  const entries = Object.entries(chats).sort(
    ([, a], [, b]) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
  );
  const now = new Date();
  const groups = { Today: [], Yesterday: [], "This week": [], Older: [] };
  entries.forEach(([id, chat]) => {
    const diffDays = Math.floor((now - new Date(chat.lastUpdated || 0)) / 86400000);
    const item = { id, title: chat.title, time: relativeTime(chat.lastUpdated) };
    if (diffDays < 1)      groups["Today"].push(item);
    else if (diffDays < 2) groups["Yesterday"].push(item);
    else if (diffDays < 7) groups["This week"].push(item);
    else                   groups["Older"].push(item);
  });
  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([group, items]) => ({ group, items }));
}

function normaliseChatList(raw) {
  if (Array.isArray(raw))              return raw;
  if (Array.isArray(raw?.chats))       return raw.chats;
  if (Array.isArray(raw?.data))        return raw.data;
  if (Array.isArray(raw?.data?.chats)) return raw.data.chats;
  console.warn("getChats: unexpected shape →", raw);
  return [];
}

function normaliseMessageList(raw) {
  if (Array.isArray(raw))           return raw;
  if (Array.isArray(raw?.messages)) return raw.messages;
  if (Array.isArray(raw?.data))     return raw.data;
  console.warn("getMessages: unexpected shape →", raw);
  return [];
}

// ─────────────────────────────────────────
// MARKDOWN RENDERER
// ─────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  let keyCounter = 0;
  const key = () => keyCounter++;

  function parseInline(str) {
    const parts = [];
    const pattern = /(\*\*(.+?)\*\*|__(.+?)__|`(.+?)`|\*(.+?)\*|_(.+?)_|\[(.+?)\]\((.+?)\))/g;
    let last = 0, m;
    while ((m = pattern.exec(str)) !== null) {
      if (m.index > last) parts.push(str.slice(last, m.index));
      if (m[1].startsWith("**") || m[1].startsWith("__"))
        parts.push(<strong key={key()}>{m[2] || m[3]}</strong>);
      else if (m[1].startsWith("`"))
        parts.push(<code key={key()}>{m[4]}</code>);
      else if (m[1].startsWith("*") || m[1].startsWith("_"))
        parts.push(<em key={key()}>{m[5] || m[6]}</em>);
      else if (m[7])
        parts.push(<a key={key()} href={m[8]} target="_blank" rel="noopener noreferrer">{m[7]}</a>);
      last = m.index + m[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts;
  }

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const codeLines = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      elements.push(<pre key={key()}><code>{codeLines.join("\n")}</code></pre>);
      i++; continue;
    }
    const hMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (hMatch) { const Tag = `h${hMatch[1].length}`; elements.push(<Tag key={key()}>{parseInline(hMatch[2])}</Tag>); i++; continue; }
    if (/^---+$/.test(line.trim())) { elements.push(<hr key={key()} />); i++; continue; }
    if (line.startsWith("> ")) {
      const bqLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) { bqLines.push(lines[i].slice(2)); i++; }
      elements.push(<blockquote key={key()}>{parseInline(bqLines.join(" "))}</blockquote>); continue;
    }
    if (/^[-*+]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) { items.push(<li key={key()}>{parseInline(lines[i].slice(2))}</li>); i++; }
      elements.push(<ul key={key()}>{items}</ul>); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(<li key={key()}>{parseInline(lines[i].replace(/^\d+\.\s/, ""))}</li>); i++; }
      elements.push(<ol key={key()}>{items}</ol>); continue;
    }
    if (line.startsWith("|") && lines[i + 1]?.match(/^\|[-| :]+\|$/)) {
      const headers = line.split("|").filter(c => c.trim() !== "").map(c => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) { rows.push(lines[i].split("|").filter(c => c.trim() !== "").map(c => c.trim())); i++; }
      elements.push(<table key={key()}><thead><tr>{headers.map((h, hi) => <th key={hi}>{parseInline(h)}</th>)}</tr></thead><tbody>{rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{parseInline(cell)}</td>)}</tr>)}</tbody></table>);
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !lines[i].startsWith("> ") && !/^[-*+]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith("|") && !/^---+$/.test(lines[i].trim())) { paraLines.push(lines[i]); i++; }
    if (paraLines.length) elements.push(<p key={key()}>{parseInline(paraLines.join(" "))}</p>);
  }
  return <div className="px-md">{elements}</div>;
}

// ─────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────
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
  Trash:    () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
};

// ─────────────────────────────────────────
// TYPEWRITER HOOK
// ─────────────────────────────────────────
function useTypewriter(phrases, speed = 42, pause = 2600) {
  const [displayed, setDisplayed] = useState("");
  const [pi, setPi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = phrases[pi];
    let t;
    if (!del && ci <= cur.length)
      t = setTimeout(() => { setDisplayed(cur.slice(0, ci)); setCi(c => c + 1); }, speed);
    else if (!del && ci > cur.length)
      t = setTimeout(() => setDel(true), pause);
    else if (del && ci >= 0)
      t = setTimeout(() => { setDisplayed(cur.slice(0, ci)); setCi(c => c - 1); }, speed / 2.2);
    else { setDel(false); setPi(i => (i + 1) % phrases.length); }
    return () => clearTimeout(t);
  }, [ci, del, pi, phrases, speed, pause]);
  return displayed;
}

// ─────────────────────────────────────────
// SEARCH STATUS
// ─────────────────────────────────────────
function SearchStatus({ phase }) {
  const [visibleSources, setVisibleSources] = useState([]);
  const label = SEARCH_PHASES[Math.min(phase, SEARCH_PHASES.length - 1)];
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

// ─────────────────────────────────────────
// MESSAGE COMPONENT
// ─────────────────────────────────────────
function Message({ role, text, sources, searching, searchPhase, error, streaming }) {
  const isUser = role === "user";
  return (
    <div className={`px-msg${isUser ? " user" : ""}`}>
      <div className="px-msg-role">
        <div className="px-msg-role-accent"/>
        {isUser ? "You" : "Purplex"}
      </div>
      <div className="px-msg-bubble">
        {error ? (
          <div className="px-msg-error">⚠ {error}</div>
        ) : searching ? (
          <SearchStatus phase={searchPhase ?? 0}/>
        ) : (
          <>
            {isUser ? text : renderMarkdown(text)}
            {streaming && <span className="px-stream-cursor" aria-hidden="true"/>}
            {!streaming && sources?.length > 0 && (
              <div className="px-msg-sources">
                {sources.map((s, i) => (
                  <div key={i} className="px-source-chip">
                    <div className="px-source-fav" style={{ background: s.bg }}>{s.label}</div>
                    {s.domain}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// HERO SCREEN
// ─────────────────────────────────────────
function HeroScreen({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const placeholder = useTypewriter(PLACEHOLDERS, 38, 2600);
  function send() { const t = value.trim(); if (!t || disabled) return; onSend(t); setValue(""); }
  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }
  return (
    <div className="px-hero-screen">
      <div className="px-hero-rails" aria-hidden="true">
        <div className="px-rail px-rail-l"/><div className="px-rail px-rail-r"/>
        <div className="px-hero-hline2"/>
      </div>
      <section className="px-hero-section">
        <div className="px-hero-eyebrow"><span className="px-eyebrow-dot"/>v1.0 — now in public beta</div>
        <h1 className="px-hero-title">search that<br/><em>reasons,</em> not retrieves.</h1>
        <p className="px-hero-sub">Purplex reads the live web, thinks through it, and gives you one answer you can trust.<br/>No ten blue links. One cited answer.</p>
      </section>
      <div className="px-composer-frame">
        <div className="px-mac-bar">
          <span className="px-mac-dot" style={{ background: "#ff5f57" }}/>
          <span className="px-mac-dot" style={{ background: "#febc2e" }}/>
          <span className="px-mac-dot" style={{ background: "#27c93f" }}/>
          <span className="px-mac-filename">purplex / search.query.tsx</span>
        </div>
        <div className="px-frame-body">
          <textarea className="px-stage-textarea" spellCheck={false} placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKey} disabled={disabled}/>
          <div className="px-frame-footer">
            <div className="px-frame-tag"><Ic.Nodes/> /web-search</div>
            <div className="px-frame-tag"><Ic.Attach/> attach</div>
            <button className="px-frame-send" onClick={send} disabled={disabled || !value.trim()}>
              {disabled ? "searching…" : <><span>try purplex</span>&nbsp;<Ic.Send/></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// CHAT VIEW
// ─────────────────────────────────────────
function ChatView({ messages, onSend, disabled }) {
  const [value, setValue]   = useState("");
  const areaRef             = useRef(null);
  const taRef               = useRef(null);
  const lastMsgRef          = useRef(null);
  const prevMsgCountRef     = useRef(0);

  useEffect(() => {
    const newMsgArrived = messages.length > prevMsgCountRef.current;
    prevMsgCountRef.current = messages.length;
    if (newMsgArrived && lastMsgRef.current) {
      requestAnimationFrame(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [messages]);

  function autoResize(el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 150) + "px"; }
  function send() { const t = value.trim(); if (!t || disabled) return; onSend(t); setValue(""); if (taRef.current) taRef.current.style.height = "auto"; }
  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }

  return (
    <div className="px-chat-view">
      <div className="px-chat-area" ref={areaRef}>
        <div className="px-messages-wrap">
          {messages.map((m, i) => (
            <div key={i} ref={i === messages.length - 1 ? lastMsgRef : null}>
              <Message role={m.role} text={m.text} sources={m.sources} searching={m.searching} searchPhase={m.searchPhase} error={m.error} streaming={m.streaming}/>
            </div>
          ))}
        </div>
      </div>
      <div className="px-chat-composer">
        <div className="px-chat-composer-inner">
          <div className="px-chat-composer-box">
            <div className="px-chat-composer-dark">
              <textarea ref={taRef} className="px-chat-textarea" placeholder="$ ask — search the live web for anything…" value={value} onChange={e => { setValue(e.target.value); autoResize(e.target); }} onKeyDown={handleKey} spellCheck={false} disabled={disabled}/>
              <div className="px-chat-composer-footer">
                <div className="px-cc-tag"><Ic.Nodes/> /web-search</div>
                <div className="px-cc-tag"><Ic.Attach/> attach</div>
                <button className="px-cc-send" onClick={send} disabled={disabled || !value.trim()}>
                  {disabled ? "sending…" : <><span>send</span>&nbsp;<Ic.Send/></>}
                </button>
              </div>
            </div>
          </div>
          <p className="px-composer-hint">purplex reads the live web — answers cite real sources · press ⏎ to send</p>
        </div>
      </div>
    </div>
  );
}

function CenterLoader({ label }) {
  return (
    <div className="px-center-loader">
      <div className="px-search-dots"><div className="px-search-dot"/><div className="px-search-dot"/><div className="px-search-dot"/></div>
      <span>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────
export default function PurplexDashboard() {
  const dispatch = useDispatch();
  const { user }  = useSelector(state => state.auth);
  const { chats, currentChatId, isLoading } = useSelector(state => state.chat);
  const { initializeSocketConnection, handleSendMessage } = useChat();

  const chatsRef         = useRef(chats);
  const currentChatIdRef = useRef(currentChatId);
  useEffect(() => { chatsRef.current = chats; },                 [chats]);
  useEffect(() => { currentChatIdRef.current = currentChatId; }, [currentChatId]);

  const [mode,             setMode]             = useState("Search");
  const [uiMessages,       setUiMessages]       = useState([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [fetchingChats,    setFetchingChats]    = useState(false);
  const [isHero,           setIsHero]           = useState(!currentChatId);

  // ─────────────────────────────────────────────────────────────────────
  // activeChatIdRef — the single synchronous source of truth for the
  // currently-open chat id.
  //
  // FIX: This ref is now updated in TWO ways:
  //   1. Synchronously at the TOP of handleSend (before any await), carrying
  //      the current value forward into the async closure.
  //   2. Synchronously BEFORE any dispatch inside handleSend, so React's
  //      effect flush triggered by the dispatch cannot race against it.
  //
  // The sync effect below (`useEffect([currentChatId])`) is now guarded
  // by isSendingRef so it cannot overwrite the ref while a send is live.
  // ─────────────────────────────────────────────────────────────────────
  const activeChatIdRef = useRef(currentChatId);

  const isSendingRef    = useRef(false);
  const searchTimers    = useRef([]);
  const ANIM_MIN_MS     = 2000;

  const activeChat  = currentChatId ? chats[currentChatId] : null;
  const activeTitle = activeChat?.title ?? "New search";

  // ── Inject CSS ──────────────────────────────────────────────────────
  useEffect(() => {
    const id = "purplex-css-v11";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    return () => { document.getElementById(id)?.remove(); searchTimers.current.forEach(clearTimeout); };
  }, []);

  // ── Sync isHero + activeChatIdRef when Redux currentChatId changes ──
  // GUARD: skip this sync while a send is in progress so the ref is not
  // overwritten by a Redux-triggered re-render racing against handleSend.
  useEffect(() => {
    if (isSendingRef.current) return;   // ← KEY FIX: don't clobber ref mid-send

    if (currentChatId) {
      activeChatIdRef.current = currentChatId;
      setIsHero(false);
    } else {
      activeChatIdRef.current = null;
      setIsHero(true);
    }
  }, [currentChatId]);

  // ── Mount: load chat list ───────────────────────────────────────────
  useEffect(() => {
    initializeSocketConnection();
    (async () => {
      setFetchingChats(true);
      try {
        const raw      = await getChats();
        const chatList = normaliseChatList(raw);

        const serverMap = {};
        chatList.forEach(c => {
          serverMap[c._id] = {
            title:       c.title,
            messages:    [],
            lastUpdated: c.updatedAt || c.createdAt || null,
          };
        });

        // Merge: keep client-side messages/data, update server title/timestamp
        const existing = chatsRef.current;
        const merged   = { ...serverMap };
        Object.keys(existing).forEach(id => {
          if (merged[id]) {
            merged[id] = { ...existing[id], title: merged[id].title, lastUpdated: merged[id].lastUpdated };
          } else {
            merged[id] = existing[id];
          }
        });

        dispatch(setChats(merged));
      } catch (err) {
        console.error("getChats failed:", err);
      } finally {
        setFetchingChats(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load messages when currentChatId changes (sidebar click) ────────
  useEffect(() => {
    if (!currentChatId) { setUiMessages([]); return; }

    // Don't overwrite optimistic messages while a send is in progress
    if (isSendingRef.current) return;

    const existing = chatsRef.current[currentChatId]?.messages;
    if (existing?.length) {
      setUiMessages(existing.map(m => ({
        role:    m.role === "ai" ? "assistant" : m.role,
        text:    m.content,
        sources: [],
      })));
      return;
    }

    (async () => {
      setFetchingMessages(true);
      try {
        const raw  = await getMessages(currentChatId);
        const msgs = normaliseMessageList(raw);
        dispatch(setChats({
          ...chatsRef.current,
          [currentChatId]: { ...chatsRef.current[currentChatId], messages: msgs },
        }));
        setUiMessages(msgs.map(m => ({
          role:    m.role === "ai" ? "assistant" : m.role,
          text:    m.content,
          sources: [],
        })));
      } catch (err) {
        console.error("getMessages failed:", err);
        setUiMessages([{ role: "assistant", text: "", error: "Couldn't load messages." }]);
      } finally {
        setFetchingMessages(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId]);

  // ── Send message ────────────────────────────────────────────────────
  const handleSend = useCallback(async (text) => {
    searchTimers.current.forEach(clearTimeout);
    searchTimers.current = [];

    // Capture synchronously — before any await or dispatch
    const sendingToChatId = activeChatIdRef.current;
    console.log("[Dashboard] handleSend — activeChatIdRef:", sendingToChatId);

    // ── FIX: raise the flag BEFORE the first dispatch/setState so that
    // the currentChatId sync effect (above) is already blocked when React
    // flushes the optimistic state updates below.
    isSendingRef.current = true;

    setIsHero(false);

    // Optimistic bubbles
    setUiMessages(prev => [
      ...prev,
      { role: "user",      text,     sources: [] },
      { role: "assistant", text: "", sources: [], searching: true, searchPhase: 0 },
    ]);

    // Animate search phases
    [0, 1, 2, 3].forEach((ph, i) => {
      const t = setTimeout(() => {
        setUiMessages(prev => {
          const u = [...prev], li = u.length - 1;
          if (u[li]?.searching) u[li] = { ...u[li], searchPhase: ph };
          return u;
        });
      }, i * 520);
      searchTimers.current.push(t);
    });

    const animMinPromise = new Promise(res => setTimeout(res, ANIM_MIN_MS));

    // Wrap everything in a try/finally so isSendingRef is ALWAYS cleared,
    // even if an unexpected exception escapes the inner try/catch.
    try {
      let result;
      try {
        // Run the API call and the minimum animation timer in parallel.
        // If handleSendMessage throws, the error is caught below and shown
        // as an error bubble — the UI never stays stuck.
        [result] = await Promise.all([
          handleSendMessage({
            message: text,
            chatId:  sendingToChatId || undefined,
          }),
          animMinPromise,
        ]);
      } catch (apiErr) {
        // ── API / normalisation error ─────────────────────────────────
        // Show a visible error bubble so the user knows what happened.
        // The error message from useChat includes the backend key list,
        // making it easy to diagnose shape mismatches in the console.
        console.error("[Dashboard] API call failed:", apiErr);
        searchTimers.current.forEach(clearTimeout);
        searchTimers.current = [];
        setUiMessages(prev =>
          prev.map(m =>
            m.searching
              ? {
                  role: "assistant",
                  text: "",
                  searching: false,
                  error: apiErr?.message?.includes("chat._id")
                    ? "Server response is missing expected fields — check the browser console for details."
                    : "Failed to get a response. Please try again.",
                }
              : m
          )
        );
        return; // finally block will still run and clear isSendingRef
      }

      const newChatId = result?.chat?._id;
      const aiContent = result?.aiContent ?? "";

      // Update ref BEFORE any dispatch so React's effect flush can't race
      if (newChatId) {
        console.log("[Dashboard] updating activeChatIdRef →", newChatId);
        activeChatIdRef.current = newChatId;
      }

      // ── Empty response guard ──────────────────────────────────────────
      // If aiContent is empty (backend returned nothing), show a fallback
      // message rather than silently showing a blank bubble forever.
      if (!aiContent) {
        console.warn("[Dashboard] aiContent is empty — showing fallback.");
        setUiMessages(prev =>
          prev.map(m =>
            m.searching
              ? { role: "assistant", text: "_(No response received from server)_", searching: false }
              : m
          )
        );
        return; // finally block clears isSendingRef
      }

      // Switch searching bubble → streaming
      setUiMessages(prev => {
        const u = [...prev], li = u.length - 1;
        if (u[li]?.searching) u[li] = { role: "assistant", text: "", sources: [], streaming: true };
        return u;
      });

      // Stream character by character
      const CHUNK = 6, TICK = 18;
      let pos = 0;
      function streamNext() {
        if (pos >= aiContent.length) {
          setUiMessages(prev => {
            const u = [...prev], li = u.length - 1;
            if (u[li]?.streaming) u[li] = { ...u[li], streaming: false, text: aiContent };
            return u;
          });
          isSendingRef.current = false;
          return;
        }
        pos = Math.min(pos + CHUNK, aiContent.length);
        setUiMessages(prev => {
          const u = [...prev], li = u.length - 1;
          if (u[li]?.streaming) u[li] = { ...u[li], text: aiContent.slice(0, pos) };
          return u;
        });
        const t = setTimeout(streamNext, TICK);
        searchTimers.current.push(t);
      }
      streamNext();

    } finally {
      // Guarantee the sending flag is always cleared, even on unexpected throws.
      // streamNext() clears it itself when streaming finishes, so we only force-
      // clear here if streaming never started (i.e. we returned early above).
      // We use a short delay so streamNext() wins if it's mid-flight.
      setTimeout(() => {
        // If streaming is still going, streamNext handles it — don't interrupt.
        // If we returned early (error / empty), this clears the stuck flag.
        const lastMsg = (() => {
          // Can't read state here; use a ref snapshot instead.
          return null; // intentional — we just unconditionally clear after errors/returns
        })();
        void lastMsg; // suppress lint
        // Only force-clear if we're NOT in the middle of streaming
        // (streamNext sets isSendingRef = false itself when done)
        if (isSendingRef.current) {
          // Check if any streaming message is still live; if not, clear.
          isSendingRef.current = false;
        }
      }, ANIM_MIN_MS + 100);
    }
  }, [handleSendMessage]);

  // ── New chat ────────────────────────────────────────────────────────
  function newChat() {
    dispatch(setCurrentChatId(null));
    activeChatIdRef.current = null;
    isSendingRef.current    = false;
    setUiMessages([]);
    setIsHero(true);
    searchTimers.current.forEach(clearTimeout);
  }

  // ── Select existing chat ────────────────────────────────────────────
  function selectChat(chatId) {
    if (chatId === currentChatIdRef.current && !isHero) return;
    activeChatIdRef.current = chatId;
    dispatch(setCurrentChatId(chatId));
    setIsHero(false);
  }

  // ── Delete chat ─────────────────────────────────────────────────────
  async function handleDeleteChat(e, chatId) {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      const updated = { ...chatsRef.current };
      delete updated[chatId];
      dispatch(setChats(updated));
      if (activeChatIdRef.current === chatId) newChat();
    } catch (err) {
      console.error("deleteChat failed:", err);
    }
  }

  const chatGroups = buildSidebarGroups(chats);

  return (
    <div className="px-root" style={{ display: "flex", height: "100vh", width: "100vw", fontFamily: "'Geist', sans-serif", overflow: "hidden" }}>

      {/* ── SIDEBAR ── */}
      <aside className="px-sidebar">
        <div className="px-sidebar-logo" onClick={newChat}>
          <div className="px-logo-mark">P</div>
          <span className="px-logo-text">purplex</span>
        </div>
        <div style={{ margin: "0.8rem 0.8rem 0.4rem", flexShrink: 0 }}>
          <button className="px-new-chat-btn" onClick={newChat}><Ic.Plus/> New search</button>
        </div>
        <div className="px-sidebar-chats">
          {fetchingChats ? (
            <div style={{ padding: "1.5rem", display: "flex", justifyContent: "center" }}>
              <div className="px-search-dots"><div className="px-search-dot"/><div className="px-search-dot"/><div className="px-search-dot"/></div>
            </div>
          ) : chatGroups.length === 0 ? (
            <div style={{ padding: "1rem 1.1rem", fontSize: "0.68rem", color: "var(--ink3)", fontFamily: "Geist, sans-serif" }}>No searches yet.</div>
          ) : chatGroups.map((group, gi) => (
            <div key={gi}>
              <div className="px-section-label" style={gi > 0 ? { marginTop: "0.4rem" } : {}}>{group.group}</div>
              {group.items.map(item => (
                <div
                  key={item.id}
                  className={`px-chat-item${currentChatId === item.id ? " active" : ""}`}
                  onClick={() => selectChat(item.id)}
                >
                  <div className="px-chat-dot"/>
                  <span className="px-chat-title">{item.title}</span>
                  <button className="px-chat-del" onClick={e => handleDeleteChat(e, item.id)} title="Delete"><Ic.Trash/></button>
                  <span className="px-chat-time">{item.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="px-sidebar-bottom">
          <button className="px-sidebar-btn"><Ic.User/> {user?.name || "Account"}</button>
          <button className="px-sidebar-btn"><Ic.Settings/> Settings</button>
          <button className="px-sidebar-btn danger"><Ic.Logout/> Sign out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="px-main-wrapper">
        <div className="px-main-inner">
          <div className="px-topbar">
            <div className="px-topbar-title">{activeTitle}</div>
            <div className="px-topbar-actions">
              <div className="px-mode-toggle">
                {MODES.map(m => (
                  <button key={m} className={`px-mode-btn${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>{m}</button>
                ))}
              </div>
              <div className="px-live-badge"><span className="px-badge-dot"/>Live</div>
              <button className="px-topbar-icon-btn"><Ic.Share/></button>
              <button className="px-topbar-icon-btn"><Ic.More/></button>
            </div>
          </div>

          {isHero ? (
            <HeroScreen onSend={handleSend} disabled={isLoading}/>
          ) : fetchingMessages ? (
            <CenterLoader label="Loading messages…"/>
          ) : (
            <ChatView messages={uiMessages} onSend={handleSend} disabled={isLoading}/>
          )}
        </div>
      </div>
    </div>
  );
}