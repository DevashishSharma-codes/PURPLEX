import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Sparkles, Layers, MessageSquareText, ArrowRight, Mail, Command } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DesignStartupLandingPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const screenRotate = useTransform(scrollYProgress, [0, 0.28], [-72, 0]);
  const laptopScale = useTransform(scrollYProgress, [0, 0.28], [0.86, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.22], [0.15, 0.75]);
  const chatOpacity = useTransform(scrollYProgress, [0.08, 0.28], [0, 1]);

  const features = [
    {
      icon: Sparkles,
      title: "AI-native discovery",
      text: "Ask design questions, explore references, and generate direction without leaving your creative flow.",
    },
    {
      icon: Layers,
      title: "Moodboards in seconds",
      text: "Turn prompts into curated visual systems, palettes, typography, layouts, and brand territories.",
    },
    {
      icon: MessageSquareText,
      title: "Chat with your taste",
      text: "A Perplexity-like creative assistant that remembers context and explains every design choice clearly.",
    },
  ];

  const useCases = [
    "Landing page direction",
    "Brand identity exploration",
    "UX audit and critique",
    "Competitor visual research",
    "Color and type systems",
    "Design copywriting",
  ];

  const stats = [
    { value: "10x", label: "faster creative research" },
    { value: "24/7", label: "design assistant" },
    { value: "1", label: "place for strategy + visuals" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-zinc-100 selection:bg-zinc-100 selection:text-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(120,120,120,0.24),transparent_42%),linear-gradient(180deg,#0a0a0a,#030303)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:64px_64px]" />

      {!chatOpen ? (
        <>
          <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-2xl">
                  <Command className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold tracking-tight">MacMuse AI</span>
              </div>

              <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
                <a href="#features" className="transition hover:text-white">Features</a>
                <a href="#newsletter" className="transition hover:text-white">Newsletter</a>
                <button onClick={() => setChatOpen(true)} className="transition hover:text-white">Open App</button>
              </div>

              <Button onClick={() => setChatOpen(true)} className="rounded-full bg-white text-black hover:bg-zinc-200">
                Launch
              </Button>
            </nav>
          </header>

          <section className="relative mx-auto flex min-h-[145vh] max-w-7xl flex-col items-center px-6 pt-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-zinc-300 shadow-2xl backdrop-blur-xl"
            >
              Design intelligence for founders, studios, and product teams
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="max-w-5xl bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-5xl font-semibold tracking-[-0.06em] text-transparent md:text-7xl lg:text-8xl"
            >
              Search the web of design like a creative operating system.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg"
            >
              MacMuse AI blends a Perplexity-style answer engine with taste-aware design research, instant moodboards, and a cinematic MacBook landing experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
            >
              <Button onClick={() => setChatOpen(true)} size="lg" className="rounded-full bg-white px-7 text-black hover:bg-zinc-200">
                Try the chatbot <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-white/15 bg-white/[0.03] px-7 text-white hover:bg-white/10 hover:text-white">
                Watch preview
              </Button>
            </motion.div>

            <motion.div
              style={{ scale: laptopScale }}
              className="sticky top-28 mt-28 w-full max-w-5xl cursor-pointer perspective-[1800px]"
              onClick={() => setChatOpen(true)}
            >
              <motion.div style={{ opacity: glowOpacity }} className="absolute left-1/2 top-24 h-72 w-[78%] -translate-x-1/2 rounded-full bg-white/20 blur-[100px]" />

              <div className="relative mx-auto w-full">
                <motion.div
                  style={{ rotateX: screenRotate, opacity: chatOpacity }}
                  className="origin-bottom rounded-[2rem] border border-white/15 bg-[#0b0b0c] p-3 shadow-[0_50px_160px_rgba(255,255,255,0.13)] [transform-style:preserve-3d]"
                >
                  <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-zinc-600" />
                        <span className="h-3 w-3 rounded-full bg-zinc-500" />
                        <span className="h-3 w-3 rounded-full bg-zinc-400" />
                      </div>
                      <span className="text-xs text-zinc-500">macmuse.ai/search</span>
                      <div className="w-16" />
                    </div>

                    <div className="min-h-[430px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_38%),#050505] p-6 text-left">
                      <div className="mx-auto max-w-2xl pt-12">
                        <div className="mb-5 flex items-center gap-3 text-zinc-400">
                          <Command className="h-5 w-5" />
                          <span className="font-medium text-zinc-200">MacMuse</span>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-2xl">
                          <div className="flex items-center gap-3 rounded-2xl bg-black/60 px-5 py-4">
                            <Search className="h-5 w-5 text-zinc-500" />
                            <span className="flex-1 text-zinc-300">Design a premium SaaS landing page for an AI studio...</span>
                            <Button size="sm" className="rounded-full bg-white text-black hover:bg-zinc-200">Ask</Button>
                          </div>
                        </div>

                        <div className="mt-7 grid gap-3 md:grid-cols-3">
                          {["Brand direction", "UI references", "Copy angles"].map((item) => (
                            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-400">
                              {item}
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
                          <p className="text-sm leading-6 text-zinc-300">
                            Start with a high-contrast black interface, metallic gradients, spacious editorial typography, and a hero visual that feels like opening a MacBook into a private creative terminal.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mx-auto h-8 w-[78%] rounded-b-[2rem] border border-white/10 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black shadow-[0_40px_100px_rgba(0,0,0,0.75)]">
                  <div className="mx-auto h-2 w-36 rounded-b-xl bg-zinc-800" />
                </div>
              </div>

              <p className="mt-8 text-sm text-zinc-500">Scroll to open the MacBook. Click it to enter the chatbot.</p>
            </motion.div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-4 border-y border-white/10 py-8 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-4xl font-semibold text-transparent md:text-6xl">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="mx-auto max-w-7xl px-6 py-28">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">Features</p>
                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Built like a research engine. Styled like a midnight workstation.
                </h2>
              </div>
              <p className="max-w-md text-zinc-400">
                A dark, tactile interface designed for speed, clarity, and creative decision-making.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-white/10 bg-white/[0.045] text-white shadow-2xl backdrop-blur-xl">
                  <CardContent className="p-7">
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/50">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                    <p className="leading-7 text-zinc-400">{feature.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-28">
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-zinc-500">Use cases</p>
                <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">From vague idea to sharp creative direction.</h2>
                <p className="mt-5 leading-7 text-zinc-400">
                  MacMuse is built for founders and design teams who need fast, opinionated answers before opening Figma.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {useCases.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                    className="rounded-3xl border border-white/10 bg-black/45 p-5 text-zinc-300 shadow-xl"
                  >
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-sm text-zinc-400">
                      0{index + 1}
                    </div>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-28">
            <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#080809] shadow-2xl">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12">
                  <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-500">Workflow</p>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Ask. Compare. Decide.</h2>
                  <p className="mt-5 leading-7 text-zinc-400">
                    Instead of collecting scattered screenshots, MacMuse gives you a structured creative answer with visual principles, copy angles, layout guidance, and next actions.
                  </p>
                  <div className="mt-8 space-y-4">
                    {["Search for a style direction", "Generate a visual strategy", "Refine it inside chat", "Move into production"].map((step) => (
                      <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-zinc-300">
                        <span className="h-2 w-2 rounded-full bg-zinc-400" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.13),transparent_36%),#030303] p-6 lg:border-l lg:border-t-0">
                  <div className="rounded-[2rem] border border-white/10 bg-black/70 p-4">
                    <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                      <span className="h-3 w-3 rounded-full bg-zinc-700" />
                      <span className="h-3 w-3 rounded-full bg-zinc-600" />
                      <span className="h-3 w-3 rounded-full bg-zinc-500" />
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-white/[0.06] p-4 text-sm text-zinc-300">What should the landing page feel like?</div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-6 text-zinc-400">
                        Make it feel like a private command center: black glass, silver hardware, soft bloom, compact answers, and a strong product reveal.
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-28 rounded-2xl bg-gradient-to-br from-zinc-800 to-black" />
                        <div className="h-28 rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-950 to-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="newsletter" className="mx-auto max-w-5xl px-6 pb-28">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.13),transparent_42%),rgba(255,255,255,0.045)] p-8 shadow-2xl backdrop-blur-2xl md:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/50">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Join the private design signal.</h2>
                <p className="mt-4 text-zinc-400">
                  Get weekly AI design workflows, interface breakdowns, and early access to MacMuse.
                </p>
                <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/50 p-2 sm:flex-row">
                  <Input placeholder="you@studio.com" className="h-12 border-0 bg-transparent text-white placeholder:text-zinc-600 focus-visible:ring-0" />
                  <Button className="h-12 rounded-xl bg-white px-7 text-black hover:bg-zinc-200">Subscribe</Button>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <ChatbotApp onBack={() => setChatOpen(false)} />
      )}
    </main>
  );
}

function ChatbotApp({ onBack }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to MacMuse. Ask me to research a visual direction, critique a landing page, or generate a brand system.",
    },
  ]);
  const [input, setInput] = useState("");

  function sendMessage() {
    if (!input.trim()) return;
    setMessages((current) => [
      ...current,
      { role: "user", content: input },
      {
        role: "assistant",
        content:
          "Great direction. I would start with a black graphite base, soft metallic gradients, one cinematic product visual, and a concise answer-first layout with source-style design references.",
      },
    ]);
    setInput("");
  }

  return (
    <section className="min-h-screen bg-[#050505] px-4 py-4 text-white md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#09090a] shadow-[0_30px_120px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black">
              <Command className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">MacMuse Chat</p>
              <p className="text-xs text-zinc-500">Design answer engine</p>
            </div>
          </div>
          <Button onClick={onBack} variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white">
            Back to landing
          </Button>
        </div>

        <div className="grid flex-1 md:grid-cols-[260px_1fr]">
          <aside className="hidden border-r border-white/10 bg-black/30 p-4 md:block">
            <Button className="mb-5 w-full rounded-xl bg-white text-black hover:bg-zinc-200">New thread</Button>
            <div className="space-y-2 text-sm text-zinc-500">
              {["Premium SaaS hero", "Studio brand moodboard", "AI dashboard critique", "Minimal logo system", "Investor deck visuals"].map((thread) => (
                <div key={thread} className="rounded-xl px-3 py-3 transition hover:bg-white/[0.06] hover:text-zinc-200">
                  {thread}
                </div>
              ))}
            </div>
          </aside>

          <div className="flex min-h-[75vh] flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-8">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-2xl rounded-3xl border px-5 py-4 text-sm leading-7 shadow-xl ${
                    message.role === "user"
                      ? "border-white/10 bg-white text-black"
                      : "border-white/10 bg-white/[0.055] text-zinc-200"
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 bg-black/35 p-4">
              <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-2">
                <Search className="ml-3 h-5 w-5 text-zinc-500" />
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                  placeholder="Ask for a design direction..."
                  className="h-12 border-0 bg-transparent text-white placeholder:text-zinc-600 focus-visible:ring-0"
                />
                <Button onClick={sendMessage} className="rounded-xl bg-white px-5 text-black hover:bg-zinc-200">
                  Ask
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
