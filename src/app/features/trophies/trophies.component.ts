import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrophyService } from '../../core/services/trophy.service';

@Component({
  selector: 'app-trophies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trophies.component.html',
  styleUrl: './trophies.component.scss',
})
export class TrophiesComponent {
  readonly trophyService = inject(TrophyService);
}
