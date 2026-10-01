import React from 'react';
import { X, Download, GraduationCap, Briefcase, Award, Shield, FileText, Check } from 'lucide-react';
import { PERSONAL_INFO, EDUCATION_LIST, SKILLS_LIST, CERTIFICATIONS, PROJECTS } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#090d16] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
              Curriculum Vitae Preview &bull; {PERSONAL_INFO.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          {/* Header block */}
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">{PERSONAL_INFO.name}</h2>
            <p className="text-cyan-400 font-medium text-xs sm:text-sm mt-0.5">
              {PERSONAL_INFO.title}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
              <span>{PERSONAL_INFO.email}</span>
              <span>&bull;</span>
              <span>{PERSONAL_INFO.location}</span>
              <span>&bull;</span>
              <span>IIT Patna</span>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </h3>
            {EDUCATION_LIST.map((edu, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white">{edu.institution}</h4>
                    <p className="text-cyan-300 text-xs">{edu.degree}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{edu.period}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{edu.description}</p>
              </div>
            ))}
          </div>

          {/* Core Technical Arsenal */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Technical Skills</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div>
                <span className="font-semibold text-white">Security & Pentesting:</span>{' '}
                <span className="text-slate-300">Kali Linux, Nmap, Burp Suite, OSINT, Cryptography, Privilege Escalation, Wireshark, Incident Response.</span>
              </div>
              <div>
                <span className="font-semibold text-white">Programming & Systems:</span>{' '}
                <span className="text-slate-300">Python, Rust, C/C++, Linux Kernel/Bash, Git, Sockets & Raw Networking.</span>
              </div>
              <div>
                <span className="font-semibold text-white">Artificial Intelligence:</span>{' '}
                <span className="text-slate-300">Anomaly Detection, Threat Classification, Automated Security Workflows.</span>
              </div>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>Selected Projects</span>
            </h3>
            {PROJECTS.map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-white">{proj.title}</h4>
                  <span className="text-[11px] font-mono text-slate-400">{proj.date}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{proj.summary}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.technologies.map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications & Leadership */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Leadership & Accreditations</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
              <p>
                <strong className="text-white">Founder, Student Cybersecurity Initiative:</strong> Mentoring peers on defensive security, CTF challenges, and vulnerability testing.
              </p>
              <p>
                <strong className="text-white">Certified in Cybersecurity Assessment:</strong> Rigorous evaluation covering threat modeling and vulnerability remediation.
              </p>
              <p>
                <strong className="text-white">Author:</strong> Published book &ldquo;The Civic Sense of Indian People&rdquo; (Published Oct 2025 by Bookspot Publishers).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
