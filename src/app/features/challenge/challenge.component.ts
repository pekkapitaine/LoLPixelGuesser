import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrophyService } from '../../core/services/trophy.service';
import { EscaladeService } from '../../core/services/escalade.service';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss',
})
export class ChallengeComponent implements OnInit {
  private trophyService = inject(TrophyService);
  readonly escaladeService = inject(EscaladeService);

  ngOnInit(): void {
    this.trophyService.unlock('challenge_mode');
  }
}
