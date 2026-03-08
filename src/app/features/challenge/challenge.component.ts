import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrophyService } from '../../core/services/trophy.service';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss',
})
export class ChallengeComponent implements OnInit {
  private trophyService = inject(TrophyService);

  ngOnInit(): void {
    this.trophyService.unlock('challenge_mode');
  }
}
