
export type PlayerId = 'p1' | 'p2';

export interface Player {
  id: PlayerId;
  name: string;
}

export type PointScore = string; // '0', '15', '30', '40' ou números no Tie-break

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
  history: GameState[];
}

// Added GeminiAction to fix import error in geminiService.ts and AssistantChat.tsx
export interface GeminiAction {
  action: 'POINT_P1' | 'POINT_P2' | 'RESET' | 'UNDO' | 'EXPLAIN' | 'UNKNOWN';
  message: string;
}

// Added ChatMessage to fix import error in AssistantChat.tsx
export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}
