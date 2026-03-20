import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { TrophyService } from '../../core/services/trophy.service';
import { BackgroundService, BG_DEFS } from '../../core/services/background.service';
import { AvatarService, AVATAR_DEFS } from '../../core/services/avatar.service';
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
  readonly avatarService = inject(AvatarService);

  readonly bgDefs = Object.values(BG_DEFS);
  readonly avatarDefs = AVATAR_DEFS;

  get profile() { return this.profileService.profile(); }
  get pseudo() { return this.profile.pseudo; }
  set pseudo(v: string) {
    this.profileService.setPseudo(v);
    if (v.toLowerCase() === 'groot') this.trophyService.unlock('groot');
  }

  selectAvatar(id: string): void {
    this.avatarService.select(id);
  }

  isAvatarUnlocked(id: string): boolean {
    return this.avatarService.unlocked().includes(id);
  }

  selectBg(id: string): void {
    this.bgService.select(id);
  }

  isBgUnlocked(id: string): boolean {
    return this.bgService.unlocked().includes(id);
  }

  checkFlip(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.classList.toggle('tooltip-flip', rect.right + 160 > window.innerWidth);
  }

  toggleTooltip(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.classList.toggle('tooltip-flip', rect.right + 160 > window.innerWidth);
    const isOpen = el.classList.contains('tooltip-open');
    document.querySelectorAll('.badge.tooltip-open').forEach(b => b.classList.remove('tooltip-open'));
    if (!isOpen) el.classList.add('tooltip-open');
  }

  async share(): Promise<void> {
    const avatar = this.avatarService.currentEmoji;
    const pseudo = this.profile.pseudo || 'Anonyme';
    const trophies = this.trophyService.unlockedCount();
    const url = 'https://pekkapitaine.github.io/LoLPixelGuesser/';

    if (navigator.share) {
      await navigator.share({
        title: 'LoL Pixel Guesser',
        text: `${avatar} ${pseudo} est sur LoL Pixel Guesser ! Ne rate pas ce banger !`,
        url,
      });
    } else {
      const body = `${avatar} ${pseudo} est sur LoL Pixel Guesser ! Ne rate pas ce banger ! \n👉 ${url}`;
      window.open(`sms:?body=${encodeURIComponent(body)}`, '_self');
    }
    this.trophyService.checkShared();
  }
}
