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

// Ornate Gold Lucky Wheel for Lucky Spin
const GoldLuckyWheel: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_1px_3px_rgba(212,175,55,0.4)]"
  >
    <circle cx="12" cy="12" r="9" stroke="#F5D76E" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="7" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
    <line x1="12" y1="3" x2="12" y2="21" stroke="#F5D76E" strokeWidth="1.2" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="#F5D76E" strokeWidth="1.2" />
    <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" stroke="#F5D76E" strokeWidth="1.2" />
    <line x1="18.36" y1="5.64" x2="5.64" y2="18.36" stroke="#F5D76E" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="2.6" fill="#D4AF37" stroke="#F5D76E" strokeWidth="0.8" />
    <polygon points="12,1.8 10.5,3.6 13.5,3.6" fill="#F5D76E" />
  </svg>
);

// Gold Classic Steam Locomotive Silhouette for Railroads (BUMN Transport)
const GoldLocomotive: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_1px_3px_rgba(212,175,55,0.4)]"
  >
    <rect x="8" y="18" width="22" height="14" rx="2" fill="url(#goldGradTrain)" />
    <rect x="28" y="13" width="12" height="19" rx="2" fill="url(#goldGradTrain)" />
    <rect x="31" y="16" width="6" height="5" rx="1" fill="#0B0B0D" />
    <rect x="12" y="11" width="4" height="7" rx="1" fill="url(#goldGradTrain)" />
    <rect x="6" y="24" width="4" height="6" fill="url(#goldGradTrain)" />
    <circle cx="15" cy="35" r="4" fill="url(#goldGradTrain)" stroke="#0B0B0D" strokeWidth="1.2" />
    <circle cx="25" cy="35" r="4" fill="url(#goldGradTrain)" stroke="#0B0B0D" strokeWidth="1.2" />
    <circle cx="35" cy="35" r="4" fill="url(#goldGradTrain)" stroke="#0B0B0D" strokeWidth="1.2" />
    <line x1="5" y1="40" x2="43" y2="40" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="goldGradTrain" x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5D76E" />
        <stop offset="0.6" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#785206" />
      </linearGradient>
    </defs>
  </svg>
);

// Gold Diamond Emblem for Taxes
const GoldDiamondTax: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_1px_3px_rgba(212,175,55,0.4)]"
  >
    <path
      d="M24 6L40 24L24 42L8 24L24 6Z"
      fill="#1C1C1F"
      stroke="url(#goldGradTax)"
      strokeWidth="1.8"
    />
    <path
      d="M24 12L34 24L24 36L14 24L24 12Z"
      stroke="#D4AF37"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <text
      x="24"
      y="27"
      textAnchor="middle"
      fill="#F5D76E"
      fontSize="11"
      fontWeight="800"
      fontFamily="Montserrat, sans-serif"
    >
      $$$
    </text>
    <defs>
      <linearGradient id="goldGradTax" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5D76E" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#785206" />
      </linearGradient>
    </defs>
  </svg>
);

// Gold Lightbulb / Flash for Utilities
const GoldUtilityIcon: React.FC<{ type: "electric" | "water"; size?: number }> = ({ type, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_1px_3px_rgba(212,175,55,0.4)]"
  >
    {type === "electric" ? (
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="url(#goldGradUtil)"
        stroke="#D4AF37"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        fill="url(#goldGradUtil)"
        stroke="#D4AF37"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    )}
    <defs>
      <linearGradient id="goldGradUtil" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5D76E" />
        <stop offset="0.5" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#785206" />
      </linearGradient>
    </defs>
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

  // Tentukan orientasi sisi papan (11x11 Monopoly)
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
  // 1. RENDER 4 PETAK SUDUT (CORNERS)
  // ==========================================
  if (isCorner) {
    return (
      <div
        onMouseEnter={() => onHover && onHover(tile)}
        onMouseLeave={() => onHover && onHover(null)}
        className={`relative w-full h-full p-1 sm:p-1.5 flex flex-col justify-between items-center text-center bg-[#0B0B0D] border-2 border-[#D4AF37] rounded-xl transition-all cursor-pointer shadow-xl overflow-hidden select-none ${
          isActiveTile
            ? "ring-3 ring-[#F5D76E] bg-[#1C1C1F] shadow-lg shadow-[#D4AF37]/40 scale-[1.02] z-20"
            : "hover:border-[#F5D76E]"
        }`}
        style={{
          gridRowStart: tile.gridRow + 1,
          gridColumnStart: tile.gridCol + 1,
        }}
      >
        {/* CORNER 0: START */}
        {tile.index === 0 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 text-center relative bg-[#0B0B0D]">
            <span className="font-number text-[7.5px] sm:text-[8px] font-extrabold text-[#F5D76E] tracking-tight uppercase leading-none">
              GAJI Rp 2JT
            </span>
            <div className="flex flex-col items-center justify-center my-auto">
              <span className="font-primary text-2xl sm:text-3xl font-black text-[#F2F2F2] tracking-wider drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]">
                GO
              </span>
              <svg width="36" height="12" viewBox="0 0 36 12" fill="none" className="mt-0.5">
                <path d="M0 6H28M28 6L22 1M28 6L22 11" stroke="#F5D76E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-primary text-[8px] text-[#D4AF37] uppercase tracking-widest leading-none">
              START
            </span>
          </div>
        )}

        {/* CORNER 10: PENJARA (JAIL) - TANPA HANYA BESUK */}
        {tile.index === 10 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 relative bg-[#0B0B0D]">
            <span className="font-number text-[7px] font-extrabold text-[#D4AF37] uppercase tracking-wider leading-none">
              TERPIDANA
            </span>
            {/* Inner Prison Graphic */}
            <div className="my-auto w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#1C1C1F] border border-[#D4AF37]/50 p-1 flex flex-col items-center justify-center shadow-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5D76E" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
              <span className="font-property text-[5.5px] font-bold text-[#F5D76E] uppercase leading-none mt-0.5">
                SEL TAHANAN
              </span>
            </div>
            <span className="font-primary text-[8px] sm:text-[9px] font-black text-[#F2F2F2] uppercase tracking-wider leading-none">
              PENJARA
            </span>
          </div>
        )}

        {/* CORNER 20: PARKIR BEBAS (FREE PARKING) */}
        {tile.index === 20 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 text-center relative bg-[#0B0B0D]">
            <span className="font-primary text-[8px] font-black uppercase text-[#D4AF37] tracking-wider leading-none">
              PARKIR
            </span>
            <div className="my-auto transform -rotate-45 flex flex-col items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="#F5D76E" strokeWidth="1.6" fill="#1C1C1F" />
                <circle cx="12" cy="12" r="3" stroke="#D4AF37" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="1.2" fill="#F5D76E" />
              </svg>
            </div>
            <span className="font-primary text-[8px] font-black text-[#F2F2F2] leading-none uppercase tracking-wider">
              BEBAS
            </span>
          </div>
        )}

        {/* CORNER 30: MASUK PENJARA (GO TO JAIL) */}
        {tile.index === 30 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 text-center relative bg-[#0B0B0D]">
            <span className="font-primary text-[8px] font-black uppercase text-rose-400 tracking-wider leading-none">
              MASUK
            </span>
            <div className="my-auto transform rotate-45 flex flex-col items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_4px_rgba(229,115,115,0.4)]">
                <circle cx="8" cy="12" r="4.5" stroke="#E57373" strokeWidth="1.8" fill="#1C1C1F" />
                <circle cx="16" cy="12" r="4.5" stroke="#E57373" strokeWidth="1.8" fill="#1C1C1F" />
                <line x1="11" y1="12" x2="13" y2="12" stroke="#E57373" strokeWidth="1.8" />
              </svg>
            </div>
            <span className="font-primary text-[8px] font-black text-[#F2F2F2] leading-none uppercase tracking-wider">
              PENJARA
            </span>
          </div>
        )}

        {/* Players on Corner */}
        {playersOnTile.length > 0 && (
          <div className="absolute inset-x-0 bottom-0.5 flex flex-wrap gap-0.5 justify-center items-center px-0.5 z-20 pointer-events-none">
            {playersOnTile.map((p) => (
              <PlayerToken key={p.id} player={p} size="sm" />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. RENDER PETAK TEPI (REGULAR EDGE TILES)
  // ==========================================
  const isCardGov = tile.sector === "CARD_GOVERNMENT";
  const isCardInsider = tile.sector === "CARD_INSIDER";
  const isRailroad = tile.sector === "BUMN_TRANSPORT";
  const isUtility = tile.sector === "BUMN_UTILITY";
  const isTax = tile.sector === "TAX_TILE" || tile.sector === "PUNGLI_ORBIT";
  const isProperty = tile.price > 0 && !isRailroad && !isUtility;

  // Orientasi Color Bar (Menghadap ke arah Pusat Papan)
  const colorBarStyles: Record<string, string> = {
    bottom: "top-0 left-0 right-0 h-2 sm:h-2.5",
    top: "bottom-0 left-0 right-0 h-2 sm:h-2.5",
    left: "top-0 bottom-0 right-0 w-2 sm:w-2.5",
    right: "top-0 bottom-0 left-0 w-2 sm:w-2.5",
  };

  const directionalPadding: Record<string, string> = {
    bottom: "pt-3 pb-1 px-1",
    top: "pb-3 pt-1 px-1",
    left: "pr-3 pl-1 py-1",
    right: "pl-3 pr-1 py-1",
  };

  return (
    <div
      onMouseEnter={() => onHover && onHover(tile)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`relative w-full h-full flex flex-col justify-between bg-[#0B0B0D] border border-[#D4AF37]/35 rounded-md text-[#F2F2F2] transition-all overflow-hidden cursor-pointer select-none group shadow-sm ${
        isActiveTile
          ? "ring-2 ring-[#F5D76E] bg-[#1C1C1F] shadow-md shadow-[#D4AF37]/30 scale-105 z-20"
          : "hover:border-[#F5D76E] hover:bg-[#121215]"
      }`}
      style={{
        gridRowStart: tile.gridRow + 1,
        gridColumnStart: tile.gridCol + 1,
      }}
    >
      {/* Saturated / Pastel Color Bar on Inner Edge */}
      {isProperty && (
        <div
          className={`absolute ${colorBarStyles[edge]} z-10`}
          style={{
            backgroundColor: tile.colorGroup || "#475569",
            boxShadow: `0 0 6px ${tile.colorGroup || "#475569"}80`,
          }}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 justify-between relative z-0 h-full ${isProperty ? directionalPadding[edge] : "p-1"}`}>
        {/* Top: Owner indicator if owned (clean & discreet) */}
        {owner ? (
          <div className="flex items-center justify-end leading-none">
            <span
              className="text-[6px] font-bold px-1 py-0.2 rounded text-white truncate max-w-[40px] shadow-xs"
              style={{ backgroundColor: owner.color }}
            >
              {owner.name}
            </span>
            {state && state.level > 0 && (
              <span className="font-number text-[6px] text-[#F5D76E] font-extrabold ml-0.5">
                +{state.level}
              </span>
            )}
          </div>
        ) : (
          <div className="h-1.5" />
        )}

        {/* 1. KARTU TANDA TANYA (?) - Clean & Elegant */}
        {isCardGov && (
          <div className="my-auto flex flex-col items-center justify-center">
            <span className="font-primary text-2xl font-black text-[#F5D76E] drop-shadow-[0_1px_4px_rgba(212,175,55,0.5)]">
              ?
            </span>
            <span className="font-property text-[7px] font-bold text-[#D4AF37] tracking-wider uppercase mt-0.5">
              CHANCE
            </span>
          </div>
        )}

        {/* 2. KARTU LUCKY SPIN - Clean & Elegant */}
        {isCardInsider && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldLuckyWheel size={22} />
            <span className="font-property text-[6.5px] font-bold text-[#D4AF37] tracking-tight text-center uppercase mt-0.5">
              LUCKY SPIN
            </span>
          </div>
        )}

        {/* 3. RAILROADS / TRANSPORT */}
        {isRailroad && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldLocomotive size={22} />
            <span className="font-property text-[7.5px] font-bold text-[#F2F2F2] text-center uppercase line-clamp-2 mt-0.5 leading-tight px-0.5">
              {tile.name}
            </span>
          </div>
        )}

        {/* 4. UTILITIES */}
        {isUtility && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldUtilityIcon type={tile.name.includes("PLN") ? "electric" : "water"} size={20} />
            <span className="font-property text-[7.5px] font-bold text-[#F2F2F2] text-center uppercase line-clamp-2 mt-0.5 leading-tight px-0.5">
              {tile.name}
            </span>
          </div>
        )}

        {/* 5. TAXES */}
        {isTax && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldDiamondTax size={20} />
            <span className="font-property text-[7px] font-bold text-rose-300 text-center uppercase line-clamp-2 mt-0.5 leading-tight px-0.5">
              {tile.name}
            </span>
          </div>
        )}

        {/* 6. CLEAN PROPERTY PROVINCE NAME (NO EXTRA ICONS) */}
        {isProperty && (
          <p className="font-property text-[8px] sm:text-[8.5px] font-bold uppercase tracking-tight text-[#F2F2F2] leading-[1.08] text-center my-auto px-0.5 drop-shadow-xs">
            {tile.name}
          </p>
        )}

        {/* Outer Edge Price Label (Montserrat ExtraBold) */}
        <div className="text-center mt-auto">
          {tile.price > 0 ? (
            <span className="font-number text-[8px] sm:text-[8.5px] font-extrabold text-[#F5D76E] tracking-tight">
              {formatShortRupiah(tile.price)}
            </span>
          ) : isTax ? (
            <span className="font-number text-[7.5px] font-extrabold text-rose-400 tracking-tight">
              {formatShortRupiah(tile.rent)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Players on Tile */}
      {playersOnTile.length > 0 && (
        <div className="absolute inset-x-0 bottom-0.5 flex flex-wrap gap-0.5 justify-center items-center px-0.5 z-20 pointer-events-none">
          {playersOnTile.map((p) => (
            <PlayerToken key={p.id} player={p} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
};
