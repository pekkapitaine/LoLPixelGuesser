import {
  Component, OnInit, OnDestroy, inject, signal, computed, ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';
import { GameService } from '../../core/services/game.service';
import { ChampionService } from '../../core/services/champion.service';
import { TimerService } from '../../core/services/timer.service';
import { TrophyService } from '../../core/services/trophy.service';
import { Difficulty, DIFFICULTY_LABELS } from '../../core/models/champion.model';
import { HistoryEntry } from '../../core/models/game.model';
import { PixelImageComponent } from '../../shared/components/pixel-image/pixel-image.component';
import { GuessInputComponent } from '../../shared/components/guess-input/guess-input.component';

type FeedbackState = 'correct' | 'wrong' | 'none';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [PixelImageComponent, GuessInputComponent, BackBtnComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private championService = inject(ChampionService);
  private trophyService = inject(TrophyService);
  readonly timer = inject(TimerService);

  readonly difficulty = signal<Difficulty>('facile');
  readonly difficultyTitle = computed(() => DIFFICULTY_LABELS[this.difficulty()].label);
  readonly champImageSrc = signal<string>('');
  readonly feedback = signal<FeedbackState>('none');
  readonly suggestions = signal<string[]>([]);
  readonly isLoading = signal(true);
  readonly history = this.gameService.history;
  readonly stats = this.timer.stats;
  readonly formattedTime = this.timer.formattedTime;
  readonly ratio = this.timer.ratio;
  readonly lastGuessTotalSeconds = signal(0);
  readonly timeToGuess = computed(() => this.timer.totalSeconds() - this.lastGuessTotalSeconds());
  readonly showHistory = signal(false);

  private currentChampion: string | null = null;
  private currentSoluce: string | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild(GuessInputComponent) guessInput!: GuessInputComponent;

  async ngOnInit(): Promise<void> {
    const diff = this.route.snapshot.paramMap.get('difficulty') as Difficulty;
    this.difficulty.set(diff ?? 'facile');
    this.gameService.setDifficulty(this.difficulty());
    this.gameService.resetHistory();
    if (this.difficulty() === 'extreme') this.trophyService.unlock('extreme_mode');

    await Promise.all([
      this.championService.loadGameData(),
      this.championService.loadChampionsList(),
    ]);

    this.timer.start();
    await this.loadNextChamp();
  }

  ngOnDestroy(): void {
    this.timer.stop();
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  }

  toggleHistory(): void { this.showHistory.update(v => !v); }

  async loadNextChamp(): Promise<void> {
    this.isLoading.set(true);
    try {
      const entry = this.championService.getRandomImage(this.gameService.includeSkins());
      if (!entry) return;
      const imagePath = this.championService.getImagePath(entry);
      const pixelized = await this.championService.pixelizeImage(imagePath, this.difficulty());
      this.champImageSrc.set(pixelized);
      this.currentChampion = entry.champion;
      this.currentSoluce = imagePath;
      this.lastGuessTotalSeconds.set(this.timer.totalSeconds());
    } catch (err) {
      console.error('Erreur chargement champion :', err);
    } finally {
      this.isLoading.set(false);
      this.guessInput?.focus();
    }
  }

  skip(): void {
    if (this.currentSoluce) this.champImageSrc.set(this.currentSoluce);
    this.feedbackTimeout = setTimeout(() => this.loadNextChamp(), 1000);
  }

  onQueryChange(value: string): void {
    this.suggestions.set(this.championService.filterSuggestions(value));
  }

  selectSuggestion(champion: string): void {
    this.submitGuess(champion);
  }

  submitGuess(guess: string): void {
    if (!guess.trim() || !this.currentChampion) return;

    this.timer.incrementAttempts();

    const normalized = this.championService.normalizeStr(guess);
    const correct = this.championService.normalizeStr(this.currentChampion);

    if (normalized === correct) {
      this.trophyService.checkfastGuess(this.timeToGuess());
      this.timer.incrementCorrect();
      this.gameService.addHistory({ champion: this.currentChampion, correct: true });
      this.trophyService.addCorrect();
      this.trophyService.checkStreak(this.timer.stats().streak);
      this.feedback.set('correct');
      if (this.currentSoluce) this.champImageSrc.set(this.currentSoluce);
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
        this.loadNextChamp();
      }, 1000);
    } else {
      this.timer.resetStreak();
      this.gameService.addHistory({ champion: guess, correct: false });
      this.feedback.set('wrong');
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
      }, 2000);
    }
  }
}
