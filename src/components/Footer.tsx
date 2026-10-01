import React from 'react';
import { ArrowUp, ShieldCheck, Mail, Database } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05080f] border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-850">
          {/* Brand & Mission */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base block">
                Akash Tiwari
              </span>
              <span className="text-slate-400 text-[11px]">
                IIT Patna &bull; CS, AI & Cybersecurity
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs">
            <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="/#gallery" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors text-cyan-300 font-semibold">Gallery</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects/Certifications</a>
            <a href="#book" className="hover:text-cyan-400 transition-colors">Book</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono text-[11px]"
              >
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
            aria-label="Scroll back to top"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Akash Tiwari. All rights reserved. Built with precision for cybersecurity & AI excellence.
          </p>

          <div className="flex items-center gap-4 font-mono">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {PERSONAL_INFO.email}
            </a>
            <span aria-hidden="true" className="text-slate-600">&bull;</span>
            <span>Patna, Bihar, India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
