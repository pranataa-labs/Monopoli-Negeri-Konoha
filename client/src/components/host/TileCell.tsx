import React from "react";
import { TileData, TileState, PlayerClient } from "../../types/game";
import { PlayerToken } from "./PlayerToken";
import { formatShortRupiah } from "./formatters";
export { formatShortRupiah };

interface TileCellProps {
  tile: TileData;
  state?: TileState;
  owner?: PlayerClient;
  playersOnTile: PlayerClient[];
  isActiveTile?: boolean;
  onHover?: (tile: TileData | null) => void;
}

// 8 Kelompok Properti (Urut dari murah ke mahal sesuai spek)
export interface PropertyTierConfig {
  header: string;
  tint: string;
  tierName: string;
}

export const PROPERTY_TIERS: Record<number, PropertyTierConfig> = {
  // Tier 1 (Cokelat/Bata)
  1: { header: "#C87D55", tint: "#F9EBE4", tierName: "Tier 1" },
  3: { header: "#C87D55", tint: "#F9EBE4", tierName: "Tier 1" },

  // Tier 2 (Biru Muda)
  6: { header: "#38BDF8", tint: "#E0F2FE", tierName: "Tier 2" },
  8: { header: "#38BDF8", tint: "#E0F2FE", tierName: "Tier 2" },
  9: { header: "#38BDF8", tint: "#E0F2FE", tierName: "Tier 2" },

  // Tier 3 (Pink)
  11: { header: "#F472B6", tint: "#FCE7F3", tierName: "Tier 3" },
  13: { header: "#F472B6", tint: "#FCE7F3", tierName: "Tier 3" },
  14: { header: "#F472B6", tint: "#FCE7F3", tierName: "Tier 3" },

  // Tier 4 (Oranye)
  16: { header: "#FB923C", tint: "#FFEDD5", tierName: "Tier 4" },
  18: { header: "#FB923C", tint: "#FFEDD5", tierName: "Tier 4" },
  19: { header: "#FB923C", tint: "#FFEDD5", tierName: "Tier 4" },

  // Tier 5 (Merah)
  21: { header: "#F87171", tint: "#FEE2E2", tierName: "Tier 5" },
  23: { header: "#F87171", tint: "#FEE2E2", tierName: "Tier 5" },
  24: { header: "#F87171", tint: "#FEE2E2", tierName: "Tier 5" },

  // Tier 6 (Kuning)
  26: { header: "#FACC15", tint: "#FEF9C3", tierName: "Tier 6" },
  27: { header: "#FACC15", tint: "#FEF9C3", tierName: "Tier 6" },
  29: { header: "#FACC15", tint: "#FEF9C3", tierName: "Tier 6" },

  // Tier 7 (Hijau Mint)
  31: { header: "#34D399", tint: "#D1FAE5", tierName: "Tier 7" },
  32: { header: "#34D399", tint: "#D1FAE5", tierName: "Tier 7" },
  34: { header: "#34D399", tint: "#D1FAE5", tierName: "Tier 7" },

  // Tier 8 (Biru Indigo)
  37: { header: "#6366F1", tint: "#E0E7FF", tierName: "Tier 8" },
  39: { header: "#6366F1", tint: "#E0E7FF", tierName: "Tier 8" },
};

// Neo-Brutalist Pop Lucky Spin Icon (Electric Purple/Amber Roda)
const NeoLuckyWheel: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14" cy="14" r="11.5" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.5" />
    <path d="M14 2.5V25.5" stroke="#1E293B" strokeWidth="2" />
    <path d="M2.5 14H25.5" stroke="#1E293B" strokeWidth="2" />
    <path d="M5.8 5.8L22.2 22.2" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M22.2 5.8L5.8 22.2" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 2" />
    <circle cx="14" cy="14" r="4" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2" />
    <circle cx="14" cy="14" r="1.5" fill="#FFFFFF" />
  </svg>
);

// Neo-Brutalist Pop Locomotive
const NeoLocomotive: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="16" width="22" height="15" rx="3" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="26" y="10" width="15" height="21" rx="3" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.5" />
    <rect x="29" y="13" width="9" height="7" rx="1.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
    <rect x="10" y="8" width="6" height="8" rx="1.5" fill="#FF6B6B" stroke="#1E293B" strokeWidth="2" />
    <circle cx="13" cy="35" r="4.5" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="23" cy="35" r="4.5" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="34" cy="35" r="4.5" fill="#FACC15" stroke="#1E293B" strokeWidth="2.5" />
    <line x1="3" y1="42" x2="45" y2="42" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Neo-Brutalist Pop Tax Seal (Rose Red Indicator #F43F5E)
const NeoTaxSeal: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#FEE2E2" stroke="#1E293B" strokeWidth="2" />
    <circle cx="12" cy="12" r="5" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />
    <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">
      %
    </text>
  </svg>
);

// Neo-Brutalist Pop Utility Icon
const NeoUtilityIcon: React.FC<{ type: "electric" | "water"; size?: number }> = ({ type, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {type === "electric" ? (
      <path
        d="M13 2L4 13H12L11 22L20 11H12L13 2Z"
        fill="#FACC15"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M12 2.5C12 2.5 5 11.5 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11.5 12 2.5 12 2.5Z"
        fill="#38BDF8"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export const TileCell: React.FC<TileCellProps> = ({
  tile,
  state,
  owner,
  playersOnTile,
  isActiveTile = false,
  onHover,
}) => {
  const isCorner = [0, 10, 20, 30].includes(tile.index);
  const tierConfig = PROPERTY_TIERS[tile.index];

  // Orientasi sisi papan (11x11 Monopoly)
  let edge: "bottom" | "left" | "top" | "right" = "bottom";
  if (tile.index >= 1 && tile.index <= 9) {
    edge = "bottom";
  } else if (tile.index >= 11 && tile.index <= 19) {
    edge = "left";
  } else if (tile.index >= 21 && tile.index <= 29) {
    edge = "top";
  } else if (tile.index >= 31 && tile.index <= 39) {
    edge = "right";
  }

  // ==========================================
  // 1. RENDER 4 PETAK SUDUT (Neo-Brutalist Pop)
  // ==========================================
  if (isCorner) {
    return (
      <div
        onMouseEnter={() => onHover && onHover(tile)}
        onMouseLeave={() => onHover && onHover(null)}
        className={`relative w-full h-full p-2 sm:p-2.5 flex flex-col justify-between items-center text-center transition-all cursor-pointer select-none overflow-hidden rounded-[8px] border-[2.5px] border-[#1E293B] ${
          isActiveTile
            ? "fantasy-tile-active z-30"
            : "bg-[#FFFFFF] shadow-[3px_3px_0px_#1E293B] hover:shadow-[4.5px_4.5px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5"
        }`}
        style={{
          gridRowStart: tile.gridRow + 1,
          gridColumnStart: tile.gridCol + 1,
        }}
      >
        {/* CORNER 0: START (Indikator Uang Masuk #10B981 Emerald) */}
        {tile.index === 0 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1.5 rounded-[6px] bg-[#D1FAE5] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
            <span className="font-primary text-[8px] sm:text-[9.5px] font-black text-white uppercase leading-none bg-[#10B981] px-2 py-0.5 border-2 border-[#1E293B] rounded shadow-[1.5px_1.5px_0px_#1E293B]">
              CAIR GAJI 2JT
            </span>
            <div className="flex flex-col items-center justify-center my-auto">
              <span className="text-2xl sm:text-3xl font-display font-black text-[#0F172A] tracking-wider leading-none">
                START
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#10B981] font-black text-base">
                <span className="text-xl">➔</span>
              </div>
            </div>
            <span className="font-primary text-[8.5px] sm:text-[10px] text-[#065F46] uppercase tracking-wider font-extrabold leading-none">
              CAIR ANGGARAN
            </span>
          </div>
        )}

        {/* CORNER 10: PENJARA / RUTAN TIP-IKOR (#F43F5E Rose Red) */}
        {tile.index === 10 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1.5 rounded-[6px] bg-[#FEE2E2] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
            <span className="font-primary text-[8px] sm:text-[9px] font-black text-white uppercase tracking-wider leading-none bg-[#F43F5E] px-2 py-0.5 border-2 border-[#1E293B] rounded shadow-[1.5px_1.5px_0px_#1E293B]">
              TERPIDANA
            </span>
            <div className="my-auto w-9 h-9 sm:w-11 sm:h-11 rounded-[6px] bg-white border-2 border-[#1E293B] p-1 flex flex-col items-center justify-center shadow-[2px_2px_0px_#1E293B]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round">
                <rect x="2" y="2" width="20" height="20" rx="2" fill="#FEE2E2" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
              </svg>
              <span className="font-property text-[6.5px] font-black text-[#F43F5E] uppercase leading-none mt-0.5">
                RUTAN
              </span>
            </div>
            <span className="font-primary text-[8.5px] sm:text-[10px] font-black text-[#9F1239] uppercase tracking-wider leading-none">
              PENJARA
            </span>
          </div>
        )}

        {/* CORNER 20: PARKIR BEBAS / KAS APBN (#F59E0B Amber & #FEF3C7 Tint) */}
        {tile.index === 20 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1.5 rounded-[6px] bg-[#FEF3C7] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
            <span className="font-primary text-[8px] sm:text-[9px] font-black uppercase text-[#0F172A] tracking-wider leading-none bg-[#FACC15] px-2 py-0.5 border-2 border-[#1E293B] rounded shadow-[1.5px_1.5px_0px_#1E293B]">
              KAS APBN
            </span>
            <div className="my-auto flex flex-col items-center justify-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F59E0B] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0px_#1E293B]">
                <span className="font-display text-lg sm:text-xl font-black text-white leading-none">
                  P
                </span>
              </div>
            </div>
            <span className="font-primary text-[8.5px] sm:text-[10px] font-black text-[#92400E] leading-none uppercase tracking-wider">
              BEBAS BIAYA
            </span>
          </div>
        )}

        {/* CORNER 30: OTT KPK (#F43F5E Rose Red Indikator Denda) */}
        {tile.index === 30 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1.5 rounded-[6px] bg-[#FEE2E2] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
            <span className="font-primary text-[8px] sm:text-[9px] font-black uppercase text-white tracking-wider leading-none bg-[#F43F5E] px-2 py-0.5 border-2 border-[#1E293B] rounded shadow-[1.5px_1.5px_0px_#1E293B]">
              TERCYDUK!
            </span>
            <div className="my-auto flex flex-col items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="8" cy="12" r="5" stroke="#1E293B" strokeWidth="2.5" fill="#F43F5E" />
                <circle cx="16" cy="12" r="5" stroke="#1E293B" strokeWidth="2.5" fill="#F43F5E" />
                <line x1="11" y1="12" x2="13" y2="12" stroke="#1E293B" strokeWidth="3" />
              </svg>
            </div>
            <span className="font-primary text-[8.5px] sm:text-[10px] font-black text-[#9F1239] leading-none uppercase tracking-wider">
              OTT KPK
            </span>
          </div>
        )}

        {/* Players on Corner */}
        {playersOnTile.length > 0 && (
          <div className="absolute inset-x-0 bottom-1 flex flex-wrap gap-1 justify-center items-center px-1 z-20 pointer-events-none">
            {playersOnTile.map((p) => (
              <PlayerToken key={p.id} player={p} size="sm" />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. RENDER PETAK TEPI (8 Tier & Kartu Pop)
  // ==========================================
  const isCardGov = tile.sector === "CARD_GOVERNMENT";
  const isCardInsider = tile.sector === "CARD_INSIDER";
  const isRailroad = tile.sector === "BUMN_TRANSPORT";
  const isUtility = tile.sector === "BUMN_UTILITY";
  const isTax = tile.sector === "TAX_TILE" || tile.sector === "PUNGLI_ORBIT";
  const isProperty = tile.price > 0 && !isRailroad && !isUtility;

  // Header Bar Orientation
  const colorBarStyles: Record<string, string> = {
    bottom: "top-0 left-0 right-0 h-3.5 sm:h-4 border-b-[2.5px] border-[#1E293B]",
    top: "bottom-0 left-0 right-0 h-3.5 sm:h-4 border-t-[2.5px] border-[#1E293B]",
    left: "top-0 bottom-0 right-0 w-3.5 sm:w-4 border-l-[2.5px] border-[#1E293B]",
    right: "top-0 bottom-0 left-0 w-3.5 sm:w-4 border-r-[2.5px] border-[#1E293B]",
  };

  const directionalPadding: Record<string, string> = {
    bottom: "pt-4 pb-1.5 px-1",
    top: "pb-4 pt-1.5 px-1",
    left: "pr-4 pl-1 py-1",
    right: "pl-4 pr-1 py-1",
  };

  // Tentukan warna latar kartu (Tint dari spek)
  const cardBgColor = isProperty && tierConfig
    ? tierConfig.tint
    : isCardInsider
    ? "#FEF3C7" // Kartu Event / Kesempatan (#FEF3C7)
    : isCardGov
    ? "#EDE9FE" // Kartu Kebijakan / Dana Umum (#EDE9FE)
    : isTax
    ? "#FEE2E2"
    : "#FFFFFF";

  const headerColor = isProperty && tierConfig
    ? tierConfig.header
    : isCardInsider
    ? "#F59E0B"
    : isCardGov
    ? "#8B5CF6"
    : tile.colorGroup || "#1E293B";

  return (
    <div
      onMouseEnter={() => onHover && onHover(tile)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`relative w-full h-full flex flex-col justify-between rounded-[8px] border-[2.5px] border-[#1E293B] transition-all overflow-hidden cursor-pointer select-none group ${
        isActiveTile
          ? "fantasy-tile-active scale-105 z-30"
          : "shadow-[2.5px_2.5px_0px_#1E293B] hover:shadow-[4px_4px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5"
      }`}
      style={{
        gridRowStart: tile.gridRow + 1,
        gridColumnStart: tile.gridCol + 1,
        backgroundColor: cardBgColor,
      }}
    >
      {/* Header Bar Tegas 8 Kelompok Properti */}
      {isProperty && (
        <div
          className={`absolute ${colorBarStyles[edge]} z-10 flex items-center justify-center`}
          style={{ backgroundColor: headerColor }}
        >
          <div className="w-full h-full opacity-15 bg-[radial-gradient(#1E293B_1px,transparent_1px)] bg-[size:4px_4px]" />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 justify-between relative z-0 h-full ${isProperty ? directionalPadding[edge] : "p-1.5"}`}>
        {/* Top: Owner indicator if owned */}
        {owner ? (
          <div className="flex items-center justify-end leading-none">
            <span
              className="text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded text-white truncate max-w-[55px] border border-[#1E293B] shadow-[1px_1px_0px_#1E293B]"
              style={{ backgroundColor: owner.color }}
            >
              {owner.name}
            </span>
            {state && state.level > 0 && (
              <span className="font-number text-[7px] sm:text-[8px] text-[#0F172A] font-black ml-1 bg-[#FACC15] border border-[#1E293B] px-1 py-0.2 rounded shadow-[1px_1px_0px_#1E293B]">
                ★{state.level}
              </span>
            )}
          </div>
        ) : (
          <div className="h-1" />
        )}

        {/* 1. KARTU KEBIJAKAN / DANA UMUM (#8B5CF6 & #EDE9FE) */}
        {isCardGov && (
          <div className="my-auto flex flex-col items-center justify-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[6px] bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0px_#1E293B]">
              <span className="font-display text-base sm:text-lg font-black text-white leading-none">
                ?
              </span>
            </div>
            <span className="font-primary text-[7px] sm:text-[8px] font-black text-[#5B21B6] tracking-wider uppercase mt-1">
              DANA UMUM
            </span>
          </div>
        )}

        {/* 2. KARTU EVENT / KESEMPATAN (#F59E0B & #FEF3C7) */}
        {isCardInsider && (
          <div className="my-auto flex flex-col items-center justify-center">
            <div className="p-0.5 rounded-[6px] bg-[#FEF3C7] border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
              <NeoLuckyWheel size={24} />
            </div>
            <span className="font-primary text-[7px] sm:text-[8px] font-black text-[#92400E] tracking-wider text-center uppercase mt-1">
              EVENT SPIN
            </span>
          </div>
        )}

        {/* 3. RAILROADS / TRANSPORT */}
        {isRailroad && (
          <div className="my-auto flex flex-col items-center justify-center">
            <NeoLocomotive size={24} />
            <span className="font-primary text-[8px] sm:text-[9.5px] font-black text-[#0F172A] text-center uppercase line-clamp-2 mt-1 leading-tight px-0.5">
              {tile.name}
            </span>
          </div>
        )}

        {/* 4. UTILITIES */}
        {isUtility && (
          <div className="my-auto flex flex-col items-center justify-center">
            <NeoUtilityIcon type={tile.name.includes("PLN") ? "electric" : "water"} size={22} />
            <span className="font-primary text-[8px] sm:text-[9.5px] font-black text-[#0F172A] text-center uppercase line-clamp-2 mt-1 leading-tight px-0.5">
              {tile.name}
            </span>
          </div>
        )}

        {/* 5. TAXES (#F43F5E Rose Red Indikator Denda) */}
        {isTax && (
          <div className="my-auto flex flex-col items-center justify-center">
            <NeoTaxSeal size={22} />
            <span className="font-primary text-[7.5px] sm:text-[9px] font-black text-[#9F1239] text-center uppercase line-clamp-2 mt-1 leading-tight px-0.5">
              {tile.name}
            </span>
          </div>
        )}

        {/* 6. PROPERTY PROVINCE NAME (Deep Navy #0F172A) */}
        {isProperty && (
          <div className="text-center my-auto px-0.5">
            <p className="font-primary text-[8.5px] sm:text-[10px] font-black uppercase tracking-tight text-[#0F172A] leading-[1.12]">
              {tile.name}
            </p>
          </div>
        )}

        {/* Outer Edge Price Label (Hard Shadow Neo-Brutalist Badge) */}
        <div className="text-center mt-auto">
          {tile.price > 0 ? (
            <span className="font-number text-[8px] sm:text-[9.5px] font-black text-[#0F172A] tracking-tight bg-white border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] rounded px-1.5 py-0.5 inline-block">
              {formatShortRupiah(tile.price)}
            </span>
          ) : isTax ? (
            <span className="font-number text-[8px] sm:text-[9px] font-black text-white tracking-tight bg-[#F43F5E] border-2 border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] rounded px-1.5 py-0.5 inline-block">
              {formatShortRupiah(tile.rent)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Players on Tile */}
      {playersOnTile.length > 0 && (
        <div className="absolute inset-x-0 bottom-1 flex flex-wrap gap-1 justify-center items-center px-1 z-20 pointer-events-none">
          {playersOnTile.map((p) => (
            <PlayerToken key={p.id} player={p} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
};
