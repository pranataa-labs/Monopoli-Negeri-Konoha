import React from "react";
import { TileData, TileState, PlayerClient, EventCardData } from "../../types/game";
import { Crown, Sparkles } from "lucide-react";
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
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#D4AF37]/6 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#F5D76E]/6 blur-3xl pointer-events-none rounded-full" />

      {/* ========================================================= */}
      {/* 1. CENTRAL DIAGONAL 3D MONOPOLY PLAQUE (Matching Reference) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="transform -rotate-[35deg] flex flex-col items-center plaque-gold-shadow">
          {/* Refined Gold Crown */}
          <div className="flex items-center justify-center mb-1 drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)]">
            <Crown size={26} className="text-[#F5D76E] fill-[#D4AF37]/30" />
          </div>

          {/* Double Gold-Bordered Black Plaque */}
          <div className="px-6 py-2.5 bg-[#0B0B0D] border-2 border-[#D4AF37] ring-1 ring-[#F5D76E]/50 shadow-2xl rounded-md flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-primary tracking-widest text-[#F2F2F2] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              MONOPOLY
            </span>
            <div className="mt-0.5 px-3 py-0.5 bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] rounded text-[#0B0B0D] font-property font-bold text-[8.5px] uppercase tracking-widest shadow-sm">
              INDONESIA
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
          <div className="w-36 sm:w-42 h-22 sm:h-26 rounded-xl bg-[#0B0B0D]/95 border border-[#D4AF37]/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),0_4px_15px_rgba(0,0,0,0.6)] p-2.5 flex flex-col justify-between relative group hover:border-[#F5D76E] transition-all cursor-pointer">
            {/* Stacked Cards Underlay Visual Effect */}
            <div className="absolute -top-1 -right-1 w-full h-full rounded-xl border border-[#D4AF37]/20 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-1">
              <span className="font-property text-[8px] font-bold uppercase text-[#F5D76E] tracking-wider">
                TANDA TANYA
              </span>
              <span className="font-primary text-[10px] text-[#F5D76E]">?</span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center py-1">
              {/* Recessed Card Insert Slot Line */}
              <div className="w-20 sm:w-24 h-1.5 bg-[#0B0B0D] rounded-full shadow-inner border border-[#D4AF37]/30 mb-1" />
              <div className="flex items-center gap-1.5 text-[#F5D76E]">
                <span className="font-primary text-base text-[#F5D76E] drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]">?</span>
                <span className="font-property text-[8px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  CHANCE
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-8 h-0.5 bg-[#D4AF37]/25 rounded-full" />
            </div>
          </div>
        </div>

        {/* LOWER-RIGHT: KARTU LUCKY SPIN */}
        <div className="flex justify-end">
          <div className="w-36 sm:w-42 h-22 sm:h-26 rounded-xl bg-[#0B0B0D]/95 border border-[#D4AF37]/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.95),0_4px_15px_rgba(0,0,0,0.6)] p-2.5 flex flex-col justify-between relative group hover:border-[#F5D76E] transition-all cursor-pointer">
            {/* Stacked Cards Underlay Visual Effect */}
            <div className="absolute -bottom-1 -left-1 w-full h-full rounded-xl border border-[#D4AF37]/20 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-1">
              <span className="font-property text-[8px] font-bold uppercase text-[#F5D76E] tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-[#F5D76E]" /> LUCKY SPIN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5D76E]/80" />
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center py-1">
              {/* Recessed Card Insert Slot Line */}
              <div className="w-20 sm:w-24 h-1.5 bg-[#0B0B0D] rounded-full shadow-inner border border-[#D4AF37]/30 mb-1" />
              <div className="flex items-center gap-1 text-[#F5D76E]">
                <Crown size={12} className="text-[#F5D76E]" />
                <span className="font-property text-[8px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  DANA TAKTIS
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-8 h-0.5 bg-[#D4AF37]/25 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ACTIVE DRAWN EVENT CARD OVERLAY */}
      {/* ========================================================= */}
      {activeCard && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-scale-up">
          <div className="w-full max-w-sm bg-[#0B0B0D] border-2 border-[#D4AF37] rounded-2xl shadow-2xl p-5 text-center space-y-3 ring-2 ring-[#F5D76E]/40">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40 font-property text-[9px] uppercase font-bold">
              {activeCard.deck === "GOVERNMENT" ? "KARTU TANDA TANYA (?)" : "KARTU LUCKY SPIN"}
            </div>
            <h3 className="text-base font-primary text-[#F2F2F2] uppercase leading-tight">
              {activeCard.title}
            </h3>
            <p className="font-sans text-xs text-slate-300 leading-relaxed px-2">
              {activeCard.text}
            </p>
            {activeCard.amount > 0 && (
              <div className="py-1 px-3 bg-[#1C1C1F] rounded-lg border border-[#D4AF37]/40 font-number text-xs text-[#F5D76E] font-extrabold inline-block">
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
          <div className="w-full max-w-xs bg-[#0B0B0D] border-2 border-[#D4AF37] rounded-xl shadow-2xl overflow-hidden ring-2 ring-[#F5D76E]/40">
            <div
              className="py-2 px-3 text-center font-primary text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-between"
              style={{ backgroundColor: hoveredTile.colorGroup }}
            >
              <span>SERTIFIKAT HAK MILIK</span>
              <span className="font-number text-[8px] bg-black/60 px-1.5 py-0.5 rounded font-extrabold">
                PETAK #{hoveredTile.index}
              </span>
            </div>

            <div className="p-3 space-y-2">
              <div className="text-center">
                <h4 className="font-property text-sm font-bold text-[#F2F2F2] uppercase">{hoveredTile.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-sans">{hoveredTile.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs bg-[#1C1C1F] p-2 rounded-lg border border-slate-800 font-number">
                <div>
                  <span className="text-slate-400 block text-[8px] font-sans">Harga Beli:</span>
                  <strong className="text-[#F5D76E] text-xs font-extrabold">
                    {formatShortRupiah(hoveredTile.price)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] font-sans">Sewa Dasar:</span>
                  <strong className="text-emerald-400 text-xs font-extrabold">
                    {formatShortRupiah(hoveredTile.rent)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] font-sans">Biaya Ruko:</span>
                  <span className="text-slate-300 text-xs font-extrabold">
                    {formatShortRupiah(hoveredTile.upgradeCost || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px] font-sans">Status:</span>
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