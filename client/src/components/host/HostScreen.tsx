import React, { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { BoardGrid } from "./BoardGrid";
import { LeftSidebar } from "./LeftSidebar";
import { BreakingNews } from "./BreakingNews";
import { NetworkConfig } from "../../types/game";
import { formatShortRupiah } from "./formatters";
import { ShieldAlert, Wifi, Crown, Landmark, Dices, ChevronRight } from "lucide-react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="h-screen w-screen bg-[#0B0B0D] text-[#F2F2F2] flex flex-col justify-between overflow-hidden select-none relative font-sans">
      {/* 1. TOP BAR - Luxury Dark & Gold Header */}
      <header className="w-full flex items-center justify-between py-2 px-4 sm:px-6 bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[#D4AF37]/30 shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Quick Toggle for Left Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/40 text-[#F5D76E] transition-all cursor-pointer shadow-sm group"
            title={isSidebarOpen ? "Tutup Konsol Samping" : "Buka Konsol Samping"}
          >
            <Crown size={15} className="text-[#F5D76E] group-hover:scale-110 transition-transform" />
            <span className="font-primary text-xs tracking-wider uppercase text-[#F2F2F2]">
              MONOPOLY
            </span>
            <ChevronRight size={13} className={`text-[#D4AF37] transition-transform duration-200 ${isSidebarOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Quick Info Badges */}
          <div className="hidden lg:flex items-center gap-2 ml-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/30 text-[#F5D76E] font-number text-[11px] font-extrabold transition-colors cursor-pointer"
              title="Buka Brankas APBN"
            >
              <Landmark size={12} />
              <span>APBN: {formatShortRupiah(snapshot?.kasNegaraPool || 1000000)}</span>
            </button>

            {snapshot?.lastRollResult && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/30 text-[#F2F2F2] font-number text-[11px] font-extrabold transition-colors cursor-pointer"
                title="Buka Arena Dadu"
              >
                <Dices size={12} className="text-[#F5D76E]" />
                <span>Dadu: {snapshot.dice[0]} + {snapshot.dice[1]} = {snapshot.lastRollResult.sum}</span>
              </button>
            )}
          </div>
        </div>

        {/* Players Pill List in Center */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-xl mx-2">
          {snapshot?.players && snapshot.players.length > 0 ? (
            snapshot.players.map((p) => {
              const isTurn = snapshot.activePlayerId === p.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                    isTurn
                      ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#F5D76E] font-bold shadow-md shadow-[#D4AF37]/20"
                      : "bg-[#1C1C1F] border-slate-800 text-slate-300"
                  }`}
                >
                  <PlayerToken player={p} size="sm" />
                  <span className="font-property uppercase tracking-wide truncate max-w-[85px]">{p.name}</span>
                  <span className="font-number text-[11px] font-extrabold text-[#F5D76E]">
                    {formatShortRupiah(p.cash)}
                  </span>
                  {p.inJail && (
                    <span title="Di Sel Penjara">
                      <ShieldAlert size={12} className="text-red-400 shrink-0" />
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <span className="font-property text-[11px] text-slate-400 italic">
              Menunggu pemain bergabung via ponsel...
            </span>
          )}
        </div>

        {/* Right Header: PIN & Connectivity Status */}
        <div className="flex items-center gap-2 font-number text-xs">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/40 text-[#F5D76E] text-[11px] font-extrabold transition-colors cursor-pointer"
            title="Buka QR & PIN Ponsel"
          >
            <span>PIN: {snapshot?.roomId || "KONOHA-01"}</span>
          </button>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#1C1C1F] border border-slate-800 text-slate-300">
            <Wifi size={13} className={isConnected ? "text-emerald-400" : "text-red-400"} />
            <span className="text-[10px] font-bold hidden sm:inline">{isConnected ? "ONLINE" : "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN STAGE: Single Left Navbar + Centered Maximized Board */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-3 relative overflow-hidden pl-14">
        {/* Left Sidebar (Only navigation sidebar in the app) */}
        <LeftSidebar
          snapshot={snapshot}
          networkConfig={networkConfig}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onStartGame={startGame}
        />

        {/* Monopoly Board Arena (Maximized Aspect-Square) */}
        <div className="flex items-center justify-center h-full">
          <BoardGrid
            snapshot={snapshot}
            networkConfig={networkConfig}
            onStartGame={startGame}
          />
        </div>
      </main>

      {/* Breaking News Popup Card Overlay */}
      <BreakingNews cardEvent={activeCard} onDismiss={dismissCard} />
    </div>
  );
};