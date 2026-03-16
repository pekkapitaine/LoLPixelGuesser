import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { TrophyService } from '../../core/services/trophy.service';
import { BackgroundService, BG_DEFS, BgType } from '../../core/services/background.service';
import { AVATARS } from '../../core/models/profile.model';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, BackBtnComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly profileService = inject(ProfileService);
  readonly trophyService = inject(TrophyService);
  readonly bgService = inject(BackgroundService);

  readonly avatars = AVATARS;
  readonly bgDefs = Object.values(BG_DEFS);

  get profile() { return this.profileService.profile(); }
  get pseudo() { return this.profile.pseudo; }
  set pseudo(v: string) {
    this.profileService.setPseudo(v);
    if (v.toLowerCase() === 'groot') this.trophyService.unlock('groot');
  }

  selectAvatar(i: number): void {
    this.profileService.setAvatar(i);
  }

  selectBg(id: BgType): void {
    this.bgService.select(id);
  }

  isBgUnlocked(id: BgType): boolean {
    return this.bgService.unlocked().includes(id);
  }

  checkFlip(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.classList.toggle('tooltip-flip', rect.right + 160 > window.innerWidth);
  }

  share(): void {
    const p = this.profile;
    const avatar = this.avatars[p.avatarIndex];
    const pseudo = p.pseudo || 'Anonyme';
    const trophies = this.trophyService.unlockedCount();
    const total = this.trophyService.trophies().length;
    const body = [
      `${avatar} ${pseudo} sur LoL Pixel Guesser !`,
      `🏆 ${trophies} trophées débloqués`,
      `👉 https://pekkapitaine.github.io/LoLPixelGuesser/`,
    ].join('\n');
    window.open(`sms:?body=${encodeURIComponent(body)}`, '_self');
  }

}
