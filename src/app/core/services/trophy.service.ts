import { Injectable, signal, computed, inject } from '@angular/core';
import { Trophy, TROPHIES } from '../models/trophy.model';
import { BackgroundService, BG_DEFS } from './background.service';
import { AvatarService, AVATAR_DEFS } from './avatar.service';

@Injectable({ providedIn: 'root' })
export class TrophyService {
  private readonly bgService = inject(BackgroundService);
  private readonly avatarService = inject(AvatarService);
  private readonly STORAGE_KEY = 'lpg_trophies';
  private readonly CORRECT_KEY = 'lpg_total_correct';

  private _totalCorrect = parseInt(localStorage.getItem(this.CORRECT_KEY) ?? '0', 10);

  private _trophies = signal<Trophy[]>(this.load());
  readonly trophies = this._trophies.asReadonly();

  private _pendingUnlock = signal<Trophy | null>(null);
  readonly pendingUnlock = this._pendingUnlock.asReadonly();

  readonly unlockedCount = computed(() => this._trophies().filter(t => t.unlocked).length);
  readonly unlockedTrophies = computed(() => this._trophies().filter(t => t.unlocked));

  private _unlockQueue: Trophy[] = [];

  private showNext(): void {
    if (this._pendingUnlock() !== null) return;
    const next = this._unlockQueue.shift();
    if (next) {
      this._pendingUnlock.set(next);
      
    }

  }

  private load(): Trophy[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return TROPHIES.map(t => ({ ...t, unlocked: false }));
      const savedMap: Record<string, any> = JSON.parse(saved);
      return TROPHIES.map(t => ({
        ...t,
        unlocked: savedMap[t.id] === true,
        unlockedAt: savedMap[t.id + '_at'] ?? undefined,
      }));
    } catch {
      return TROPHIES.map(t => ({ ...t, unlocked: false }));
    }
  }

  private save(): void {
    const map: Record<string, any> = {};
    for (const t of this._trophies()) {
      map[t.id] = t.unlocked;
      if (t.unlockedAt) map[t.id + '_at'] = t.unlockedAt;
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(map));
  }

  unlock(id: string): void {
    const current = this._trophies();
    const trophy = current.find(t => t.id === id);
    if (!trophy || trophy.unlocked) return;

    const updated = current.map(t =>
      t.id === id ? { ...t, unlocked: true, unlockedAt: new Date().toLocaleDateString('fr-FR') } : t
    );
    this._trophies.set(updated);
    this.save();

    const unlockedTrophy = updated.find(t => t.id === id)!;
    this._unlockQueue.push(unlockedTrophy);
    this.showNext();

    const bgEntry = Object.values(BG_DEFS).find(bg => bg.trophyId === id);
    if (bgEntry) this.bgService.unlock(bgEntry.id);

    const avatarEntry = AVATAR_DEFS.find(a => a.trophyId === id);
    if (avatarEntry) this.avatarService.unlock(avatarEntry.id);
  }

  clearPendingUnlock(): void {
    this._pendingUnlock.set(null);
    this.showNext();
  }

  addCorrect(): void {
    this._totalCorrect++;
    localStorage.setItem(this.CORRECT_KEY, String(this._totalCorrect));
    const n = this._totalCorrect;
    if (n >= 1)   this.unlock('first_correct');
    if (n >= 10)  this.unlock('correct_10');
    if (n >= 50)  this.unlock('correct_50');
    if (n >= 100) this.unlock('correct_100');
    if (n >= 500) this.unlock('correct_500');
  }

  checkStreak(streak: number): void {
    if (streak >= 5)  this.unlock('streak_5');
    if (streak >= 10) this.unlock('streak_10');
    if (streak >= 20) this.unlock('streak_20');
  }

  checkfastGuess(seconds: number): void {
    if (seconds <= 1)  this.unlock('fast_1');
    if (seconds <= 2)  this.unlock('fast_2');
    if (seconds <= 3)  this.unlock('fast_3');
    if (seconds <= 5)  this.unlock('fast_5');
  }

  checkChrono(minutes: number): void {
    if (minutes >= 1) this.unlock('small_player');
    if (minutes >= 5) this.unlock('real_player');
    if (minutes >= 10) this.unlock('try_harder');
    if (minutes >= 30) this.unlock('accro');
    if (minutes >= 180) this.unlock('afk');
  }

  checkShared(): void {
    this.unlock('share');
  }
}
