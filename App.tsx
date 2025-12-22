
import React, { useState, useEffect } from 'react';
import { useBeachTennisGame } from './hooks/useBeachTennisGame';
import { RotateCcw, Undo2, Trophy, ArrowLeftRight, Zap, Settings2, X, ChevronRight, Activity } from 'lucide-react';

const App: React.FC = () => {
  const { gameState, addPoint, undo, resetMatch } = useBeachTennisGame();
  const [p1Name, setP1Name] = useState("DUPLA A");
  const [p2Name, setP2Name] = useState("DUPLA B");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showChangeSidesAlert, setShowChangeSidesAlert] = useState(false);

  const totalGames = gameState.p1Games + gameState.p2Games;
  const isChangeEnds = totalGames % 2 !== 0 && !gameState.isTieBreak && gameState.p1Score === '0' && gameState.p2Score === '0' && totalGames > 0;
  const isDecidingPoint = gameState.p1Score === '40' && gameState.p2Score === '40' && !gameState.isTieBreak;

  useEffect(() => {
    if (isChangeEnds) {
      setShowChangeSidesAlert(true);
      const timer = setTimeout(() => setShowChangeSidesAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isChangeEnds]);

  return (
    <div className="h-screen w-full bg-beach-navy flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* HEADER COMPACTO */}
      <header className="safe-top bg-black/40 backdrop-blur-xl border-b border-white/5 px-5 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-beach-yellow rounded-lg flex items-center justify-center shadow-lg shadow-beach-yellow/10">
            <Trophy size={16} className="text-beach-navy" />
          </div>
          <div>
            <h1 className="text-[10px] font-black tracking-widest text-white/50 uppercase">Beach Placar <span className="text-beach-yellow">Pro</span></h1>
            <div className="flex items-center gap-1">
              <Activity size={8} className="text-beach-accent" />
              <span className="text-[9px] font-bold text-beach-accent/80 uppercase">Match in Progress</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {gameState.setResults.map((res, i) => (
            <div key={i} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] font-black flex gap-1">
              <span className="text-beach-yellow">{res.p1}</span>
              <span className="text-white/20">|</span>
              <span className="text-beach-orange">{res.p2}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ÁREAS DE TOQUE PRINCIPAIS */}
      <main className="flex-1 flex relative">
        <div 
          onClick={() => addPoint('p1')}
          className={`flex-1 flex flex-col items-center justify-center relative tap-feedback transition-colors duration-300 ${gameState.currentServer === 'p1' ? 'bg-beach-accent/5' : ''}`}
        >
          {gameState.currentServer === 'p1' && !gameState.winner && (
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-beach-accent rounded-r-full shadow-[0_0_15px_#22C55E]" />
          )}

          <div className="text-center z-10">
            <span className="text-[10px] font-black text-beach-yellow/40 uppercase tracking-[0.2em] mb-4 block">Pontos</span>
            <div className="text-[32vw] font-display font-black leading-none text-beach-yellow score-number drop-shadow-2xl">
              {gameState.p1Score}
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-beach-yellow/10 border border-beach-yellow/20 max-w-[40vw] truncate">
                <span className="text-xs font-black text-beach-yellow uppercase tracking-tight">{p1Name}</span>
              </div>
              <div className="flex justify-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-500 uppercase">Sets</span>
                  <span className="text-xl font-display font-black text-white">{gameState.p1Sets}</span>
                </div>
                <div className="w-px h-6 bg-white/10 self-end" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-500 uppercase">Games</span>
                  <span className="text-xl font-display font-black text-white/60">{gameState.p1Games}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-px bg-white/5 relative">
          {isDecidingPoint && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-black text-[9px] whitespace-nowrap shadow-2xl border border-white/20 animate-pulse flex items-center gap-1">
                <Zap size={10} fill="currentColor" /> NO-AD
              </div>
            </div>
          )}
        </div>

        <div 
          onClick={() => addPoint('p2')}
          className={`flex-1 flex flex-col items-center justify-center relative tap-feedback transition-colors duration-300 ${gameState.currentServer === 'p2' ? 'bg-beach-accent/5' : ''}`}
        >
          {gameState.currentServer === 'p2' && !gameState.winner && (
            <div className="absolute right-0 top-1/4 bottom-1/4 w-1.5 bg-beach-accent rounded-l-full shadow-[0_0_15px_#22C55E]" />
          )}

          <div className="text-center z-10">
            <span className="text-[10px] font-black text-beach-orange/40 uppercase tracking-[0.2em] mb-4 block">Pontos</span>
            <div className="text-[32vw] font-display font-black leading-none text-beach-orange score-number drop-shadow-2xl">
              {gameState.p2Score}
            </div>

            <div className="mt-8 space-y-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-beach-orange/10 border border-beach-orange/20 max-w-[40vw] truncate">
                <span className="text-xs font-black text-beach-orange uppercase tracking-tight">{p2Name}</span>
              </div>
              <div className="flex justify-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-500 uppercase">Sets</span>
                  <span className="text-xl font-display font-black text-white">{gameState.p2Sets}</span>
                </div>
                <div className="w-px h-6 bg-white/10 self-end" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-gray-500 uppercase">Games</span>
                  <span className="text-xl font-display font-black text-white/60">{gameState.p2Games}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="h-28 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-6 pb-6">
        <div className="flex gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); undo(); }}
            disabled={gameState.history.length === 0}
            className="h-14 px-6 bg-white/5 disabled:opacity-10 rounded-2xl border border-white/10 flex items-center gap-3 active:scale-90 transition-all"
          >
            <Undo2 size={22} className="text-beach-yellow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Voltar</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); if(confirm("Zerar partida?")) resetMatch(); }}
            className="h-14 w-14 bg-red-900/20 rounded-2xl border border-red-500/10 flex items-center justify-center active:scale-90 transition-all"
          >
            <RotateCcw size={22} className="text-red-500" />
          </button>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsConfigOpen(true); }}
          className="h-14 w-14 bg-beach-yellow text-beach-navy rounded-2xl flex items-center justify-center shadow-lg shadow-beach-yellow/20 active:scale-90 transition-all"
        >
          <Settings2 size={24} />
        </button>
      </footer>

      {/* OVERLAY DE TROCA DE LADO REVISADO (ALTO CONTRASTE) */}
      {showChangeSidesAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          {/* Lâminas de Fundo com Gradiente */}
          <div className="absolute inset-0 flex">
            <div className="h-full w-2/3 bg-gradient-to-br from-beach-yellow to-yellow-600 animate-slide-left -ml-10 shadow-[20px_0_50px_rgba(0,0,0,0.3)]" />
            <div className="h-full w-2/3 bg-gradient-to-bl from-beach-orange to-orange-700 animate-slide-right -mr-10 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]" />
          </div>

          {/* Faixa Central de Contraste (Black Glass) */}
          <div className="absolute left-0 right-0 h-48 bg-black/40 backdrop-blur-md z-10 animate-bar-reveal" />

          {/* Conteúdo Central */}
          <div className="relative z-20 text-center flex flex-col items-center">
            {/* Ícone com Container de Alto Contraste */}
            <div className="bg-beach-navy p-7 rounded-[2.5rem] shadow-2xl border-4 border-white animate-swap-icon">
              <ArrowLeftRight size={64} className="text-white" />
            </div>
            
            <div className="mt-6 animate-text-pop">
              <h2 className="text-6xl font-black text-white leading-none mb-3 text-shadow-glow uppercase italic">
                Troca de <span className="text-beach-yellow">Lado</span>
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-white/30" />
                <span className="text-white font-black uppercase tracking-[0.3em] text-sm">Game Finalizado: {totalGames}</span>
                <div className="h-px w-8 bg-white/30" />
              </div>
            </div>

            {/* Barra de Progresso Visível */}
            <div className="absolute bottom-[-140px] left-1/2 -translate-x-1/2 w-64 h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-white animate-timer shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>

          {/* Vinheta de Escurecimento Lateral */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        </div>
      )}

      {/* MODAL DE CONFIGURAÇÃO */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-beach-slate rounded-t-[3rem] border-t border-white/10 p-8 pb-12 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black tracking-tight">Equipes</h3>
              <button onClick={() => setIsConfigOpen(false)} className="p-3 bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-beach-yellow uppercase tracking-widest">Nome Equipe A</label>
                <input 
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black text-white focus:border-beach-yellow focus:outline-none"
                  placeholder="EQUIPE A"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-beach-orange uppercase tracking-widest">Nome Equipe B</label>
                <input 
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-xl font-black text-white focus:border-beach-orange focus:outline-none"
                  placeholder="EQUIPE B"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsConfigOpen(false)}
              className="w-full mt-10 bg-beach-yellow text-beach-navy py-6 rounded-2xl font-black text-lg shadow-xl"
            >
              SALVAR E CONTINUAR
            </button>
          </div>
        </div>
      )}

      {/* OVERLAY DE VITÓRIA */}
      {gameState.winner && (
        <div className="fixed inset-0 bg-beach-navy z-[200] flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-beach-yellow/30 blur-3xl animate-pulse rounded-full" />
            <Trophy size={100} className="text-beach-yellow relative z-10" />
          </div>
          
          <h2 className="text-xs font-black text-beach-yellow uppercase tracking-[0.4em] mb-2">Match Point Final</h2>
          <h3 className="text-5xl font-display font-black text-center leading-none mb-10">
            {gameState.winner === 'p1' ? p1Name : p2Name} <br/> <span className="text-beach-accent">VENCEU!</span>
          </h3>

          <div className="flex gap-4 mb-16">
            {gameState.setResults.map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-center">
                <span className="text-[8px] font-black text-gray-500 block mb-1">SET {i+1}</span>
                <span className="text-2xl font-display font-black text-beach-yellow">{r.p1}</span>
                <span className="text-white/20 mx-2">-</span>
                <span className="text-2xl font-display font-black text-beach-orange">{r.p2}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={resetMatch} 
            className="w-full max-w-xs bg-white text-beach-navy py-6 rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all"
          >
            NOVA PARTIDA
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
