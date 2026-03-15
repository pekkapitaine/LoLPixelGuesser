import { Injectable, signal } from '@angular/core';

export type BgType = 'nuit' | 'violet' | 'rouge' | 'cyan' | 'rose' | 'vert'
                   | 'dore' | 'ocean' | 'feu' | 'matrix' | 'void';

export interface BgDef {
  id: BgType;
  label: string;
  icon: string;
  color: string;          // CSS background value
  trophyId?: string;
  trophyLabel?: string;
}

export const BG_DEFS: Record<BgType, BgDef> = {
  // — Fonds gratuits —
  nuit:   { id: 'nuit',   label: 'Nuit',   icon: '🌙', color: '#0d0d1a' },
  violet: { id: 'violet', label: 'Violet', icon: '🟣', color: '#150a28' },
  rouge:  { id: 'rouge',  label: 'Rouge',  icon: '🔴', color: '#1f0808' },
  cyan:   { id: 'cyan',   label: 'Cyan',   icon: '🔵', color: '#041e30' },
  rose:   { id: 'rose',   label: 'Rose',   icon: '🩷', color: '#200814' },
  vert:   { id: 'vert',   label: 'Vert',   icon: '🟢', color: '#061a08' },
  // — Fonds à débloquer —
  dore:   { id: 'dore',   label: 'Doré',   icon: '✨', color: '#1e1400', trophyId: 'correct_500', trophyLabel: 'Légende'      },
  ocean:  { id: 'ocean',  label: 'Océan',  icon: '🌊', color: '#021828', trophyId: 'correct_100', trophyLabel: 'Centenaire'   },
  feu:    { id: 'feu',    label: 'Feu',    icon: '🔥', color: '#200800', trophyId: 'streak_10',   trophyLabel: 'Éclair'       },
  matrix: { id: 'matrix', label: 'Matrix', icon: '💚', color: '#021402', trophyId: 'groot',       trophyLabel: 'Groot'        },
  void:   { id: 'void',   label: 'Void',   icon: '🌌', color: '#08021e', trophyId: 'streak_20',   trophyLabel: 'Intouchable'  },
};

const STORAGE_BG     = 'lpg_bg_current';
const STORAGE_UNLOCK = 'lpg_bg_unlocked';

@Injectable({ providedIn: 'root' })
export class BackgroundService {
  readonly current  = signal<BgType>(this.loadCurrent());
  readonly unlocked = signal<BgType[]>(this.loadUnlocked());

  constructor() {
    this.applyBg(this.current());
  }

  select(bg: BgType): void {
    if (!this.unlocked().includes(bg)) return;
    this.current.set(bg);
    localStorage.setItem(STORAGE_BG, bg);
    this.applyBg(bg);
  }

  unlock(bg: BgType): void {
    if (this.unlocked().includes(bg)) return;
    const next = [...this.unlocked(), bg];
    this.unlocked.set(next);
    localStorage.setItem(STORAGE_UNLOCK, JSON.stringify(next));
  }

  private applyBg(bg: BgType): void {
    document.body.style.background = BG_DEFS[bg]?.color ?? '#0d0d1a';
  }

  private loadCurrent(): BgType {
    const saved = localStorage.getItem(STORAGE_BG) as BgType;
    return saved && BG_DEFS[saved] ? saved : 'nuit';
  }

  private loadUnlocked(): BgType[] {
    const freeIds = Object.values(BG_DEFS).filter(b => !b.trophyId).map(b => b.id);
    try {
      const saved = localStorage.getItem(STORAGE_UNLOCK);
      const savedList: BgType[] = saved ? JSON.parse(saved) : [];
      return [...new Set([...freeIds, ...savedList])];
    } catch { return freeIds; }
  }
}
