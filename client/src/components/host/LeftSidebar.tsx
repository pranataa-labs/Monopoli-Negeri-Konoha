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
    <div className="w-12 h-12 bg-white rounded-[8px] shadow-[4px_4px_0px_#1E293B] border-[2.5px] border-[#1E293B] p-1.5 grid grid-cols-3 grid-rows-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && (
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />
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
      {/* 1. SLIM COLLAPSED LEFT NAVBAR (Vibrant Neo-Brutalist Pop) */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-white border-r-[2.5px] border-[#1E293B] flex flex-col justify-between py-3 px-1.5 transition-all duration-300 shadow-[4px_0px_0px_#1E293B] ${
          isOpen ? "w-80 sm:w-92" : "w-14"
        }`}
      >
        {/* Top Header / Toggle */}
        <div className="flex items-center justify-between px-2 pb-2.5 border-b-[2px] border-[#1E293B]">
          {isOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border border-[#1E293B] shadow-[1px_1px_0px_#1E293B] animate-pulse" />
                <span className="font-primary text-xs uppercase tracking-wider text-[#0F172A] font-black">
                  KONSOL PERMAINAN
                </span>
              </div>
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-[6px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
                title="Tutup Menu"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onToggle}
              className="w-10 h-10 mx-auto rounded-[8px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
              title="Buka Menu"
            >
              <Landmark size={18} />
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        {isOpen ? (
          <div className="flex items-center gap-1.5 px-1 my-2">
            <button
              onClick={() => setActiveTab("game")}
              className={`flex-1 py-1.5 px-2 rounded-[6px] font-primary text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 border-[2px] border-[#1E293B] ${
                activeTab === "game"
                  ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#1E293B] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-[#0F172A] shadow-[2px_2px_0px_#1E293B]"
              }`}
            >
              <Dices size={13} />
              <span>Dadu & APBN</span>
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-1.5 px-2 rounded-[6px] font-primary text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 border-[2px] border-[#1E293B] ${
                activeTab === "phone"
                  ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#1E293B] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-[#0F172A] shadow-[2px_2px_0px_#1E293B]"
              }`}
            >
              <Users size={13} />
              <span>Pemain ({players.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`py-1.5 px-2.5 rounded-[6px] font-primary text-xs font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1 border-[2px] border-[#1E293B] ${
                activeTab === "logs"
                  ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#1E293B] translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-[#0F172A] shadow-[2px_2px_0px_#1E293B]"
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
              className="w-10 h-10 rounded-[8px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1E293B]"
              title="Brankas APBN & Arena Dadu"
            >
              <Dices size={17} />
            </button>
            <button
              onClick={() => {
                setActiveTab("phone");
                onToggle();
              }}
              className="w-10 h-10 rounded-[8px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1E293B] relative"
              title="PIN, QR Ponsel & Papan Pemain"
            >
              <QrCode size={17} />
              {players.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B6B] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                  {players.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("logs");
                onToggle();
              }}
              className="w-10 h-10 rounded-[8px] bg-white border-[2px] border-[#1E293B] text-[#0F172A] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#1E293B]"
              title="Log Aktivitas"
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
                <div className="rounded-[8px] p-3 bg-white border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                  <div className="flex items-center justify-between pb-2 border-b-[2px] border-[#1E293B]">
                    <span className="font-number text-xs font-bold text-[#475569]">
                      PIN: <strong className="text-[#0F172A] bg-[#E0F2FE] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] font-black">{snapshot?.roomId || "KONOHA-01"}</strong>
                    </span>
                    <span className="text-[9px] font-primary font-black px-2 py-0.5 rounded-[4px] bg-[#D1FAE5] text-[#10B981] border-[1.5px] border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                      ONLINE
                    </span>
                  </div>

                  {isLobby ? (
                    <div className="mt-2.5 space-y-2">
                      <p className="text-[11px] text-[#475569] leading-snug font-property font-semibold">
                        {players.length === 0
                          ? "Menunggu pemain bergabung via ponsel..."
                          : `${players.length} pemain siap bermain.`}
                      </p>
                      <button
                        onClick={onStartGame}
                        disabled={players.length === 0}
                        className={`w-full py-2.5 px-3 rounded-[8px] font-primary text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border-[2.5px] border-[#1E293B] ${
                          players.length > 0
                            ? "bg-[#FF6B6B] hover:bg-[#FA5252] text-white shadow-[4px_4px_0px_#1E293B] active:translate-x-[2px] active:translate-y-[2px]"
                            : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed shadow-none"
                        }`}
                      >
                        <Play size={13} className={players.length > 0 ? "fill-white" : ""} />
                        Mulai Permainan ({players.length})
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 text-center bg-[#E0F2FE] rounded-[6px] border-[2px] border-[#1E293B] mt-2">
                      <span className="font-primary text-[11px] text-[#0F172A] font-black tracking-wider uppercase block">
                        PERMAINAN BERJALAN
                      </span>
                    </div>
                  )}
                </div>

                {/* Brankas Kas Negara (APBN Pool) */}
                <div className="rounded-[8px] p-3.5 relative overflow-hidden bg-[#FEF9C3] border-[2.5px] border-[#1E293B] shadow-[4px_4px_0px_#1E293B] text-[#0F172A]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-primary text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 text-[#0F172A]">
                      <Landmark size={14} className="text-[#D97706]" /> BRANKAS APBN
                    </span>
                    <span className="text-[8.5px] font-number font-black px-2 py-0.5 rounded-[4px] bg-white border-[1.5px] border-[#1E293B] text-[#0F172A] shadow-[1px_1px_0px_#1E293B]">
                      KAS PUSAT
                    </span>
                  </div>

                  <div className="py-2.5 px-3 bg-white rounded-[6px] border-[2px] border-[#1E293B] text-center my-1.5 shadow-[2px_2px_0px_#1E293B]">
                    <span className="font-number text-2xl font-black text-[#0F172A] tracking-tight block">
                      {formatShortRupiah(snapshot?.kasNegaraPool || 1000000)}
                    </span>
                    <span className="font-property text-[9px] text-[#475569] uppercase tracking-wider block mt-0.5 font-bold">
                      Total Kas Akumulasi
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#475569] pt-1.5 border-t-[1.5px] border-[#1E293B] mt-1 font-property font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={11} className="text-[#D97706]" />
                      Potongan 10% START
                    </span>
                    <span className="font-number font-black text-[#0F172A]">
                      Cair di Petak #20
                    </span>
                  </div>
                </div>

                {/* Arena Lemparan Dadu */}
                <div className="rounded-[8px] p-3.5 bg-white border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                  <div className="flex items-center justify-between border-b-[2px] border-[#1E293B] pb-1.5 mb-2">
                    <span className="font-primary text-[11px] text-[#0F172A] font-black uppercase tracking-wider">
                      ARENA DADU
                    </span>
                    {snapshot?.lastRollResult?.isDouble && (
                      <span className="text-[10px] font-black text-[#D97706] flex items-center gap-1 bg-[#FEF9C3] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] animate-pulse">
                        <Flame size={12} className="text-[#D97706]" /> DOUBLE!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4 my-2.5">
                    <DiceFace value={snapshot?.dice[0] || 1} />
                    <DiceFace value={snapshot?.dice[1] || 1} />
                  </div>

                  {snapshot?.lastRollResult && (
                    <p className="font-number text-xs text-center text-[#475569] font-bold">
                      Hasil Lemparan: <strong className="text-[#0F172A] text-sm bg-[#E0F2FE] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] font-black">{snapshot.lastRollResult.sum}</strong>
                    </p>
                  )}

                  {/* Giliran Pemain Aktif */}
                  {activePlayer ? (
                    <div className="mt-2.5 p-2 rounded-[6px] bg-[#FEF08A] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] flex items-center gap-2.5">
                      <PlayerToken player={activePlayer} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="font-primary text-xs text-[#0F172A] font-black truncate">{activePlayer.name}</p>
                        <p className="font-property text-[10px] text-[#475569] font-bold truncate">
                          {snapshot?.hasRolled ? "Menunggu selesai aksi" : "Giliran Melempar Dadu"}
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
                <div className="rounded-[8px] p-3.5 flex flex-col items-center text-center bg-white border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                  <div className="w-full flex items-center justify-between border-b-[2px] border-[#1E293B] pb-1.5 mb-2">
                    <span className="font-primary text-[11px] text-[#0F172A] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Wifi size={13} className="text-[#FF6B6B]" /> MAIN VIA PONSEL
                    </span>
                    <span className="font-number text-[9px] text-[#475569] font-bold">Wi-Fi Lokal</span>
                  </div>

                  {networkConfig?.qrCodeDataUrl ? (
                    <div className="p-2 rounded-[8px] bg-white border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] my-1">
                      <img
                        src={networkConfig.qrCodeDataUrl}
                        alt="QR Code"
                        className="w-24 h-24 rounded-[4px]"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-[8px] border-[2px] border-[#1E293B] bg-[#F8FAFC] flex items-center justify-center my-1 shadow-[2px_2px_0px_#1E293B]">
                      <QrCode size={36} className="text-[#1E293B]" />
                    </div>
                  )}

                  <button
                    onClick={handleCopyUrl}
                    className="w-full py-1.5 px-2 rounded-[6px] bg-white border-[2px] border-[#1E293B] font-number text-[10px] font-black flex items-center justify-center gap-1.5 cursor-pointer mt-1.5 shadow-[2px_2px_0px_#1E293B] hover:bg-[#F8FAFC]"
                    title="Klik untuk salin alamat"
                  >
                    {copied ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
                    <span className="truncate">
                      {networkConfig?.joinUrl?.replace(/^https?:\/\//, "") || "Salin Tautan"}
                    </span>
                  </button>

                  <a
                    href="/play"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-2 rounded-[6px] bg-[#FF6B6B] hover:bg-[#FA5252] text-white border-[2px] border-[#1E293B] font-primary text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-[2px_2px_0px_#1E293B] active:translate-x-[1px] active:translate-y-[1px]"
                    title="Buka Kontroler HP di tab baru"
                  >
                    <span>Simulasi Kontroler HP (Tab Baru)</span>
                  </a>
                </div>

                {/* Papan Peringkat Pemain */}
                <div className="rounded-[8px] p-3.5 space-y-2 bg-white border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                  <div className="flex items-center justify-between border-b-[2px] border-[#1E293B] pb-1.5">
                    <span className="font-primary text-[11px] text-[#0F172A] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy size={13} className="text-[#D97706]" /> KLASEMEN PEMAIN
                    </span>
                    <span className="font-number text-[10px] text-[#475569] font-black">
                      {players.length} Pemain
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {rankedPlayers.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-[6px] bg-white border-[1.5px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] text-xs hover:translate-x-[-1px] transition-transform"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-primary text-xs w-4 text-[#FF6B6B] font-black">#{idx + 1}</span>
                          <PlayerToken player={p} size="sm" />
                          <div className="min-w-0">
                            <span className="font-primary text-[11px] text-[#0F172A] font-black truncate block">{p.name}</span>
                            <span className="font-number text-[9px] text-[#475569] font-bold">
                              {p.properties.length} aset
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-number">
                          <span className="font-black text-[#0F172A] text-xs block">
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
              <div className="rounded-[8px] p-3.5 space-y-2 bg-white border-[2.5px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                <div className="flex items-center gap-2 border-b-[2px] border-[#1E293B] pb-1.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[#FF6B6B] border border-[#1E293B] text-white font-primary text-[8px] font-black uppercase shadow-[1px_1px_0px_#1E293B]">
                    <Radio size={9} />
                    <span>LIVE</span>
                  </div>
                  <span className="font-primary text-[10px] text-[#0F172A] uppercase tracking-wider font-black">
                    LOG AKTIVITAS PERMAINAN
                  </span>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-80 pr-1 text-xs">
                  {snapshot?.logs && snapshot.logs.length > 0 ? (
                    snapshot.logs.slice(0, 10).map((log) => (
                      <div key={log.id} className="text-[11px] text-[#0F172A] leading-snug flex items-start gap-2 font-property">
                        <span className="text-[9px] font-number text-[#475569] shrink-0 mt-0.5 bg-[#F1F5F9] px-1 py-0.2 rounded border border-[#1E293B] font-bold">[{log.time}]</span>
                        <span className="font-semibold line-clamp-2">{log.text}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#94A3B8] italic text-[11px]">Belum ada aktivitas tercatat.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Expand Toggle Button */}
        <div className="pt-2 border-t-[2px] border-[#1E293B] flex justify-center">
          <button
            onClick={onToggle}
            className="w-full py-2 px-2 rounded-[6px] bg-white border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] text-xs font-primary font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#F8FAFC]"
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
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-30 transition-opacity"
        />
      )}
    </>
  );
};
