import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Trash2,
  Terminal as TerminalIcon,
  Sparkles,
} from 'lucide-react';
import { PERSONAL_INFO, SKILLS_LIST, PROJECTS, BOOK_DETAILS, CERTIFICATIONS, CTF_PLATFORMS } from '../data/portfolioData';
import { saveLog } from '../services/logService';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export interface TerminalLine {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'banner' | 'system';
  promptStr?: string;
  command?: string;
  content: string;
}

const STORAGE_KEY = 'akash_kali_linux_terminal_history_v5';

const KALI_ASCII_BANNER = `
  ██████╗██╗   ██╗██████╗ ███████╗██████╗ ██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗
 ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔══██╗██║   ██║████╗  ██║██║ ██╔╝
 ██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██████╔╝██║   ██║██╔██╗ ██║█████╔╝ 
 ██║       ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗██╔═══╝ ██║   ██║██║╚██╗██║██╔═██╗ 
 ╚██████╗   ██║   ██║     ███████╗██║  ██║██║     ╚██████╔╝██║ ╚████║██║  ██╗
  ╚═════╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
  ----------------------------------------------------------------------------
  Kali Linux 2026.1 (Rolling) · Kernel: 6.8.0-kali1-amd64 · iitp-cyber-workstation
  Akash Kumar Tiwari (CS, AI & Cybersecurity @ IIT Patna) · Cyberpunk AI Engine
  ----------------------------------------------------------------------------
  * Type 'help' for manual | Type 'clear' or click [Delete Chat] to wipe history
  * Standard Unix: ls, cat, whoami, skills, projects, ctf, book, certs, neofetch
  * Or ask Cyberpunk AI ANY question directly!
`;

const NEOFETCH_OUTPUT = `
       \x1b[36m/\\_\x1b[0m               \x1b[32mroot\x1b[0m@\x1b[32miitp-cyber-node\x1b[0m
      \x1b[36m/  \\\\\x1b[0m              -------------------
     \x1b[36m/ /\\ \\\\\x1b[0m             \x1b[33mOS:\x1b[0m Kali GNU/Linux Rolling x86_64
    \x1b[36m/ /  \\ \\\\\x1b[0m            \x1b[33mHost:\x1b[0m IIT Patna Cyber Defense Lab (Node-09)
   \x1b[36m/ /    \\ \\\\\x1b[0m           \x1b[33mKernel:\x1b[0m 6.8.0-kali1-amd64
  \x1b[36m/ /______\\ \\\\\x1b[0m          \x1b[33mUptime:\x1b[0m 42 days, 13 hours, 37 mins
 \x1b[36m/ /________\\ \\\\\x1b[0m         \x1b[33mShell:\x1b[0m zsh 5.9 (x86_64-debian-linux-gnu)
\x1b[36m/____________\\_\\\\\x1b[0m        \x1b[33mTerminal:\x1b[0m Cyberpunk AI Workstation CLI
                         \x1b[33mOperator:\x1b[0m Akash Kumar Tiwari (IIT Patna)
                         \x1b[33mFocus:\x1b[0m AI Threat Defense, Offensive CTF, Pentesting
                         \x1b[33mPublication:\x1b[0m "The Civic Sense of Indian People" (2025)
                         \x1b[33mHTB Ranking:\x1b[0m 25+ Machines Owned / 40+ THM Rooms
`;

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [inputVal, setInputVal] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Command History Navigation (Arrow Up / Arrow Down)
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Terminal Lines Stream
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'banner-0',
        type: 'banner',
        content: KALI_ASCII_BANNER,
      },
    ];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch (e) {
      console.warn('Could not save terminal lines:', e);
    }
  }, [lines]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, isAiLoading]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 2600);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Complete Chat Delete & Terminal Reset
  const handleDeleteChatHistory = () => {
    const freshBanner: TerminalLine = {
      id: `banner-${Date.now()}`,
      type: 'banner',
      content: KALI_ASCII_BANNER,
    };
    const clearedNotification: TerminalLine = {
      id: `system-${Date.now() + 1}`,
      type: 'system',
      content: '[✓] Terminal buffer and Cyberpunk AI chat history wiped successfully.',
    };

    setLines([freshBanner, clearedNotification]);
    setCmdHistory([]);
    setHistoryIndex(-1);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([freshBanner, clearedNotification]));
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }

    triggerToast('AI Chat history deleted successfully!');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const getOfflineFallback = (query: string): string => {
    const q = query.trim().toLowerCase();

    // Security refusal for admin credentials
    if (
      q.includes('admin') ||
      q.includes('password') ||
      q.includes('security key') ||
      q.includes('secret key') ||
      q.includes('root password') ||
      q.includes('id password') ||
      q.includes('password batao') ||
      q.includes('login password')
    ) {
      return "[-] ACCESS DENIED: Root Admin credentials & security keys are strictly classified. Unauthorized retrieval attempts are logged.";
    }

    // Complete knowledge about Akash Kumar Tiwari
    if (
      q.includes('akash') ||
      q.includes('about you') ||
      q.includes('who are you') ||
      q.includes('cyberpunk') ||
      q.includes('who is akash') ||
      q.includes('akash tiwari') ||
      q.includes('about akash')
    ) {
      return `Akash Kumar Tiwari — Complete Profile:
--------------------------------------------------
* Full Name: Akash Kumar Tiwari (Akash Tiwari)
* Current Focus: Computer Science, AI & Cybersecurity at IIT Patna (2026–2030)
* Specialized Training: IIT Guwahati Advanced Cybersecurity & Threat Analysis (2024–2026)
* Roles: Ethical Hacker, Security Researcher, Author & Developer
* Published Book: "The Civic Sense of Indian People" (Published Oct 8, 2025 by Bookspot Publishers; on Flipkart & Amazon)
* CTF Accomplishments: 25+ Hack The Box machines rooted, 40+ TryHackMe security rooms solved
* Key Projects: AI Network Anomaly Detection (98.4% detection rate), OSINT Attack Surface Auditor, Forensics Triage Engine, Zero-Knowledge Encrypted Messaging (Rust)
* Contact: akashkumartiwariofficial@gmail.com | LinkedIn: https://www.linkedin.com/in/akash-tiwari-a490283b4/`;
    }

    if (q.includes('book') || q.includes('civic') || q.includes('author') || q.includes('kitab')) {
      return `[BOOK SPOTLIGHT] "The Civic Sense of Indian People"
--------------------------------------------------
* Author: Akash Tiwari
* Publisher: Bookspot Publishers (Published: 8 October 2025)
* Availability: Available worldwide on Amazon (https://amzn.in/d/0cj4pQPk) and Flipkart (https://dl.flipkart.com/s/Iz0x8jNNNN)
* Premise: Explores civic consciousness, traffic etiquette, urban sanitation, queue patience, and building civic empathy in modern India.
* Key Quote: "Civic sense is not born out of fear of punishment or CCTV cameras; it is born out of voluntary empathy for the stranger sharing your sidewalk, your road, and your nation."`;
    }

    if (q.includes('education') || q.includes('college') || q.includes('iit') || q.includes('iit patna') || q.includes('iit guwahati')) {
      return `Academic Education:
1. IIT Patna — B.Tech in Computer Science, Artificial Intelligence & Cybersecurity (2026–2030). Founder of Student Cybersecurity Initiative.
2. IIT Guwahati — Advanced Cybersecurity Specialization & Threat Analysis Program (2024–2026).`;
    }

    if (q.includes('ctf') || q.includes('hack the box') || q.includes('htb') || q.includes('tryhackme') || q.includes('hacking')) {
      return `Akash's CTF & Security Track Record:
- Hack The Box: 25+ Linux/Windows targets owned (Linux privilege escalation, SUID exploitation, web fuzzing).
- TryHackMe: 40+ security rooms (Wireshark packet capture, OSINT, digital forensics, red-teaming).
- Certifications: Cybersecurity Assessment & Vulnerability Analysis (ID: IITP-CS-SEC-2026-V889).`;
    }

    if (q.includes('project') || q.includes('ai') || q.includes('anomaly')) {
      return `Featured Engineering Projects:
1. AI Network Anomaly & Intrusion Detection (Python/Scapy, 98.4% detection rate)
2. Automated Reconnaissance & Attack Surface Auditor (Python/Nmap automation)
3. Digital Forensics Triage & Incident Response Playbook Engine (Linux volatile memory capture)
4. Zero-Knowledge Encrypted Messaging Protocol (Rust, ECDH, AES-256-GCM)`;
    }

    if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('hire')) {
      return `Direct Contact Gateway:
* Primary Email: ${PERSONAL_INFO.email}
* Secondary Email: ${PERSONAL_INFO.secondaryEmail}
* LinkedIn: https://www.linkedin.com/in/akash-tiwari-a490283b4/
* Location: ${PERSONAL_INFO.location}
* Open for Summer Internships, AI/Security research, and CTFs.`;
    }

    if (q === 'hi' || q === 'hello' || q === 'hey') {
      return `Hello! I am Cyberpunk AI, Akash Kumar Tiwari's intelligent workstation engine. Ask me anything about Akash, cybersecurity, coding, algorithms, or his published book!`;
    }

    if (q.includes('kaise ho') || q.includes('kya hal hai') || q.includes('kya haal hai')) {
      return `Main bilkul badiya hoon! Main Cyberpunk AI hoon. Akash Kumar Tiwari (IIT Patna) ke bare me koi bhi jankari chahiye ya coding/cybersecurity par madad chahiye to batayein!`;
    }

    return `Cyberpunk AI Ready. Type 'help' for Linux commands or ask any question on coding, algorithms, and cybersecurity.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      const options = ['help', 'whoami', 'ls', 'skills', 'projects', 'ctf', 'book', 'certs', 'neofetch', 'clear', 'delete chat', 'contact', 'admin'];
      const match = options.find((opt) => opt.startsWith(current));
      if (match) setInputVal(match);
    }
  };

  const executeCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = inputVal.trim();
    if (!raw || isAiLoading) return;

    setInputVal('');
    setCmdHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const lower = raw.toLowerCase();

    // Built-in Unix Commands & Chat Deletion
    if (
      lower === 'clear' ||
      lower === 'cls' ||
      lower === 'reset' ||
      lower === 'delete chat' ||
      lower === 'clear chat' ||
      lower === 'delete-chat' ||
      lower === 'clear history' ||
      lower === 'delete history' ||
      lower === 'rm history' ||
      lower === 'rm chat.log' ||
      lower === 'history -c' ||
      lower === 'chat delete' ||
      lower === 'chate delete' ||
      lower === 'wipe'
    ) {
      handleDeleteChatHistory();
      return;
    }

    if (lower === 'exit' || lower === 'quit') {
      onClose();
      return;
    }

    if (lower === 'admin') {
      if (onOpenAdmin) onOpenAdmin();
      onClose();
      return;
    }

    if (lower === 'pwd') {
      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: '/home/akash/ai-workstation' },
      ]);
      return;
    }

    if (lower === 'uname' || lower === 'uname -a') {
      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: 'Linux iitp-cyber-node 6.8.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' },
      ]);
      return;
    }

    if (lower === 'date') {
      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: new Date().toUTCString() },
      ]);
      return;
    }

    if (lower === 'id' || lower === 'whoami') {
      const whoamiText = `uid=1000(akash) gid=1000(akash) groups=1000(akash),27(sudo),1001(security-guild),1002(iitp-cyber)
Name:        Akash Kumar Tiwari
Title:       ${PERSONAL_INFO.title}
Affiliation: ${PERSONAL_INFO.institute}
Email:       ${PERSONAL_INFO.email}
Summary:     ${PERSONAL_INFO.shortIntro}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: whoamiText },
      ]);
      return;
    }

    if (lower === 'ls' || lower === 'ls -la' || lower === 'dir') {
      const lsText = `total 48
drwxr-xr-x 8 akash akash 4096 Oct 08 2025  .
drwxr-xr-x 3 root  root  4096 Jan 15 2026  ..
-rw-r--r-- 1 akash akash 2048 Oct 08 2025  book_the_civic_sense.md
drwxr-xr-x 4 akash akash 4096 Feb 20 2026  cybersecurity-projects/
-rwxr-xr-x 1 akash akash 8192 Feb 24 2026  anomaly_detector.py
-rw-r--r-- 1 akash akash 1024 Jan 10 2026  htb_ctf_stats.log
-rw-r--r-- 1 akash akash 4096 Feb 01 2026  skills_matrix.json
-rw------- 1 root  root   512 Oct 08 2025  .secret_admin_vault [LOCKED]
-rw-r--r-- 1 akash akash  890 Jan 05 2026  contact_info.txt`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: lsText },
      ]);
      return;
    }

    if (lower.startsWith('cat ')) {
      const targetFile = lower.replace('cat ', '').trim();
      let fileContent = '';

      if (targetFile.includes('book')) {
        fileContent = `[BOOK SPOTLIGHT]\nTitle: "${BOOK_DETAILS.title}"\nAuthor: Akash Tiwari\nPublished: 8 October 2025\nAvailability: Available on Flipkart & Amazon (${BOOK_DETAILS.amazonUrl})\nSynopsis: ${BOOK_DETAILS.synopsis}`;
      } else if (targetFile.includes('contact')) {
        fileContent = `Email: ${PERSONAL_INFO.email}\nLinkedIn: https://www.linkedin.com/in/akash-tiwari-a490283b4/\nLocation: IIT Patna, India`;
      } else if (targetFile.includes('skills')) {
        fileContent = `SKILLS MATRIX:\n${SKILLS_LIST.map((s) => `  * ${s.name} (${s.level}) - ${s.associatedOrg}`).join('\n')}`;
      } else if (targetFile.includes('secret') || targetFile.includes('admin') || targetFile.includes('vault')) {
        fileContent = `cat: .secret_admin_vault: Permission denied (Root clearance required. Password protection active.)`;
      } else {
        fileContent = `cat: ${targetFile}: No such file or directory. Try 'ls' to see available files.`;
      }

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: fileContent.includes('denied') ? 'error' : 'output', content: fileContent },
      ]);
      return;
    }

    if (lower === 'neofetch') {
      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: NEOFETCH_OUTPUT },
      ]);
      return;
    }

    if (lower === 'help') {
      const helpManual = `┌──(MANUAL: KALI CYBERPUNK CLI WORKSTATION)───────────────────────────────┐
│ Command       │ Description                                              │
├───────────────┼──────────────────────────────────────────────────────────┤
│ help          │ Show this command reference manual                       │
│ whoami / id   │ Display Akash Kumar Tiwari's operator ID and background  │
│ ls            │ List workspace directory files and tools                 │
│ cat <file>    │ Read contents of a file (e.g. cat book_the_civic_sense)  │
│ skills        │ Display offensive & defensive security toolkit           │
│ projects      │ View featured AI anomaly detection & security projects   │
│ ctf           │ View Hack The Box (25+) & TryHackMe statistics           │
│ book          │ Display 'The Civic Sense of Indian People' book metadata │
│ certs         │ Show verified cybersecurity accreditations               │
│ neofetch      │ Render ASCII Linux system specs                          │
│ contact       │ Show contact email and verified profiles                 │
│ clear         │ Delete / Wipe terminal and AI chat history               │
│ exit          │ Terminate current CLI session                            │
└───────────────┴──────────────────────────────────────────────────────────┘

⚡ AI NEURAL CAPABILITY:
You can also ask ANY question about Akash Kumar Tiwari, coding, cybersecurity, or general topics.
Cyberpunk AI streams the answer in real-time right into this terminal!`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: helpManual },
      ]);
      return;
    }

    if (lower === 'skills') {
      const skillsText = `[+] VERIFIED SECURITY TOOLKIT & CAPABILITIES:
${SKILLS_LIST.map((s) => `  [#] ${s.name.padEnd(26)} Level: ${s.level.padEnd(12)} Org: ${s.associatedOrg}`).join('\n')}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: skillsText },
      ]);
      return;
    }

    if (lower === 'projects') {
      const projText = `[+] CORE RESEARCH & SECURITY ARCHITECTURES:
${PROJECTS.map((p, i) => `[0${i + 1}] ${p.title}
    Category: ${p.category} | Year: ${p.date || '2026'}
    Stack:    ${p.technologies.join(', ')}
    Summary:  ${p.summary}
    Github:   ${p.githubUrl}`).join('\n\n')}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: projText },
      ]);
      return;
    }

    if (lower === 'ctf') {
      const ctfText = `[+] CTF OFFENSIVE & DEFENSIVE BENCHMARKS:
${CTF_PLATFORMS.map((c) => `  [*] ${c.name.padEnd(16)} Stats: ${c.stats}\n      Highlight: ${c.highlight}\n      Focus:     ${c.focusAreas.join(' · ')}`).join('\n\n')}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: ctfText },
      ]);
      return;
    }

    if (lower === 'book') {
      const bookText = `[+] BOOK PUBLICATION:
  Title:         "${BOOK_DETAILS.title}"
  Author:        Akash Tiwari
  Publisher:     ${BOOK_DETAILS.publisher} (Published: ${BOOK_DETAILS.publishedDate})
  Availability:  Flipkart & Amazon Store (${BOOK_DETAILS.amazonUrl})
  Description:   ${BOOK_DETAILS.synopsis}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: bookText },
      ]);
      return;
    }

    if (lower === 'certs') {
      const certsText = `[+] VERIFIED ACCREDITATIONS:
${CERTIFICATIONS.map((c) => `  [✓] ${c.title}\n      Issuer: ${c.issuer} | Credential: ${c.credentialId || 'IITP-CS-SEC-2026'}`).join('\n\n')}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: certsText },
      ]);
      return;
    }

    if (lower === 'contact') {
      const contactText = `[+] CONTACT GATEWAY:
  Email:    ${PERSONAL_INFO.email}
  LinkedIn: https://www.linkedin.com/in/akash-tiwari-a490283b4/
  Location: ${PERSONAL_INFO.location}`;

      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'output', content: contactText },
      ]);
      return;
    }

    // Security Check: Guard Admin Password
    if (
      lower.includes('admin password') ||
      lower.includes('portal password') ||
      lower.includes('security key') ||
      lower.includes('secret key') ||
      lower.includes('root password') ||
      lower.includes('id password') ||
      (lower.includes('admin') && (lower.includes('password') || lower.includes('pass') || lower.includes('credential') || lower.includes('key')))
    ) {
      const refusal = "[-] ACCESS DENIED: Root Admin credentials and security keys are strictly classified. Intrusion attempts are logged.";
      setLines((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, type: 'cmd', command: raw, content: raw },
        { id: `out-${Date.now() + 1}`, type: 'error', content: refusal },
      ]);
      return;
    }

    // AI Query Execution with Real-Time Streaming Output
    const cmdLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'cmd',
      command: raw,
      content: raw,
    };

    const aiLineId = `ai-${Date.now() + 1}`;
    const initialAiLine: TerminalLine = {
      id: aiLineId,
      type: 'output',
      content: '',
    };

    setLines((prev) => [...prev, cmdLine, initialAiLine]);
    setIsAiLoading(true);

    try {
      const historyPayload = lines.slice(-6).map((l) => ({
        role: l.type === 'cmd' ? 'user' : 'assistant',
        content: l.content,
      }));

      const res = await fetch('/api/ai-assistant/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: raw,
          history: historyPayload,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const splitLines = chunk.split('\n');

          for (const line of splitLines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.text) {
                  accumulated += parsed.text;
                  setLines((prev) =>
                    prev.map((item) =>
                      item.id === aiLineId ? { ...item, content: accumulated } : item
                    )
                  );
                }
              } catch {
                // skip
              }
            }
          }
        }

        if (accumulated.trim()) {
          setIsAiLoading(false);
          saveLog({
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString(),
            userQuery: raw,
            aiResponse: accumulated,
            source: 'cyberpunk-kali-terminal',
            status: 'active-ai',
          });
          return;
        }
      }

      // Non-stream fallback
      const fallbackRes = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: raw,
          history: historyPayload,
        }),
      });

      let responseText = '';
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data && data.response) responseText = data.response;
      }

      if (!responseText) responseText = getOfflineFallback(raw);

      setLines((prev) =>
        prev.map((item) =>
          item.id === aiLineId ? { ...item, content: responseText } : item
        )
      );

      saveLog({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        userQuery: raw,
        aiResponse: responseText,
        source: 'cyberpunk-kali-terminal',
        status: 'active-ai',
      });
    } catch {
      const fallback = getOfflineFallback(raw);
      setLines((prev) =>
        prev.map((item) =>
          item.id === aiLineId ? { ...item, content: fallback } : item
        )
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const sampleShortcuts = [
    'help',
    'whoami',
    'book',
    'skills',
    'projects',
    'ctf',
    'certs',
    'neofetch',
    'delete chat',
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Kali Linux / Ubuntu Terminal Window */}
      <div
        className={`relative w-full ${
          isMaximized ? 'h-[96vh] max-w-[98vw]' : 'h-[90vh] max-h-[760px] max-w-4xl'
        } bg-[#0a0e14] border border-[#233549] rounded-xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden text-slate-100 font-mono text-xs sm:text-[13px] transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Linux Titlebar (Gnome / XFCE Header) */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#121820] border-b border-[#1f2937] select-none">
          {/* Left: Window Dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ef4444] hover:bg-[#dc2626] transition-colors cursor-pointer"
              title="Close Terminal (Alt+F4)"
            />
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-3 h-3 rounded-full bg-[#eab308] hover:bg-[#ca8a04] transition-colors cursor-pointer"
              title={isMaximized ? 'Restore' : 'Maximize'}
            />
            <button
              onClick={handleDeleteChatHistory}
              className="w-3 h-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] transition-colors cursor-pointer"
              title="Wipe & Clear History"
            />
          </div>

          {/* Center: Linux Terminal Title */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400 hidden sm:inline" />
            <span className="text-cyan-400 font-bold">akash@iitp-cyber-node</span>
            <span className="text-slate-500">:</span>
            <span className="text-emerald-400">~/ai-workstation</span>
          </div>

          {/* Right: Window Controls + Explicit Delete Chat Button */}
          <div className="flex items-center gap-2">
            {/* Dedicated Delete Chat Button */}
            <button
              onClick={handleDeleteChatHistory}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-[11px] font-mono transition-all hover:border-rose-400 cursor-pointer shadow-sm active:scale-95"
              title="Clear all conversation & command history"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span className="hidden sm:inline">Delete Chat</span>
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Exit"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Screen (Pure Linux Shell Output) */}
        <div
          ref={terminalContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#070a0f] text-slate-200 font-mono leading-relaxed scrollbar-thin selection:bg-[#06b6d4]/30 selection:text-[#a5f3fc]"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line) => {
            if (line.type === 'banner') {
              return (
                <pre
                  key={line.id}
                  className="text-cyan-400 text-[10px] sm:text-[11px] leading-[1.2] whitespace-pre select-none font-mono mb-2"
                >
                  {line.content}
                </pre>
              );
            }

            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-emerald-400 pl-4 py-1.5 text-xs font-mono bg-emerald-950/20 border-l-2 border-emerald-500 rounded my-1">
                  {line.content}
                </div>
              );
            }

            if (line.type === 'cmd') {
              return (
                <div key={line.id} className="mt-2 text-xs sm:text-[13px] font-mono">
                  {/* Kali Linux Prompt Format */}
                  <div className="text-cyan-400 font-bold flex items-center gap-1">
                    <span className="text-blue-400">┌──(</span>
                    <span className="text-emerald-400">cyberpunk㉿iitp</span>
                    <span className="text-blue-400">)-[</span>
                    <span className="text-white">~/ai-workstation</span>
                    <span className="text-blue-400">]</span>
                  </div>
                  <div className="flex items-center gap-2 text-white pl-0.5">
                    <span className="text-blue-400 select-none">└─$</span>
                    <span className="text-emerald-300 font-bold">{line.command}</span>
                  </div>
                </div>
              );
            }

            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 pl-4 py-1 text-xs whitespace-pre-wrap font-mono">
                  {line.content}
                </div>
              );
            }

            // Output line
            return (
              <div key={line.id} className="text-slate-200 pl-4 py-1 whitespace-pre-wrap text-xs sm:text-[13px] font-mono relative group">
                {line.content}
                {line.content.length > 50 && (
                  <button
                    onClick={() => handleCopyText(line.content, line.id)}
                    className="absolute top-1 right-2 text-slate-500 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] flex items-center gap-1 bg-[#111827] px-2 py-0.5 rounded border border-slate-700"
                    title="Copy Output"
                  >
                    {copiedId === line.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {/* Active Streaming Indicator */}
          {isAiLoading && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs pl-4 pt-1 animate-pulse">
              <span className="text-emerald-400 select-none">❯</span>
              <span>[Streaming Cyberpunk AI neural output...]</span>
            </div>
          )}

          {/* Active Terminal Input Line (In-Line Linux Prompt) */}
          <form onSubmit={executeCommand} className="mt-2 text-xs sm:text-[13px] font-mono">
            {/* Kali Linux Two-Line Prompt */}
            <div className="text-cyan-400 font-bold flex items-center gap-1 select-none">
              <span className="text-blue-400">┌──(</span>
              <span className="text-emerald-400">cyberpunk㉿iitp</span>
              <span className="text-blue-400">)-[</span>
              <span className="text-white">~/ai-workstation</span>
              <span className="text-blue-400">]</span>
            </div>

            <div className="flex items-center gap-2 pl-0.5 text-white">
              <span className="text-blue-400 select-none font-bold">└─$</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isAiLoading}
                  placeholder={isAiLoading ? 'Waiting for output...' : "Type command ('help', 'clear') or ask any question about Akash..."}
                  className="w-full bg-transparent border-none outline-none text-emerald-300 font-mono text-xs sm:text-[13px] p-0 focus:ring-0 placeholder-slate-600"
                  autoFocus
                />
              </div>
            </div>
          </form>

          <div ref={scrollAnchorRef} />
        </div>

        {/* Bottom Quick Linux Shortcuts Bar */}
        <div className="px-3 py-1.5 bg-[#0f141d] border-t border-[#1e2735] flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none select-none text-[11px] font-mono">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-slate-500 shrink-0">Commands:</span>
            {sampleShortcuts.map((sc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (sc === 'delete chat') {
                    handleDeleteChatHistory();
                    return;
                  }
                  setInputVal(sc);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                disabled={isAiLoading}
                className={`px-2 py-0.5 rounded text-xs shrink-0 transition-colors whitespace-nowrap active:scale-95 disabled:opacity-50 ${
                  sc === 'delete chat'
                    ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30'
                    : 'bg-[#17202d] hover:bg-[#233549] text-cyan-300 border border-[#2d3f56] hover:border-cyan-400/60'
                }`}
              >
                {sc === 'delete chat' ? '🗑 delete chat' : sc}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] shrink-0 pl-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Cyberpunk AI (Gemini/ChatGPT Engine)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
