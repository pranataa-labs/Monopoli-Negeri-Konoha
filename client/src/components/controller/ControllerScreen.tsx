import React from "react";
import { useSocket } from "../../hooks/useSocket";
import { JoinRoom } from "./JoinRoom";
import { WalletCard } from "./WalletCard";
import { ActionPad } from "./ActionPad";
import { TILES } from "../../constants/board";
import { PlayerToken } from "../host/PlayerToken";
import { BreakingNews } from "../host/BreakingNews";
import { Wifi, MapPin, AlertCircle } from "lucide-react";

export const ControllerScreen: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("room") || "KONOHA-01";

  const {
    snapshot,
    localPlayer,
    lastError,
    activeCard,
    joinRoom,
    rollDice,
    buyProperty,
    upgradeProperty,
    payJailBail,
    useJailPass,
    endTurn,
    dismissCard,
    clearError,
    isConnected,
  } = useSocket(roomId);

  if (!localPlayer) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <JoinRoom
          snapshot={snapshot}
          onJoin={joinRoom}
          error={lastError}
        />
      </div>
    );
  }

  const isTurn = snapshot?.activePlayerId === localPlayer.id;
  const currentTile = TILES.find((t) => t.index === localPlayer.position);
  const tileState = currentTile ? snapshot?.tilesState?.[currentTile.id] : null;
  const tileOwner = tileState?.ownerId
    ? snapshot?.players.find((p) => p.id === tileState.ownerId)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* Top Header Bar */}
      <header className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <PlayerToken player={localPlayer} size="sm" />
          <div>
            <h3 className="text-xs font-black text-white leading-tight">
              {localPlayer.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {localPlayer.token.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTurn ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider animate-pulse">
              GILIRAN ANDA
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
              Menunggu Lawan
            </span>
          )}

          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <Wifi size={12} className={isConnected ? "text-emerald-400" : "text-red-400"} />
          </div>
        </div>
      </header>

      {/* Main Content Scroll Area */}
      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-32">
        {/* Error Toast */}
        {lastError && (
          <div className="p-3 bg-red-950 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{lastError}</span>
            </div>
            <button
              onClick={clearError}
              className="text-xs text-red-400 font-bold ml-2 underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Current Tile Card */}
        {currentTile && (
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin size={12} className="text-amber-400" /> Posisi Saat Ini
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Petak #{currentTile.index}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: currentTile.colorGroup }}
              />
              <h4 className="text-sm font-black text-white">{currentTile.name}</h4>
            </div>

            <p className="text-xs text-slate-400 mt-1">{currentTile.desc}</p>

            {tileOwner && (
              <div className="mt-2 text-xs font-semibold text-slate-300">
                Dimiliki oleh:{" "}
                <span
                  className="px-1.5 py-0.5 rounded text-white font-bold text-[11px]"
                  style={{ backgroundColor: tileOwner.color }}
                >
                  {tileOwner.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Player Wallet & Portfolio */}
        <WalletCard
          player={localPlayer}
          snapshot={snapshot}
          onUpgrade={upgradeProperty}
          isTurn={isTurn}
        />
      </main>

      {/* Sticky Bottom Thumb-Zone Action Pad */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 z-30">
        <ActionPad
          player={localPlayer}
          snapshot={snapshot}
          onRoll={rollDice}
          onBuy={buyProperty}
          onPayBail={payJailBail}
          onUsePass={useJailPass}
          onEndTurn={endTurn}
        />
      </footer>

      {/* Breaking News Popup Card Overlay */}
      <BreakingNews cardEvent={activeCard} onDismiss={dismissCard} />
    </div>
  );
};
