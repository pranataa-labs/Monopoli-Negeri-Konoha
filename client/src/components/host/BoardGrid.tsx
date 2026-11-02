import React, { useState } from "react";
import { TILES } from "../../constants/board";
import { GameSnapshot, NetworkConfig, PlayerClient, TileData } from "../../types/game";
import { TileCell } from "./TileCell";
import { CenterBoardDeck } from "./CenterBoardDeck";

interface BoardGridProps {
  snapshot: GameSnapshot | null;
  networkConfig?: NetworkConfig | null;
  onStartGame?: () => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  snapshot,
}) => {
  const [hoveredTile, setHoveredTile] = useState<TileData | null>(null);

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

  return (
    <div className="relative w-[840px] h-[840px] min-w-[840px] min-h-[840px] aspect-square p-3 sm:p-4 rounded-3xl leather-case border-[6px] sm:border-[8px] border-[#16161b] shadow-2xl select-none flex items-center justify-center shrink-0">
      {/* Top Gold Briefcase Clasp / Latch */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 gold-latch rounded-b-md z-30 flex items-center justify-center border border-amber-300/40 shadow-md">
        <div className="w-5 h-1.5 bg-[#451a03] rounded-xs shadow-inner" />
      </div>

      {/* Bottom Gold Briefcase Clasp / Latch */}
      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 sm:h-6 gold-latch rounded-t-md z-30 flex items-center justify-center border border-amber-300/40 shadow-md">
        <div className="w-5 h-1.5 bg-[#451a03] rounded-xs shadow-inner" />
      </div>

      {/* 11x11 Perimeter Grid */}
      <div
        className="w-full h-full grid gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-2xl bg-black border-2 border-[#d4af37]/40 ring-1 ring-amber-500/20"
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
          className="relative z-10 overflow-hidden rounded-xl beveled-tray border-2 border-[#1c1c22]"
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
  );
};
