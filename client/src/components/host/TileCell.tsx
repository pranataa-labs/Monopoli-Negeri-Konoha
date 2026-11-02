import React from "react";
import { TileData, TileState, PlayerClient } from "../../types/game";
import { PlayerToken } from "./PlayerToken";
import {
  Landmark,
  ShieldAlert,
  Sparkles,
  Coins,
  AlertCircle,
  Store,
  Factory,
  Trees,
  Mountain,
  Palmtree,
  Building2,
  Train,
  Zap,
  Receipt,
  FileText,
  Key
} from "lucide-react";

interface TileCellProps {
  tile: TileData;
  state?: TileState;
  owner?: PlayerClient;
  playersOnTile: PlayerClient[];
  isActiveTile?: boolean;
  onHover?: (tile: TileData | null) => void;
}

export const formatShortRupiah = (amount: number): string => {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${amount / 1000}rb`;
  }
  return `Rp ${amount}`;
};

export const TileCell: React.FC<TileCellProps> = ({
  tile,
  state,
  owner,
  playersOnTile,
  isActiveTile = false,
  onHover,
}) => {
  const isCorner = [0, 14, 28, 42].includes(tile.index);

  // Tentukan orientasi sisi papan
  let edge: "bottom" | "left" | "top" | "right" = "bottom";
  if (tile.index >= 1 && tile.index <= 13) {
    edge = "bottom";
  } else if (tile.index >= 15 && tile.index <= 27) {
    edge = "left";
  } else if (tile.index >= 29 && tile.index <= 41) {
    edge = "top";
  } else if (tile.index >= 43 && tile.index <= 55) {
    edge = "right";
  }

  // Pilih Icon berdasarkan sektor
  const renderSectorIcon = () => {
    switch (tile.sector) {
      case "UMKM_PINGGIRAN":
        return <Store size={11} className="text-amber-400" />;
      case "INDUSTRI_PELABUHAN":
        return <Factory size={11} className="text-orange-400" />;
      case "SAWIT_TAMBANG":
        return tile.name.includes("Sawit") || tile.name.includes("Kebun") ? (
          <Trees size={11} className="text-emerald-400" />
        ) : (
          <Mountain size={11} className="text-yellow-400" />
        );
      case "WISATA_ELIT":
        return <Palmtree size={11} className="text-teal-400" />;
      case "PUSAT_OLIGARKI":
        return <Building2 size={11} className="text-indigo-400" />;
      case "BUMN_TRANSPORT":
        return <Train size={11} className="text-blue-400" />;
      case "BUMN_UTILITY":
        return <Zap size={11} className="text-cyan-400" />;
      case "TAX_TILE":
      case "PUNGLI_ORBIT":
        return <Receipt size={11} className="text-red-400" />;
      case "CARD_GOVERNMENT":
        return <FileText size={11} className="text-sky-400" />;
      case "CARD_INSIDER":
        return <Key size={11} className="text-yellow-400" />;
      default:
        return null;
    }
  };

  // 1. Render 4 Petak Sudut Khusus (Corners)
  if (isCorner) {
    let cornerBg = "bg-slate-900 border-slate-700";
    let cornerIcon = <Landmark size={18} className="text-emerald-400" />;
    let cornerTitle = tile.name;
    let cornerSubtitle = "";

    if (tile.index === 0) {
      cornerBg = "bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-500/70 shadow-emerald-500/10";
      cornerIcon = <Coins size={18} className="text-emerald-400 drop-shadow-md" />;
      cornerTitle = "START";
      cornerSubtitle = "+Rp 2jt (Tapera)";
    } else if (tile.index === 14) {
      cornerBg = "bg-gradient-to-br from-slate-900 via-zinc-950 to-slate-950 border-slate-600 shadow-slate-500/10";
      cornerIcon = <ShieldAlert size={18} className="text-orange-400 drop-shadow-md" />;
      cornerTitle = "RUTAN KPK";
      cornerSubtitle = "Besuk / Sel";
    } else if (tile.index === 28) {
      cornerBg = "bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-amber-500/70 shadow-amber-500/20";
      cornerIcon = <Sparkles size={18} className="text-amber-300 drop-shadow-md animate-pulse" />;
      cornerTitle = "BANSOS";
      cornerSubtitle = "Cair APBN!";
    } else if (tile.index === 42) {
      cornerBg = "bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border-red-500/80 shadow-red-500/20";
      cornerIcon = <AlertCircle size={18} className="text-red-400 drop-shadow-md animate-pulse" />;
      cornerTitle = "OTT KPK";
      cornerSubtitle = "Masuk Sel!";
    }

    return (
      <div
        onMouseEnter={() => onHover && onHover(tile)}
        onMouseLeave={() => onHover && onHover(null)}
        className={`relative w-full h-full p-1 sm:p-1.5 flex flex-col justify-between items-center text-center rounded-xl border-2 transition-all cursor-pointer shadow-lg overflow-hidden select-none ${cornerBg} ${
          isActiveTile ? "ring-4 ring-amber-400 shadow-2xl shadow-amber-500/30 scale-[1.02] z-20" : "hover:border-white/50"
        }`}
        style={{
          gridRowStart: tile.gridRow + 1,
          gridColumnStart: tile.gridCol + 1,
        }}
      >
        {/* Top Header of Corner */}
        <div className="flex items-center justify-between w-full px-1">
          <span className="text-[7.5px] font-mono px-1 py-0.2 rounded bg-black/60 text-slate-300 font-bold">
            #{tile.index}
          </span>
          <div className="shrink-0">{cornerIcon}</div>
        </div>

        {/* Title */}
        <div className="my-auto px-0.5 text-center">
          <p className="text-[10px] sm:text-[11px] font-black tracking-tight uppercase leading-none text-white drop-shadow">
            {cornerTitle}
          </p>
          {cornerSubtitle && (
            <p className="text-[7.5px] sm:text-[8px] font-bold text-amber-300 mt-1 leading-none font-mono">
              {cornerSubtitle}
            </p>
          )}
        </div>

        {/* Players Present (Only render when occupied) */}
        {playersOnTile.length > 0 ? (
          <div className="flex flex-wrap gap-0.5 justify-center w-full items-center pb-0.5 z-10">
            {playersOnTile.map((p) => (
              <PlayerToken key={p.id} player={p} size="sm" />
            ))}
          </div>
        ) : (
          <div className="h-0.5" />
        )}
      </div>
    );
  }

  // 2. Render Petak Tepi (Regular Edge Tiles)
  const isCard = tile.sector === "CARD_GOVERNMENT" || tile.sector === "CARD_INSIDER";
  const isTax = tile.sector === "TAX_TILE" || tile.sector === "PUNGLI_ORBIT";
  const isUtility = tile.sector === "BUMN_TRANSPORT" || tile.sector === "BUMN_UTILITY";

  // Orientasi Color Bar (Menghadap ke pusat papan monopoli)
  const colorBarStyles: Record<string, string> = {
    bottom: "top-0 left-0 right-0 h-1.5",
    top: "bottom-0 left-0 right-0 h-1.5",
    left: "top-0 bottom-0 right-0 w-1.5",
    right: "top-0 bottom-0 left-0 w-1.5",
  };

  const directionalPadding: Record<string, string> = {
    bottom: "pt-2 pb-1 px-1",
    top: "pb-2 pt-1 px-1",
    left: "pr-2 pl-1 py-1",
    right: "pl-2 pr-1 py-1",
  };

  return (
    <div
      onMouseEnter={() => onHover && onHover(tile)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`relative w-full h-full flex flex-col justify-between rounded-lg border text-slate-200 transition-all overflow-hidden cursor-pointer select-none group ${
        isActiveTile
          ? "border-amber-400 ring-3 ring-amber-400 bg-slate-800 shadow-xl shadow-amber-500/30 scale-105 z-20"
          : "border-slate-800/90 bg-slate-900/95 hover:border-amber-400/80 hover:bg-slate-850 hover:shadow-md"
      }`}
      style={{
        gridRowStart: tile.gridRow + 1,
        gridColumnStart: tile.gridCol + 1,
      }}
    >
      {/* Dynamic Directional Sector Color Bar */}
      <div
        className={`absolute ${colorBarStyles[edge]} z-10 transition-all`}
        style={{
          backgroundColor: tile.colorGroup || "#475569",
          boxShadow: `0 0 8px ${tile.colorGroup || "#475569"}80`,
        }}
      />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 justify-between relative z-0 h-full ${directionalPadding[edge]}`}>
        {/* Top Mini Badges */}
        <div className="flex items-center justify-between gap-0.5 leading-none">
          <span className="text-[7.5px] font-mono text-slate-400 font-bold">
            #{tile.index}
          </span>

          <div className="flex items-center gap-1">
            {renderSectorIcon()}

            {/* Owner Color Tag & Level Stars */}
            {owner && (
              <div className="flex items-center gap-0.5">
                <span
                  className="text-[7px] font-black px-1 py-0.2 rounded text-white truncate max-w-[36px] shadow-xs"
                  style={{ backgroundColor: owner.color }}
                  title={`Pemilik: ${owner.name}`}
                >
                  {owner.name}
                </span>
                {state && state.level > 0 && (
                  <span className="text-[7px] font-mono text-amber-300 font-bold">
                    +{state.level}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Property Name */}
        <p className="text-[8.5px] sm:text-[9.5px] font-bold tracking-tight text-white leading-tight line-clamp-2 text-center my-auto px-0.5 drop-shadow-xs">
          {tile.name}
        </p>

        {/* Price / Rent / Sector Pill */}
        <div className="text-center mt-auto">
          {tile.price > 0 ? (
            <span className="text-[7.5px] sm:text-[8px] font-mono font-bold text-emerald-300 bg-emerald-950/70 px-1 py-0.2 rounded border border-emerald-700/50 inline-block">
              {formatShortRupiah(tile.price)}
            </span>
          ) : isTax ? (
            <span className="text-[7.5px] sm:text-[8px] font-mono font-bold text-red-300 bg-red-950/70 px-1 py-0.2 rounded border border-red-700/50 inline-block">
              {formatShortRupiah(tile.rent)}
            </span>
          ) : isCard ? (
            <span className="text-[7px] sm:text-[7.5px] font-bold text-amber-300 bg-amber-950/70 px-1 py-0.2 rounded border border-amber-700/50 inline-block">
              {tile.sector === "CARD_GOVERNMENT" ? "Pemerintah" : "Orang Dalam"}
            </span>
          ) : isUtility ? (
            <span className="text-[7.5px] sm:text-[8px] font-mono font-bold text-sky-300 bg-sky-950/70 px-1 py-0.2 rounded border border-sky-700/50 inline-block">
              {formatShortRupiah(tile.rent)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Players on Tile - Only render when occupied */}
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
