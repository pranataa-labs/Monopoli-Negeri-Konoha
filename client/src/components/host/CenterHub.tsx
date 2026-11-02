import React from "react";
import { GameSnapshot, NetworkConfig } from "../../types/game";
import { Landmark, QrCode, Wifi, Users, Play, Sparkles } from "lucide-react";
import { formatShortRupiah } from "./TileCell";
import { PlayerToken } from "./PlayerToken";

interface CenterHubProps {
  snapshot: GameSnapshot | null;
  networkConfig: NetworkConfig | null;
  onStartGame: () => void;
}

const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  // Render dice dots
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
    <div className="w-14 h-14 bg-white rounded-xl shadow-lg border-2 border-slate-300 p-2 grid grid-cols-3 grid-rows-3 gap-1 transform hover:rotate-6 transition-transform">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {activeDots.includes(i) && (
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
};

export const CenterHub: React.FC<CenterHubProps> = ({ snapshot, networkConfig, onStartGame }) => {
  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400 mr-3" />
        Menghubungkan ke Ruang Sidang Konoha...
      </div>
    );
  }

  const activePlayer = snapshot.players.find((p) => p.id === snapshot.activePlayerId);
  const isLobby = snapshot.status === "LOBBY";

  return (
    <div className="h-full w-full flex flex-col justify-between p-4 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              Monopoli Negeri Konoha
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              15×15 EDISI KHUSUS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Simulasi Konglomerasi: Edisi Pajak, Sawit, Bansos & Orang Dalam
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Users size={14} className="text-sky-400" />
            <span>{snapshot.players.length} Pemain</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400">
            Kamar: {snapshot.roomId}
          </div>
        </div>
      </div>

      {/* Main Grid: Vault, Dice, and Pairing info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-auto py-2">
        {/* Card 1: Brankas Kas Negara (APBN Pool) */}
        <div className="bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Landmark size={16} /> Brankas Kas Negara
            </span>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
              APBN POOL
            </span>
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight block">
              {formatShortRupiah(snapshot.kasNegaraPool)}
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Terkumpul dari Pajak DJP, Tapera, Bea Cukai & Pungli. Dicairkan saat mendarat di petak{" "}
              <strong className="text-amber-300">CAIR APBN / BANSOS</strong>.
            </p>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-400" />
            <span>Setoran otomatis dari potongan 10% setiap lewati START</span>
          </div>
        </div>

        {/* Card 2: Dadu & Turn Indicator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between text-center shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Papan Giliran & Dadu
          </span>

          {isLobby ? (
            <div className="flex flex-col items-center justify-center my-auto">
              <p className="text-sm font-semibold text-slate-300 mb-3">
                Menunggu Pemain Bergabung via Ponsel...
              </p>
              <button
                onClick={onStartGame}
                disabled={snapshot.players.length === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm tracking-wide uppercase transition-all shadow-lg ${
                  snapshot.players.length > 0
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white cursor-pointer active:scale-95"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Play size={16} /> Mulai Sidang Paripurna
              </button>
            </div>
          ) : (
            <>
              {/* Dice Display */}
              <div className="flex items-center justify-center gap-4 my-2">
                <DiceFace value={snapshot.dice[0] || 1} />
                <DiceFace value={snapshot.dice[1] || 1} />
              </div>

              {snapshot.lastRollResult && (
                <div className="text-xs font-mono text-slate-300 mt-1">
                  Jumlah:{" "}
                  <strong className="text-amber-400 text-sm">
                    {snapshot.lastRollResult.sum}
                  </strong>{" "}
                  {snapshot.lastRollResult.isDouble && (
                    <span className="text-emerald-400 font-bold ml-1">
                      (DOUBLE! Jalan Lagi)
                    </span>
                  )}
                </div>
              )}

              {/* Active Player Status */}
              {activePlayer && (
                <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <PlayerToken player={activePlayer} size="sm" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">
                      {activePlayer.name}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {snapshot.hasRolled ? "Menunggu giliran selesai" : "Giliran Melempar Dadu"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Card 3: Wi-Fi Pairing & QR Code */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-sky-400 tracking-wider uppercase flex items-center gap-1.5">
              <Wifi size={16} /> Hubungkan HP ke Wi-Fi
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ONLINE
            </span>
          </div>

          <div className="flex items-center gap-3 my-2">
            {networkConfig?.qrCodeDataUrl ? (
              <img
                src={networkConfig.qrCodeDataUrl}
                alt="Scan to Play"
                className="w-20 h-20 rounded-lg border border-slate-700 bg-white p-1"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center">
                <QrCode size={32} className="text-slate-500" />
              </div>
            )}

            <div className="flex-1">
              <p className="text-[11px] text-slate-300 font-medium">
                Scan QR atau buka di browser HP satu jaringan Wi-Fi:
              </p>
              <div className="mt-1.5 p-1.5 rounded bg-black/60 border border-slate-800 font-mono text-[11px] text-amber-300 select-all truncate">
                {networkConfig?.joinUrl || `http://${window.location.hostname}:5173/play`}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500">
            Bermain tanpa instal aplikasi via ponsel masing-masing.
          </p>
        </div>
      </div>

      {/* Bottom Live Activity Feed / Ticker */}
      <div className="border-t border-slate-800/80 pt-2 flex items-center gap-2 overflow-hidden">
        <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded shrink-0 font-bold">
          Kabar Terkini
        </span>
        <div className="text-xs text-slate-400 truncate font-mono">
          {snapshot.logs.length > 0 ? (
            snapshot.logs[snapshot.logs.length - 1].text
          ) : (
            "Sidang kabinet belum dimulai. Silakan hubungkan pemain."
          )}
        </div>
      </div>
    </div>
  );
};
