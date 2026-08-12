import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  Headphones,
  CheckCircle2,
  Printer,
  Copy,
  Share2,
  ArrowLeft,
  Play,
  Pause,
  Sparkles,
  Phone,
  MapPin,
  FileCheck,
  AlertCircle,
  Edit3,
  X,
  Save,
  Download,
  FileText
} from 'lucide-react';

type SectionType = 'header' | 'rtp' | 'stt' | 'prescription' | null;

export const ParentReportView: React.FC = () => {
  const {
    selectedReportForPreview,
    settings,
    setCurrentView,
    updateConsultationReport
  } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Section Quick Editing Modal State
  const [activeEditSection, setActiveEditSection] = useState<SectionType>(null);

  // Header Section Edit Form State
  const [editHeaderForm, setEditHeaderForm] = useState({
    studentName: '',
    school: '',
    grade: '',
    counselorName: '',
    consultationDate: '',
    category: '정기 성취도 상담' as any
  });

  // RTP Section Edit Form State
  const [editRtpForm, setEditRtpForm] = useState({
    vocabulary: 85,
    grammar: 75,
    reading: 90,
    listening: 90,
    syntax: 80,
    evaluatedLevel: 'High-Intermediate (Level 4)',
    keyStrengthsText: '',
    keyWeaknessesText: ''
  });

  // STT Section Edit Form State
  const [editSttForm, setEditSttForm] = useState({
    audioFileName: '',
    audioDuration: '',
    aiSummaryText: '',
    keyTagsText: ''
  });

  // Prescription Section Edit Form State
  const [editPrescriptionForm, setEditPrescriptionForm] = useState({
    monthlyGoal: '',
    recommendedCurriculum: '',
    homeworkLoad: '',
    weeklyStudyPlan: '',
    counselorMessage: ''
  });

  if (!selectedReportForPreview) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-4">
        <p>미리볼 상담 결과지가 선택되지 않았습니다.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  const report = selectedReportForPreview;

  // Open Quick Edit Modal for specified section
  const handleOpenEditSection = (section: SectionType) => {
    setActiveEditSection(section);
    if (section === 'header') {
      setEditHeaderForm({
        studentName: report.studentName,
        school: report.school,
        grade: report.grade,
        counselorName: report.counselorName,
        consultationDate: report.consultationDate,
        category: report.category
      });
    } else if (section === 'rtp') {
      setEditRtpForm({
        vocabulary: report.rtpData.vocabulary,
        grammar: report.rtpData.grammar,
        reading: report.rtpData.reading,
        listening: report.rtpData.listening,
        syntax: report.rtpData.syntax,
        evaluatedLevel: report.rtpData.evaluatedLevel,
        keyStrengthsText: report.rtpData.keyStrengths.join('\n'),
        keyWeaknessesText: report.rtpData.keyWeaknesses.join('\n')
      });
    } else if (section === 'stt') {
      setEditSttForm({
        audioFileName: report.sttData.audioFileName,
        audioDuration: report.sttData.audioDuration,
        aiSummaryText: report.sttData.aiSummary.join('\n'),
        keyTagsText: report.sttData.keyTags.join(', ')
      });
    } else if (section === 'prescription') {
      setEditPrescriptionForm({
        monthlyGoal: report.teacherPrescription.monthlyGoal,
        recommendedCurriculum: report.teacherPrescription.recommendedCurriculum,
        homeworkLoad: report.teacherPrescription.homeworkLoad,
        weeklyStudyPlan: report.teacherPrescription.weeklyStudyPlan,
        counselorMessage: report.teacherPrescription.counselorMessage
      });
    }
  };

  // Save Header Edits
  const handleSaveHeader = () => {
    updateConsultationReport(report.id, {
      studentName: editHeaderForm.studentName,
      school: editHeaderForm.school,
      grade: editHeaderForm.grade,
      counselorName: editHeaderForm.counselorName,
      consultationDate: editHeaderForm.consultationDate,
      category: editHeaderForm.category
    });
    setActiveEditSection(null);
    setCopyToast('기본 정보 수정이 완료되었습니다.');
    setTimeout(() => setCopyToast(null), 2500);
  };

  // Save RTP Edits
  const handleSaveRtp = () => {
    const vocab = Number(editRtpForm.vocabulary) || 0;
    const gram = Number(editRtpForm.grammar) || 0;
    const read = Number(editRtpForm.reading) || 0;
    const listen = Number(editRtpForm.listening) || 0;
    const syn = Number(editRtpForm.syntax) || 0;
    const avg = Number(((vocab + gram + read + listen + syn) / 5).toFixed(1));

    updateConsultationReport(report.id, {
      rtpData: {
        vocabulary: vocab,
        grammar: gram,
        reading: read,
        listening: listen,
        syntax: syn,
        overallScore: avg,
        evaluatedLevel: editRtpForm.evaluatedLevel,
        keyStrengths: editRtpForm.keyStrengthsText.split('\n').filter(s => s.trim().length > 0),
        keyWeaknesses: editRtpForm.keyWeaknessesText.split('\n').filter(w => w.trim().length > 0)
      }
    });
    setActiveEditSection(null);
    setCopyToast('1섹션 (RTP 성적 분석) 수정이 완료되었습니다.');
    setTimeout(() => setCopyToast(null), 2500);
  };

  // Save STT Edits
  const handleSaveStt = () => {
    updateConsultationReport(report.id, {
      sttData: {
        audioFileName: editSttForm.audioFileName,
        audioDuration: editSttForm.audioDuration,
        aiSummary: editSttForm.aiSummaryText.split('\n').filter(s => s.trim().length > 0),
        keyTags: editSttForm.keyTagsText.split(',').map(t => t.trim()).filter(t => t.length > 0)
      }
    });
    setActiveEditSection(null);
    setCopyToast('2섹션 (상담 음성 요약) 수정이 완료되었습니다.');
    setTimeout(() => setCopyToast(null), 2500);
  };

  // Save Prescription Edits
  const handleSavePrescription = () => {
    updateConsultationReport(report.id, {
      teacherPrescription: {
        monthlyGoal: editPrescriptionForm.monthlyGoal,
        recommendedCurriculum: editPrescriptionForm.recommendedCurriculum,
        homeworkLoad: editPrescriptionForm.homeworkLoad,
        weeklyStudyPlan: editPrescriptionForm.weeklyStudyPlan,
        counselorMessage: editPrescriptionForm.counselorMessage
      }
    });
    setActiveEditSection(null);
    setCopyToast('3섹션 (강사 처방전 및 로드맵) 수정이 완료되었습니다.');
    setTimeout(() => setCopyToast(null), 2500);
  };

  // Copy Kakao Message Handler
  const handleCopyKakaoMessage = () => {
    const formatted = (settings.kakaoNoticeTemplate || '')
      .replace('{학부모성함}', report.studentName + ' 어머니')
      .replace('{학생이름}', report.studentName)
      .replace('{결과지링크}', `https://dive-academy.edu/reports/${report.sharedLinkToken || 'view'}`);

    navigator.clipboard.writeText(formatted);
    setCopyToast('카카오톡 전송 문구가 복사되었습니다!');
    setTimeout(() => setCopyToast(null), 2500);
  };

  // Copy Link Handler
  const handleCopyLink = () => {
    const link = `${window.location.origin}/report/${report.sharedLinkToken || 'preview'}`;
    navigator.clipboard.writeText(link);
    setCopyToast('결과지 웹 링크가 복사되었습니다!');
    setTimeout(() => setCopyToast(null), 2500);
  };

  // PDF Export & Print Handler
  const handlePrintPDF = () => {
    const originalTitle = document.title;
    document.title = `${report.studentName}_상담결과지_${report.consultationDate}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 pb-16 pt-6 px-4 print:p-0 print:bg-white">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-slate-700 animate-fade-in print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Top Floating Control Bar (Admin view only, hidden during print) */}
      <div className="max-w-3xl mx-auto mb-6 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>관리자 대시보드</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyKakaoMessage}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>카톡 문구 복사</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>모바일 링크 복사</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            style={settings.primaryColor ? { backgroundColor: settings.primaryColor } : undefined}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF 추출 / 인쇄</span>
          </button>
        </div>
      </div>

      {/* PARENT REPORT CONTAINER (MOBILE & PC CARD REPORT TEMPLATE) */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* BRAND TOP HEADER BANNER */}
        <div
          className="p-6 sm:p-8 text-white relative overflow-hidden group"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {/* Header Quick Edit Button */}
          <button
            onClick={() => handleOpenEditSection('header')}
            className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md flex items-center justify-center border border-white/30 transition-all print:hidden"
            title="기본정보 수정"
            aria-label="기본정보 수정"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-white tracking-wide border border-white/20">
                  {settings.academyName} 스마트 상담 리포트
                </span>
                <span className="text-xs text-white/80 font-medium">
                  {report.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {report.studentName} 학생 종합 상담 결과지
              </h1>
              <p className="text-xs text-white/80">
                {report.school} ({report.grade}) | 담당 컨설턴트: {report.counselorName} ({report.consultationDate})
              </p>
            </div>

            {/* RTP Overall Score Badge */}
            <div className="shrink-0 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center text-xs space-y-1">
              <div className="text-white/80 text-[10px]">RTP 종합 성취도</div>
              <div className="text-2xl font-black text-amber-300">
                {report.rtpData.overallScore}점
              </div>
              <div className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                {report.rtpData.evaluatedLevel}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: RTP 진단 성적 및 영역별 분석 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center">
                <span className="w-2 h-5 bg-indigo-500 rounded mr-2 shrink-0"></span>
                <span>1. RTP (Reading & Testing Placement) 영역별 성취도 분석</span>
              </h2>
              <button
                onClick={() => handleOpenEditSection('rtp')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-all print:hidden"
                title="1섹션 수정"
                aria-label="1섹션 수정"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            {/* Score Bars Grid */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3.5">
              {[
                { label: '어휘력 (Vocabulary)', score: report.rtpData.vocabulary, desc: '수능 심화 어휘 및 다의어 활용' },
                { label: '문법 및 어법 (Grammar)', score: report.rtpData.grammar, desc: '고등 서술형 문법 조건 적용' },
                { label: '독해력 (Reading)', score: report.rtpData.reading, desc: '지문 스키밍 및 유형별 주제 파악' },
                { label: '듣기 평가 (Listening)', score: report.rtpData.listening, desc: '실전 모의고사 수능 듣기 정답률' },
                { label: '구문 분석력 (Syntax)', score: report.rtpData.syntax, desc: '긴 도치 및 관계사 문장 구조 해석' },
              ].map((domain) => (
                <div key={domain.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{domain.label}</span>
                      <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline">({domain.desc})</span>
                    </div>
                    <span className="font-extrabold text-slate-900">{domain.score}점</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${domain.score}%`,
                        backgroundColor: settings.primaryColor
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths & Weaknesses Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Strengths */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
                <div className="font-extrabold text-emerald-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>주요 핵심 강점 (Key Strengths)</span>
                </div>
                <ul className="space-y-1.5 text-slate-700">
                  {report.rtpData.keyStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                <div className="font-extrabold text-rose-900 text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>집중 보완 필요 영역 (Key Weaknesses)</span>
                </div>
                <ul className="space-y-1.5 text-slate-700">
                  {report.rtpData.keyWeaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 2: AI STT 상담 음성 요약본 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center">
                <span className="w-2 h-5 bg-indigo-500 rounded mr-2 shrink-0"></span>
                <span>2. 상담 음성 AI 핵심 요약 (STT 요약본)</span>
              </h2>
              <button
                onClick={() => handleOpenEditSection('stt')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-all print:hidden"
                title="2섹션 수정"
                aria-label="2섹션 수정"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            {/* Audio Wave Card */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <div className="font-bold text-indigo-950 text-xs sm:text-sm">
                    {report.sttData.audioFileName || '상담 음성 녹음'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    녹음 분량: {report.sttData.audioDuration || '14분 32초'} (음성 AI 핵심 포인트 파악 완료)
                  </div>
                </div>
              </div>

              {/* Fake Equalizer Bars */}
              <div className="hidden sm:flex items-center gap-1">
                {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full bg-indigo-400/80 transition-all ${
                      isPlaying ? 'animate-pulse' : ''
                    }`}
                    style={{ height: `${isPlaying ? h * 0.3 : 12}px` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* AI Summary Bullets */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 text-indigo-700">
                <Sparkles className="w-4 h-4" />
                <span>3~5줄 상담 핵심 종합 정리:</span>
              </div>
              <div className="space-y-2 text-xs text-slate-800 leading-relaxed">
                {report.sttData.aiSummary.map((bullet, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium">
                    {bullet}
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {report.sttData.keyTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: 강사 학습 처방전 및 월간 로드맵 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center">
                <span className="w-2 h-5 bg-indigo-500 rounded mr-2 shrink-0"></span>
                <span>3. 전담 강사 맞춤 처방전 및 학습 로드맵</span>
              </h2>
              <button
                onClick={() => handleOpenEditSection('prescription')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center transition-all print:hidden"
                title="3섹션 수정"
                aria-label="3섹션 수정"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            <div className="p-5 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-4 text-xs">
              {/* Monthly Goal Banner */}
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <div className="text-[11px] font-bold text-emerald-700">🎯 이달의 핵심 달성 목표</div>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {report.teacherPrescription.monthlyGoal}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-400 font-medium">매칭 커리큘럼</div>
                  <div className="font-bold text-slate-900">{report.teacherPrescription.recommendedCurriculum}</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="text-slate-400 font-medium">일일 과제 권장 분량</div>
                  <div className="font-bold text-slate-900">{report.teacherPrescription.homeworkLoad}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-400 font-medium">주간 전용 학습 스케줄</div>
                <div className="font-bold text-slate-900">{report.teacherPrescription.weeklyStudyPlan}</div>
              </div>

              {/* Counselor Personal Message */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>{report.counselorName}의 한마디</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed italic opacity-95">
                  "{report.teacherPrescription.counselorMessage}"
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER: Academy Contact Info & Official Stamp */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-bold text-slate-900 text-sm">{settings.academyName}</div>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {settings.contactNumber}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {settings.address}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="text-[10px] text-slate-400">대표 원장 서명</div>
              <div className="font-bold text-slate-900 text-sm underline decoration-indigo-500 decoration-2">
                {settings.principalName} (직인 생략)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK EDIT MODAL MODALS */}
      {activeEditSection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {activeEditSection === 'header' && '기본 학생/상담 정보 빠른 수정'}
                  {activeEditSection === 'rtp' && '1섹션: RTP 성적 및 강/약점 빠른 수정'}
                  {activeEditSection === 'stt' && '2섹션: STT 상담 음성 요약 빠른 수정'}
                  {activeEditSection === 'prescription' && '3섹션: 강사 처방전 및 로드맵 빠른 수정'}
                </h3>
              </div>
              <button
                onClick={() => setActiveEditSection(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Header Section */}
            {activeEditSection === 'header' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">학생 이름</label>
                    <input
                      type="text"
                      value={editHeaderForm.studentName}
                      onChange={e => setEditHeaderForm({ ...editHeaderForm, studentName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">학교</label>
                    <input
                      type="text"
                      value={editHeaderForm.school}
                      onChange={e => setEditHeaderForm({ ...editHeaderForm, school: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">학년</label>
                    <input
                      type="text"
                      value={editHeaderForm.grade}
                      onChange={e => setEditHeaderForm({ ...editHeaderForm, grade: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">담당 컨설턴트</label>
                    <input
                      type="text"
                      value={editHeaderForm.counselorName}
                      onChange={e => setEditHeaderForm({ ...editHeaderForm, counselorName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">상담 날짜</label>
                    <input
                      type="text"
                      value={editHeaderForm.consultationDate}
                      onChange={e => setEditHeaderForm({ ...editHeaderForm, consultationDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">상담 카테고리</label>
                    <input
                      type="text"
                      value={editHeaderForm.category}
                      onChange={e => setEditHeaderForm({ ...editHeaderForm, category: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveEditSection(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveHeader}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: RTP Section */}
            {activeEditSection === 'rtp' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">진단 등급/레벨</label>
                  <input
                    type="text"
                    value={editRtpForm.evaluatedLevel}
                    onChange={e => setEditRtpForm({ ...editRtpForm, evaluatedLevel: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] truncate">어휘 (Vocab)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editRtpForm.vocabulary}
                      onChange={e => setEditRtpForm({ ...editRtpForm, vocabulary: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] truncate">문법 (Grammar)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editRtpForm.grammar}
                      onChange={e => setEditRtpForm({ ...editRtpForm, grammar: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] truncate">독해 (Reading)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editRtpForm.reading}
                      onChange={e => setEditRtpForm({ ...editRtpForm, reading: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] truncate">듣기 (Listen)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editRtpForm.listening}
                      onChange={e => setEditRtpForm({ ...editRtpForm, listening: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[10px] truncate">구문 (Syntax)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editRtpForm.syntax}
                      onChange={e => setEditRtpForm({ ...editRtpForm, syntax: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">핵심 강점 목록 (줄바꿈으로 구분)</label>
                  <textarea
                    rows={3}
                    value={editRtpForm.keyStrengthsText}
                    onChange={e => setEditRtpForm({ ...editRtpForm, keyStrengthsText: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">보완 필요 약점 목록 (줄바꿈으로 구분)</label>
                  <textarea
                    rows={3}
                    value={editRtpForm.keyWeaknessesText}
                    onChange={e => setEditRtpForm({ ...editRtpForm, keyWeaknessesText: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveEditSection(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveRtp}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: STT Section */}
            {activeEditSection === 'stt' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">음성 파일명</label>
                    <input
                      type="text"
                      value={editSttForm.audioFileName}
                      onChange={e => setEditSttForm({ ...editSttForm, audioFileName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">녹음 분량</label>
                    <input
                      type="text"
                      value={editSttForm.audioDuration}
                      onChange={e => setEditSttForm({ ...editSttForm, audioDuration: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">STT AI 요약 포인트 (줄바꿈으로 구분)</label>
                  <textarea
                    rows={4}
                    value={editSttForm.aiSummaryText}
                    onChange={e => setEditSttForm({ ...editSttForm, aiSummaryText: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">핵심 태그 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={editSttForm.keyTagsText}
                    onChange={e => setEditSttForm({ ...editSttForm, keyTagsText: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveEditSection(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveStt}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: Prescription Section */}
            {activeEditSection === 'prescription' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">이달의 핵심 달성 목표</label>
                  <input
                    type="text"
                    value={editPrescriptionForm.monthlyGoal}
                    onChange={e => setEditPrescriptionForm({ ...editPrescriptionForm, monthlyGoal: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">추천 커리큘럼</label>
                    <input
                      type="text"
                      value={editPrescriptionForm.recommendedCurriculum}
                      onChange={e => setEditPrescriptionForm({ ...editPrescriptionForm, recommendedCurriculum: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">일일 과제 분량</label>
                    <input
                      type="text"
                      value={editPrescriptionForm.homeworkLoad}
                      onChange={e => setEditPrescriptionForm({ ...editPrescriptionForm, homeworkLoad: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">주간 학습 스케줄</label>
                  <input
                    type="text"
                    value={editPrescriptionForm.weeklyStudyPlan}
                    onChange={e => setEditPrescriptionForm({ ...editPrescriptionForm, weeklyStudyPlan: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">컨설턴트의 한마디 메시지</label>
                  <textarea
                    rows={3}
                    value={editPrescriptionForm.counselorMessage}
                    onChange={e => setEditPrescriptionForm({ ...editPrescriptionForm, counselorMessage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setActiveEditSection(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSavePrescription}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
