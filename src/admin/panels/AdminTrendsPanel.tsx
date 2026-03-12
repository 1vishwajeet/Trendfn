import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Check, Flame, Search } from 'lucide-react';
import { Category } from '../../data/trends';
import { AdminTrend } from '../../store/adminStore';

const CATEGORIES: Category[] = ['FINANCE', 'BUSINESS', 'SPORTS', 'FUNNY', 'TECH'];
const HOTNESS_LABELS = ['NUCLEAR', 'INFERNO', 'BLAZING', 'HOT'];
const MOOD_TAGS = ['HYPE', 'PAIN', 'LOL', 'WIN', 'SAD', 'CHAOS', 'GRIND', 'PRIDE', 'WOW'];

const CATEGORY_EMOJI: Record<string, string> = {
  FINANCE: '📈',
  BUSINESS: '💼',
  SPORTS: '🏏',
  FUNNY: '😂',
  TECH: '🤖',
};

interface Props {
  store: any;
}

const EMPTY_FORM = {
  headline: '',
  subtext: '',
  category: 'TECH' as Category,
  hotness: 80,
  hotnessLabel: 'HOT',
  emoji: '🔥',
  tags: '',
  timeAgo: 'Just now',
  moodTag: 'HYPE',
  active: true,
};

export default function AdminTrendsPanel({ store }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<'ALL' | Category>('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { state, addTrend, updateTrend, deleteTrend, toggleTrend } = store;

  const filtered = state.trends.filter((t: AdminTrend) => {
    const matchSearch =
      t.headline.toLowerCase().includes(search.toLowerCase()) ||
      t.subtext.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'ALL' || t.category === filterCat;
    return matchSearch && matchCat;
  });

  function openAdd() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(trend: AdminTrend) {
    setForm({
      headline: trend.headline,
      subtext: trend.subtext,
      category: trend.category,
      hotness: trend.hotness,
      hotnessLabel: trend.hotnessLabel,
      emoji: trend.emoji,
      tags: trend.tags.join(', '),
      timeAgo: trend.timeAgo,
      moodTag: trend.moodTag,
      active: trend.active,
    });
    setEditingId(trend.id);
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.headline.trim()) return;
    const data = {
      headline: form.headline,
      subtext: form.subtext,
      category: form.category,
      hotness: form.hotness,
      hotnessLabel: form.hotnessLabel,
      emoji: form.emoji,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      timeAgo: form.timeAgo,
      moodTag: form.moodTag,
      active: form.active,
    };
    if (editingId) {
      updateTrend(editingId, data);
    } else {
      addTrend(data);
    }
    setShowForm(false);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      deleteTrend(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-clash text-2xl text-white">TRENDING NEWS</h2>
          <p className="text-zinc-600 text-xs mt-0.5">
            {state.trends.length} total · {state.trends.filter((t: AdminTrend) => t.active).length}{' '}
            active
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold text-xs tracking-widest uppercase rounded-sm cursor-pointer"
          style={{ boxShadow: '0 0 15px #ff000050' }}
        >
          <Plus size={14} />
          ADD NEWS TREND
        </motion.button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trends..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm pl-9 pr-4 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['ALL', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat as any)}
              className={`px-3 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all cursor-pointer border ${
                filterCat === cat
                  ? 'bg-red-600 text-white border-red-600'
                  : 'glass text-zinc-500 hover:text-white border-zinc-800'
              }`}
            >
              {cat === 'ALL' ? '🔥 ALL' : `${CATEGORY_EMOJI[cat]} ${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Trends List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-700">
              <Flame size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No trends found. Add one above!</p>
            </div>
          )}
          {filtered.map((trend: AdminTrend, i: number) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.03 }}
              className={`glass rounded-sm border transition-all ${
                trend.active ? 'border-zinc-900' : 'border-zinc-900/50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Emoji */}
                <div className="text-2xl flex-shrink-0">{trend.emoji}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold text-sm truncate">{trend.headline}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-zinc-900 text-zinc-500 rounded-sm flex-shrink-0">
                      {trend.category}
                    </span>
                    <span className="text-xs text-red-400 font-bold flex-shrink-0">
                      {trend.hotness}%
                    </span>
                  </div>
                  <p className="text-zinc-600 text-xs mt-0.5 truncate">{trend.subtext}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {trend.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs text-zinc-700">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-zinc-700 text-xs">· {trend.timeAgo}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleTrend(trend.id)}
                    title={trend.active ? 'Deactivate' : 'Activate'}
                    className={`p-2 rounded-sm border transition-all cursor-pointer ${
                      trend.active
                        ? 'text-green-400 border-green-900/40 hover:bg-green-900/20'
                        : 'text-zinc-600 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {trend.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(trend)}
                    className="p-2 rounded-sm border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(trend.id)}
                    className={`p-2 rounded-sm border transition-all cursor-pointer ${
                      deleteConfirm === trend.id
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-900/40'
                    }`}
                    title={deleteConfirm === trend.id ? 'Click again to confirm delete' : 'Delete'}
                  >
                    {deleteConfirm === trend.id ? <Check size={14} /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-zinc-800 rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-900">
                <h3 className="font-clash text-xl text-white tracking-wider">
                  {editingId ? 'EDIT TREND' : 'ADD NEW TREND'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 text-zinc-600 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form fields */}
              <div className="p-5 space-y-4">
                {/* Headline */}
                <div>
                  <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                    Headline *
                  </label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                    placeholder="IPL Finals: Last Over Drama..."
                    className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700"
                  />
                </div>

                {/* Subtext */}
                <div>
                  <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                    Subtext / Description
                  </label>
                  <textarea
                    value={form.subtext}
                    onChange={(e) => setForm({ ...form, subtext: e.target.value })}
                    placeholder="Short description of the trend..."
                    rows={2}
                    className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700 resize-none"
                  />
                </div>

                {/* Emoji + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={form.emoji}
                      onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                      placeholder="🔥"
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hotness + Label */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Heat Score: <span className="text-red-400">{form.hotness}%</span>
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={form.hotness}
                      onChange={(e) => setForm({ ...form, hotness: Number(e.target.value) })}
                      className="w-full accent-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Hotness Label
                    </label>
                    <select
                      value={form.hotnessLabel}
                      onChange={(e) => setForm({ ...form, hotnessLabel: e.target.value })}
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      {HOTNESS_LABELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mood Tag + Time Ago */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Mood Tag
                    </label>
                    <select
                      value={form.moodTag}
                      onChange={(e) => setForm({ ...form, moodTag: e.target.value })}
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      {MOOD_TAGS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Time Ago
                    </label>
                    <input
                      type="text"
                      value={form.timeAgo}
                      onChange={(e) => setForm({ ...form, timeAgo: e.target.value })}
                      placeholder="5 min ago"
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="IPL, Cricket, India, Viral"
                    className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700"
                  />
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-400 text-sm font-medium">Active / Visible</span>
                  <button
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${
                      form.active ? 'bg-red-600' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                        form.active ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 glass text-zinc-500 hover:text-white font-bold text-xs tracking-widest uppercase rounded-sm border border-zinc-800 transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.headline.trim()}
                    className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    style={{ boxShadow: '0 0 15px #ff000050' }}
                  >
                    {editingId ? 'SAVE CHANGES' : 'ADD TREND'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
