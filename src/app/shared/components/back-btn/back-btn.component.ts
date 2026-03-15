import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-btn',
  standalone: true,
  template: `<button class="back-btn" (click)="go()">← Retour</button>`,
  styles: [`
    .back-btn {
      padding: 7px 12px;
      background: transparent;
      border: 1px solid #f8d24b;
      border-radius: 10px;
      color: #f8d24b;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.82rem;
      flex-shrink: 0;
      transition: background 0.15s;
      &:hover { background: rgba(248,210,75,0.1); }
    }
  `],
})
export class BackBtnComponent {
  @Input() route = '/';
  private router = inject(Router);
  go(): void { this.router.navigate([this.route]); }
}
