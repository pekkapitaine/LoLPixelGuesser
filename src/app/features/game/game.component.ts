import {
  Component, OnInit, OnDestroy, inject, signal, computed, ElementRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { ChampionService } from '../../core/services/champion.service';
import { TimerService } from '../../core/services/timer.service';
import { Difficulty, DIFFICULTY_LABELS } from '../../core/models/champion.model';
import { HistoryEntry } from '../../core/models/game.model';

type FeedbackState = 'correct' | 'wrong' | 'none';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameService = inject(GameService);
  private championService = inject(ChampionService);
  readonly timer = inject(TimerService);

  // ---- State ----
  readonly difficulty = signal<Difficulty>('facile');
  readonly difficultyTitle = computed(() => DIFFICULTY_LABELS[this.difficulty()].label);
  readonly champImageSrc = signal<string>('');
  readonly feedback = signal<FeedbackState>('none');
  readonly inputValue = signal('');
  readonly suggestions = signal<string[]>([]);
  readonly focusedIndex = signal(0);
  readonly isLoading = signal(true);
  readonly history = this.gameService.history;
  readonly stats = this.timer.stats;
  readonly formattedTime = this.timer.formattedTime;
  readonly ratio = this.timer.ratio;

  readonly showHistory = signal(false);

  private currentChampion: string | null = null;
  private currentSoluce: string | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('champInput') champInputRef!: ElementRef<HTMLInputElement>;

  async ngOnInit(): Promise<void> {
    const diff = this.route.snapshot.paramMap.get('difficulty') as Difficulty;
    this.difficulty.set(diff ?? 'facile');
    this.gameService.setDifficulty(this.difficulty());
    this.gameService.resetHistory();

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

  // ---- Navigation ----
  toggleHistory(): void {
    this.showHistory.update(v => !v);
  }

  goBack(): void {
    this.timer.stop();
    this.router.navigate(['/']);
  }

  // ---- Game logic ----
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
    } catch (err) {
      console.error('Erreur chargement champion :', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  skip(): void {
    this.loadNextChamp();
  }

  // ---- Input / suggestions ----
  onInputChange(value: string): void {
    this.inputValue.set(value);
    const filtered = this.championService.filterSuggestions(value);
    this.suggestions.set(filtered);
    this.focusedIndex.set(0);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.suggestions();
    if (!items.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex.update(i => (i + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex.update(i => (i - 1 + items.length) % items.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = items[this.focusedIndex()];
      if (selected) this.selectSuggestion(selected);
    }
  }

  selectSuggestion(champion: string): void {
    this.inputValue.set('');
    this.suggestions.set([]);
    this.submitGuess(champion);
  }

  submitGuess(guess: string): void {
    if (!guess.trim() || !this.currentChampion) return;

    this.timer.incrementAttempts();

    const normalized = this.championService.normalizeStr(guess);
    const correct = this.championService.normalizeStr(this.currentChampion);

    if (normalized === correct) {
      this.timer.incrementCorrect();
      this.gameService.addHistory({ champion: this.currentChampion, correct: true });
      this.showFeedback('correct');
      if (this.currentSoluce) this.champImageSrc.set(this.currentSoluce);
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
        this.loadNextChamp();
      }, 1000);
    } else {
      this.timer.resetStreak();
      this.gameService.addHistory({ champion: guess, correct: false });
      this.showFeedback('wrong');
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
      }, 2000);
    }
  }

  private showFeedback(state: FeedbackState): void {
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.feedback.set(state);
  }
}
