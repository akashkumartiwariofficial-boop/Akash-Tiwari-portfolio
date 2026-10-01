import React from 'react';
import { X, BookOpen, BookmarkCheck, ShoppingBag, ExternalLink, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface BookExcerptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookExcerptModal: React.FC<BookExcerptModalProps> = ({ isOpen, onClose }) => {
  const { bookDetails } = usePortfolio();
  if (!isOpen) return null;

  const amazonUrl = bookDetails.amazonUrl || 'https://amzn.in/d/0cj4pQPk';
  const flipkartUrl = bookDetails.flipkartUrl || 'https://dl.flipkart.com/s/Iz0x8jNNNN';
  const publisherName = bookDetails.publisher || 'Bookspot Publishers';
  const publishedDate = bookDetails.publishedDate || '8 October 2025';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#090e18] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-amber-300 uppercase tracking-wider">
              Published Book &bull; Chapter Excerpt
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Published on {publishedDate} &bull; {publisherName}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              The Great Indian Threshold: Inside the Home vs. Outside the Gate
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              From &ldquo;{bookDetails.title}&rdquo; &bull; Author: {bookDetails.author}
            </p>
          </div>

          <div className="space-y-4 font-serif text-slate-200 text-sm sm:text-base leading-relaxed">
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-2">
              Step inside an Indian household, and you will invariably be greeted by pristine cleanliness—gleaming floors, meticulously arranged altars, and an insistence on removing street shoes before crossing the threshold.
            </p>
            <p>
              Yet, step two inches past the exterior boundary wall onto the public lane, and that tender devotion vanishes into thin air. Litter is tossed without a backward glance, waste is swept out into the storm drain, and the common street is treated as a no-man's-land.
            </p>
            <p>
              This book begins with a simple question: <em>Why does our instinct of care stop precisely at our private gate?</em>
            </p>
            <p>
              To build an extraordinary nation in this century, we cannot merely build high-speed trains, semiconductor fabrication hubs, and digital payment networks. We must concurrently build the invisible software that makes human societies harmonious: civic empathy, respect for common property, and an unwavering commitment to personal accountability.
            </p>
            <p>
              When a motorist jumps a red light or leans violently on a horn at an intersection, it is not merely a violation of traffic code; it is a declaration of priority over fellow citizens. It says: <em>My three seconds are worth more than your peace of mind and safety.</em> The road is a living mirror of collective trust. If we cannot share fifty meters of asphalt with fairness and patience, how do we expect to build lasting institutions of public trust?
            </p>
            <p>
              Civic sense is not an imported luxury. It is the very foundation of mutual respect that turns a crowd into a community.
            </p>
          </div>

          {/* Buy now card */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300">
                Full Book Available Now (8 Oct 2025 Release)
              </span>
              <span className="text-[11px] font-mono text-slate-400">{publisherName}</span>
            </div>
            <p className="text-xs text-slate-300">
              Read the full paperback edition analyzing urban civics, traffic ethics, and personal responsibility in modern India.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy on Amazon</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={flipkartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy on Flipkart</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            &copy; Akash Tiwari &bull; {publisherName}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
