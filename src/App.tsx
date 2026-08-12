import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { ConsultationWriter } from './components/ConsultationWriter';
import { PostManagement } from './components/PostManagement';
import { SettingsCustomizer } from './components/SettingsCustomizer';
import { ParentReportView } from './components/ParentReportView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  if (currentView === 'parent-preview') {
    return <ParentReportView />;
  }

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'students' && <StudentManagement />}
          {currentView === 'consultation' && <ConsultationWriter />}
          {currentView === 'posts' && <PostManagement />}
          {currentView === 'settings' && <SettingsCustomizer />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
