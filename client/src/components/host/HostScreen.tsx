import React, { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { BoardGrid } from "./BoardGrid";
import { LeftConsole } from "./LeftConsole";
import { RightConsole } from "./RightConsole";
import { BreakingNews } from "./BreakingNews";
import { NetworkConfig } from "../../types/game";
import { formatShortRupiah } from "./formatters";
import { ShieldAlert, Wifi, Crown } from "lucide-react";
import { PlayerToken } from "./PlayerToken";

export const HostScreen: React.FC = () => {
  const {
    snapshot,
    activeCard,
    startGame,
    dismissCard,
    isConnected,
  } = useSocket("KONOHA-01");

  const [networkConfig, setNetworkConfig] = useState<NetworkConfig | null>(null);

  useEffect(() => {
    // Fetch local network info from Express backend
    const serverUrl =
      window.location.port === "3001"
        ? window.location.origin
        : window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3001"
        : `http://${window.location.hostname}:3001`;

    fetch(`${serverUrl}/api/network`)
      .then((res) => res.json())
      .then((data) => setNetworkConfig(data))
      .catch(() => {
        // Fallback network config
        setNetworkConfig({
          localIp: window.location.hostname,
          port: 3001,
          clientPort: 5173,
          joinUrl: `http://${window.location.hostname}:5173/play`,
          qrCodeDataUrl: "",
        });
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050508] text-slate-100 flex flex-col justify-between overflow-x-auto select-none">
      {/* Top Bar - Clean & Minimal */}
      <header className="w-full flex items-center justify-between py-2 px-6 bg-black/80 backdrop-blur-md border-b border-[#d4af37]/20 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Crown size={18} className="text-amber-400" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm tracking-widest text-white uppercase font-display">
              MONOPOLI NEGERI KONOHA
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              MEJA UTAMA
            </span>
          </div>
        </div>

        {/* Players Pill List */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-xl">
          {snapshot?.players && snapshot.players.length > 0 ? (
            snapshot.players.map((p) => {
              const isTurn = snapshot.activePlayerId === p.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                    isTurn
                      ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md"
                      : "bg-black/60 border-slate-800 text-slate-300"
                  }`}
                >
                  <PlayerToken player={p} size="sm" />
                  <span className="truncate max-w-[80px]">{p.name}</span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    {formatShortRupiah(p.cash)}
                  </span>
                  {p.inJail && (
                    <span title="Di Rutan KPK">
                      <ShieldAlert size={12} className="text-red-400 shrink-0" />
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-[11px] text-slate-500 italic">
              Menunggu konglomerat bergabung via ponsel...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-800">
            <Wifi size={13} className={isConnected ? "text-emerald-400" : "text-red-400"} />
            <span className="text-[11px]">{isConnected ? "ONLINE" : "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* Main 3-Column Gaming Table */}
      <main className="flex-1 w-full flex items-start justify-center gap-6 p-4 sm:p-6 overflow-x-auto min-w-[1500px]">
        {/* Sisi Kiri: Brankas APBN + Arena Dadu + Log Sidang */}
        <LeftConsole snapshot={snapshot} />

        {/* Tengah: Papan Monopoli Mewah (11x11 dengan Hanya Kartu di Tengah) */}
        <BoardGrid
          snapshot={snapshot}
          networkConfig={networkConfig}
          onStartGame={startGame}
        />

        {/* Sisi Kanan: PIN Ruangan + QR Code Ponsel + Papan Konglomerat */}
        <RightConsole
          snapshot={snapshot}
          networkConfig={networkConfig}
          onStartGame={startGame}
        />
      </main>

      {/* Breaking News Popup Card Overlay */}
      <BreakingNews cardEvent={activeCard} onDismiss={dismissCard} />
    </div>
  );
};
