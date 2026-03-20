import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PwaService } from './core/services/pwa.service';
import { ProfileService } from './core/services/profile.service';
import { InstallModalComponent } from './shared/components/install-modal/install-modal.component';
import { TrophyUnlockComponent } from './shared/components/trophy-unlock/trophy-unlock.component';

import { AudioService } from './core/services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InstallModalComponent, TrophyUnlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private pwa = inject(PwaService);
  private router = inject(Router);
  private audio = inject(AudioService)

  ngOnInit(): void {
    this.pwa.init();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
    const soundOn = localStorage.getItem('audio_on_off');
    if (soundOn === 'false') this.audio.mute(true);
    document.getElementById('play-btn')?.addEventListener('click', () => this.audio.playMusic());
  }
}
