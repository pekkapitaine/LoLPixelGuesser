import {
  Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService, ItemImage } from '../../../core/services/item.service';
import { TimerService } from '../../../core/services/timer.service';

type FeedbackState = 'correct' | 'wrong' | 'none';

@Component({
  selector: 'app-item-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './item-game.component.html',
  styleUrl: './item-game.component.scss',
})
export class ItemGameComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  readonly itemService = inject(ItemService);
  readonly timer = inject(TimerService);

  // ---- State ----
  readonly imageSrc = signal<string>('');
  readonly feedback = signal<FeedbackState>('none');
  readonly inputValue = signal('');
  readonly suggestions = signal<string[]>([]);
  readonly focusedIndex = signal(0);
  readonly isLoading = signal(true);
  readonly showHistory = signal(false);
  readonly history = signal<{ name: string; correct: boolean }[]>([]);
  readonly stats = this.timer.stats;
  readonly formattedTime = this.timer.formattedTime;
  readonly ratio = this.timer.ratio;

  get includeArena(): boolean {
    return this.itemService.includeArena();
  }

  set includeArena(value: boolean) {
    this.itemService.setIncludeArena(value);
  }

  private currentItem: ItemImage | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('itemInput') itemInputRef!: ElementRef<HTMLInputElement>;

  async ngOnInit(): Promise<void> {
    await this.itemService.loadData();
    this.timer.start();
    await this.loadNextItem();
  }

  ngOnDestroy(): void {
    this.timer.stop();
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
  }

  // ---- Navigation ----
  goBack(): void {
    this.timer.stop();
    this.router.navigate(['/challenge']);
  }

  toggleHistory(): void {
    this.showHistory.update(v => !v);
  }

  // ---- Game logic ----
  async loadNextItem(): Promise<void> {
    this.isLoading.set(true);
    try {
      const item = this.itemService.getRandomItem(this.includeArena);
      if (!item) return;
      const path = this.itemService.getImagePath(item);
      const pixelized = await this.itemService.pixelizeImage(path);
      this.imageSrc.set(pixelized);
      this.currentItem = item;
    } catch (err) {
      console.error('Erreur chargement item :', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  skip(): void {
    this.history.update(h => [{ name: this.currentItem?.name ?? '?', correct: false }, ...h]);
    this.loadNextItem();
  }

  // ---- Input / suggestions ----
  onInputChange(value: string): void {
    this.inputValue.set(value);
    this.suggestions.set(this.itemService.filterSuggestions(value, this.includeArena));
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

  selectSuggestion(name: string): void {
    this.inputValue.set('');
    this.suggestions.set([]);
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
      this.showFeedback('correct');
      this.imageSrc.set(this.itemService.getImagePath(this.currentItem));
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
        this.loadNextItem();
      }, 1000);
    } else {
      this.timer.resetStreak();
      this.history.update(h => [{ name: guess, correct: false }, ...h]);
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
