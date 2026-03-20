import { Injectable, signal } from '@angular/core';


export interface BgDef {
  id: string;
  label: string;
  colors: string[];       // 1 couleur = uni, 2+ = gradient diagonal
  trophyId?: string;
  trophyLabel?: string;
  // rétro-compat : propriété calculée utilisée pour les swatches
  get color(): string;
}

function bg(id: string, label: string, colors: string[], trophyId?: string, trophyLabel?: string): BgDef {
  return { id, label, colors, trophyId, trophyLabel, get color() { return buildCss(colors); } };
}

function buildCss(colors: string[]): string {
  if (colors.length === 1) return colors[0];
  const stops = colors.map((c, i) => `${c} ${Math.round(i / (colors.length - 1) * 100)}%`).join(', ');
  return `linear-gradient(135deg, ${stops})`;
}

export const BG_DEFS: Record<string, BgDef> = {
  bandle:      bg('bandle',      'Bandle',        ['#1A3324', '#2F5A3C', '#6FAF8F']),
  bilgewater:  bg('bilgewater',  'Bilgewater',    ['#0A1A26', '#123447', '#1C4E63']),
  demacia:     bg('demacia',     'Demacia',       ['#1E1C16', '#3A3426', '#D6C08A']),
  freljord:    bg('freljord',    'Freljord',      ['#162733', '#2A4A5E', '#8FBAD0']),
  ionia:       bg('ionia',       'Ionia',         ['#241A2E', '#4A2F52', '#A06FAF']),
  ixtal:       bg('ixtal',       'Ixtal',         ['#0F241C', '#1F4A38', '#3FAF7A']),
  void:        bg('void',        'Le Néant',      ['#0A0814', '#2A0F3A', '#6A2FBF'], 'void_explorer', 'Explorateur du Néant'),
  noxus:       bg('noxus',       'Noxus',         ['#14080A', '#3A1418', '#8F2A2F'], 'noxus_conqueror', 'Conquérant Noxien'),
  piltover:    bg('piltover',    'Piltover',      ['#2A2416', '#5A4A2A', '#C89B3C']),
  shurima:     bg('shurima',     'Shurima',       ['#241A0C', '#5A3A1C', '#D4A94A']),
  targon:      bg('targon',      'Targon',        ['#0A0A18', '#2A2A4A', '#6A5ACD', '#C8B6FF'], 'targon_ascended', 'Ascendant de Targon'),
  zaun:        bg('zaun',        'Zaun',          ['#0A140F', '#1A3A24', '#3A6A3A', '#6A2FBF']),
  shadowIsles: bg('shadowIsles', 'Îles obscures', ['#040C08', '#0A2A18', '#1F5A3A', '#3FAF5A'], 'shadow_walker', 'Marcheur des Ombres'),
}

const STORAGE_BG     = 'lpg_bg_current';
const STORAGE_UNLOCK = 'lpg_bg_unlocked';

@Injectable({ providedIn: 'root' })
export class BackgroundService {
  readonly current  = signal<string>(this.loadCurrent());
  readonly unlocked = signal<string[]>(this.loadUnlocked());

  constructor() {
    this.applyBg(this.current());
  }

  select(bg: string): void {
    if (!this.unlocked().includes(bg)) return;
    this.current.set(bg);
    localStorage.setItem(STORAGE_BG, bg);
    this.applyBg(bg);
  }

  unlock(bg: string): void {
    if (this.unlocked().includes(bg)) return;
    const next = [...this.unlocked(), bg];
    this.unlocked.set(next);
    localStorage.setItem(STORAGE_UNLOCK, JSON.stringify(next));
  }

  private applyBg(id: string): void {
    document.body.style.background = BG_DEFS[id]?.color ?? '#0d0d1a';
  }

  private loadCurrent(): string {
    const saved = localStorage.getItem(STORAGE_BG) as string;
    return saved && BG_DEFS[saved] ? saved : 'bandle';
  }

  private loadUnlocked(): string[] {
    const freeIds = Object.values(BG_DEFS).filter(b => !b.trophyId).map(b => b.id);
    try {
      const saved = localStorage.getItem(STORAGE_UNLOCK);
      const savedList: string[] = saved ? JSON.parse(saved) : [];
      return [...new Set([...freeIds, ...savedList])];
    } catch { return freeIds; }
  }
}
