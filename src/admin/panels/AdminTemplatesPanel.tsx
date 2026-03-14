import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Check, Upload, Image, Play } from 'lucide-react';
import { AdminTemplate } from '../../store/adminStore';

const GRADIENTS = [
  'from-purple-900 via-black to-red-900',
  'from-green-900 via-black to-green-950',
  'from-orange-900 via-black to-red-950',
  'from-blue-900 via-black to-purple-900',
  'from-yellow-900 via-black to-yellow-950',
  'from-red-900 via-black to-red-950',
  'from-cyan-900 via-black to-blue-950',
  'from-emerald-900 via-black to-emerald-950',
  'from-zinc-900 via-black to-zinc-950',
  'from-indigo-900 via-black to-indigo-950',
  'from-pink-900 via-black to-pink-950',
  'from-teal-900 via-black to-teal-950',
];

const MOODS = ['FUNNY', 'FINANCE', 'PAIN', 'HYPE', 'GRIND', 'SPORTS', 'CHAOS', 'WIN', 'SAD', 'WOW', 'LOL', 'PRIDE'];
const ASPECT_RATIOS = ['1:1', '9:16', '16:9', '4:5'];

const EMPTY_FORM = {
  name: '',
  type: 'PHOTO' as 'PHOTO' | 'VIDEO',
  mood: 'FUNNY',
  gradient: GRADIENTS[0],
  emoji: '🎨',
  aspectRatio: '1:1',
  active: true,
  imageUrl: '',
};

interface Props {
  store: any;
}

export default function AdminTemplatesPanel({ store }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state, addTemplate, updateTemplate, deleteTemplate, toggleTemplate } = store;

  const filtered = state.templates.filter((t: AdminTemplate) =>
    filterType === 'ALL' ? true : t.type === filterType
  );

  function openAdd() {
    setForm({ ...EMPTY_FORM });
    setPreviewUrl('');
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(t: AdminTemplate) {
    setForm({
      name: t.name,
      type: t.type,
      mood: t.mood,
      gradient: t.gradient,
      emoji: t.emoji,
      aspectRatio: t.aspectRatio,
      active: t.active,
      imageUrl: t.imageUrl || '',
    });
    setPreviewUrl(t.imageUrl || '');
    setEditingId(t.id);
    setShowForm(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPreviewUrl(url);
      setForm((f) => ({ ...f, imageUrl: url }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    const data = {
      name: form.name,
      type: form.type,
      mood: form.mood,
      gradient: form.gradient,
      emoji: form.emoji,
      aspectRatio: form.aspectRatio,
      active: form.active,
      imageUrl: form.imageUrl || undefined,
    };
    if (editingId) {
      updateTemplate(editingId, data);
    } else {
      addTemplate(data);
    }
    setShowForm(false);
    setEditingId(null);
    setPreviewUrl('');
  }

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      deleteTemplate(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-clash text-2xl text-white">MEME TEMPLATES</h2>
          <p className="text-zinc-600 text-xs mt-0.5">
            {state.templates.length} total · {state.templates.filter((t: AdminTemplate) => t.active).length} active
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
          UPLOAD TEMPLATE
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'PHOTO', 'VIDEO'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm transition-all cursor-pointer border ${
              filterType === f
                ? 'bg-red-600 text-white border-red-600'
                : 'glass text-zinc-500 hover:text-white border-zinc-800'
            }`}
          >
            {f === 'PHOTO' && <Image size={12} />}
            {f === 'VIDEO' && <Play size={12} />}
            {f}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-zinc-700">
              <Image size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No templates yet. Upload one!</p>
            </div>
          )}
          {filtered.map((template: AdminTemplate, i: number) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.04 }}
              className={`glass rounded-sm border overflow-hidden ${
                template.active ? 'border-zinc-900' : 'border-zinc-900/30 opacity-50'
              }`}
            >
              {/* Thumbnail */}
              <div className={`relative h-36 bg-gradient-to-br ${template.gradient}`}>
                {template.imageUrl ? (
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">{template.emoji}</span>
                  </div>
                )}

                {/* Overlay badges */}
                <div className="absolute top-1.5 left-1.5">
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-sm ${
                      template.type === 'VIDEO' ? 'bg-red-600 text-white' : 'bg-black/70 text-white'
                    }`}
                  >
                    {template.type}
                  </span>
                </div>
                <div className="absolute top-1.5 right-1.5">
                  <span className="text-xs bg-black/70 text-white/70 px-1.5 py-0.5 rounded-sm">
                    {template.aspectRatio}
                  </span>
                </div>

                {/* Active indicator */}
                <div
                  className={`absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full ${
                    template.active ? 'bg-green-400' : 'bg-zinc-600'
                  }`}
                />
              </div>

              {/* Info + Actions */}
              <div className="p-2.5">
                <div className="text-white text-xs font-bold truncate mb-0.5">{template.name}</div>
                <div className="text-zinc-600 text-xs mb-2">
                  {template.mood}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleTemplate(template.id)}
                    className={`flex-1 py-1.5 rounded-sm text-xs font-bold border transition-all cursor-pointer ${
                      template.active
                        ? 'border-green-900/40 text-green-500 hover:bg-green-900/20'
                        : 'border-zinc-800 text-zinc-600 hover:text-white'
                    }`}
                  >
                    {template.active ? <Eye size={11} className="mx-auto" /> : <EyeOff size={11} className="mx-auto" />}
                  </button>
                  <button
                    onClick={() => openEdit(template)}
                    className="flex-1 py-1.5 rounded-sm text-xs border border-zinc-800 text-zinc-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Edit2 size={11} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className={`flex-1 py-1.5 rounded-sm text-xs border transition-all cursor-pointer ${
                      deleteConfirm === template.id
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-zinc-800 text-zinc-600 hover:text-red-400'
                    }`}
                  >
                    {deleteConfirm === template.id ? (
                      <Check size={11} className="mx-auto" />
                    ) : (
                      <Trash2 size={11} className="mx-auto" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add / Edit Modal */}
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
              <div className="flex items-center justify-between p-5 border-b border-zinc-900">
                <h3 className="font-clash text-xl text-white tracking-wider">
                  {editingId ? 'EDIT TEMPLATE' : 'UPLOAD TEMPLATE'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 text-zinc-600 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Image / Video Upload */}
                <div>
                  <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2 block">
                    Upload Image / Video File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-sm cursor-pointer transition-all group relative overflow-hidden ${
                      previewUrl
                        ? 'border-red-600/40 h-40'
                        : 'border-zinc-800 hover:border-zinc-600 h-28'
                    }`}
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="text-white text-xs font-bold flex items-center gap-1">
                            <Upload size={13} />
                            Change File
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        <Upload size={22} />
                        <span className="text-xs font-bold tracking-widest uppercase">
                          Click to Upload
                        </span>
                        <span className="text-xs">PNG, JPG, GIF, MP4 supported</span>
                      </div>
                    )}
                  </div>
                  {previewUrl && (
                    <button
                      onClick={() => {
                        setPreviewUrl('');
                        setForm((f) => ({ ...f, imageUrl: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-1 text-xs text-red-500 hover:text-red-400 cursor-pointer"
                    >
                      Remove file
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Drake Pointing, This Is Fine..."
                    className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700"
                  />
                </div>

                {/* Type + Aspect Ratio */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Type
                    </label>
                    <div className="flex gap-2">
                      {(['PHOTO', 'VIDEO'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setForm({ ...form, type: t })}
                          className={`flex-1 py-2 text-xs font-bold rounded-sm border cursor-pointer transition-all ${
                            form.type === t
                              ? 'bg-red-600 text-white border-red-600'
                              : 'text-zinc-500 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Aspect Ratio
                    </label>
                    <select
                      value={form.aspectRatio}
                      onChange={(e) => setForm({ ...form, aspectRatio: e.target.value })}
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      {ASPECT_RATIOS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Emoji + Mood */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Emoji (fallback icon)
                    </label>
                    <input
                      type="text"
                      value={form.emoji}
                      onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                      placeholder="🎨"
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1.5 block">
                      Mood Tag
                    </label>
                    <select
                      value={form.mood}
                      onChange={(e) => setForm({ ...form, mood: e.target.value })}
                      className="w-full bg-black border border-zinc-800 text-white text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-red-600 cursor-pointer"
                    >
                      {MOODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Gradient Picker */}
                <div>
                  <label className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2 block">
                    Background Gradient (if no image)
                  </label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {GRADIENTS.map((g) => (
                      <button
                        key={g}
                        onClick={() => setForm({ ...form, gradient: g })}
                        className={`h-8 rounded-sm bg-gradient-to-br cursor-pointer transition-all border-2 ${
                          form.gradient === g ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                        } ${g}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Active */}
                <div className="flex items-center justify-between py-1">
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
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 glass text-zinc-500 hover:text-white font-bold text-xs tracking-widest uppercase rounded-sm border border-zinc-800 transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name.trim()}
                    className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ boxShadow: '0 0 15px #ff000050' }}
                  >
                    {editingId ? 'SAVE CHANGES' : 'ADD TEMPLATE'}
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
