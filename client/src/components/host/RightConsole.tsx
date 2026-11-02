import React, { useState } from "react";
import { GameSnapshot, NetworkConfig } from "../../types/game";
import { Trophy, Wifi, QrCode, Copy, Check, Play, Car, Accessibility, Truck, Bike, Briefcase, ShieldAlert } from "lucide-react";
import { formatShortRupiah } from "./formatters";
import { PlayerToken } from "./PlayerToken";

interface RightConsoleProps {
  snapshot: GameSnapshot | null;
  networkConfig: NetworkConfig | null;
  onStartGame: () => void;
}

export const RightConsole: React.FC<RightConsoleProps> = ({
  snapshot,
  networkConfig,
  onStartGame,
}) => {
  const [copied, setCopied] = useState(false);

  const players = snapshot?.players || [];
  const rankedPlayers = [...players].sort((a, b) => b.cash - a.cash);
  const isLobby = snapshot?.status === "LOBBY";

  const handleCopyUrl = () => {
    const url = networkConfig?.joinUrl || `http://${window.location.hostname}:3001/play`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-72 sm:w-80 flex flex-col gap-3.5 select-none shrink-0">
      {/* 1. STATUS RUANGAN & MULAI PERMAINAN */}
      <div className="bg-gradient-to-br from-black/90 via-slate-950 to-black/95 border border-[#d4af37]/40 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-amber-300">
              PIN: <strong className="text-white text-sm">{snapshot?.roomId || "KONOHA-01"}</strong>
            </span>
          </div>

          <span className="flex items-center gap-1 text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
            ONLINE
          </span>
        </div>

        {isLobby ? (
          <div className="space-y-2 mt-1">
            <p className="text-[11px] text-slate-400 leading-snug">
              {players.length === 0
                ? "Menunggu konglomerat bergabung via ponsel..."
                : `${players.length} pemain siap menggelar sidang paripurna.`}
            </p>
            <button
              onClick={onStartGame}
              disabled={players.length === 0}
              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1.5 ${
                players.length > 0
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white cursor-pointer active:scale-95 shadow-emerald-500/25 ring-2 ring-emerald-400/30"
                  : "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
              }`}
            >
              <Play size={14} className={players.length > 0 ? "fill-white" : ""} />
              Mulai Sidang ({players.length} Pemain)
            </button>
          </div>
        ) : (
          <div className="py-2 text-center bg-black/60 rounded-xl border border-amber-500/30">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-display block">
              SIDANG BERLANGSUNG
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              Giliran ke-{snapshot?.currentTurnIndex ? snapshot.currentTurnIndex + 1 : 1}
            </span>
          </div>
        )}
      </div>

      {/* 2. MAIN VIA PONSEL (QR CODE STAND) */}
      <div className="bg-gradient-to-br from-black/90 to-slate-950 border border-slate-800 rounded-2xl p-3.5 shadow-xl flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Wifi size={13} className="text-sky-400" /> Main via Ponsel
          </span>
          <span className="text-[10px] font-mono text-slate-400">Wi-Fi Lokal</span>
        </div>

        <div className="py-1 flex flex-col items-center gap-2 w-full">
          {networkConfig?.qrCodeDataUrl ? (
            <img
              src={networkConfig.qrCodeDataUrl}
              alt="QR Code"
              className="w-24 h-24 rounded-xl border-2 border-amber-400/50 bg-white p-1 shadow-lg hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center">
              <QrCode size={36} className="text-slate-500" />
            </div>
          )}

          <button
            onClick={handleCopyUrl}
            className="w-full py-1.5 px-2 bg-black hover:bg-slate-900 border border-amber-500/40 hover:border-amber-400 rounded-lg text-[10px] font-mono text-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Klik untuk salin alamat"
          >
            {copied ? <Check size={12} className="text-emerald-400 shrink-0" /> : <Copy size={12} className="shrink-0" />}
            <span className="truncate">
              {networkConfig?.joinUrl?.replace(/^https?:\/\//, "") || "Salin Tautan"}
            </span>
          </button>
        </div>

        <p className="text-[9.5px] text-slate-400 leading-tight mt-1">
          Buka browser di HP & scan QR untuk bergabung.
        </p>
      </div>

      {/* 3. PAPAN KONGLOMERAT & TAIPAN */}
      <div className="bg-black/80 border border-[#d4af37]/30 rounded-2xl p-3.5 shadow-xl flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
            <Trophy size={13} /> Papan Konglomerat
          </span>
          <span className="text-[9.5px] font-mono text-slate-400">
            {players.length} Pemain
          </span>
        </div>

        {players.length === 0 ? (
          /* Showcase Satirical Factions */
          <div className="grid grid-cols-2 gap-1.5 my-auto">
            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white border border-slate-700 shrink-0">
                <Car size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate leading-none">Rubicon</p>
                <p className="text-[8px] text-amber-400 font-mono leading-none mt-0.5">Oligarki</p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-sky-950 flex items-center justify-center text-sky-400 border border-sky-800 shrink-0">
                <Accessibility size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate leading-none">Kursi Roda</p>
                <p className="text-[8px] text-sky-400 font-mono leading-none mt-0.5">Koruptor</p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-amber-950 flex items-center justify-center text-amber-400 border border-amber-800 shrink-0">
                <Truck size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate leading-none">Truk ODOL</p>
                <p className="text-[8px] text-amber-400 font-mono leading-none mt-0.5">CPO King</p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-pink-950 flex items-center justify-center text-pink-400 border border-pink-800 shrink-0">
                <Bike size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate leading-none">Motor Matic</p>
                <p className="text-[8px] text-pink-400 font-mono leading-none mt-0.5">Warga Sipil</p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-slate-300 border border-slate-700 shrink-0">
                <Briefcase size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate leading-none">Koper Hitam</p>
                <p className="text-[8px] text-slate-400 font-mono leading-none mt-0.5">Orang Dalam</p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-orange-950 flex items-center justify-center text-orange-400 border border-orange-800 shrink-0">
                <ShieldAlert size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate leading-none">Rompi Oranye</p>
                <p className="text-[8px] text-orange-400 font-mono leading-none mt-0.5">Tahanan Elit</p>
              </div>
            </div>
          </div>
        ) : (
          /* Live Player Ranking */
          <div className="space-y-1.5 my-auto max-h-48 overflow-y-auto pr-1">
            {rankedPlayers.map((p, idx) => {
              const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-xs w-4">{medal}</span>
                    <PlayerToken player={p} size="sm" />
                    <div className="min-w-0">
                      <span className="font-bold text-white truncate block">{p.name}</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">
                        {p.token?.name} • {p.properties.length} aset
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-amber-300 block text-xs">
                      {formatShortRupiah(p.cash)}
                    </span>
                    {p.inJail && (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                        Rutan KPK
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
