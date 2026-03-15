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
export const AVATARS = [
  '🐺', '🦁', '🐉', '🦊', '🦅', '🐺',
  '⚡', '🔥', '💎', '🌙', '❄️', '🌊',
  '🎯', '👑', '🛡️', '⚔️', '🎮', '🏆',
];
