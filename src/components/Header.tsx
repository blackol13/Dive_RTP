import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  UserCheck,
  ExternalLink,
  Sliders
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    settings,
    students,
    consultationReports,
    posts,
    openParentPreview,
    setActiveDraftStudentId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const viewTitles: Record<string, { breadcrumb: string; title: string }> = {
    dashboard: {
      breadcrumb: '대시보드',
      title: '학원 종합 관리 대시보드'
    },
    students: {
      breadcrumb: '학생 관리',
      title: '학생 재원 및 성적 관리'
    },
    consultation: {
      breadcrumb: '상담 결과지 생성기',
      title: '스마트 상담일지 & 결과지 생성기'
    },
    posts: {
      breadcrumb: '게시글 관리',
      title: '게시글 및 교육정보 관리'
    },
    settings: {
      breadcrumb: '테마 및 설정',
      title: '학원 브랜딩 및 시스템 설정'
    },
    'parent-preview': {
      breadcrumb: '결과지 미리보기',
      title: '학부모 전달용 스마트 상담 결과지'
    }
  };

  const currentInfo = viewTitles[currentView] || viewTitles.dashboard;

  // Search logic
  const matchedStudents = searchQuery.trim()
    ? students.filter(s => s.name.includes(searchQuery) || s.school.includes(searchQuery) || s.grade.includes(searchQuery))
    : [];

  const matchedReports = searchQuery.trim()
    ? consultationReports.filter(r => r.studentName.includes(searchQuery) || r.category.includes(searchQuery))
    : [];

  const matchedPosts = searchQuery.trim()
    ? posts.filter(p => p.title.includes(searchQuery) || p.category.includes(searchQuery))
    : [];

  const hasSearchMatches = matchedStudents.length > 0 || matchedReports.length > 0 || matchedPosts.length > 0;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <span>메인</span>
        <span>/</span>
        <span className="text-indigo-600 font-medium">{currentInfo.breadcrumb}</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Quick Search */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="학생명, 상담, 공지 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 w-44 focus:w-60 transition-all"
            />
          </div>

          {/* Dropdown Results */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 text-xs max-h-96 overflow-y-auto">
              {!hasSearchMatches ? (
                <div className="text-center py-4 text-slate-400">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {matchedStudents.length > 0 && (
                    <div>
                      <div className="font-semibold text-slate-500 text-[10px] uppercase mb-1">
                        학생 ({matchedStudents.length})
                      </div>
                      {matchedStudents.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveDraftStudentId(s.id);
                            setCurrentView('consultation');
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-medium text-slate-900">{s.name} ({s.grade})</span>
                          <span className="text-[10px] text-slate-500">{s.school}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedReports.length > 0 && (
                    <div>
                      <div className="font-semibold text-slate-500 text-[10px] uppercase mb-1">
                        상담 결과지 ({matchedReports.length})
                      </div>
                      {matchedReports.map(r => (
                        <div
                          key={r.id}
                          onClick={() => {
                            openParentPreview(r);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-medium text-slate-900">{r.studentName} - {r.category}</span>
                          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                            결과지 보기 <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedPosts.length > 0 && (
                    <div>
                      <div className="font-semibold text-slate-500 text-[10px] uppercase mb-1">
                        게시글 ({matchedPosts.length})
                      </div>
                      {matchedPosts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setCurrentView('posts');
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-md hover:bg-slate-100 cursor-pointer text-slate-800 truncate"
                        >
                          [{p.category}] {p.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => setCurrentView('consultation')}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-1.5"
          style={settings.primaryColor ? { backgroundColor: settings.primaryColor } : undefined}
        >
          <Plus className="w-4 h-4" />
          <span>신규 상담 등록</span>
        </button>
      </div>
    </header>
  );
};
