import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Radio, GripVertical } from 'lucide-react';

interface Props {
  store: any;
}

export default function AdminTickerPanel({ store }: Props) {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { state, addTickerItem, deleteTickerItem, updateTickerItem } = store;

  function handleAdd() {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    addTickerItem(trimmed);
    setNewItem('');
  }

  function handleEdit(index: number) {
    setEditingIndex(index);
    setEditValue(state.tickerItems[index]);
  }

  function handleSaveEdit() {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      updateTickerItem(editingIndex, trimmed);
    }
    setEditingIndex(null);
    setEditValue('');
  }

  function handleDelete(index: number) {
    if (deleteConfirm === index) {
      deleteTickerItem(index);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(index);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  const QUICK_EMOJIS = ['🔥', '📈', '💼', '🏏', '😂', '🤖', '🚀', '💰', '⚡', '🎯', '📉', '🌊'];

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="font-clash text-2xl text-white">LIVE TICKER MANAGER</h2>
        <p className="text-zinc-600 text-xs mt-0.5">
          {state.tickerItems.length} items scrolling live across the site
        </p>
      </div>

      {/* Live Preview */}
      <div className="glass rounded-sm border border-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-900 bg-zinc-950/50">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full blink-dot" />
          <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
            Live Preview
          </span>
        </div>
        <div className="py-3 overflow-hidden relative">
          <div
            className="flex gap-8 whitespace-nowrap text-zinc-400 text-xs font-bold tracking-widest uppercase"
            style={{ animation: 'ticker 20s linear infinite' }}
          >
            {state.tickerItems.map((item: string, i: number) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-red-500">◆</span>
                {item}
              </span>
            ))}
            {state.tickerItems.map((item: string, i: number) => (
              <span key={`dup-${i}`} className="flex items-center gap-2">
                <span className="text-red-500">◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add new item */}
      <div className="glass rounded-sm border border-zinc-900 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={14} className="text-red-500" />
          <span className="text-white font-bold text-xs tracking-widest uppercase">
            Add Ticker Item
          </span>
        </div>

        {/* Quick emoji picker */}
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setNewItem((v) => emoji + ' ' + v.trimStart())}
              className="text-lg cursor-pointer hover:scale-125 transition-transform"
              title="Insert emoji"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="🔥 IPL Finals trending globally"
            className="flex-1 bg-zinc-950 border border-zinc-800 text-white text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-red-600 placeholder-zinc-700 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={!newItem.trim()}
            className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs tracking-widest uppercase rounded-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ boxShadow: newItem.trim() ? '0 0 15px #ff000050' : 'none' }}
          >
            <Plus size={14} />
          </motion.button>
        </div>
        <p className="text-zinc-700 text-xs mt-2">Press Enter or click + to add</p>
      </div>

      {/* Ticker items list */}
      <div className="space-y-2">
        <div className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-2">
          All Items ({state.tickerItems.length})
        </div>
        <AnimatePresence>
          {state.tickerItems.length === 0 && (
            <div className="text-center py-12 text-zinc-700">
              <Radio size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No ticker items. Add some above!</p>
            </div>
          )}
          {state.tickerItems.map((item: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-3 px-4 py-3 glass rounded-sm border border-zinc-900 group"
            >
              {/* Drag handle (visual) */}
              <GripVertical size={14} className="text-zinc-800 flex-shrink-0" />

              {/* Item number */}
              <span className="text-zinc-700 text-xs font-bold w-5 flex-shrink-0">
                {index + 1}
              </span>

              {/* Content / Edit */}
              {editingIndex === index ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                    autoFocus
                    className="flex-1 bg-zinc-950 border border-red-600/50 text-white text-sm px-3 py-1.5 rounded-sm focus:outline-none focus:border-red-600"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1.5 bg-green-600 text-white rounded-sm cursor-pointer hover:bg-green-500 transition-colors"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="p-1.5 glass text-zinc-500 hover:text-white rounded-sm border border-zinc-800 cursor-pointer transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <span className="flex-1 text-white text-sm truncate">{item}</span>
              )}

              {/* Actions (only when not editing) */}
              {editingIndex !== index && (
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-1.5 glass text-zinc-500 hover:text-white rounded-sm border border-zinc-800 cursor-pointer transition-all"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className={`p-1.5 rounded-sm border transition-all cursor-pointer ${
                      deleteConfirm === index
                        ? 'bg-red-600 text-white border-red-600'
                        : 'glass text-zinc-600 hover:text-red-400 border-zinc-800'
                    }`}
                    title={deleteConfirm === index ? 'Click again to confirm' : 'Delete'}
                  >
                    {deleteConfirm === index ? <Check size={12} /> : <Trash2 size={12} />}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
