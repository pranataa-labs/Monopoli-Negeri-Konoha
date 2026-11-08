import React, { useState, useEffect } from "react";
import { useSocket } from "../../hooks/useSocket";
import { BoardGrid } from "./BoardGrid";
import { LeftSidebar } from "./LeftSidebar";
import { BreakingNews } from "./BreakingNews";
import { NetworkConfig } from "../../types/game";
import { formatShortRupiah } from "./formatters";
import { ShieldAlert, Wifi, Landmark, Dices, ChevronRight, Menu, Sun, Moon, Maximize, Minimize, Copy, Check, Users } from "lucide-react";
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
  const [copiedPin, setCopiedPin] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Theme State: 'light' default
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("konoha_theme");
      if (saved === "light" || saved === "dark") return saved;
      return "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("konoha_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleCopyPin = () => {
    const roomId = snapshot?.roomId || "KONOHA-01";
    navigator.clipboard.writeText(roomId);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  useEffect(() => {
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
    <div className="h-screen w-screen fantasy-bg text-[#0F172A] flex flex-col justify-between select-none relative font-property overflow-hidden">
      {/* 1. TOP MENU BAR - Vibrant Neo-Brutalist Pop Navigation */}
      <header className="w-full flex items-center justify-between py-2.5 px-3 sm:px-6 bg-white border-b-[2.5px] border-[#1E293B] shadow-[0_4px_0px_#1E293B] shrink-0 z-30">
        
        {/* Left Section: Brand Emblem + Sidebar Toggle + Quick Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Game Brand Emblem */}
          <div className="flex items-center gap-2.5 pr-2.5 border-r-[2px] border-[#1E293B]">
            <div className="w-8 h-8 rounded-[6px] bg-[#FF6B6B] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] flex items-center justify-center text-white font-primary font-black text-sm">
              ★
            </div>
            <div className="hidden xl:flex flex-col leading-none">
              <span className="font-primary text-sm font-black tracking-wide text-[#0F172A]">
                MONOPOLI KONOHA
              </span>
              <span className="font-property text-[8.5px] font-bold text-[#475569] uppercase tracking-wider mt-0.5">
                Vibrant Neo-Brutalist Pop
              </span>
            </div>
          </div>

          {/* Quick Toggle for Left Sidebar Console */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border-[2.5px] border-[#1E293B] text-xs font-primary font-black uppercase tracking-wider transition-all cursor-pointer ${
              isSidebarOpen
                ? "bg-[#FF6B6B] text-white shadow-[1px_1px_0px_#1E293B] translate-x-[2px] translate-y-[2px]"
                : "bg-white text-[#0F172A] shadow-[3px_3px_0px_#1E293B] hover:translate-x-[-1px] hover:translate-y-[-1px]"
            }`}
            title={isSidebarOpen ? "Tutup Konsol Permainan" : "Buka Konsol Permainan"}
          >
            <Menu size={14} className={isSidebarOpen ? "text-white" : "text-[#FF6B6B]"} />
            <span className="hidden sm:inline">KONSOL</span>
            {snapshot?.players && snapshot.players.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-[4px] text-[9.5px] font-number font-black bg-[#E0F2FE] text-[#0F172A] border-[1.5px] border-[#1E293B]">
                {snapshot.players.length}
              </span>
            )}
            <ChevronRight size={13} className={`transition-transform duration-200 ${isSidebarOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Quick Info Badges: APBN Pool & Last Dice */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#FEF9C3] border-[2px] border-[#1E293B] text-[#0F172A] font-number text-[11px] font-bold shadow-[2px_2px_0px_#1E293B] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
              title="Buka Brankas APBN"
            >
              <Landmark size={13} className="text-[#D97706]" />
              <span>APBN: {formatShortRupiah(snapshot?.kasNegaraPool || 1000000)}</span>
            </button>

            {snapshot?.lastRollResult && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#E0F2FE] border-[2px] border-[#1E293B] text-[#0F172A] font-number text-[11px] font-bold shadow-[2px_2px_0px_#1E293B] cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                title="Buka Arena Dadu"
              >
                <Dices size={13} className="text-[#FF6B6B]" />
                <span>Dadu: {snapshot.dice[0]} + {snapshot.dice[1]} = {snapshot.lastRollResult.sum}</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Section: Companions / Players List */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-xl mx-2 py-0.5">
          {snapshot?.players && snapshot.players.length > 0 ? (
            snapshot.players.map((p) => {
              const isTurn = snapshot.activePlayerId === p.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-[8px] border-[2px] border-[#1E293B] text-xs transition-all ${
                    isTurn
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#1E293B] scale-105 z-10 font-black"
                      : "bg-white shadow-[2px_2px_0px_#1E293B] font-bold"
                  }`}
                >
                  <PlayerToken player={p} size="sm" />
                  <span className="font-property uppercase tracking-wide truncate max-w-[85px] text-[#0F172A]">{p.name}</span>
                  <span className="font-number text-[11px] font-black text-[#0F172A] bg-[#F1F5F9] px-1.5 py-0.2 rounded-[4px] border-[1.5px] border-[#1E293B]">
                    {formatShortRupiah(p.cash)}
                  </span>
                  {p.inJail && (
                    <span title="Di Sel Rutan KPK">
                      <ShieldAlert size={13} className="text-[#F43F5E] shrink-0" />
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center gap-2 text-[#475569] text-[11px] font-property font-semibold bg-[#F8FAFC] px-3 py-1 rounded-[6px] border-[1.5px] border-[#1E293B]">
              <Users size={14} className="text-[#FF6B6B]" />
              <span>Menunggu pemain bergabung via ponsel...</span>
            </div>
          )}
        </div>

        {/* Right Section: Room PIN + Theme Switcher + Fullscreen + Online Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Room PIN with One-Click Copy */}
          <button
            onClick={handleCopyPin}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] text-xs font-number font-black shadow-[2px_2px_0px_#1E293B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
            title="Klik untuk menyalin PIN Ruangan"
          >
            {copiedPin ? <Check size={13} className="text-[#10B981]" /> : <Copy size={13} className="text-[#FF6B6B]" />}
            <span>PIN: {snapshot?.roomId || "KONOHA-01"}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-[6px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-[2px_2px_0px_#1E293B]"
            title={theme === "dark" ? "Ganti ke Mode Terang (Light Mode)" : "Ganti ke Mode Gelap (Dark Mode)"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun size={15} className="text-[#F59E0B]" />
            ) : (
              <Moon size={15} className="text-[#FF6B6B]" />
            )}
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-[6px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] hidden sm:flex items-center justify-center hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-[2px_2px_0px_#1E293B]"
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh (Fullscreen)"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>

          {/* Connectivity Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] shadow-[2px_2px_0px_#1E293B]">
            <Wifi size={13} className={isConnected ? "text-[#10B981]" : "text-[#F43F5E]"} />
            <span className="text-[10px] font-black hidden md:inline">{isConnected ? "ONLINE" : "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN STAGE: Enlarged Scrollable Board Canvas */}
      <main className="flex-1 w-full overflow-auto p-4 sm:p-8 flex items-start justify-center relative pl-16">
        {/* Left Sidebar */}
        <LeftSidebar
          snapshot={snapshot}
          networkConfig={networkConfig}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onStartGame={startGame}
        />

        {/* Enlarged Monopoly Board Arena */}
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
