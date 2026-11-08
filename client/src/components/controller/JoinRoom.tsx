import React, { useState } from "react";
import { SATIRICAL_TOKENS } from "../../constants/tokens";
import { SatiricalToken, GameSnapshot } from "../../types/game";
import { Car, Accessibility, Truck, Bike, Briefcase, ShieldAlert, User, Sparkles, CheckCircle2 } from "lucide-react";

interface JoinRoomProps {
  snapshot: GameSnapshot | null;
  onJoin: (name: string, tokenId: string) => void;
  error?: string | null;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({ snapshot, onJoin, error }) => {
  const [name, setName] = useState("");
  const [selectedTokenId, setSelectedTokenId] = useState<string>(SATIRICAL_TOKENS[0].id);

  const takenTokenIds = snapshot?.players.map((p) => p.token.id) || [];

  const handleSelectToken = (token: SatiricalToken) => {
    if (!takenTokenIds.includes(token.id)) {
      setSelectedTokenId(token.id);
      if ("vibrate" in navigator) {
        navigator.vibrate(25);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin(name.trim(), selectedTokenId);
    if ("vibrate" in navigator) {
      navigator.vibrate(45);
    }
  };

  const renderTokenIcon = (iconName: string) => {
    switch (iconName) {
      case "Car":
        return <Car size={16} />;
      case "Accessibility":
        return <Accessibility size={16} />;
      case "Truck":
        return <Truck size={16} />;
      case "Bike":
        return <Bike size={16} />;
      case "Briefcase":
        return <Briefcase size={16} />;
      case "ShieldAlert":
        return <ShieldAlert size={16} />;
      default:
        return <User size={16} />;
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto p-5 rounded-[12px] border-[2.5px] border-[#1E293B] shadow-[6px_6px_0px_#1E293B] bg-white relative overflow-hidden select-none box-border font-property">
      <div className="text-center mb-4">
        <span className="font-primary text-[10px] font-black tracking-wider uppercase bg-[#E0F2FE] text-[#0F172A] px-3 py-1 rounded-[6px] border-[1.5px] border-[#1E293B] inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#1E293B]">
          <Sparkles size={11} className="text-[#FF6B6B]" /> KONTROLER PEMAIN
        </span>
        <h2 className="text-xl font-primary font-black text-[#0F172A] mt-2 tracking-tight uppercase leading-tight">
          Masuk Permainan
        </h2>
        <p className="text-[11px] text-[#475569] mt-0.5 font-semibold">
          Pilih nama alias dan pion favorit Anda.
        </p>
      </div>

      {error && (
        <div className="mb-3.5 p-2.5 bg-[#FEE2E2] border-[2px] border-[#1E293B] rounded-[8px] text-xs text-[#F43F5E] font-bold shadow-[2px_2px_0px_#1E293B]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-primary font-black text-[#0F172A] uppercase tracking-wider mb-1">
            Nama Pemain / Alias
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Juragan Konoha"
            maxLength={20}
            className="w-full px-3 py-2.5 bg-white border-[2px] border-[#1E293B] rounded-[8px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] font-bold text-xs transition-all shadow-[2px_2px_0px_#1E293B]"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-primary font-black text-[#0F172A] uppercase tracking-wider mb-1.5">
            Pilih Pion Karakter
          </label>
          <div className="grid grid-cols-2 gap-2 w-full">
            {SATIRICAL_TOKENS.map((token) => {
              const isTaken = takenTokenIds.includes(token.id);
              const isSelected = selectedTokenId === token.id;

              return (
                <button
                  type="button"
                  key={token.id}
                  disabled={isTaken}
                  onClick={() => handleSelectToken(token)}
                  className={`p-2.5 rounded-[8px] text-left flex flex-col justify-between transition-all relative cursor-pointer min-w-0 overflow-hidden ${
                    isTaken
                      ? "opacity-40 border-[2px] border-[#94A3B8] bg-[#F1F5F9] cursor-not-allowed shadow-none"
                      : isSelected
                      ? "border-[2.5px] border-[#1E293B] bg-[#FEF08A] shadow-[3px_3px_0px_#1E293B] translate-x-[-1px] translate-y-[-1px]"
                      : "border-[2px] border-[#1E293B] bg-white shadow-[2px_2px_0px_#1E293B] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 w-full">
                    <div
                      className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white shadow-[1px_1px_0px_#1E293B] shrink-0 border-[1.5px] border-[#1E293B]"
                      style={{ backgroundColor: token.color }}
                    >
                      {renderTokenIcon(token.icon)}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[8px] font-primary font-black uppercase px-1.5 py-0.2 rounded-[4px] bg-white text-[#0F172A] border-[1px] border-[#1E293B]">
                        {token.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={13} className="text-[#0F172A] shrink-0 fill-[#10B981]" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 w-full">
                    <span className="text-[11px] font-primary font-black text-[#0F172A] block leading-tight truncate uppercase">
                      {token.name}
                    </span>
                    <span className="text-[9px] text-[#475569] font-property block truncate mt-0.5 leading-none font-bold">
                      {token.slogan}
                    </span>
                  </div>

                  {isTaken && (
                    <span className="absolute inset-0 bg-black/75 rounded-[8px] flex items-center justify-center text-[9px] font-black text-[#F43F5E] uppercase tracking-wider">
                      Sudah Dipilih
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-[8px] bg-[#FF6B6B] hover:bg-[#FA5252] text-white border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] font-primary font-black text-xs uppercase tracking-wider cursor-pointer mt-2 active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          Masuk Meja Permainan
        </button>
      </form>
    </div>
  );
};
