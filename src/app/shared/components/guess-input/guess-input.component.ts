import { Component, Input, Output, EventEmitter, signal, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-guess-input',
  standalone: true,
  templateUrl: './guess-input.component.html',
  styleUrl: './guess-input.component.scss',
})
export class GuessInputComponent {
  @Input() suggestions: string[] = [];
  @Input() placeholder = 'Tape une réponse...';
  @Output() queryChange = new EventEmitter<string>();
  @Output() submit = new EventEmitter<string>();

  @ViewChild('inputEl') inputRef!: ElementRef<HTMLInputElement>;

  readonly focusedIndex = signal(0);

  focus(): void {
    setTimeout(() => this.inputRef?.nativeElement?.focus(), 50);
  }

  clear(): void {
    if (this.inputRef) this.inputRef.nativeElement.value = '';
    this.focusedIndex.set(0);
    this.queryChange.emit('');
  }

  onInput(value: string): void {
    this.focusedIndex.set(0);
    this.queryChange.emit(value);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.suggestions;
    if (!items.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex.update(i => (i + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex.update(i => (i - 1 + items.length) % items.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = items[this.focusedIndex()];
      if (selected) this.selectItem(selected);
    }
  }

  selectItem(item: string): void {
    if (this.inputRef) this.inputRef.nativeElement.value = '';
    this.focusedIndex.set(0);
    this.queryChange.emit('');
    this.submit.emit(item);
  }
}
