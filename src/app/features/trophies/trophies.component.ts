import { Component, inject, computed } from '@angular/core';
import { TrophyService } from '../../core/services/trophy.service';
import { TrophyCategory, TROPHY_CATEGORY_LABELS } from '../../core/models/trophy.model';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';

@Component({
  selector: 'app-trophies',
  standalone: true,
  imports: [BackBtnComponent],
  templateUrl: './trophies.component.html',
  styleUrl: './trophies.component.scss',
})
export class TrophiesComponent {
  readonly trophyService = inject(TrophyService);

  readonly categories: TrophyCategory[] = ['progression', 'series', 'vitesse', 'chronometre' ,'modes', 'speciaux'];
  readonly categoryLabels = TROPHY_CATEGORY_LABELS;

  readonly grouped = computed(() => {
    const all = this.trophyService.trophies();
    return this.categories.map(cat => ({
      cat,
      label: TROPHY_CATEGORY_LABELS[cat],
      trophies: all.filter(t => t.category === cat),
    }));
  });

  stars(rarity: string): number {
    return rarity === 'common' ? 1 : rarity === 'rare' ? 2 : 3;
  }
}
