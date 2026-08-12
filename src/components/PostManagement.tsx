import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import {
  Newspaper,
  Plus,
  Search,
  Pin,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  X,
  CheckCircle2
} from 'lucide-react';

export const PostManagement: React.FC = () => {
  const {
    posts,
    addPost,
    updatePost,
    deletePost,
    settings
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Post, 'id' | 'date' | 'views'>>({
    title: '',
    category: '공지사항',
    content: '',
    author: settings.principalName || '박다이브 원장',
    isImportant: false,
    tags: ['공지', '다이브영어']
  });
  const [tagInput, setTagInput] = useState<string>('');

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category: '공지사항',
      content: '',
      author: settings.principalName || '박다이브 원장',
      isImportant: false,
      tags: ['다이브영어', '학원소식']
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Post) => {
    setEditingPost(p);
    setFormData({
      title: p.title,
      category: p.category,
      content: p.content,
      author: p.author,
      isImportant: p.isImportant,
      tags: [...p.tags]
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    if (editingPost) {
      updatePost(editingPost.id, formData);
    } else {
      addPost(formData);
    }

    setIsModalOpen(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const filteredPosts = posts.filter(p => {
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
    const matchesSearch =
      p.title.includes(searchQuery) ||
      p.content.includes(searchQuery) ||
      p.author.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="게시글 제목, 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-400/40 w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {['전체', '공지사항', '교육정보', '입시설명회', '학습 팁'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>새 게시글 작성</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-indigo-600" />
            <span>학원 소식 및 게시글 목록 ({filteredPosts.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="p-4 w-12 text-center">중요</th>
                <th className="p-4">구분</th>
                <th className="p-4">제목</th>
                <th className="p-4">작성자</th>
                <th className="p-4">작성일</th>
                <th className="p-4 text-center">조회수</th>
                <th className="p-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-center">
                    {post.isImportant && (
                      <Pin className="w-4 h-4 text-amber-500 inline-block fill-amber-500" />
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                      post.category === '공지사항'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : post.category === '입시설명회'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div
                      onClick={() => setViewingPost(post)}
                      className="font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer text-sm tracking-tight truncate max-w-md"
                    >
                      {post.title}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{post.author}</td>
                  <td className="p-4 text-slate-500">{post.date}</td>
                  <td className="p-4 text-center text-slate-500">{post.views}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewingPost(post)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                        title="보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(post)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('이 게시글을 삭제하시겠습니까?')) {
                            deletePost(post.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingPost ? '게시글 수정' : '새 게시글 작성'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                  >
                    <option value="공지사항">공지사항</option>
                    <option value="교육정보">교육정보</option>
                    <option value="입시설명회">입시설명회</option>
                    <option value="학습 팁">학습 팁</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isImportant}
                      onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>상단 고정 중요 게시글로 지정</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">게시글 제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="제목을 입력하세요..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">본문 내용 *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="학부모님 및 공지 내용을 상세히 작성하세요..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">태그 추가</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="태그 입력 후 추가 (예: 내신대비)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium"
                    >
                      #{t}
                      <X
                        className="w-3 h-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                        onClick={() => handleRemoveTag(t)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold shadow-sm"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {editingPost ? '수정 저장' : '게시글 즉시 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewingPost && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                {viewingPost.category}
              </span>
              <button
                onClick={() => setViewingPost(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="font-extrabold text-slate-900 text-lg leading-snug">{viewingPost.title}</h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span>작성자: {viewingPost.author}</span>
              <span>작성일: {viewingPost.date}</span>
              <span>조회수: {viewingPost.views}</span>
            </div>

            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line py-2 max-h-80 overflow-y-auto">
              {viewingPost.content}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {viewingPost.tags.map((t, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
