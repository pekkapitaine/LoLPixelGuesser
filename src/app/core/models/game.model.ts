export interface GameStats {
  attempts: number;
  correct: number;
  streak: number;
}

export interface HistoryEntry {
  champion: string;
  correct: boolean;
}
