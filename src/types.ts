export type ViewMode = 'dashboard' | 'students' | 'consultation' | 'posts' | 'settings' | 'parent-preview';

export interface RTPScore {
  vocabulary: number;
  grammar: number;
  reading: number;
  listening: number;
  syntax: number;
  overallScore: number;
  evaluatedLevel: string; // e.g., "High-Intermediate (Level 4)"
  keyStrengths: string[];
  keyWeaknesses: string[];
}

export interface Student {
  id: string;
  name: string;
  grade: string; // e.g. "중학교 3학년"
  school: string; // e.g. "다이브중학교"
  targetGoal: string; // e.g. "자사고 진학 & 수능 1등급"
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  enrollmentDate: string;
  status: '재원중' | '상담예정' | '휴원';
  notes: string;
  avatarUrl?: string;
  latestRtp?: RTPScore;
}

export interface STTData {
  audioFileName?: string;
  audioDuration?: string;
  transcript: string;
  aiSummary: string[];
  keyTags: string[];
}

export interface ConsultationReport {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  school: string;
  consultationDate: string;
  counselorName: string;
  category: '신규 입학 상담' | '정기 성취도 상담' | '내신 대비 전략' | '수능/모의고사 분석';
  rtpData: RTPScore;
  sttData: STTData;
  teacherPrescription: {
    monthlyGoal: string;
    recommendedCurriculum: string;
    weeklyStudyPlan: string;
    homeworkLoad: string;
    counselorMessage: string;
  };
  createdAt: string;
  sharedLinkToken?: string;
}

export interface Post {
  id: string;
  title: string;
  category: '공지사항' | '교육정보' | '입시설명회' | '학습 팁';
  content: string;
  author: string;
  date: string;
  views: number;
  isImportant: boolean;
  tags: string[];
}

export interface AcademySettings {
  academyName: string;
  academySubTitle: string;
  primaryColor: string; // hex code
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  logoUrl: string;
  contactNumber: string;
  address: string;
  principalName: string;
  kakaoNoticeTemplate: string;
}
