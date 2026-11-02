import React, { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { BoardGrid } from "./BoardGrid";
import { BreakingNews } from "./BreakingNews";
import { NetworkConfig } from "../../types/game";
import { formatShortRupiah } from "./TileCell";
import { ShieldAlert, Wifi } from "lucide-react";
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-x-hidden">
      {/* Top Bar */}
      <header className="w-full max-w-[1400px] flex items-center justify-between py-2 px-4 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-black text-sm tracking-wide text-white uppercase">
            HOST SCREEN • MONITOR UTAMA
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Tampilkan di TV / Monitor Ruang Tamu
          </span>
        </div>

        {/* Players Pill List */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-xl">
          {snapshot?.players.map((p) => {
            const isTurn = snapshot.activePlayerId === p.id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                  isTurn
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md"
                    : "bg-slate-950 border-slate-800 text-slate-300"
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
          })}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Wifi size={14} className={isConnected ? "text-emerald-400" : "text-red-400"} />
          <span className="hidden sm:inline">{isConnected ? "Terhubung" : "Terputus"}</span>
        </div>
      </header>

      {/* Main 15x15 Board Grid */}
      <main className="w-full flex items-center justify-center flex-1 my-auto">
        <BoardGrid
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
