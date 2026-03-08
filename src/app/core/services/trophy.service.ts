import { Injectable, signal, computed } from '@angular/core';
import { Trophy, TROPHIES } from '../models/trophy.model';

@Injectable({ providedIn: 'root' })
export class TrophyService {
  private readonly STORAGE_KEY = 'lpg_trophies';

  private _trophies = signal<Trophy[]>(this.load());
  readonly trophies = this._trophies.asReadonly();

  private _pendingUnlock = signal<Trophy | null>(null);
  readonly pendingUnlock = this._pendingUnlock.asReadonly();

  readonly unlockedCount = computed(() => this._trophies().filter(t => t.unlocked).length);
  readonly unlockedTrophies = computed(() => this._trophies().filter(t => t.unlocked));

  private load(): Trophy[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return TROPHIES.map(t => ({ ...t }));
      const savedMap: Record<string, any> = JSON.parse(saved);
      return TROPHIES.map(t => ({
        ...t,
        unlocked: savedMap[t.id] === true,
        unlockedAt: savedMap[t.id + '_at'] ?? undefined,
      }));
    } catch {
      return TROPHIES.map(t => ({ ...t }));
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
    this._pendingUnlock.set(unlockedTrophy);
  }

  clearPendingUnlock(): void {
    this._pendingUnlock.set(null);
  }

  checkCorrectCount(total: number): void {
    if (total >= 1)   this.unlock('first_correct');
    if (total >= 10)  this.unlock('correct_10');
    if (total >= 50)  this.unlock('correct_50');
    if (total >= 100) this.unlock('correct_100');
    if (total >= 500) this.unlock('correct_500');
  }

  checkStreak(streak: number): void {
    if (streak >= 5)  this.unlock('streak_5');
    if (streak >= 10) this.unlock('streak_10');
    if (streak >= 20) this.unlock('streak_20');
  }
}
