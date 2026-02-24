import { Injectable, signal, computed } from '@angular/core';
import { GameStats } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private interval: ReturnType<typeof setInterval> | null = null;

  readonly totalSeconds = signal(0);
  readonly stats = signal<GameStats>({ attempts: 0, correct: 0, streak: 0 });

  readonly formattedTime = computed(() => {
    const s = this.totalSeconds();
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec}`;
  });

  readonly ratio = computed(() => {
    const { correct } = this.stats();
    const s = this.totalSeconds();
    return Math.floor(correct * 60 / (s + 1));
  });

  start(): void {
    this.stop();
    this.totalSeconds.set(0);
    this.stats.set({ attempts: 0, correct: 0, streak: 0 });
    this.interval = setInterval(() => {
      this.totalSeconds.update(s => s + 1);
    }, 1000);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.totalSeconds.set(0);
    this.stats.set({ attempts: 0, correct: 0, streak: 0 });
  }

  incrementAttempts(): void {
    this.stats.update(s => ({ ...s, attempts: s.attempts + 1 }));
  }

  incrementCorrect(): void {
    this.stats.update(s => ({ ...s, correct: s.correct + 1, streak: s.streak + 1 }));
  }

  resetStreak(): void {
    this.stats.update(s => ({ ...s, streak: 0 }));
  }
}
