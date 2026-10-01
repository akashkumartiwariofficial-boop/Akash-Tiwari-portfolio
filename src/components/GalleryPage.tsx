import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Download,
  Shield,
  Github,
  Linkedin,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
  date?: string;
  location?: string;
  featured?: boolean;
}

interface GalleryPageProps {
  onBackToPortfolio: () => void;
  onSelectMainPhoto?: (photoUrl: string) => void;
}

const CATEGORIES = [
  'All Photos',
  'Formal',
  'Campus & IIT Patna',
  'Tech & Research',
  'Author & Achievements',
  'Custom Uploads',
];

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onBackToPortfolio,
}) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Photos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Load photos from API or fallback to localStorage / defaults
  const loadPhotos = async () => {
    try {
      const res = await fetch('/api/gallery-photos');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
          localStorage.setItem('akash_gallery_cache', JSON.stringify(data));
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Falling back to local storage gallery data', err);
    }

    const cached = localStorage.getItem('akash_gallery_cache');
    if (cached) {
      try {
        setPhotos(JSON.parse(cached));
      } catch {
        // ignore
      }
    } else {
      // Default initial photos
      setPhotos([
        {
          id: 'photo-1',
          title: 'Executive Navy Suit Formal Portrait',
          category: 'Formal',
          url: '/src/assets/images/akash_suit_portrait_1790780374642.jpg',
          description: 'Official formal portrait of Akash Kumar Tiwari in classic 3-piece navy suit at IIT Patna.',
          date: '2026',
          location: 'Patna, Bihar, India',
          featured: true,
        },
        {
          id: 'photo-2',
          title: 'Academic Scholar & Conference Portrait',
          category: 'Formal',
          url: '/src/assets/images/akash_tiwari_linkedin_1790780031685.jpg',
          description: 'LinkedIn & academic research portrait for cybersecurity summits, workshops, and papers.',
          date: '2026',
          location: 'Patna, Bihar, India',
          featured: true,
        },
        {
          id: 'photo-3',
          title: 'IIT Patna Main Campus & Academic Blocks',
          category: 'Campus & IIT Patna',
          url: '/src/assets/images/photo_1790797716011.jpg',
          description: 'Official campus life and academic block view at Indian Institute of Technology Patna (IIT Patna).',
          date: '2026',
          location: 'Patna, Bihar, India',
          featured: true,
        },
        {
          id: 'photo-4',
          title: 'Cybersecurity & CTF Defense Lab',
          category: 'Tech & Research',
          url: '/src/assets/images/cyber_network_banner_1790761411174.jpg',
          description: 'Deep packet analysis, Kali Linux defensive tooling, and TryHackMe / HackTheBox challenge lab.',
          date: '2026',
          location: 'Patna, Bihar, India',
          featured: false,
        },
        {
          id: 'photo-5',
          title: 'Author Debut: Civic Sense of Indian People',
          category: 'Author & Achievements',
          url: '/src/assets/images/book_cover_civic_sense_1790761396423.jpg',
          description: 'Upcoming 2026 non-fiction book exploring civic responsibility, traffic ethics, and public empathy in India.',
          date: '2026',
          location: 'Patna, Bihar, India',
          featured: false,
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  // Filter out 'Campus & IIT Patna' photos from 'All Photos' tab so they remain separate
  const filteredPhotos =
    activeCategory === 'All Photos'
      ? photos.filter(
          (p) =>
            p.category !== 'Campus & IIT Patna' &&
            !p.category.toLowerCase().includes('campus')
        )
      : photos.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const currentLightboxPhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredPhotos.length);
      setIsZoomed(false);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) - 1 + filteredPhotos.length) % filteredPhotos.length);
      setIsZoomed(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-mono transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back to Portfolio</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wider">
                AKASH TIWARI &bull; PHOTO GALLERY
              </span>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/akashkumartiwariofficial-boop"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors"
              title="GitHub: akashkumartiwariofficial-boop"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={PERSONAL_INFO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4 text-sky-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Gallery Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>IIT Patna &bull; CS, AI & Cybersecurity Scholar</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                Akash Kumar Tiwari
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Official Visual Gallery & Archive. Showcasing executive portraits, academic life at IIT Patna, cybersecurity CTF research, author achievements, and personal milestones.
              </p>

              {/* GitHub Link Highlight */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://github.com/akashkumartiwariofficial-boop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>github.com/akashkumartiwariofficial-boop</span>
                </a>

                <span className="text-xs text-slate-400 font-mono">
                  {photos.length} Total Verified Photos in Gallery
                </span>
              </div>
            </div>

            {/* Academic & Security Verification Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left max-w-xs shrink-0 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Verified Academic Archive</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Official photography documentation and press media for research conferences & campus initiatives.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-400">
                &bull; IIT Patna &bull; Cybersecurity Guild
              </div>
            </div>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-900">
          <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Category:</span>
          </span>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono text-sm">
            Loading visual gallery...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-20 text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No photos in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Photos in this category will appear here once added by Akash Tiwari from the Admin Portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => {
                  setLightboxIndex(index);
                  setIsZoomed(false);
                }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Image Container with 4:5 aspect ratio */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 backdrop-blur-md">
                      {photo.category}
                    </span>

                    {photo.location && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/85 border border-slate-800 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                        {photo.location}
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay with Expand & View Full */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(index);
                      }}
                      className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
                      title="View Full Resolution"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <span className="text-[11px] font-mono text-white font-medium">Click to Expand</span>
                  </div>
                </div>

                {/* Info Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-slate-900/90">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    )}
                  </div>

                  {/* Card Action Row - Pure viewer controls */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{photo.date || '2026'}</span>
                    </span>

                    <a
                      href={photo.url}
                      download={`${photo.title.replace(/\s+/g, '_')}.jpg`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors text-[11px] font-mono"
                      title="Download Photo"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {currentLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200 p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Header Controls */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                {currentLightboxPhoto.title} ({lightboxIndex! + 1}/{filteredPhotos.length})
              </span>
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
                href={currentLightboxPhoto.url}
                download={`${currentLightboxPhoto.title}.jpg`}
                className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-colors"
                title="Download Photo"
              >
                <Download className="w-4 h-4 text-cyan-400" />
              </a>

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-rose-500/40 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>
          </div>

          {/* Left / Right Nav Buttons */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md transition-all active:scale-95 z-20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md transition-all active:scale-95 z-20"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Lightbox Center Image */}
          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center p-2 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentLightboxPhoto.url}
              alt={currentLightboxPhoto.title}
              className={`max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* Description & metadata footer */}
            <div className="mt-4 text-center max-w-xl space-y-1">
              <h3 className="text-base font-bold text-white">
                {currentLightboxPhoto.title}
              </h3>
              {currentLightboxPhoto.description && (
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {currentLightboxPhoto.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-cyan-400 pt-1">
                <span>{currentLightboxPhoto.location || 'IIT Patna'}</span>
                <span>&bull;</span>
                <span>Category: {currentLightboxPhoto.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
