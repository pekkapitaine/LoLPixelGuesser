import { Injectable, signal } from '@angular/core';

export interface ItemImage {
  file: string;
  name: string;
  category: 'classique' | 'arena';
}

const ITEM_PIXEL_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class ItemService {
  private data: ItemImage[] = [];
  private _includeArena = signal<boolean>(
    JSON.parse(localStorage.getItem('item_includeArena') ?? 'false')
  );

  readonly includeArena = this._includeArena.asReadonly();

  setIncludeArena(value: boolean): void {
    this._includeArena.set(value);
    localStorage.setItem('item_includeArena', JSON.stringify(value));
  }

  async loadData(): Promise<void> {
    if (this.data.length) return;
    const res = await fetch('items_data.json');
    const json = await res.json();
    this.data = json.images;
  }

  getFilteredImages(includeArena: boolean): ItemImage[] {
    return includeArena ? this.data : this.data.filter(i => i.category === 'classique');
  }

  getRandomItem(includeArena: boolean): ItemImage | null {
    const imgs = this.getFilteredImages(includeArena);
    if (!imgs.length) return null;
    return imgs[Math.floor(Math.random() * imgs.length)];
  }

  getImagePath(item: ItemImage): string {
    const folder = item.category === 'arena' ? 'Arena' : 'Classique';
    return `ImagesItems/${folder}/${item.file}`;
  }

  getItemsList(includeArena: boolean): string[] {
    return [...new Set(this.getFilteredImages(includeArena).map(i => i.name))].sort();
  }

  filterSuggestions(query: string, includeArena: boolean): string[] {
    if (!query.trim()) return [];
    const lq = this.normalizeStr(query);
    const names = this.getItemsList(includeArena);
    const matches = names.filter(n => this.normalizeStr(n).includes(lq));
    return matches.sort((a, b) => {
      const A = this.normalizeStr(a);
      const B = this.normalizeStr(b);
      const aStarts = A.startsWith(lq);
      const bStarts = B.startsWith(lq);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return A.localeCompare(B);
    });
  }

  async pixelizeImage(src: string): Promise<string> {
    const img = new Image();
    img.src = src;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(`Erreur chargement image: ${src}`);
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const w = Math.max(1, Math.floor(img.width / ITEM_PIXEL_SIZE));
    const h = Math.max(1, Math.floor(img.height / ITEM_PIXEL_SIZE));

    canvas.width = w;
    canvas.height = h;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, w, h);

    const canvas2 = document.createElement('canvas');
    canvas2.width = img.width;
    canvas2.height = img.height;
    const ctx2 = canvas2.getContext('2d')!;
    ctx2.imageSmoothingEnabled = false;
    ctx2.drawImage(canvas, 0, 0, w, h, 0, 0, img.width, img.height);

    return canvas2.toDataURL();
  }

  normalizeStr(s: string): string {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
}
