import React, { useState } from 'react';
import {
  ArrowDown,
  ExternalLink,
  Terminal,
  Shield,
  Check,
  Copy,
  Sparkles,
  BookOpen,
  Lock,
  Bot,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenResume?: () => void;
  onOpenMedia?: () => void;
  onOpenCVResume?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenTerminal,
  onOpenResume,
  onOpenMedia,
  onOpenCVResume,
}) => {
  const { personalInfo } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleOpenCVResume = () => {
    if (onOpenCVResume) onOpenCVResume();
    else if (onOpenResume) onOpenResume();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Ambient radial gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy - 7 cols */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Status Indicator */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 font-mono text-xs">CS, AI & Cybersecurity</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>IIT Patna</span>
              </div>
            </div>

            {/* Title & Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white">
                <span className="block text-slate-100">{personalInfo.name}</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                {personalInfo.title}
              </p>
            </div>

            {/* Short Intro */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {personalInfo.shortIntro}
            </p>

            {/* Quick Metadata / Trust points */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Certified in Cybersecurity Assessment</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>Hack The Box & CTF Challenger</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Author: "The Civic Sense of Indian People" (Published 2025)</span>
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Primary Action Row: Explore Work */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 inline-flex items-center gap-2 font-display"
                >
                  <span>Explore Work</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Media Button (Replaces Get in Touch) */}
                <button
                  onClick={onOpenMedia}
                  className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-medium text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Social Media Channels & Press Hub"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Media</span>
                </button>
              </div>

              {/* Secondary Action Row: Cyberpunk AI below Explore Work & CV and Resume below Media */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Cyberpunk AI button below Explore Work */}
                <button
                  onClick={onOpenTerminal}
                  className="px-4 py-2.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono flex items-center gap-2 transition-all hover:border-cyan-400 shadow-sm cursor-pointer"
                  title="Launch Cyberpunk AI Interactive Terminal"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Cyberpunk AI</span>
                </button>

                {/* CV & Resume button below Media / Get in Touch */}
                <button
                  onClick={handleOpenCVResume}
                  className="px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="View & Download CV and Technical Resume"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400 hidden" />
                  <span>CV & Resume</span>
                </button>
              </div>
            </div>

            {/* Quick Email Copy row */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span>Direct:</span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 font-mono transition-colors"
                title="Click to copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{personalInfo.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Card: Cybersecurity Console & Live Workstation - 5 cols */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-xl">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600" />
                  <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>cypher-monk@iitp: ~/ai-terminal</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-xs space-y-4">
                <div className="space-y-1 text-slate-300">
                  <p className="text-slate-500"># Identity & Research Credentials</p>
                  <p>
                    <span className="text-cyan-400">cypher-monk@iitp</span>:<span className="text-blue-400">~</span>$ whoami
                  </p>
                  <p className="text-emerald-300 font-semibold">
                    Akash Tiwari [Cybersecurity Enthusiast &bull; IIT Patna (CS, AI & Cybersecurity)]
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-slate-800/80 pt-3 text-slate-300">
                  <div className="flex justify-between text-slate-400">
                    <span>Target Focus</span>
                    <span className="text-slate-200">Ethical Hacking & AI Threat Defense</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Primary Institution</span>
                    <span className="text-slate-200">IIT Patna</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Secondary Education</span>
                    <span className="text-slate-200">IIT Guwahati</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Primary Tooling</span>
                    <span className="text-cyan-300">Kali Linux, Python, Rust, Nmap, Wireshark</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Initiative</span>
                    <span className="text-slate-200">Student Cybersecurity Lead</span>
                  </div>
                </div>

                {/* Highlight Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/70">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CTF & Labs</span>
                    <span className="text-base font-bold text-cyan-400 tabular-nums">40+ Solved</span>
                    <span className="text-[10px] text-slate-400 block">HTB & TryHackMe</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/70">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Author Debut</span>
                    <span className="text-xs font-bold text-amber-300 truncate block">The Civic Sense</span>
                    <span className="text-[10px] text-slate-400 block">Published Book (2025)</span>
                  </div>
                </div>

                {/* Interactive CLI CTA */}
                <div className="pt-2">
                  <button
                    onClick={onOpenTerminal}
                    className="w-full py-2.5 px-3 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-mono text-xs flex items-center justify-center gap-2 transition-all group"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Launch Cypher Monk AI Interactive CLI</span>
                    <span className="text-cyan-400 font-bold">&rarr;</span>
                  </button>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">System Status: All protocols operational</span>
                <span className="text-emerald-400 font-mono text-[11px]">200 OK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-12 text-center flex justify-center">
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors py-2"
          >
            <span>Learn more about my background</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
