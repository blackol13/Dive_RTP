import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FileCheck2,
  Award,
  BellRing,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ChevronRight,
  Headphones,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    students,
    consultationReports,
    posts,
    settings,
    setCurrentView,
    openParentPreview
  } = useApp();

  // Metrics
  const activeStudentsCount = students.filter(s => s.status === '재원중').length;
  const totalReportsCount = consultationReports.length;

  const avgRtpScore = students.reduce((acc, curr) => {
    return acc + (curr.latestRtp?.overallScore || 0);
  }, 0) / (students.length || 1);

  const activeNoticesCount = posts.filter(p => p.category === '공지사항').length;

  // Domain averages for visual breakdown
  const domainAverages = {
    vocabulary: Math.round(students.reduce((a, c) => a + (c.latestRtp?.vocabulary || 0), 0) / (students.length || 1)),
    grammar: Math.round(students.reduce((a, c) => a + (c.latestRtp?.grammar || 0), 0) / (students.length || 1)),
    reading: Math.round(students.reduce((a, c) => a + (c.latestRtp?.reading || 0), 0) / (students.length || 1)),
    listening: Math.round(students.reduce((a, c) => a + (c.latestRtp?.listening || 0), 0) / (students.length || 1)),
    syntax: Math.round(students.reduce((a, c) => a + (c.latestRtp?.syntax || 0), 0) / (students.length || 1))
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome & AI Banner */}
      <div
        className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${settings.primaryColor} 0%, #0F172A 100%)`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>다이브 영어학원 스마트 대시보드</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              반갑습니다, {settings.principalName}님!
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed opacity-90">
              RTP 진단 데이터 분석 및 STT 상담 음성 요약 AI로 학부모 전달용 맞춤 결과지를 몇 초 만에 완성해보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('consultation')}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>스마트 결과지 생성기</span>
            </button>
            <button
              onClick={() => {
                if (consultationReports.length > 0) {
                  openParentPreview(consultationReports[0]);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/90 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>학부모 샘플 결과지 보기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">현재 재원생</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
              <span>{activeStudentsCount}</span>
              <span className="text-xs text-slate-500 font-normal">명</span>
            </div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>지난달 대비 +2명 증가</span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">생성된 상담 결과지</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
              <span>{totalReportsCount}</span>
              <span className="text-xs text-slate-500 font-normal">건</span>
            </div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>전체 학부모 발송 완료</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">재원생 RTP 평균 점수</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
              <span>{avgRtpScore.toFixed(1)}</span>
              <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="text-[11px] text-indigo-600 flex items-center gap-1 mt-1 font-medium">
              <Award className="w-3 h-3" />
              <span>Level 4 (High-Inter)</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">게시된 학원 공지/칼럼</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
              <span>{posts.length}</span>
              <span className="text-xs text-slate-500 font-normal">개</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
              <BellRing className="w-3 h-3 text-amber-500" />
              <span>주요 공지 {activeNoticesCount}건 진행중</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <BellRing className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Section: Domain Analytics & Quick Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Analytics */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center">
                <span className="w-2 h-5 bg-indigo-500 rounded mr-2 shrink-0"></span>
                <span>재원생 RTP 영역별 평균 성취도 파악</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                다이브 학원 전체 학생의 영단어, 문법, 독해, 듣기, 구문 종합 성취도
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
              2026년 8월 기준
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: '어휘 (Vocabulary)', score: domainAverages.vocabulary, color: 'bg-indigo-600' },
              { label: '문법 (Grammar)', score: domainAverages.grammar, color: 'bg-blue-600' },
              { label: '독해 (Reading)', score: domainAverages.reading, color: 'bg-emerald-600' },
              { label: '듣기 (Listening)', score: domainAverages.listening, color: 'bg-amber-500' },
              { label: '구문 분석 (Syntax)', score: domainAverages.syntax, color: 'bg-purple-600' },
            ].map((d) => (
              <div key={d.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{d.label}</span>
                  <span className="text-slate-900 font-bold">{d.score}점</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${d.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${d.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
            <span>💡 <strong>학습 분석 팁:</strong> 문법 및 구문 영역 평균이 독해/듣기에 비해 보완이 필요하여, 1:1 구문 오답 노트 관리가 진행 중입니다.</span>
            <button
              onClick={() => setCurrentView('consultation')}
              className="text-xs font-bold text-indigo-600 hover:underline shrink-0 ml-2"
            >
              상담 작성가기 &rarr;
            </button>
          </div>
        </div>

        {/* Quick Workflow Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center">
            <span className="w-2 h-5 bg-indigo-500 rounded mr-2 shrink-0"></span>
            <span>스마트 빠른 작업</span>
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('consultation')}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">RTP 테스트 점수 파싱</div>
                  <div className="text-[11px] text-slate-500">복사한 테스트 텍스트로 오답 파악</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentView('consultation')}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">상담 음성 AI 3~5줄 요약</div>
                  <div className="text-[11px] text-slate-500">녹음파일(MP3/MP4) 핵심 변환</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-slate-900">학원 테마 & 브랜드 설정</div>
                  <div className="text-[11px] text-slate-500">대표색, 로고, 카톡 양식 변경</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Consultation Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center">
              <span className="w-2 h-5 bg-indigo-500 rounded mr-2 shrink-0"></span>
              <span>최근 생성된 학부모 상담 결과지</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">클릭 시 학부모 전용 스마트 결과지 모바일/PC 리포트를 즉시 확인합니다.</p>
          </div>
          <button
            onClick={() => setCurrentView('consultation')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>전체 목록 / 신규 작성</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="p-4">학생명 / 학교</th>
                <th className="p-4">상담 구분</th>
                <th className="p-4">RTP 종합점수</th>
                <th className="p-4">상담 일자</th>
                <th className="p-4">컨설턴트</th>
                <th className="p-4 text-right">학부모 결과지</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {consultationReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{report.studentName}</div>
                    <div className="text-[11px] text-slate-500">{report.school} ({report.grade})</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {report.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {report.rtpData.overallScore}점
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                        {report.rtpData.evaluatedLevel}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{report.consultationDate}</td>
                  <td className="p-4 text-slate-600">{report.counselorName}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openParentPreview(report)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition-all inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>결과지 미리보기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
