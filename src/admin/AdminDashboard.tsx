import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Flame,
  Image,
  Radio,
  LogOut,
  ChevronRight,
  Activity,
} from 'lucide-react';
import AdminTrendsPanel from './panels/AdminTrendsPanel';
import AdminTemplatesPanel from './panels/AdminTemplatesPanel';
import AdminTickerPanel from './panels/AdminTickerPanel';
import AdminOverviewPanel from './panels/AdminOverviewPanel';

type AdminTab = 'overview' | 'trends' | 'templates' | 'ticker';

interface Props {
  onLogout: () => void;
  store: any;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'trends', label: 'Manage News', icon: <Flame size={16} /> },
  { id: 'templates', label: 'Meme Templates', icon: <Image size={16} /> },
  { id: 'ticker', label: 'Live Ticker', icon: <Radio size={16} /> },
];

export default function AdminDashboard({ onLogout, store }: Props) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const badgeCounts: Record<AdminTab, number | undefined> = {
    overview: undefined,
    trends: store.stats.activeTrends,
    templates: store.stats.activeTemplates,
    ticker: store.stats.totalTicker,
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 60 }}
        transition={{ duration: 0.25 }}
        className="flex-shrink-0 bg-zinc-950 border-r border-zinc-900 flex flex-col overflow-hidden"
        style={{ height: '100vh', position: 'sticky', top: 0 }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-zinc-900 flex items-center gap-3">
          <div
            className="w-9 h-9 flex-shrink-0 bg-red-600 rounded-sm flex items-center justify-center"
            style={{ boxShadow: '0 0 12px #ff000060' }}
          >
            <span className="font-clash text-white text-sm font-bold">TL</span>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="font-clash text-white text-sm tracking-widest leading-tight">
                  TREND LAB
                </div>
                <div className="text-zinc-600 text-xs">Admin Panel</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = tab === item.id;
            const badge = badgeCounts[item.id];
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <span className={active ? 'text-red-400' : 'text-zinc-600'}>{item.icon}</span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 text-left text-xs tracking-widest uppercase font-bold"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {sidebarOpen && badge !== undefined && (
                  <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-sm font-bold min-w-[20px] text-center">
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Toggle + Logout */}
        <div className="p-3 border-t border-zinc-900 space-y-2">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-zinc-600 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer text-sm"
          >
            <ChevronRight
              size={16}
              className="transition-transform duration-300"
              style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
            {sidebarOpen && (
              <span className="text-xs tracking-widest uppercase font-bold">Collapse</span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-all cursor-pointer text-sm border border-transparent hover:border-red-900/30"
          >
            <LogOut size={16} />
            {sidebarOpen && (
              <span className="text-xs tracking-widest uppercase font-bold">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-zinc-900 bg-black/95 backdrop-blur-xl px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-zinc-600 text-sm">
              {NAV_ITEMS.find((n) => n.id === tab)?.icon}
            </span>
            <h1 className="font-clash text-2xl text-white tracking-wider">
              {tab === 'overview' && 'DASHBOARD OVERVIEW'}
              {tab === 'trends' && 'MANAGE TRENDING NEWS'}
              {tab === 'templates' && 'MEME TEMPLATE LIBRARY'}
              {tab === 'ticker' && 'LIVE TICKER MANAGER'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-sm border border-zinc-800">
              <Activity size={11} className="text-red-500" />
              <span className="text-zinc-500 text-xs">
                {store.stats.activeTrends} live trends
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-sm border border-zinc-800">
              <div className="w-5 h-5 bg-red-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-zinc-400 text-xs font-bold">Admin</span>
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {tab === 'overview' && <AdminOverviewPanel store={store} onNavigate={setTab} />}
              {tab === 'trends' && <AdminTrendsPanel store={store} />}
              {tab === 'templates' && <AdminTemplatesPanel store={store} />}
              {tab === 'ticker' && <AdminTickerPanel store={store} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
