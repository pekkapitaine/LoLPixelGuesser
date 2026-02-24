export interface GameImage {
  file: string;
  champion: string;
  category: 'default' | 'skin';
}

export interface GameData {
  images: GameImage[];
}

export type Difficulty = 'facile' | 'moyen' | 'difficile' | 'extreme';

export const DIFFICULTY_PIXEL_SIZES: Record<Difficulty, number> = {
  facile: 20,
  moyen: 33,
  difficile: 46,
  extreme: 59,
};

export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; description: string }> = {
  facile:    { label: 'Facile',    description: 'Débutant tranquille' },
  moyen:     { label: 'Moyen',     description: 'Un peu de piquant' },
  difficile: { label: 'Difficile', description: 'Challenge sérieux' },
  extreme:   { label: 'Extreme',   description: 'Fou du pixel !' },
};
