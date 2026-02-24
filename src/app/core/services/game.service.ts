import { Injectable, signal } from '@angular/core';
import { Difficulty } from '../models/champion.model';
import { HistoryEntry } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  readonly difficulty = signal<Difficulty>('facile');
  readonly includeSkins = signal<boolean>(this.loadIncludeSkins());
  readonly history = signal<HistoryEntry[]>([]);

  setDifficulty(d: Difficulty): void {
    this.difficulty.set(d);
  }

  setIncludeSkins(value: boolean): void {
    this.includeSkins.set(value);
    localStorage.setItem('includeSkins', String(value));
  }

  addHistory(entry: HistoryEntry): void {
    this.history.update(h => [entry, ...h]);
  }

  resetHistory(): void {
    this.history.set([]);
  }

  private loadIncludeSkins(): boolean {
    const saved = localStorage.getItem('includeSkins');
    return saved !== null ? saved === 'true' : false;
  }
}
