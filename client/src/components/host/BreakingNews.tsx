import React, { useEffect } from "react";
import { CardResolutionEvent } from "../../types/game";
import { AlertCircle, FileText, Landmark, X } from "lucide-react";
import { formatShortRupiah } from "./TileCell";

interface BreakingNewsProps {
  cardEvent: CardResolutionEvent | null;
  onDismiss: () => void;
}

export const BreakingNews: React.FC<BreakingNewsProps> = ({ cardEvent, onDismiss }) => {
  useEffect(() => {
    if (cardEvent) {
      // Auto dismiss after 9 seconds if not clicked
      const timer = setTimeout(() => {
        onDismiss();
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [cardEvent, onDismiss]);

  if (!cardEvent) return null;

  const { card, player, cashDelta, poolDelta, description } = cardEvent;
  const isGov = card.deck === "GOVERNMENT";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Red Breaking News Header Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white animate-ping" />
            <span className="font-mono font-black text-xs tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded">
              SIARAN LANGSUNG • KONOHA TV
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 text-slate-100">
          <div className="flex items-center gap-2 mb-3">
            {isGov ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-950 text-sky-300 text-xs font-bold border border-sky-800">
                <Landmark size={14} /> KEBIJAKAN PEMERINTAH
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950 text-amber-300 text-xs font-bold border border-amber-800">
                <FileText size={14} /> LOBI ORANG DALAM
              </span>
            )}

            <span className="text-xs font-mono text-slate-400">
              Target: <strong className="text-slate-200">{player.name}</strong>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-3">
            {card.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 bg-slate-800/80 p-4 rounded-lg border border-slate-700 leading-relaxed mb-4">
            "{card.text}"
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
                Dampak Saldo Pemain
              </span>
              <span
                className={`text-lg font-mono font-black ${
                  cashDelta > 0
                    ? "text-emerald-400"
                    : cashDelta < 0
                    ? "text-red-400"
                    : "text-slate-300"
                }`}
              >
                {cashDelta > 0 ? `+${formatShortRupiah(cashDelta)}` : cashDelta < 0 ? formatShortRupiah(cashDelta) : "Rp 0"}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] uppercase tracking-wide text-slate-400 block mb-1">
                Aliran Kas Negara
              </span>
              <span
                className={`text-lg font-mono font-black ${
                  poolDelta > 0
                    ? "text-amber-400"
                    : poolDelta < 0
                    ? "text-rose-400"
                    : "text-slate-300"
                }`}
              >
                {poolDelta > 0 ? `+${formatShortRupiah(poolDelta)}` : poolDelta < 0 ? formatShortRupiah(poolDelta) : "Rp 0"}
              </span>
            </div>
          </div>

          {description && (
            <div className="text-xs text-slate-400 flex items-center gap-2 mb-4">
              <AlertCircle size={14} className="text-amber-400 shrink-0" />
              <span>{description}</span>
            </div>
          )}

          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.99]"
          >
            Lanjutkan Sidang Rakyat
          </button>
        </div>
      </div>
    </div>
  );
};
