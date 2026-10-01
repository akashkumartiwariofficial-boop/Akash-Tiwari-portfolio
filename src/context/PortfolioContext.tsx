import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  PERSONAL_INFO as defaultPersonalInfo,
  SKILLS_LIST as defaultSkillsList,
  PROJECTS as defaultProjects,
  CERTIFICATIONS as defaultCertifications,
  BOOK_DETAILS as defaultBookDetails,
  INITIAL_BOOKS as defaultBooks,
} from '../data/portfolioData';
import { ProjectItem, CertificationItem, SkillItem, BookItem } from '../types/portfolio';

const STORAGE_KEY = 'akash_portfolio_custom_v3';

interface PortfolioContextType {
  personalInfo: typeof defaultPersonalInfo;
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  books: BookItem[];
  bookDetails: BookItem;
  updatePersonalInfo: (info: Partial<typeof defaultPersonalInfo>) => void;
  addProject: (project: ProjectItem) => void;
  updateProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: SkillItem) => void;
  updateSkill: (skill: SkillItem) => void;
  deleteSkill: (id: string) => void;
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (cert: CertificationItem) => void;
  deleteCertification: (id: string) => void;
  addBook: (book: BookItem) => void;
  updateBook: (book: BookItem) => void;
  deleteBook: (id: string) => void;
  updateBookDetails: (book: Partial<BookItem>) => void;
  saveAllChanges: () => Promise<boolean>;
  resetToDefaults: () => void;
  isSaving: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [skills, setSkills] = useState<SkillItem[]>(defaultSkillsList);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [certifications, setCertifications] = useState<CertificationItem[]>(defaultCertifications);
  const [books, setBooks] = useState<BookItem[]>(defaultBooks);
  const [bookDetails, setBookDetails] = useState<BookItem>(defaultBooks[0] || defaultBookDetails);
  const [isSaving, setIsSaving] = useState(false);

  const stateRef = useRef({
    personalInfo,
    skills,
    projects,
    certifications,
    books,
    bookDetails,
  });

  useEffect(() => {
    stateRef.current = {
      personalInfo,
      skills,
      projects,
      certifications,
      books,
      bookDetails,
    };
  }, [personalInfo, skills, projects, certifications, books, bookDetails]);

  // Initialize from Server API or LocalStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/portfolio-data');
        if (res.ok) {
          const data = await res.json();
          if (data && (data.personalInfo || data.books || Array.isArray(data.projects) || Array.isArray(data.certifications))) {
            if (data.personalInfo) setPersonalInfo(data.personalInfo);
            if (data.skills) setSkills(data.skills);
            if (Array.isArray(data.projects)) setProjects(data.projects);
            if (Array.isArray(data.certifications)) setCertifications(data.certifications);

            let loadedBooks: BookItem[] = defaultBooks;
            if (Array.isArray(data.books) && data.books.length > 0) {
              loadedBooks = data.books;
            } else if (data.bookDetails) {
              loadedBooks = [{ ...defaultBookDetails, ...data.bookDetails }];
            }
            setBooks(loadedBooks);
            setBookDetails(loadedBooks[0] || defaultBookDetails);

            stateRef.current = {
              personalInfo: data.personalInfo || defaultPersonalInfo,
              skills: data.skills || defaultSkillsList,
              projects: data.projects || defaultProjects,
              certifications: data.certifications || defaultCertifications,
              books: loadedBooks,
              bookDetails: loadedBooks[0] || defaultBookDetails,
            };
            return;
          }
        }
      } catch (err) {
        console.warn('Could not load portfolio data from server, using local cache', err);
      }

      // Local storage fallback
      const cached = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('akash_portfolio_custom_v2');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
          if (parsed.skills) setSkills(parsed.skills);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.certifications) setCertifications(parsed.certifications);

          let loadedBooks: BookItem[] = defaultBooks;
          if (Array.isArray(parsed.books) && parsed.books.length > 0) {
            loadedBooks = parsed.books;
          } else if (parsed.bookDetails) {
            loadedBooks = [{ ...defaultBookDetails, ...parsed.bookDetails }];
          }
          setBooks(loadedBooks);
          setBookDetails(loadedBooks[0] || defaultBookDetails);

          stateRef.current = {
            personalInfo: parsed.personalInfo || defaultPersonalInfo,
            skills: parsed.skills || defaultSkillsList,
            projects: parsed.projects || defaultProjects,
            certifications: parsed.certifications || defaultCertifications,
            books: loadedBooks,
            bookDetails: loadedBooks[0] || defaultBookDetails,
          };
        } catch {
          // ignore
        }
      }
    };

    loadData();
  }, []);

  const persistData = (updated: {
    personalInfo: typeof personalInfo;
    skills: typeof skills;
    projects: typeof projects;
    certifications: typeof certifications;
    books: typeof books;
    bookDetails: typeof bookDetails;
  }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((err) => console.warn('Sync error:', err));
  };

  const updatePersonalInfo = (info: Partial<typeof defaultPersonalInfo>) => {
    setPersonalInfo((prev) => {
      const next = { ...prev, ...info };
      const updated = { ...stateRef.current, personalInfo: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const addProject = (project: ProjectItem) => {
    setProjects((prev) => {
      const next = [project, ...prev];
      const updated = { ...stateRef.current, projects: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const updateProject = (project: ProjectItem) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === project.id ? project : p));
      const updated = { ...stateRef.current, projects: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      const updated = { ...stateRef.current, projects: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const addSkill = (skill: SkillItem) => {
    setSkills((prev) => {
      const next = [skill, ...prev];
      const updated = { ...stateRef.current, skills: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const updateSkill = (skill: SkillItem) => {
    setSkills((prev) => {
      const next = prev.map((s) => (s.id === skill.id ? skill : s));
      const updated = { ...stateRef.current, skills: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => {
      const next = prev.filter((s) => s.id !== id);
      const updated = { ...stateRef.current, skills: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const addCertification = (cert: CertificationItem) => {
    setCertifications((prev) => {
      const next = [cert, ...prev];
      const updated = { ...stateRef.current, certifications: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const updateCertification = (cert: CertificationItem) => {
    setCertifications((prev) => {
      const next = prev.map((c) => (c.id === cert.id ? cert : c));
      const updated = { ...stateRef.current, certifications: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const deleteCertification = (id: string) => {
    setCertifications((prev) => {
      const next = prev.filter((c) => c.id !== id);
      const updated = { ...stateRef.current, certifications: next };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const addBook = (book: BookItem) => {
    setBooks((prev) => {
      const next = [book, ...prev];
      setBookDetails(next[0]);
      const updated = { ...stateRef.current, books: next, bookDetails: next[0] };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const updateBook = (book: BookItem) => {
    setBooks((prev) => {
      const next = prev.map((b) => (b.id === book.id ? book : b));
      setBookDetails(next[0] || defaultBookDetails);
      const updated = { ...stateRef.current, books: next, bookDetails: next[0] || defaultBookDetails };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      const fallbackBook = next[0] || defaultBookDetails;
      setBookDetails(fallbackBook);
      const updated = { ...stateRef.current, books: next, bookDetails: fallbackBook };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const updateBookDetails = (book: Partial<BookItem>) => {
    setBooks((prev) => {
      const current = prev[0] || defaultBooks[0];
      const nextFirst = { ...current, ...book };
      const next = [nextFirst, ...prev.slice(1)];
      setBookDetails(nextFirst);
      const updated = { ...stateRef.current, books: next, bookDetails: nextFirst };
      stateRef.current = updated;
      persistData(updated);
      return next;
    });
  };

  const saveAllChanges = async (): Promise<boolean> => {
    setIsSaving(true);
    const dataToSave = { personalInfo, skills, projects, certifications, books, bookDetails };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    try {
      const res = await fetch('/api/portfolio-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });
      setIsSaving(false);
      return res.ok;
    } catch {
      setIsSaving(false);
      return false;
    }
  };

  const resetToDefaults = () => {
    setPersonalInfo(defaultPersonalInfo);
    setSkills(defaultSkillsList);
    setProjects(defaultProjects);
    setCertifications(defaultCertifications);
    setBooks(defaultBooks);
    setBookDetails(defaultBooks[0] || defaultBookDetails);
    localStorage.removeItem(STORAGE_KEY);
    fetch('/api/portfolio-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalInfo: defaultPersonalInfo,
        skills: defaultSkillsList,
        projects: defaultProjects,
        certifications: defaultCertifications,
        books: defaultBooks,
        bookDetails: defaultBooks[0] || defaultBookDetails,
      }),
    }).catch(() => {});
  };

  return (
    <PortfolioContext.Provider
      value={{
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
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
