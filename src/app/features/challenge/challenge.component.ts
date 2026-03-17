import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrophyService } from '../../core/services/trophy.service';
import { EscaladeService } from '../../core/services/escalade.service';
import { ChronoService } from '../../core/services/chrono.service';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [RouterLink, BackBtnComponent],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss',
})
export class ChallengeComponent implements OnInit {
  private trophyService = inject(TrophyService);
  readonly escaladeService = inject(EscaladeService);
  readonly chronoService = inject(ChronoService);

  ngOnInit(): void {
    this.trophyService.unlock('challenge_mode');
  }
}
