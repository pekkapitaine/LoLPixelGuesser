import {
  Component, OnInit, OnDestroy, inject, signal, computed, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { ChampionService } from '../../../core/services/champion.service';
import { ChronoService } from '../../../core/services/chrono.service';
import { PixelImageComponent } from '../../../shared/components/pixel-image/pixel-image.component';
import { GuessInputComponent } from '../../../shared/components/guess-input/guess-input.component';
import { BackBtnComponent } from '../../../shared/components/back-btn/back-btn.component';
import { GameImage } from '../../../core/models/champion.model';
import { TrophyService } from '../../../core/services/trophy.service';

type FeedbackState = 'correct' | 'wrong' | 'none';

const PIXEL_SIZE = 33; // difficulté "moyen"
const TOTAL = 10;

@Component({
  selector: 'app-chrono-game',
  standalone: true,
  imports: [PixelImageComponent, GuessInputComponent, BackBtnComponent],
  templateUrl: './chrono-game.component.html',
  styleUrl: './chrono-game.component.scss',
})
export class ChronoGameComponent implements OnInit, OnDestroy {
  private championService = inject(ChampionService);
  readonly chronoService = inject(ChronoService);
  private router = inject(Router);

  readonly total = TOTAL;

  readonly currentIndex = signal(0);
  readonly imageSrc = signal('');
  readonly feedback = signal<FeedbackState>('none');
  readonly isLoading = signal(true);
  readonly elapsed = signal(0);
  readonly finished = signal(false);
  readonly suggestions = signal<string[]>([]);
  readonly isNewRecord = signal(false);
  readonly countdown = signal<number | null>(null);
  readonly countdownKey = signal(0);
  readonly countingDown = signal(false);

  readonly formattedElapsed = computed(() => this.chronoService.formattedTime(this.elapsed()));

  private champions: GameImage[] = [];
  private currentChampion: string | null = null;
  private currentImagePath: string | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;
  private startTime = 0;

  private readonly trophyService = inject(TrophyService)

  @ViewChild(GuessInputComponent) guessInput!: GuessInputComponent;

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.championService.loadGameData(),
      this.championService.loadChampionsList(),
    ]);
    await this.startGame();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  }

  private async startGame(): Promise<void> {
    // Tirer 10 champions aléatoires distincts
    const picked: GameImage[] = [];
    const seen = new Set<string>();
    let attempts = 0;
    while (picked.length < TOTAL && attempts < 200) {
      const entry = this.championService.getRandomImage(false);
      if (entry && !seen.has(entry.champion)) {
        seen.add(entry.champion);
        picked.push(entry);
      }
      attempts++;
    }
    this.champions = picked;
    this.currentIndex.set(0);
    this.elapsed.set(0);
    this.finished.set(false);
    this.isNewRecord.set(false);
    this.feedback.set('none');

    await this.loadChampion(0);
    await this.runCountdown();
    this.startTime = Date.now();
    this.startTimer();
  }

  private runCountdown(): Promise<void> {
    return new Promise(resolve => {
      const counts = [3, 2, 1];
      let i = 0;
      this.countingDown.set(true);
      const tick = () => {
        if (i >= counts.length) {
          this.countingDown.set(false);
          this.countdown.set(null);
          setTimeout(resolve, 0);
          return;
        }
        this.countdown.set(counts[i++]);
        this.countdownKey.update(k => k + 1);
        setTimeout(tick, 900);
      };
      tick();
    });
  }

  private startTimer(): void {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.elapsed.set(Date.now() - this.startTime);
    }, 100);
  }

  private stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async loadChampion(index: number): Promise<void> {
    if (index >= this.champions.length) return;
    this.isLoading.set(true);
    try {
      const entry = this.champions[index];
      const imagePath = this.championService.getImagePath(entry);
      const pixelized = await this.championService.pixelizeImageRaw(imagePath, PIXEL_SIZE);
      this.imageSrc.set(pixelized);
      this.currentChampion = entry.champion;
      this.currentImagePath = imagePath;
    } catch (err) {
      console.error('Erreur chargement champion :', err);
    } finally {
      this.isLoading.set(false);
      this.guessInput?.focus();
    }
  }

  onQueryChange(value: string): void {
    this.suggestions.set(this.championService.filterSuggestions(value));
  }

  selectSuggestion(champion: string): void {
    this.submitGuess(champion);
  }

  submitGuess(guess: string): void {
    if (!guess.trim() || !this.currentChampion || this.finished()) return;
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);

    const normalized = this.championService.normalizeStr(guess);
    const correct = this.championService.normalizeStr(this.currentChampion);

    if (normalized === correct) {
      this.feedback.set('correct');
      if (this.currentImagePath) this.imageSrc.set(this.currentImagePath);
      const nextIndex = this.currentIndex() + 1;

      if (nextIndex >= TOTAL) {
        // Dernier champion : on finit
        this.feedbackTimeout = setTimeout(() => {
          this.feedback.set('none');
          this.finish();
        }, 800);
      } else {
        this.currentIndex.set(nextIndex);
        this.feedbackTimeout = setTimeout(async () => {
          this.feedback.set('none');
          await this.loadChampion(nextIndex);
        }, 800);
      }
    } else {
      this.feedback.set('wrong');
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
      }, 600);
    }
  }

  private finish(): void {
    this.stopTimer();
    const finalTime = Date.now() - this.startTime; // milliseconds
    this.trophyService.checkChronoChallenge(finalTime / 1000); // to seconds
    console.log('finalTime:', finalTime)
    this.elapsed.set(finalTime);
    const prev = this.chronoService.bestTime();
    this.chronoService.saveBest(finalTime);
    this.isNewRecord.set(prev === null || finalTime < prev);
    this.finished.set(true);
  }

  async replay(): Promise<void> {
    await this.startGame();
  }

  goBack(): void {
    this.router.navigate(['/challenge']);
  }
}
