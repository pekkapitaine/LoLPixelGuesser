import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { TrophyService } from '../../core/services/trophy.service';
import { THEMES, AVATARS } from '../../core/models/profile.model';
import { Theme } from '../../core/models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly profileService = inject(ProfileService);
  readonly trophyService = inject(TrophyService);

  readonly themes = THEMES;
  readonly avatars = AVATARS;

  get profile() { return this.profileService.profile(); }
  get pseudo() { return this.profile.pseudo; }
  set pseudo(v: string) { 
    this.profileService.setPseudo(v);
      if (v.toLowerCase() === 'groot') this.trophyService.unlock('groot');
   }

  selectAvatar(i: number): void {
    this.profileService.setAvatar(i);
  }

  selectTheme(id: Theme): void {
    this.profileService.setTheme(id);
  }
}
