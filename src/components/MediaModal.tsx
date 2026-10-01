import React, { useState } from 'react';
import {
  X,
  Globe,
  Share2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export interface MediaChannel {
  id: string;
  platform: string;
  handle: string;
  url: string;
  category: 'social' | 'code' | 'security' | 'publication' | 'media';
  description: string;
  badge?: string;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const { personalInfo } = usePortfolio();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const social = personalInfo.social || {
    linkedin: 'https://www.linkedin.com/in/akash-tiwari-a490283b4/',
    github: 'https://github.com/akashkumartiwariofficial-boop',
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
  };

  const mediaList: MediaChannel[] = [
    {
      id: 'media-linkedin',
      platform: 'LinkedIn',
      handle: 'in/akash-tiwari-a490283b4',
      url: social.linkedin,
      category: 'social',
      description: 'Professional updates, cybersecurity research notes, IIT Patna academic journey & connections.',
      badge: 'Primary Network',
    },
    {
      id: 'media-github',
      platform: 'GitHub',
      handle: 'akashkumartiwariofficial-boop',
      url: social.github,
      category: 'code',
      description: 'Open source repositories, AI anomaly detection systems, Python recon tools, and Rust protocols.',
      badge: 'Source Repos',
    },
    {
      id: 'media-tryhackme',
      platform: 'TryHackMe',
      handle: 'akash.kumar.tiwari',
      url: social.tryhackme,
      category: 'security',
      description: '40+ Security rooms solved, Network penetration, Wireshark packet capture & OSINT labs.',
      badge: '40+ Rooms',
    },
    {
      id: 'media-hackthebox',
      platform: 'Hack The Box',
      handle: 'akash.tiwari.htb',
      url: social.hackthebox,
      category: 'security',
      description: '25+ Machines rooted, Linux privilege escalation, SUID exploitation, binary reversing.',
      badge: '25+ Rooted',
    },
    {
      id: 'media-x',
      platform: 'X (Twitter)',
      handle: '@akash_tiwari',
      url: (social as any).twitter || 'https://x.com/akash_tiwari',
      category: 'social',
      description: 'Cybersecurity threads, zero-day threat analysis, tech commentary & book discussions.',
      badge: 'Tech Threads',
    },
    {
      id: 'media-youtube',
      platform: 'YouTube Tech & Labs',
      handle: '@akashtiwari-cyber',
      url: (social as any).youtube || 'https://youtube.com/@akashtiwari-cyber',
      category: 'media',
      description: 'CTF walkthroughs, ethical hacking lab demonstrations, and tech lectures.',
      badge: 'Video Labs',
    },
    {
      id: 'media-instagram',
      platform: 'Instagram',
      handle: '@akash_tiwari_official',
      url: (social as any).instagram || 'https://instagram.com/akash_tiwari_official',
      category: 'social',
      description: 'IIT Patna campus life, conferences, book launch events, and personal behind-the-scenes.',
      badge: 'Campus & Life',
    },
    {
      id: 'media-reddit',
      platform: 'Reddit Community',
      handle: 'u/akash_tiwari_security',
      url: (social as any).reddit || 'https://reddit.com/u/akash_tiwari_security',
      category: 'social',
      description: 'Cybersecurity discussions, r/netsec threads, and security research dissemination.',
      badge: 'Discussions',
    },
    {
      id: 'media-flipkart',
      platform: 'Flipkart Store',
      handle: 'Bookspot Publishers',
      url: (social as any).flipkart || 'https://dl.flipkart.com/s/Iz0x8jNNNN',
      category: 'publication',
      description: 'Official Flipkart store page for purchasing "The Civic Sense of Indian People".',
      badge: 'Best Seller',
    },
    {
      id: 'media-amazon',
      platform: 'Amazon Bookstore',
      handle: 'Author Storefront',
      url: (social as any).amazon || 'https://www.amazon.in/dp/B0F1234567',
      category: 'publication',
      description: 'Official Amazon India & Global listing for author book editions and reviews.',
      badge: 'Global Store',
    },
    {
      id: 'media-telegram',
      platform: 'Telegram Channel',
      handle: '@akash_tiwari_cyber',
      url: (social as any).telegram || 'https://t.me/akash_tiwari_cyber',
      category: 'social',
      description: 'Live security updates, zero-day alerts, and interactive technical community updates.',
      badge: 'Live Alerts',
    },
    {
      id: 'media-discord',
      platform: 'Discord Server',
      handle: 'akash_tiwari#0001',
      url: (social as any).discord || 'https://discord.com/users/akash_tiwari',
      category: 'social',
      description: 'Cybersecurity study group, CTF team coordination, and developer discussions.',
      badge: 'Community',
    },
    {
      id: 'media-facebook',
      platform: 'Facebook Profile',
      handle: 'akash.tiwari.official',
      url: (social as any).facebook || 'https://facebook.com/akash.tiwari.official',
      category: 'social',
      description: 'Professional networking, public lectures, and academic announcements.',
      badge: 'Public Page',
    },
    {
      id: 'media-medium',
      platform: 'Medium Publication',
      handle: '@akash_tiwari',
      url: (social as any).medium || 'https://medium.com/@akash_tiwari',
      category: 'publication',
      description: 'In-depth articles on offensive security, vulnerability writeups, and AI engineering.',
      badge: 'Tech Articles',
    },
    {
      id: 'media-substack',
      platform: 'Substack Newsletter',
      handle: '@akashtiwari',
      url: (social as any).substack || 'https://substack.com/@akashtiwari',
      category: 'publication',
      description: 'Weekly cybersecurity briefings, civic awareness notes, and research dispatches.',
      badge: 'Newsletter',
    },
    ...(((personalInfo as any).customMediaChannels || []).map((c: any) => ({
      id: c.id,
      platform: c.platform,
      handle: c.handle || c.platform,
      url: c.url,
      category: 'social' as const,
      description: c.description || 'Custom added profile link.',
      badge: c.badge || 'Custom Link',
    }))),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#090e17] border border-cyan-900/50 rounded-2xl shadow-2xl shadow-cyan-950/70 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#0f1724] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <span>Media & Social Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {mediaList.length} Channels
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official handles, social media channels, publications & press of Akash Kumar Tiwari
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Channels Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {item.platform}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cyan-400/90 font-mono">{item.handle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visit Channel</span>
                  </a>
                  <button
                    onClick={() => handleCopyLink(item.url, item.id)}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1 transition-colors"
                    title="Copy Link"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3.5 bg-[#0f1724] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Verified Official Channels &bull; IIT Patna</span>
          {onOpenAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1"
            >
              <span>Manage in Admin Portal &rarr;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
