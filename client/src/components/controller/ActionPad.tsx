import React from "react";
import { PlayerClient, GameSnapshot } from "../../types/game";
import { TILES } from "../../constants/board";
import { formatShortRupiah } from "../host/TileCell";
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
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-center shadow-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Menunggu Giliran
        </p>
        <p className="text-sm font-semibold text-white">
          Sedang giliran <span className="text-amber-400">{activePlayer?.name || "Lawan"}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Jail Options */}
      {player.inJail && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              vibrate(50);
              onPayBail();
            }}
            disabled={player.cash < 500000}
            className={`py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              player.cash >= 500000
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
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
            className={`py-3 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              player.hasInsiderPass
                ? "bg-sky-500 hover:bg-sky-400 text-white active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Key size={16} /> Pakai Kartu Sakti
          </button>
        </div>
      )}

      {/* Buy Tile Button */}
      {canBuy && currentTile && (
        <button
          onClick={() => {
            vibrate(60);
            onBuy();
          }}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer"
        >
          <ShoppingBag size={18} />
          <span>Beli {currentTile.name} ({formatShortRupiah(currentTile.price)})</span>
        </button>
      )}

      {/* Main Roll Dice Button */}
      {canRoll && (
        <button
          onClick={() => {
            vibrate(50);
            onRoll();
          }}
          className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2.5 active:scale-98 transition-transform cursor-pointer animate-pulse-gentle"
        >
          <Dices size={22} />
          <span>Lempar Dadu Konoha</span>
        </button>
      )}

      {/* End Turn Button */}
      {canEndTurn && (
        <button
          onClick={() => {
            vibrate(30);
            onEndTurn();
          }}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
        >
          <span>Selesaikan Giliran</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};
