import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Terminal,
  Flag,
  CheckCircle,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  Lock,
  Image as ImageIcon,
  Video,
  FolderGit2,
  Star,
  GitFork,
} from 'lucide-react';
import { CTF_PLATFORMS } from '../data/portfolioData';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem, CertificationItem } from '../types/portfolio';

interface ProjectsCertificationsProps {
  onSelectProject: (project: ProjectItem) => void;
  onSelectCertification: (cert: CertificationItem) => void;
  onOpenTerminal: () => void;
}

export const ProjectsCertifications: React.FC<ProjectsCertificationsProps> = ({
  onSelectProject,
  onSelectCertification,
  onOpenTerminal,
}) => {
  const { projects, certifications, personalInfo } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'projects' | 'ctf' | 'certifications'>('projects');

  return (
    <section id="projects" className="py-24 relative bg-[#070c16] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>03 · Proof of Work & Validation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Projects, Certifications & CTFs
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
              From offensive-defensive tools and AI anomaly detectors to verified assessments and competitive CTF solving on Hack The Box.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'projects'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('ctf')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'ctf'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CTF & Labs
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'certifications'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Certifications ({certifications.length})
            </button>
          </div>
        </div>

        {/* Featured Certification Banner Spotlight */}
        {certifications.length > 0 && (
          <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-slate-900 border border-cyan-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Featured Credential · Cybersecurity Assessment</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Certified Cybersecurity Assessment & Vulnerability Analysis
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Demonstrated practical competence in vulnerability assessment, threat modeling, security architecture evaluation, and automated penetration testing protocols.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {['Vulnerability Assessment', 'Threat Modeling', 'Nmap Auditing', 'OWASP Standards', 'Risk Remediation'].map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3">
                <div className="text-left lg:text-right font-mono text-xs text-slate-400">
                  <span className="block text-slate-500">Credential ID:</span>
                  <span className="text-cyan-300 font-medium">IITP-CS-SEC-2026-V889</span>
                </div>

                <button
                  onClick={() => certifications[0] && onSelectCertification(certifications[0])}
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <span>View Verification Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View 1: Projects Showcase */}
        {activeTab === 'projects' && (
          projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-500/30">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{project.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Metrics Badge */}
                    {project.metrics && (
                      <div className="mt-3.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{project.metrics}</span>
                      </div>
                    )}

                    {/* Photo / Video Badges if available */}
                    {(() => {
                      const imgCount = (project.images && project.images.length > 0) ? project.images.length : (project.imageUrl ? 1 : 0);
                      const vidCount = (project.videos && project.videos.length > 0) ? project.videos.length : (project.videoUrl ? 1 : 0);
                      if (imgCount === 0 && vidCount === 0) return null;

                      return (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {imgCount > 0 && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                              <ImageIcon className="w-3 h-3 text-emerald-400" />
                              <span>{imgCount === 1 ? 'Screenshot Attached' : `${imgCount} Screenshots`}</span>
                            </div>
                          )}
                          {vidCount > 0 && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                              <Video className="w-3 h-3 text-cyan-400" />
                              <span>{vidCount === 1 ? 'Demo Video' : `${vidCount} Demo Videos`}</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Highlights */}
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                      {project.highlights.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">&rsaquo;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[11px] font-mono text-slate-500 px-1 py-0.5">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectProject(project)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Architecture</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">0 Projects Currently Listed</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                No projects are currently listed. New projects will be added here via Admin Portal.
              </p>
            </div>
          )
        )}

        {/* View 2: CTF & Hands-On Security Platforms */}
        {activeTab === 'ctf' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CTF_PLATFORMS.map((platform, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                        <Flag className="w-5 h-5 text-cyan-400" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                        {platform.rank}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                    <p className="text-sm font-semibold text-cyan-300 font-mono mt-1">
                      {platform.stats}
                    </p>

                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {platform.highlight}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-2 font-mono">Specialized Categories:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {platform.focusAreas.map((area, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-950 text-slate-400 border border-slate-850 px-2 py-0.5 rounded"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    {(platform.name === 'Hack The Box' || platform.name === 'TryHackMe') && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <a
                          href={
                            platform.name === 'Hack The Box'
                              ? personalInfo.social.hackthebox
                              : personalInfo.social.tryhackme
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <span>View Official {platform.name} Profile</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTF Simulation Callout */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Interactive Security Shell & CTF Flag Sandbox</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Launch our in-browser command console to inspect writeups, check target payloads, and view simulated exploit trees.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenTerminal}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors shrink-0"
              >
                $ launch_ctf_shell
              </button>
            </div>
          </div>
        )}

        {/* View 3: All Certifications */}
        {activeTab === 'certifications' && (
          certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-cyan-400">
                        Issued {cert.issuedDate}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {cert.credentialId}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                    <p className="text-xs text-cyan-300 font-medium mt-1">{cert.issuer}</p>

                    <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                      {cert.description}
                    </p>

                    {cert.imageUrl && (
                      <div className="mt-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono w-fit">
                        <ImageIcon className="w-3 h-3 text-emerald-400" />
                        <span>Certificate Document Attached</span>
                      </div>
                    )}

                    <div className="mt-4">
                      <span className="text-[11px] text-slate-400 block mb-1.5 font-mono">Competencies Evaluated:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skillsCovered.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Authenticity</span>
                    </span>

                    <button
                      onClick={() => onSelectCertification(cert)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">0 Certifications Currently Listed</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                No certifications are currently listed. Verified certificates will be added here via Admin Portal.
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};
