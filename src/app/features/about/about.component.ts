import { Component, inject } from '@angular/core';
import { BackBtnComponent } from '../../shared/components/back-btn/back-btn.component';
import { ChangelogComponent } from '../../shared/components/changelog/changelog.component'
import { PwaService } from '../../core/services/pwa.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [BackBtnComponent, ChangelogComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly pwa = inject(PwaService);
}
