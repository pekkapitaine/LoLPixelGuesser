import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EscaladeService {
  private readonly STORAGE_KEY = 'lpg_escalade_best';

  readonly bestScore = signal<number>(this.loadBest());

  private loadBest(): number {
    return parseInt(localStorage.getItem(this.STORAGE_KEY) ?? '0', 10) || 0;
  }

  saveBest(score: number): void {
    if (score > this.bestScore()) {
      this.bestScore.set(score);
      localStorage.setItem(this.STORAGE_KEY, String(score));
    }
  }
}
