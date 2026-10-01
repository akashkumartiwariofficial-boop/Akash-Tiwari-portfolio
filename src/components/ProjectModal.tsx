import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Shield,
  Cpu,
  Layers,
  GitBranch,
  CheckCircle2,
  Terminal,
  Image as ImageIcon,
  Video,
  Star,
  GitFork,
  Copy,
  Check,
  Maximize2,
  Award,
  FolderGit2,
} from 'lucide-react';
import { ProjectItem, CertificationItem } from '../types/portfolio';

interface ProjectModalProps {
  project?: ProjectItem | null;
  certification?: CertificationItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, certification, onClose }) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!project && !certification) return null;

  const handleCopyClone = (repoUrl?: string) => {
    const textToCopy = repoUrl ? `git clone ${repoUrl}.git` : 'git clone https://github.com/akashkumartiwariofficial-boop';
    navigator.clipboard.writeText(textToCopy);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-3xl bg-[#090d16] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {project ? `Technical Specification · ${project.category}` : 'Verified Credential Analysis'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm">
            {project && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Updated {project.date}</span>
                    {project.repoName && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-slate-700 text-slate-400">
                        Public Repository
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {project.description || project.summary}
                  </p>
                </div>

                {/* PROJECT MEDIA: PHOTOS & SCREENSHOTS GALLERY */}
                {(() => {
                  const allImages = project.images && project.images.length > 0
                    ? project.images
                    : (project.imageUrl ? [project.imageUrl] : []);
                  if (allImages.length === 0) return null;

                  return (
                    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 space-y-2">
                      <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Project Photos & Diagrams ({allImages.length})</span>
                        </span>
                        <span className="text-[10px] text-cyan-400">Click to Enlarge</span>
                      </div>
                      <div className={`p-3 gap-3 ${allImages.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2' : 'block'}`}>
                        {allImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxImage(imgUrl)}
                            className="relative group rounded-xl overflow-hidden bg-black/50 border border-slate-800 cursor-pointer hover:border-cyan-500/50 transition-all"
                          >
                            <img
                              src={imgUrl}
                              alt={`${project.title} screenshot ${idx + 1}`}
                              className="w-full max-h-64 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* PROJECT MEDIA: DEMO VIDEOS */}
                {(() => {
                  const allVideos = project.videos && project.videos.length > 0
                    ? project.videos
                    : (project.videoUrl ? [project.videoUrl] : []);
                  if (allVideos.length === 0) return null;

                  return (
                    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 space-y-2">
                      <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                          <Video className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Project Demonstration Videos ({allVideos.length})</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Interactive Player</span>
                      </div>
                      <div className="p-3 space-y-4">
                        {allVideos.map((vidUrl, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden bg-black border border-slate-800 p-2 space-y-1.5">
                            {allVideos.length > 1 && (
                              <span className="text-[10px] font-mono text-slate-400 block px-1">Demo Recording #{idx + 1}</span>
                            )}
                            <video
                              src={vidUrl}
                              controls
                              className="w-full max-h-80 object-contain rounded-lg bg-black"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* GitHub Repository Spec Card */}
                {project.githubUrl && (
                  <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-[#7d8590]" />
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono font-semibold text-[#58a6ff] hover:underline"
                        >
                          akashkumartiwariofficial-boop /{' '}
                          <span className="text-white font-bold">
                            {project.repoName || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                          </span>
                        </a>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-[#7d8590]">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#e3b341] fill-[#e3b341]" />
                          <span className="text-white">{project.stars || 32}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5" />
                          <span className="text-white">{project.forks || 8}</span>
                        </span>
                        <span>⚖️ {project.license || 'MIT'}</span>
                      </div>
                    </div>

                    {/* Git clone box */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161b22] border border-[#30363d]">
                      <span className="text-xs font-mono text-[#8b949e] select-all flex-1 truncate">
                        git clone {project.githubUrl}.git
                      </span>
                      <button
                        onClick={() => handleCopyClone(project.githubUrl)}
                        className="px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        {copiedClone ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-cyan-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-mono font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {project.metrics && (
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <span className="text-xs font-mono text-cyan-400 block mb-1">Key Performance Metric</span>
                    <p className="text-base font-bold text-emerald-400 font-mono">
                      {project.metrics}
                    </p>
                  </div>
                )}

                {project.architectureDetails && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      <span>Pipeline Architecture & Data Flow</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto">
                      {project.architectureDetails}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Core Engineering Highlights
                  </h4>
                  <ul className="space-y-2">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Technologies & Primitives
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {certification && (
              <>
                <div>
                  <span className="text-xs font-mono text-emerald-400 block mb-1">
                    Issued: {certification.issuedDate} &bull; ID: {certification.credentialId}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {certification.title}
                  </h3>
                  <p className="text-xs text-cyan-300 font-medium mb-3">
                    Issuer: {certification.issuer}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {certification.description}
                  </p>
                </div>

                {/* CERTIFICATE PHOTO / DOCUMENT */}
                {certification.imageUrl && (
                  <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 space-y-2">
                    <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Official Certificate Document</span>
                      </span>
                      <button
                        onClick={() => setLightboxImage(certification.imageUrl!)}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Enlarge Certificate</span>
                      </button>
                    </div>
                    <div className="p-2 cursor-pointer" onClick={() => setLightboxImage(certification.imageUrl!)}>
                      <img
                        src={certification.imageUrl}
                        alt={certification.title}
                        className="w-full max-h-80 object-contain rounded-xl bg-black/40 hover:opacity-95 transition-opacity"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Covered Standards & Knowledge Domains
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {certification.skillsCovered.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-slate-950 border border-emerald-500/30 text-xs font-mono text-emerald-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">
              Akash Tiwari Portfolio Spec &bull; IIT Patna
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close Specification
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for enlarged photo */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Enlarged Document"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-700"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
