import { SkillItem, ProjectItem, CertificationItem, CTFPlatform, BookChapter, BookItem } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Akash Tiwari',
  title: 'IIT Patna — CS, AI & Cybersecurity | Cybersecurity Enthusiast & Developer',
  email: 'akashkumartiwariofficial@gmail.com',
  secondaryEmail: 'akashkumarofficial@gmail.com',
  location: 'Patna, Bihar, India',
  institute: 'Indian Institute of Technology, Patna (IIT Patna)',
  pronouns: 'He/Him',
  shortIntro: 'Passionate about Cybersecurity, AI, Ethical Hacking, and Software Development.',
  availability: 'Available for Summer Internships, Research Collaborations, and Security Projects',
  social: {
    github: 'https://github.com/akashkumartiwariofficial-boop',
    linkedin: 'https://www.linkedin.com/in/akash-tiwari-a490283b4/',
    hackthebox: 'https://profile.hackthebox.com/',
    tryhackme: 'https://tryhackme.com/p/akash.kumar.tiwari',
    twitter: 'https://x.com/akash_tiwari',
    youtube: 'https://youtube.com/@akashtiwari-cyber',
    instagram: 'https://instagram.com/akash_tiwari_official',
    reddit: 'https://reddit.com/u/akash_tiwari_security',
    flipkart: 'https://dl.flipkart.com/s/Iz0x8jNNNN',
    amazon: 'https://www.amazon.in/dp/B0F1234567',
    telegram: 'https://t.me/akash_tiwari_cyber',
    discord: 'https://discord.com/users/akash_tiwari',
    facebook: 'https://facebook.com/akash.tiwari.official',
    medium: 'https://medium.com/@akash_tiwari',
    substack: 'https://substack.com/@akashtiwari',
  },
  customMediaChannels: [
    {
      id: 'custom-1',
      platform: 'Personal Security Blog',
      handle: 'akash-research',
      url: 'https://akashkumartiwariofficial.github.io',
      description: 'Personal security research publications and tech writeups.',
      badge: 'Custom Link',
    },
  ],
};

export const EDUCATION_LIST = [
  {
    institution: 'Indian Institute of Technology, Patna',
    shortName: 'IIT Patna',
    degree: 'CS, AI & Cybersecurity',
    period: 'Jan 2026 – Dec 2030',
    description:
      'Rigorous computer science program concentrating on advanced data structures, cryptographic foundations, machine learning theory, distributed computing, and cybersecurity defenses.',
    location: 'Patna, Bihar',
    badge: 'Premier Institute',
  },
  {
    institution: 'Indian Institute of Technology, Guwahati',
    shortName: 'IIT Guwahati',
    degree: 'Cybersecurity Specialization & Advanced Technical Program',
    period: 'Oct 2024 – Oct 2026',
    description:
      'Intensive hands-on training spanning network vulnerability assessment, digital forensics, incident mitigation, kernel architecture, and threat modelling.',
    location: 'Guwahati, Assam',
    badge: 'Specialized Program',
  },
];

export const SKILLS_LIST: SkillItem[] = [
  {
    id: 'kali',
    name: 'Kali Linux',
    category: 'security',
    level: 'Advanced',
    description: 'Offensive security OS environment, customized auditing workflows, forensic tools orchestration.',
    associatedOrg: 'IIT Patna',
    iconName: 'Terminal',
  },
  {
    id: 'nmap',
    name: 'Nmap & Network Mapping',
    category: 'networking',
    level: 'Advanced',
    description: 'Host discovery, NSE scripting, firewall evasion, service fingerprinting, port scanning automation.',
    associatedOrg: 'IIT Patna',
    iconName: 'Network',
  },
  {
    id: 'burp',
    name: 'Burp Suite',
    category: 'security',
    level: 'Proficient',
    description: 'Web application penetration testing, request interception, Repeater/Intruder fuzzing, OWASP Top 10.',
    associatedOrg: 'IIT Patna',
    iconName: 'ShieldAlert',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'programming',
    level: 'Advanced',
    description: 'Scapy raw socket crafting, exploit prototyping, machine learning automation, custom reconnaissance tools.',
    associatedOrg: 'IIT Patna',
    iconName: 'Code',
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'programming',
    level: 'Proficient',
    description: 'Memory-safe systems programming, high-performance packet sniffing, low-level binary analysis.',
    associatedOrg: 'IIT Patna',
    iconName: 'Cpu',
  },
  {
    id: 'cpp',
    name: 'C / C++',
    category: 'programming',
    level: 'Proficient',
    description: 'Object-oriented low-level architecture, pointer manipulation, memory inspection, performance engineering.',
    associatedOrg: 'IIT Patna',
    iconName: 'Binary',
  },
  {
    id: 'osint',
    name: 'OSINT',
    category: 'security',
    level: 'Advanced',
    description: 'Open-source threat intelligence, domain enumeration, certificate transparency logs, digital footprint analysis.',
    associatedOrg: 'IIT Patna',
    iconName: 'Search',
  },
  {
    id: 'crypto',
    name: 'Cryptography',
    category: 'security',
    level: 'Advanced',
    description: 'Symmetric & asymmetric ciphers, RSA, AES-GCM, ECC, digital signatures, hash collisions, zero-knowledge proofs.',
    associatedOrg: 'IIT Patna',
    iconName: 'Key',
  },
  {
    id: 'pentest',
    name: 'Penetration Testing',
    category: 'security',
    level: 'Advanced',
    description: 'Ethical exploitation, privilege escalation, vulnerability assessments, mitigation reporting.',
    associatedOrg: 'IIT Patna',
    iconName: 'Lock',
  },
  {
    id: 'networking',
    name: 'Networking & Protocols',
    category: 'networking',
    level: 'Advanced',
    description: 'TCP/IP stack, OSI model, BGP/OSPF, DNS, Wireshark packet capture, VLAN isolation, routing security.',
    associatedOrg: 'IIT Patna',
    iconName: 'Radio',
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence & ML',
    category: 'ai',
    level: 'Proficient',
    description: 'Anomaly detection models, supervised & unsupervised threat clustering, AI security workflows.',
    associatedOrg: 'IIT Patna',
    iconName: 'Brain',
  },
  {
    id: 'cloud_sec',
    name: 'Cloud Security',
    category: 'security',
    level: 'Proficient',
    description: 'IAM role auditing, principle of least privilege, container isolation, cloud posture monitoring.',
    associatedOrg: 'IIT Patna',
    iconName: 'Cloud',
  },
  {
    id: 'incident_resp',
    name: 'Incident Response',
    category: 'security',
    level: 'Proficient',
    description: 'Live forensics, triage pipelines, malware indicators of compromise (IoC), containment playbooks.',
    associatedOrg: 'IIT Patna',
    iconName: 'Activity',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-cyber-assessment',
    title: 'Cybersecurity Assessment & Vulnerability Analysis',
    issuer: 'Recognized Cybersecurity Authority',
    issuedDate: '2026',
    credentialId: 'IITP-CS-SEC-2026-V889',
    description:
      'Rigorous evaluation validating proficiency in identifying architectural vulnerabilities, conducting automated & manual penetration testing, evaluating risk exposure, and implementing remediation controls.',
    skillsCovered: ['Vulnerability Assessment', 'Threat Modeling', 'Nmap Auditing', 'OWASP Standards', 'Remediation Roadmaps'],
    badgeColor: 'cyan',
  },
  {
    id: 'cert-ethical-hacking',
    title: 'Advanced Ethical Hacking & Defensive Systems',
    issuer: 'IIT Cybersecurity Initiative',
    issuedDate: '2025',
    credentialId: 'IITG-CS-EH-9402',
    description:
      'Practical assessment covering Linux privilege escalation, network perimeter scanning, secure proxy configuration, and defense-in-depth architecture.',
    skillsCovered: ['Kali Linux Tools', 'Privilege Escalation', 'Burp Suite Probing', 'Network Hardening'],
    badgeColor: 'emerald',
  },
];

export const CTF_PLATFORMS: CTFPlatform[] = [
  {
    name: 'Hack The Box',
    rank: 'Active Challenger',
    stats: '25+ Machines & Labs Owned',
    highlight: 'Root privileges obtained on medium/hard Linux boxes; deep focus on privilege escalation vectors and Misconfigured SUID binaries.',
    focusAreas: ['Linux Exploitation', 'Web Attacks', 'Privilege Escalation', 'Active Directory Basics'],
  },
  {
    name: 'TryHackMe',
    rank: 'Top Tier Streak',
    stats: '40+ Security Rooms Completed',
    highlight: 'Mastered rooms in Network Security, OSINT Investigations, Digital Forensics, Wireshark Protocol Analysis, and Red Team methodology.',
    focusAreas: ['Network Fundamentals', 'Wireshark Analysis', 'SOC Triage', 'OSINT'],
  },
  {
    name: 'College & National CTFs',
    rank: 'Competitive Solver',
    stats: 'Multiple CTF Participation',
    highlight: 'Member of collegiate CTF squads cracking Cryptography ciphers, Reverse Engineering challenge binaries, and Steganography flags.',
    focusAreas: ['Cryptography', 'Forensics', 'Web Sec', 'Scripting'],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-ai-anomaly',
    title: 'AI-Powered Network Anomaly & Intrusion Detection',
    repoName: 'ai-network-anomaly-detection',
    category: 'AI & Security',
    summary:
      'A machine-learning threat detection framework that streams network packet headers, identifies suspicious flow deviations, and flags zero-day intrusion patterns.',
    description:
      'Engineered an intelligent security pipeline combining Python (Scapy, Scikit-Learn) and raw packet analysis. The system parses pcap streams in near real-time, extracts 24 statistical flow features, and calculates anomaly scores with minimal false positives. Successfully identified port scans, SYN flood bursts, and unauthorized tunnel egress.',
    technologies: ['Python', 'Scapy', 'Machine Learning', 'Linux Sockets', 'Network Forensics'],
    metrics: '98.4% detection rate on benchmark attack traces',
    highlights: [
      'Real-time packet capture and flow aggregation engine',
      'Unsupervised clustering for baseline benign vs malicious traffic',
      'Automated alert generation with MITRE ATT&CK technique mapping',
    ],
    githubUrl: 'https://github.com/akashkumartiwariofficial-boop/ai-network-anomaly-detection',
    architectureDetails: 'Ingest Layer (Scapy Sniffer) -> Feature Engine (Packet inter-arrival variance, entropy) -> Isolation Forest Evaluator -> Syslog Alert Dispatcher',
    date: '2026',
    stars: 84,
    forks: 21,
    license: 'MIT',
    defaultBranch: 'main',
  },
  {
    id: 'proj-recon-scanner',
    title: 'Automated Reconnaissance & Attack Surface Auditor',
    repoName: 'attack-surface-auditor',
    category: 'Tools & Automation',
    summary:
      'Modular OSINT and port enumeration automation suite that maps corporate attack surfaces and generates formatted security audit reports.',
    description:
      'Developed an automated reconnaissance orchestrator in Python and Bash for offensive-defense exercises. Consolidates DNS records, discovers forgotten subdomains using certificate transparency search, scans listening services through custom Nmap routines, and cross-references vulnerabilities against CVE databases.',
    technologies: ['Python', 'Nmap', 'Bash Scripting', 'OSINT', 'Burp Suite Integration'],
    metrics: 'Recon workflow time reduced from 2.5 hours to 8 minutes',
    highlights: [
      'Subdomain discovery combining passive OSINT and DNS brute-forcing',
      'Intelligent Nmap port scanning profiles based on target topology',
      'Markdown and PDF executive summary reports with severity ranking',
    ],
    githubUrl: 'https://github.com/akashkumartiwariofficial-boop/attack-surface-auditor',
    architectureDetails: 'Passive OSINT Collector -> Target DNS Resolver -> Filtered Port Prober (Nmap NSE) -> CVE Vulnerability Matcher -> PDF Exporter',
    date: '2025',
    stars: 56,
    forks: 14,
    license: 'Apache-2.0',
    defaultBranch: 'main',
  },
  {
    id: 'proj-incident-response',
    title: 'Forensics Triage & Incident Response Playbook Engine',
    repoName: 'forensics-triage-engine',
    category: 'Cybersecurity',
    summary:
      'An incident triage framework designed to rapidly snapshot volatile memory states, extract running process hierarchies, and trace malicious persistence.',
    description:
      'Built a forensics companion tool for incident responders handling compromised Linux and workstation environments. Automatically parses scheduled cron jobs, SSH authorized keys, open listening sockets, and process ancestry trees to build an immutable timeline for forensic investigation.',
    technologies: ['Linux Internals', 'Python', 'Forensics', 'Bash', 'Auditd'],
    metrics: 'Fast automated capture of 14 key volatile telemetry artifacts',
    highlights: [
      'Automated memory & process artifact extraction within seconds',
      'Cryptographic SHA-256 integrity hashing for chain of custody',
      'Interactive visual timeline mapping process spawn triggers',
    ],
    githubUrl: 'https://github.com/akashkumartiwariofficial-boop/forensics-triage-engine',
    architectureDetails: 'Telemetry Probe Daemon -> Memory & Process Artifact Grabber -> SHA-256 Verification -> Timeline Correlator',
    date: '2025',
    stars: 42,
    forks: 9,
    license: 'MIT',
    defaultBranch: 'main',
  },
  {
    id: 'proj-secure-channel',
    title: 'Zero-Knowledge Encrypted Messaging & Key Exchange Protocol',
    repoName: 'zk-encrypted-protocol',
    category: 'Cybersecurity',
    summary:
      'End-to-end encrypted protocol implementation with forward secrecy, authenticating peers through elliptic curve Diffie-Hellman and AES-256-GCM.',
    description:
      'Designed and coded a cryptographic communication protocol demonstrating key exchange, perfect forward secrecy, and tamper-evident message frames. Built to test modern cryptographic defenses against replay attacks and man-in-the-middle interception.',
    technologies: ['Rust', 'Python', 'Cryptography', 'Socket Programming', 'ECDH'],
    metrics: 'Sub-millisecond encryption and MAC verification',
    highlights: [
      'Ephemeral key negotiation preventing historical decryption',
      'Authenticated encryption with associated data (AEAD) using AES-256-GCM',
      'Resistance to bit-flipping and packet injection attacks',
    ],
    githubUrl: 'https://github.com/akashkumartiwariofficial-boop/zk-encrypted-protocol',
    architectureDetails: 'Handshake State Machine (ECDH-P256) -> Session Key Derivation (HKDF-SHA256) -> Encrypted Framing (AES-GCM)',
    date: '2024',
    stars: 112,
    forks: 37,
    license: 'MIT',
    defaultBranch: 'main',
  },
];

export const BOOK_DETAILS: BookItem = {
  id: 'book-civic-sense',
  title: 'The Civic Sense of Indian People',
  subtitle: 'An Honest Look at Our Habits and Responsibilities',
  author: 'Akash Tiwari',
  publisher: 'Bookspot Publishers',
  publishedDate: '8 October 2025',
  status: 'Published on 8 Oct 2025 · Available on Flipkart & Amazon',
  expectedYear: '2025',
  flipkartUrl: 'https://dl.flipkart.com/s/Iz0x8jNNNN',
  amazonUrl: 'https://amzn.in/d/0cj4pQPk',
  coverImage: '/src/assets/images/book_cover_1790795224241.jpg',
  synopsis:
    'A deeply reflective and timely exploration of contemporary Indian society through the lens of civic conscience. While India makes monumental strides in technological leadership, space exploration, and global economic stature, the everyday quality of civic life—from traffic discipline and urban sanitation to queuing patience and respect for public infrastructure—remains an urgent frontier of collective growth. Akash Tiwari combines analytical clarity with authentic on-the-ground observations to ask: How do we align personal pride with public responsibility?',
  keyThemes: [
    {
      title: 'Traffic Rules & Road Civility',
      description: 'Understanding lane discipline, horn usage restraint, pedestrian priority, and how everyday commuting reveals a society\'s empathy.',
    },
    {
      title: 'Ownership of Public Spaces',
      description: 'Moving beyond the boundary wall mindset where our homes are spotless but public streets and parks are neglected.',
    },
    {
      title: 'Queuing & Institutional Respect',
      description: 'Why queue ethics, patience, and honoring systems are foundational prerequisites for trust in high-density societies.',
    },
    {
      title: 'Civic Duty in the Digital Age',
      description: 'How modern education, technology, civic tech tools, and personal accountability can catalyze lasting behavioral transformation.',
    },
  ],
  chapters: [
    {
      number: 'Chapter 01',
      title: 'The Great Indian Threshold: Inside the Home vs. Outside the Gate',
      summary: 'An inquiry into the cultural dichotomy between pristine private sanctuaries and unowned public territories.',
      topics: ['The boundary line paradox', 'Shared ownership vs apathy', 'Historical evolution of common spaces'],
    },
    {
      number: 'Chapter 02',
      title: 'The Symphony of the Horn: What Our Traffic Reveals About Us',
      summary: 'A candid diagnostic of road psychology, lane discipline, emergency vehicle right-of-way, and mutual survival.',
      topics: ['Urgency without destination', 'The psychological cost of constant honking', 'Actionable road reforms'],
    },
    {
      number: 'Chapter 03',
      title: 'The Queue and the Contract: Fairness in Crowded Nations',
      summary: 'How waiting in turn is the ultimate social equalizer and test of democratic citizenship.',
      topics: ['Queue jumping as micro-corruption', 'Dignity in shared services', 'Designing friction-free public systems'],
    },
    {
      number: 'Chapter 04',
      title: 'Preserving Tomorrow: Cleanliness, Heritage, and Civic Empathy',
      summary: 'Practical pathways for youth-led citizen initiatives, environmental cleanliness, and preserving public pride.',
      topics: ['Youth participation', 'Civic education in schools', 'Technology as an accountability tool'],
    },
  ] as BookChapter[],
  authorNote:
    '“Civic sense is not born out of fear of punishment or CCTV cameras; it is born out of voluntary empathy for the stranger sharing your sidewalk, your road, and your nation. My goal with this book is to spark open, constructive conversations in classrooms, dinner tables, and public forums across India.” — Akash Tiwari',
  excerpt: `From Chapter 1: The Great Indian Threshold
  
Step inside an Indian household, and you will invariably be greeted by pristine cleanliness—gleaming floors, meticulously arranged altars, and an insistence on removing street shoes before crossing the threshold. Yet, step two inches past the exterior boundary wall onto the public lane, and that tender devotion vanishes into thin air. Litter is tossed without a backward glance, waste is swept out into the storm drain, and the common street is treated as a no-man's-land.

This book begins with a simple question: Why does our instinct of care stop precisely at our private gate?

To build an extraordinary nation in this century, we cannot merely build high-speed trains, semiconductor fabrication hubs, and digital payment networks. We must concurrently build the invisible software that makes human societies harmonious: civic empathy, respect for common property, and an unwavering commitment to personal accountability.`,
};

export const INITIAL_BOOKS: BookItem[] = [BOOK_DETAILS];
