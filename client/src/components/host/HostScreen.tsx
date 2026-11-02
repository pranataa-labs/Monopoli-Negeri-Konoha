import React, { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { BoardGrid } from "./BoardGrid";
import { LeftConsole } from "./LeftConsole";
import { RightConsole } from "./RightConsole";
import { BreakingNews } from "./BreakingNews";
import { NetworkConfig } from "../../types/game";
import { formatShortRupiah } from "./formatters";
import { ShieldAlert, Wifi, Crown, Landmark, QrCode, ChevronLeft, ChevronRight, X, Dices } from "lucide-react";
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
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

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
    <div className="h-screen w-screen bg-[#050508] text-slate-100 flex flex-col justify-between overflow-hidden select-none relative">
      {/* Top Bar - Clean, Sleek & Integrated */}
      <header className="w-full flex items-center justify-between py-2 px-4 sm:px-6 bg-black/85 backdrop-blur-md border-b border-[#d4af37]/20 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Crown size={18} className="text-amber-400" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs sm:text-sm tracking-widest text-white uppercase font-display">
              MONOPOLI INDONESIA
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 hidden sm:inline">
              MEJA UTAMA
            </span>
          </div>

          {/* Quick Info Badges */}
          <div className="hidden lg:flex items-center gap-2 ml-3">
            <button
              onClick={() => setIsLeftOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold transition-colors cursor-pointer"
              title="Buka Brankas APBN"
            >
              <Landmark size={12} />
              <span>APBN: {formatShortRupiah(snapshot?.kasNegaraPool || 1000000)}</span>
            </button>

            {snapshot?.lastRollResult && (
              <button
                onClick={() => setIsLeftOpen(true)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-[11px] font-bold transition-colors cursor-pointer"
                title="Buka Arena Dadu"
              >
                <Dices size={12} className="text-amber-400" />
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
                    <span title="Di Sel Penjara">
                      <ShieldAlert size={12} className="text-red-400 shrink-0" />
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-[11px] text-slate-500 italic">
              Menunggu pemain bergabung via ponsel...
            </span>
          )}
        </div>

        {/* Right Header Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button
            onClick={() => setIsRightOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[11px] font-bold transition-colors cursor-pointer"
            title="Buka PIN & QR Code"
          >
            <QrCode size={12} />
            <span>PIN: {snapshot?.roomId || "KONOHA-01"}</span>
          </button>

          <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/60 border border-slate-800">
            <Wifi size={13} className={isConnected ? "text-emerald-400" : "text-red-400"} />
            <span className="text-[11px] hidden sm:inline">{isConnected ? "ONLINE" : "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* Main Board Arena: Centered, Expansive & Clean */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-3 relative overflow-hidden">
        {/* Left Side Navbar Toggle Strip */}
        <button
          onClick={() => setIsLeftOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-20 bg-black/85 hover:bg-black text-amber-300 border-r-2 border-y-2 border-amber-400/50 hover:border-amber-400 py-3.5 px-2 rounded-r-xl shadow-2xl flex flex-col items-center gap-2 transition-all cursor-pointer group hover:pl-3"
          title="Buka Brankas APBN & Arena Dadu"
        >
          <Landmark size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-mono tracking-widest font-bold uppercase text-slate-300 group-hover:text-amber-300">
            BRANKAS & DADU
          </span>
          <ChevronRight size={14} className="text-amber-400" />
        </button>

        {/* Center: Monopoli Board Grid (Takes Max Screen Height) */}
        <div className="flex items-center justify-center h-full">
          <BoardGrid
            snapshot={snapshot}
            networkConfig={networkConfig}
            onStartGame={startGame}
          />
        </div>

        {/* Right Side Navbar Toggle Strip */}
        <button
          onClick={() => setIsRightOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-20 bg-black/85 hover:bg-black text-amber-300 border-l-2 border-y-2 border-amber-400/50 hover:border-amber-400 py-3.5 px-2 rounded-l-xl shadow-2xl flex flex-col items-center gap-2 transition-all cursor-pointer group hover:pr-3"
          title="Buka PIN, QR Ponsel & Papan Pemain"
        >
          <ChevronLeft size={14} className="text-amber-400" />
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-mono tracking-widest font-bold uppercase text-slate-300 group-hover:text-amber-300">
            PIN & PEMAIN
          </span>
          <QrCode size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
        </button>
      </main>

      {/* ========================================================= */}
      {/* SLIDE-IN SIDE DRAWER: LEFT CONSOLE (Brankas APBN & Dadu) */}
      {/* ========================================================= */}
      {isLeftOpen && (
        <div
          onClick={() => setIsLeftOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-fade-in"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-84 sm:w-92 bg-[#07070a]/95 backdrop-blur-md border-r-2 border-amber-400/50 p-4 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isLeftOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-display flex items-center gap-2">
            <Landmark size={15} /> BRANKAS & DADU
          </span>
          <button
            onClick={() => setIsLeftOpen(false)}
            className="w-7 h-7 rounded-lg bg-black hover:bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <X size={15} />
          </button>
        </div>
        <LeftConsole snapshot={snapshot} />
      </div>

      {/* ========================================================= */}
      {/* SLIDE-IN SIDE DRAWER: RIGHT CONSOLE (PIN, QR Code, Pemain) */}
      {/* ========================================================= */}
      {isRightOpen && (
        <div
          onClick={() => setIsRightOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-fade-in"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-84 sm:w-92 bg-[#07070a]/95 backdrop-blur-md border-l-2 border-amber-400/50 p-4 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isRightOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-display flex items-center gap-2">
            <QrCode size={15} /> PIN & PEMAIN
          </span>
          <button
            onClick={() => setIsRightOpen(false)}
            className="w-7 h-7 rounded-lg bg-black hover:bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup Menu"
          >
            <X size={15} />
          </button>
        </div>
        <RightConsole
          snapshot={snapshot}
          networkConfig={networkConfig}
          onStartGame={startGame}
        />
      </div>

      {/* Breaking News Popup Card Overlay */}
      <BreakingNews cardEvent={activeCard} onDismiss={dismissCard} />
    </div>
  );
};
