
import { useState, useCallback } from 'react';
import { GameState, PlayerId } from '../types';

const INITIAL_STATE: GameState = {
  p1Score: '0',
  p2Score: '0',
  p1Games: 0,
  p2Games: 0,
  p1Sets: 0,
  p2Sets: 0,
  p1TiePoints: 0,
  p2TiePoints: 0,
  currentServer: 'p1',
  winner: null,
  isTieBreak: false,
  history: [],
};

const SCORES = ['0', '15', '30', '40'];

export const useBeachTennisGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const addPoint = useCallback((player: PlayerId) => {
    if (gameState.winner) return;

    setGameState(prev => {
      const newState = { ...prev, history: [...prev.history, { ...prev, history: [] }] };
      const isP1 = player === 'p1';

      if (prev.isTieBreak) {
        // Lógica de Tie-break (CBT: até 7, diferença de 2)
        let p1T = prev.p1TiePoints + (isP1 ? 1 : 0);
        let p2T = prev.p2TiePoints + (!isP1 ? 1 : 0);

        if ((p1T >= 7 && p1T - p2T >= 2) || (p2T >= 7 && p2T - p1T >= 2)) {
          // Fim do Set via Tie-break
          const p1SetWon = p1T > p2T;
          return {
            ...newState,
            p1Sets: prev.p1Sets + (p1SetWon ? 1 : 0),
            p2Sets: prev.p2Sets + (!p1SetWon ? 1 : 0),
            p1Games: 0,
            p2Games: 0,
            p1Score: '0',
            p2Score: '0',
            p1TiePoints: 0,
            p2TiePoints: 0,
            isTieBreak: false,
            winner: (prev.p1Sets + (p1SetWon ? 1 : 0) === 2) ? 'p1' : (prev.p2Sets + (!p1SetWon ? 1 : 0) === 2 ? 'p2' : null)
          };
        }
        return { ...newState, p1TiePoints: p1T, p2TiePoints: p2T, p1Score: p1T.toString(), p2Score: p2T.toString() };
      }

      // Lógica de Game Normal (CBT: No-Ad)
      const currentIdx = SCORES.indexOf(isP1 ? prev.p1Score : prev.p2Score);
      
      if (currentIdx < 3) {
        const nextScore = SCORES[currentIdx + 1];
        if (isP1) newState.p1Score = nextScore;
        else newState.p2Score = nextScore;
      } else {
        // Game vencido (No-Ad: quem faz o ponto após 40 vence)
        newState.p1Score = '0';
        newState.p2Score = '0';
        let p1G = prev.p1Games + (isP1 ? 1 : 0);
        let p2G = prev.p2Games + (!isP1 ? 1 : 0);
        newState.p1Games = p1G;
        newState.p2Games = p2G;
        newState.currentServer = prev.currentServer === 'p1' ? 'p2' : 'p1';

        // Verifica Tie-break
        if (p1G === 6 && p2G === 6) {
          newState.isTieBreak = true;
          newState.p1Score = '0';
          newState.p2Score = '0';
        } 
        // Verifica fim do Set (Normal: 6 games com diferença de 2, ou 7-5)
        else if ((p1G >= 6 && p1G - p2G >= 2) || p1G === 7) {
          newState.p1Sets += 1;
          newState.p1Games = 0;
          newState.p2Games = 0;
        } else if ((p2G >= 6 && p2G - p1G >= 2) || p2G === 7) {
          newState.p2Sets += 1;
          newState.p1Games = 0;
          newState.p2Games = 0;
        }

        // Verifica vencedor da partida (Melhor de 3)
        if (newState.p1Sets === 2) newState.winner = 'p1';
        if (newState.p2Sets === 2) newState.winner = 'p2';
      }

      return newState;
    });
  }, [gameState.winner]);

  const undo = useCallback(() => {
    setGameState(prev => {
      if (prev.history.length === 0) return prev;
      const last = prev.history[prev.history.length - 1];
      return { ...last, history: prev.history.slice(0, -1) };
    });
  }, []);

  const resetMatch = useCallback(() => setGameState(INITIAL_STATE), []);

  return { gameState, addPoint, undo, resetMatch };
};
