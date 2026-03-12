import { motion } from 'framer-motion';
import { Zap, TrendingUp, Target } from 'lucide-react';

interface Props {
  onEnter: () => void;
  onAdmin?: () => void;
}

export default function LandingPage({ onEnter }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-radial-red">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow orb */}
      <div className="float-orb absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full bg-red-600 opacity-5 blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass-red"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 blink-dot pulse-red" />
          <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
            Live Trending Engine — 12 Trends Active
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-clash text-7xl md:text-[9rem] leading-none mb-4 text-white"
        >
          STOP
          <br />
          <span className="text-red-500 neon-red">ADVERTISING.</span>
          <br />
          START
          <br />
          <span className="text-red-500 neon-red">TRENDING.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Don&apos;t just watch the trend.{' '}
          <span className="text-white font-semibold">Be the trend.</span>
          <br />
          We track the internet&apos;s pulse, you take the credit.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center justify-center gap-8 mb-10 text-sm"
        >
          <div className="text-center">
            <div className="font-clash text-3xl text-red-500">12K+</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest">Daily Memes</div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="text-center">
            <div className="font-clash text-3xl text-red-500">60s</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest">Trend to Download</div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="text-center">
            <div className="font-clash text-3xl text-red-500">100%</div>
            <div className="text-zinc-500 text-xs uppercase tracking-widest">Free Forever</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white font-bold text-lg tracking-widest uppercase rounded-sm overflow-hidden cursor-pointer"
          style={{ boxShadow: '0 0 30px #ff000080, 0 0 60px #ff000030' }}
        >
          <span className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Zap size={20} className="relative z-10" />
          <span className="relative z-10">ENTER THE LAB</span>
          <span className="relative z-10 opacity-60">→</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-5 text-zinc-600 text-sm"
        >
          No signup. No credit card. Just vibes.
        </motion.p>
      </div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 flex flex-wrap justify-center gap-3 mt-16 px-6"
      >
        {[
          { icon: <TrendingUp size={14} />, text: 'Real-time Trend Radar' },
          { icon: <span className="text-xs">🎭</span>, text: 'Smart Meme Matching' },
          { icon: <Target size={14} />, text: '60-Second Studio' },
          { icon: <span className="text-xs">📱</span>, text: 'Multi-Platform Export' },
          { icon: <span className="text-xs">🔥</span>, text: 'Genre Filters' },
        ].map((pill, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-zinc-400 text-xs font-medium"
          >
            <span className="text-red-500">{pill.icon}</span>
            {pill.text}
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-xs"
      >
        <span className="tracking-widest uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border border-zinc-700 rounded-full flex items-start justify-center pt-1"
        >
          <div className="w-1 h-2 bg-red-500 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
