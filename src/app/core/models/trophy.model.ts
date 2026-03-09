export type Rarity = 'common' | 'rare' | 'legendary';
export type TrophyCategory = 'progression' | 'series' | 'vitesse' | 'modes' | 'speciaux';

export const TROPHY_CATEGORY_LABELS: Record<TrophyCategory, string> = {
  progression: '📈 Progression',
  series:      '🔥 Séries',
  vitesse:     '⚡ Vitesse',
  modes:       '🎮 Modes de jeu',
  speciaux:    '🎁 Spéciaux',
};

export interface TrophyDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isSecret: boolean;
  rarity: Rarity;
  category: TrophyCategory;
}

export interface Trophy extends TrophyDef {
  unlocked: boolean;
  unlockedAt?: string;
}

export const TROPHIES: TrophyDef[] = [
  { id: 'first_correct',  title: 'Premier Pas',       description: 'Première bonne réponse !',                   icon: '🎯', color: '#4ade80', isSecret: false, rarity: 'common',     category: 'progression' },
  { id: 'correct_10',     title: 'Étoile Montante',    description: '10 bonnes réponses au total',                icon: '⭐', color: '#a78bfa', isSecret: false, rarity: 'common',    category: 'progression' },
  { id: 'correct_50',     title: 'Tireur d\'élite',    description: '50 bonnes réponses au total',                icon: '🏹', color: '#38bdf8', isSecret: false, rarity: 'common',    category: 'progression' },
  { id: 'correct_100',    title: 'Centenaire',         description: '100 bonnes réponses au total',               icon: '💯', color: '#f43f5e', isSecret: false, rarity: 'rare',      category: 'progression' },
  { id: 'correct_500',    title: 'Légende',            description: '500 bonnes réponses au total',               icon: '👑', color: '#f8d24b', isSecret: false, rarity: 'legendary', category: 'progression' },
  { id: 'streak_5',       title: 'En Feu',             description: '5 bonnes réponses d\'affilée',               icon: '🔥', color: '#f97316', isSecret: false, rarity: 'common',    category: 'series'      },
  { id: 'streak_10',      title: 'Éclair',             description: '10 bonnes réponses d\'affilée',              icon: '⚡', color: '#facc15', isSecret: false, rarity: 'rare',      category: 'series'      },
  { id: 'streak_20',      title: 'Intouchable',        description: '20 bonnes réponses d\'affilée',              icon: '🛡️', color: '#06b6d4', isSecret: false, rarity: 'legendary', category: 'series'      },
  { id: 'fast_5',         title: 'Petite Brise',       description: 'Trouver un champion en moins de 5 secondes', icon: '🍃', color: '#86efac', isSecret: false, rarity: 'common',    category: 'vitesse'     },
  { id: 'fast_3',         title: 'Bourrasque',         description: 'Trouver un champion en moins de 3 secondes', icon: '💨', color: '#a21caf', isSecret: false, rarity: 'common',    category: 'vitesse'     },
  { id: 'fast_2',         title: 'Tempête',            description: 'Trouver un champion en moins de 2 secondes', icon: '🌪️', color: '#c026d3', isSecret: false, rarity: 'rare',      category: 'vitesse'     },
  { id: 'fast_1',         title: 'Éclair Suprême',     description: 'Trouver un champion en moins de 1 seconde',  icon: '🌩️', color: '#e879f9', isSecret: false, rarity: 'legendary', category: 'vitesse'     },
  { id: 'extreme_mode',   title: 'Masochiste',         description: 'Jouer en mode Extrême',                      icon: '😈', color: '#dc2626', isSecret: false, rarity: 'common',    category: 'modes'       },
  { id: 'challenge_mode', title: 'Même pas peur',      description: 'Aller dans la section Challenges',                         icon: '⚔️', color: '#7c3aed', isSecret: false, rarity: 'common',    category: 'modes'       },
  { id: 'groot',          title: 'Groot',              description: 'Je s\'appelle Groot',                        icon: '🪵', color: '#4e2e05', isSecret: false,  rarity: 'legendary', category: 'speciaux'   },
];
