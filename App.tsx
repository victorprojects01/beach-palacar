
import React, { useState } from 'react';
import { useBeachTennisGame } from './hooks/useBeachTennisGame';
import { RotateCcw, Undo2, Trophy, ArrowLeftRight, Zap } from 'lucide-react';

const App: React.FC = () => {
  const { gameState, addPoint, undo, resetMatch } = useBeachTennisGame();
  const [p1Name, setP1Name] = useState("DUPLA A");
  const [p2Name, setP2Name] = useState("DUPLA B");

  const totalGames = gameState.p1Games + gameState.p2Games;
  const isChangeEnds = totalGames % 2 !== 0 && !gameState.isTieBreak && gameState.p1Score === '0' && gameState.p2Score === '0' && totalGames > 0;
  const isDecidingPoint = gameState.p1Score === '40' && gameState.p2Score === '40' && !gameState.isTieBreak;

  return (
    <div className="h-screen w-full bg-beach-dark flex flex-col font-sans overflow-hidden select-none">
      
      {/* 1. PLACAR SUPERIOR (Resumo) */}
      <div className="bg-gray-900 text-white p-4 shadow-2xl border-b border-gray-800">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {/* Sets */}
          <div className="text-center">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sets</span>
            <div className="text-3xl font-black flex gap-3">
              <span className="text-beach-yellow">{gameState.p1Sets}</span>
              <span className="text-gray-700">|</span>
              <span className="text-beach-orange">{gameState.p2Sets}</span>
            </div>
          </div>

          {/* Logo/Status */}
          <div className="flex flex-col items-center">
            <div className="bg-beach-yellow/10 px-3 py-1 rounded-full border border-beach-yellow/20 mb-1">
              <span className="text-beach-yellow text-[10px] font-black tracking-tighter">BEACH PLACAR • CBT</span>
            </div>
            {gameState.isTieBreak && (
              <span className="text-red-500 text-[10px] font-bold animate-pulse">TIE-BREAK</span>
            )}
          </div>

          {/* Games */}
          <div className="text-center">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Games</span>
            <div className="text-3xl font-black flex gap-3">
              <span className="text-beach-yellow">{gameState.p1Games}</span>
              <span className="text-gray-700">|</span>
              <span className="text-beach-orange">{gameState.p2Games}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PLACAR PRINCIPAL (Visualização Rápida) */}
      <div className="bg-black/40 flex h-32 md:h-48 border-b border-gray-800">
        <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-800 relative">
          {gameState.currentServer === 'p1' && !gameState.winner && (
            <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
          )}
          <input 
            value={p1Name} 
            onChange={(e) => setP1Name(e.target.value.toUpperCase())}
            className="bg-transparent text-center text-xs font-bold text-gray-500 uppercase w-full outline-none mb-1"
          />
          <div className="text-7xl md:text-9xl font-black text-beach-yellow">{gameState.p1Score}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {gameState.currentServer === 'p2' && !gameState.winner && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
          )}
          <input 
            value={p2Name} 
            onChange={(e) => setP2Name(e.target.value.toUpperCase())}
            className="bg-transparent text-center text-xs font-bold text-gray-500 uppercase w-full outline-none mb-1"
          />
          <div className="text-7xl md:text-9xl font-black text-beach-orange">{gameState.p2Score}</div>
        </div>
      </div>

      {/* 3. ALERTAS DE QUADRA */}
      <div className="h-12 flex items-center justify-center bg-gray-900/50">
        {isDecidingPoint && (
          <div className="flex items-center gap-2 text-red-500 font-black text-sm animate-bounce">
            <Zap size={16} fill="currentColor" /> PONTO DECISIVO
          </div>
        )}
        {isChangeEnds && (
          <div className="flex items-center gap-2 text-beach-yellow font-black text-sm animate-pulse">
            <ArrowLeftRight size={16} /> TROCA DE LADO
          </div>
        )}
      </div>

      {/* 4. ÁREA DE TOQUE GIGANTE */}
      <div className="flex-1 flex relative">
        {/* Overlay de Vitória */}
        {gameState.winner && (
          <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
            <div className="bg-yellow-500/20 p-8 rounded-full mb-6">
              <Trophy className="w-24 h-24 text-yellow-500 animate-bounce" />
            </div>
            <h2 className="text-5xl font-black text-white mb-2 italic">VITÓRIA!</h2>
            <p className="text-2xl text-yellow-500 font-bold mb-10 uppercase tracking-widest">
              {gameState.winner === 'p1' ? p1Name : p2Name}
            </p>
            <button 
              onClick={resetMatch} 
              className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              NOVA PARTIDA
            </button>
          </div>
        )}

        {/* Botão P1 */}
        <button 
          onClick={() => addPoint('p1')}
          className="flex-1 bg-beach-yellow active:brightness-75 transition-all flex flex-col items-center justify-center gap-4 border-r border-black/20"
        >
          <span className="text-black/30 font-black text-xs uppercase tracking-[0.2em]">Toque para pontuar</span>
          <span className="text-black text-3xl font-black uppercase tracking-tighter px-4 text-center">{p1Name}</span>
        </button>

        {/* Botão P2 */}
        <button 
          onClick={() => addPoint('p2')}
          className="flex-1 bg-beach-orange active:brightness-75 transition-all flex flex-col items-center justify-center gap-4"
        >
          <span className="text-white/30 font-black text-xs uppercase tracking-[0.2em]">Toque para pontuar</span>
          <span className="text-white text-3xl font-black uppercase tracking-tighter px-4 text-center">{p2Name}</span>
        </button>
      </div>

      {/* 5. CONTROLES DE RODAPÉ */}
      <div className="bg-black p-4 flex gap-4 border-t border-gray-800">
        <button 
          onClick={undo}
          className="flex-1 bg-gray-800 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Undo2 size={24} /> DESFAZER
        </button>
        <button 
          onClick={() => { if(confirm("Zerar partida?")) resetMatch(); }}
          className="w-20 bg-red-950/30 text-red-500 rounded-2xl flex items-center justify-center active:scale-95 transition-transform border border-red-500/20"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
