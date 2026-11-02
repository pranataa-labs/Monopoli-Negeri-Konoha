import React, { useState } from "react";
import { GameSnapshot, NetworkConfig } from "../../types/game";
import { Landmark, Sparkles, Flame, Radio, Trophy, Wifi, QrCode, Copy, Check, Play, Dices, Users, X } from "lucide-react";
import { formatShortRupiah } from "./formatters";
import { PlayerToken } from "./PlayerToken";

interface LeftSidebarProps {
  snapshot: GameSnapshot | null;
  networkConfig: NetworkConfig | null;
  isOpen: boolean;
  onToggle: () => void;
  onStartGame: () => void;
}

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const dotPositions: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const activeDots = dotPositions[value] || [4];

  return (
    <div className="w-12 h-12 bg-gradient-to-br from-[#F2F2F2] via-slate-200 to-slate-300 rounded-xl shadow-lg border-2 border-[#D4AF37]/50 p-1.5 grid grid-cols-3 grid-rows-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && (
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B0B0D] shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  snapshot,
  networkConfig,
  isOpen,
  onToggle,
  onStartGame,
}) => {
  const [activeTab, setActiveTab] = useState<"game" | "phone" | "logs">("game");
  const [copied, setCopied] = useState(false);

  const activePlayer = snapshot?.players.find((p) => p.id === snapshot?.activePlayerId);
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
    <>
      {/* 1. SLIM COLLAPSED LEFT NAVBAR (Always visible on left edge) */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-[#0B0B0D] border-r border-[#D4AF37]/30 flex flex-col justify-between py-3 px-1 transition-all duration-300 shadow-2xl ${
          isOpen ? "w-80 sm:w-92" : "w-13"
        }`}
      >
        {/* Top Header / Toggle */}
        <div className="flex items-center justify-between px-2 pb-2 border-b border-[#D4AF37]/20">
          {isOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F5D76E] animate-pulse" />
                <span className="font-primary text-xs uppercase tracking-wider text-[#F2F2F2]">
                  KONSOL MEJA
                </span>
              </div>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/40 text-[#F5D76E] flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Menu"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onToggle}
              className="w-9 h-9 mx-auto rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/40 text-[#F5D76E] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-md"
              title="Buka Menu"
            >
              <Landmark size={18} />
            </button>
          )}
        </div>

        {/* Tab Navigation (When open: horizontal pills; when closed: vertical icon bar) */}
        {isOpen ? (
          <div className="flex items-center gap-1 px-1 my-2">
            <button
              onClick={() => setActiveTab("game")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-property text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "game"
                  ? "bg-[#D4AF37] text-[#0B0B0D] shadow-md"
                  : "bg-[#1C1C1F] text-slate-300 hover:text-white"
              }`}
            >
              <Dices size={13} />
              <span>Dadu & APBN</span>
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-property text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "phone"
                  ? "bg-[#D4AF37] text-[#0B0B0D] shadow-md"
                  : "bg-[#1C1C1F] text-slate-300 hover:text-white"
              }`}
            >
              <Users size={13} />
              <span>Pemain ({players.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`py-1.5 px-2.5 rounded-lg font-property text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "logs"
                  ? "bg-[#D4AF37] text-[#0B0B0D] shadow-md"
                  : "bg-[#1C1C1F] text-slate-300 hover:text-white"
              }`}
            >
              <Radio size={13} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 my-auto">
            <button
              onClick={() => {
                setActiveTab("game");
                onToggle();
              }}
              className="w-9 h-9 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/30 text-[#F5D76E] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              title="Brankas APBN & Arena Dadu"
            >
              <Dices size={17} />
            </button>
            <button
              onClick={() => {
                setActiveTab("phone");
                onToggle();
              }}
              className="w-9 h-9 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/30 text-[#F5D76E] flex items-center justify-center transition-all cursor-pointer hover:scale-105 relative"
              title="PIN, QR Ponsel & Papan Pemain"
            >
              <QrCode size={17} />
              {players.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-[#0B0B0D] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {players.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("logs");
                onToggle();
              }}
              className="w-9 h-9 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/30 text-[#F5D76E] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              title="Log Sidang"
            >
              <Radio size={16} />
            </button>
          </div>
        )}

        {/* Content Area (When Expanded) */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto px-1 space-y-3 my-1">
            {/* TAB 1: GAME CONTROLS (APBN & DADU) */}
            {activeTab === "game" && (
              <div className="space-y-3">
                {/* Status Ruangan & Tombol Mulai */}
                <div className="bg-[#1C1C1F] border border-[#D4AF37]/40 rounded-xl p-3 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-number text-xs font-extrabold text-[#F5D76E]">
                      PIN: <strong className="text-white">{snapshot?.roomId || "KONOHA-01"}</strong>
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ONLINE
                    </span>
                  </div>

                  {isLobby ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {players.length === 0
                          ? "Menunggu pemain bergabung via ponsel..."
                          : `${players.length} pemain siap bermain.`}
                      </p>
                      <button
                        onClick={onStartGame}
                        disabled={players.length === 0}
                        className={`w-full py-2 px-3 rounded-lg font-primary text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 ${
                          players.length > 0
                            ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white cursor-pointer active:scale-95"
                            : "bg-[#0B0B0D] text-slate-500 cursor-not-allowed border border-slate-800"
                        }`}
                      >
                        <Play size={13} className={players.length > 0 ? "fill-white" : ""} />
                        Mulai Permainan ({players.length})
                      </button>
                    </div>
                  ) : (
                    <div className="py-1.5 text-center bg-[#0B0B0D] rounded-lg border border-[#D4AF37]/30 mt-2">
                      <span className="font-primary text-[11px] text-[#F5D76E] tracking-wider uppercase block">
                        PERMAINAN BERLANGSUNG
                      </span>
                    </div>
                  )}
                </div>

                {/* Brankas Kas Negara (APBN Pool) */}
                <div className="bg-[#1C1C1F] border border-[#D4AF37]/40 rounded-xl p-3 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-primary text-[11px] text-[#F5D76E] uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark size={14} /> BRANKAS APBN
                    </span>
                    <span className="text-[8.5px] font-number font-extrabold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/30">
                      KAS NEGARA
                    </span>
                  </div>

                  <div className="py-2 px-2.5 bg-[#0B0B0D] rounded-lg border border-[#D4AF37]/30 text-center my-1 shadow-inner">
                    <span className="font-number text-2xl font-extrabold text-[#F5D76E] tracking-tight block">
                      {formatShortRupiah(snapshot?.kasNegaraPool || 1000000)}
                    </span>
                    <span className="font-property text-[9px] text-slate-400 uppercase tracking-wider block mt-0.5">
                      Total Dana Stimulus
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 mt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Sparkles size={11} className="text-[#F5D76E]" />
                      Potongan 10% START
                    </span>
                    <span className="font-number font-extrabold text-[#F5D76E]">
                      Cair di Petak #20
                    </span>
                  </div>
                </div>

                {/* Arena Lemparan Dadu */}
                <div className="bg-[#1C1C1F] border border-[#D4AF37]/40 rounded-xl p-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                    <span className="font-primary text-[11px] text-[#F5D76E] uppercase tracking-wider">
                      ARENA DADU
                    </span>
                    {snapshot?.lastRollResult?.isDouble && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                        <Flame size={12} /> DOUBLE!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-3 my-2">
                    <DiceFace value={snapshot?.dice[0] || 1} />
                    <DiceFace value={snapshot?.dice[1] || 1} />
                  </div>

                  {snapshot?.lastRollResult && (
                    <p className="font-number text-xs text-center text-slate-300">
                      Hasil: <strong className="text-[#F5D76E] text-sm">{snapshot.lastRollResult.sum}</strong>
                    </p>
                  )}

                  {/* Giliran Pemain Aktif */}
                  {activePlayer ? (
                    <div className="mt-2 p-2 rounded-lg bg-[#0B0B0D] border border-[#D4AF37]/30 flex items-center gap-2">
                      <PlayerToken player={activePlayer} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="font-primary text-xs text-[#F2F2F2] truncate">{activePlayer.name}</p>
                        <p className="font-property text-[10px] text-[#F5D76E] truncate">
                          {snapshot?.hasRolled ? "Menunggu selesai giliran" : "Giliran Melempar Dadu"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* TAB 2: PONSEL & PAPAN PEMAIN */}
            {activeTab === "phone" && (
              <div className="space-y-3">
                {/* QR Code Stand */}
                <div className="bg-[#1C1C1F] border border-[#D4AF37]/40 rounded-xl p-3 shadow-md flex flex-col items-center text-center">
                  <div className="w-full flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                    <span className="font-primary text-[11px] text-[#F5D76E] uppercase tracking-wider flex items-center gap-1.5">
                      <Wifi size={13} className="text-sky-400" /> MAIN VIA PONSEL
                    </span>
                    <span className="font-mono text-[9px] text-slate-400">Wi-Fi Lokal</span>
                  </div>

                  {networkConfig?.qrCodeDataUrl ? (
                    <img
                      src={networkConfig.qrCodeDataUrl}
                      alt="QR Code"
                      className="w-24 h-24 rounded-lg border-2 border-[#D4AF37]/50 bg-white p-1 shadow-md my-1"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg border border-slate-700 bg-[#0B0B0D] flex items-center justify-center my-1">
                      <QrCode size={36} className="text-slate-500" />
                    </div>
                  )}

                  <button
                    onClick={handleCopyUrl}
                    className="w-full py-1.5 px-2 bg-[#0B0B0D] hover:bg-black border border-[#D4AF37]/40 rounded-lg font-mono text-[10px] text-[#F5D76E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                    title="Klik untuk salin alamat"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span className="truncate">
                      {networkConfig?.joinUrl?.replace(/^https?:\/\//, "") || "Salin Tautan"}
                    </span>
                  </button>

                  <a
                    href="/play"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-2 bg-[#1C1C1F] hover:bg-[#0B0B0D] border border-[#D4AF37]/30 rounded-lg font-property text-[10px] text-[#F2F2F2] flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
                    title="Buka Kontroler HP di tab baru"
                  >
                    <span>Simulasi Kontroler HP (Tab Baru)</span>
                  </a>
                </div>

                {/* Papan Peringkat Pemain */}
                <div className="bg-[#1C1C1F] border border-[#D4AF37]/40 rounded-xl p-3 shadow-md space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-primary text-[11px] text-[#F5D76E] uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy size={13} /> PAPAN PEMAIN
                    </span>
                    <span className="font-number text-[10px] font-extrabold text-slate-400">
                      {players.length} Pemain
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {rankedPlayers.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#0B0B0D] border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-primary text-xs w-4 text-[#F5D76E]">#{idx + 1}</span>
                          <PlayerToken player={p} size="sm" />
                          <div className="min-w-0">
                            <span className="font-primary text-[11px] text-white truncate block">{p.name}</span>
                            <span className="font-number text-[9px] text-slate-400">
                              {p.properties.length} properti
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-number">
                          <span className="font-extrabold text-[#F5D76E] text-xs block">
                            {formatShortRupiah(p.cash)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LOG SIDANG */}
            {activeTab === "logs" && (
              <div className="bg-[#1C1C1F] border border-[#D4AF37]/40 rounded-xl p-3 shadow-md space-y-2">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[8px] font-black uppercase">
                    <Radio size={9} />
                    <span>LIVE</span>
                  </div>
                  <span className="font-primary text-[10px] text-[#F5D76E] uppercase tracking-wider">
                    LOG AKTIVITAS PERMAINAN
                  </span>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-80 pr-1 text-xs">
                  {snapshot?.logs && snapshot.logs.length > 0 ? (
                    snapshot.logs.slice(0, 10).map((log) => (
                      <div key={log.id} className="text-[11px] text-slate-300 leading-snug flex items-start gap-1.5">
                        <span className="text-[9px] font-mono text-slate-500 shrink-0 mt-0.5">[{log.time}]</span>
                        <span className="font-sans line-clamp-2">{log.text}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">Belum ada aktivitas tercatat.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Expand Toggle Button */}
        <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-center">
          <button
            onClick={onToggle}
            className="w-full py-1.5 px-2 rounded-lg bg-[#1C1C1F] hover:bg-black border border-[#D4AF37]/40 text-[#F5D76E] text-xs font-primary uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {isOpen ? <X size={14} /> : <Landmark size={14} />}
            {isOpen && <span>Tutup Konsol</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop overlay when expanded on small/medium screens */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
        />
      )}
    </>
  );
};
