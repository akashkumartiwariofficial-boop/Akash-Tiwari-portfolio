import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Shield,
  Mail,
  Copy,
  Check,
  Cpu,
  Radio,
  Lock,
  Cloud,
  Activity,
  Award,
  ExternalLink,
  MapPin,
  Calendar,
  Linkedin,
  Maximize2,
  X,
  ZoomIn,
  Download,
  Images,
} from 'lucide-react';
import { EDUCATION_LIST } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';

const DEFAULT_PORTRAIT = '/src/assets/images/akash_suit_portrait_1790780374642.jpg';
const STORAGE_KEY = 'akash_profile_photo_v5';

interface AboutProps {
  onOpenGallery?: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenGallery }) => {
  const { personalInfo } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_PORTRAIT);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    fetch('/api/photo-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.exists && data.path) {
          setPhotoUrl(`${data.path}?t=${Date.now()}`);
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setPhotoUrl(saved);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setPhotoUrl(saved);
      });
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const coreInterests = [
    {
      title: 'Cybersecurity & Pentesting',
      desc: 'Offensive vulnerability discovery, CTFs, exploit mitigation, and web security.',
      icon: Lock,
      accent: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20',
    },
    {
      title: 'AI-Driven Threat Defense',
      desc: 'Integrating machine learning with anomaly detection and automated security pipelines.',
      icon: Cpu,
      accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/20',
    },
    {
      title: 'Cloud Security',
      desc: 'IAM least privilege architecture, container isolation, and cloud posture audits.',
      icon: Cloud,
      accent: 'text-sky-400 border-sky-500/20 bg-sky-950/20',
    },
    {
      title: 'Incident Response & Forensics',
      desc: 'Memory triage, digital forensics, log analysis, and rapid containment playbooks.',
      icon: Activity,
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20',
    },
    {
      title: 'Networking & Protocol Security',
      desc: 'Deep packet inspection, socket programming, Wireshark packet capture, and routing integrity.',
      icon: Radio,
      accent: 'text-blue-400 border-blue-500/20 bg-blue-950/20',
    },
  ];

  return (
    <section id="about" className="py-24 relative bg-[#070c16] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Photo Option (Directly above Background & Mission) - Enlarged Showcase */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 border border-cyan-500/30 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            {/* The Photo - Substantially Enlarged Portrait */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center">
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative group cursor-pointer w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-slate-950 shadow-2xl shadow-cyan-950/40"
                title="Click to view full screen"
              >
                {/* Glowing aura */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 opacity-40 group-hover:opacity-75 blur-md transition duration-500" />

                <img
                  src={photoUrl}
                  alt="Akash Kumar Tiwari - Computer Science IIT Patna"
                  referrerPolicy="no-referrer"
                  className="relative w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* HUD Corner Accents */}
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                {/* Identifier Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 backdrop-blur-md shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Akash Tiwari</span>
                </div>

                {/* Full Screen Button on corner */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-slate-950/85 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 backdrop-blur-md transition-all shadow-lg"
                  title="Full Screen View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info & Quick Actions */}
            <div className="md:col-span-7 lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Scholar &bull; IIT Patna</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  Akash Kumar Tiwari
                </h3>
                <p className="text-sm sm:text-base font-mono text-cyan-400 mt-1">
                  Computer Science Student &bull; AI & Cybersecurity Enthusiast
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Dedicated to offensive security, vulnerability assessment, and AI-driven defense mechanisms. Actively engaged in Capture The Flag competitions and defensive security research.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/#gallery"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (onOpenGallery && !e.ctrlKey && !e.metaKey && window.innerWidth < 768) {
                      e.preventDefault();
                      onOpenGallery();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-extrabold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30 active:scale-95 group"
                  title="Open Photo Gallery in a new tab"
                >
                  <Images className="w-4 h-4 text-slate-950" />
                  <span>View More Photos</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <button
                  onClick={() => setLightboxOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                  <span>Full Screen</span>
                </button>

                <a
                  href={photoUrl}
                  download="Akash_Kumar_Tiwari_Photo.jpg"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 border border-slate-800 transition-colors"
                  title="Download Photo"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>01 · Background & Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Engineering Security with Precision & AI
          </h2>
          <p className="mt-3 text-base text-slate-400 leading-relaxed">
            Pursuing Computer Science at premier Indian Institutes of Technology, dedicated to safeguarding modern digital infrastructures through defensive research, ethical hacking, and civic awareness.
          </p>
        </div>

        {/* Narrative & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Detailed Biography - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                I am <strong className="text-white font-semibold">Akash Tiwari</strong>, a Computer Science student with a strong passion for artificial intelligence and cybersecurity. My journey into technology is driven by curiosity, discipline, and a continuous desire to understand how complex systems operate under the hood, how vulnerabilities arise, and how they can be fortified in an increasingly interconnected world.
              </p>
              <p>
                I actively engage with platforms such as <span className="text-cyan-300 font-medium">Hack The Box</span>, <span className="text-cyan-300 font-medium">TryHackMe</span>, and <span className="text-cyan-300 font-medium">GitHub</span>, where I consistently sharpen my practical skills, explore real-world security challenges, and collaborate with a global community of security researchers. I regularly participate in Capture The Flag (CTF) competitions to challenge my analytical thinking and exploit analysis under time constraints.
              </p>
              <p>
                I have hands-on experience in languages like <span className="text-slate-100 font-medium">C++</span>, <span className="text-slate-100 font-medium">Python</span>, and <span className="text-slate-100 font-medium">Rust</span>, along with extensive exposure to Linux operating systems. Beyond tooling, I am also the <strong className="text-white font-semibold">founder of a student-driven cybersecurity initiative</strong>, where I lead efforts in identifying potential threat surfaces, analyzing risks, and mentoring peers in defensive security practices.
              </p>
              <p>
                My long-term ambition is to become a leader in <span className="text-cyan-300 font-medium">AI-driven cybersecurity</span>—building adaptive systems such as anomaly detection algorithms and automated incident mitigation pipelines. I am currently seeking internships, research collaborations, and opportunities where I can apply my skills alongside experienced security engineers.
              </p>
            </div>

            {/* Direct Contact Bar */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Direct Inquiries & Collaboration</span>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors font-mono"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmail}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
                <a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1.5 transition-colors"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Education & Core Focus - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            {/* Education List */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Academic Education</span>
              </h3>

              {EDUCATION_LIST.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 relative hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-cyan-400 font-mono">
                      {edu.shortName}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {edu.period}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {edu.institution}
                  </h4>
                  <p className="text-xs text-cyan-300/90 font-medium mt-1">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {edu.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{edu.location}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Core Interests Badges */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Core Research & Engineering Areas</span>
              </h3>

              <div className="space-y-2.5">
                {coreInterests.map((interest, idx) => {
                  const Icon = interest.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800/80 flex items-start gap-3 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className={`p-2 rounded-md border shrink-0 ${interest.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">
                          {interest.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {interest.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header Controls */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Akash Kumar Tiwari &bull; Full Portrait</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                <ZoomIn className="w-4 h-4 text-cyan-400" />
              </button>

              <a
                href={photoUrl}
                download="Akash_Kumar_Tiwari_Photo.jpg"
                className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors"
                title="Download Photo"
              >
                <Download className="w-4 h-4 text-cyan-400" />
              </a>

              <button
                onClick={() => setLightboxOpen(false)}
                className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-rose-500/40 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>
          </div>

          {/* Full Screen Image Box */}
          <div
            className="relative max-h-[85vh] max-w-[85vw] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photoUrl}
              alt="Akash Kumar Tiwari Full Resolution Portrait"
              referrerPolicy="no-referrer"
              className={`max-h-[80vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl border-2 border-cyan-500/40 transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            <div className="mt-3 text-center">
              <h4 className="text-white font-display font-bold text-base sm:text-lg">
                Akash Kumar Tiwari
              </h4>
              <p className="text-xs font-mono text-cyan-400">
                IIT Patna &bull; CS, AI & Cybersecurity
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
