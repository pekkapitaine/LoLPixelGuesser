import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TrophyService } from '../../../core/services/trophy.service';

@Component({
  selector: 'app-trophy-unlock',
  standalone: true,
  templateUrl: './trophy-unlock.component.html',
  styleUrl: './trophy-unlock.component.scss',
})
export class TrophyUnlockComponent implements OnInit, OnDestroy {
  readonly trophy = inject(TrophyService);

  confetti: { x: number; y: number; color: string; size: number; rotation: number; speed: number; drift: number }[] = [];
  private timer: any;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  onAnimationStart(): void {
    this.generateConfetti();
    this.timer = setTimeout(() => this.trophy.clearPendingUnlock(), 4000);
  }

  generateConfetti(): void {
    const colors = ['#f8d24b', '#f43f5e', '#4ade80', '#38bdf8', '#a78bfa', '#fb923c', '#fff'];
    this.confetti = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      speed: 1.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 2,
    }));
  }

  close(): void {
    clearTimeout(this.timer);
    this.trophy.clearPendingUnlock();
  }
}
