import { useState, useCallback } from 'react';
import { GameState, PlayerId, SetResult } from '../types';

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
  setResults: [],
  history: [],
};

const SCORES = ['0', '15', '30', '40'];

export const useBeachTennisGame = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  const addPoint = useCallback((player: PlayerId) => {
    if (gameState.winner) return;

    setGameState(prev => {
      // Create a snapshot of the current state to store in history.
      // We set its history to an empty array to satisfy the GameState interface
      // while avoiding nested history structures that lead to excessive memory usage.
      const stateToSave: GameState = { ...prev, history: [] };
      
      const newState: GameState = { 
        ...prev, 
        history: [...prev.history, stateToSave] 
      };
      
      const isP1 = player === 'p1';

      if (prev.isTieBreak) {
        let p1T = prev.p1TiePoints + (isP1 ? 1 : 0);
        let p2T = prev.p2TiePoints + (!isP1 ? 1 : 0);

        if ((p1T >= 7 && p1T - p2T >= 2) || (p2T >= 7 && p2T - p1T >= 2)) {
          const p1SetWon = p1T > p2T;
          const newSetResult: SetResult = { p1: prev.p1Games, p2: prev.p2Games };
          if (p1SetWon) newSetResult.p1 = 7; else newSetResult.p2 = 7;

          const updatedSetsP1 = prev.p1Sets + (p1SetWon ? 1 : 0);
          const updatedSetsP2 = prev.p2Sets + (!p1SetWon ? 1 : 0);

          return {
            ...newState,
            p1Sets: updatedSetsP1,
            p2Sets: updatedSetsP2,
            p1Games: 0,
            p2Games: 0,
            p1Score: '0',
            p2Score: '0',
            p1TiePoints: 0,
            p2TiePoints: 0,
            isTieBreak: false,
            setResults: [...prev.setResults, newSetResult],
            winner: updatedSetsP1 === 2 ? 'p1' : (updatedSetsP2 === 2 ? 'p2' : null)
          };
        }
        return { ...newState, p1TiePoints: p1T, p2TiePoints: p2T, p1Score: p1T.toString(), p2Score: p2T.toString() };
      }

      const currentIdx = SCORES.indexOf(isP1 ? prev.p1Score : prev.p2Score);
      
      if (currentIdx < 3) {
        const nextScore = SCORES[currentIdx + 1];
        if (isP1) newState.p1Score = nextScore;
        else newState.p2Score = nextScore;
      } else {
        newState.p1Score = '0';
        newState.p2Score = '0';
        let p1G = prev.p1Games + (isP1 ? 1 : 0);
        let p2G = prev.p2Games + (!isP1 ? 1 : 0);
        newState.p1Games = p1G;
        newState.p2Games = p2G;
        newState.currentServer = prev.currentServer === 'p1' ? 'p2' : 'p1';

        if (p1G === 6 && p2G === 6) {
          newState.isTieBreak = true;
          newState.p1Score = '0';
          newState.p2Score = '0';
        } else if ((p1G >= 6 && p1G - p2G >= 2) || p1G === 7) {
          newState.setResults = [...prev.setResults, { p1: p1G, p2: p2G }];
          newState.p1Sets += 1;
          newState.p1Games = 0;
          newState.p2Games = 0;
        } else if ((p2G >= 6 && p2G - p1G >= 2) || p2G === 7) {
          newState.setResults = [...prev.setResults, { p1: p1G, p2: p2G }];
          newState.p2Sets += 1;
          newState.p1Games = 0;
          newState.p2Games = 0;
        }

        if (newState.p1Sets === 2) newState.winner = 'p1';
        if (newState.p2Sets === 2) newState.winner = 'p2';
      }

      return newState;
    });
  }, [gameState.winner]);

  const undo = useCallback(() => {
    setGameState(prev => {
      if (prev.history.length === 0) return prev;
      const history = [...prev.history];
      const lastState = history.pop();
      if (!lastState) return prev;
      return { ...lastState, history } as GameState;
    });
  }, []);

  const resetMatch = useCallback(() => setGameState(INITIAL_STATE), []);

  return { gameState, addPoint, undo, resetMatch };
};