import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsCertifications } from './components/ProjectsCertifications';
import { BookSection } from './components/BookSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ProjectModal } from './components/ProjectModal';
import { BookExcerptModal } from './components/BookExcerptModal';
import { ResumeModal } from './components/ResumeModal';
import { CVResumeModal } from './components/CVResumeModal';
import { MediaModal } from './components/MediaModal';
import { GalleryPage } from './components/GalleryPage';
import { AdminPortalPage } from './components/AdminPortalPage';
import { PortfolioProvider } from './context/PortfolioContext';
import { ProjectItem, CertificationItem } from './types/portfolio';

function AppContent() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [adminDashboardModalOpen, setAdminDashboardModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [bookExcerptOpen, setBookExcerptOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [cvResumeModalOpen, setCvResumeModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const [currentView, setCurrentView] = useState<'portfolio' | 'gallery' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('admin') || hash.includes('admin')) {
        return 'admin';
      }
      if (path.includes('gallery') || hash.includes('gallery')) {
        return 'gallery';
      }
    }
    return 'portfolio';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('admin') || hash.includes('admin')) {
        setCurrentView('admin');
      } else if (path.includes('gallery') || hash.includes('gallery')) {
        setCurrentView('gallery');
      } else {
        setCurrentView('portfolio');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Dedicated Secret Admin Management Portal
  if (currentView === 'admin') {
    return (
      <AdminPortalPage
        onBackToPortfolio={() => {
          localStorage.removeItem('akash_admin_session_token');
          sessionStorage.removeItem('akash_admin_session_token');
          window.location.hash = '';
          window.history.pushState(null, '', '/');
          setCurrentView('portfolio');
        }}
      />
    );
  }

  // Dedicated Photo Gallery Page
  if (currentView === 'gallery') {
    return (
      <GalleryPage
        onBackToPortfolio={() => {
          window.location.hash = '#about';
          window.history.pushState(null, '', '/');
          setCurrentView('portfolio');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Navigation Header */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
        onOpenGallery={() => {
          window.location.hash = '#gallery';
          setCurrentView('gallery');
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenResume={() => setCvResumeModalOpen(true)}
          onOpenCVResume={() => setCvResumeModalOpen(true)}
          onOpenMedia={() => setMediaModalOpen(true)}
        />

        {/* About Me Section */}
        <About
          onOpenGallery={() => {
            window.location.hash = '#gallery';
            setCurrentView('gallery');
          }}
        />

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects, Certifications & CTF Section */}
        <ProjectsCertifications
          onSelectProject={(proj) => {
            setSelectedProject(proj);
            setSelectedCert(null);
          }}
          onSelectCertification={(cert) => {
            setSelectedCert(cert);
            setSelectedProject(null);
          }}
          onOpenTerminal={() => setTerminalOpen(true)}
        />

        {/* Upcoming Book Section */}
        <BookSection onOpenExcerpt={() => setBookExcerptOpen(true)} />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
      />

      {/* Modals & Interactive Overlays */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
      />

      <MediaModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
      />

      <CVResumeModal
        isOpen={cvResumeModalOpen}
        onClose={() => setCvResumeModalOpen(false)}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
      />

      <AdminDashboardModal
        isOpen={adminDashboardModalOpen}
        onClose={() => setAdminDashboardModalOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
      />

      <ProjectModal
        project={selectedProject}
        certification={selectedCert}
        onClose={() => {
          setSelectedProject(null);
          setSelectedCert(null);
        }}
      />

      <BookExcerptModal
        isOpen={bookExcerptOpen}
        onClose={() => setBookExcerptOpen(false)}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
