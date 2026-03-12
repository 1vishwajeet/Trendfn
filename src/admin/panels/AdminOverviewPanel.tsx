import { motion } from 'framer-motion';
import { Flame, Image, Radio, TrendingUp, Activity, ArrowRight } from 'lucide-react';

interface Props {
  store: any;
  onNavigate: (tab: any) => void;
}

export default function AdminOverviewPanel({ store, onNavigate }: Props) {
  const { stats, state } = store;

  const statCards = [
    {
      label: 'Total Trends',
      value: stats.totalTrends,
      sub: `${stats.activeTrends} active`,
      icon: <Flame size={18} className="text-red-400" />,
      color: 'from-red-900/20 to-transparent',
      border: 'border-red-900/30',
      tab: 'trends',
    },
    {
      label: 'Meme Templates',
      value: stats.totalTemplates,
      sub: `${stats.activeTemplates} active`,
      icon: <Image size={18} className="text-purple-400" />,
      color: 'from-purple-900/20 to-transparent',
      border: 'border-purple-900/30',
      tab: 'templates',
    },
    {
      label: 'Ticker Items',
      value: stats.totalTicker,
      sub: 'Scrolling live',
      icon: <Radio size={18} className="text-blue-400" />,
      color: 'from-blue-900/20 to-transparent',
      border: 'border-blue-900/30',
      tab: 'ticker',
    },
    {
      label: 'Avg Heat Score',
      value:
        state.trends.length > 0
          ? Math.round(state.trends.reduce((a: number, t: any) => a + t.hotness, 0) / state.trends.length)
          : 0,
      sub: '% across all trends',
      icon: <TrendingUp size={18} className="text-orange-400" />,
      color: 'from-orange-900/20 to-transparent',
      border: 'border-orange-900/30',
      tab: 'trends',
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h2 className="font-clash text-3xl text-white mb-1">WAR ROOM OVERVIEW</h2>
        <p className="text-zinc-600 text-sm">
          Manage your viral content empire from here. Upload news, add templates, control the
          ticker.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            onClick={() => onNavigate(card.tab)}
            className={`glass rounded-sm p-5 border ${card.border} text-left cursor-pointer relative overflow-hidden group w-full`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-b ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}
            />
            <div className="relative z-10">
              <div className="mb-3">{card.icon}</div>
              <div className="font-clash text-4xl text-white mb-0.5">{card.value}</div>
              <div className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-0.5">
                {card.label}
              </div>
              <div className="text-zinc-600 text-xs">{card.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="glass rounded-sm p-5 border border-zinc-900">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} className="text-red-500" />
          <span className="text-white font-bold text-xs tracking-widest uppercase">
            Category Breakdown
          </span>
        </div>
        <div className="space-y-3">
          {stats.categoryBreakdown.map((item: any) => {
            const pct = stats.totalTrends > 0 ? (item.count / stats.totalTrends) * 100 : 0;
            const emoji: Record<string, string> = {
              FINANCE: '📈',
              BUSINESS: '💼',
              SPORTS: '🏏',
              FUNNY: '😂',
              TECH: '🤖',
            };
            return (
              <div key={item.cat}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span>{emoji[item.cat]}</span>
                    {item.cat}
                  </span>
                  <span className="text-zinc-600">
                    {item.count} trends ({Math.round(pct)}%)
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #7f1d1d, #ff0000)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-3">
          Quick Actions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Add New Trend', tab: 'trends', emoji: '🔥' },
            { label: 'Upload Template', tab: 'templates', emoji: '🎨' },
            { label: 'Add Ticker Item', tab: 'ticker', emoji: '📡' },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.tab)}
              className="flex items-center justify-between px-4 py-3 glass rounded-sm border border-zinc-800 hover:border-red-600/40 text-zinc-400 hover:text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{action.emoji}</span>
                {action.label}
              </div>
              <ArrowRight
                size={14}
                className="text-zinc-700 group-hover:text-red-400 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Trends */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-zinc-600 text-xs font-bold tracking-widest uppercase">
            Recent Trends
          </div>
          <button
            onClick={() => onNavigate('trends')}
            className="text-red-500 text-xs hover:text-red-400 flex items-center gap-1 cursor-pointer"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>
        <div className="space-y-2">
          {state.trends.slice(0, 5).map((trend: any) => (
            <div
              key={trend.id}
              className="flex items-center gap-3 px-4 py-2.5 glass rounded-sm border border-zinc-900"
            >
              <span className="text-lg">{trend.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{trend.headline}</div>
                <div className="text-zinc-600 text-xs">{trend.category} • {trend.timeAgo}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-xs font-bold text-red-400">{trend.hotness}%</div>
                <div
                  className={`w-2 h-2 rounded-full ${trend.active ? 'bg-green-500' : 'bg-zinc-700'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
