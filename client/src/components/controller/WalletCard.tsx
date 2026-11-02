import React from "react";
import { PlayerClient, GameSnapshot } from "../../types/game";
import { TILES } from "../../constants/board";
import { formatShortRupiah } from "../host/TileCell";
import { ArrowUpCircle, ShieldAlert, Key, Building2 } from "lucide-react";

interface WalletCardProps {
  player: PlayerClient;
  snapshot: GameSnapshot | null;
  onUpgrade: (tileId: string) => void;
  isTurn: boolean;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  player,
  snapshot,
  onUpgrade,
  isTurn,
}) => {
  const ownedTiles = TILES.filter((t) => player.properties.includes(t.id));

  return (
    <div className="w-full space-y-3">
      {/* Saldo Cash Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="uppercase tracking-wider font-semibold">Kas Pribadi (Cash)</span>
          <span className="font-mono">{player.properties.length} Aset Terdaftar</span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {formatShortRupiah(player.cash)}
          </span>

          {player.hasInsiderPass && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Key size={12} /> Kartu Sakti Bebas KPK
            </span>
          )}
        </div>

        {player.inJail && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/70 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
            <ShieldAlert size={16} className="text-red-400 shrink-0" />
            <div>
              <p className="font-bold">Mendekam di Rutan KPK</p>
              <p className="text-[11px] text-red-300/80">
                Sisa masa tahanan: {3 - player.jailTurns} giliran lagi atau bayar jaminan Rp 500.000.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Owned Properties List */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Portofolio Properti ({ownedTiles.length})</span>
          <Building2 size={14} className="text-slate-400" />
        </h4>

        {ownedTiles.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            Belum memiliki sertifikat properti. Beli petak saat dadu mendarat di tanah kosong!
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {ownedTiles.map((tile) => {
              const state = snapshot?.tilesState?.[tile.id];
              const level = state?.level || 0;
              const canUpgrade =
                isTurn &&
                tile.upgradeCost &&
                level < 5 &&
                player.cash >= tile.upgradeCost &&
                !player.inJail;

              return (
                <div
                  key={tile.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: tile.colorGroup }}
                      />
                      <span className="text-xs font-bold text-white truncate">
                        {tile.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span>Tk. {level}/5</span>
                      <span>Sewa: {formatShortRupiah(tile.rentLevels?.[level] || tile.rent)}</span>
                    </div>
                  </div>

                  {tile.upgradeCost && level < 5 && (
                    <button
                      onClick={() => onUpgrade(tile.id)}
                      disabled={!canUpgrade}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        canUpgrade
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm active:scale-95"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <ArrowUpCircle size={14} />
                      <span>{formatShortRupiah(tile.upgradeCost)}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
