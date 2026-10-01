import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Save,
  RefreshCw,
  FolderGit2,
  Wrench,
  Award,
  User,
  Image as ImageIcon,
  BookOpen,
  Terminal,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Mail,
  MessageSquare,
  Inbox,
  CheckCheck,
  Clock,
  Send,
  Copy,
  Search,
  CornerDownRight,
  Video,
  Play,
  Star,
  GitFork,
  GitBranch,
  FileText,
  Share2,
  Download,
  Layers,
  FileUp,
  GraduationCap,
  Briefcase,
  CloudUpload,
  Zap,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem, CertificationItem, SkillItem, BookItem } from '../types/portfolio';

const ADMIN_EMAIL = 'akashkumartiwariofficial@gmail.com';
const ADMIN_PASSWORD = `${ADMIN_EMAIL}${ADMIN_EMAIL}`;
const SESSION_KEY = 'akash_admin_session_token';

interface AdminPortalPageProps {
  onBackToPortfolio: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onBackToPortfolio }) => {
  const {
    personalInfo,
    skills,
    projects,
    certifications,
    books,
    bookDetails,
    updatePersonalInfo,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addBook,
    updateBook,
    deleteBook,
    updateBookDetails,
    saveAllChanges,
    resetToDefaults,
    isSaving,
  } = usePortfolio();

  // Authentication State - Always starts locked on every entry
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Enforce zero-retention on leave: Any time the user leaves the admin view, purge session
  useEffect(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    return () => {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    };
  }, []);

  const handleExitToPortfolio = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
    onBackToPortfolio();
  };

  // Active Management Section - Inquiries & AI Logs & CV/Resume are prioritized
  const [activeTab, setActiveTab] = useState<
    'inquiries' | 'terminal' | 'cv_resume' | 'deploy_sync' | 'media' | 'projects' | 'skills' | 'certifications' | 'personal' | 'photos' | 'book'
  >('inquiries');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Render & GitHub Auto-Sync State
  const [deployConfig, setDeployConfig] = useState({
    githubRepo: 'akashkumartiwariofficial-boop/portfolio-app',
    githubBranch: 'main',
    githubToken: '',
    renderDeployHookUrl: '',
    autoSyncEnabled: true,
    lastSyncTime: null as string | null,
    lastSyncStatus: 'Ready for Deploy',
    lastSyncLog: '',
  });
  const [isSyncingDeploy, setIsSyncingDeploy] = useState(false);
  const [isSavingDeployConfig, setIsSavingDeployConfig] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/deploy-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setDeployConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveDeployConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingDeployConfig(true);
    try {
      const res = await fetch('/api/deploy-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deployConfig),
      });
      if (res.ok) {
        showToast('Render & GitHub Auto-Sync settings saved successfully!');
      } else {
        showToast('Error saving deployment configuration.');
      }
    } catch {
      showToast('Error saving deployment configuration.');
    } finally {
      setIsSavingDeployConfig(false);
    }
  };

  const handleManualSyncNow = async () => {
    setIsSyncingDeploy(true);
    setSyncStatusMsg('Syncing changes to GitHub & triggering Render build...');
    try {
      await saveAllChanges();
      const res = await fetch('/api/sync-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Manual Admin Portal Trigger' }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeployConfig((prev) => ({
          ...prev,
          lastSyncTime: new Date().toISOString(),
          lastSyncStatus: 'Sync Completed',
          lastSyncLog: data.log || 'Render build triggered and files pushed to GitHub.',
        }));
        showToast('Committed to GitHub & Render deploy build triggered!');
        setSyncStatusMsg('Success! GitHub received commit and Render build was initiated.');
      } else {
        setSyncStatusMsg('Error triggering GitHub/Render sync.');
      }
    } catch (err: any) {
      setSyncStatusMsg(`Sync error: ${err.message}`);
    } finally {
      setIsSyncingDeploy(false);
    }
  };

  // CV & Resume Management State
  const [cvResumeItems, setCvResumeItems] = useState<Array<{
    id: string;
    type: 'cv' | 'resume';
    title: string;
    subtitle: string;
    category: string;
    version: string;
    lastUpdated: string;
    fileSize: string;
    fileName: string;
    downloadUrl: string;
    fileBase64?: string;
    description: string;
    highlights: string[];
    isPrimary?: boolean;
  }>>([]);

  // CV Upload State
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [cvUploadTitle, setCvUploadTitle] = useState('');
  const [cvUploadCategory, setCvUploadCategory] = useState('Cybersecurity & AI');
  const [cvUploadVersion, setCvUploadVersion] = useState('2026.1');
  const [selectedCVFile, setSelectedCVFile] = useState<File | null>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // Resume Upload State
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadTitle, setResumeUploadTitle] = useState('');
  const [resumeUploadCategory, setResumeUploadCategory] = useState('Software Engineering & AI');
  const [resumeUploadVersion, setResumeUploadVersion] = useState('2026.1');
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // Contact Messages & Direct Reply State
  const [contactMessages, setContactMessages] = useState<Array<{
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
    timestamp: string;
    read: boolean;
    replies?: Array<{
      id: string;
      sender: string;
      senderEmail: string;
      toEmail: string;
      subject: string;
      message: string;
      timestamp: string;
      deliveryStatus: 'delivered' | 'sent-via-relay' | 'queued';
      smtpResponse?: string;
    }>;
  }>>([]);
  const [selectedSenderEmail, setSelectedSenderEmail] = useState<string | null>(null);
  const [messageSearch, setMessageSearch] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // In-App Direct Reply Composer State
  const [directReplyText, setDirectReplyText] = useState('');
  const [directReplySubject, setDirectReplySubject] = useState('');
  const [isSendingDirectReply, setIsSendingDirectReply] = useState(false);

  // Custom Media Link State
  const [newCustomPlatform, setNewCustomPlatform] = useState('');
  const [newCustomHandle, setNewCustomHandle] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [newCustomDesc, setNewCustomDesc] = useState('');
  const [newCustomBadge, setNewCustomBadge] = useState('Custom Link');

  const handleAddCustomMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomPlatform || !newCustomUrl) return;
    const existingCustom = (personalInfo as any).customMediaChannels || [];
    const newChan = {
      id: `custom-${Date.now()}`,
      platform: newCustomPlatform,
      handle: newCustomHandle || newCustomPlatform.toLowerCase().replace(/\s+/g, '-'),
      url: newCustomUrl,
      description: newCustomDesc || 'Custom added profile link.',
      badge: newCustomBadge || 'Custom Link',
    };
    updatePersonalInfo({
      customMediaChannels: [...existingCustom, newChan],
    });
    setNewCustomPlatform('');
    setNewCustomHandle('');
    setNewCustomUrl('');
    setNewCustomDesc('');
    showToast(`Custom media link "${newCustomPlatform}" added successfully!`);
  };

  const handleDeleteCustomMedia = (id: string, name: string) => {
    const existingCustom = (personalInfo as any).customMediaChannels || [];
    const filtered = existingCustom.filter((c: any) => c.id !== id);
    updatePersonalInfo({
      customMediaChannels: filtered,
    });
    showToast(`Custom link "${name}" deleted.`);
  };

  // Terminal & AI Logs State
  const [terminalLogs, setTerminalLogs] = useState<Array<{
    id: string;
    timestamp: string;
    userQuery: string;
    aiResponse: string;
    source: string;
    status: string;
  }>>([]);
  const [logSearch, setLogSearch] = useState('');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Project Edit & Add Modal State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem>>({
    title: '',
    category: 'Cybersecurity',
    summary: '',
    description: '',
    technologies: [],
    highlights: [],
    githubUrl: 'https://github.com/akashkumartiwariofficial-boop',
    metrics: '',
    date: '2026',
    imageUrl: '',
    videoUrl: '',
    repoName: '',
    stars: 32,
    forks: 8,
    license: 'MIT',
    defaultBranch: 'main',
  });
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [projectRepoViewMode, setProjectRepoViewMode] = useState<'github' | 'cards'>('github');
  const [isUploadingProjectPhoto, setIsUploadingProjectPhoto] = useState(false);
  const [isUploadingProjectVideo, setIsUploadingProjectVideo] = useState(false);
  const projectPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const projectVideoInputRef = useRef<HTMLInputElement | null>(null);

  // Direct Card Media Upload Targets
  const [targetProjectForMedia, setTargetProjectForMedia] = useState<{ id: string; type: 'photo' | 'video' } | null>(null);
  const [targetCertForPhoto, setTargetCertForPhoto] = useState<string | null>(null);
  const directProjectPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const directProjectVideoInputRef = useRef<HTMLInputElement | null>(null);
  const directCertPhotoInputRef = useRef<HTMLInputElement | null>(null);

  // GitHub Repository View Filters & State
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [repoTypeFilter, setRepoTypeFilter] = useState<'all' | 'public'>('all');
  const [repoLanguageFilter, setRepoLanguageFilter] = useState('all');
  const [repoSortBy, setRepoSortBy] = useState<'updated' | 'stars' | 'name'>('updated');
  const [copiedCloneId, setCopiedCloneId] = useState<string | null>(null);
  const [adminLightboxImage, setAdminLightboxImage] = useState<string | null>(null);

  // Skill Edit & Add State
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState<Partial<SkillItem>>({
    name: '',
    category: 'security',
    level: 'Advanced',
    description: '',
    iconName: 'ShieldAlert',
    associatedOrg: 'IIT Patna',
  });

  // Certification Edit & Add State
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certForm, setCertForm] = useState<Partial<CertificationItem>>({
    title: '',
    issuer: '',
    issuedDate: '2026',
    credentialId: '',
    description: '',
    skillsCovered: [],
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
    imageUrl: '',
  });
  const [certSkillInput, setCertSkillInput] = useState('');
  const [isUploadingCertPhoto, setIsUploadingCertPhoto] = useState(false);
  const certPhotoInputRef = useRef<HTMLInputElement | null>(null);

  // Personal Info Form State
  const [personalForm, setPersonalForm] = useState(personalInfo);
  useEffect(() => {
    setPersonalForm(personalInfo);
  }, [personalInfo]);

  // Gallery Photos list & Add/Edit Photo Modal State
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('Formal');
  const [newPhotoLocation, setNewPhotoLocation] = useState('Patna, Bihar, India');
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [newPhotoBase64, setNewPhotoBase64] = useState<string | null>(null);
  const [setNewPhotoAsMain, setSetNewPhotoAsMain] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);
  const photoUploadInputRef = useRef<HTMLInputElement | null>(null);

  // Books Management State & Form
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isUploadingBookCover, setIsUploadingBookCover] = useState(false);
  const bookCoverInputRef = useRef<HTMLInputElement | null>(null);

  const [bookForm, setBookForm] = useState<Partial<BookItem>>({
    title: '',
    subtitle: '',
    author: 'Akash Tiwari',
    publisher: 'Bookspot Publishers',
    publishedDate: '8 October 2025',
    status: 'Published on 8 Oct 2025 · Available on Flipkart & Amazon',
    expectedYear: '2025',
    flipkartUrl: 'https://dl.flipkart.com/s/Iz0x8jNNNN',
    amazonUrl: 'https://amzn.in/d/0cj4pQPk',
    coverImage: '/src/assets/images/book_cover_1790795224241.jpg',
    synopsis: '',
    authorNote: '',
  });

  const handleOpenAddBook = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      subtitle: '',
      author: 'Akash Tiwari',
      publisher: 'Bookspot Publishers',
      publishedDate: '8 October 2025',
      status: 'Published on 8 Oct 2025 · Available on Flipkart & Amazon',
      expectedYear: '2025',
      flipkartUrl: '',
      amazonUrl: '',
      coverImage: '/src/assets/images/book_cover_1790795224241.jpg',
      synopsis: '',
      authorNote: '',
    });
    setIsAddingBook(true);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (b: BookItem) => {
    setEditingBook(b);
    setBookForm({ ...b });
    setIsAddingBook(false);
    setIsBookModalOpen(true);
  };

  const handleBookCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingBookCover(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          try {
            const res = await fetch('/api/upload-book-cover', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageBase64: base64 }),
            });
            if (res.ok) {
              const data = await res.json();
              setBookForm((prev) => ({ ...prev, coverImage: data.url }));
              showToast('Title / Cover photo uploaded successfully!');
              setIsUploadingBookCover(false);
              return;
            }
          } catch {
            // fallback to base64
          }
          setBookForm((prev) => ({ ...prev, coverImage: base64 }));
          showToast('Title photo loaded from file!');
          setIsUploadingBookCover(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title?.trim()) {
      showToast('Please enter a book title.');
      return;
    }

    if (editingBook) {
      const updated: BookItem = {
        ...editingBook,
        ...(bookForm as BookItem),
        title: bookForm.title.trim(),
        coverImage: bookForm.coverImage || '/src/assets/images/book_cover_1790795224241.jpg',
      };
      updateBook(updated);
      showToast(`Book "${updated.title}" updated successfully!`);
    } else {
      const newBook: BookItem = {
        id: `book-${Date.now()}`,
        title: bookForm.title.trim(),
        subtitle: bookForm.subtitle || '',
        author: bookForm.author || 'Akash Tiwari',
        publisher: bookForm.publisher || 'Bookspot Publishers',
        publishedDate: bookForm.publishedDate || '8 October 2025',
        status: bookForm.status || 'Published on 8 Oct 2025 · Available on Flipkart & Amazon',
        expectedYear: bookForm.expectedYear || '2025',
        flipkartUrl: bookForm.flipkartUrl || '',
        amazonUrl: bookForm.amazonUrl || '',
        coverImage: bookForm.coverImage || '/src/assets/images/book_cover_1790795224241.jpg',
        synopsis: bookForm.synopsis || '',
        authorNote: bookForm.authorNote || '',
        keyThemes: [
          { title: 'Civic Responsibility', description: 'Personal habits and societal ethics in modern India.' },
        ],
        chapters: [],
      };
      addBook(newBook);
      showToast(`Book "${newBook.title}" added to your portfolio!`);
    }

    setIsBookModalOpen(false);
    setEditingBook(null);
  };

  const handleDeleteBook = (id: string, title: string) => {
    deleteBook(id);
    showToast(`Book "${title}" deleted successfully!`);
  };

  // Project Photo & Video Upload Handlers
  const handleProjectPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingProjectPhoto(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          try {
            const res = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mediaBase64: base64, mediaType: 'image' }),
            });
            if (res.ok) {
              const data = await res.json();
              setProjectForm((prev) => ({ ...prev, imageUrl: data.url }));
              showToast('Project photo uploaded successfully!');
              setIsUploadingProjectPhoto(false);
              return;
            }
          } catch {
            // fallback
          }
          setProjectForm((prev) => ({ ...prev, imageUrl: base64 }));
          showToast('Project photo loaded!');
          setIsUploadingProjectPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingProjectVideo(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          try {
            const res = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mediaBase64: base64,
                mediaType: 'video',
                extension: file.name.split('.').pop() || 'mp4',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              setProjectForm((prev) => ({ ...prev, videoUrl: data.url }));
              showToast('Project video uploaded successfully!');
              setIsUploadingProjectVideo(false);
              return;
            }
          } catch {
            // fallback
          }
          setProjectForm((prev) => ({ ...prev, videoUrl: base64 }));
          showToast('Project video loaded!');
          setIsUploadingProjectVideo(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Certificate Photo Upload Handler
  const handleCertPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingCertPhoto(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          try {
            const res = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mediaBase64: base64, mediaType: 'image' }),
            });
            if (res.ok) {
              const data = await res.json();
              setCertForm((prev) => ({ ...prev, imageUrl: data.url }));
              showToast('Certificate photo uploaded successfully!');
              setIsUploadingCertPhoto(false);
              return;
            }
          } catch {
            // fallback
          }
          setCertForm((prev) => ({ ...prev, imageUrl: base64 }));
          showToast('Certificate photo loaded!');
          setIsUploadingCertPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct Card Media Upload Handlers
  const handleDirectProjectPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetProjectForMedia?.id) {
      const proj = projects.find((p) => p.id === targetProjectForMedia.id);
      if (!proj) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          let finalUrl = base64;
          try {
            const res = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mediaBase64: base64, mediaType: 'image' }),
            });
            if (res.ok) {
              const data = await res.json();
              finalUrl = data.url;
            }
          } catch {
            // fallback to base64
          }
          updateProject({ ...proj, imageUrl: finalUrl });
          showToast(`Photo added to "${proj.title}"!`);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDirectProjectVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetProjectForMedia?.id) {
      const proj = projects.find((p) => p.id === targetProjectForMedia.id);
      if (!proj) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          let finalUrl = base64;
          try {
            const res = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                mediaBase64: base64,
                mediaType: 'video',
                extension: file.name.split('.').pop() || 'mp4',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              finalUrl = data.url;
            }
          } catch {
            // fallback
          }
          updateProject({ ...proj, videoUrl: finalUrl });
          showToast(`Demo video added to "${proj.title}"!`);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDirectCertPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetCertForPhoto) {
      const cert = certifications.find((c) => c.id === targetCertForPhoto);
      if (!cert) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          let finalUrl = base64;
          try {
            const res = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mediaBase64: base64, mediaType: 'image' }),
            });
            if (res.ok) {
              const data = await res.json();
              finalUrl = data.url;
            }
          } catch {
            // fallback
          }
          updateCertification({ ...cert, imageUrl: finalUrl });
          showToast(`Photo added to "${cert.title}"!`);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleCopyProjectClone = (proj: ProjectItem) => {
    const url = proj.githubUrl || `https://github.com/akashkumartiwariofficial-boop/${proj.repoName || 'project'}`;
    navigator.clipboard.writeText(`git clone ${url}.git`);
    setCopiedCloneId(proj.id);
    showToast(`Copied clone command for "${proj.title}"!`);
    setTimeout(() => setCopiedCloneId(null), 2500);
  };

  const availableLanguages = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.technologies.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (repoSearchQuery.trim()) {
      const q = repoSearchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.summary && p.summary.toLowerCase().includes(q)) ||
          (p.repoName && p.repoName.toLowerCase().includes(q)) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (repoLanguageFilter !== 'all') {
      list = list.filter((p) =>
        p.technologies.some((t) => t.toLowerCase() === repoLanguageFilter.toLowerCase())
      );
    }
    if (repoSortBy === 'stars') {
      list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    } else if (repoSortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [projects, repoSearchQuery, repoLanguageFilter, repoSortBy]);

  const getLanguageColor = (tech?: string) => {
    if (!tech) return '#3572A5';
    const t = tech.toLowerCase();
    if (t.includes('python')) return '#3572A5';
    if (t.includes('rust')) return '#dea584';
    if (t.includes('typescript') || t.includes('ts')) return '#3178c6';
    if (t.includes('javascript') || t.includes('js')) return '#f1e05a';
    if (t.includes('c++') || t.includes('cpp')) return '#f34b7d';
    if (t.includes('c') && !t.includes('css')) return '#555555';
    if (t.includes('bash') || t.includes('shell')) return '#89e051';
    if (t.includes('go') || t.includes('golang')) return '#00ADD8';
    if (t.includes('security') || t.includes('nmap')) return '#00d2ff';
    if (t.includes('ai') || t.includes('ml')) return '#a371f7';
    return '#58a6ff';
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const loadGallery = async () => {
    try {
      const res = await fetch('/api/gallery-photos');
      if (res.ok) {
        const data = await res.json();
        setGalleryPhotos(data);
      }
    } catch {
      // fallback
    }
  };

  const loadContactMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const res = await fetch('/api/contact-messages');
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setContactMessages(data.messages);
        }
      }
    } catch (err) {
      console.warn('Error loading contact messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadTerminalLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const res = await fetch('/api/terminal-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setTerminalLogs(data.logs);
        }
      }
    } catch (err) {
      console.warn('Error loading terminal logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const loadCVResumeItems = async () => {
    try {
      const res = await fetch('/api/cv-resume');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setCvResumeItems(data.items);
          return;
        }
      }
    } catch {}
    setCvResumeItems([]);
  };

  const handleUploadCVSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCVFile) {
      showToast('Please select a Curriculum Vitae (CV) document to upload');
      return;
    }

    setIsUploadingCV(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload-cv-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            fileName: selectedCVFile.name,
            title: cvUploadTitle.trim() || 'Akash Kumar Tiwari - Curriculum Vitae (CV)',
            category: cvUploadCategory,
            version: cvUploadVersion || '2026.1',
            docType: 'cv',
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`CV document "${selectedCVFile.name}" uploaded successfully!`);
          setSelectedCVFile(null);
          setCvUploadTitle('');
          if (cvFileInputRef.current) cvFileInputRef.current.value = '';
          if (data.items) {
            setCvResumeItems(data.items);
          } else {
            loadCVResumeItems();
          }
        } else {
          showToast('CV document uploaded.');
          loadCVResumeItems();
        }
        setIsUploadingCV(false);
      };
      reader.readAsDataURL(selectedCVFile);
    } catch {
      showToast('Error uploading CV document');
      setIsUploadingCV(false);
    }
  };

  const handleUploadResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeFile) {
      showToast('Please select a Technical Resume document to upload');
      return;
    }

    setIsUploadingResume(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload-cv-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            fileName: selectedResumeFile.name,
            title: resumeUploadTitle.trim() || 'Akash Kumar Tiwari - Technical Resume',
            category: resumeUploadCategory,
            version: resumeUploadVersion || '2026.1',
            docType: 'resume',
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Resume document "${selectedResumeFile.name}" uploaded successfully!`);
          setSelectedResumeFile(null);
          setResumeUploadTitle('');
          if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
          if (data.items) {
            setCvResumeItems(data.items);
          } else {
            loadCVResumeItems();
          }
        } else {
          showToast('Resume document uploaded.');
          loadCVResumeItems();
        }
        setIsUploadingResume(false);
      };
      reader.readAsDataURL(selectedResumeFile);
    } catch {
      showToast('Error uploading Resume document');
      setIsUploadingResume(false);
    }
  };

  const handleDeleteCVItem = async (id: string) => {
    const updated = cvResumeItems.filter((i) => i.id !== id);
    setCvResumeItems(updated);
    try {
      await fetch(`/api/cv-resume/${id}`, {
        method: 'DELETE',
      });
      showToast('Document deleted.');
    } catch {}
  };

  const handleDeleteAllCVItems = async () => {
    if (!window.confirm('Are you sure you want to delete all current CV & Resume files?')) return;
    setCvResumeItems([]);
    try {
      await fetch('/api/cv-resume', {
        method: 'DELETE',
      });
      showToast('All previous CV and Resume files deleted successfully.');
    } catch {}
  };

  const handleSetPrimaryCV = async (id: string) => {
    const updated = cvResumeItems.map((i) => ({
      ...i,
      isPrimary: i.id === id,
    }));
    setCvResumeItems(updated);
    try {
      await fetch('/api/cv-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updated }),
      });
      showToast('Primary active status updated.');
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadGallery();
      loadContactMessages();
      loadTerminalLogs();
      loadCVResumeItems();
      const interval = setInterval(() => {
        loadContactMessages();
        loadTerminalLogs();
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Group Contact Messages by Sender Email
  const groupedInquiries = useMemo(() => {
    const map: Record<
      string,
      {
        senderName: string;
        senderEmail: string;
        messages: typeof contactMessages;
        latestTimestamp: string;
        unreadCount: number;
      }
    > = {};

    contactMessages.forEach((msg) => {
      const key = (msg.senderEmail || '').toLowerCase().trim();
      if (!key) return;
      if (!map[key]) {
        map[key] = {
          senderName: msg.senderName || 'Visitor',
          senderEmail: msg.senderEmail,
          messages: [],
          latestTimestamp: msg.timestamp,
          unreadCount: 0,
        };
      }
      map[key].messages.push(msg);
      if (!msg.read) {
        map[key].unreadCount += 1;
      }
      if (new Date(msg.timestamp) > new Date(map[key].latestTimestamp)) {
        map[key].latestTimestamp = msg.timestamp;
        map[key].senderName = msg.senderName;
      }
    });

    return Object.values(map).sort(
      (a, b) => new Date(b.latestTimestamp).getTime() - new Date(a.latestTimestamp).getTime()
    );
  }, [contactMessages]);

  const totalUnreadMessages = useMemo(() => {
    return contactMessages.filter((m) => !m.read).length;
  }, [contactMessages]);

  const handleSelectSender = async (senderEmail: string) => {
    setSelectedSenderEmail(senderEmail);
    const unread = contactMessages.filter(
      (m) => m.senderEmail.toLowerCase() === senderEmail.toLowerCase() && !m.read
    );
    if (unread.length > 0) {
      setContactMessages((prev) =>
        prev.map((m) =>
          m.senderEmail.toLowerCase() === senderEmail.toLowerCase() ? { ...m, read: true } : m
        )
      );
      for (const msg of unread) {
        fetch(`/api/contact-messages/${msg.id}/read`, { method: 'PATCH' }).catch(() => {});
      }
    }
  };

  const handleMarkAllMessagesRead = async () => {
    try {
      await fetch('/api/contact-messages/mark-all-read', { method: 'PATCH' });
      setContactMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      showToast('All contact messages marked as read.');
    } catch {
      //
    }
  };

  const handleDeleteSingleMessage = async (id: string) => {
    try {
      await fetch(`/api/contact-messages/${id}`, { method: 'DELETE' });
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('Message removed.');
    } catch {
      //
    }
  };

  const handleDeleteSenderThread = async (senderEmail: string) => {
    try {
      await fetch(`/api/contact-messages/by-email/${encodeURIComponent(senderEmail)}`, {
        method: 'DELETE',
      });
      setContactMessages((prev) =>
        prev.filter((m) => m.senderEmail.toLowerCase() !== senderEmail.toLowerCase())
      );
      if (selectedSenderEmail?.toLowerCase() === senderEmail.toLowerCase()) {
        setSelectedSenderEmail(null);
      }
      showToast(`Thread for ${senderEmail} deleted.`);
    } catch {
      //
    }
  };

  const handleSendDirectReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedSenderEmail || !directReplyText.trim()) return;

    setIsSendingDirectReply(true);
    try {
      const activeThread = groupedInquiries.find(
        (t) => t.senderEmail.toLowerCase() === selectedSenderEmail.toLowerCase()
      );
      const latestMsg = activeThread?.messages?.[0];
      const subjectToSend =
        directReplySubject.trim() ||
        (latestMsg ? (latestMsg.subject.startsWith('Re:') ? latestMsg.subject : `Re: ${latestMsg.subject}`) : 'Re: Inquiry on Akash Tiwari Portfolio');

      const res = await fetch('/api/contact-messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: latestMsg?.id,
          senderEmail: selectedSenderEmail,
          senderName: activeThread?.senderName || 'Visitor',
          subject: subjectToSend,
          replyMessage: directReplyText.trim(),
          adminEmail: 'akashkumartiwariofficial@gmail.com',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Direct reply sent successfully to ${selectedSenderEmail}!`);
        setDirectReplyText('');
        setDirectReplySubject('');
        if (data.messages) {
          setContactMessages(data.messages);
        } else {
          loadContactMessages();
        }
      } else {
        showToast('Direct dispatch status: Reply saved & queued for delivery.');
        loadContactMessages();
      }
    } catch (err) {
      showToast('Reply saved to conversation thread.');
      loadContactMessages();
    } finally {
      setIsSendingDirectReply(false);
    }
  };

  const handleClearTerminalLogs = async () => {
    try {
      await fetch('/api/terminal-logs', { method: 'DELETE' });
      setTerminalLogs([]);
      showToast('All AI chat logs cleared.');
    } catch {
      //
    }
  };

  // Handle Login Verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    const expectedUser = 'akashkumartiwariofficial@gmail.com@55310';
    const expectedPass = 'akashkumartiwariofficial@gmail.comakashkumartiwariofficial@gmail.comakashkumartiwariofficial@gmail.comakashkumartiwariofficial@gmail.com';

    const isValidLocal = cleanUser === expectedUser && cleanPass === expectedPass;

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        showToast('Login Successful! Welcome Operator Akash Tiwari.');
        setAuthLoading(false);
        return;
      }
    } catch {
      // fall back to client verify
    }

    if (isValidLocal) {
      setIsAuthenticated(true);
      showToast('Login Successful! Welcome Operator Akash Tiwari.');
    } else {
      setAuthError('Access Denied: Invalid Username or Password.');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setPasswordInput('');
    showToast('Portal locked! Re-verification required for next login.');
  };

  // -------------------------------------------------------------
  // PROJECT ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setProjectForm({
      title: '',
      category: 'Cybersecurity',
      summary: '',
      description: '',
      technologies: ['Kali Linux', 'Python'],
      highlights: ['Offensive Vulnerability Discovery'],
      githubUrl: 'https://github.com/akashkumartiwariofficial-boop',
      metrics: '',
      date: '2026',
      imageUrl: '',
      videoUrl: '',
      repoName: '',
      stars: 28,
      forks: 6,
      license: 'MIT',
      defaultBranch: 'main',
    });
    setEditingProject(null);
    setIsAddingProject(true);
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
    setEditingProject(proj);
    setProjectForm({
      ...proj,
      stars: proj.stars || 28,
      forks: proj.forks || 6,
      license: proj.license || 'MIT',
      defaultBranch: proj.defaultBranch || 'main',
      repoName: proj.repoName || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
    setIsAddingProject(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) return;

    if (editingProject) {
      const updated: ProjectItem = {
        ...editingProject,
        ...(projectForm as ProjectItem),
        repoName: projectForm.repoName || projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      updateProject(updated);
      showToast(`Project "${updated.title}" updated successfully!`);
    } else {
      const generatedSlug = (projectForm.repoName || projectForm.title || 'security-tool')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: projectForm.title || 'New Security Project',
        category: projectForm.category || 'Cybersecurity',
        summary: projectForm.summary || '',
        description: projectForm.description || '',
        technologies: projectForm.technologies || [],
        highlights: projectForm.highlights || [],
        githubUrl:
          projectForm.githubUrl ||
          `https://github.com/akashkumartiwariofficial-boop/${generatedSlug}`,
        metrics: projectForm.metrics,
        date: projectForm.date || '2026',
        imageUrl: projectForm.imageUrl || '',
        videoUrl: projectForm.videoUrl || '',
        repoName: generatedSlug,
        stars: projectForm.stars || 28,
        forks: projectForm.forks || 6,
        license: projectForm.license || 'MIT',
        defaultBranch: projectForm.defaultBranch || 'main',
      };
      addProject(newProj);
      showToast(`Project "${newProj.title}" added to portfolio!`);
    }

    setIsAddingProject(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string, title: string) => {
    deleteProject(id);
    showToast(`Project "${title}" deleted successfully!`);
  };

  // -------------------------------------------------------------
  // SKILL ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddSkill = () => {
    setSkillForm({
      name: '',
      category: 'security',
      level: 'Advanced',
      description: '',
      iconName: 'ShieldAlert',
      associatedOrg: 'IIT Patna',
    });
    setEditingSkill(null);
    setIsAddingSkill(true);
  };

  const handleOpenEditSkill = (s: SkillItem) => {
    setEditingSkill(s);
    setSkillForm({ ...s });
    setIsAddingSkill(false);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) return;

    if (editingSkill) {
      const updated: SkillItem = {
        ...editingSkill,
        ...(skillForm as SkillItem),
      };
      updateSkill(updated);
      showToast(`Skill "${updated.name}" updated!`);
    } else {
      const newSkill: SkillItem = {
        id: `skill-${Date.now()}`,
        name: skillForm.name || 'New Tool',
        category: skillForm.category || 'security',
        level: skillForm.level || 'Advanced',
        description: skillForm.description || '',
        iconName: skillForm.iconName || 'ShieldAlert',
        associatedOrg: skillForm.associatedOrg || 'IIT Patna',
      };
      addSkill(newSkill);
      showToast(`Skill "${newSkill.name}" added to skills section!`);
    }

    setIsAddingSkill(false);
    setEditingSkill(null);
  };

  const handleDeleteSkill = (id: string, name: string) => {
    deleteSkill(id);
    showToast(`Skill "${name}" deleted successfully!`);
  };

  // -------------------------------------------------------------
  // CERTIFICATION ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddCert = () => {
    setCertForm({
      title: '',
      issuer: 'IIT Patna / Cyber Security Guild',
      issuedDate: '2026',
      credentialId: '',
      description: '',
      skillsCovered: ['Vulnerability Assessment', 'Ethical Hacking'],
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
      imageUrl: '',
    });
    setEditingCert(null);
    setIsAddingCert(true);
  };

  const handleOpenEditCert = (c: CertificationItem) => {
    setEditingCert(c);
    setCertForm({ ...c });
    setIsAddingCert(false);
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) return;

    if (editingCert) {
      const updated: CertificationItem = {
        ...editingCert,
        ...(certForm as CertificationItem),
      };
      updateCertification(updated);
      showToast(`Certification "${updated.title}" updated!`);
    } else {
      const newCert: CertificationItem = {
        id: `cert-${Date.now()}`,
        title: certForm.title || 'New Certification',
        issuer: certForm.issuer || 'IIT Patna',
        issuedDate: certForm.issuedDate || '2026',
        credentialId: certForm.credentialId,
        description: certForm.description || '',
        skillsCovered: certForm.skillsCovered || [],
        badgeColor: certForm.badgeColor || 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30',
        imageUrl: certForm.imageUrl || '',
      };
      addCertification(newCert);
      showToast(`Certification "${newCert.title}" added!`);
    }

    setIsAddingCert(false);
    setEditingCert(null);
  };

  const handleDeleteCert = (id: string, title: string) => {
    deleteCertification(id);
    showToast(`Certification "${title}" deleted successfully!`);
  };

  // -------------------------------------------------------------
  // PERSONAL INFO SAVE
  // -------------------------------------------------------------
  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo(personalForm);
    showToast('Personal profile and links updated successfully!');
  };

  // -------------------------------------------------------------
  // PHOTO MANAGEMENT IN ADMIN (ADD, EDIT, UPLOAD & DELETE)
  // -------------------------------------------------------------
  const handleOpenAddPhotoModal = () => {
    setEditingPhotoId(null);
    setNewPhotoTitle('');
    setNewPhotoCategory('Formal');
    setNewPhotoLocation('IIT Patna');
    setNewPhotoDescription('');
    setNewPhotoBase64(null);
    setSetNewPhotoAsMain(false);
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhotoModal = (photo: any) => {
    setEditingPhotoId(photo.id);
    setNewPhotoTitle(photo.title || '');
    setNewPhotoCategory(photo.category || 'Formal');
    setNewPhotoLocation(photo.location || 'IIT Patna');
    setNewPhotoDescription(photo.description || '');
    setNewPhotoBase64(photo.url || null);
    setSetNewPhotoAsMain(false);
    setIsPhotoModalOpen(true);
  };

  const handlePhotoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!newPhotoTitle) {
        setNewPhotoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPhotoBase64(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoBase64) {
      alert('Please select an image file first.');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const endpoint = editingPhotoId ? `/api/gallery-photos/${editingPhotoId}` : '/api/gallery-photos';
      const method = editingPhotoId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPhotoTitle.trim() || 'Custom Photo',
          category: newPhotoCategory,
          imageBase64: newPhotoBase64.startsWith('data:') ? newPhotoBase64 : undefined,
          description: newPhotoDescription.trim() || 'Uploaded personal photo by Akash Kumar Tiwari.',
          location: newPhotoLocation.trim() || 'IIT Patna',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.photos) {
          setGalleryPhotos(data.photos);
          localStorage.setItem('akash_gallery_cache', JSON.stringify(data.photos));
        } else if (data.photo) {
          setGalleryPhotos((prev) => {
            const updated = prev.filter((p) => p.id !== data.photo.id);
            return [data.photo, ...updated];
          });
        }

        const photoUrl = data.photo?.url || newPhotoBase64;
        if (setNewPhotoAsMain && photoUrl) {
          localStorage.setItem('akash_hero_photo_v1', photoUrl);
          localStorage.setItem('akash_profile_photo_v5', photoUrl);
        }

        showToast(editingPhotoId ? 'Photo details updated successfully!' : 'Photo added to gallery successfully!');
        setIsPhotoModalOpen(false);
      } else {
        showToast('Error saving photo.');
      }
    } catch (err) {
      console.warn('Network issue saving photo', err);
      showToast('Error saving photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/gallery-photos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (data.photos) {
          setGalleryPhotos(data.photos);
          localStorage.setItem('akash_gallery_cache', JSON.stringify(data.photos));
        } else {
          setGalleryPhotos((prev) => {
            const updated = prev.filter((p) => p.id !== id);
            localStorage.setItem('akash_gallery_cache', JSON.stringify(updated));
            return updated;
          });
        }
        showToast(`Photo "${title}" deleted from gallery.`);
        return;
      }
    } catch (err) {
      console.warn('Error deleting photo:', err);
    }
    setGalleryPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('akash_gallery_cache', JSON.stringify(updated));
      return updated;
    });
    showToast(`Photo "${title}" deleted from gallery.`);
  };

  const handleAdminPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          try {
            const res = await fetch('/api/gallery-photos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                category: 'Custom Uploads',
                imageBase64: base64,
                description: 'Uploaded from Secret Admin Portal by Akash Tiwari.',
                location: 'IIT Patna',
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.photos) {
                setGalleryPhotos(data.photos);
                localStorage.setItem('akash_gallery_cache', JSON.stringify(data.photos));
              }
              showToast('Photo uploaded and added to gallery!');
            }
          } catch {
            showToast('Photo uploaded locally.');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetMainPhotoAdmin = (photoUrl: string) => {
    localStorage.setItem('akash_hero_photo_v1', photoUrl);
    localStorage.setItem('akash_profile_photo_v5', photoUrl);
    showToast('Main profile portrait updated across entire website!');
  };

  // -------------------------------------------------------------
  // RENDER: LOGIN GATE IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
        {/* Subtle Cyber Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Back Button */}
        <button
          onClick={handleExitToPortfolio}
          className="absolute top-6 left-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors z-20"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Portfolio</span>
        </button>

        {/* Cyber Security Login Card */}
        <div className="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl p-8 sm:p-10 z-10">
          {/* Top Lock Icon Badge */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-950 to-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20">
                <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>CYPHER MONK // ROOT VERIFICATION</span>
            </div>

            <h1 className="text-2xl font-display font-black tracking-tight text-white">
              Secret Admin Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Restricted management gateway for <strong>Akash Kumar Tiwari</strong>. Verify your credentials to edit skills, projects, and portfolio details.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Security Key / Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secret security key..."
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-950/90 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 font-bold font-mono text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50 mt-2"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Root Access...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-slate-950" />
                  <span>Verify & Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Secured Root Gateway &bull; IIT Patna CS & Cybersecurity</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: FULL ADMIN MANAGEMENT PORTAL
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 shadow-2xl backdrop-blur-md text-xs font-mono animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExitToPortfolio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white tracking-wide">
                    ADMIN PORTAL
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ROOT ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={async () => {
                const ok = await saveAllChanges();
                if (ok) showToast('All edits permanently saved & synced live!');
                else showToast('Changes saved to local storage.');
              }}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save & Sync Live'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors hidden sm:flex"
              title="Open Public Portfolio in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Logout / Lock Admin Panel"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs - Inquiries, AI Chat Logs and CV/Resume are brought to the very front */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-900 pt-2">
          {[
            {
              id: 'inquiries',
              label: `Inquiries & Messages (${totalUnreadMessages > 0 ? `${totalUnreadMessages} New` : contactMessages.length})`,
              icon: Mail,
              hasBadge: totalUnreadMessages > 0,
              highlight: true,
            },
            {
              id: 'terminal',
              label: `AI Chat & Terminal Logs (${terminalLogs.length})`,
              icon: Terminal,
              highlight: true,
            },
            {
              id: 'cv_resume',
              label: `CV & Resume (${cvResumeItems.length})`,
              icon: FileText,
              highlight: true,
            },
            {
              id: 'deploy_sync',
              label: 'Render & GitHub Auto-Sync',
              icon: CloudUpload,
              highlight: true,
            },
            {
              id: 'media',
              label: 'Media & Social Channels',
              icon: Share2,
            },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: 'skills', label: `Skills & Tools (${skills.length})`, icon: Wrench },
            { id: 'certifications', label: `Certificates (${certifications.length})`, icon: Award },
            { id: 'book', label: `Books & Publications (${books.length})`, icon: BookOpen },
            { id: 'photos', label: `Photos & Gallery (${galleryPhotos.length})`, icon: ImageIcon },
            { id: 'personal', label: 'Personal Info & Links', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'inquiries' && !selectedSenderEmail && groupedInquiries.length > 0) {
                    handleSelectSender(groupedInquiries[0].senderEmail);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 whitespace-nowrap transition-all relative ${
                  isActive
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400 font-bold shadow-sm shadow-cyan-500/20'
                    : tab.highlight
                    ? 'text-slate-200 bg-slate-900/90 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {(tab as any).hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Management Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ========================================================
            TAB 1: PROJECTS MANAGEMENT
        ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-cyan-400" />
                  <span>Projects & Research Work</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add new projects, update existing ones, or remove old entries. All changes reflect instantly on the public website.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* View Switcher */}
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setProjectRepoViewMode('github')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      projectRepoViewMode === 'github'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>GitHub View</span>
                  </button>
                  <button
                    onClick={() => setProjectRepoViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      projectRepoViewMode === 'cards'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Cards View</span>
                  </button>
                </div>

                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {/* Projects List - GitHub Style vs Cards */}
            {projectRepoViewMode === 'github' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => {
                  const slug =
                    proj.repoName ||
                    proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] transition-all flex flex-col justify-between space-y-3.5 group shadow-lg"
                    >
                      <div className="space-y-2.5">
                        {/* GitHub Header: User / Repo + Public Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <FolderGit2 className="w-4 h-4 text-[#7d8590]" />
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-[#58a6ff] hover:underline font-mono"
                            >
                              akashkumartiwariofficial-boop /{' '}
                              <span className="font-bold text-white">{slug}</span>
                            </a>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-[#30363d] text-[#7d8590] font-medium">
                              Public
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded-md bg-[#21262d] border border-[#30363d] text-[11px] font-mono text-[#c9d1d9] flex items-center gap-1">
                              <Star className="w-3 h-3 text-[#e3b341] fill-[#e3b341]" />
                              <span>{proj.stars || 28}</span>
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed">
                          {proj.description || proj.summary}
                        </p>

                        {/* Badges for photo/video if present */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {proj.imageUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                              <ImageIcon className="w-3 h-3 text-emerald-400" />
                              <span>Screenshot Attached</span>
                            </span>
                          )}
                          {proj.videoUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                              <Video className="w-3 h-3 text-cyan-400" />
                              <span>Demo Video Attached</span>
                            </span>
                          )}
                        </div>

                        {/* GitHub Meta footer: Language dot, Forks, License, Branch */}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#7d8590] pt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-[#3572A5]" />
                            <span className="text-[#c9d1d9] font-medium">
                              {proj.technologies[0] || 'Python'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            <span>{proj.forks || 6}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span>⚖️</span>
                            <span>{proj.license || 'MIT'}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-[#8b949e]">
                            <GitBranch className="w-3 h-3" />
                            <span>{proj.defaultBranch || 'main'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#7d8590]">
                          Updated {proj.date}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditProject(proj)}
                            className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-mono flex items-center gap-1 border border-[#30363d] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Edit Spec & Media</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                          {proj.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{proj.date}</span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {proj.imageUrl && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                            <ImageIcon className="w-3 h-3" />
                            <span>Photo</span>
                          </span>
                        )}
                        {proj.videoUrl && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.slice(0, 4).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditProject(proj)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: SKILLS & TOOLS MANAGEMENT
        ======================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-cyan-400" />
                  <span>Technical Skills & Tooling (Burp Suite, Nmap, Kali, etc.)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage penetration testing tools, languages, and systems. Add any new tools as your expertise grows.
                </p>
              </div>

              <button
                onClick={handleOpenAddSkill}
                className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Skill / Tool</span>
              </button>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        {s.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                        {s.level}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{s.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{s.associatedOrg}</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditSkill(s)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id, s.name)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: CERTIFICATIONS MANAGEMENT
        ======================================================== */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>Certifications & Verified Credentials</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add new credentials, edit issuing authorities, or remove old certifications.
                </p>
              </div>

              <button
                onClick={handleOpenAddCert}
                className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certification</span>
              </button>
            </div>

            {/* Certifications List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                      <span>{c.issuer}</span>
                      <span className="text-slate-400">{c.issuedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>

                    {c.credentialId && (
                      <p className="text-[11px] font-mono text-slate-400">
                        ID: <span className="text-slate-200">{c.credentialId}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.skillsCovered.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditCert(c)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCert(c.id, c.title)}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PERSONAL INFO & SOCIAL LINKS
        ======================================================== */}
        {activeTab === 'personal' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <span>Personal Bio & Official Profile Links</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Edit your display name, official emails, primary title, location, and profiles on GitHub, Hack The Box, and LinkedIn.
              </p>
            </div>

            <form onSubmit={handleSavePersonalInfo} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Academic Institution
                  </label>
                  <input
                    type="text"
                    value={personalForm.institute}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, institute: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Headline / Tagline
                </label>
                <input
                  type="text"
                  value={personalForm.title}
                  onChange={(e) => setPersonalForm({ ...personalForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Primary Official Email (Admin & Contact)
                  </label>
                  <input
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={personalForm.location}
                    onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Short Intro</label>
                <textarea
                  rows={2}
                  value={personalForm.shortIntro}
                  onChange={(e) =>
                    setPersonalForm({ ...personalForm, shortIntro: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3">Official Social & CTF Profiles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={personalForm.social.github}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          social: { ...personalForm.social, github: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Hack The Box Profile URL
                    </label>
                    <input
                      type="url"
                      value={personalForm.social.hackthebox}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          social: { ...personalForm.social, hackthebox: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={personalForm.social.linkedin}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          social: { ...personalForm.social, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      TryHackMe URL
                    </label>
                    <input
                      type="url"
                      value={personalForm.social.tryhackme}
                      onChange={(e) =>
                        setPersonalForm({
                          ...personalForm,
                          social: { ...personalForm.social, tryhackme: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Personal Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 5: PHOTOS & GALLERY UPLOADS
        ======================================================== */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                  <span>Photo & Visual Asset Manager</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload new photos, set any portrait as the main profile picture across the site, or delete unwanted photos from the gallery.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleOpenAddPhotoModal}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>

                <button
                  onClick={() => photoUploadInputRef.current?.click()}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  title="Quick direct image upload"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Quick Upload</span>
                </button>

                <a
                  href="#gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '#gallery';
                    window.location.reload();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center gap-1.5 transition-colors shrink-0"
                  title="View public live gallery page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Gallery</span>
                </a>

                <input
                  ref={photoUploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAdminPhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Gallery Photos Grid */}
            {galleryPhotos.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Photos in Gallery</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click &quot;Add Photo&quot; above to upload portraits and images to your public gallery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                        {photo.category}
                      </div>

                      {/* Quick Delete overlay badge */}
                      <button
                        onClick={() => handleDeletePhoto(photo.id, photo.title)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{photo.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {photo.location || 'IIT Patna'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleSetMainPhotoAdmin(photo.url)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors flex-1 text-center"
                        title="Set as main profile photo on hero & header"
                      >
                        Set Main Profile
                      </button>

                      <button
                        onClick={() => handleOpenEditPhotoModal(photo)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit photo details & category"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                      </button>

                      <button
                        onClick={() => handleDeletePhoto(photo.id, photo.title)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors"
                        title="Delete this photo from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>

                      <a
                        href={photo.url}
                        download
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Download Photo"
                      >
                        <Upload className="w-3.5 h-3.5 rotate-180" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: BOOKS & PUBLICATIONS MANAGEMENT
        ======================================================== */}
        {activeTab === 'book' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>Books & Publications ({books.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your authored books, cover/title photos, Amazon and Flipkart links. All changes reflect instantly on the public website.
                </p>
              </div>

              <button
                onClick={handleOpenAddBook}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Book</span>
              </button>
            </div>

            {/* Books List */}
            {books.length === 0 ? (
              <div className="py-16 text-center p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Books in Library</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You can add your published books and monographs by clicking &quot;Add More Book&quot; above.
                </p>
                <button
                  onClick={handleOpenAddBook}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-mono font-bold"
                >
                  Add First Book
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {books.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col md:flex-row gap-6 items-start"
                  >
                    {/* Book Cover / Title Photo Thumbnail */}
                    <div className="w-full sm:w-48 max-w-[200px] shrink-0 mx-auto md:mx-0">
                      <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
                        <img
                          src={b.coverImage || '/src/assets/images/book_cover_1790795224241.jpg'}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleOpenEditBook(b)}
                            className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-mono font-bold"
                          >
                            Change Title Photo
                          </button>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-center block text-slate-500 mt-2">
                        Cover / Title Photo
                      </span>
                    </div>

                    {/* Book Metadata & Info */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                          {b.status || 'Published Book'}
                        </span>

                        <span className="text-xs font-mono text-amber-400 font-semibold">
                          {b.publisher || 'Bookspot Publishers'} &bull; {b.publishedDate || '2025'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                          {b.title}
                        </h3>
                        {b.subtitle && (
                          <p className="text-xs sm:text-sm text-slate-300 font-serif italic mt-0.5">
                            {b.subtitle}
                          </p>
                        )}
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Author: <span className="text-slate-200">{b.author || 'Akash Tiwari'}</span>
                        </p>
                      </div>

                      {b.synopsis && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {b.synopsis}
                        </p>
                      )}

                      {/* Store Links */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {b.amazonUrl ? (
                          <a
                            href={b.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono flex items-center gap-1 hover:bg-amber-500/30 transition-colors"
                          >
                            <span>Amazon Store</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">No Amazon link</span>
                        )}

                        {b.flipkartUrl ? (
                          <a
                            href={b.flipkartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono flex items-center gap-1 hover:bg-sky-500/30 transition-colors"
                          >
                            <span>Flipkart Store</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">No Flipkart link</span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditBook(b)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit Details & Photo</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBook(b.id, b.title)}
                          className="px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>Delete Book</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 7: AI CHAT & TERMINAL CONVERSATION LOGS
        ======================================================== */}
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Cyberpunk AI (ChatGPT & Gemini) Chat Logs</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Live multi-turn conversation logs and queries submitted to Cyberpunk AI by visitors and recruiters.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadTerminalLogs}
                  disabled={isLoadingLogs}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  title="Refresh AI logs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh</span>
                </button>

                {terminalLogs.length > 0 && (
                  <button
                    onClick={handleClearTerminalLogs}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Clear All Logs</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search visitor queries, AI answers, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Logs List */}
            {terminalLogs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No AI Terminal Logs Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When visitors ask Cypher Monk AI questions about your projects, skills, or book, every query and response will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {terminalLogs
                  .filter(
                    (l) =>
                      !logSearch.trim() ||
                      l.userQuery.toLowerCase().includes(logSearch.toLowerCase()) ||
                      l.aiResponse.toLowerCase().includes(logSearch.toLowerCase())
                  )
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-slate-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300">
                          {log.status || 'ACTIVE-AI'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                          Visitor Prompt / Query
                        </span>
                        <p className="text-xs font-mono text-white font-medium flex items-start gap-2">
                          <span className="text-cyan-400 select-none">$</span>
                          <span>{log.userQuery}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Cyberpunk AI Assistant Response
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {log.aiResponse}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB: CV & RESUME MANAGEMENT
        ======================================================== */}
        {activeTab === 'cv_resume' && (
          <div className="space-y-6">
            {/* Header & Actions Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <span>CV & Resume Document Portals</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {cvResumeItems.length} Uploaded
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Upload Curriculum Vitae (CV) and Technical Resume separately. Visitors can download your verified files instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadCVResumeItems}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Refresh</span>
                </button>

                {cvResumeItems.length > 0 && (
                  <button
                    onClick={handleDeleteAllCVItems}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Delete all previous documents"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Old Documents</span>
                  </button>
                )}
              </div>
            </div>

            {/* TWO DEDICATED UPLOAD PORTALS (CV & RESUME) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PORTAL 1: UPLOAD CURRICULUM VITAE (CV) */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border-2 border-cyan-500/40 space-y-4 shadow-xl shadow-cyan-950/40 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-display">
                          Upload Curriculum Vitae (CV)
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">Academic & Research Profile</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                      Portal 1 (CV)
                    </span>
                  </div>

                  <form onSubmit={handleUploadCVSubmit} className="space-y-3.5">
                    {/* CV File Dropzone */}
                    <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-xl p-5 text-center bg-slate-950/60 transition-colors">
                      <input
                        ref={cvFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedCVFile(file);
                          if (file && !cvUploadTitle) {
                            setCvUploadTitle(`Akash Kumar Tiwari - ${file.name.replace(/\.[^/.]+$/, '')}`);
                          }
                        }}
                        className="hidden"
                        id="cv-upload-input-file"
                      />
                      <label htmlFor="cv-upload-input-file" className="cursor-pointer block space-y-1.5">
                        <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-mono text-slate-300">
                          {selectedCVFile ? (
                            <span className="text-cyan-400 font-bold">Selected: {selectedCVFile.name} ({(selectedCVFile.size / 1024).toFixed(1)} KB)</span>
                          ) : (
                            <span>Choose CV File to Upload (PDF, DOCX)</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">Curriculum Vitae Document (Up to 25MB)</p>
                      </label>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">CV Title</label>
                      <input
                        type="text"
                        value={cvUploadTitle}
                        onChange={(e) => setCvUploadTitle(e.target.value)}
                        placeholder="e.g. Akash Kumar Tiwari - Cybersecurity Researcher CV"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                        <select
                          value={cvUploadCategory}
                          onChange={(e) => setCvUploadCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                        >
                          <option value="Cybersecurity & AI">Cybersecurity & AI</option>
                          <option value="Academic & Research">Academic & Research</option>
                          <option value="Full Profile">Comprehensive CV</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Version</label>
                        <input
                          type="text"
                          value={cvUploadVersion}
                          onChange={(e) => setCvUploadVersion(e.target.value)}
                          placeholder="e.g. 2026.1"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploadingCV || !selectedCVFile}
                      className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Upload className={`w-3.5 h-3.5 ${isUploadingCV ? 'animate-bounce' : ''}`} />
                      <span>{isUploadingCV ? 'Uploading CV...' : 'Upload CV Document'}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* PORTAL 2: UPLOAD TECHNICAL RESUME */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border-2 border-blue-500/40 space-y-4 shadow-xl shadow-blue-950/40 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white font-display">
                          Upload Technical Resume
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">Industry & Engineering Summary</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">
                      Portal 2 (Resume)
                    </span>
                  </div>

                  <form onSubmit={handleUploadResumeSubmit} className="space-y-3.5">
                    {/* Resume File Dropzone */}
                    <div className="border-2 border-dashed border-slate-700 hover:border-blue-400/60 rounded-xl p-5 text-center bg-slate-950/60 transition-colors">
                      <input
                        ref={resumeFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedResumeFile(file);
                          if (file && !resumeUploadTitle) {
                            setResumeUploadTitle(`Akash Kumar Tiwari - ${file.name.replace(/\.[^/.]+$/, '')}`);
                          }
                        }}
                        className="hidden"
                        id="resume-upload-input-file"
                      />
                      <label htmlFor="resume-upload-input-file" className="cursor-pointer block space-y-1.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-mono text-slate-300">
                          {selectedResumeFile ? (
                            <span className="text-blue-400 font-bold">Selected: {selectedResumeFile.name} ({(selectedResumeFile.size / 1024).toFixed(1)} KB)</span>
                          ) : (
                            <span>Choose Resume File to Upload (PDF, DOCX)</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">Technical Resume Document (Up to 25MB)</p>
                      </label>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Resume Title</label>
                      <input
                        type="text"
                        value={resumeUploadTitle}
                        onChange={(e) => setResumeUploadTitle(e.target.value)}
                        placeholder="e.g. Akash Kumar Tiwari - AI Systems & Software Resume"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                        <select
                          value={resumeUploadCategory}
                          onChange={(e) => setResumeUploadCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-400 font-mono"
                        >
                          <option value="Software Engineering & AI">Software Engineering & AI</option>
                          <option value="Cybersecurity & Pentesting">Cybersecurity & Pentesting</option>
                          <option value="General Technical">General Technical</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-400 block mb-1">Version</label>
                        <input
                          type="text"
                          value={resumeUploadVersion}
                          onChange={(e) => setResumeUploadVersion(e.target.value)}
                          placeholder="e.g. 2026.1"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploadingResume || !selectedResumeFile}
                      className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Upload className={`w-3.5 h-3.5 ${isUploadingResume ? 'animate-bounce' : ''}`} />
                      <span>{isUploadingResume ? 'Uploading Resume...' : 'Upload Resume Document'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Active Stored Documents Registry */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Currently Active Uploaded Documents ({cvResumeItems.length})</span>
                </h3>
                {cvResumeItems.length === 0 && (
                  <span className="text-xs font-mono text-slate-500">No documents uploaded yet.</span>
                )}
              </div>

              {cvResumeItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-mono text-slate-400">
                    No files in registry. Use the upload portals above to upload your latest CV and Resume files.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cvResumeItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl bg-slate-900/90 border transition-all space-y-3 flex flex-col justify-between ${
                        item.type === 'cv' ? 'border-cyan-500/50 shadow-md shadow-cyan-950/40' : 'border-blue-500/50 shadow-md shadow-blue-950/40'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                              item.type === 'cv' ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400' : 'bg-blue-950/80 border-blue-500/40 text-blue-400'
                            }`}>
                              {item.type === 'cv' ? <GraduationCap className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                                item.type === 'cv' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                              }`}>
                                {item.type === 'cv' ? 'Curriculum Vitae (CV)' : 'Technical Resume'}
                              </span>
                              <h4 className="font-bold text-white text-sm mt-0.5">{item.title}</h4>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteCVItem(item.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 cursor-pointer"
                            title="Delete this document"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                          <span>File: <strong className="text-white">{item.fileName}</strong></span>
                          <span>•</span>
                          <span>Size: <strong className="text-white">{item.fileSize}</strong></span>
                          <span>•</span>
                          <span>Version: <strong className="text-white">{item.version}</strong></span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <Check className="w-3 h-3" />
                          <span>Active for Visitor Download</span>
                        </span>

                        <a
                          href={item.fileBase64 || item.downloadUrl || '#'}
                          download={item.fileName || `Akash_Kumar_Tiwari_${item.type}.pdf`}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
                        >
                          <Download className="w-3 h-3 text-cyan-400" />
                          <span>Download File</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: RENDER & GITHUB AUTO-SYNC CONTROL CENTER
        ======================================================== */}
        {activeTab === 'deploy_sync' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Render & GitHub Continuous Deployment Engine</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center gap-3">
                    <CloudUpload className="w-8 h-8 text-cyan-400" />
                    <span>Render + GitHub Auto-Sync System</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Jab bhi aap Admin Portal me koi photo upload karenge, project add karenge, ya information change karenge, to yeh system aapke badlav ko <strong>GitHub Repository</strong> par auto-commit & push kar dega, jisse <strong>Render</strong> automatically naye changes ke saath website ko live re-deploy kar dega!
                  </p>
                </div>

                {/* Quick Deploy Button Card */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-left shrink-0 space-y-3 min-w-[260px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">Deployment Status</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Sync Active
                    </span>
                  </div>

                  <button
                    onClick={handleManualSyncNow}
                    disabled={isSyncingDeploy}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingDeploy ? 'animate-spin' : ''}`} />
                    <span>{isSyncingDeploy ? 'Syncing & Building...' : 'Push to GitHub & Render Now'}</span>
                  </button>

                  {deployConfig.lastSyncTime && (
                    <div className="text-[11px] font-mono text-slate-400 text-center">
                      Last Sync: {new Date(deployConfig.lastSyncTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {syncStatusMsg && (
              <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            {/* Configuration Form */}
            <form onSubmit={handleSaveDeployConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Render Deploy Hook Settings */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>1. Render Deploy Hook URL (Immediate Auto-Rebuild)</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Render me apne service ke Settings -&gt; <strong>Deploy Hook</strong> se URL copy karke yahan paste karein. Isse Admin Portal me save karte hi Render bina wait kiye live build shuru kar dega.
                </p>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5">
                    Render Deploy Hook URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.render.com/deploy/srv-xxxx?key=yyyy"
                    value={deployConfig.renderDeployHookUrl || ''}
                    onChange={(e) => setDeployConfig({ ...deployConfig, renderDeployHookUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="text-cyan-300 font-bold">How to get Render Deploy Hook URL:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Go to your Render Dashboard (dashboard.render.com).</li>
                    <li>Open your Web Service &gt; Settings.</li>
                    <li>Scroll down to "Deploy Hook" and click "Create Deploy Hook".</li>
                    <li>Copy the URL and paste it above!</li>
                  </ol>
                </div>
              </div>

              {/* Card 2: GitHub Repository & PAT Token */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <span>2. GitHub Repository & Token Sync</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Yahan apna GitHub Repository aur Personal Access Token (PAT) dalein taaki photos, gallery JSON, aur portfolio settings sidhe aapke GitHub Repo me commit & push ho sakein.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1.5">GitHub Repository</label>
                    <input
                      type="text"
                      placeholder="akashkumartiwariofficial-boop/my-repo"
                      value={deployConfig.githubRepo || ''}
                      onChange={(e) => setDeployConfig({ ...deployConfig, githubRepo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1.5">Branch</label>
                    <input
                      type="text"
                      placeholder="main"
                      value={deployConfig.githubBranch || 'main'}
                      onChange={(e) => setDeployConfig({ ...deployConfig, githubBranch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={deployConfig.githubToken || ''}
                    onChange={(e) => setDeployConfig({ ...deployConfig, githubToken: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Create a token on GitHub: Settings &gt; Developer settings &gt; Personal access tokens &gt; Tokens (classic) with 'repo' scope.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deployConfig.autoSyncEnabled}
                      onChange={(e) => setDeployConfig({ ...deployConfig, autoSyncEnabled: e.target.checked })}
                      className="rounded bg-slate-950 border-slate-800 text-cyan-400 focus:ring-0"
                    />
                    <span>Auto-Sync on Every Edit / Photo Upload</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSavingDeployConfig}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingDeployConfig ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Sync Logs Display */}
            {deployConfig.lastSyncLog && (
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Latest Deployment & GitHub Push Logs</span>
                </h4>
                <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800/80 max-h-48">
                  {deployConfig.lastSyncLog}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB: MEDIA & SOCIAL CHANNELS MANAGEMENT
        ======================================================== */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-cyan-400" />
                  <span>Media & Social Media Channel Links</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage URLs and profiles for X (Twitter), YouTube, Instagram, Reddit, Flipkart, Amazon, Telegram, Discord, Facebook, Medium, Substack, LinkedIn, GitHub, TryHackMe, and Hack The Box.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={personalInfo.social.linkedin || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={personalInfo.social.github || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, github: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">X (Twitter) URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).twitter || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, twitter: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).youtube || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, youtube: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).instagram || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, instagram: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Reddit URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).reddit || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, reddit: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Flipkart Store URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).flipkart || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, flipkart: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Amazon Bookstore URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).amazon || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, amazon: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Telegram URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).telegram || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, telegram: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Discord URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).discord || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, discord: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).facebook || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, facebook: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Medium URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).medium || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, medium: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Substack URL</label>
                  <input
                    type="url"
                    value={(personalInfo.social as any).substack || ''}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, substack: e.target.value } as any,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">TryHackMe Profile URL</label>
                  <input
                    type="url"
                    value={personalInfo.social.tryhackme}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, tryhackme: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Hack The Box Profile URL</label>
                  <input
                    type="url"
                    value={personalInfo.social.hackthebox}
                    onChange={(e) =>
                      updatePersonalInfo({
                        social: { ...personalInfo.social, hackthebox: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Add More Custom Link Section */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-display font-bold text-white">Add Custom Link</h3>
              </div>
              <p className="text-xs text-slate-400">
                Add any custom social link or external website URL to your profile.
              </p>

              <form onSubmit={handleAddCustomMedia} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Platform / Name</label>
                    <input
                      type="text"
                      required
                      value={newCustomPlatform}
                      onChange={(e) => setNewCustomPlatform(e.target.value)}
                      placeholder="e.g. Personal Blog"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Handle / Username</label>
                    <input
                      type="text"
                      value={newCustomHandle}
                      onChange={(e) => setNewCustomHandle(e.target.value)}
                      placeholder="e.g. @akash_blog"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Full URL</label>
                    <input
                      type="url"
                      required
                      value={newCustomUrl}
                      onChange={(e) => setNewCustomUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={newCustomBadge}
                      onChange={(e) => setNewCustomBadge(e.target.value)}
                      placeholder="e.g. Custom Link"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Short Description</label>
                    <input
                      type="text"
                      value={newCustomDesc}
                      onChange={(e) => setNewCustomDesc(e.target.value)}
                      placeholder="Brief description of this link..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Custom Link</span>
                  </button>
                </div>
              </form>

              {/* Added Custom Links List */}
              {Array.isArray((personalInfo as any).customMediaChannels) && (personalInfo as any).customMediaChannels.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-300">Added Custom Links:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {((personalInfo as any).customMediaChannels).map((c: any) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{c.platform}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">{c.badge}</span>
                          </div>
                          <p className="text-[10px] text-cyan-400 font-mono truncate">{c.url}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCustomMedia(c.id, c.platform)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors shrink-0"
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: GET IN TOUCH INQUIRIES & MESSAGES (GROUPED BY EMAIL)
        ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span>Get In Touch Inquiries & Queries</span>
                  </h2>
                  {totalUnreadMessages > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {totalUnreadMessages} NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Visitor messages received from the portfolio contact form, grouped by Sender Email ID into individual notification threads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadContactMessages}
                  disabled={isLoadingMessages}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  title="Check for new messages"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh</span>
                </button>

                {totalUnreadMessages > 0 && (
                  <button
                    onClick={handleMarkAllMessagesRead}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mark All Read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages by sender email, name, or subject..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {contactMessages.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Inquiries Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When a client or researcher sends a query through the &quot;Get in Touch&quot; form, each email ID will create a dedicated notification thread here.
                </p>
              </div>
            ) : (
              /* Two-Column Threaded Messaging View */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 5 Cols: Sender Email Notification Cards List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                    <span>Sender Email Threads ({groupedInquiries.length})</span>
                    <span>Sorted by Latest</span>
                  </div>

                  <div className="space-y-2">
                    {groupedInquiries
                      .filter(
                        (item) =>
                          !messageSearch.trim() ||
                          item.senderEmail.toLowerCase().includes(messageSearch.toLowerCase()) ||
                          item.senderName.toLowerCase().includes(messageSearch.toLowerCase()) ||
                          item.messages.some((m) =>
                            m.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
                            m.message.toLowerCase().includes(messageSearch.toLowerCase())
                          )
                      )
                      .map((thread) => {
                        const isSelected =
                          selectedSenderEmail?.toLowerCase() === thread.senderEmail.toLowerCase();
                        return (
                          <div
                            key={thread.senderEmail}
                            onClick={() => handleSelectSender(thread.senderEmail)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                              isSelected
                                ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/50'
                                : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                  <span>{thread.senderName}</span>
                                </h4>
                                <p className="text-xs font-mono text-cyan-400 break-all">
                                  {thread.senderEmail}
                                </p>
                              </div>

                              {thread.unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 flex items-center gap-1 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>{thread.unreadCount} NEW</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-cyan-400" />
                                <span>{thread.messages.length} {thread.messages.length === 1 ? 'query' : 'queries'}</span>
                              </span>
                              <span>{new Date(thread.latestTimestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Right 7 Cols: Selected Sender Conversation Thread & Action Drawer */}
                <div className="lg:col-span-7">
                  {selectedSenderEmail ? (
                    (() => {
                      const activeThread = groupedInquiries.find(
                        (t) => t.senderEmail.toLowerCase() === selectedSenderEmail.toLowerCase()
                      );
                      if (!activeThread) return null;

                      return (
                        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-4">
                          {/* Thread Top Header */}
                          <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-950 to-slate-900 border border-cyan-400 flex items-center justify-center text-cyan-400 font-bold font-mono text-base">
                                {activeThread.senderName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-white">
                                  {activeThread.senderName}
                                </h3>
                                <a
                                  href={`mailto:${activeThread.senderEmail}`}
                                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                                >
                                  <span>{activeThread.senderEmail}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Direct Mail Relay Active</span>
                              </span>

                              <button
                                onClick={() => handleDeleteSenderThread(activeThread.senderEmail)}
                                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors"
                                title="Delete Entire Thread"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                              </button>
                            </div>
                          </div>

                          {/* Messages & Direct Replies Conversation Stream */}
                          <div className="p-5 space-y-5 max-h-[480px] overflow-y-auto">
                            {activeThread.messages.map((msg) => (
                              <div key={msg.id} className="space-y-3">
                                {/* Visitor Inquiry Card */}
                                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 relative group">
                                  <div className="flex items-center justify-between text-xs font-mono">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold">
                                        {msg.subject || 'General Inquiry'}
                                      </span>
                                      <span className="text-[10px] text-slate-400">Visitor Message</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                                      <Clock className="w-3 h-3" />
                                      <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                      <button
                                        onClick={() => handleDeleteSingleMessage(msg.id)}
                                        className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                                        title="Delete this message"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/50">
                                    {msg.message}
                                  </div>
                                </div>

                                {/* Sent Replies by Admin for this Message / Thread */}
                                {msg.replies && msg.replies.length > 0 && (
                                  <div className="pl-6 space-y-2.5 border-l-2 border-cyan-500/40 ml-2">
                                    {msg.replies.map((rep) => (
                                      <div
                                        key={rep.id}
                                        className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 text-left"
                                      >
                                        <div className="flex items-center justify-between text-[11px] font-mono">
                                          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Direct Reply Sent to {rep.toEmail}</span>
                                          </div>
                                          <span className="text-slate-400">
                                            {new Date(rep.timestamp).toLocaleString()}
                                          </span>
                                        </div>

                                        <p className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                                          {rep.message}
                                        </p>

                                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                                          <span>Dispatched by {rep.sender}</span>
                                          <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                            DELIVERED TO MAIL
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Direct In-App Reply Box */}
                          <div className="p-5 bg-slate-950/90 border-t border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Send className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                  Direct Reply to {activeThread.senderEmail}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                Direct Email
                              </span>
                            </div>

                            {/* Quick Response Templates */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                              <span className="text-[10px] font-mono text-slate-400 shrink-0">Quick Templates:</span>
                              {[
                                {
                                  label: '⚡ Thanks for connecting',
                                  text: `Hi ${activeThread.senderName},\n\nThank you for reaching out! I appreciate your message and would love to discuss this further. Let me know what specific details you would like to explore.\n\nBest regards,\nAkash Kumar Tiwari\nIIT Patna`,
                                },
                                {
                                  label: '💼 Project / Collaboration',
                                  text: `Hi ${activeThread.senderName},\n\nThank you for your interest in my cybersecurity research and AI projects. I am actively open for collaborations, research opportunities, and exciting tech initiatives.\n\nLooking forward to speaking soon,\nAkash Kumar Tiwari\nIIT Patna`,
                                },
                                {
                                  label: '📖 Book Discussion',
                                  text: `Hi ${activeThread.senderName},\n\nThank you for your interest in "The Civic Sense of Indian People". It covers civic responsibility, public etiquette, and tech ethics in contemporary India. The book is available on Flipkart & Amazon.\n\nWarm regards,\nAkash Tiwari`,
                                },
                              ].map((tmpl, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setDirectReplyText(tmpl.text)}
                                  className="px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-800 hover:border-cyan-500/40 shrink-0 transition-colors"
                                >
                                  {tmpl.label}
                                </button>
                              ))}
                            </div>

                            {/* Subject & Reply Form */}
                            <form onSubmit={handleSendDirectReply} className="space-y-2.5">
                              <div>
                                <input
                                  type="text"
                                  value={directReplySubject}
                                  onChange={(e) => setDirectReplySubject(e.target.value)}
                                  placeholder={`Subject: Re: ${activeThread.messages[0]?.subject || 'Inquiry on Akash Tiwari Portfolio'}`}
                                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                                />
                              </div>

                              <div className="relative">
                                <textarea
                                  rows={4}
                                  required
                                  value={directReplyText}
                                  onChange={(e) => setDirectReplyText(e.target.value)}
                                  placeholder={`Write your direct reply to ${activeThread.senderName} (${activeThread.senderEmail})... This reply will be dispatched directly to their email.`}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans resize-none leading-relaxed"
                                />
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                                <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Replies directly to: <strong>{activeThread.senderEmail}</strong></span>
                                </p>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <button
                                    type="submit"
                                    disabled={isSendingDirectReply || !directReplyText.trim()}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
                                  >
                                    {isSendingDirectReply ? (
                                      <>
                                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                                        <span>Dispatching to Mail...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4 text-slate-950" />
                                        <span>Send Direct Reply to Mail</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-2">
                      <Mail className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">
                        Select an email notification thread from the left column to view messages and send direct replies.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: ADD / EDIT PROJECT
      ======================================================== */}
      {(isAddingProject || editingProject) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => {
            setIsAddingProject(false);
            setEditingProject(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                <span>{editingProject ? 'Edit Project' : 'Add New Project'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddingProject(false);
                  setEditingProject(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Distributed AI Threat Detection Engine"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                  <select
                    value={projectForm.category || 'Cybersecurity'}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="AI & Security">AI & Security</option>
                    <option value="Tools & Automation">Tools & Automation</option>
                    <option value="CTF & Pentesting">CTF & Pentesting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Year / Date</label>
                  <input
                    type="text"
                    value={projectForm.date || '2026'}
                    onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Summary</label>
                <input
                  type="text"
                  value={projectForm.summary || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                  placeholder="Brief one-line summary..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Detailed architectural and security explanation..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Technologies (e.g. Python, Kali, Rust, Scapy)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Add technology..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (techInput.trim()) {
                        setProjectForm({
                          ...projectForm,
                          technologies: [...(projectForm.technologies || []), techInput.trim()],
                        });
                        setTechInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(projectForm.technologies || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setProjectForm({
                            ...projectForm,
                            technologies: (projectForm.technologies || []).filter((_, i) => i !== idx),
                          })
                        }
                        className="text-slate-500 hover:text-rose-400"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub Repository Metadata Configuration */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>GitHub Repository Spec</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Public Repo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      Repository Name (Slug)
                    </label>
                    <input
                      type="text"
                      value={projectForm.repoName || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, repoName: e.target.value })}
                      placeholder="e.g. ai-threat-detection"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.githubUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/akashkumartiwariofficial-boop/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Stars Count (★)
                    </label>
                    <input
                      type="number"
                      value={projectForm.stars ?? 28}
                      onChange={(e) => setProjectForm({ ...projectForm, stars: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                      Forks Count (🔀)
                    </label>
                    <input
                      type="number"
                      value={projectForm.forks ?? 6}
                      onChange={(e) => setProjectForm({ ...projectForm, forks: parseInt(e.target.value) || 0 })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">License</label>
                    <input
                      type="text"
                      value={projectForm.license || 'MIT'}
                      onChange={(e) => setProjectForm({ ...projectForm, license: e.target.value })}
                      placeholder="MIT"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Branch</label>
                    <input
                      type="text"
                      value={projectForm.defaultBranch || 'main'}
                      onChange={(e) => setProjectForm({ ...projectForm, defaultBranch: e.target.value })}
                      placeholder="main"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Project Photo Upload (Optional) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Project Photo / Screenshot (Optional)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Optional</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center relative shadow-md">
                    {projectForm.imageUrl ? (
                      <img
                        src={projectForm.imageUrl}
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                    {isUploadingProjectPhoto && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-[10px] font-mono text-cyan-400">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <p className="text-[11px] text-slate-300">
                      Upload an architecture diagram, interface screenshot, or demo banner.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => projectPhotoInputRef.current?.click()}
                        disabled={isUploadingProjectPhoto}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>

                      {projectForm.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setProjectForm({ ...projectForm, imageUrl: '' })}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950/50 text-rose-300 text-xs font-mono"
                        >
                          Remove
                        </button>
                      )}

                      <input
                        ref={projectPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProjectPhotoUpload}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="text"
                      value={projectForm.imageUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      placeholder="Or enter image URL / asset path..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Project Video Upload (Optional) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Project Demo Video (Optional)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Optional</span>
                </div>

                <div className="space-y-3">
                  {projectForm.videoUrl ? (
                    <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 max-h-48 relative">
                      <video
                        src={projectForm.videoUrl}
                        controls
                        className="w-full max-h-48 object-contain bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => setProjectForm({ ...projectForm, videoUrl: '' })}
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-rose-950/80 text-rose-300 text-[10px] font-mono"
                      >
                        Remove Video
                      </button>
                    </div>
                  ) : null}

                  <p className="text-[11px] text-slate-300">
                    Upload an MP4 / WebM recording showing tool execution, exploit flow, or terminal demo.
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => projectVideoInputRef.current?.click()}
                      disabled={isUploadingProjectVideo}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Video</span>
                    </button>

                    <input
                      ref={projectVideoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleProjectVideoUpload}
                      className="hidden"
                    />
                  </div>

                  <input
                    type="text"
                    value={projectForm.videoUrl || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
                    placeholder="Or enter direct video URL (e.g. /src/assets/videos/... or MP4 link)..."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProject(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT SKILL
      ======================================================== */}
      {(isAddingSkill || editingSkill) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => {
            setIsAddingSkill(false);
            setEditingSkill(null);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>{editingSkill ? 'Edit Skill / Tool' : 'Add Skill / Tool'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddingSkill(false);
                  setEditingSkill(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Tool / Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.name || ''}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. Burp Suite, Wireshark, Metasploit, Rust"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                  <select
                    value={skillForm.category || 'security'}
                    onChange={(e) =>
                      setSkillForm({ ...skillForm, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="security">Security & Pentesting</option>
                    <option value="programming">Programming & Dev</option>
                    <option value="networking">Networking & Protocol</option>
                    <option value="ai">AI & Threat Defense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Proficiency</label>
                  <select
                    value={skillForm.level || 'Advanced'}
                    onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Core Focus">Core Focus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={skillForm.description || ''}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  placeholder="How you use this tool in cybersecurity or development..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSkill(false);
                    setEditingSkill(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT CERTIFICATION
      ======================================================== */}
      {(isAddingCert || editingCert) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => {
            setIsAddingCert(false);
            setEditingCert(null);
          }}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>{editingCert ? 'Edit Certification' : 'Add Certification'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddingCert(false);
                  setEditingCert(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  required
                  value={certForm.title || ''}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. Certified Cybersecurity Assessment Specialist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.issuer || ''}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. IIT Patna / Coursera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Issued Date</label>
                  <input
                    type="text"
                    value={certForm.issuedDate || '2026'}
                    onChange={(e) => setCertForm({ ...certForm, issuedDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={certForm.credentialId || ''}
                  onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                  placeholder="e.g. HTB-SEC-99214"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={certForm.description || ''}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Certificate Photo Upload (Optional) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Certificate Photo / Document (Optional)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Optional</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center relative shadow-md">
                    {certForm.imageUrl ? (
                      <img
                        src={certForm.imageUrl}
                        alt="Cert Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Award className="w-6 h-6 text-slate-600" />
                    )}
                    {isUploadingCertPhoto && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-[9px] font-mono text-cyan-400">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => certPhotoInputRef.current?.click()}
                        disabled={isUploadingCertPhoto}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </button>

                      {certForm.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setCertForm({ ...certForm, imageUrl: '' })}
                          className="px-2 py-1 rounded-lg bg-rose-950/50 text-rose-300 text-[11px] font-mono"
                        >
                          Remove
                        </button>
                      )}

                      <input
                        ref={certPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCertPhotoUpload}
                        className="hidden"
                      />
                    </div>

                    <input
                      type="text"
                      value={certForm.imageUrl || ''}
                      onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                      placeholder="Or enter image URL / asset path..."
                      className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCert(false);
                    setEditingCert(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold font-mono text-xs"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================
          MODAL: ADD NEW GALLERY PHOTO
      ======================================================== */}
      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPhotoId ? 'Edit Photo Details' : 'Add Photo to Gallery'}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {editingPhotoId ? 'Update photo category, title, description, and location.' : 'Upload a high-resolution image with title and details.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Select Image File <span className="text-rose-400">*</span>
                </label>

                {newPhotoBase64 ? (
                  <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 aspect-video bg-slate-950 group">
                    <img
                      src={newPhotoBase64}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                      <button
                        type="button"
                        onClick={() => modalFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPhotoBase64(null)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/30 font-mono text-xs flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => modalFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 hover:bg-cyan-950/20 transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Click or drag image here to select</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}

                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileSelected}
                  className="hidden"
                />
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Photo Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="e.g. Executive Navy Suit Formal Portrait"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e) => setNewPhotoCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Formal">Formal</option>
                    <option value="Campus & IIT Patna">Campus & IIT Patna</option>
                    <option value="Tech & Research">Tech & Research</option>
                    <option value="Author & Achievements">Author & Achievements</option>
                    <option value="Custom Uploads">Custom Uploads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newPhotoLocation}
                    onChange={(e) => setNewPhotoLocation(e.target.value)}
                    placeholder="e.g. IIT Patna"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPhotoDescription}
                  onChange={(e) => setNewPhotoDescription(e.target.value)}
                  placeholder="Optional note about this photo, event, or context..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* Checkbox: Set as main photo */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={setNewPhotoAsMain}
                  onChange={(e) => setSetNewPhotoAsMain(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-xs text-slate-300">
                  Set as main profile photo on hero & website header immediately
                </span>
              </label>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPhoto || !newPhotoBase64}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  {isUploadingPhoto ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingPhotoId ? 'Save Changes' : 'Add to Gallery'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT BOOK (WITH TITLE PHOTO UPLOAD)
      ======================================================== */}
      {isBookModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setIsBookModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-display font-bold text-white">
                  {editingBook ? 'Edit Book & Cover' : 'Add More Book'}
                </h3>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4">
              {/* Cover / Title Photo Section */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="block text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Book Title Photo / Cover
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Thumbnail Preview */}
                  <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 flex items-center justify-center relative shadow-md">
                    {bookForm.coverImage ? (
                      <img
                        src={bookForm.coverImage}
                        alt="Book Title Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    )}
                    {isUploadingBookCover && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-[10px] font-mono text-amber-400">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <p className="text-xs text-slate-300">
                      Upload your book&apos;s title photo (PNG, JPG, SVG). It will display on the main website and store preview.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => bookCoverInputRef.current?.click()}
                        disabled={isUploadingBookCover}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Cover File</span>
                      </button>

                      <input
                        ref={bookCoverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBookCoverUpload}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        value={bookForm.coverImage || ''}
                        onChange={(e) => setBookForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="Or enter Image URL / Asset Path (e.g. /src/assets/images/...)"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Book Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookForm.title || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. The Civic Sense of Indian People"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={bookForm.subtitle || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g. An Honest Look at Our Habits and Responsibilities"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Author, Publisher & Published Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={bookForm.author || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="Akash Tiwari"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={bookForm.publisher || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, publisher: e.target.value }))}
                    placeholder="Bookspot Publishers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Published Date</label>
                  <input
                    type="text"
                    value={bookForm.publishedDate || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, publishedDate: e.target.value }))}
                    placeholder="8 October 2025"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Status Badge Text
                </label>
                <input
                  type="text"
                  value={bookForm.status || ''}
                  onChange={(e) => setBookForm((prev) => ({ ...prev, status: e.target.value }))}
                  placeholder="Published on 8 Oct 2025 · Available on Flipkart & Amazon"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Store Links: Amazon & Flipkart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Amazon Store Link
                  </label>
                  <input
                    type="url"
                    value={bookForm.amazonUrl || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, amazonUrl: e.target.value }))}
                    placeholder="https://amzn.in/d/0cj4pQPk"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Flipkart Store Link
                  </label>
                  <input
                    type="url"
                    value={bookForm.flipkartUrl || ''}
                    onChange={(e) => setBookForm((prev) => ({ ...prev, flipkartUrl: e.target.value }))}
                    placeholder="https://dl.flipkart.com/s/Iz0x8jNNNN"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Book Synopsis / Summary
                </label>
                <textarea
                  rows={3}
                  value={bookForm.synopsis || ''}
                  onChange={(e) => setBookForm((prev) => ({ ...prev, synopsis: e.target.value }))}
                  placeholder="A detailed reflection on contemporary Indian society, civic conscience, and public responsibility..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Author Note */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Author Note / Quote
                </label>
                <textarea
                  rows={2}
                  value={bookForm.authorNote || ''}
                  onChange={(e) => setBookForm((prev) => ({ ...prev, authorNote: e.target.value }))}
                  placeholder="“Civic sense is born out of voluntary empathy for the stranger sharing your road and nation.” — Akash Tiwari"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingBook ? 'Update Book' : 'Save Book'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
