import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { Difficulty, DIFFICULTY_LABELS } from '../../core/models/champion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private router = inject(Router);
  private gameService = inject(GameService);

  readonly difficulties: Difficulty[] = ['facile', 'moyen', 'difficile', 'extreme'];
  readonly labels = DIFFICULTY_LABELS;

  get includeSkins(): boolean {
    return this.gameService.includeSkins();
  }

  set includeSkins(value: boolean) {
    this.gameService.setIncludeSkins(value);
  }

  selectDifficulty(difficulty: Difficulty): void {
    this.gameService.setDifficulty(difficulty);
    this.router.navigate(['/game', difficulty]);
  }
}
