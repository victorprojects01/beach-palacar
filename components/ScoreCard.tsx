import React from 'react';
import { Player, PointScore } from '../types';
import { Trophy, Edit2 } from 'lucide-react';

interface ScoreCardProps {
  player: Player;
  score: PointScore;
  games: number;
  sets: number;
  isServing: boolean;
  isWinner?: boolean;
  onAddPoint: () => void;
  onNameChange: (newName: string) => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  player, 
  score, 
  games, 
  sets, 
  isServing, 
  isWinner,
  onAddPoint,
  onNameChange
}) => {
  return (
    <div className={`relative flex flex-col items-center p-2 md:p-6 rounded-2xl md:rounded-3xl transition-all duration-300 h-full justify-between ${
      isWinner 
        ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 scale-105 shadow-2xl ring-4 ring-white z-10' 
        : 'bg-white shadow-xl'
    }`}>
      {/* Serving Indicator */}
      {isServing && !isWinner && (
        <div className="absolute -top-3 md:top-4 md:left-1/2 md:-translate-x-1/2 bg-beach-orange text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider z-20 shadow-sm">
          Sacando
        </div>
      )}

      {/* Winner Indicator */}
      {isWinner && (
        <div className="absolute -top-6 bg-beach-yellow border-4 border-white text-beach-dark p-2 md:p-3 rounded-full shadow-lg animate-bounce z-20">
            <Trophy className="w-6 h-6 md:w-8 md:h-8" />
        </div>
      )}

      {/* Player Name Input */}
      <div className="relative group w-full mt-2 md:mt-4 mb-2 md:mb-6 px-1">
        <input 
            type="text" 
            value={player.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full text-center text-sm md:text-2xl font-bold text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-beach-orange focus:outline-none transition-colors px-1 py-1 truncate placeholder-gray-400"
            placeholder="Nome"
        />
        <Edit2 className="w-3 h-3 text-gray-300 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:block hidden" />
      </div>

      {/* Main Score - The Big Number */}
      <button 
        onClick={onAddPoint}
        className="w-full aspect-square max-w-[120px] md:max-w-[180px] bg-beach-sand rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group cursor-pointer active:scale-95 transition-transform border-2 md:border-4 border-transparent hover:border-beach-yellow"
        aria-label={`Adicionar ponto para ${player.name}`}
      >
        <span className={`text-5xl md:text-8xl font-black select-none ${
            score === 'AD' ? 'text-beach-orange text-3xl md:text-6xl' : 'text-beach-dark'
        }`}>
          {score}
        </span>
      </button>

      {/* Sets and Games */}
      <div className="w-full grid grid-cols-2 gap-1.5 md:gap-4 px-1 md:px-0">
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-1.5 md:p-3 text-center border border-gray-100">
            <span className="block text-[8px] md:text-xs text-gray-400 uppercase font-bold tracking-wider">Games</span>
            <span className="text-lg md:text-3xl font-bold text-beach-orange">{games}</span>
        </div>
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-1.5 md:p-3 text-center border border-gray-100">
            <span className="block text-[8px] md:text-xs text-gray-400 uppercase font-bold tracking-wider">Sets</span>
            <span className="text-lg md:text-3xl font-bold text-gray-800">{sets}</span>
        </div>
      </div>
    </div>
  );
};