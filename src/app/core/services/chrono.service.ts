import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChronoService {
  private readonly STORAGE_KEY = 'chrono_best';

  readonly bestTime = signal<number | null>(this.loadBest());

  private loadBest(): number | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw === null) return null;
    const val = parseInt(raw, 10);
    return isNaN(val) ? null : val;
  }

  saveBest(ms: number): void {
    const current = this.bestTime();
    if (current === null || ms < current) {
      this.bestTime.set(ms);
      localStorage.setItem(this.STORAGE_KEY, String(ms));
    }
  }

  /** Format long pour le jeu : "1:23.4" */
  formattedTime(ms: number): string {
    const totalDs = Math.floor(ms / 100);
    const ds = totalDs % 10;
    const totalSec = Math.floor(totalDs / 10);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${min}:${String(sec).padStart(2, '0')}.${ds}`;
  }

  /** Format court pour la médaille : "1:23" */
  formattedBest(): string {
    const ms = this.bestTime();
    if (ms === null) return '';
    const totalSec = Math.floor(ms / 1000);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
  }
}
