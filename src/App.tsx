import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Ticker from './components/Ticker';
import LandingPage from './components/LandingPage';
import TrendRadar from './components/TrendRadar';
import TemplateGallery from './components/TemplateGallery';
import MiniEditor from './components/MiniEditor';
import AdminPanel from './admin/AdminPanel';
import { Trend, Template } from './data/trends';
import { loadAdminState, AdminTrend, AdminTemplate } from './store/adminStore';

type AppView = 'landing' | 'radar' | 'gallery' | 'editor' | 'admin';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [_logoClickCount, setLogoClickCount] = useState(0);

  // Secret admin access: click logo 5 times
  function handleLogoClick() {
    setLogoClickCount((n) => {
      if (n + 1 >= 5) {
        setView('admin');
        return 0;
      }
      return n + 1;
    });
  }

  // Also expose /admin via hash
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setView('admin');
    }
    const handleHash = () => {
      if (window.location.hash === '#admin') setView('admin');
      else if (window.location.hash === '') setView('landing');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  function handleEnterLab() {
    setView('radar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSelectTrend(trend: Trend) {
    setSelectedTrend(trend);
    setView('gallery');
  }

  function handleSelectTemplate(template: Template) {
    setSelectedTemplate(template);
    setView('editor');
  }

  function handleBackFromGallery() {
    setView('radar');
    setSelectedTrend(null);
  }

  function handleBackFromEditor() {
    setView('gallery');
    setSelectedTemplate(null);
  }

  function handleClose() {
    setView('radar');
    setSelectedTrend(null);
    setSelectedTemplate(null);
  }

  // Load live trends/templates from admin store
  function getLiveTrends(): Trend[] {
    const adminState = loadAdminState();
    const active = adminState.trends.filter((t: AdminTrend) => t.active);
    return active.length > 0 ? active : [];
  }

  function getLiveTemplates(): Template[] {
    const adminState = loadAdminState();
    const active = adminState.templates.filter((t: AdminTemplate) => t.active);
    return active.length > 0 ? active : [];
  }

  function getLiveTickerItems(): string[] {
    const adminState = loadAdminState();
    return adminState.tickerItems;
  }

  // Admin view
  if (view === 'admin') {
    return (
      <div className="relative">
        <AdminPanel />
        {/* Exit admin button */}
        <button
          onClick={() => {
            window.location.hash = '';
            setView('landing');
          }}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 glass rounded-sm border border-zinc-800 text-zinc-500 hover:text-white hover:border-red-600/40 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer"
        >
          ← EXIT TO SITE
        </button>
      </div>
    );
  }

  const liveTrends = getLiveTrends();
  const liveTemplates = getLiveTemplates();
  const tickerItems = getLiveTickerItems();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ticker — always visible */}
      <Ticker items={tickerItems} />

      {/* Nav — only on radar view */}
      {view === 'radar' && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 border-b border-zinc-900 bg-black/95 backdrop-blur-xl px-4 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer group"
              title="Click 5 times for admin access"
            >
              <div
                className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center group-hover:shadow-[0_0_18px_#ff000080] transition-all"
                style={{ boxShadow: '0 0 12px #ff000060' }}
              >
                <span className="text-white font-bold text-xs font-clash">TL</span>
              </div>
              <div>
                <div className="font-clash text-white text-xl tracking-wider group-hover:text-red-400 transition-colors">
                  THE TREND LAB
                </div>
                <div className="text-zinc-600 text-xs tracking-widest uppercase">
                  Viral Content Engine
                </div>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 glass rounded-sm border border-zinc-800">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full blink-dot" />
                <span className="text-zinc-500 text-xs">{liveTrends.length} trends live</span>
              </div>
              <button
                onClick={() => setView('landing')}
                className="text-zinc-500 hover:text-white text-sm transition-colors cursor-pointer hidden md:block"
              >
                Home
              </button>
              <button
                onClick={() => {
                  window.location.hash = 'admin';
                  setView('admin');
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 glass rounded-sm border border-zinc-800 text-zinc-600 hover:text-white hover:border-zinc-600 text-xs font-bold transition-all cursor-pointer"
              >
                ⚙ Admin
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold text-xs tracking-widest uppercase rounded-sm cursor-pointer"
                style={{ boxShadow: '0 0 15px #ff000050' }}
              >
                🔥 RADAR
              </button>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Main Views */}
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onEnter={handleEnterLab} onAdmin={() => { window.location.hash = 'admin'; setView('admin'); }} />
            <HowItWorks onEnter={handleEnterLab} />
            <GenreSection />
            <Footer onEnter={handleEnterLab} onAdmin={() => { window.location.hash = 'admin'; setView('admin'); }} />
          </motion.div>
        )}

        {view === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrendRadar onSelectTrend={handleSelectTrend} trends={liveTrends} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Overlay */}
      <AnimatePresence>
        {view === 'gallery' && selectedTrend && (
          <TemplateGallery
            trend={selectedTrend}
            templates={liveTemplates}
            onSelectTemplate={handleSelectTemplate}
            onClose={handleBackFromGallery}
          />
        )}
      </AnimatePresence>

      {/* Editor Overlay */}
      <AnimatePresence>
        {view === 'editor' && selectedTrend && selectedTemplate && (
          <MiniEditor
            trend={selectedTrend}
            template={selectedTemplate}
            onClose={handleClose}
            onBack={handleBackFromEditor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Supporting Sections ─── */

function HowItWorks({ onEnter }: { onEnter: () => void }) {
  const steps = [
    {
      number: '01',
      title: 'THE RADAR',
      subtitle: 'Discovery',
      desc: 'Pick your genre — Finance, Sports, Business, Tech, or Funny. See what is burning on the internet RIGHT NOW.',
      emoji: '📡',
      color: 'from-red-900/30 to-transparent',
    },
    {
      number: '02',
      title: 'THE WEAPON',
      subtitle: 'Template Match',
      desc: 'Click a trend. System instantly suggests the perfect meme template based on the mood. Sad news = sad memes. Hype = hype templates.',
      emoji: '🎯',
      color: 'from-orange-900/30 to-transparent',
    },
    {
      number: '03',
      title: 'THE STRIKE',
      subtitle: 'Edit and Export',
      desc: 'Add your text, set the format (9:16 for Reels, 1:1 for Posts). Hit Generate. Download in seconds. Post before the trend dies.',
      emoji: '⚡',
      color: 'from-yellow-900/20 to-transparent',
    },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
          The 3-Step Flow
        </div>
        <h2 className="font-clash text-5xl md:text-6xl text-white mb-4">HOW THE LAB WORKS</h2>
        <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
          From news to meme in under 60 seconds. No designer. No delay. No excuses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative glass rounded-sm p-8 border border-zinc-900 hover:border-red-900/50 transition-colors group overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative z-10">
              <div className="font-clash text-7xl text-zinc-900 mb-4">{step.number}</div>
              <div className="text-4xl mb-4">{step.emoji}</div>
              <div className="text-red-500 text-xs font-bold tracking-widest uppercase mb-1">
                {step.subtitle}
              </div>
              <h3 className="font-clash text-3xl text-white mb-3">{step.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="px-8 py-4 bg-red-600 text-white font-bold tracking-widest uppercase rounded-sm cursor-pointer transition-all"
          style={{ boxShadow: '0 0 25px #ff000060' }}
        >
          ⚡ START NOW — ITS FREE
        </motion.button>
      </div>
    </section>
  );
}

function GenreSection() {
  const genres = [
    {
      emoji: '📈',
      title: 'FINANCE',
      copy: 'Market laal hai ya hara? Humare paas dono ke liye memes hain.',
      sub: 'Sensex crashes, crypto pumps, and dadi gold ATH.',
      borderHover: 'hover:border-green-800/60',
    },
    {
      emoji: '💼',
      title: 'BUSINESS',
      copy: 'Pitch decks, funding, and late-night grinds.',
      sub: 'Turn your struggle into viral gold. Founders will relate.',
      borderHover: 'hover:border-blue-800/60',
    },
    {
      emoji: '🏏',
      title: 'SPORTS',
      copy: 'Match khatam hone se pehle meme ready.',
      sub: 'Speed is the only game. Win the internet, then the match.',
      borderHover: 'hover:border-yellow-800/60',
    },
    {
      emoji: '😂',
      title: 'FUNNY',
      copy: 'Life is absurd. Your memes should be too.',
      sub: 'Go viral on pure chaos and relatable energy. That is it.',
      borderHover: 'hover:border-purple-800/60',
    },
    {
      emoji: '🤖',
      title: 'TECH',
      copy: 'AI, startups, and the future — all meme-able.',
      sub: 'Silicon Valley drama hits different when it is a meme.',
      borderHover: 'hover:border-cyan-800/60',
    },
  ];

  return (
    <section className="py-24 px-4 bg-zinc-950/50 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-red-500 text-xs font-bold tracking-widest uppercase mb-3">
            Content Categories
          </div>
          <h2 className="font-clash text-5xl md:text-6xl text-white">PICK YOUR BATTLEFIELD</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {genres.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`glass rounded-sm p-6 border border-zinc-900 ${g.borderHover} transition-all duration-300 cursor-pointer group`}
            >
              <div className="text-4xl mb-4">{g.emoji}</div>
              <div className="font-clash text-2xl text-white mb-2 group-hover:text-red-400 transition-colors">
                {g.title}
              </div>
              <p className="text-white/80 text-sm font-medium mb-2 leading-snug">{g.copy}</p>
              <p className="text-zinc-600 text-xs leading-relaxed">{g.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ onEnter, onAdmin }: { onEnter: () => void; onAdmin: () => void }) {
  return (
    <footer className="border-t border-zinc-900 py-16 px-4">
      {/* Final CTA */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="text-red-500 text-xs font-bold tracking-widest uppercase mb-4">
          Ready to go viral?
        </div>
        <h2 className="font-clash text-5xl md:text-7xl text-white mb-4 leading-none">
          THE TREND IS
          <br />
          <span className="text-shimmer">WAITING FOR YOU</span>
        </h2>
        <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
          Every second you wait, someone else is already posting.
          <br />
          Enter the lab. Make your move. Own the feed.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="px-10 py-5 bg-red-600 text-white font-bold text-lg tracking-widest uppercase rounded-sm cursor-pointer"
          style={{ boxShadow: '0 0 30px #ff000070, 0 0 60px #ff000030' }}
        >
          🔥 ENTER THE LAB — FREE
        </motion.button>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-900">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center"
            style={{ boxShadow: '0 0 10px #ff000050' }}
          >
            <span className="text-white font-bold text-xs font-clash">TL</span>
          </div>
          <div>
            <div className="font-clash text-white text-lg tracking-wider">THE TREND LAB</div>
            <div className="text-zinc-700 text-xs">Viral Content Engine — TIOFE369</div>
          </div>
        </div>

        <p className="text-zinc-600 text-sm text-center">
          Built for{' '}
          <span className="text-red-500 font-bold">Gen-Z Marketers</span> who refuse to sleep on
          trends.
        </p>

        <div className="flex items-center gap-4 text-zinc-700 text-xs">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
          <button
            onClick={onAdmin}
            className="text-zinc-800 hover:text-zinc-500 cursor-pointer transition-colors"
            title="Admin Panel"
          >
            ⚙
          </button>
          <span className="text-red-600 font-bold">© 2026</span>
        </div>
      </div>
    </footer>
  );
}
