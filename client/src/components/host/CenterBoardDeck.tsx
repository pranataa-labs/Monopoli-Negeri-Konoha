import React from "react";
import { TileData, TileState, PlayerClient, EventCardData } from "../../types/game";
import { Sparkles, Shield } from "lucide-react";
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
    <div className="h-full w-full relative overflow-hidden select-none flex flex-col justify-between p-4 sm:p-6 neo-center-board">
      {/* 1. Center Comic Brand Plaque */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="transform -rotate-[14deg] flex flex-col items-center">
          <div className="px-8 py-4 bg-white border-[3px] border-[#1E293B] rounded-[10px] shadow-[6px_6px_0px_#1E293B] flex flex-col items-center">
            <div className="flex items-center gap-2 text-[#FF6B6B] text-[10px] sm:text-[11px] font-primary font-black tracking-[0.25em] uppercase">
              <span>★</span>
              <span>EDISI RESMI</span>
              <span>★</span>
            </div>
            <span className="text-2xl sm:text-4xl font-primary font-extrabold tracking-tight text-[#0F172A] leading-tight">
              MONOPOLI
            </span>
            <div className="mt-1 px-3 py-0.5 bg-[#FF6B6B] rounded-[6px] border-2 border-[#1E293B] text-white font-primary font-black text-[10px] sm:text-[12px] uppercase tracking-wider shadow-[2px_2px_0px_#1E293B]">
              NEGERI KONOHA
            </div>
            <span className="font-number text-[9px] text-[#475569] font-bold uppercase tracking-widest mt-1.5">
              VIBRANT NEO-BRUTALIST POP
            </span>
          </div>
        </div>
      </div>

      {/* 2. Decks (Top-Left & Bottom-Right) */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between pointer-events-auto">
        {/* UPPER-LEFT: KARTU DANA UMUM / KEBIJAKAN (#8B5CF6 Electric Purple & #EDE9FE Tint) */}
        <div className="flex justify-start">
          <div className="w-40 sm:w-48 h-26 sm:h-30 rounded-[8px] bg-[#EDE9FE] border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] p-2.5 flex flex-col justify-between cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1E293B] transition-all">
            <div className="flex items-center justify-between border-b-[2px] border-[#1E293B] pb-1">
              <span className="font-primary text-[9px] sm:text-[10px] font-black uppercase text-[#8B5CF6] tracking-wider flex items-center gap-1">
                <Shield size={12} className="text-[#8B5CF6]" /> DANA UMUM
              </span>
              <span className="w-5 h-5 rounded-[4px] bg-[#8B5CF6] border-[1.5px] border-[#1E293B] flex items-center justify-center font-primary text-[10px] font-black text-white shadow-[1px_1px_0px_#1E293B]">
                §
              </span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center">
              <span className="font-primary text-xl font-black text-[#8B5CF6]">
                KEBIJAKAN
              </span>
              <span className="font-property text-[8.5px] font-bold text-[#475569] uppercase tracking-wider">
                DEWAN PUSAT
              </span>
            </div>

            <div className="w-full flex justify-center">
              <span className="text-[7.5px] font-number font-black text-[#0F172A] bg-white px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]">
                AMBIL KARTU
              </span>
            </div>
          </div>
        </div>

        {/* LOWER-RIGHT: KARTU KESEMPATAN / EVENT (#F59E0B Amber Gold & #FEF3C7 Tint) */}
        <div className="flex justify-end">
          <div className="w-40 sm:w-48 h-26 sm:h-30 rounded-[8px] bg-[#FEF3C7] border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] p-2.5 flex flex-col justify-between cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1E293B] transition-all">
            <div className="flex items-center justify-between border-b-[2px] border-[#1E293B] pb-1">
              <span className="font-primary text-[9px] sm:text-[10px] font-black uppercase text-[#D97706] tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="text-[#D97706]" /> KESEMPATAN
              </span>
              <span className="w-5 h-5 rounded-[4px] bg-[#F59E0B] border-[1.5px] border-[#1E293B] flex items-center justify-center font-primary text-[10px] font-black text-white shadow-[1px_1px_0px_#1E293B]">
                ?
              </span>
            </div>

            <div className="flex flex-col items-center justify-center my-auto text-center">
              <span className="font-primary text-xl font-black text-[#D97706]">
                EVENT SPESIAL
              </span>
              <span className="font-property text-[8.5px] font-bold text-[#475569] uppercase tracking-wider">
                LUCKY SPIN & KASUS
              </span>
            </div>

            <div className="w-full flex justify-center">
              <span className="text-[7.5px] font-number font-black text-[#0F172A] bg-white px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]">
                PUTAR RODA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Drawn Event Card Overlay */}
      {activeCard && (
        <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-xs z-30 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[12px] border-[2.5px] border-[#1E293B] shadow-[6px_6px_0px_#1E293B] p-5 text-center space-y-3">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] border-[2px] border-[#1E293B] font-primary text-[10px] uppercase font-black shadow-[2px_2px_0px_#1E293B] ${
                activeCard.deck === "GOVERNMENT"
                  ? "bg-[#EDE9FE] text-[#8B5CF6]"
                  : "bg-[#FEF3C7] text-[#D97706]"
              }`}
            >
              {activeCard.deck === "GOVERNMENT" ? "KARTU DANA UMUM" : "KARTU KESEMPATAN"}
            </div>
            <h3 className="text-lg font-primary font-black text-[#0F172A] uppercase leading-tight">
              {activeCard.title}
            </h3>
            <p className="font-property text-xs text-[#475569] leading-relaxed px-2 font-medium">
              {activeCard.text}
            </p>
            {activeCard.amount > 0 && (
              <div className="py-1 px-3 bg-[#D1FAE5] rounded-[6px] border-[2px] border-[#1E293B] font-number text-xs text-[#10B981] font-black inline-block shadow-[2px_2px_0px_#1E293B]">
                Nominal: +{formatShortRupiah(activeCard.amount)}
              </div>
            )}
            {activeCard.amount < 0 && (
              <div className="py-1 px-3 bg-[#FEE2E2] rounded-[6px] border-[2px] border-[#1E293B] font-number text-xs text-[#F43F5E] font-black inline-block shadow-[2px_2px_0px_#1E293B]">
                Denda: {formatShortRupiah(activeCard.amount)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Hover Title Deed Preview */}
      {hoveredTile && hoveredTile.price > 0 && !activeCard && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
          <div className="w-full max-w-xs bg-white rounded-[8px] border-[2.5px] border-[#1E293B] shadow-[6px_6px_0px_#1E293B] overflow-hidden">
            <div
              className="py-2.5 px-3 text-center font-primary text-xs uppercase tracking-wider text-[#0F172A] font-black flex items-center justify-between border-b-[2.5px] border-[#1E293B]"
              style={{ backgroundColor: hoveredTile.colorGroup }}
            >
              <span>SERTIFIKAT WILAYAH</span>
              <span className="font-number text-[9px] bg-white text-[#0F172A] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] font-black shadow-[1.5px_1.5px_0px_#1E293B]">
                #{hoveredTile.index}
              </span>
            </div>

            <div className="p-3.5 space-y-2.5 bg-white">
              <div className="text-center">
                <h4 className="font-primary text-sm font-black text-[#0F172A] uppercase">{hoveredTile.name}</h4>
                <p className="text-[10.5px] text-[#475569] mt-0.5 font-property font-medium">{hoveredTile.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-2.5 rounded-[6px] border-[2px] border-[#1E293B] font-number">
                <div>
                  <span className="text-[#475569] block text-[8px] font-property font-bold">Harga Beli:</span>
                  <strong className="text-[#0F172A] text-xs font-black">
                    {formatShortRupiah(hoveredTile.price)}
                  </strong>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] font-property font-bold">Sewa Dasar:</span>
                  <strong className="text-[#10B981] text-xs font-black">
                    {formatShortRupiah(hoveredTile.rent)}
                  </strong>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] font-property font-bold">Biaya Tingkat:</span>
                  <span className="text-[#0F172A] text-xs font-black">
                    {formatShortRupiah(hoveredTile.upgradeCost || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[#475569] block text-[8px] font-property font-bold">Pemilik:</span>
                  {hoveredOwner ? (
                    <span className="text-[#FF6B6B] font-black text-xs">{hoveredOwner.name}</span>
                  ) : (
                    <span className="text-[#10B981] font-black text-xs">Tersedia</span>
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
