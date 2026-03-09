import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './core/services/pwa.service';
import { ProfileService } from './core/services/profile.service';
import { InstallModalComponent } from './shared/components/install-modal/install-modal.component';
import { TrophyUnlockComponent } from './shared/components/trophy-unlock/trophy-unlock.component';
import { ChangelogComponent } from './shared/components/changelog/changelog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InstallModalComponent, TrophyUnlockComponent, ChangelogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private pwa = inject(PwaService);
  private profile = inject(ProfileService); // init theme on startup

  ngOnInit(): void {
    this.pwa.init();
  }
}
