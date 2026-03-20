import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../core/services/game.service';
import { PwaService } from '../../core/services/pwa.service';
import { ProfileService } from '../../core/services/profile.service';
import { TrophyService } from '../../core/services/trophy.service';
import { Difficulty, DIFFICULTY_LABELS } from '../../core/models/champion.model';
import { AudioService } from '../../core/services/audio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public router = inject(Router);
  private gameService = inject(GameService);
  readonly pwa = inject(PwaService);
  readonly profileService = inject(ProfileService);
  readonly trophyService = inject(TrophyService);
  readonly audioService = inject(AudioService)

  get profile() { return this.profileService.profile(); }

  readonly difficulties: Difficulty[] = ['facile', 'moyen', 'difficile', 'extreme'];
  readonly labels = DIFFICULTY_LABELS;

  get includeSkins(): boolean { return this.gameService.includeSkins(); }
  set includeSkins(value: boolean) { this.gameService.setIncludeSkins(value); }

  get includeArena(): boolean { return this.gameService.includeArena(); }
  set includeArena(value: boolean) { this.gameService.setIncludeArena(value); }

  readonly isBgSoundActive = signal<boolean>(this.loadSoundOnOff());

  selectDifficulty(difficulty: Difficulty): void {
    this.gameService.setDifficulty(difficulty);
    this.router.navigate(['/infinite/champion', difficulty]);
  }

  ngOnInit(): void {
    setTimeout(() => this.pwa.checkAndShowInstallModal(), 1000);
  }

  loadSoundOnOff() {
    const saved = localStorage.getItem('audio_on_off');
    return saved ? JSON.parse(saved) : true ; 
  }

  turnSound() {
    const newState = !this.isBgSoundActive();
    this.isBgSoundActive.set(newState);
    localStorage.setItem('audio_on_off', JSON.stringify(newState));
    this.audioService.mute(!newState);
  }
}
