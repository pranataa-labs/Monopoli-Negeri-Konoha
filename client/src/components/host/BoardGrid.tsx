import React, { useState } from "react";
import { TILES } from "../../constants/board";
import { GameSnapshot, NetworkConfig, PlayerClient, TileData } from "../../types/game";
import { TileCell } from "./TileCell";
import { CenterBoardDeck } from "./CenterBoardDeck";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface BoardGridProps {
  snapshot: GameSnapshot | null;
  networkConfig?: NetworkConfig | null;
  onStartGame?: () => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  snapshot,
}) => {
  const [hoveredTile, setHoveredTile] = useState<TileData | null>(null);
  const [boardScale, setBoardScale] = useState<number>(1.15); // Default enlarged scale

  // Map posisi pemain ke nomor indeks petak (40 petak 11x11)
  const playersByTile: Record<number, PlayerClient[]> = {};
  if (snapshot) {
    snapshot.players.forEach((p) => {
      if (!playersByTile[p.position]) {
        playersByTile[p.position] = [];
      }
      playersByTile[p.position].push(p);
    });
  }

  const activePlayer = snapshot?.players.find((p) => p.id === snapshot.activePlayerId);

  const handleZoom = (delta: number) => {
    setBoardScale((prev) => Math.min(1.6, Math.max(0.85, parseFloat((prev + delta).toFixed(2)))));
  };

  const handleResetZoom = () => {
    setBoardScale(1.15);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* Floating Zoom & Scale Controls Bar (Vibrant Neo-Brutalist Pop) */}
      <div className="sticky top-2 z-40 mb-3 flex items-center gap-2 bg-white px-4 py-1.5 rounded-[8px] border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B]">
        <span className="font-primary text-[10px] text-[#0F172A] font-black uppercase tracking-wider hidden sm:inline mr-1">
          UKURAN MEJA:
        </span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="w-7 h-7 rounded-[6px] bg-white hover:bg-[#E0F2FE] border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center transition-all cursor-pointer shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
          title="Perkecil Meja"
        >
          <ZoomOut size={14} />
        </button>
        <span className="font-number text-xs font-black text-[#0F172A] px-2 min-w-[46px] text-center">
          {Math.round(boardScale * 100)}%
        </span>
        <button
          onClick={() => handleZoom(0.1)}
          className="w-7 h-7 rounded-[6px] bg-white hover:bg-[#E0F2FE] border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center transition-all cursor-pointer shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
          title="Perbesar Meja"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2.5 py-1 rounded-[6px] bg-[#FF6B6B] hover:bg-[#FA5252] border-[2px] border-[#1E293B] text-white text-[10px] font-primary font-black transition-all cursor-pointer ml-1 flex items-center gap-1 shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
          title="Kembali ke Ukuran Standar Besar (115%)"
        >
          <Maximize2 size={11} /> RESET
        </button>
      </div>

      {/* Scaled Giant Board Container */}
      <div
        className="transition-transform duration-200 origin-top flex items-center justify-center"
        style={{ transform: `scale(${boardScale})` }}
      >
        <div className="relative w-[1140px] aspect-square p-4 sm:p-5 rounded-[12px] fantasy-board-outer select-none flex items-center justify-center shrink-0">
          {/* Top Comic Plaque */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-[6px] bg-white border-[2.5px] border-[#1E293B] text-[#0F172A] font-primary font-black text-[11px] tracking-[0.2em] uppercase shadow-[3px_3px_0px_#1E293B] flex items-center gap-2 z-30">
            <span className="text-[#FF6B6B]">★</span>
            <span>MONOPOLI NEGERI KONOHA</span>
            <span className="text-[#FF6B6B]">★</span>
          </div>

          {/* Bottom Comic Plaque */}
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-[6px] bg-white border-[2.5px] border-[#1E293B] text-[#0F172A] font-primary font-black text-[10px] tracking-[0.2em] uppercase shadow-[3px_3px_0px_#1E293B] flex items-center gap-2 z-30">
            <span className="text-[#F59E0B]">◆</span>
            <span>PAPAN PERMAINAN 11×11 • 40 PETAK RESMI</span>
            <span className="text-[#F59E0B]">◆</span>
          </div>

          {/* 11x11 Perimeter Grid */}
          <div
            className="w-full h-full grid gap-1.5 p-1.5 rounded-[8px] bg-[#E2E8F0] border-[2.5px] border-[#1E293B]"
            style={{
              gridTemplateColumns: "1.3fr repeat(9, 1fr) 1.3fr",
              gridTemplateRows: "1.3fr repeat(9, 1fr) 1.3fr",
            }}
          >
            {/* Render 40 Petak Perimeter */}
            {TILES.map((tile) => {
              const tileState = snapshot?.tilesState?.[tile.id];
              const owner = tileState?.ownerId
                ? snapshot?.players.find((p) => p.id === tileState.ownerId)
                : undefined;
              const playersOnTile = playersByTile[tile.index] || [];
              const isActiveTile = activePlayer?.position === tile.index;

              return (
                <TileCell
                  key={tile.id}
                  tile={tile}
                  state={tileState}
                  owner={owner}
                  playersOnTile={playersOnTile}
                  isActiveTile={isActiveTile}
                  onHover={setHoveredTile}
                />
              );
            })}

            {/* Center Board Deck: Area Dalam 9x9 (Rows 2-11, Cols 2-11) */}
            <div
              className="relative z-10 overflow-hidden rounded-[8px] border-[2.5px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B]"
              style={{
                gridRowStart: 2,
                gridRowEnd: 11,
                gridColumnStart: 2,
                gridColumnEnd: 11,
              }}
            >
              <CenterBoardDeck
                activeCard={snapshot?.activeCardEvent?.card}
                hoveredTile={hoveredTile}
                tilesState={snapshot?.tilesState}
                players={snapshot?.players}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
