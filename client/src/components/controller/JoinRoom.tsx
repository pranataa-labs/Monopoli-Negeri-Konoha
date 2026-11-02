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
        return <Car size={18} />;
      case "Accessibility":
        return <Accessibility size={18} />;
      case "Truck":
        return <Truck size={18} />;
      case "Bike":
        return <Bike size={18} />;
      case "Briefcase":
        return <Briefcase size={18} />;
      case "ShieldAlert":
        return <ShieldAlert size={18} />;
      default:
        return <User size={18} />;
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto p-3.5 sm:p-4 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden select-none box-border">
      {/* Decorative Gold Header Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/15 blur-2xl pointer-events-none rounded-full" />

      <div className="text-center mb-3.5 relative z-10">
        <span className="text-[9px] font-mono font-black tracking-widest uppercase bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1 shadow-sm">
          <Sparkles size={10} className="text-amber-400" /> KONTROLER PONSEL • KONOHA
        </span>
        <h2 className="text-lg sm:text-xl font-black text-white mt-1 tracking-tight uppercase font-display">
          Masuk Sidang Paripurna
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Pilih nama konglomerat dan pion satir favorit Anda.
        </p>
      </div>

      {error && (
        <div className="mb-3 p-2.5 bg-red-950/90 border border-red-500/60 rounded-xl text-xs text-red-200 shadow-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
            Nama Konglomerat / Alias
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Haji Juragan CPO"
            maxLength={20}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-medium text-xs transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Pilih Pion Sindiran
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
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all relative cursor-pointer min-w-0 overflow-hidden ${
                    isTaken
                      ? "opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed"
                      : isSelected
                      ? "border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/80 shadow-md shadow-amber-500/20 scale-[1.01]"
                      : "border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 w-full">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0"
                      style={{ backgroundColor: token.color }}
                    >
                      {renderTokenIcon(token.icon)}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[7.5px] font-black uppercase px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                        {token.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 w-full">
                    <span className="text-[11px] font-black text-white block leading-tight truncate">
                      {token.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate mt-0.5 leading-none">
                      {token.slogan}
                    </span>
                  </div>

                  {isTaken && (
                    <span className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center text-[9px] font-black text-red-400 uppercase tracking-wider">
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
          className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer mt-2"
        >
          Masuk Meja Sidang
        </button>
      </form>
    </div>
  );
};
