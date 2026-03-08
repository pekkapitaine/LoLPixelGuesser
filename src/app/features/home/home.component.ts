import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { PwaService } from '../../core/services/pwa.service';
import { ProfileService } from '../../core/services/profile.service';
import { TrophyService } from '../../core/services/trophy.service';
import { Difficulty, DIFFICULTY_LABELS } from '../../core/models/champion.model';
import { AVATARS } from '../../core/models/profile.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private gameService = inject(GameService);
  private pwa = inject(PwaService);
  readonly profileService = inject(ProfileService);
  readonly trophyService = inject(TrophyService);
  readonly avatars = AVATARS;

  get profile() { return this.profileService.profile(); }

  ngOnInit(): void {
    setTimeout(() => this.pwa.checkAndShowInstallModal(), 1000);
  }

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
