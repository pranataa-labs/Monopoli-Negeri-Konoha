import React, { useEffect } from "react";
import { CardResolutionEvent } from "../../types/game";
import { AlertCircle, FileText, Landmark, X } from "lucide-react";
import { formatShortRupiah } from "./formatters";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-white rounded-[12px] border-[2.5px] border-[#1E293B] shadow-[6px_6px_0px_#1E293B] overflow-hidden font-property">
        {/* Header Banner */}
        <div
          className={`px-5 py-3 flex items-center justify-between border-b-[2.5px] border-[#1E293B] ${
            isGov ? "bg-[#EDE9FE]" : "bg-[#FEF3C7]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full border border-[#1E293B] shadow-[1px_1px_0px_#1E293B] animate-pulse ${
                isGov ? "bg-[#8B5CF6]" : "bg-[#F59E0B]"
              }`}
            />
            <span
              className={`font-primary font-black text-xs tracking-wider uppercase ${
                isGov ? "text-[#8B5CF6]" : "text-[#D97706]"
              }`}
            >
              {isGov ? "KEBIJAKAN DANA UMUM RESMI" : "EVENT KESEMPATAN SPESIAL"}
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-[6px] bg-white hover:bg-[#F8FAFC] border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 text-[#0F172A] space-y-4 bg-white">
          <div className="flex items-center gap-2">
            {isGov ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#EDE9FE] text-[#8B5CF6] text-xs font-black border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                <Landmark size={14} className="text-[#8B5CF6]" /> DANA UMUM
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#FEF3C7] text-[#D97706] text-xs font-black border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                <FileText size={14} className="text-[#D97706]" /> KESEMPATAN
              </span>
            )}

            <span className="text-xs font-number text-[#475569] ml-auto font-bold">
              Target: <strong className="text-[#0F172A] bg-[#E0F2FE] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] font-black">{player.name}</strong>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-primary font-black text-[#0F172A] tracking-tight uppercase leading-tight">
            {card.title}
          </h3>

          <div className="bg-[#FFFBEB] p-4 rounded-[8px] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
            <p className="font-property text-sm text-[#0F172A] leading-relaxed font-semibold">
              "{card.text}"
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-[8px] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] ${
                cashDelta > 0
                  ? "bg-[#D1FAE5]"
                  : cashDelta < 0
                  ? "bg-[#FEE2E2]"
                  : "bg-[#F8FAFC]"
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-wider text-[#475569] block mb-1">
                Dampak Saldo Pemain
              </span>
              <span
                className={`text-lg font-number font-black ${
                  cashDelta > 0
                    ? "text-[#10B981]"
                    : cashDelta < 0
                    ? "text-[#F43F5E]"
                    : "text-[#0F172A]"
                }`}
              >
                {cashDelta > 0 ? `+${formatShortRupiah(cashDelta)}` : cashDelta < 0 ? formatShortRupiah(cashDelta) : "Rp 0"}
              </span>
            </div>

            <div
              className={`p-3 rounded-[8px] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] ${
                poolDelta > 0
                  ? "bg-[#FEF9C3]"
                  : poolDelta < 0
                  ? "bg-[#FEE2E2]"
                  : "bg-[#F8FAFC]"
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-wider text-[#475569] block mb-1">
                Aliran Kas APBN
              </span>
              <span
                className={`text-lg font-number font-black ${
                  poolDelta > 0
                    ? "text-[#D97706]"
                    : poolDelta < 0
                    ? "text-[#F43F5E]"
                    : "text-[#0F172A]"
                }`}
              >
                {poolDelta > 0 ? `+${formatShortRupiah(poolDelta)}` : poolDelta < 0 ? formatShortRupiah(poolDelta) : "Rp 0"}
              </span>
            </div>
          </div>

          {description && (
            <div className="text-xs text-[#0F172A] flex items-center gap-2 bg-[#FEF9C3] p-2.5 rounded-[6px] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] font-bold">
              <AlertCircle size={15} className="text-[#D97706] shrink-0" />
              <span>{description}</span>
            </div>
          )}

          <button
            onClick={onDismiss}
            className="w-full py-3 px-4 rounded-[8px] bg-[#FF6B6B] hover:bg-[#FA5252] text-white border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] font-primary font-black uppercase text-xs tracking-wider cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Lanjutkan Permainan
          </button>
        </div>
      </div>
    </div>
  );
};
