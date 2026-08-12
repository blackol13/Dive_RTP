import { Student, ConsultationReport, Post, AcademySettings } from '../types';

export const initialAcademySettings: AcademySettings = {
  academyName: '다이브 영어학원',
  academySubTitle: 'Dive English Academy - 몰입형 최고위 영어교육',
  primaryColor: '#1E3A8A', // Deep Dive Navy Blue
  fontFamily: 'font-sans',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
  contactNumber: '02-555-8901',
  address: '서울특별시 강남구 대치동 980 다이브타워 3층',
  principalName: '박다이브 원장',
  kakaoNoticeTemplate: '[다이브 영어학원] 안녕하세요 {학부모성함} 어머니, {학생이름} 학생의 최신 스마트 상담 결과지가 작성되었습니다. 아래 링크에서 확인하실 수 있습니다:\n{결과지링크}'
};

export const initialStudents: Student[] = [
  {
    id: 'std-1',
    name: '김다이브',
    grade: '중학교 3학년',
    school: '다이브중학교',
    targetGoal: '외고/자사고 진학 & 수능 영어 1등급 안정권',
    parentName: '김민선',
    parentPhone: '010-3892-1204',
    studentPhone: '010-8841-2039',
    enrollmentDate: '2025-03-02',
    status: '재원중',
    notes: '독해 속도가 매우 빠른 편이나, 고난도 관계사 구문 분석과 어휘 미세 유의어 구분에서 오답이 발생함.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    latestRtp: {
      vocabulary: 88,
      grammar: 68,
      reading: 92,
      listening: 95,
      syntax: 74,
      overallScore: 83.4,
      evaluatedLevel: 'High-Intermediate (Level 4)',
      keyStrengths: ['듣기 완벽 이해 (95점)', '장문 장르별 빠른 스키밍 독해 능력 (92점)'],
      keyWeaknesses: ['복합 관계대명사 및 도치 구문 분석 (68점)', '고급 수능 유의어/반의어 정밀도 (88점)']
    }
  },
  {
    id: 'std-2',
    name: '이서준',
    grade: '고등학교 1학년',
    school: '대치고등학교',
    targetGoal: '고교 내신 1등급 & 수능 95점 이상',
    parentName: '이혜영',
    parentPhone: '010-5512-9011',
    studentPhone: '010-4412-8822',
    enrollmentDate: '2025-06-15',
    status: '재원중',
    notes: '어휘량이 풍부하나 내신형 서술어 문법 빈칸 문제에서 실수가 빈번함.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    latestRtp: {
      vocabulary: 94,
      grammar: 81,
      reading: 86,
      listening: 90,
      syntax: 80,
      overallScore: 86.2,
      evaluatedLevel: 'Advanced (Level 5)',
      keyStrengths: ['어휘 수능 심화 3,000자 완벽 암기', '듣기 3점 문항 감점 없음'],
      keyWeaknesses: ['내신 변형 서술형 문법 조건 작성']
    }
  },
  {
    id: 'std-3',
    name: '박지민',
    grade: '중학교 2학년',
    school: '도곡중학교',
    targetGoal: '중등 내신 만점 & 고등 수능 영단어 선행',
    parentName: '박성훈',
    parentPhone: '010-7721-3304',
    studentPhone: '010-2291-7711',
    enrollmentDate: '2025-09-01',
    status: '재원중',
    notes: '기초 문법 개념 정리 필요. 1:1 맞춤 클리닉 진행 중.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    latestRtp: {
      vocabulary: 72,
      grammar: 60,
      reading: 75,
      listening: 85,
      syntax: 62,
      overallScore: 70.8,
      evaluatedLevel: 'Intermediate (Level 3)',
      keyStrengths: ['듣기 흐름 파악 및 핵심 주제 파악'],
      keyWeaknesses: ['시제 일치 및 분사구문 문법', '기초 다의어 암기 부족']
    }
  },
  {
    id: 'std-4',
    name: '최현우',
    grade: '고등학교 2학년',
    school: '휘문고등학교',
    targetGoal: '의치한약수 진학 / 수능 절대평가 영어 1등급 확정',
    parentName: '정경숙',
    parentPhone: '010-9988-1122',
    studentPhone: '010-3321-9988',
    enrollmentDate: '2024-11-10',
    status: '재원중',
    notes: '빈칸 추론 및 순서 배열 최고난도 문제 전담 집중 관리 중.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    latestRtp: {
      vocabulary: 98,
      grammar: 92,
      reading: 90,
      listening: 98,
      syntax: 94,
      overallScore: 94.4,
      evaluatedLevel: 'Honor Master (Level 6)',
      keyStrengths: ['어휘 및 서술형 문법 극상위권', '듣기 만점 유지'],
      keyWeaknesses: ['3점 고난도 철학/과학 빈칸추론 34번 오답']
    }
  }
];

export const initialConsultationReports: ConsultationReport[] = [
  {
    id: 'rpt-101',
    studentId: 'std-1',
    studentName: '김다이브',
    grade: '중학교 3학년',
    school: '다이브중학교',
    consultationDate: '2026-08-10',
    counselorName: '박다이브 원장',
    category: '정기 성취도 상담',
    rtpData: {
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
    },
    sttData: {
      audioFileName: '20260810_김다이브_학부모상담.mp3',
      audioDuration: '14분 32초',
      transcript: '원장: 어머니 안녕하세요, 다이브 영어학원 박다이브 원장입니다. 오늘 다이브 학생의 8월 RTP 진단평가 결과와 학원 수업 참여도에 대해 말씀드리려고 합니다.\n학부모: 네 원장님! 아이가 집에서 독해는 재밌어하는데 문법 문제를 풀 때는 가끔 자신 없어 하더라고요.\n원장: 정확하게 보셨습니다. 이번 RTP 결과를 보면 독해와 듣기는 90점대로 자사고 진학 기준 상위 5% 이내 수준입니다. 하지만 어법 파트에서 특히 관계대명사의 생략과 도치구문에서 점수가 약간 깎였습니다.\n학부모: 그렇군요. 그럼 앞으로 어떤 교재와 과제로 보완하게 되나요?\n원장: 저희 다이브 고난도 구문 클리닉 교재로 주 2회 1:1 맞춤 피드백을 진행할 예정입니다. 9월 중간고사 내신 100점과 함께 수능 1등급 단어 500개 완성을 이번 달 목표로 잡았습니다.',
      aiSummary: [
        '📌 **독해 및 듣기 극상위권**: 독해(92점), 듣기(95점) 영역은 자사고 진학 가능 기준 상위 5% 이내의 높은 숙달도를 보임.',
        '📌 **문법/구문 집중 클리닉 필요**: 관계대명사 구문 및 도치 문장 분석(68점)에서 오답 발생으로, 1:1 맞춤 클리닉 주 2회 편성.',
        '📌 **9월 달성 목표**: 9월 중학 내신 만점 달성 및 수능 필수 어휘 500개 암기 테스트 통과를 최우선 목표로 설정함.'
      ],
      keyTags: ['독해 우수', '문법 보완', '자사고 대비', '1:1 클리닉']
    },
    teacherPrescription: {
      monthlyGoal: '8월 수능 고난도 어휘 500자 완성 & 9월 내신 대비 서술형 문법 만점',
      recommendedCurriculum: '다이브 Level 4 심화 독해 & 고등 구문 어법 300제 클리닉',
      weeklyStudyPlan: '월/수: 독해 모의고사 2회분 + 화/목: 구문 노트 정리 & 금: 주간 단어 150자 테스트',
      homeworkLoad: '하루 약 45분 분량 (단어 30개 암기 + 구문 분석 5지문)',
      counselorMessage: '다이브 학생은 독해 감각이 훌륭하여 고등 선행 속도를 한 단계 올릴 수 있는 잠재력이 풍부합니다. 약점인 문법 구문만 꼼꼼히 다져주면 자사고 입학 후에도 안정적인 영어 1등급을 유지할 것입니다.'
    },
    createdAt: '2026-08-10 16:30',
    sharedLinkToken: 'dive-report-kim-20260810'
  }
];

export const initialPosts: Post[] = [
  {
    id: 'post-1',
    title: '📢 2026학년도 2학기 수능 대비 및 내신 밀착 케어 프로그램 개강 안내',
    category: '공지사항',
    content: '안녕하세요. 다이브 영어학원입니다.\n2026학년도 2학기를 맞아 중/고등부 대상 수능 최저학력기준 달성 및 내신 만점 대비반이 개강합니다.\n\n■ 개강일: 2026년 9월 1일(월)\n■ 대상: 중2 ~ 고2 재원생\n■ 주요 프로그램:\n1) RTP(Reading & Testing Placement) 기반 주간 성취도 진단\n2) AI 음성 상담 요약 및 1:1 학습 처방전 발송\n3) 강남 대치동 기출 기반 서술형 감점 제로 클리닉\n\n자세한 상담은 학원 데스크(02-555-8901)로 문의 바랍니다.',
    author: '박다이브 원장',
    date: '2026-08-08',
    views: 342,
    isImportant: true,
    tags: ['개강안내', '내신대비', '수능영어']
  },
  {
    id: 'post-2',
    title: '💡 [학부모 교육 칼럼] 고등 영어 1등급을 결정짓는 중3 어휘 및 구문 분석 전략',
    category: '교육정보',
    content: '중학교 성적이 90점 이상이라도 고등학교 진학 후 3등급으로 하락하는 원인은 무엇일까요?\n핵심은 바로 단순 단어 암기가 아닌 "문맥 속 수능 다의어"와 "긴 주어 구조를 파악하는 구문 분석력"입니다.\n\n다이브 영어학원에서는 문장 구조를 직관적으로 분석하는 RTP 테스트 및 AI 오답 패턴 분석으로 학생 개별 약점을 정확하게 진단합니다.',
    author: '다이브 입시연구소',
    date: '2026-08-05',
    views: 512,
    isImportant: false,
    tags: ['교육칼럼', '어휘공부법', '고등영어']
  },
  {
    id: 'post-3',
    title: '🎯 [입시 설명회] 2027학년도 대입 영어 절대평가 및 수능 최저 전략 설명회',
    category: '입시설명회',
    content: '변화하는 수능 영어 및 대입 지형을 완벽 분석해 드립니다.\n\n- 일시: 2026년 8월 25일(화) 오후 7시\n- 장소: 다이브 영어학원 대강당 및 온라인 라이브 중계\n- 연사: 박다이브 원장 & 전 수능 출제위원 기획팀장\n\n사전 예약 학생 및 학부모님께는 1:1 RTP 테스트 무료 쿠폰을 제공합니다.',
    author: '다이브 행정실',
    date: '2026-08-01',
    views: 890,
    isImportant: true,
    tags: ['입시설명회', '수능최저', '대입전략']
  }
];
