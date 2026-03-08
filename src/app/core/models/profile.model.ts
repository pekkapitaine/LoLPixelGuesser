export type Theme = 'dark' | 'gold' | 'blue' | 'purple';

export interface Profile {
  pseudo: string;
  avatarIndex: number;
  theme: Theme;
}

export const DEFAULT_PROFILE: Profile = {
  pseudo: 'Invocateur',
  avatarIndex: 0,
  theme: 'dark',
};

export const THEMES: { id: Theme; label: string; primary: string; bg: string; accent: string }[] = [
  { id: 'dark',   label: '🌑 Dark',   primary: '#f8d24b', bg: '#1e1e2f', accent: '#101820' },
  { id: 'gold',   label: '✨ Gold',   primary: '#ffd700', bg: '#1a1500', accent: '#2a2000' },
  { id: 'blue',   label: '🌊 Blue',   primary: '#38bdf8', bg: '#0a1628', accent: '#0f2040' },
  { id: 'purple', label: '💜 Purple', primary: '#a78bfa', bg: '#13001e', accent: '#1e0030' },
];

export const AVATARS = [
  '🐺', '🦁', '🐉', '🦊', '🦅', '🐺',
  '⚡', '🔥', '💎', '🌙', '❄️', '🌊',
  '🎯', '👑', '🛡️', '⚔️', '🎮', '🏆',
];
