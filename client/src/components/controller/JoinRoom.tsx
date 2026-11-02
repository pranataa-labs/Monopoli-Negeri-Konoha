import React, { useState } from "react";
import { SATIRICAL_TOKENS } from "../../constants/tokens";
import { SatiricalToken, GameSnapshot } from "../../types/game";
import { Car, Accessibility, Truck, Bike, Briefcase, ShieldAlert, User } from "lucide-react";

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
        navigator.vibrate(20);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin(name.trim(), selectedTokenId);
    if ("vibrate" in navigator) {
      navigator.vibrate(40);
    }
  };

  const renderTokenIcon = (iconName: string) => {
    switch (iconName) {
      case "Car":
        return <Car size={24} />;
      case "Accessibility":
        return <Accessibility size={24} />;
      case "Truck":
        return <Truck size={24} />;
      case "Bike":
        return <Bike size={24} />;
      case "Briefcase":
        return <Briefcase size={24} />;
      case "ShieldAlert":
        return <ShieldAlert size={24} />;
      default:
        return <User size={24} />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
          KONTROLER PONSEL
        </span>
        <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
          Masuk Sidang Konoha
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pilih nama alias konglomerat dan pion sindiran khas republik.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Nama Konglomerat / Alias
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Haji Juragan CPO / Koh SCBD"
            maxLength={24}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium text-sm transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Pilih Pion Sindiran
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {SATIRICAL_TOKENS.map((token) => {
              const isTaken = takenTokenIds.includes(token.id);
              const isSelected = selectedTokenId === token.id;

              return (
                <button
                  type="button"
                  key={token.id}
                  disabled={isTaken}
                  onClick={() => handleSelectToken(token)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                    isTaken
                      ? "opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed"
                      : isSelected
                      ? "border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: token.color }}
                    >
                      {renderTokenIcon(token.icon)}
                    </div>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {token.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {token.name}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {token.slogan}
                    </span>
                  </div>

                  {isTaken && (
                    <span className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-[10px] font-bold text-red-400 uppercase">
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
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
        >
          Masuk Meja Sidang
        </button>
      </form>
    </div>
  );
};
