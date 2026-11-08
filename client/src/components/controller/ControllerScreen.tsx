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
      <div className="min-h-screen w-full fantasy-bg flex flex-col items-center justify-center p-3 sm:p-4 select-none box-border font-property">
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
    <div className="min-h-screen fantasy-bg text-[#0F172A] flex flex-col justify-between max-w-md mx-auto relative select-none font-property border-x-[2.5px] border-[#1E293B]">
      {/* Top Header Bar (Vibrant Neo-Brutalist Pop Controller) */}
      <header className="p-3 bg-white border-b-[2.5px] border-[#1E293B] shadow-[0_3px_0px_#1E293B] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <PlayerToken player={localPlayer} size="sm" />
          <div>
            <h3 className="text-xs font-primary font-black text-[#0F172A] leading-tight">
              {localPlayer.name}
            </h3>
            <span className="text-[10px] text-[#475569] font-property font-bold">
              {localPlayer.token.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTurn ? (
            <span className="px-3 py-1 rounded-[6px] bg-[#FEF08A] border-[2px] border-[#1E293B] text-[#0F172A] text-[10px] font-primary font-black uppercase tracking-wider shadow-[2px_2px_0px_#1E293B] animate-pulse">
              GILIRAN ANDA
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-[6px] bg-white border-[1.5px] border-[#1E293B] text-[#475569] text-[10px] font-property font-bold">
              Menunggu Lawan
            </span>
          )}

          <div className="flex items-center gap-1 text-[10px] font-number text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-[6px] border-[1.5px] border-[#1E293B]">
            <Wifi size={12} className={isConnected ? "text-[#10B981]" : "text-[#F43F5E]"} />
          </div>
        </div>
      </header>

      {/* Main Content Scroll Area */}
      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-36">
        {/* Error Toast */}
        {lastError && (
          <div className="p-3 bg-[#FEE2E2] border-[2px] border-[#1E293B] rounded-[8px] text-xs text-[#F43F5E] flex items-center justify-between shadow-[3px_3px_0px_#1E293B]">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle size={16} className="text-[#F43F5E] shrink-0" />
              <span>{lastError}</span>
            </div>
            <button
              onClick={clearError}
              className="text-xs text-[#0F172A] font-black ml-2 underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Current Tile Card */}
        {currentTile && (
          <div className="p-3.5 rounded-[8px] bg-white border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B]">
            <div className="flex items-center justify-between mb-1.5 border-b-[2px] border-[#1E293B] pb-1">
              <span className="text-[10px] font-primary font-black uppercase tracking-wider text-[#0F172A] flex items-center gap-1">
                <MapPin size={12} className="text-[#FF6B6B]" /> Posisi Saat Ini
              </span>
              <span className="text-[10px] font-number font-black text-[#0F172A] bg-[#E0F2FE] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]">
                Petak #{currentTile.index}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className="w-4 h-4 rounded-[4px] shrink-0 border-[1.5px] border-[#1E293B] shadow-[1px_1px_0px_#1E293B]"
                style={{ backgroundColor: currentTile.colorGroup }}
              />
              <h4 className="text-sm font-primary font-black text-[#0F172A] uppercase">{currentTile.name}</h4>
            </div>

            <p className="text-xs text-[#475569] mt-1 font-property leading-relaxed font-semibold">{currentTile.desc}</p>

            {tileOwner && (
              <div className="mt-2 text-xs font-bold text-[#0F172A] flex items-center gap-2">
                <span>Dimiliki oleh:</span>
                <span
                  className="px-2 py-0.5 rounded-[4px] text-white font-black text-[10px] border-[1.5px] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]"
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
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3.5 sm:p-4 bg-white border-t-[2.5px] border-[#1E293B] z-30 shadow-[0_-3px_0px_#1E293B]">
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
