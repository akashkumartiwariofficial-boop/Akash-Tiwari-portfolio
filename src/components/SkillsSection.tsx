import React, { useState } from 'react';
import {
  Terminal,
  Network,
  ShieldAlert,
  Code,
  Cpu,
  Binary,
  Search,
  Key,
  Lock,
  Radio,
  Brain,
  Cloud,
  Activity,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { SkillCategory, SkillItem } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filterTabs = [
    { key: 'all' as SkillCategory, label: 'All Capabilities' },
    { key: 'security' as SkillCategory, label: 'Security & Pentesting' },
    { key: 'programming' as SkillCategory, label: 'Programming' },
    { key: 'networking' as SkillCategory, label: 'Networking & Infra' },
    { key: 'ai' as SkillCategory, label: 'AI & Intelligence' },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Network':
        return <Network className="w-5 h-5 text-sky-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'Binary':
        return <Binary className="w-5 h-5 text-indigo-400" />;
      case 'Search':
        return <Search className="w-5 h-5 text-teal-400" />;
      case 'Key':
        return <Key className="w-5 h-5 text-violet-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-cyan-400" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-blue-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-fuchsia-400" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      default:
        return <Terminal className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative bg-[#060a12] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>02 · Technical Toolkit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Tools, Protocols & Offensive Technologies
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Battle-tested in Capture The Flag labs, academic coursework at IIT Patna, and real-world penetration testing assessments.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-64">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter tools or tech..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs (Interactive button controls) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-slate-850">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap active:scale-95 ${
                activeCategory === tab.key
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/30 hover:bg-slate-900 transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                    {getIcon(skill.iconName)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800/60">
                    {skill.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Domain: {skill.category}</span>
                {skill.associatedOrg && (
                  <span className="text-cyan-400/80">{skill.associatedOrg}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search yields no results */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-xl border border-slate-800">
            <SlidersHorizontal className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No tools match your search query "{searchTerm}"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="mt-3 text-xs text-cyan-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
