import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Award,
  Phone,
  School,
  Target,
  Sparkles,
  ChevronRight,
  X,
  User,
  CheckCircle2
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    settings,
    setCurrentView,
    setActiveDraftStudentId,
    consultationReports,
    openParentPreview
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    grade: '중학교 3학년',
    school: '',
    targetGoal: '',
    parentName: '',
    parentPhone: '',
    studentPhone: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: '재원중',
    notes: ''
  });

  const handleOpenAddModal = () => {
    setSelectedStudentForModal(null);
    setFormData({
      name: '',
      grade: '중학교 3학년',
      school: '',
      targetGoal: '수능 영어 1등급 & 내신 만점',
      parentName: '',
      parentPhone: '',
      studentPhone: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: '재원중',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setSelectedStudentForModal(student);
    setFormData({
      name: student.name,
      grade: student.grade,
      school: student.school,
      targetGoal: student.targetGoal,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      studentPhone: student.studentPhone,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
      notes: student.notes
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.school) {
      alert('학생 이름과 학교명을 입력해주세요.');
      return;
    }

    if (selectedStudentForModal) {
      updateStudent(selectedStudentForModal.id, formData);
    } else {
      addStudent(formData);
    }

    setIsAddModalOpen(false);
  };

  const filteredStudents = students.filter(s => {
    const matchesFilter = filterStatus === '전체' || s.status === filterStatus;
    const matchesSearch =
      s.name.includes(searchQuery) ||
      s.school.includes(searchQuery) ||
      s.grade.includes(searchQuery) ||
      s.parentName.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="학생명, 학교, 학년 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-400/40 w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {['전체', '재원중', '상담예정', '휴원'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Add Student Button */}
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <UserPlus className="w-4 h-4" />
          <span>신규 학생 등록</span>
        </button>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((s) => {
          const studentReports = consultationReports.filter(r => r.studentId === s.id);
          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 font-bold text-base flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{s.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          s.status === '재원중'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.status === '상담예정'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <School className="w-3.5 h-3.5" />
                        <span>{s.school} ({s.grade})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`${s.name} 학생 정보를 삭제하시겠습니까?`)) {
                          deleteStudent(s.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Target & Contacts */}
                <div className="p-3 bg-slate-50/80 rounded-xl space-y-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">목표:</span>
                    <span className="text-slate-600 line-clamp-1">{s.targetGoal || '목표 설정 전'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      학부모({s.parentName}): {s.parentPhone}
                    </span>
                    <span>등록일: {s.enrollmentDate}</span>
                  </div>
                </div>

                {/* Latest RTP Score Badge */}
                {s.latestRtp ? (
                  <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-900 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        최신 RTP 진단 평가
                      </span>
                      <span className="font-extrabold text-indigo-700 text-sm">
                        {s.latestRtp.overallScore}점
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-medium">
                      <div className="p-1 bg-white rounded border border-indigo-100">
                        <div className="text-slate-400 text-[9px]">어휘</div>
                        <div className="font-bold text-slate-800">{s.latestRtp.vocabulary}</div>
                      </div>
                      <div className="p-1 bg-white rounded border border-indigo-100">
                        <div className="text-slate-400 text-[9px]">문법</div>
                        <div className="font-bold text-slate-800">{s.latestRtp.grammar}</div>
                      </div>
                      <div className="p-1 bg-white rounded border border-indigo-100">
                        <div className="text-slate-400 text-[9px]">독해</div>
                        <div className="font-bold text-slate-800">{s.latestRtp.reading}</div>
                      </div>
                      <div className="p-1 bg-white rounded border border-indigo-100">
                        <div className="text-slate-400 text-[9px]">듣기</div>
                        <div className="font-bold text-slate-800">{s.latestRtp.listening}</div>
                      </div>
                      <div className="p-1 bg-white rounded border border-indigo-100">
                        <div className="text-slate-400 text-[9px]">구문</div>
                        <div className="font-bold text-slate-800">{s.latestRtp.syntax}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                    아직 등록된 RTP 평가 결과가 없습니다.
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDetailStudent(s)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex-1"
                >
                  상세 이력
                </button>
                <button
                  onClick={() => {
                    setActiveDraftStudentId(s.id);
                    setCurrentView('consultation');
                  }}
                  className="px-3 py-1.5 rounded-lg text-white font-semibold text-xs transition-colors flex-1 flex items-center justify-center gap-1 shadow-2xs"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>결과지 작성</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {selectedStudentForModal ? '학생 정보 수정' : '신규 학생 등록'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">학생 이름 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 김다이브"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">학년 *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="초등학교 5학년">초등학교 5학년</option>
                    <option value="초등학교 6학년">초등학교 6학년</option>
                    <option value="중학교 1학년">중학교 1학년</option>
                    <option value="중학교 2학년">중학교 2학년</option>
                    <option value="중학교 3학년">중학교 3학년</option>
                    <option value="고등학교 1학년">고등학교 1학년</option>
                    <option value="고등학교 2학년">고등학교 2학년</option>
                    <option value="고등학교 3학년">고등학교 3학년</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">학교명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 다이브중학교"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">재원 상태</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="재원중">재원중</option>
                    <option value="상담예정">상담예정</option>
                    <option value="휴원">휴원</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">목표 대학/고교 및 성적 목표</label>
                <input
                  type="text"
                  placeholder="예: 자사고 진학 & 수능 1등급 안정권"
                  value={formData.targetGoal}
                  onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">학부모 성함</label>
                  <input
                    type="text"
                    placeholder="예: 김민선"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">학부모 연락처</label>
                  <input
                    type="text"
                    placeholder="예: 010-3892-1204"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">특이사항 및 비고</label>
                <textarea
                  rows={2}
                  placeholder="독해 속도가 빠른 편이나 어법 정밀도 보완 필요 등..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold shadow-sm"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {selectedStudentForModal ? '수정 완료' : '학생 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Drawer Modal */}
      {detailStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-base">
                  {detailStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{detailStudent.name} 학생 상세 프로필</h3>
                  <p className="text-xs text-slate-500">{detailStudent.school} ({detailStudent.grade})</p>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 font-medium">목표:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{detailStudent.targetGoal}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">학부모 연락처:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{detailStudent.parentName} ({detailStudent.parentPhone})</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">등록일:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{detailStudent.enrollmentDate}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">상태:</span>
                  <div className="font-bold text-emerald-700 mt-0.5">{detailStudent.status}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>RTP 진단 성적 이력</span>
                </h4>
                {detailStudent.latestRtp ? (
                  <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 text-sm">
                        종합 {detailStudent.latestRtp.overallScore}점 ({detailStudent.latestRtp.evaluatedLevel})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-semibold text-slate-700">강점:</div>
                      <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                        {detailStudent.latestRtp.keyStrengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-semibold text-slate-700">보완 필요 약점:</div>
                      <ul className="list-disc list-inside text-rose-700 space-y-1 pl-1">
                        {detailStudent.latestRtp.keyWeaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">등록된 RTP 성적이 없습니다.</p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">작성된 상담 결과지 이력</h4>
                {consultationReports.filter(r => r.studentId === detailStudent.id).map(r => (
                  <div
                    key={r.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => openParentPreview(r)}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{r.category} ({r.consultationDate})</div>
                      <div className="text-[11px] text-slate-500">컨설턴트: {r.counselorName} | 점수: {r.rtpData.overallScore}점</div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      미리보기 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
