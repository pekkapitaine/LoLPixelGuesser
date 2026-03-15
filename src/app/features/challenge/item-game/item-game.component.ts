import {
  Component, OnInit, OnDestroy, inject, signal, ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemService, ItemImage } from '../../../core/services/item.service';
import { TimerService } from '../../../core/services/timer.service';
import { PixelImageComponent } from '../../../shared/components/pixel-image/pixel-image.component';
import { GuessInputComponent } from '../../../shared/components/guess-input/guess-input.component';
import { GameService } from '../../../core/services/game.service';
import { BackBtnComponent } from '../../../shared/components/back-btn/back-btn.component';

type FeedbackState = 'correct' | 'wrong' | 'none';

@Component({
  selector: 'app-item-game',
  standalone: true,
  imports: [FormsModule, PixelImageComponent, GuessInputComponent, BackBtnComponent],
  templateUrl: './item-game.component.html',
  styleUrl: './item-game.component.scss',
})
export class ItemGameComponent implements OnInit, OnDestroy {
  readonly itemService = inject(ItemService);
  readonly timer = inject(TimerService);
  readonly gameService = inject(GameService);

  readonly imageSrc = signal<string>('');
  readonly feedback = signal<FeedbackState>('none');
  readonly suggestions = signal<string[]>([]);
  readonly isLoading = signal(true);
  readonly showHistory = signal(false);
  readonly history = signal<{ name: string; correct: boolean }[]>([]);
  readonly stats = this.timer.stats;
  readonly formattedTime = this.timer.formattedTime;
  readonly ratio = this.timer.ratio;

  private currentItem: ItemImage | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild(GuessInputComponent) guessInput!: GuessInputComponent;

  async ngOnInit(): Promise<void> {
    await this.itemService.loadData();
    this.timer.start();
    await this.loadNextItem();
  }

  ngOnDestroy(): void {
    this.timer.stop();
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  }

  toggleHistory(): void { this.showHistory.update(v => !v); }

  async loadNextItem(): Promise<void> {
    this.isLoading.set(true);
    try {
      const item = this.itemService.getRandomItem(this.gameService.includeArena());
      if (!item) return;
      const path = this.itemService.getImagePath(item);
      const pixelized = await this.itemService.pixelizeImage(path);
      this.imageSrc.set(pixelized);
      this.currentItem = item;
    } catch (err) {
      console.error('Erreur chargement item :', err);
    } finally {
      this.isLoading.set(false);
      this.guessInput?.focus();
    }
  }

  skip(): void {
    this.history.update(h => [{ name: this.currentItem?.name ?? '?', correct: false }, ...h]);
    this.loadNextItem();
  }

  onQueryChange(value: string): void {
    this.suggestions.set(this.itemService.filterSuggestions(value, this.gameService.includeArena()));
  }

  selectSuggestion(name: string): void {
    this.submitGuess(name);
  }

  submitGuess(guess: string): void {
    if (!guess.trim() || !this.currentItem) return;
    this.timer.incrementAttempts();
    const normalized = this.itemService.normalizeStr(guess);
    const correct = this.itemService.normalizeStr(this.currentItem.name);
    if (normalized === correct) {
      this.timer.incrementCorrect();
      this.history.update(h => [{ name: this.currentItem!.name, correct: true }, ...h]);
      this.feedback.set('correct');
      this.imageSrc.set(this.itemService.getImagePath(this.currentItem));
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
        this.loadNextItem();
      }, 1000);
    } else {
      this.timer.resetStreak();
      this.history.update(h => [{ name: guess, correct: false }, ...h]);
      this.feedback.set('wrong');
      this.feedbackTimeout = setTimeout(() => { this.feedback.set('none'); }, 2000);
    }
  }

  private showFeedback(state: FeedbackState): void {
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.feedback.set(state);
  }
}
