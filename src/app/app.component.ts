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
  private profile = inject(ProfileService);
  private router = inject(Router);
  private audio = inject(AudioService)

  ngOnInit(): void {
    this.pwa.init();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));
    const splash = document.getElementById('splash');
    if (splash) {
      setTimeout(() => splash.classList.add('fade-out'), 500);
      setTimeout(() => splash.remove(), 1000);
    }
    this.audio.playMusic()
  }
}
