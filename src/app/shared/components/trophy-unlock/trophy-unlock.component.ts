import { Component, inject, OnDestroy, effect } from '@angular/core';
import { TrophyService } from '../../../core/services/trophy.service';
import { AudioService, Sound } from '../../../core/services/audio.service';
import { Trophy } from '../../../core/models/trophy.model';

@Component({
  selector: 'app-trophy-unlock',
  standalone: true,
  templateUrl: './trophy-unlock.component.html',
  styleUrl: './trophy-unlock.component.scss',
})
export class TrophyUnlockComponent implements OnDestroy {
  readonly trophy = inject(TrophyService);
  readonly audio = inject(AudioService)

  confetti: { x: number; y: number; color: string; size: number; rotation: number; speed: number; drift: number }[] = [];
  private timer: any;

  constructor() {
    effect(() => {
      const t = this.trophy.pendingUnlock();
      if (t) {
        clearTimeout(this.timer);
        this.confetti = [];
        setTimeout(() => {
          this.generateConfetti(t.rarity);
          this.timer = setTimeout(() => this.trophy.clearPendingUnlock(), 10000);
          this.playUnlockEffect(t.rarity)
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  generateConfetti(rarity: string): void {
    const confettiNumber = rarity == 'common' ? 40 : rarity == 'rare' ?  70 : 100

    const colors = ['#f8d24b', '#f43f5e', '#4ade80', '#38bdf8', '#a78bfa', '#fb923c', '#fff'];
    this.confetti = Array.from({ length: confettiNumber }, (_, i) => ({
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      speed: 1.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 2,
    }));
  }

  playUnlockEffect(rarity : string) {
    if (rarity == 'common') {
      this.audio.play(Sound.UNLOCK_COMMON)
    }
    else if (rarity == 'common') {
      this.audio.play(Sound.UNLOCK_RARE)
    }
    else {
      this.audio.play(Sound.UNLOCK_LEGENDARY)
    }
  }

  close(): void {
    clearTimeout(this.timer);
    this.trophy.clearPendingUnlock();
  }
}
