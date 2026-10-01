import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Check,
  BookMarked,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface BookSectionProps {
  onOpenExcerpt: () => void;
}

export const BookSection: React.FC<BookSectionProps> = ({ onOpenExcerpt }) => {
  const { books, bookDetails } = usePortfolio();
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activeBooks = books && books.length > 0 ? books : [bookDetails];
  const currentBook = activeBooks[selectedBookIndex] || activeBooks[0] || bookDetails;

  const amazonUrl = currentBook.amazonUrl || 'https://amzn.in/d/0cj4pQPk';
  const flipkartUrl = currentBook.flipkartUrl || 'https://dl.flipkart.com/s/Iz0x8jNNNN';
  const publisherName = currentBook.publisher || 'Bookspot Publishers';
  const publishedDate = currentBook.publishedDate || '8 October 2025';
  const chapters = currentBook.chapters && currentBook.chapters.length > 0 ? currentBook.chapters : [];
  const keyThemes = currentBook.keyThemes && currentBook.keyThemes.length > 0 ? currentBook.keyThemes : [];

  return (
    <section id="book" className="py-24 relative bg-[#060a12] border-t border-slate-900 overflow-hidden">
      {/* Background warm aesthetic ambient light */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Book Selector Tabs (if multiple books exist) */}
        {activeBooks.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-900">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1.5 shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Authored Books ({activeBooks.length}):</span>
            </span>

            {activeBooks.map((b, idx) => (
              <button
                key={b.id || idx}
                onClick={() => {
                  setSelectedBookIndex(idx);
                  setActiveChapterIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  selectedBookIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{b.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>04 · Published Book & Civic Consciousness</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            &ldquo;{currentBook.title}&rdquo;
          </h2>
          {currentBook.subtitle && (
            <p className="mt-2 text-base sm:text-lg text-slate-300 font-serif leading-relaxed">
              {currentBook.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2.5 pt-3">
            <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Published: {publishedDate}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              Publisher: {publisherName}
            </span>

            <span className="px-3 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 text-xs font-mono text-amber-300">
              Author: {currentBook.author || 'Akash Tiwari'}
            </span>
          </div>
        </div>

        {/* Main Book Spotlight Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Book Cover, Badges & Purchase Links - 5 cols */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group max-w-sm w-full">
              {/* Outer Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-rose-500/20 to-cyan-500/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Book Container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                <div className="aspect-[3/4] relative bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentBook.coverImage || '/src/assets/images/book_cover_civic_sense.svg'}
                    alt={`Book Cover: ${currentBook.title} by Akash Tiwari`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Published Status Bar under cover */}
                <div className="p-3.5 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300 font-mono text-[11px]">Published: {publishedDate}</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px] font-semibold">{publisherName}</span>
                </div>
              </div>
            </div>

            {/* Direct Purchase Action Buttons */}
            <div className="mt-6 w-full max-w-sm space-y-3">
              <div className="text-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Order Your Copy Today:
                </span>
              </div>

              {/* Amazon Button */}
              {amazonUrl && (
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-between active:scale-95 group"
                  title="Buy on Amazon India"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-950" />
                    <span>Buy on Amazon</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono opacity-90 group-hover:translate-x-0.5 transition-transform">
                    <span>Available</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              )}

              {/* Flipkart Button */}
              {flipkartUrl && (
                <a
                  href={flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-400 hover:to-blue-400 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-between active:scale-95 group"
                  title="Buy on Flipkart"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>Buy on Flipkart</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono opacity-90 group-hover:translate-x-0.5 transition-transform">
                    <span>Available</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              )}

              {/* Read Excerpt Button */}
              <button
                onClick={onOpenExcerpt}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Read Free Chapter 1 Excerpt</span>
              </button>
            </div>
          </div>

          {/* Right: Book Core Themes & Chapter Previews - 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            {/* Synopsis & Overview */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                <span>Social Conscience · Cultural Responsibility · Urban Civics</span>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {currentBook.synopsis}
              </p>
            </div>

            {/* Key Themes Bento */}
            {keyThemes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyThemes.map((theme, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/30 transition-colors"
                  >
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{theme.title}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Chapter Previews (if chapters exist) */}
            {chapters.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Inside the Chapters
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        activeChapterIndex === idx
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm'
                          : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-mono block text-slate-500">
                        {ch.number}
                      </span>
                      <span className="text-xs font-bold truncate block">
                        {ch.title.split(':')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Chapter Details */}
                {chapters[activeChapterIndex] && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono text-amber-400 font-medium">
                        {chapters[activeChapterIndex].number}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">Curated Outline</span>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-2">
                      {chapters[activeChapterIndex].title}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {chapters[activeChapterIndex].summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {chapters[activeChapterIndex].topics.map((t, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                        >
                          &bull; {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Author Note Quote */}
            {currentBook.authorNote && (
              <div className="p-5 rounded-xl bg-slate-950/70 border-l-2 border-amber-400 border-slate-800">
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  {currentBook.authorNote}
                </p>
              </div>
            )}

            {/* Purchase Call to Action Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Available on Major Indian Bookstores</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Order &ldquo;{currentBook.title}&rdquo; Online
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Published on {publishedDate} by {publisherName}. Available in Paperback nationwide.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {amazonUrl && (
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Amazon</span>
                  </a>
                )}

                {flipkartUrl && (
                  <a
                    href={flipkartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Flipkart</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
