import React from "react";
import { PlayerClient, GameSnapshot } from "../../types/game";
import { TILES } from "../../constants/board";
import { formatShortRupiah } from "../host/formatters";
import { Dices, ShoppingBag, ShieldCheck, Key, ArrowRight } from "lucide-react";

interface ActionPadProps {
  player: PlayerClient;
  snapshot: GameSnapshot | null;
  onRoll: () => void;
  onBuy: () => void;
  onPayBail: () => void;
  onUsePass: () => void;
  onEndTurn: () => void;
}

export const ActionPad: React.FC<ActionPadProps> = ({
  player,
  snapshot,
  onRoll,
  onBuy,
  onPayBail,
  onUsePass,
  onEndTurn,
}) => {
  const isTurn = snapshot?.activePlayerId === player.id;
  const currentTile = TILES.find((t) => t.index === player.position);
  const tileState = currentTile ? snapshot?.tilesState?.[currentTile.id] : null;

  const canRoll = isTurn && !snapshot?.hasRolled && !player.inJail;
  const canBuy =
    isTurn &&
    snapshot?.hasRolled &&
    currentTile &&
    currentTile.price > 0 &&
    tileState &&
    !tileState.ownerId &&
    player.cash >= currentTile.price;

  const canEndTurn = isTurn && (snapshot?.hasRolled || player.inJail);

  const vibrate = (ms = 40) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  };

  if (!isTurn) {
    const activePlayer = snapshot?.players.find((p) => p.id === snapshot.activePlayerId);
    return (
      <div className="p-3.5 rounded-[8px] text-center font-property bg-white border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
        <p className="text-[10px] font-primary font-black uppercase tracking-wider text-[#FF6B6B] mb-1">
          MENUNGGU GILIRAN
        </p>
        <p className="text-xs font-bold text-[#0F172A]">
          Sedang giliran <span className="text-[#0F172A] bg-[#FEF08A] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] font-black">{activePlayer?.name || "Lawan"}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 font-property">
      {/* Jail Options */}
      {player.inJail && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              vibrate(50);
              onPayBail();
            }}
            disabled={player.cash < 500000}
            className={`py-3 px-2 rounded-[8px] text-xs font-primary font-black uppercase flex items-center justify-center gap-1.5 transition-all border-[2px] border-[#1E293B] ${
              player.cash >= 500000
                ? "bg-[#FEF9C3] hover:bg-[#FEF08A] text-[#0F172A] shadow-[3px_3px_0px_#1E293B] cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed shadow-none"
            }`}
          >
            <ShieldCheck size={16} /> Bayar Jaminan (500rb)
          </button>

          <button
            onClick={() => {
              vibrate(50);
              onUsePass();
            }}
            disabled={!player.hasInsiderPass}
            className={`py-3 px-2 rounded-[8px] text-xs font-primary font-black uppercase flex items-center justify-center gap-1.5 transition-all border-[2px] border-[#1E293B] ${
              player.hasInsiderPass
                ? "bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#8B5CF6] shadow-[3px_3px_0px_#1E293B] cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed shadow-none"
            }`}
          >
            <Key size={16} className="text-[#8B5CF6]" /> Pakai Kartu Sakti
          </button>
        </div>
      )}

      {/* Buy Tile Button (#FF6B6B Vibrant Coral dengan teks #FFFFFF) */}
      {canBuy && currentTile && (
        <button
          onClick={() => {
            vibrate(60);
            onBuy();
          }}
          className="w-full py-3.5 px-4 bg-[#FF6B6B] hover:bg-[#FA5252] text-white border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] font-primary font-black text-xs uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-2 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <ShoppingBag size={17} />
          <span>Beli {currentTile.name} ({formatShortRupiah(currentTile.price)})</span>
        </button>
      )}

      {/* Main Roll Dice Button (#FF6B6B Vibrant Coral dengan teks #FFFFFF) */}
      {canRoll && (
        <button
          onClick={() => {
            vibrate(50);
            onRoll();
          }}
          className="w-full py-4 px-4 bg-[#FF6B6B] hover:bg-[#FA5252] text-white border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] font-primary font-black text-sm uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-2.5 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <Dices size={20} />
          <span>Kocok Dadu Permainan</span>
        </button>
      )}

      {/* End Turn Button */}
      {canEndTurn && (
        <button
          onClick={() => {
            vibrate(30);
            onEndTurn();
          }}
          className="w-full py-3 px-4 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B] font-primary font-black text-xs uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-2 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <span>Selesaikan Giliran</span>
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
};
