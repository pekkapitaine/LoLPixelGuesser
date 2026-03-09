import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-pixel-image',
  standalone: true,
  templateUrl: './pixel-image.component.html',
  styleUrl: './pixel-image.component.scss',
})
export class PixelImageComponent {
  @Input() src = '';
  @Input() feedback: 'correct' | 'wrong' | 'none' = 'none';
  @Input() isLoading = false;
  @Input() alt = 'Image pixelisée';
  @Input() overlay = true;

  @HostBinding('class.is-correct') get isCorrect() { return this.feedback === 'correct'; }
  @HostBinding('class.is-wrong') get isWrong() { return this.feedback === 'wrong'; }
}
