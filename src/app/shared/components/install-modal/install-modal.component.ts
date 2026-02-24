import { Component, inject } from '@angular/core';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-install-modal',
  standalone: true,
  templateUrl: './install-modal.component.html',
  styleUrl: './install-modal.component.scss',
})
export class InstallModalComponent {
  readonly pwa = inject(PwaService);
}
