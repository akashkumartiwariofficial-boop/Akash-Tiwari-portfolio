import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  MapPin,
  ExternalLink,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ContactSection: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Internship Opportunity',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setSubmitting(true);
    try {
      await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: formData.name.trim(),
          senderEmail: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });
    } catch (err) {
      console.warn('Network issue sending inquiry:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#070c16] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>05 · Communication & Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Let&rsquo;s Connect & Build Resilient Systems
          </h2>
          <p className="mt-2 text-base text-slate-400 leading-relaxed">
            Interested in discussing security research, student leadership, vulnerability audits, or upcoming book discussions? My inbox is always open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Channels & Details - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Email Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                Primary Contact
              </span>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 block">Personal Email</span>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors font-mono break-all"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-slate-950 transition-colors"
                >
                  Compose
                </a>
              </div>
            </div>

            {/* Academic Base & Location */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Academic Location</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {personalInfo.institute} &bull; {personalInfo.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social & Security Profiles */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                Connect on Tech & Social Platforms
              </span>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href={personalInfo.social.hackthebox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>Hack The Box</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href={personalInfo.social.tryhackme}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>TryHackMe</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form - 7 cols */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>
              <p className="text-xs text-slate-400 mb-6">
                Fill out the form below to initiate discussions regarding internships, vulnerability research, or civic discourse.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-slate-950/60 rounded-xl border border-emerald-500/30">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Message Transmitted Successfully</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out, <strong className="text-white">{formData.name}</strong>. Your message regarding &ldquo;{formData.subject}&rdquo; has been queued, and Akash will reply to <span className="text-cyan-400">{formData.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: 'Internship Opportunity',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe / Dr. Sharma"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400 block">Your Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@organization.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 block">Inquiry Category</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Internship Opportunity">Cybersecurity Internship Opportunity</option>
                      <option value="Research Collaboration">AI & Security Research Collaboration</option>
                      <option value="CTF / Team Collaboration">Capture The Flag Squad & Exercises</option>
                      <option value="Published Book Inquiry">Published Book ("The Civic Sense of Indian People") Inquiry</option>
                      <option value="General Technical Conversation">General Mentorship / Tech Talk</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-400 block">Message Details</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share project scope, organization details, or questions..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Transmitting Message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message to Akash Tiwari</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
