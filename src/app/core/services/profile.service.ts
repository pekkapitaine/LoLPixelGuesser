import { Injectable, signal, effect } from '@angular/core';
import { Profile, DEFAULT_PROFILE, THEMES, Theme } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly STORAGE_KEY = 'lpg_profile';

  private _profile = signal<Profile>(this.load());
  readonly profile = this._profile.asReadonly();

  constructor() {
    effect(() => {
      this.applyTheme(this._profile().theme);
    });
  }

  private load(): Profile {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._profile()));
  }

  setPseudo(pseudo: string): void {
    this._profile.update(p => ({ ...p, pseudo: pseudo.trim() }));
    this.save();
  }

  setAvatar(index: number): void {
    this._profile.update(p => ({ ...p, avatarIndex: index }));
    this.save();
  }

  setTheme(theme: Theme): void {
    this._profile.update(p => ({ ...p, theme }));
    this.save();
  }

  private applyTheme(theme: Theme): void {
    const t = THEMES.find(t => t.id === theme) ?? THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', t.primary);
    root.style.setProperty('--theme-bg', t.bg);
    root.style.setProperty('--theme-accent', t.accent);
  }
}
