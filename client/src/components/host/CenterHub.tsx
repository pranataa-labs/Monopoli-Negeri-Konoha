import React, { useState } from "react";
import { GameSnapshot, NetworkConfig, TileData } from "../../types/game";
import {
  Landmark,
  QrCode,
  Wifi,
  Users,
  Play,
  Sparkles,
  Trophy,
  Copy,
  Check,
  Flame,
  Radio,
  Car,
  Accessibility,
  Truck,
  Bike,
  Briefcase,
  ShieldAlert,
  Crown
} from "lucide-react";
import { formatShortRupiah } from "./formatters";
import { PlayerToken } from "./PlayerToken";

interface CenterHubProps {
  snapshot: GameSnapshot | null;
  networkConfig: NetworkConfig | null;
  onStartGame: () => void;
  hoveredTile: TileData | null;
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
    <div className="w-11 h-11 sm:w-13 sm:h-13 bg-gradient-to-br from-white via-slate-100 to-slate-200 rounded-xl shadow-lg border-2 border-amber-400/40 p-1.5 grid grid-cols-3 grid-rows-3 gap-0.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && (
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-950 shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
};

export const CenterHub: React.FC<CenterHubProps> = ({
  snapshot,
  networkConfig,
  onStartGame,
  hoveredTile,
}) => {
  const [copied, setCopied] = useState(false);

  const defaultSnapshot: GameSnapshot = {
    roomId: "KONOHA-01",
    status: "LOBBY",
    currentTurnIndex: 0,
    activePlayerId: null,
    kasNegaraPool: 1000000,
    dice: [1, 1],
    hasRolled: false,
    lastRollResult: null,
    activeCardEvent: null,
    players: [],
    tilesState: {},
    logs: [
      {
        id: "log_init",
        time: "00:00",
        text: "Ruangan Sidang Konoha siap. Menunggu konglomerat bergabung via ponsel...",
        type: "SYSTEM",
      },
    ],
  };

  const currentSnapshot = snapshot || defaultSnapshot;
  const activePlayer = currentSnapshot.players.find((p) => p.id === currentSnapshot.activePlayerId);
  const isLobby = currentSnapshot.status === "LOBBY";

  const rankedPlayers = [...currentSnapshot.players].sort((a, b) => b.cash - a.cash);

  const handleCopyUrl = () => {
    const url = networkConfig?.joinUrl || `http://${window.location.hostname}:3001/play`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hoveredTileState = hoveredTile ? currentSnapshot.tilesState?.[hoveredTile.id] : null;
  const hoveredOwner = hoveredTileState?.ownerId
    ? currentSnapshot.players.find((p) => p.id === hoveredTileState.ownerId)
    : null;

  return (
    <div className="h-full w-full grid grid-rows-[auto_1fr_1fr_auto] gap-2 p-3 sm:p-3.5 leather-embossed rounded-xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden select-none box-border">
      {/* Background Decorative Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Decorative Angled 3D Monopoly Central Plaque (matching the reference photo) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-15">
        <div className="transform -rotate-[35deg] flex flex-col items-center">
          {/* Gold Crown */}
          <Crown size={64} className="text-amber-400 mb-1" />

          {/* Double Gold Bordered Black Plaque */}
          <div className="px-12 py-3 bg-black border-4 border-[#d4af37] ring-2 ring-amber-500/60 shadow-2xl rounded-md flex flex-col items-center">
            <span className="text-5xl sm:text-6xl font-black font-display tracking-wider text-white uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              MONOPOLI
            </span>
            <div className="mt-1 px-4 py-0.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded text-slate-950 font-black text-xs uppercase tracking-widest">
              NEGERI KONOHA
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Header Bar */}
      <header className="flex items-center justify-between border-b border-[#d4af37]/25 pb-2 z-10 bg-black/40 px-1 rounded-lg backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/30 font-black shrink-0">
            <Crown size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase font-display leading-tight">
                Monopoli Negeri Konoha
              </h1>
              <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black uppercase tracking-wider font-mono">
                11×11 EDISI MEWAH
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 font-medium leading-none">
              Edisi Pajak, Sawit, Bansos & Orang Dalam
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-0.5 rounded-lg bg-black/80 border border-amber-500/30 text-xs font-mono text-slate-300 flex items-center gap-1.5 shadow-xs">
            <Users size={13} className="text-amber-400" />
            <strong className="text-white">{currentSnapshot.players.length}</strong> Pemain
          </div>
          <div className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-xs font-mono font-bold text-amber-400">
            Kamar: {currentSnapshot.roomId}
          </div>
        </div>
      </header>

      {/* Tile Deed Hover Overlay OR Rows 2 & 3 */}
      {hoveredTile && hoveredTile.price > 0 ? (
        <div className="row-span-2 flex items-center justify-center py-1 z-20 animate-scale-up">
          <div className="w-full max-w-sm bg-black/95 border-2 border-amber-400/80 rounded-xl shadow-2xl overflow-hidden ring-1 ring-amber-500/40">
            <div
              className="py-2.5 px-4 text-center font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-between"
              style={{ backgroundColor: hoveredTile.colorGroup }}
            >
              <span>SERTIFIKAT HAK MILIK</span>
              <span className="text-[9px] font-mono bg-black/50 px-2 py-0.5 rounded font-bold">
                PETAK #{hoveredTile.index}
              </span>
            </div>

            <div className="p-3.5 space-y-2.5">
              <div className="text-center">
                <h3 className="text-base font-black text-white">{hoveredTile.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{hoveredTile.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px]">Harga Beli:</span>
                  <strong className="text-amber-300 text-xs">
                    {formatShortRupiah(hoveredTile.price)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Sewa Dasar:</span>
                  <strong className="text-emerald-400 text-xs">
                    {formatShortRupiah(hoveredTile.rent)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Biaya Ruko:</span>
                  <span className="text-slate-300 text-xs">
                    {formatShortRupiah(hoveredTile.upgradeCost || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Pemilik:</span>
                  {hoveredOwner ? (
                    <span className="text-sky-400 font-bold text-xs">{hoveredOwner.name}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold text-xs">Tersedia</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Row 2: Top Tier (Brankas APBN + Arena Dadu) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 z-10 min-h-0">
            {/* Brankas Kas Negara */}
            <div className="lg:col-span-7 bg-gradient-to-br from-amber-950/30 via-black/85 to-slate-950/90 border border-amber-500/40 rounded-xl p-3 flex flex-col justify-between shadow-xl relative overflow-hidden">
              {/* Subtle Watermark Crest */}
              <Landmark size={140} className="absolute -right-6 -bottom-6 text-amber-500/5 pointer-events-none select-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5 font-display">
                    <Landmark size={14} /> Brankas Kas Negara
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  APBN POOL
                </span>
              </div>

              {/* LED Display */}
              <div className="my-auto py-2 px-3 bg-black/80 rounded-xl border border-amber-500/35 text-center shadow-inner relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent animate-pulse" />
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight block drop-shadow-sm">
                  {formatShortRupiah(currentSnapshot.kasNegaraPool)}
                </span>
                <span className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider block mt-0.5 font-bold">
                  Saldo APBN Terkumpul
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 relative z-10">
                <div className="flex items-center gap-1 text-slate-300">
                  <Sparkles size={11} className="text-amber-400 shrink-0" />
                  <span>Potongan 10% START, Pajak DJP, & Pungli</span>
                </div>
                <span className="font-bold text-amber-300 text-[10px]">
                  Cair di Petak #20 BANSOS
                </span>
              </div>
            </div>

            {/* Arena Dadu */}
            <div className="lg:col-span-5 bg-gradient-to-br from-black/85 to-slate-950/90 border border-amber-500/30 rounded-xl p-3 flex flex-col justify-between items-center shadow-xl">
              <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-display">
                  Arena Lemparan Dadu
                </span>
                {currentSnapshot.lastRollResult?.isDouble && (
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 animate-pulse">
                    <Flame size={11} /> DOUBLE!
                  </span>
                )}
              </div>

              {isLobby ? (
                <div className="flex flex-col items-center justify-center my-auto text-center w-full space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono text-slate-300 font-bold">
                      Kamar: <strong className="text-amber-400">{currentSnapshot.roomId}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    {currentSnapshot.players.length === 0
                      ? "Menunggu konglomerat bergabung via ponsel..."
                      : `${currentSnapshot.players.length} konglomerat siap bersidang!`}
                  </p>
                  <button
                    onClick={onStartGame}
                    disabled={currentSnapshot.players.length === 0}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                      currentSnapshot.players.length > 0
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white cursor-pointer active:scale-95 shadow-emerald-500/25 ring-2 ring-emerald-400/30"
                        : "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
                    }`}
                  >
                    <Play size={14} className={currentSnapshot.players.length > 0 ? "fill-white" : ""} />
                    Mulai Sidang ({currentSnapshot.players.length} Pemain)
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto w-full">
                  <div className="flex items-center justify-center gap-3 my-1">
                    <DiceFace value={currentSnapshot.dice[0] || 1} />
                    <DiceFace value={currentSnapshot.dice[1] || 1} />
                  </div>

                  {currentSnapshot.lastRollResult && (
                    <span className="text-[11px] font-mono text-slate-300 mt-0.5">
                      Hasil: <strong className="text-amber-400 text-xs">{currentSnapshot.lastRollResult.sum}</strong>
                    </span>
                  )}

                  {activePlayer && (
                    <div className="mt-1 w-full p-1.5 rounded-lg bg-black/80 border border-amber-500/30 flex items-center gap-1.5">
                      <PlayerToken player={activePlayer} size="sm" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[11px] font-bold text-white truncate leading-tight">{activePlayer.name}</p>
                        <p className="text-[9px] text-amber-300/90 font-mono leading-none">
                          {currentSnapshot.hasRolled ? "Menunggu selesai" : "Giliran Lempar Dadu"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Bottom Tier (Leaderboard + QR Stand) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 z-10 min-h-0">
            {/* Papan Konglomerat & Taipan */}
            <div className="lg:col-span-8 bg-black/80 border border-[#d4af37]/30 rounded-xl p-3 flex flex-col justify-between shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 mb-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Trophy size={13} /> Papan Konglomerat & Taipan
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {currentSnapshot.players.length} Pemain Aktif
                </span>
              </div>

              {currentSnapshot.players.length === 0 ? (
                /* Showcase 6 Satirical Factions */
                <div className="grid grid-cols-3 gap-1.5 my-auto">
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
                <div className="space-y-1 my-auto max-h-24 overflow-y-auto pr-1">
                  {rankedPlayers.map((p, idx) => {
                    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-xs w-4">{medal}</span>
                          <PlayerToken player={p} size="sm" />
                          <div className="min-w-0">
                            <span className="font-bold text-white truncate block">{p.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {p.token?.name} • {p.properties.length} aset
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="font-bold text-amber-300 block text-xs">
                            {formatShortRupiah(p.cash)}
                          </span>
                          {p.inJail && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
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

            {/* Main via Ponsel (QR Stand) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-black/85 via-slate-950/90 to-black/95 border border-[#d4af37]/30 rounded-xl p-2.5 flex flex-col justify-between items-center text-center shadow-xl">
              <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 font-display">
                  <Wifi size={13} /> Main via Ponsel
                </span>
                <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
                </span>
              </div>

              <div className="my-auto py-1 flex flex-col items-center gap-1.5 w-full">
                {networkConfig?.qrCodeDataUrl ? (
                  <img
                    src={networkConfig.qrCodeDataUrl}
                    alt="QR Code"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-amber-400/50 bg-white p-1 shadow-md hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center">
                    <QrCode size={30} className="text-slate-500" />
                  </div>
                )}

                <button
                  onClick={handleCopyUrl}
                  className="w-full max-w-[210px] py-1 px-2 bg-black hover:bg-slate-900 border border-amber-500/40 hover:border-amber-400 rounded-lg text-[9.5px] font-mono text-amber-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Klik untuk salin alamat"
                >
                  {copied ? <Check size={11} className="text-emerald-400 shrink-0" /> : <Copy size={11} className="shrink-0" />}
                  <span className="truncate">
                    {networkConfig?.joinUrl?.replace(/^https?:\/\//, "") || "Salin Tautan"}
                  </span>
                </button>
              </div>

              <p className="text-[8.5px] text-slate-400 leading-tight">
                Scan QR atau buka link di browser HP.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Row 4: TV Breaking News Marquee */}
      <footer className="border-t border-[#d4af37]/25 pt-1 flex items-center gap-2 overflow-hidden bg-black/80 rounded-lg px-2.5 py-1 z-10 shadow-inner">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-wider shrink-0 shadow-xs animate-pulse">
          <Radio size={11} />
          <span>BREAKING NEWS</span>
        </div>

        <div className="overflow-hidden flex-1 relative h-4">
          <div className="animate-ticker text-[10.5px] font-mono text-slate-300 flex items-center gap-8 leading-none">
            <span className="flex items-center gap-8">
              <span>[KPK] OTT di Kantor Ditjen Pajak, 4 Koper Pecahan Seratus Ribu Segel Merah Diamankan Tim Tipikor</span>
              <span>•</span>
              <span>[TAPERA] Pemotongan Gaji 10% Otomatis Masuk Kas Negara Setiap Kali Pemain Melintasi Petak START</span>
              <span>•</span>
              <span>[BANSOS] Brankas Kas Negara Terus Menggelembung, Siap Dikuras Habis di Petak #20</span>
              <span>•</span>
              <span>[SAWIT] Armada Truk ODOL Terguling di Lintas Sumatera, Aspal Nasional Remuk Sepanjang 12 Kilometer</span>
              <span>•</span>
              <span>[IKN] Konsorsium Taipan SCBD Tandatangani MoU Proyek Kawasan Elit Tahap Baru</span>
            </span>
            <span className="flex items-center gap-8" aria-hidden="true">
              <span>[KPK] OTT di Kantor Ditjen Pajak, 4 Koper Pecahan Seratus Ribu Segel Merah Diamankan Tim Tipikor</span>
              <span>•</span>
              <span>[TAPERA] Pemotongan Gaji 10% Otomatis Masuk Kas Negara Setiap Kali Pemain Melintasi Petak START</span>
              <span>•</span>
              <span>[BANSOS] Brankas Kas Negara Terus Menggelembung, Siap Dikuras Habis di Petak #20</span>
              <span>•</span>
              <span>[SAWIT] Armada Truk ODOL Terguling di Lintas Sumatera, Aspal Nasional Remuk Sepanjang 12 Kilometer</span>
              <span>•</span>
              <span>[IKN] Konsorsium Taipan SCBD Tandatangani MoU Proyek Kawasan Elit Tahap Baru</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
