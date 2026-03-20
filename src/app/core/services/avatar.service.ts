import { Injectable, signal } from '@angular/core';

export interface AvatarDef {
  id: string;
  emoji: string;
  label: string;
  trophyId?: string;
  trophyLabel?: string;
}

export const AVATAR_DEFS: AvatarDef[] = [
  // — Avatars libres —
  { id: 'feu',     emoji: '🔥', label: 'Feu'       },
  { id: 'eau',     emoji: '💧', label: 'Eau'       },
  { id: 'terre',   emoji: '🌍', label: 'Terre'     },
  { id: 'air',     emoji: '💨', label: 'Air'       },
  // — Avatars à débloquer —
  { id: 'cible',      emoji: '🎯', label: 'Précision',   trophyId: 'correct_100',  trophyLabel: 'Centenaire'   },
  { id: 'couronne',   emoji: '👑', label: 'Couronne',    trophyId: 'correct_500',  trophyLabel: 'Légende'      },
  { id: 'bouclier',   emoji: '🛡️', label: 'Gardien',     trophyId: 'streak_20',   trophyLabel: 'Intouchable'  },
  { id: 'tempete',    emoji: '🌩️', label: 'Tempête',     trophyId: 'fast_1',      trophyLabel: 'Éclair Suprême'},
  { id: 'demon',      emoji: '😈', label: 'Démon',       trophyId: 'extreme_mode', trophyLabel: 'Masochiste'   },
  { id: 'groot',      emoji: '🪵', label: 'Groot',       trophyId: 'groot',        trophyLabel: 'Groot'        },
  { id: 'afk',        emoji: '💤', label: 'AFK',         trophyId: 'afk',          trophyLabel: 'afk'          },
];

const STORAGE_AVATAR   = 'lpg_avatar_current';
const STORAGE_UNLOCKED = 'lpg_avatar_unlocked';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  readonly current  = signal<string>(this.loadCurrent());
  readonly unlocked = signal<string[]>(this.loadUnlocked());

  get currentEmoji(): string {
    return AVATAR_DEFS.find(a => a.id === this.current())?.emoji ?? '🔥';
  }

  select(id: string): void {
    if (!this.unlocked().includes(id)) return;
    this.current.set(id);
    localStorage.setItem(STORAGE_AVATAR, id);
  }

  unlock(id: string): void {
    if (this.unlocked().includes(id)) return;
    const next = [...this.unlocked(), id];
    this.unlocked.set(next);
    localStorage.setItem(STORAGE_UNLOCKED, JSON.stringify(next));
  }

  private loadCurrent(): string {
    const saved = localStorage.getItem(STORAGE_AVATAR);
    return saved && AVATAR_DEFS.find(a => a.id === saved) ? saved : 'feu';
  }

  private loadUnlocked(): string[] {
    const freeIds = AVATAR_DEFS.filter(a => !a.trophyId).map(a => a.id);
    try {
      const saved = localStorage.getItem(STORAGE_UNLOCKED);
      const savedList: string[] = saved ? JSON.parse(saved) : [];
      return [...new Set([...freeIds, ...savedList])];
    } catch { return freeIds; }
  }
}
