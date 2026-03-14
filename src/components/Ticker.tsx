import { TICKER_ITEMS } from '../data/trends';

interface Props {
  items?: string[];
}

export default function Ticker({ items }: Props) {
  const source = items && items.length > 0 ? items : TICKER_ITEMS;
  const repeated = [...source, ...source, ...source];

  return (
    <div className="w-full bg-red-600 py-2 overflow-hidden relative z-50 flex-shrink-0">
      <div className="flex ticker-animate whitespace-nowrap will-change-transform">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-block px-8 text-white font-bold text-xs tracking-widest uppercase"
          >
            {item}
            <span className="ml-8 text-red-300 opacity-60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
