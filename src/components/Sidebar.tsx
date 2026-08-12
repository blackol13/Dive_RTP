import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  Settings,
  Eye,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    settings,
    students,
    consultationReports,
    posts,
    selectedReportForPreview
  } = useApp();

  const managementNavItems: { id: ViewMode; label: string; badge?: number }[] = [
    {
      id: 'dashboard',
      label: '대시보드'
    },
    {
      id: 'students',
      label: '학생 관리',
      badge: students.length
    },
    {
      id: 'consultation',
      label: '상담일지 작성',
      badge: consultationReports.length
    },
    {
      id: 'posts',
      label: '게시글 관리',
      badge: posts.length
    }
  ];

  const systemNavItems: { id: ViewMode; label: string }[] = [
    {
      id: 'settings',
      label: '테마 및 설정'
    }
  ];

  return (
    <aside className="w-64 bg-[#1e293b] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800 shadow-xl z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div
            className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl text-white shrink-0 shadow-sm"
            style={{ backgroundColor: settings.primaryColor || '#6366f1' }}
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              'D'
            )}
          </div>
          <div className="overflow-hidden">
            <span className="text-xl font-bold tracking-tight text-white block truncate">
              {settings.academyName || 'DIVE ENGLISH'}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
              Academic System
            </span>
          </div>
        </div>

        {/* AI Highlight Banner */}
        <div className="mx-4 my-4 p-3.5 bg-slate-800/80 rounded-lg border border-slate-700/80 text-xs">
          <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Geometric AI Suite</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            RTP 성적 파싱 & STT 음성 요약으로 학부모 스마트 결과지 자동 생성
          </p>
        </div>

        {/* Navigation Section 1: MANAGEMENT */}
        <nav className="px-4 py-2 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Management
          </div>
          {managementNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                style={
                  isActive && settings.primaryColor ? { backgroundColor: settings.primaryColor } : undefined
                }
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                      isActive ? 'border-white/40 bg-white/10' : 'border-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-xs ${isActive ? 'bg-white' : 'bg-slate-500'}`}></span>
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Navigation Section 2: SYSTEMS */}
          <div className="pt-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
            Systems
          </div>
          {systemNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                style={
                  isActive && settings.primaryColor ? { backgroundColor: settings.primaryColor } : undefined
                }
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
                      isActive ? 'border-white/40 bg-white/10' : 'border-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-xs ${isActive ? 'bg-white' : 'bg-slate-500'}`}></span>
                  </span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Profile & Report Preview Quick Link */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        <button
          onClick={() => {
            if (selectedReportForPreview) {
              setCurrentView('parent-preview');
            } else if (consultationReports.length > 0) {
              useApp().openParentPreview(consultationReports[0]);
            }
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-indigo-300 font-medium text-xs border border-indigo-500/30 transition-all"
        >
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>학부모 결과지 미리보기</span>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </button>

        <div className="flex items-center space-x-3 p-2 bg-slate-800/90 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
            D
          </div>
          <div className="flex-1 text-sm overflow-hidden">
            <p className="font-medium text-white text-xs truncate">{settings.principalName || '관리자A'}</p>
            <p className="text-[10px] text-slate-400 truncate">다이브 영어 원장</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
