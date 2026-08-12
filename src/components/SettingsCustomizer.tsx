import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Palette,
  Type,
  Image as ImageIcon,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';

export const SettingsCustomizer: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [isSavedToast, setIsSavedToast] = useState(false);

  const presetColors = [
    { name: '다이브 네이비 (기본)', hex: '#1E3A8A' },
    { name: '로열 블루', hex: '#2563EB' },
    { name: '딥 틸 (Teal)', hex: '#0F766E' },
    { name: '클래식 퍼플', hex: '#6D28D9' },
    { name: '버건디 크림슨', hex: '#BE123C' },
    { name: '모던 다크 그레이', hex: '#334155' }
  ];

  const presetLogos = [
    { name: '학원 가운 모자 아이콘', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80' },
    { name: '책 & 도서관 스타일', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=150&auto=format&fit=crop&q=80' },
    { name: '모던 캠퍼스 건전 로고', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            <span>학원 커스터마이징 및 브랜딩 설정</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            관리자 대시보드 및 학부모용 상담 결과지 리포트의 테마 색상, 폰트, 로고 및 발송 문구를 커스터마이징합니다.
          </p>
        </div>

        {isSavedToast && (
          <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>설정이 변경 적용되었습니다!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Columns: Settings Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Brand Primary Color */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>1. 대표 브랜드 테마 색상 (Primary Color)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presetColors.map((c) => {
                const isSelected = formData.primaryColor.toUpperCase() === c.hex.toUpperCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryColor: c.hex })}
                    className={`p-3 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/20 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full shrink-0 shadow-2xs border border-white"
                      style={{ backgroundColor: c.hex }}
                    ></div>
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.hex}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">직접 HEX 색상 코드 입력</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-1 bg-white"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs w-36 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academy Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>2. 학원 명칭 및 기본 정보</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">학원명 *</label>
                <input
                  type="text"
                  required
                  value={formData.academyName}
                  onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">원장 / 대표 컨설턴트 성명</label>
                <input
                  type="text"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">학원 서브 슬로건 / 타이틀</label>
              <input
                type="text"
                value={formData.academySubTitle}
                onChange={(e) => setFormData({ ...formData, academySubTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">대표 전화번호</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">학원 위치 주소</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: KakaoTalk Template */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>3. 학부모 전송용 카카오톡 안내문 양식</span>
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">카카오톡 전송 문구 템플릿</label>
              <textarea
                rows={4}
                value={formData.kakaoNoticeTemplate}
                onChange={(e) => setFormData({ ...formData, kakaoNoticeTemplate: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium leading-relaxed focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                사용 가능한 변수: &#123;학부모성함&#125;, &#123;학생이름&#125;, &#123;결과지링크&#125;
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-white font-bold shadow-md hover:brightness-110 flex items-center gap-2"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>설정 저장하기</span>
            </button>
          </div>
        </div>

        {/* Right 1 Column: Live Preview Card */}
        <div className="space-y-4">
          <div className="sticky top-20 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                실시간 브랜딩 미리보기
              </span>
              <span className="text-[10px] text-slate-400">학부모 결과지 적용</span>
            </div>

            {/* Live Parent Header Card Mockup */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div
                className="p-4 text-white space-y-2 transition-all"
                style={{ backgroundColor: formData.primaryColor }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-tight">{formData.academyName}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                    결과 리포트
                  </span>
                </div>
                <div className="text-base font-extrabold">김다이브 학생 상담 결과지</div>
                <div className="text-[10px] text-white/80">{formData.academySubTitle}</div>
              </div>

              <div className="p-3 bg-slate-50 space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-700">
                  <span>원장/컨설턴트:</span>
                  <span className="font-bold text-slate-900">{formData.principalName}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>연락처:</span>
                  <span className="font-bold text-slate-900">{formData.contactNumber}</span>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg text-white font-bold text-center text-xs shadow-2xs"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    학부모 전용 버튼 스타일 샘플
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              💡 <strong>팁:</strong> 선택하신 브랜딩 테마 색상은 결과지 상단 헤더, 그래프 강조선, 버튼 및 인쇄 리포트 제목 등에 자동으로 통일되어 적용됩니다.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
