import { Injectable, signal } from '@angular/core';
import { GameData, GameImage, Difficulty, DIFFICULTY_PIXEL_SIZES } from '../models/champion.model';

@Injectable({ providedIn: 'root' })
export class ChampionService {
  private gameData: GameData | null = null;
  private championsList: string[] = [];

  async loadGameData(): Promise<void> {
    if (this.gameData) return;
    const res = await fetch('game_data.json');
    this.gameData = await res.json();
  }

  async loadChampionsList(): Promise<string[]> {
    if (this.championsList.length) return this.championsList;
    const res = await fetch('champions_list.json');
    this.championsList = await res.json();
    return this.championsList;
  }

  getChampionsList(): string[] {
    return this.championsList;
  }

  getFilteredImages(includeSkins: boolean): GameImage[] {
    const images = this.gameData?.images ?? [];
    return includeSkins ? images : images.filter(img => img.category === 'default');
  }

  getRandomImage(includeSkins: boolean): GameImage | null {
    const images = this.getFilteredImages(includeSkins);
    if (!images.length) return null;
    return images[Math.floor(Math.random() * images.length)];
  }

  getImagePath(entry: GameImage): string {
    const folder = entry.category === 'skin' ? 'SkinChamps' : 'DefaultChamps';
    return `ImagesChamps/${folder}/${entry.file}`;
  }

  async pixelizeImage(src: string, difficulty: Difficulty): Promise<string> {
    const pixelSize = DIFFICULTY_PIXEL_SIZES[difficulty];
    const img = new Image();
    img.src = src;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(`Erreur chargement image: ${src}`);
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const w = Math.max(1, Math.floor(img.width / pixelSize));
    const h = Math.max(1, Math.floor(img.height / pixelSize));

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

  filterSuggestions(query: string): string[] {
    if (!query.trim()) return [];
    const lq = query.toLowerCase().trim();
    const matches = this.championsList.filter(c => c.toLowerCase().includes(lq));
    return matches.sort((a, b) => {
      const A = a.toLowerCase();
      const B = b.toLowerCase();
      const aStarts = A.startsWith(lq);
      const bStarts = B.startsWith(lq);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return A.localeCompare(B);
    });
  }

  normalizeStr(s: string): string {
    return String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .replace('_', ' ')
      .trim()
      .toLowerCase();
  }
}
