
export type PlayerId = 'p1' | 'p2';

/**
 * PointScore represents the points within a game (0, 15, 30, 40, AD or tiebreak points)
 * Added to fix errors in components/ScoreCard.tsx
 */
export type PointScore = string;

/**
 * Player interface used by UI components
 * Added to fix errors in components/ScoreCard.tsx
 */
export interface Player {
  id: PlayerId;
  name: string;
}

export interface SetResult {
  p1: number;
  p2: number;
}

export interface GameState {
  p1Score: PointScore;
  p2Score: PointScore;
  p1Games: number;
  p2Games: number;
  p1Sets: number;
  p2Sets: number;
  p1TiePoints: number;
  p2TiePoints: number;
  currentServer: PlayerId;
  winner: PlayerId | null;
  isTieBreak: boolean;
  setResults: SetResult[]; // Histórico de sets concluídos
  history: GameState[];    // Para o botão Desfazer
}
