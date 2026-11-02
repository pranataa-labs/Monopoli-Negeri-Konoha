import React from "react";
import { TileData, TileState, PlayerClient, EventCardData } from "../../types/game";
import { Crown, Sparkles, FileText } from "lucide-react";
import { formatShortRupiah } from "./formatters";

interface CenterBoardDeckProps {
  activeCard?: EventCardData | null;
  hoveredTile: TileData | null;
  tilesState?: Record<string, TileState>;
  players?: PlayerClient[];
}

export const CenterBoardDeck: React.FC<CenterBoardDeckProps> = ({
  activeCard,
  hoveredTile,
  tilesState = {},
  players = [],
}) => {
  const hoveredTileState = hoveredTile ? tilesState[hoveredTile.id] : null;
  const hoveredOwner = hoveredTileState?.ownerId
    ? players.find((p) => p.id === hoveredTileState.ownerId)
    : null;

  return (
    <div className="h-full w-full leather-embossed rounded-xl relative overflow-hidden select-none flex flex-col justify-between p-4 sm:p-6 beveled-tray">
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/8 blur-3xl pointer-events-none rounded-full" />

      {/* ========================================================= */}
      {/* 1. CENTRAL DIAGONAL 3D MONOPOLY PLAQUE (Matching Reference) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="transform -rotate-[35deg] flex flex-col items-center plaque-gold-shadow">
          {/* Refined Gold Crown */}
          <div className="flex items-center justify-center mb-1 drop-shadow-[0_2px_6px_rgba(234,179,8,0.5)]">
            <Crown size={24} className="text-amber-400 fill-amber-400/20" />
          </div>

          {/* Double Gold-Bordered Black Plaque */}
          <div className="px-6 py-2 bg-[#09090d] border border-amber-400/90 ring-1 ring-amber-500/40 shadow-2xl rounded-md flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-widest text-white uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              MONOPOLI
            </span>
            <div className="mt-0.5 px-2.5 py-0.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded text-slate-950 font-bold text-[8px] uppercase tracking-widest">
              NEGERI KONOHA
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. RECESSED CARD SLOTS IN THE LEATHER (Top-Left & Bottom-Right) */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {/* UPPER-LEFT: KARTU TANDA TANYA (?) */}
        <div className="flex justify-start">
          <div className="w-36 sm:w-40 h-22 sm:h-26 rounded-xl bg-[#09090d]/90 border border-amber-400/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),0_4px_15px_rgba(0,0,0,0.5)] p-2.5 flex flex-col justify-between relative group hover:border-amber-300 transition-all cursor-pointer">
            {/* Stacked Cards Underlay Visual Effect */}
            <div className="absolute -top-1 -right-1 w-full h-full rounded-xl border border-amber-500/20 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-amber-400/20 pb-1">
              <span className="text-[7.5px] font-bold uppercase text-amber-300 font-display tracking-wider flex items-center gap-1">
                <FileText size={11} className="text-amber-400" /> TANDA TANYA
              </span>
              <span className="text-[9px] font-black text-amber-300 font-mono">?</span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center py-1">
              {/* Recessed Card Insert Slot Line */}
              <div className="w-20 sm:w-24 h-1.5 bg-black rounded-full shadow-inner border border-amber-500/25 mb-1.5" />
              <div className="flex items-center gap-1.5 text-amber-300">
                <span className="text-sm font-black text-amber-300">?</span>
                <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider">
                  CHANCE
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-8 h-0.5 bg-amber-500/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* LOWER-RIGHT: KARTU LUCKY SPIN */}
        <div className="flex justify-end">
          <div className="w-36 sm:w-40 h-22 sm:h-26 rounded-xl bg-[#09090d]/90 border border-amber-400/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),0_4px_15px_rgba(0,0,0,0.5)] p-2.5 flex flex-col justify-between relative group hover:border-amber-300 transition-all cursor-pointer">
            {/* Stacked Cards Underlay Visual Effect */}
            <div className="absolute -bottom-1 -left-1 w-full h-full rounded-xl border border-amber-500/20 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-amber-400/20 pb-1">
              <span className="text-[7.5px] font-bold uppercase text-amber-300 font-display tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" /> LUCKY SPIN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" />
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center py-1">
              {/* Recessed Card Insert Slot Line */}
              <div className="w-20 sm:w-24 h-1.5 bg-black rounded-full shadow-inner border border-amber-500/25 mb-1.5" />
              <div className="flex items-center gap-1 text-amber-300">
                <Crown size={12} />
                <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider">
                  DANA TAKTIS
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-8 h-0.5 bg-amber-500/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ACTIVE DRAWN EVENT CARD OVERLAY */}
      {/* ========================================================= */}
      {activeCard && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-scale-up">
          <div className="w-full max-w-sm bg-[#0a0a0e] border-2 border-amber-400 rounded-2xl shadow-2xl p-4 text-center space-y-3 ring-2 ring-amber-500/40">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono uppercase font-black">
              {activeCard.deck === "GOVERNMENT" ? "KARTU TANDA TANYA (?)" : "KARTU LUCKY SPIN"}
            </div>
            <h3 className="text-base font-black text-white uppercase font-display leading-tight">
              {activeCard.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans px-2">
              {activeCard.text}
            </p>
            {activeCard.amount > 0 && (
              <div className="py-1 px-3 bg-black/60 rounded-lg border border-amber-500/30 font-mono text-xs text-amber-300 font-bold inline-block">
                Nominal: {formatShortRupiah(activeCard.amount)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. HOVER TITLE DEED PREVIEW (Smooth floating preview) */}
      {/* ========================================================= */}
      {hoveredTile && hoveredTile.price > 0 && !activeCard && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none animate-scale-up">
          <div className="w-full max-w-xs bg-[#0b0b0f] border-2 border-amber-400/90 rounded-xl shadow-2xl overflow-hidden ring-2 ring-amber-500/40">
            <div
              className="py-2 px-3 text-center font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-between"
              style={{ backgroundColor: hoveredTile.colorGroup }}
            >
              <span>SERTIFIKAT HAK MILIK</span>
              <span className="text-[8px] font-mono bg-black/60 px-1.5 py-0.5 rounded font-bold">
                PETAK #{hoveredTile.index}
              </span>
            </div>

            <div className="p-3 space-y-2">
              <div className="text-center">
                <h4 className="text-sm font-black text-white">{hoveredTile.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{hoveredTile.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500 block text-[8px]">Harga Beli:</span>
                  <strong className="text-amber-300 text-xs">
                    {formatShortRupiah(hoveredTile.price)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px]">Sewa Dasar:</span>
                  <strong className="text-emerald-400 text-xs">
                    {formatShortRupiah(hoveredTile.rent)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px]">Biaya Ruko:</span>
                  <span className="text-slate-300 text-xs">
                    {formatShortRupiah(hoveredTile.upgradeCost || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px]">Status:</span>
                  {hoveredOwner ? (
                    <span className="text-sky-400 font-bold text-xs">{hoveredOwner.name}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold text-xs">Tersedia</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
