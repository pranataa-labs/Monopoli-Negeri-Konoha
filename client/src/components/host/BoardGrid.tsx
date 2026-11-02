import React from "react";
import { TILES } from "../../constants/board";
import { GameSnapshot, NetworkConfig, PlayerClient } from "../../types/game";
import { TileCell } from "./TileCell";
import { CenterHub } from "./CenterHub";

interface BoardGridProps {
  snapshot: GameSnapshot | null;
  networkConfig: NetworkConfig | null;
  onStartGame: () => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  snapshot,
  networkConfig,
  onStartGame,
}) => {
  // Map player positions to tile indices
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
    <div className="w-full h-full max-w-[1400px] max-h-[920px] aspect-square p-2 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      <div
        className="w-full h-full grid gap-1"
        style={{
          gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
          gridTemplateRows: "repeat(15, minmax(0, 1fr))",
        }}
      >
        {/* Render 56 Perimeter Tiles */}
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
            />
          );
        })}

        {/* Center Hub: 13x13 Inner Area */}
        <div
          className="relative z-10 overflow-hidden"
          style={{
            gridRowStart: 2,
            gridRowEnd: 15,
            gridColumnStart: 2,
            gridColumnEnd: 15,
          }}
        >
          <CenterHub
            snapshot={snapshot}
            networkConfig={networkConfig}
            onStartGame={onStartGame}
          />
        </div>
      </div>
    </div>
  );
};
