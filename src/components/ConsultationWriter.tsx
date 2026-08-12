import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RTPScore, STTData, ConsultationReport } from '../types';
import {
  Sparkles,
  FileText,
  Upload,
  Headphones,
  CheckCircle2,
  Award,
  ArrowRight,
  Bot,
  RefreshCw,
  Play,
  Pause,
  Send,
  Eye,
  Zap,
  HelpCircle,
  FileUp,
  FileCheck2,
  X,
  FileCode
} from 'lucide-react';

export const ConsultationWriter: React.FC = () => {
  const {
    students,
    settings,
    addConsultationReport,
    openParentPreview,
    activeDraftStudentId,
    setActiveDraftStudentId
  } = useApp();

  // Step state (1: 학생 및 기본정보, 2: RTP 진단 데이터, 3: STT 음성 AI 요약, 4: 학습 처방전, 5: 완성)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    activeDraftStudentId || (students[0]?.id || '')
  );
  const [counselorName, setCounselorName] = useState<string>(settings.principalName || '박다이브 원장');
  const [consultationDate, setConsultationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState<ConsultationReport['category']>('정기 성취도 상담');

  // Step 2: RTP Data State & PDF File Upload
  const [rtpInputMode, setRtpInputMode] = useState<'pdf' | 'text'>('pdf');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [isDraggingPdf, setIsDraggingPdf] = useState<boolean>(false);

  const [rtpRawText, setRtpRawText] = useState<string>(
    `[RTP 영어 진단평가 결과]
학생명: 김다이브
평가일: 2026-08-10
어휘(Vocabulary): 88점 / 100점
문법(Grammar): 68점 / 100점 (복합관계사 및 도치 오답)
독해(Reading): 92점 / 100점 (속도 매우 양호)
듣기(Listening): 95점 / 100점
구문분석(Syntax): 74점 / 100점
종합 레벨: High-Intermediate (Level 4)`
  );
  const [isParsingRtp, setIsParsingRtp] = useState<boolean>(false);
  const [parsedRtp, setParsedRtp] = useState<RTPScore>({
    vocabulary: 88,
    grammar: 68,
    reading: 92,
    listening: 95,
    syntax: 74,
    overallScore: 83.4,
    evaluatedLevel: 'High-Intermediate (Level 4)',
    keyStrengths: [
      '듣기 평가에서 유연한 상황 파악 및 백분위 95% 기록',
      '수능형 지문 장문 독해 속도가 매우 우수함 (분당 150단어 이상 읽기 능숙)'
    ],
    keyWeaknesses: [
      '고급 문법 파트(복합 관계사, 도치 구문)에서 32% 정답률 저하',
      '긴 구문 구조에서 주어-동사 원거리 수식 구조 해석 정확도 보완 필요'
    ]
  });

  // Process selected PDF File
  const processPdfFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.type.includes('pdf') && !file.type.startsWith('image/')) {
      alert('PDF 파일(.pdf) 또는 결과지 이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    setPdfFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      setPdfBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPdf(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  // Load predefined sample PDF result sheet
  const handleLoadSamplePdf = (studentName: string) => {
    const dummyPdfContent = "JVBERi0xLjQKJ..." // Valid PDF magic header base64 sample
    const sampleFileName = `${studentName}_RTP_테스트_결과지_2026.pdf`;
    setPdfFile(new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], sampleFileName, { type: 'application/pdf' }));
    setPdfBase64('JVBERi0xLjQKJ3RleHQ=');
  };

  // Step 3: STT Audio Simulation State
  const [audioFileName, setAudioFileName] = useState<string>('20260810_상담녹음_김다이브.mp3');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>(
    `원장: 어머니 안녕하세요, 다이브 영어학원 박다이브 원장입니다. 오늘 다이브 학생의 8월 RTP 진단평가 결과와 학원 수업 참여도에 대해 말씀드리려고 합니다.
학부모: 네 원장님! 아이가 집에서 독해는 재밌어하는데 문법 문제를 풀 때는 가끔 자신 없어 하더라고요.
원장: 정확하게 보셨습니다. 이번 RTP 결과를 보면 독해와 듣기는 90점대로 자사고 진학 기준 상위 5% 이내 수준입니다. 하지만 어법 파트에서 특히 관계대명사의 생략과 도치구문에서 점수가 약간 깎였습니다.
학부모: 그렇군요. 그럼 앞으로 어떤 교재와 과제로 보완하게 되나요?
원장: 저희 다이브 고난도 구문 클리닉 교재로 주 2회 1:1 맞춤 피드백을 진행할 예정입니다. 9월 중간고사 내신 100점과 함께 수능 1등급 단어 500개 완성을 이번 달 목표로 잡았습니다.`
  );

  const [isSummarizingStt, setIsSummarizingStt] = useState<boolean>(false);
  const [sttSummary, setSttSummary] = useState<STTData>({
    audioFileName: '20260810_상담녹음_김다이브.mp3',
    audioDuration: '14분 32초',
    transcript: transcript,
    aiSummary: [
      '📌 **독해 및 듣기 극상위권**: 독해(92점), 듣기(95점) 영역은 자사고 진학 가능 기준 상위 5% 이내의 높은 숙달도를 보임.',
      '📌 **문법/구문 집중 클리닉 필요**: 관계대명사 구문 및 도치 문장 분석(68점)에서 오답 발생으로, 1:1 맞춤 클리닉 주 2회 편성.',
      '📌 **9월 달성 목표**: 9월 중학 내신 만점 달성 및 수능 필수 어휘 500개 암기 테스트 통과를 최우선 목표로 설정함.'
    ],
    keyTags: ['독해 우수', '문법 보완', '자사고 대비', '1:1 클리닉']
  });

  // Step 4: Teacher Prescription State
  const [teacherPrescription, setTeacherPrescription] = useState({
    monthlyGoal: '8월 수능 고난도 어휘 500자 완성 & 9월 내신 대비 서술형 문법 만점',
    recommendedCurriculum: '다이브 Level 4 심화 독해 & 고등 구문 어법 300제 클리닉',
    weeklyStudyPlan: '월/수: 독해 모의고사 2회분 + 화/목: 구문 노트 정리 & 금: 주간 단어 150자 테스트',
    homeworkLoad: '하루 약 45분 분량 (단어 30개 암기 + 구문 분석 5지문)',
    counselorMessage: '다이브 학생은 독해 감각이 훌륭하여 고등 선행 속도를 한 단계 올릴 수 있는 잠재력이 풍부합니다. 약점인 문법 구문만 꼼꼼히 다져주면 자사고 입학 후에도 안정적인 영어 1등급을 유지할 것입니다.'
  });

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  useEffect(() => {
    if (activeDraftStudentId) {
      setSelectedStudentId(activeDraftStudentId);
    }
  }, [activeDraftStudentId]);

  // Handler: Parse RTP Data via Gemini API (PDF File or Raw Text)
  const handleParseRtp = async () => {
    if (rtpInputMode === 'pdf' && !pdfBase64) {
      alert('RTP 테스트 결과지 PDF 파일을 먼저 업로드하시거나 선택해주세요.');
      return;
    }
    if (rtpInputMode === 'text' && !rtpRawText.trim()) {
      alert('RTP 성적표 텍스트를 입력해주세요.');
      return;
    }

    setIsParsingRtp(true);
    try {
      const payload = rtpInputMode === 'pdf' ? {
        pdfBase64,
        mimeType: pdfFile?.type || 'application/pdf',
        fileName: pdfFile?.name || 'RTP_테스트_결과지.pdf',
        studentName: activeStudent?.name,
        grade: activeStudent?.grade
      } : {
        rtpRawText,
        studentName: activeStudent?.name,
        grade: activeStudent?.grade
      };

      const res = await fetch('/api/gemini/parse-rtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setParsedRtp({
          vocabulary: data.vocabulary ?? 88,
          grammar: data.grammar ?? 72,
          reading: data.reading ?? 94,
          listening: data.listening ?? 90,
          syntax: data.syntax ?? 78,
          overallScore: data.overallScore ?? 84.4,
          evaluatedLevel: data.evaluatedLevel || 'High-Intermediate (Level 4)',
          keyStrengths: data.keyStrengths || ['독해 지문 이해도 우수', '듣기 스키밍 파트 원활'],
          keyWeaknesses: data.keyWeaknesses || ['문법 관계사/도치 구문 보완 필요', '고난도 유의어 점검']
        });
      } else {
        alert(data.error || 'RTP 파싱 실패');
      }
    } catch (err: any) {
      console.error(err);
      alert('RTP 파싱 중 네트워크 오류가 발생했습니다.');
    } finally {
      setIsParsingRtp(false);
    }
  };

  // Handler: Summarize STT Transcript via Gemini API
  const handleSummarizeStt = async () => {
    setIsSummarizingStt(true);
    try {
      const res = await fetch('/api/gemini/summarize-stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          studentName: activeStudent?.name,
          category
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSttSummary({
          audioFileName: audioFileName || '상담_음성_녹음.mp3',
          audioDuration: '12분 40초',
          transcript,
          aiSummary: data.summary || [
            '📌 상담 핵심 요약 1',
            '📌 약점 보완 계획 2',
            '📌 목표 달성 전략 3'
          ],
          keyTags: data.tags || ['학습상담', '약점보완', '목표달성']
        });
      } else {
        alert(data.error || 'STT AI 요약 실패');
      }
    } catch (err: any) {
      console.error(err);
      alert('STT AI 요약 중 오류가 발생했습니다.');
    } finally {
      setIsSummarizingStt(false);
    }
  };

  // Final Generate Report
  const handleGenerateFinalReport = () => {
    if (!activeStudent) return;

    const createdReport = addConsultationReport({
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      grade: activeStudent.grade,
      school: activeStudent.school,
      consultationDate,
      counselorName,
      category,
      rtpData: parsedRtp,
      sttData: sttSummary,
      teacherPrescription
    });

    setActiveDraftStudentId(null);
    openParentPreview(createdReport);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Wizard Progress Steps */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 max-w-3xl mx-auto">
          {[
            { step: 1, label: '1. 학생 선택' },
            { step: 2, label: '2. RTP 테스트 파싱' },
            { step: 3, label: '3. STT 음성 AI 요약' },
            { step: 4, label: '4. 강사 처방전' },
            { step: 5, label: '5. 결과지 생성' }
          ].map((s, idx) => (
            <React.Fragment key={s.step}>
              <div
                onClick={() => setCurrentStep(s.step)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  currentStep === s.step
                    ? 'text-indigo-600 scale-105 font-extrabold'
                    : currentStep > s.step
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-2xs ${
                    currentStep === s.step
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : currentStep > s.step
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > s.step ? '✓' : s.step}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {idx < 4 && <div className="h-0.5 w-8 sm:w-12 bg-slate-200"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Basic Info & Student Selection */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Step 1. 상담 기본 정보 및 대상 학생 선택</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">결과지를 생성할 재원생 및 상담 담당자 정보를 지정합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">대상 학생 선택 *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.school} / {s.grade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">상담 구분 *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400"
              >
                <option value="신규 입학 상담">신규 입학 상담</option>
                <option value="정기 성취도 상담">정기 성취도 상담</option>
                <option value="내신 대비 전략">내신 대비 전략</option>
                <option value="수능/모의고사 분석">수능/모의고사 분석</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">상담 컨설턴트 *</label>
              <input
                type="text"
                value={counselorName}
                onChange={(e) => setCounselorName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">상담 진행일 *</label>
              <input
                type="date"
                value={consultationDate}
                onChange={(e) => setConsultationDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Selected Student Profile Preview Card */}
          {activeStudent && (
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-extrabold text-indigo-900 text-sm">{activeStudent.name} 학생 선택됨</div>
                <div className="text-slate-600">
                  {activeStudent.school} ({activeStudent.grade}) | 목표: {activeStudent.targetGoal}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-semibold text-[11px]">
                {activeStudent.status}
              </span>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <span>다음: RTP 진단 파싱</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RTP Data Parsing */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <span>Step 2. RTP 테스트 결과지(PDF) 업로드 & AI 파싱</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                RTP 테스트 결과지(PDF 파일)를 직접 업로드하면, Gemini AI가 PDF를 정밀 분석하여 영역별 성적, 강점, 약점을 자동 파싱합니다.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 text-xs font-semibold">
              <button
                onClick={() => setRtpInputMode('pdf')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  rtpInputMode === 'pdf'
                    ? 'bg-white text-indigo-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>PDF 파일 업로드</span>
              </button>
              <button
                onClick={() => setRtpInputMode('text')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  rtpInputMode === 'text'
                    ? 'bg-white text-indigo-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>텍스트 직접 입력</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* Input Column */}
            <div className="space-y-3">
              {rtpInputMode === 'pdf' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-800">
                      RTP 테스트 결과지 PDF 첨부 *
                    </label>
                    <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                      Gemini AI PDF 지원
                    </span>
                  </div>

                  {/* PDF Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingPdf(true);
                    }}
                    onDragLeave={() => setIsDraggingPdf(false)}
                    onDrop={handlePdfDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all relative cursor-pointer ${
                      isDraggingPdf
                        ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
                        : pdfFile
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,application/pdf,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processPdfFile(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {pdfFile ? (
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-emerald-200 shadow-2xs text-left relative z-20">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                            PDF
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-900 truncate text-xs">{pdfFile.name}</p>
                            <p className="text-[10px] text-slate-500">
                              {(pdfFile.size / 1024).toFixed(1)} KB | RTP 성적표 준비 완료
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPdfFile(null);
                            setPdfBase64('');
                          }}
                          className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-3 space-y-2 pointer-events-none">
                        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <FileUp className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">
                            RTP 결과지 PDF 파일을 끌어다 놓거나 클릭하여 선택하세요
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            지원 형식: .pdf 문서 또는 성적표 이미지 (최대 20MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preset Sample PDF Buttons */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                      <span>빠른 시연용 샘플 RTP 결과지 선택:</span>
                      <span className="text-[10px] text-indigo-600">원클릭 테스트</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePdf(activeStudent?.name || '김다이브')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 text-[11px] font-medium flex items-center gap-1.5 transition-all"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>[{activeStudent?.name || '김다이브'}] 8월 RTP 진단결과지.pdf</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadSamplePdf('박영어')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 text-[11px] font-medium flex items-center gap-1.5 transition-all"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>[박영어] 고등수능형 RTP 분석표.pdf</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-700">RTP 원본 텍스트 직접 입력</label>
                    <button
                      type="button"
                      onClick={() => {
                        setRtpRawText(
                          `[RTP 영어 진단평가 결과]
학생명: ${activeStudent?.name || '김다이브'}
어휘(Vocabulary): 92점 / 100점
문법(Grammar): 74점 / 100점 (관계대명사 생략 구문 약점)
독해(Reading): 95점 / 100점 (장문 스키밍 매우 우수)
듣기(Listening): 90점 / 100점
구문분석(Syntax): 80점 / 100점`
                        );
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium"
                    >
                      샘플 텍스트 채우기
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={rtpRawText}
                    onChange={(e) => setRtpRawText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-indigo-400"
                    placeholder="RTP 성적표 텍스트를 복사해 붙여넣으세요..."
                  />
                </div>
              )}

              {/* Parse Action Button */}
              <button
                onClick={handleParseRtp}
                disabled={isParsingRtp || (rtpInputMode === 'pdf' && !pdfBase64)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={settings.primaryColor ? { backgroundColor: settings.primaryColor } : undefined}
              >
                {isParsingRtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI가 RTP 결과지를 정밀 분석하고 있습니다...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {rtpInputMode === 'pdf' ? 'RTP 결과지 PDF AI 파싱 실행' : 'RTP 텍스트 AI 파싱 실행'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Parsed Visual Preview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">파싱된 RTP 성적 분석 결과</span>
                  <span className="text-[10px] text-slate-500">(학생: {activeStudent?.name})</span>
                </div>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                  {parsedRtp.evaluatedLevel}
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { label: '어휘 (Vocabulary)', val: parsedRtp.vocabulary },
                  { label: '문법 (Grammar)', val: parsedRtp.grammar },
                  { label: '독해 (Reading)', val: parsedRtp.reading },
                  { label: '듣기 (Listening)', val: parsedRtp.listening },
                  { label: '구문 (Syntax)', val: parsedRtp.syntax },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <div className="flex justify-between font-semibold text-[11px] text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-bold text-slate-900">{item.val}점</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${item.val}%`,
                          backgroundColor: settings.primaryColor || '#4f46e5'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-200 text-[11px]">
                <div>
                  <span className="font-bold text-emerald-700">추출된 핵심 강점:</span>
                  <ul className="list-disc list-inside text-slate-600 pl-1 mt-0.5 space-y-0.5">
                    {parsedRtp.keyStrengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-rose-700">추출된 보완 필요 약점:</span>
                  <ul className="list-disc list-inside text-slate-600 pl-1 mt-0.5 space-y-0.5">
                    {parsedRtp.keyWeaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              이전
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <span>다음: STT 음성 AI 요약</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: STT & Audio Summary */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Headphones className="w-5 h-5 text-indigo-600" />
                <span>Step 3. 상담 음성 STT(음성인식) & AI 3~5줄 요약 생성</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">상담 녹화/녹음 파일(MP3/MP4) 시뮬레이션 또는 대화 텍스트를 AI가 3~5줄 핵심 요약합니다.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Audio Simulator Zone */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{audioFileName}</div>
                  <div className="text-[11px] text-slate-500">상담 녹음 파일 (14분 32초 / STT 자동 변환 완료)</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? '일시정지' : '음성 재생 미리보기'}</span>
                </button>
              </div>
            </div>

            {/* Transcript & AI Summary Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">상담 녹음 대화 STT 텍스트</label>
                  <button
                    onClick={() => {
                      setTranscript(
                        `원장: 어머니 안녕하세요, 다이브 영어학원 박다이브 원장입니다. 오늘 다이브 학생의 8월 RTP 진단평가 결과와 학원 수업 참여도에 대해 말씀드리려고 합니다.\n학부모: 네 원장님! 아이가 집에서 독해는 재밌어하는데 문법 문제를 풀 때는 가끔 자신 없어 하더라고요.\n원장: 정확하게 보셨습니다. 이번 RTP 결과를 보면 독해와 듣기는 90점대로 자사고 진학 기준 상위 5% 이내 수준입니다. 하지만 어법 파트에서 특히 관계대명사의 생략과 도치구문에서 점수가 약간 깎였습니다.\n학부모: 그렇군요. 그럼 앞으로 어떤 교재와 과제로 보완하게 되나요?\n원장: 저희 다이브 고난도 구문 클리닉 교재로 주 2회 1:1 맞춤 피드백을 진행할 예정입니다. 9월 중간고사 내신 100점과 함께 수능 1등급 단어 500개 완성을 이번 달 목표로 잡았습니다.`
                      );
                    }}
                    className="text-[11px] text-indigo-600 hover:underline font-semibold"
                  >
                    샘플 대화 채우기
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-indigo-400 leading-relaxed"
                />

                <button
                  onClick={handleSummarizeStt}
                  disabled={isSummarizingStt}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSummarizingStt ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gemini AI가 핵심 요약 및 태그를 추출 중...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>AI 3~5줄 요약문 자동 생성</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Summary Output Preview */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                  <span className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI 학부모 전달용 요약본
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-200/80 text-indigo-800 font-bold">
                    Gemini 3.6 Flash
                  </span>
                </div>

                <div className="space-y-2 text-slate-800 font-medium leading-relaxed">
                  {sttSummary.aiSummary.map((sum, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-indigo-100 shadow-2xs">
                      {sum}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {sttSummary.keyTags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              이전
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <span>다음: 강사 처방전 작성</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Teacher Prescription */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Step 4. 강사 처방전 및 월간 학습 목표 작성</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">학부모 결과지에 포함될 전담 선생님의 전문 학습 로드맵과 격려 메시지를 작성합니다.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">월간 핵심 목표 *</label>
              <input
                type="text"
                value={teacherPrescription.monthlyGoal}
                onChange={(e) => setTeacherPrescription({ ...teacherPrescription, monthlyGoal: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">추천 매칭 커리큘럼</label>
                <input
                  type="text"
                  value={teacherPrescription.recommendedCurriculum}
                  onChange={(e) => setTeacherPrescription({ ...teacherPrescription, recommendedCurriculum: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">일일 과제 분량</label>
                <input
                  type="text"
                  value={teacherPrescription.homeworkLoad}
                  onChange={(e) => setTeacherPrescription({ ...teacherPrescription, homeworkLoad: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">주간 학습 스케줄</label>
              <input
                type="text"
                value={teacherPrescription.weeklyStudyPlan}
                onChange={(e) => setTeacherPrescription({ ...teacherPrescription, weeklyStudyPlan: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">학부모님께 드리는 원장/강사 메시지</label>
              <textarea
                rows={4}
                value={teacherPrescription.counselorMessage}
                onChange={(e) => setTeacherPrescription({ ...teacherPrescription, counselorMessage: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-400 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              이전
            </button>
            <button
              onClick={handleGenerateFinalReport}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>학부모 스마트 결과지 생성 및 미리보기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
