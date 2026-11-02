import React from "react";
import { TileData, TileState, PlayerClient } from "../../types/game";
import { PlayerToken } from "./PlayerToken";
import { Landmark, ShieldAlert, Sparkles, Coins, AlertCircle } from "lucide-react";

interface TileCellProps {
  tile: TileData;
  state?: TileState;
  owner?: PlayerClient;
  playersOnTile: PlayerClient[];
  isActiveTile?: boolean;
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
}) => {
  const isCorner = [0, 14, 28, 42].includes(tile.index);

  // Render Corner Tiles
  if (isCorner) {
    let cornerBg = "bg-slate-900 border-slate-700";
    let cornerIcon = <Landmark size={20} className="text-emerald-400" />;
    let cornerSubtitle = "";

    if (tile.index === 0) {
      cornerBg = "bg-gradient-to-br from-emerald-950 to-slate-950 border-emerald-500/50";
      cornerIcon = <Coins size={22} className="text-emerald-400" />;
      cornerSubtitle = "+Rp 2jt (-10% Tapera)";
    } else if (tile.index === 14) {
      cornerBg = "bg-gradient-to-br from-slate-900 to-zinc-950 border-slate-600";
      cornerIcon = <ShieldAlert size={22} className="text-orange-400" />;
      cornerSubtitle = "Besuk / Sel Tahanan";
    } else if (tile.index === 28) {
      cornerBg = "bg-gradient-to-br from-amber-950 to-slate-950 border-amber-500/50";
      cornerIcon = <Sparkles size={22} className="text-amber-400" />;
      cornerSubtitle = "Kuras Kas Negara!";
    } else if (tile.index === 42) {
      cornerBg = "bg-gradient-to-br from-red-950 to-slate-950 border-red-500/60";
      cornerIcon = <AlertCircle size={22} className="text-red-400 animate-pulse" />;
      cornerSubtitle = "Masuk Rutan KPK!";
    }

    return (
      <div
        className={`relative w-full h-full p-1.5 flex flex-col justify-between items-center text-center rounded-lg border transition-all ${cornerBg} ${
          isActiveTile ? "ring-2 ring-amber-400 shadow-lg shadow-amber-500/20" : ""
        }`}
        style={{
          gridRowStart: tile.gridRow + 1,
          gridColumnStart: tile.gridCol + 1,
        }}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-black/40 text-slate-400">
            #{tile.index}
          </span>
          {cornerIcon}
        </div>

        <div className="my-auto">
          <p className="text-[10px] sm:text-xs font-black tracking-tight uppercase leading-tight text-slate-100">
            {tile.name}
          </p>
          {cornerSubtitle && (
            <p className="text-[8px] sm:text-[9px] font-semibold text-amber-300/90 mt-0.5">
              {cornerSubtitle}
            </p>
          )}
        </div>

        {/* Players Present */}
        <div className="flex flex-wrap gap-1 justify-center min-h-[22px] w-full">
          {playersOnTile.map((p) => (
            <PlayerToken key={p.id} player={p} size="sm" />
          ))}
        </div>
      </div>
    );
  }

  // Regular and Sector Tiles
  const isCard = tile.sector === "CARD_GOVERNMENT" || tile.sector === "CARD_INSIDER";
  const isTax = tile.sector === "TAX_TILE" || tile.sector === "PUNGLI_ORBIT";
  const isUtility = tile.sector === "BUMN_TRANSPORT" || tile.sector === "BUMN_UTILITY";

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between rounded-md border text-slate-200 transition-all overflow-hidden ${
        isActiveTile
          ? "border-amber-400 ring-2 ring-amber-400/80 bg-slate-800 shadow-md shadow-amber-500/20"
          : "border-slate-800/90 bg-slate-900/95 hover:border-slate-700"
      }`}
      style={{
        gridRowStart: tile.gridRow + 1,
        gridColumnStart: tile.gridCol + 1,
      }}
    >
      {/* Top Sector Color Bar */}
      <div
        className="h-1.5 w-full flex items-center justify-between px-1"
        style={{ backgroundColor: tile.colorGroup || "#475569" }}
      >
        {state && state.level > 0 && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: state.level }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="px-1 py-0.5 flex flex-col flex-1 justify-between">
        <div className="flex items-center justify-between gap-0.5">
          <span className="text-[8px] font-mono text-slate-400 leading-none">
            #{tile.index}
          </span>
          {owner && (
            <span
              className="text-[7px] font-bold px-1 rounded text-white truncate max-w-[45px]"
              style={{ backgroundColor: owner.color }}
              title={`Pemilik: ${owner.name}`}
            >
              {owner.name}
            </span>
          )}
        </div>

        <p className="text-[9px] font-bold tracking-tight text-slate-100 leading-tight line-clamp-2 text-center my-0.5">
          {tile.name}
        </p>

        {/* Price / Subtitle */}
        <div className="text-center">
          {tile.price > 0 ? (
            <span className="text-[8px] font-mono text-emerald-400 font-semibold block">
              {formatShortRupiah(tile.price)}
            </span>
          ) : isTax ? (
            <span className="text-[8px] font-mono text-red-400 font-semibold block">
              Bayar {formatShortRupiah(tile.rent)}
            </span>
          ) : isCard ? (
            <span className="text-[8px] font-bold text-amber-300 block">
              {tile.sector === "CARD_GOVERNMENT" ? "Pemerintah" : "Orang Dalam"}
            </span>
          ) : isUtility ? (
            <span className="text-[8px] font-semibold text-sky-400 block">
              {formatShortRupiah(tile.rent)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Players on Tile */}
      <div className="flex flex-wrap gap-0.5 justify-center items-center px-1 pb-0.5 min-h-[18px]">
        {playersOnTile.map((p) => (
          <PlayerToken key={p.id} player={p} size="sm" />
        ))}
      </div>
    </div>
  );
};
