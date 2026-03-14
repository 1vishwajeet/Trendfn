export type Category = 'ALL' | 'FINANCE' | 'BUSINESS' | 'SPORTS' | 'FUNNY' | 'TECH';

export interface Trend {
  id: string;
  headline: string;
  subtext: string;
  category: Category;
  hotness: number;
  hotnessLabel: string;
  emoji: string;
  tags: string[];
  timeAgo: string;
  moodTag: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'PHOTO' | 'VIDEO';
  mood: string;
  gradient: string;
  emoji: string;
  aspectRatio: string;
}

export const TRENDS: Trend[] = [
  {
    id: 't1',
    headline: 'IPL Finals: Last Over Drama — India Goes Crazy',
    subtext: '47 runs in last over. Cricket Twitter is melting down right now.',
    category: 'SPORTS',
    hotness: 99,
    hotnessLabel: 'NUCLEAR',
    emoji: '🏏',
    tags: ['IPL', 'Cricket', 'India', 'Finals'],
    timeAgo: '4 min ago',
    moodTag: 'HYPE',
  },
  {
    id: 't2',
    headline: 'Sensex Crashes 2000 Points — Market Laal Ho Gaya',
    subtext: 'Bears are back. Investors are crying. Meme lords are winning.',
    category: 'FINANCE',
    hotness: 97,
    hotnessLabel: 'INFERNO',
    emoji: '📉',
    tags: ['Sensex', 'StockMarket', 'Finance', 'Crash'],
    timeAgo: '12 min ago',
    moodTag: 'PAIN',
  },
  {
    id: 't3',
    headline: 'Elon Launches New AI — Claims It Beats GPT-5',
    subtext: 'Tech Twitter is divided. War has begun in the comment sections.',
    category: 'TECH',
    hotness: 95,
    hotnessLabel: 'BLAZING',
    emoji: '🤖',
    tags: ['AI', 'Elon', 'Tech', 'GPT'],
    timeAgo: '22 min ago',
    moodTag: 'CHAOS',
  },
  {
    id: 't4',
    headline: 'Startup Raises Rs 500 Cr at 20 — Founders Are Gen-Z',
    subtext: 'Two college dropouts just got funded. LinkedIn is having a moment.',
    category: 'BUSINESS',
    hotness: 92,
    hotnessLabel: 'BLAZING',
    emoji: '💼',
    tags: ['Startup', 'Funding', 'GenZ', 'India'],
    timeAgo: '35 min ago',
    moodTag: 'GRIND',
  },
  {
    id: 't5',
    headline: 'Gold Hits All-Time High — Rs 1 Lakh per 10g',
    subtext: 'Your dadi jewellery is now a hedge fund. Classic.',
    category: 'FINANCE',
    hotness: 88,
    hotnessLabel: 'HOT',
    emoji: '🪙',
    tags: ['Gold', 'Finance', 'ATH', 'India'],
    timeAgo: '1 hr ago',
    moodTag: 'WIN',
  },
  {
    id: 't6',
    headline: 'Virat Kohli Retires From Test Cricket — Nation in Shock',
    subtext: 'The king hangs up his whites. A billion hearts breaking simultaneously.',
    category: 'SPORTS',
    hotness: 99,
    hotnessLabel: 'NUCLEAR',
    emoji: '👑',
    tags: ['Virat', 'Cricket', 'Legend', 'Retirement'],
    timeAgo: '2 hr ago',
    moodTag: 'SAD',
  },
  {
    id: 't7',
    headline: 'Cat Goes Viral After Judging Owner Coding — 50M Views',
    subtext: 'The cat knew. The cat always knew. We just were not listening.',
    category: 'FUNNY',
    hotness: 91,
    hotnessLabel: 'BLAZING',
    emoji: '😂',
    tags: ['Cat', 'Viral', 'Meme', 'Funny'],
    timeAgo: '3 hr ago',
    moodTag: 'LOL',
  },
  {
    id: 't8',
    headline: 'Apple Reveals iGlasses — Rs 4 Lakh, Ships Next Year',
    subtext: 'Your face is now a product. But make it aesthetic.',
    category: 'TECH',
    hotness: 85,
    hotnessLabel: 'HOT',
    emoji: '🍎',
    tags: ['Apple', 'iGlasses', 'AR', 'Tech'],
    timeAgo: '4 hr ago',
    moodTag: 'HYPE',
  },
  {
    id: 't9',
    headline: 'Office Guy Reply-All Email Breaks Company Server',
    subtext: 'He accidentally emailed 50,000 employees with just: ok.',
    category: 'FUNNY',
    hotness: 87,
    hotnessLabel: 'HOT',
    emoji: '📧',
    tags: ['Office', 'Fail', 'Email', 'Funny'],
    timeAgo: '5 hr ago',
    moodTag: 'LOL',
  },
  {
    id: 't10',
    headline: 'India Becomes World 2nd Largest Economy — Official',
    subtext: 'Decades of grinding. One headline. The world is paying attention.',
    category: 'BUSINESS',
    hotness: 96,
    hotnessLabel: 'INFERNO',
    emoji: '🇮🇳',
    tags: ['India', 'Economy', 'Business', 'Milestone'],
    timeAgo: '6 hr ago',
    moodTag: 'PRIDE',
  },
  {
    id: 't11',
    headline: 'Ronaldo Signs Contract Worth Rs 2500 Cr — Madness',
    subtext: 'He is 39. Still breaking records. Still breaking the internet.',
    category: 'SPORTS',
    hotness: 89,
    hotnessLabel: 'HOT',
    emoji: '⚽',
    tags: ['Ronaldo', 'Football', 'Contract', 'Sports'],
    timeAgo: '7 hr ago',
    moodTag: 'WOW',
  },
  {
    id: 't12',
    headline: 'Crypto Bull Run — Bitcoin Crosses $120K Again',
    subtext: 'The people who sold at $30K are now in a bunker somewhere.',
    category: 'FINANCE',
    hotness: 94,
    hotnessLabel: 'BLAZING',
    emoji: '₿',
    tags: ['Bitcoin', 'Crypto', 'BullRun', 'Finance'],
    timeAgo: '8 hr ago',
    moodTag: 'HYPE',
  },
];

export const TEMPLATES: Template[] = [
  {
    id: 'tp1',
    name: 'Drake Pointing',
    type: 'PHOTO',
    mood: 'FUNNY',
    gradient: 'from-purple-900 via-black to-red-900',
    emoji: '👆',
    aspectRatio: '1:1',
  },
  {
    id: 'tp2',
    name: 'Stonks Guy',
    type: 'PHOTO',
    mood: 'FINANCE',
    gradient: 'from-green-900 via-black to-green-950',
    emoji: '📈',
    aspectRatio: '1:1',
  },
  {
    id: 'tp3',
    name: 'This Is Fine Fire',
    type: 'PHOTO',
    mood: 'PAIN',
    gradient: 'from-orange-900 via-black to-red-950',
    emoji: '🔥',
    aspectRatio: '16:9',
  },
  {
    id: 'tp4',
    name: 'Distracted Boyfriend',
    type: 'PHOTO',
    mood: 'FUNNY',
    gradient: 'from-blue-900 via-black to-purple-900',
    emoji: '👀',
    aspectRatio: '16:9',
  },
  {
    id: 'tp5',
    name: 'Doge Wow',
    type: 'PHOTO',
    mood: 'HYPE',
    gradient: 'from-yellow-900 via-black to-yellow-950',
    emoji: '🐕',
    aspectRatio: '1:1',
  },
  {
    id: 'tp6',
    name: 'Cinematic Red Reel',
    type: 'VIDEO',
    mood: 'HYPE',
    gradient: 'from-red-900 via-black to-red-950',
    emoji: '🎬',
    aspectRatio: '9:16',
  },
  {
    id: 'tp7',
    name: 'Neon Countdown',
    type: 'VIDEO',
    mood: 'HYPE',
    gradient: 'from-cyan-900 via-black to-blue-950',
    emoji: '⏱️',
    aspectRatio: '9:16',
  },
  {
    id: 'tp8',
    name: 'Wall Street Wolf',
    type: 'VIDEO',
    mood: 'FINANCE',
    gradient: 'from-emerald-900 via-black to-emerald-950',
    emoji: '🐺',
    aspectRatio: '9:16',
  },
  {
    id: 'tp9',
    name: 'Grind Mode',
    type: 'PHOTO',
    mood: 'GRIND',
    gradient: 'from-zinc-900 via-black to-zinc-950',
    emoji: '💪',
    aspectRatio: '1:1',
  },
  {
    id: 'tp10',
    name: 'Stadium Roar',
    type: 'VIDEO',
    mood: 'SPORTS',
    gradient: 'from-blue-900 via-black to-indigo-950',
    emoji: '🏟️',
    aspectRatio: '9:16',
  },
];

export const TICKER_ITEMS = [
  '🔥 IPL Finals trending globally',
  '📉 Sensex -2,000 points — Bears are back',
  '₿ Bitcoin Rs 1 Crore milestone',
  '🤖 AI beats humans at chess AGAIN',
  '🏏 Virat century in Oval Test',
  '💰 Paytm founder exits company',
  '😂 Office email chaos — 50K employees',
  '🚀 India moon mission success',
  '📱 Instagram adds new AI filters',
  '🇮🇳 India GDP #2 globally confirmed',
  '⚽ Champions League final tonight',
  '🪙 Gold Rs 1 lakh — new ATH',
];
