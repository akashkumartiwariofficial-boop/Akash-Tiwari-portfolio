import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  Shield,
  Check,
  ExternalLink,
  Sparkles,
  Printer,
  Calendar,
  Layers,
  FileCheck,
  ArrowLeft,
  BookOpen,
  Terminal,
  Code,
  Lock,
  Copy,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import { PERSONAL_INFO, EDUCATION_LIST, PROJECTS } from '../data/portfolioData';

interface CVResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

interface StoredDocItem {
  id: string;
  type: 'cv' | 'resume';
  title: string;
  subtitle?: string;
  category?: string;
  version?: string;
  lastUpdated?: string;
  fileSize?: string;
  fileName?: string;
  downloadUrl?: string;
  fileBase64?: string;
  description?: string;
  isPrimary?: boolean;
  highlights?: string[];
}

export const CVResumeModal: React.FC<CVResumeModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [adminDocs, setAdminDocs] = useState<StoredDocItem[]>([]);
  const [activePreview, setActivePreview] = useState<'none' | 'cv' | 'resume'>('none');

  // Fetch documents from server/admin portal
  useEffect(() => {
    if (isOpen) {
      setActivePreview('none');
      fetch('/api/cv-resume')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.items)) {
            setAdminDocs(data.items);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Find uploaded doc by type if available
  const uploadedCV = adminDocs.find((d) => d.type === 'cv');
  const uploadedResume = adminDocs.find((d) => d.type === 'resume');

  const triggerDirectDownload = (docType: 'cv' | 'resume') => {
    const isCV = docType === 'cv';
    const activeUploaded = isCV ? uploadedCV : uploadedResume;

    // If an actual uploaded file (PDF/Word/etc.) is stored from Admin Portal, download that file
    if (activeUploaded?.fileBase64) {
      const link = document.createElement('a');
      link.href = activeUploaded.fileBase64;
      link.download = activeUploaded.fileName || `Akash_Kumar_Tiwari_${isCV ? 'CV' : 'Resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(isCV ? 'Curriculum Vitae (CV)' : 'Technical Resume');
      setTimeout(() => setDownloadSuccess(null), 4000);
      return;
    }

    // Otherwise generate clean verified PDF/text release
    const docTitle = isCV
      ? 'CURRICULUM VITAE - AKASH KUMAR TIWARI (IIT PATNA)'
      : 'TECHNICAL RESUME - AKASH KUMAR TIWARI';

    const textContent = `================================================================================
${docTitle}
================================================================================
Name:        Akash Kumar Tiwari
Title:       ${PERSONAL_INFO.title}
Institution: ${PERSONAL_INFO.institute}
Degree:      B.Tech in Computer Science, Artificial Intelligence & Cybersecurity
Email:       ${PERSONAL_INFO.email}
Secondary:   ${PERSONAL_INFO.secondaryEmail}
LinkedIn:    ${PERSONAL_INFO.social.linkedin}
GitHub:      ${PERSONAL_INFO.social.github}
Location:    ${PERSONAL_INFO.location}
Availability:${PERSONAL_INFO.availability}

--------------------------------------------------------------------------------
1. ACADEMIC EDUCATION
--------------------------------------------------------------------------------
* Indian Institute of Technology, Patna (IIT Patna)
  Degree: B.Tech in Computer Science, Artificial Intelligence & Cybersecurity (2026 - 2030)
  Focus:  Cryptographic foundations, ML theory, OS architecture, intrusion detection.
  Role:   Founder, Student Cybersecurity Initiative at IIT Patna

* Indian Institute of Technology, Guwahati (IIT Guwahati)
  Degree: Advanced Cybersecurity Specialization & Threat Analysis Program (2024 - 2026)
  Focus:  Network penetration testing, Linux kernel security, digital forensics.

--------------------------------------------------------------------------------
2. PUBLISHED BOOK & AUTHORSHIP
--------------------------------------------------------------------------------
* Title:        "The Civic Sense of Indian People"
* Author:       Akash Tiwari
* Publisher:    Bookspot Publishers (Published: 8 October 2025)
* Store Links:  Amazon & Flipkart Worldwide
* Synopsis:     Explores civic habits, traffic discipline, public sanitation, and technological empathy in contemporary India.

--------------------------------------------------------------------------------
3. CTF COMPETITIONS & OFFENSIVE CREDENTIALS
--------------------------------------------------------------------------------
* Hack The Box: 25+ Machines Rooted (Linux Privilege Escalation, SUID Exploitation, Kernel Exploits)
* TryHackMe:    40+ Security Rooms Mastered (Wireshark, OSINT, Threat Hunting, SOC Triage)
* Credential:   Cybersecurity Assessment & Vulnerability Analysis (ID: IITP-CS-SEC-2026-V889)
* Credential:   Advanced Ethical Hacking & Defensive Systems (ID: IITG-CS-EH-9402)

--------------------------------------------------------------------------------
4. KEY FEATURED ENGINEERING & RESEARCH PROJECTS
--------------------------------------------------------------------------------
[1] AI-Powered Network Anomaly & Intrusion Detection
    Stack:   Python, Scapy, Isolation Forest, XGBoost, Raw Sockets
    Metrics: 98.4% detection rate for zero-day flows and stealth port scans.
    Repo:    https://github.com/akashkumartiwariofficial-boop/ai-network-anomaly-detection

[2] Automated Reconnaissance & Attack Surface Auditor
    Stack:   Python, Nmap NSE, Bash Scripting, OSINT APIs
    Metrics: Slashed corporate recon workflow from 2.5 hours to 8 minutes.
    Repo:    https://github.com/akashkumartiwariofficial-boop/attack-surface-auditor

[3] Forensics Triage & Incident Response Playbook Engine
    Stack:   Linux Internals, Python, Auditd, Bash
    Metrics: Rapid capture of 14 volatile telemetry artifacts with SHA-256 integrity.
    Repo:    https://github.com/akashkumartiwariofficial-boop/forensics-triage-engine

[4] Zero-Knowledge Encrypted Messaging Protocol
    Stack:   Rust, ECDH, AES-256-GCM, Socket Programming
    Metrics: Sub-millisecond forward secrecy framing resilient against MitM.
    Repo:    https://github.com/akashkumartiwariofficial-boop/zk-encrypted-protocol

--------------------------------------------------------------------------------
5. TECHNICAL TOOLKIT & CORE SKILLS
--------------------------------------------------------------------------------
* Offensive Security: Kali Linux, Nmap, Burp Suite Pro, Metasploit, Wireshark, Ghidra, GDB
* Programming:        Python, Rust, C/C++, Bash, TypeScript, SQL
* Core Domains:       Penetration Testing, Vulnerability Assessment, Cryptography, Anomaly Detection

================================================================================
Generated Official Document • Verified 2026 Release
================================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Akash_Kumar_Tiwari_${isCV ? 'Curriculum_Vitae' : 'Resume'}_2026.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(isCV ? 'Curriculum Vitae (CV)' : 'Technical Resume');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#090d16] border border-cyan-900/60 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d1420] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activePreview !== 'none' && (
              <button
                onClick={() => setActivePreview('none')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Back to Download Options"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <span>{activePreview === 'none' ? 'Download CV & Resume' : activePreview === 'cv' ? 'Curriculum Vitae (CV) Preview' : 'Technical Resume Preview'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Verified 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {activePreview === 'none'
                  ? 'Select an option to immediately download the verified CV or Technical Resume'
                  : 'Official Verified Document of Akash Kumar Tiwari (IIT Patna)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activePreview !== 'none' && (
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          {downloadSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-3 animate-in fade-in shadow-lg shadow-emerald-950/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">Download Initiated Successfully!</div>
                <p className="text-emerald-300/90">
                  Your official <strong className="text-white">{downloadSuccess}</strong> has been downloaded to your device.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================
              TWO MAIN OPTIONS: DOWNLOAD CV & DOWNLOAD RESUME
          ======================================================== */}
          {activePreview === 'none' && (
            <div className="space-y-6 py-2">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-xl font-bold text-white font-display">
                  Select a document to download
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Tap on <span className="text-cyan-300 font-bold">Download CV</span> for the comprehensive multi-page academic dossier or <span className="text-blue-300 font-bold">Download Resume</span> for the concise industry profile.
                </p>
              </div>

              {/* The Two Distinct Choices Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* OPTION 1: DOWNLOAD CV */}
                <div
                  onClick={() => triggerDirectDownload('cv')}
                  className="group p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border-2 border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer hover:shadow-2xl hover:shadow-cyan-950/70 relative overflow-hidden flex flex-col justify-between active:scale-[0.99]"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold rounded-bl-xl border-l border-b border-cyan-500/30">
                    {uploadedCV ? 'Custom Uploaded File' : 'Comprehensive • Multi-Section'}
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
                      <GraduationCap className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Option 1</span>
                      <h4 className="text-lg font-bold text-white font-display mt-0.5 group-hover:text-cyan-300 transition-colors">
                        Curriculum Vitae (CV)
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Complete academic & research profile. Includes IIT Patna & IIT Guwahati education, book publication, CTF credentials, and offensive security research.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>IIT Patna B.Tech (CS, AI & Cybersecurity)</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Author of "The Civic Sense of Indian People"</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>25+ HTB Rooted Machines & TryHackMe Rooms</span>
                      </div>
                      {uploadedCV && (
                        <div className="text-[11px] text-emerald-400 flex items-center gap-2 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>File: {uploadedCV.fileName} ({uploadedCV.fileSize})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePreview('cv');
                      }}
                      className="text-xs font-mono text-slate-400 hover:text-cyan-300 underline self-start sm:self-center cursor-pointer"
                    >
                      Preview details →
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDirectDownload('cv');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download CV</span>
                    </button>
                  </div>
                </div>

                {/* OPTION 2: DOWNLOAD RESUME */}
                <div
                  onClick={() => triggerDirectDownload('resume')}
                  className="group p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a0f1d] border-2 border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-950/70 relative overflow-hidden flex flex-col justify-between active:scale-[0.99]"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold rounded-bl-xl border-l border-b border-blue-500/30">
                    {uploadedResume ? 'Custom Uploaded File' : 'Concise • Industry Focus'}
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-400/50 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-400 group-hover:text-slate-950 transition-all">
                      <Briefcase className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">Option 2</span>
                      <h4 className="text-lg font-bold text-white font-display mt-0.5 group-hover:text-blue-300 transition-colors">
                        Technical Resume
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Focused 1-page summary highlighting engineering stack (Python, Rust, C++), AI intrusion detection, offensive security toolkits, and software architectures.
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                        <span>AI Anomaly Detection (98.4% Accuracy)</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                        <span>Rust ECDH Zero-Knowledge Messaging</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400" />
                        <span>Kali Linux, Burp Suite Pro, Metasploit, Scapy</span>
                      </div>
                      {uploadedResume && (
                        <div className="text-[11px] text-emerald-400 flex items-center gap-2 font-mono">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>File: {uploadedResume.fileName} ({uploadedResume.fileSize})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePreview('resume');
                      }}
                      className="text-xs font-mono text-slate-400 hover:text-blue-300 underline self-start sm:self-center cursor-pointer"
                    >
                      Preview details →
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDirectDownload('resume');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PREVIEW VIEW: CV
          ======================================================== */}
          {activePreview === 'cv' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900/60 to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-white text-sm">
                    {uploadedCV?.title || 'Comprehensive Curriculum Vitae (IIT Patna)'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Official Complete Document • Verified Release
                  </p>
                </div>

                <button
                  onClick={() => triggerDirectDownload('cv')}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>
              </div>

              {/* Full Interactive CV View */}
              <div className="space-y-6 bg-slate-950/90 p-5 sm:p-7 rounded-xl border border-slate-800 font-sans">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-white font-display">{PERSONAL_INFO.name}</h2>
                  <p className="text-cyan-400 font-medium text-xs sm:text-sm mt-1 font-mono">
                    {PERSONAL_INFO.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    {PERSONAL_INFO.email} | {PERSONAL_INFO.location}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-bold">
                    <GraduationCap className="w-4 h-4" />
                    <span>Education & Alma Mater</span>
                  </h3>
                  <div className="space-y-2">
                    {EDUCATION_LIST.map((edu, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-white">{edu.institution}</span>
                          <span className="text-[11px] font-mono text-slate-400">{edu.period}</span>
                        </div>
                        <div className="text-cyan-300 font-mono text-xs">{edu.degree}</div>
                        <p className="text-slate-300 text-xs">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Published Book & Authorship</span>
                  </h3>
                  <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5">
                    <span className="font-bold text-white">"The Civic Sense of Indian People" (Bookspot Publishers)</span>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Authored analysis exploring civic habits, traffic discipline, public infrastructure stewardship, and civic empathy in contemporary India.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-bold">
                    <Briefcase className="w-4 h-4" />
                    <span>Key Engineering Projects</span>
                  </h3>
                  <div className="space-y-2">
                    {PROJECTS.map((proj) => (
                      <div key={proj.id} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                        <span className="font-bold text-white">{proj.title}</span>
                        <p className="text-slate-300 text-xs">{proj.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              PREVIEW VIEW: RESUME
          ======================================================== */}
          {activePreview === 'resume' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-950/50 via-slate-900/60 to-cyan-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-white text-sm">
                    {uploadedResume?.title || 'Technical & AI Systems Engineer Resume'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Industry-Focused 1-Page Summary • Verified Release
                  </p>
                </div>

                <button
                  onClick={() => triggerDirectDownload('resume')}
                  className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
              </div>

              <div className="space-y-5 bg-slate-950/90 p-5 sm:p-7 rounded-xl border border-slate-800 font-sans">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-white font-display">{PERSONAL_INFO.name}</h2>
                  <p className="text-blue-400 font-medium text-xs sm:text-sm mt-0.5 font-mono">
                    Full-Stack AI Developer & Cybersecurity Specialist
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    {PERSONAL_INFO.email} | {PERSONAL_INFO.location}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Core Technical Skills
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="font-bold text-white font-mono">Languages & Frameworks: </span>
                      <span className="text-slate-300">Python, Rust, C/C++, TypeScript, React, Node.js, SQL.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="font-bold text-white font-mono">Security & Tools: </span>
                      <span className="text-slate-300">Kali Linux, Wireshark, Burp Suite Pro, Metasploit, Scapy, Docker.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
