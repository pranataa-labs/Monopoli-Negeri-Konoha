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

// Ornate Gold Baroque Crown Crest for Chance (Kebijakan Pemerintah)
const GoldCrownCrest: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
  >
    <path
      d="M24 4L28 14H38L30 20L33 30L24 24L15 30L18 20L10 14H20L24 4Z"
      fill="url(#goldGrad)"
      stroke="#ca8a04"
      strokeWidth="1.5"
    />
    <path
      d="M12 34C16 38 32 38 36 34C37 38 34 44 24 44C14 44 11 38 12 34Z"
      fill="url(#goldGradDark)"
      stroke="#eab308"
      strokeWidth="1.5"
    />
    <circle cx="24" cy="20" r="3" fill="#fef08a" />
    <defs>
      <linearGradient id="goldGrad" x1="10" y1="4" x2="38" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#eab308" />
        <stop offset="1" stopColor="#a16207" />
      </linearGradient>
      <linearGradient id="goldGradDark" x1="12" y1="34" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#eab308" />
        <stop offset="1" stopColor="#78350f" />
      </linearGradient>
    </defs>
  </svg>
);

// Ornate Gold Baroque Medallion / Rosette for Community Chest (Lobi Orang Dalam)
const GoldMedallionRosette: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
  >
    <circle cx="24" cy="24" r="20" stroke="url(#goldGradM)" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="24" cy="24" r="16" fill="#1e1806" stroke="url(#goldGradM)" strokeWidth="2" />
    <path
      d="M24 12V36M12 24H36M15 15L33 33M15 33L33 15"
      stroke="#fef08a"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="24" r="6" fill="url(#goldGradM)" />
    <path
      d="M23 21H25V27H23V21ZM22 28H26V29H22V28Z"
      fill="#451a03"
    />
    <defs>
      <linearGradient id="goldGradM" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#eab308" />
        <stop offset="1" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
  </svg>
);

// Gold Classic Steam Locomotive Silhouette for Railroads (BUMN Transport)
const GoldLocomotive: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
  >
    <rect x="8" y="18" width="22" height="14" rx="2" fill="url(#goldGradTrain)" />
    <rect x="28" y="12" width="12" height="20" rx="2" fill="url(#goldGradTrain)" />
    <rect x="31" y="15" width="6" height="6" rx="1" fill="#0b0b0e" />
    <rect x="12" y="10" width="4" height="8" rx="1" fill="url(#goldGradTrain)" />
    <rect x="6" y="24" width="4" height="6" fill="url(#goldGradTrain)" />
    <circle cx="15" cy="35" r="4.5" fill="url(#goldGradTrain)" stroke="#0b0b0e" strokeWidth="1.5" />
    <circle cx="25" cy="35" r="4.5" fill="url(#goldGradTrain)" stroke="#0b0b0e" strokeWidth="1.5" />
    <circle cx="35" cy="35" r="4.5" fill="url(#goldGradTrain)" stroke="#0b0b0e" strokeWidth="1.5" />
    <line x1="4" y1="40" x2="44" y2="40" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="goldGradTrain" x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.6" stopColor="#eab308" />
        <stop offset="1" stopColor="#92400e" />
      </linearGradient>
    </defs>
  </svg>
);

// Gold Diamond Emblem for Taxes (Pajak DJP & Bea Cukai)
const GoldDiamondTax: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
  >
    <path
      d="M24 4L42 24L24 44L6 24L24 4Z"
      fill="#171203"
      stroke="url(#goldGradTax)"
      strokeWidth="2"
    />
    <path
      d="M24 10L36 24L24 38L12 24L24 10Z"
      stroke="#ca8a04"
      strokeWidth="1"
      strokeDasharray="2 2"
    />
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fill="#fef08a"
      fontSize="13"
      fontWeight="900"
      fontFamily="monospace"
    >
      $$$
    </text>
    <defs>
      <linearGradient id="goldGradTax" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#eab308" />
        <stop offset="1" stopColor="#78350f" />
      </linearGradient>
    </defs>
  </svg>
);

// Gold Lightbulb / Flash for Utilities
const GoldUtilityIcon: React.FC<{ type: "electric" | "water"; size?: number }> = ({ type, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]"
  >
    {type === "electric" ? (
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="url(#goldGradUtil)"
        stroke="#ca8a04"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
        fill="url(#goldGradUtil)"
        stroke="#ca8a04"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    )}
    <defs>
      <linearGradient id="goldGradUtil" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.5" stopColor="#eab308" />
        <stop offset="1" stopColor="#854d0e" />
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
        className={`relative w-full h-full p-1 sm:p-1.5 flex flex-col justify-between items-center text-center bg-[#070709] border-2 border-[#d4af37]/60 rounded-xl transition-all cursor-pointer shadow-xl overflow-hidden select-none ${
          isActiveTile
            ? "ring-4 ring-amber-400 bg-amber-950/20 shadow-amber-500/30 scale-[1.02] z-20"
            : "hover:border-amber-300"
        }`}
        style={{
          gridRowStart: tile.gridRow + 1,
          gridColumnStart: tile.gridCol + 1,
        }}
      >
        {/* CORNER 0: START */}
        {tile.index === 0 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 text-center relative">
            <span className="text-[7px] sm:text-[8px] font-mono font-bold text-amber-400/90 tracking-wider uppercase leading-none">
              GAJI Rp 2JT
            </span>
            <div className="flex flex-col items-center justify-center my-auto">
              <span className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-[0_2px_8px_rgba(234,179,8,0.5)]">
                GO
              </span>
              <svg width="38" height="14" viewBox="0 0 38 14" fill="none" className="mt-0.5">
                <path d="M0 7H30M30 7L24 1M30 7L24 13" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono text-slate-400 leading-none">
              SAAT MELEWATI
            </span>
          </div>
        )}

        {/* CORNER 10: RUTAN KPK (JAIL) */}
        {tile.index === 10 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 relative">
            <div className="flex items-center justify-between w-full text-[7px] sm:text-[8px] font-mono text-amber-400 font-bold uppercase leading-none px-0.5">
              <span>HANYA</span>
              <span>BESUK</span>
            </div>
            {/* Inner Prison Graphic */}
            <div className="my-auto w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-orange-950/80 border border-orange-500/70 p-1 flex flex-col items-center justify-center shadow-inner">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
              <span className="text-[6px] font-black text-orange-300 uppercase leading-none mt-0.5">
                RUTAN KPK
              </span>
            </div>
            <span className="text-[6.5px] sm:text-[7px] font-mono text-slate-400 leading-none">
              SEL TAHANAN
            </span>
          </div>
        )}

        {/* CORNER 20: BANSOS & BRANKAS APBN (FREE PARKING) */}
        {tile.index === 20 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 text-center relative">
            <span className="text-[7px] sm:text-[8px] font-black uppercase text-amber-400 tracking-wider leading-none">
              FREE BANSOS
            </span>
            <div className="my-auto transform -rotate-45 flex flex-col items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_6px_rgba(234,179,8,0.5)]">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="#fef08a" strokeWidth="1.8" fill="#1c1917" />
                <circle cx="12" cy="12" r="3.5" stroke="#eab308" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="1.5" fill="#fef08a" />
              </svg>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono text-amber-300 font-bold leading-none">
              KURAS APBN
            </span>
          </div>
        )}

        {/* CORNER 30: OTT KPK (GO TO JAIL) */}
        {tile.index === 30 && (
          <div className="w-full h-full flex flex-col justify-between items-center p-1 text-center relative">
            <span className="text-[7.5px] sm:text-[8.5px] font-black uppercase text-red-400 tracking-wider leading-none">
              OTT KPK!
            </span>
            <div className="my-auto transform rotate-45 flex flex-col items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_2px_6px_rgba(239,68,68,0.5)]">
                <circle cx="8" cy="12" r="5" stroke="#ef4444" strokeWidth="2" fill="#1e1818" />
                <circle cx="16" cy="12" r="5" stroke="#ef4444" strokeWidth="2" fill="#1e1818" />
                <line x1="11" y1="12" x2="13" y2="12" stroke="#f87171" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono text-red-300 font-bold leading-none">
              MASUK SEL!
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
      className={`relative w-full h-full flex flex-col justify-between bg-[#08080a] border border-[#d4af37]/40 rounded-md text-slate-100 transition-all overflow-hidden cursor-pointer select-none group shadow-md ${
        isActiveTile
          ? "ring-3 ring-amber-400 bg-amber-950/20 shadow-xl shadow-amber-500/30 scale-105 z-20"
          : "hover:border-amber-300 hover:bg-[#101014]"
      }`}
      style={{
        gridRowStart: tile.gridRow + 1,
        gridColumnStart: tile.gridCol + 1,
      }}
    >
      {/* Saturated Color Bar on Inner Edge */}
      {isProperty && (
        <div
          className={`absolute ${colorBarStyles[edge]} z-10`}
          style={{
            backgroundColor: tile.colorGroup || "#475569",
            boxShadow: `0 0 10px ${tile.colorGroup || "#475569"}90`,
          }}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 justify-between relative z-0 h-full ${isProperty ? directionalPadding[edge] : "p-1"}`}>
        {/* Top Tag & Index */}
        <div className="flex items-center justify-between leading-none">
          <span className="text-[7px] font-mono text-amber-400/80 font-bold">
            #{tile.index}
          </span>

          {owner && (
            <div className="flex items-center gap-0.5">
              <span
                className="text-[6.5px] font-black px-1 py-0.2 rounded text-white truncate max-w-[34px] shadow-xs"
                style={{ backgroundColor: owner.color }}
              >
                {owner.name}
              </span>
              {state && state.level > 0 && (
                <span className="text-[6.5px] font-mono text-amber-300 font-bold">
                  +{state.level}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Central Graphic / Icon for Special Tiles */}
        {isCardGov && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldCrownCrest size={24} />
            <span className="text-[7px] sm:text-[7.5px] font-black font-display text-amber-300 tracking-tight text-center uppercase mt-0.5">
              PEMERINTAH
            </span>
          </div>
        )}

        {isCardInsider && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldMedallionRosette size={24} />
            <span className="text-[7px] sm:text-[7.5px] font-black font-display text-amber-300 tracking-tight text-center uppercase mt-0.5">
              ORANG DALAM
            </span>
          </div>
        )}

        {isRailroad && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldLocomotive size={26} />
            <span className="text-[6.5px] sm:text-[7px] font-mono font-bold text-amber-300/90 text-center uppercase line-clamp-1 mt-0.5">
              {tile.name.replace("Kereta Cepat ", "").replace("Pelabuhan ", "").replace("Bandara ", "")}
            </span>
          </div>
        )}

        {isUtility && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldUtilityIcon type={tile.name.includes("PLN") ? "electric" : "water"} size={22} />
            <span className="text-[7px] font-mono font-bold text-amber-300 text-center uppercase line-clamp-1 mt-0.5">
              {tile.name.includes("PLN") ? "PLN LISTRIK" : "PDAM AIR"}
            </span>
          </div>
        )}

        {isTax && (
          <div className="my-auto flex flex-col items-center justify-center">
            <GoldDiamondTax size={22} />
            <span className="text-[6.5px] sm:text-[7px] font-black text-red-400 text-center uppercase line-clamp-1 mt-0.5">
              {tile.name.includes("DJP") ? "PAJAK DJP" : "BEA CUKAI"}
            </span>
          </div>
        )}

        {/* Property Name for Color Properties */}
        {isProperty && (
          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight text-white leading-tight line-clamp-2 text-center my-auto px-0.5 drop-shadow-xs">
            {tile.name}
          </p>
        )}

        {/* Outer Edge Price Label (matching photo like $280, $200, $60) */}
        <div className="text-center mt-auto">
          {tile.price > 0 ? (
            <span className="text-[7.5px] sm:text-[8px] font-mono font-black text-amber-300 tracking-wider">
              {formatShortRupiah(tile.price)}
            </span>
          ) : isTax ? (
            <span className="text-[7px] sm:text-[7.5px] font-mono font-bold text-red-400">
              BAYAR {formatShortRupiah(tile.rent)}
            </span>
          ) : (isCardGov || isCardInsider) ? (
            <span className="text-[6.5px] font-mono text-slate-400 uppercase">
              TARIK KARTU
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
