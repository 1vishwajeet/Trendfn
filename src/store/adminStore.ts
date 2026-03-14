import { useState, useEffect } from 'react';
import { Trend, Template, TRENDS, TEMPLATES, TICKER_ITEMS, Category } from '../data/trends';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminTrend extends Trend {
  createdAt: string;
  active: boolean;
}

export interface AdminTemplate extends Template {
  createdAt: string;
  active: boolean;
  imageUrl?: string;
}

export interface AdminState {
  trends: AdminTrend[];
  templates: AdminTemplate[];
  tickerItems: string[];
  isLoggedIn: boolean;
}

// ─── LocalStorage Keys ───────────────────────────────────────────────────────
const LS_KEY = 'trendlab_admin';
const PASS = 'TRENDLAB2026';

// ─── Seed Default Data ────────────────────────────────────────────────────────
function seedDefault(): AdminState {
  return {
    trends: TRENDS.map((t) => ({
      ...t,
      createdAt: new Date().toISOString(),
      active: true,
    })),
    templates: TEMPLATES.map((t) => ({
      ...t,
      createdAt: new Date().toISOString(),
      active: true,
      imageUrl: undefined,
    })),
    tickerItems: [...TICKER_ITEMS],
    isLoggedIn: false,
  };
}

// ─── Load / Save ─────────────────────────────────────────────────────────────
export function loadAdminState(): AdminState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminState;
      return { ...parsed, isLoggedIn: false };
    }
  } catch (_) {}
  return seedDefault();
}

export function saveAdminState(state: Omit<AdminState, 'isLoggedIn'>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (_) {}
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAdminStore() {
  const [state, setState] = useState<AdminState>(loadAdminState);

  // Persist on every change (except isLoggedIn)
  useEffect(() => {
    const { isLoggedIn: _, ...rest } = state;
    saveAdminState(rest);
  }, [state]);

  // ─ Auth ──────────────────────────────────────────────────────────────────
  function login(password: string): boolean {
    if (password === PASS) {
      setState((s) => ({ ...s, isLoggedIn: true }));
      return true;
    }
    return false;
  }

  function logout() {
    setState((s) => ({ ...s, isLoggedIn: false }));
  }

  // ─ Trends ────────────────────────────────────────────────────────────────
  function addTrend(data: Omit<AdminTrend, 'id' | 'createdAt'>) {
    const newTrend: AdminTrend = {
      ...data,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, trends: [newTrend, ...s.trends] }));
    return newTrend;
  }

  function updateTrend(id: string, data: Partial<AdminTrend>) {
    setState((s) => ({
      ...s,
      trends: s.trends.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  }

  function deleteTrend(id: string) {
    setState((s) => ({ ...s, trends: s.trends.filter((t) => t.id !== id) }));
  }

  function toggleTrend(id: string) {
    setState((s) => ({
      ...s,
      trends: s.trends.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    }));
  }

  // ─ Templates ─────────────────────────────────────────────────────────────
  function addTemplate(data: Omit<AdminTemplate, 'id' | 'createdAt'>) {
    const newT: AdminTemplate = {
      ...data,
      id: `tp${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, templates: [newT, ...s.templates] }));
    return newT;
  }

  function updateTemplate(id: string, data: Partial<AdminTemplate>) {
    setState((s) => ({
      ...s,
      templates: s.templates.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  }

  function deleteTemplate(id: string) {
    setState((s) => ({ ...s, templates: s.templates.filter((t) => t.id !== id) }));
  }

  function toggleTemplate(id: string) {
    setState((s) => ({
      ...s,
      templates: s.templates.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    }));
  }

  // ─ Ticker ────────────────────────────────────────────────────────────────
  function addTickerItem(text: string) {
    setState((s) => ({ ...s, tickerItems: [...s.tickerItems, text] }));
  }

  function deleteTickerItem(index: number) {
    setState((s) => ({
      ...s,
      tickerItems: s.tickerItems.filter((_, i) => i !== index),
    }));
  }

  function updateTickerItem(index: number, text: string) {
    setState((s) => ({
      ...s,
      tickerItems: s.tickerItems.map((item, i) => (i === index ? text : item)),
    }));
  }

  // ─ Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    totalTrends: state.trends.length,
    activeTrends: state.trends.filter((t) => t.active).length,
    totalTemplates: state.templates.length,
    activeTemplates: state.templates.filter((t) => t.active).length,
    totalTicker: state.tickerItems.length,
    categoryBreakdown: ['FINANCE', 'BUSINESS', 'SPORTS', 'FUNNY', 'TECH'].map((cat) => ({
      cat,
      count: state.trends.filter((t) => t.category === (cat as Category)).length,
    })),
  };

  return {
    state,
    stats,
    login,
    logout,
    addTrend,
    updateTrend,
    deleteTrend,
    toggleTrend,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplate,
    addTickerItem,
    deleteTickerItem,
    updateTickerItem,
  };
}
