import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, ArrowUpRight, ShieldCheck, Bot } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenAdmin?: () => void;
  onOpenGallery?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTerminal,
  onOpenAdmin,
  onOpenGallery,
}) => {
  const { personalInfo } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects/Certifications', href: '#projects' },
    { label: 'Book', href: '#book' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060b13]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Secret Admin Portal Trigger / Brand Identity */}
          <div className="flex items-center gap-2 group text-slate-100 font-display font-bold text-lg sm:text-xl tracking-tight">
            <button
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                else window.open('/#admin', '_blank');
              }}
              className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/25 transition-all cursor-pointer shadow-sm group-hover:scale-105 active:scale-95"
              title="Secret Admin Management Portal (Tap to Open)"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                else window.open('/#admin', '_blank');
              }}
              className="tracking-tight hover:text-cyan-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
              title="Secret Admin Management Portal (Tap to Open)"
            >
              <span>{personalInfo.name}</span>
            </button>
          </div>

          {/* Zone 2: Clean 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label === 'Gallery' ? '_blank' : undefined}
                rel={link.label === 'Gallery' ? 'noopener noreferrer' : undefined}
                className="hover:text-cyan-400 transition-colors relative py-1 text-slate-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary action + Terminal button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenTerminal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400/60 transition-all active:scale-95"
              title="Open Cyberpunk AI Terminal (ChatGPT & Gemini Powered)"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cyberpunk AI</span>
            </button>

            <a
              href="#contact"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenTerminal}
              className="p-2 rounded-lg text-cyan-400 bg-cyan-950/40 border border-cyan-500/30"
              aria-label="Open CLI"
            >
              <Terminal className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#060b13]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="w-full py-2.5 text-xs font-mono text-center rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Cypher Monk AI</span>
            </button>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-xs font-semibold text-center rounded-lg bg-cyan-400 text-slate-950 font-medium"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
