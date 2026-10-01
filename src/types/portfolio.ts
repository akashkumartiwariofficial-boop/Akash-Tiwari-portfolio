export type SkillCategory = 'all' | 'security' | 'programming' | 'networking' | 'ai';

export interface SkillItem {
  id: string;
  name: string;
  category: 'security' | 'programming' | 'networking' | 'ai';
  level: string; // e.g., 'Advanced', 'Proficient', 'Core Focus'
  description: string;
  associatedOrg?: string;
  iconName: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Cybersecurity' | 'AI & Security' | 'Tools & Automation' | 'CTF & Pentesting';
  summary: string;
  description: string;
  technologies: string[];
  metrics?: string;
  highlights: string[];
  githubUrl?: string;
  architectureDetails?: string;
  date: string;
  // Optional Single & Multiple Photos & Videos for Project
  imageUrl?: string;
  videoUrl?: string;
  images?: string[];
  videos?: string[];
  // GitHub Repository Metadata for authentic GitHub view
  repoName?: string;
  stars?: number;
  forks?: number;
  license?: string;
  defaultBranch?: string;
  isPrivate?: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialId?: string;
  description: string;
  skillsCovered: string[];
  badgeColor: string;
  // Optional Certificate Photo
  imageUrl?: string;
  verificationUrl?: string;
}

export interface CTFPlatform {
  name: string;
  rank: string;
  stats: string;
  highlight: string;
  focusAreas: string[];
}

export interface BookChapter {
  number: string;
  title: string;
  summary: string;
  topics: string[];
}

export interface BookTheme {
  title: string;
  description: string;
}

export interface BookItem {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publisher?: string;
  publishedDate?: string;
  status: string;
  expectedYear?: string;
  flipkartUrl?: string;
  amazonUrl?: string;
  coverImage?: string;
  synopsis: string;
  keyThemes?: BookTheme[];
  chapters?: BookChapter[];
  authorNote?: string;
  excerpt?: string;
}
