import React from "react";
import { GameSnapshot } from "../../types/game";
import { Landmark, Sparkles, Flame, Radio } from "lucide-react";
import { formatShortRupiah } from "./formatters";
import { PlayerToken } from "./PlayerToken";

interface LeftConsoleProps {
  snapshot: GameSnapshot | null;
}

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const dotPositions: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const activeDots = dotPositions[value] || [4];

  return (
    <div className="w-12 h-12 bg-gradient-to-br from-white via-slate-100 to-slate-200 rounded-xl shadow-lg border-2 border-amber-400/40 p-1.5 grid grid-cols-3 grid-rows-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && (
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
};

export const LeftConsole: React.FC<LeftConsoleProps> = ({ snapshot }) => {
  const activePlayer = snapshot?.players.find((p) => p.id === snapshot?.activePlayerId);

  return (
    <aside className="w-72 sm:w-80 flex flex-col gap-3.5 select-none shrink-0">
      {/* 1. BRANKAS KAS NEGARA (APBN POOL) */}
      <div className="bg-gradient-to-br from-amber-950/40 via-black/90 to-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Subtle Watermark Landmark Crest */}
        <Landmark size={120} className="absolute -right-4 -bottom-4 text-amber-500/5 pointer-events-none select-none" />

        <div className="flex items-center justify-between relative z-10 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
              <Landmark size={15} /> Brankas APBN
            </h3>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            KAS NEGARA
          </span>
        </div>

        {/* LED Cash Display */}
        <div className="py-2.5 px-3 bg-black/80 rounded-xl border border-amber-500/35 text-center shadow-inner relative overflow-hidden z-10 my-1">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-pulse" />
          <span className="text-3xl font-black font-mono text-amber-300 tracking-tight block drop-shadow-sm">
            {formatShortRupiah(snapshot?.kasNegaraPool || 1000000)}
          </span>
          <span className="text-[9.5px] font-mono text-amber-400/90 uppercase tracking-wider block mt-0.5 font-bold">
            Total Dana Stimulus
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 relative z-10 mt-1">
          <div className="flex items-center gap-1 text-slate-300">
            <Sparkles size={11} className="text-amber-400 shrink-0" />
            <span>Potongan 10% START & Pajak</span>
          </div>
          <span className="font-bold text-amber-300">
            Cair di Petak #20
          </span>
        </div>
      </div>

      {/* 2. ARENA LEMPARAN DADU & GILIRAN */}
      <div className="bg-gradient-to-br from-black/90 to-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-display">
            Arena Lemparan Dadu
          </span>
          {snapshot?.lastRollResult?.isDouble && (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
              <Flame size={12} /> DOUBLE!
            </span>
          )}
        </div>

        {/* Active 3D Dice Display */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="flex items-center justify-center gap-3">
            <DiceFace value={snapshot?.dice[0] || 1} />
            <DiceFace value={snapshot?.dice[1] || 1} />
          </div>

          {snapshot?.lastRollResult && (
            <span className="text-xs font-mono text-slate-300 mt-2">
              Hasil Lemparan: <strong className="text-amber-400 text-sm">{snapshot.lastRollResult.sum}</strong>
            </span>
          )}
        </div>

        {/* Current Turn Active Player */}
        {activePlayer ? (
          <div className="mt-2 w-full p-2.5 rounded-xl bg-black/80 border border-amber-500/30 flex items-center gap-2">
            <PlayerToken player={activePlayer} size="sm" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate leading-tight">{activePlayer.name}</p>
              <p className="text-[10px] text-amber-300/90 font-mono leading-none mt-0.5">
                {snapshot?.hasRolled ? "Menunggu selesai giliran" : "Giliran Melempar Dadu"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 text-center italic py-2">
            Menunggu permainan dimulai...
          </p>
        )}
      </div>

      {/* 3. LOG SIDANG PARIPURNA (LIVE ACTIVITY FEED) */}
      <div className="bg-black/80 border border-slate-800 rounded-2xl p-3.5 shadow-xl flex-1 flex flex-col justify-between min-h-[160px]">
        <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-1.5 mb-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[8.5px] font-black uppercase tracking-wider shrink-0 shadow-xs">
            <Radio size={10} />
            <span>SIDANG LIVE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Aktivitas Monopoli</span>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-44 pr-1 text-xs">
          {snapshot?.logs && snapshot.logs.length > 0 ? (
            snapshot.logs.slice(0, 6).map((log) => (
              <div key={log.id} className="text-[11px] text-slate-300 leading-snug flex items-start gap-1.5">
                <span className="text-[9px] font-mono text-slate-500 shrink-0 mt-0.5">[{log.time}]</span>
                <span className="line-clamp-2">{log.text}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic text-[11px]">Belum ada aktivitas tercatat.</p>
          )}
        </div>
      </div>
    </aside>
  );
};
