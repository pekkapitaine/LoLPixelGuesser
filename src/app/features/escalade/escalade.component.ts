import {
  Component, OnInit, inject, signal, computed, ViewChild
} from '@angular/core';
import { ChampionService } from '../../core/services/champion.service';
import { EscaladeService } from '../../core/services/escalade.service';
import { TrophyService } from '../../core/services/trophy.service';
import { PixelImageComponent } from '../../shared/components/pixel-image/pixel-image.component';
import { GuessInputComponent } from '../../shared/components/guess-input/guess-input.component';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';

type FeedbackState = 'correct' | 'wrong' | 'none';

@Component({
  selector: 'app-escalade',
  standalone: true,
  imports: [PixelImageComponent, GuessInputComponent, BackBtnComponent],
  templateUrl: './escalade.component.html',
  styleUrl: './escalade.component.scss',
})
export class EscaladeComponent implements OnInit {
  private championService = inject(ChampionService);
  private trophyService = inject(TrophyService);
  readonly escaladeService = inject(EscaladeService);

  readonly round = signal(0);
  readonly champImageSrc = signal('');
  readonly feedback = signal<FeedbackState>('none');
  readonly suggestions = signal<string[]>([]);
  readonly isLoading = signal(true);
  readonly gameOver = signal(false);
  readonly revealedChampion = signal('');
  readonly isNewRecord = signal(false);

  readonly pixelSize = computed(() => Math.min(5 + this.round() * 3, 80));
  readonly pixelBarPercent = computed(() => Math.min(this.pixelSize() / 80 * 100, 100));

  private currentChampion: string | null = null;
  private currentSoluce: string | null = null;
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild(GuessInputComponent) guessInput!: GuessInputComponent;

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.championService.loadGameData(),
      this.championService.loadChampionsList(),
    ]);
    await this.startRound();
  }

  async restart(): Promise<void> {
    this.round.set(0);
    this.gameOver.set(false);
    this.feedback.set('none');
    this.suggestions.set([]);
    this.isNewRecord.set(false);
    await this.startRound();
  }

  private async startRound(): Promise<void> {
    this.round.update(r => r + 1);
    this.isLoading.set(true);
    try {
      const entry = this.championService.getRandomImage(false);
      if (!entry) return;
      const imagePath = this.championService.getImagePath(entry);
      const pixelized = await this.championService.pixelizeImageRaw(imagePath, this.pixelSize());
      this.champImageSrc.set(pixelized);
      this.currentChampion = entry.champion;
      this.currentSoluce = imagePath;
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
    if (!guess.trim() || !this.currentChampion || this.gameOver()) return;
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);

    const normalized = this.championService.normalizeStr(guess);
    const correct = this.championService.normalizeStr(this.currentChampion);

    if (normalized === correct) {
      this.trophyService.addCorrect();
      this.feedback.set('correct');
      if (this.currentSoluce) this.champImageSrc.set(this.currentSoluce);
      this.feedbackTimeout = setTimeout(() => {
        this.feedback.set('none');
        this.startRound();
      }, 1000);
    } else {
      this.triggerGameOver();
    }
  }

  private triggerGameOver(): void {
    const score = this.round() - 1;
    const prevBest = this.escaladeService.bestScore();
    this.escaladeService.saveBest(score);
    this.isNewRecord.set(score > prevBest && score > 0);
    this.revealedChampion.set(this.currentChampion ?? '');
    if (this.currentSoluce) this.champImageSrc.set(this.currentSoluce);
    this.gameOver.set(true);
    this.feedback.set('wrong');
  }
}
