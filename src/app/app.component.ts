import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './core/services/pwa.service';
import { InstallModalComponent } from './shared/components/install-modal/install-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InstallModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private pwa = inject(PwaService);

  ngOnInit(): void {
    this.pwa.init();
  }
}
