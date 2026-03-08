export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const TROPHIES: Trophy[] = [
  {
    id: 'first_correct',
    title: 'Premier Pas',
    description: 'Première bonne réponse !',
    icon: '🎯',
    color: '#4ade80',
    unlocked: false,
  },
  {
    id: 'correct_10',
    title: 'Étoile Montante',
    description: '10 bonnes réponses au total',
    icon: '⭐',
    color: '#a78bfa',
    unlocked: false,
  },
  {
    id: 'correct_50',
    title: 'Tireur d\'élite',
    description: '50 bonnes réponses au total',
    icon: '🏹',
    color: '#38bdf8',
    unlocked: false,
  },
  {
    id: 'correct_100',
    title: 'Centenaire',
    description: '100 bonnes réponses au total',
    icon: '💯',
    color: '#f43f5e',
    unlocked: false,
  },
  {
    id: 'correct_500',
    title: 'Légende',
    description: '500 bonnes réponses au total',
    icon: '👑',
    color: '#f8d24b',
    unlocked: false,
  },
  {
    id: 'streak_5',
    title: 'En Feu',
    description: '5 bonnes réponses d\'affilée',
    icon: '🔥',
    color: '#f97316',
    unlocked: false,
  },
  {
    id: 'streak_10',
    title: 'Éclair',
    description: '10 bonnes réponses d\'affilée',
    icon: '⚡',
    color: '#facc15',
    unlocked: false,
  },
  {
    id: 'streak_20',
    title: 'Intouchable',
    description: '20 bonnes réponses d\'affilée',
    icon: '🛡️',
    color: '#06b6d4',
    unlocked: false,
  },
  {
    id: 'extreme_mode',
    title: 'Masochiste',
    description: 'Jouer en mode Extrême',
    icon: '😈',
    color: '#dc2626',
    unlocked: false,
  },
  {
    id: 'challenge_mode',
    title: 'Releveur de Défis',
    description: 'Jouer en Mode Défi',
    icon: '⚔️',
    color: '#7c3aed',
    unlocked: false,
  },
];
