import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  Student,
  ConsultationReport,
  Post,
  AcademySettings
} from '../types';
import {
  initialAcademySettings,
  initialStudents,
  initialConsultationReports,
  initialPosts
} from '../data/mockData';

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  settings: AcademySettings;
  updateSettings: (newSettings: Partial<AcademySettings>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  consultationReports: ConsultationReport[];
  addConsultationReport: (report: Omit<ConsultationReport, 'id' | 'createdAt'>) => ConsultationReport;
  updateConsultationReport: (id: string, updated: Partial<ConsultationReport>) => void;
  deleteConsultationReport: (id: string) => void;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'date' | 'views'>) => void;
  updatePost: (id: string, updated: Partial<Post>) => void;
  deletePost: (id: string) => void;
  selectedReportForPreview: ConsultationReport | null;
  setSelectedReportForPreview: (report: ConsultationReport | null) => void;
  openParentPreview: (report: ConsultationReport) => void;
  activeDraftStudentId: string | null;
  setActiveDraftStudentId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [settings, setSettings] = useState<AcademySettings>(() => {
    const saved = localStorage.getItem('dive_academy_settings');
    return saved ? JSON.parse(saved) : initialAcademySettings;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('dive_academy_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [consultationReports, setConsultationReports] = useState<ConsultationReport[]>(() => {
    const saved = localStorage.getItem('dive_academy_reports');
    return saved ? JSON.parse(saved) : initialConsultationReports;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('dive_academy_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [selectedReportForPreview, setSelectedReportForPreview] = useState<ConsultationReport | null>(
    initialConsultationReports[0] || null
  );

  const [activeDraftStudentId, setActiveDraftStudentId] = useState<string | null>(null);

  // Sync to local storage for persistent demo experience
  useEffect(() => {
    localStorage.setItem('dive_academy_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dive_academy_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('dive_academy_reports', JSON.stringify(consultationReports));
  }, [consultationReports]);

  useEffect(() => {
    localStorage.setItem('dive_academy_posts', JSON.stringify(posts));
  }, [posts]);

  // Apply Primary Color & Font Family dynamically to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-brand', settings.primaryColor);
  }, [settings.primaryColor]);

  const updateSettings = (newSettings: Partial<AcademySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addConsultationReport = (reportData: Omit<ConsultationReport, 'id' | 'createdAt'>): ConsultationReport => {
    const newReport: ConsultationReport = {
      ...reportData,
      id: `rpt-${Date.now()}`,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      sharedLinkToken: `dive-report-${Math.random().toString(36).substring(2, 9)}`
    };

    setConsultationReports(prev => [newReport, ...prev]);

    // Also update student's latest RTP score
    if (reportData.rtpData && reportData.studentId) {
      updateStudent(reportData.studentId, {
        latestRtp: reportData.rtpData
      });
    }

    return newReport;
  };

  const updateConsultationReport = (id: string, updated: Partial<ConsultationReport>) => {
    setConsultationReports(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    if (selectedReportForPreview && selectedReportForPreview.id === id) {
      setSelectedReportForPreview(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const deleteConsultationReport = (id: string) => {
    setConsultationReports(prev => prev.filter(r => r.id !== id));
  };

  const addPost = (postData: Omit<Post, 'id' | 'date' | 'views'>) => {
    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (id: string, updated: Partial<Post>) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const openParentPreview = (report: ConsultationReport) => {
    setSelectedReportForPreview(report);
    setCurrentView('parent-preview');
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      settings,
      updateSettings,
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      consultationReports,
      addConsultationReport,
      updateConsultationReport,
      deleteConsultationReport,
      posts,
      addPost,
      updatePost,
      deletePost,
      selectedReportForPreview,
      setSelectedReportForPreview,
      openParentPreview,
      activeDraftStudentId,
      setActiveDraftStudentId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
