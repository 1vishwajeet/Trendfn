import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { TRENDS, Category, Trend } from '../data/trends';

const CATEGORIES: { label: string; value: Category | 'ALL'; emoji: string }[] = [
  { label: 'ALL', value: 'ALL', emoji: '🔥' },
  { label: 'FINANCE', value: 'FINANCE', emoji: '📈' },
  { label: 'BUSINESS', value: 'BUSINESS', emoji: '💼' },
  { label: 'SPORTS', value: 'SPORTS', emoji: '🏏' },
  { label: 'FUNNY', value: 'FUNNY', emoji: '😂' },
  { label: 'TECH', value: 'TECH', emoji: '🤖' },
];

const hotnessColor: Record<string, string> = {
  NUCLEAR: 'text-red-400',
  INFERNO: 'text-orange-400',
  BLAZING: 'text-yellow-400',
  HOT: 'text-amber-400',
};

const hotnessBg: Record<string, string> = {
  NUCLEAR: 'bg-red-500/10 border-red-500/30',
  INFERNO: 'bg-orange-500/10 border-orange-500/30',
  BLAZING: 'bg-yellow-500/10 border-yellow-500/30',
  HOT: 'bg-amber-400/10 border-amber-400/30',
};

interface Props {
  onSelectTrend: (trend: Trend) => void;
  trends?: Trend[];
}

export default function TrendRadar({ onSelectTrend, trends }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');

  const source = trends && trends.length > 0 ? trends : TRENDS;
  const filtered =
    activeCategory === 'ALL' ? source : source.filter((t) => t.category === activeCategory);

  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500 blink-dot pulse-red" />
          <span className="text-red-500 text-xs font-bold tracking-widest uppercase">Live Radar</span>
        </div>
        <h2 className="font-clash text-5xl text-white">TRENDING NOW</h2>
        <p className="text-zinc-500 mt-2 text-sm">Pick a trend. Meme-ify it. Post before they do.</p>
      </motion.div>

      {/* Category Bar */}
      <div className="sticky top-0 z-40 py-3 bg-black/90 backdrop-blur-xl mb-8 -mx-4 px-4 border-b border-zinc-900">
        <div className="flex gap-2 overflow-x-auto horizontal-scroll pb-1">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-sm font-bold text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer border ${
                activeCategory === cat.value
                  ? 'cat-active'
                  : 'glass text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bento-grid"
        >
          {filtered.map((trend, i) => (
            <TrendCard key={trend.id} trend={trend} index={i} onSelect={onSelectTrend} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TrendCard({
  trend,
  index,
  onSelect,
}: {
  trend: Trend;
  index: number;
  onSelect: (t: Trend) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group glass neon-border-hover rounded-sm p-5 cursor-pointer relative overflow-hidden"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={() => onSelect(trend)}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-all duration-300" />

      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold border ${hotnessBg[trend.hotnessLabel]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-current blink-dot ${hotnessColor[trend.hotnessLabel]}`} />
          <span className={hotnessColor[trend.hotnessLabel]}>{trend.hotnessLabel}</span>
        </div>
        <span className="text-zinc-600 text-xs">{trend.timeAgo}</span>
      </div>

      {/* Emoji */}
      <div className="text-3xl mb-3">{trend.emoji}</div>

      {/* Headline */}
      <h3 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-red-100 transition-colors">
        {trend.headline}
      </h3>

      {/* Subtext */}
      <p className="text-zinc-500 text-xs leading-relaxed mb-4">{trend.subtext}</p>

      {/* Heat bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-zinc-600 uppercase tracking-widest">Heat</span>
          <span className={`font-bold ${hotnessColor[trend.hotnessLabel]}`}>{trend.hotness}%</span>
        </div>
        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${trend.hotness}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7f1d1d, #ff0000)' }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {trend.tags.map((tag) => (
          <span key={tag} className="text-xs text-zinc-600 px-2 py-0.5 bg-zinc-900/80 rounded-sm">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600/0 border border-red-600/30 group-hover:bg-red-600 group-hover:border-red-600 text-red-400 group-hover:text-white font-bold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(trend);
        }}
      >
        <Flame size={13} />
        MEME-IFY THIS
      </motion.button>
    </motion.div>
  );
}
