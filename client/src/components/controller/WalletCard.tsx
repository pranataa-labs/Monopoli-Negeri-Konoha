import React from "react";
import { PlayerClient, GameSnapshot } from "../../types/game";
import { TILES } from "../../constants/board";
import { formatShortRupiah } from "../host/formatters";
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
    <div className="w-full space-y-3 font-property">
      {/* Saldo Cash Card (Vibrant Neo-Brutalist Pop Wallet) */}
      <div className="p-4 rounded-[8px] border-[2.5px] border-[#1E293B] bg-white shadow-[4px_4px_0px_#1E293B]">
        <div className="flex items-center justify-between text-xs text-[#475569] mb-1">
          <span className="uppercase font-primary tracking-wider font-black text-[11px] text-[#0F172A]">KAS PRIBADI</span>
          <span className="font-number font-black text-[10px] bg-[#E0F2FE] text-[#0F172A] px-2 py-0.5 rounded-[4px] border-[1.5px] border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
            {player.properties.length} ASET TERDAFTAR
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-number text-[#10B981]">
            {formatShortRupiah(player.cash)}
          </span>

          {player.hasInsiderPass && (
            <span className="flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-[4px] bg-[#EDE9FE] text-[#8B5CF6] border-[1.5px] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]">
              <Key size={12} className="text-[#8B5CF6]" /> Bebas OTT KPK
            </span>
          )}
        </div>

        {player.inJail && (
          <div className="mt-3 p-2.5 rounded-[6px] bg-[#FEE2E2] border-[2px] border-[#1E293B] shadow-[2px_2px_0px_#1E293B] flex items-center gap-2 text-xs text-[#F43F5E]">
            <ShieldAlert size={16} className="text-[#F43F5E] shrink-0" />
            <div>
              <p className="font-primary font-black uppercase text-[11px]">Mendekam di Rutan KPK</p>
              <p className="text-[10px] text-[#F43F5E] font-bold">
                Sisa masa tahanan: {3 - player.jailTurns} giliran lagi atau bayar jaminan Rp 500.000.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Owned Properties List */}
      <div className="p-4 rounded-[8px] border-[2.5px] border-[#1E293B] bg-white shadow-[4px_4px_0px_#1E293B]">
        <h4 className="text-xs font-primary font-black text-[#0F172A] uppercase tracking-wider mb-2.5 flex items-center justify-between border-b-[2px] border-[#1E293B] pb-1.5">
          <span>Portofolio Wilayah ({ownedTiles.length})</span>
          <Building2 size={14} className="text-[#FF6B6B]" />
        </h4>

        {ownedTiles.length === 0 ? (
          <p className="text-xs text-[#475569] italic py-1.5 font-medium">
            Belum memiliki sertifikat wilayah. Beli petak saat dadu mendarat di tanah kosong!
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
                  className="p-2.5 rounded-[6px] bg-white border-[2px] border-[#1E293B] flex items-center justify-between gap-2 shadow-[2px_2px_0px_#1E293B]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-[3px] shrink-0 border-[1.5px] border-[#1E293B]"
                        style={{ backgroundColor: tile.colorGroup }}
                      />
                      <span className="text-xs font-primary font-black text-[#0F172A] uppercase truncate">
                        {tile.name}
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#475569] flex items-center gap-2 mt-0.5 font-number font-bold">
                      <span className="bg-[#E0F2FE] border-[1.5px] border-[#1E293B] px-1.5 py-0.2 rounded-[4px] text-[#0F172A]">Tk. {level}/5</span>
                      <span>Sewa: <strong className="text-[#10B981]">{formatShortRupiah(tile.rentLevels?.[level] || tile.rent)}</strong></span>
                    </div>
                  </div>

                  {tile.upgradeCost && level < 5 && (
                    <button
                      onClick={() => onUpgrade(tile.id)}
                      disabled={!canUpgrade}
                      className={`px-2.5 py-1.5 rounded-[6px] text-xs font-primary font-black uppercase flex items-center gap-1 transition-all border-[2px] border-[#1E293B] ${
                        canUpgrade
                          ? "bg-[#FACC15] hover:bg-[#EAB308] text-[#0F172A] shadow-[2px_2px_0px_#1E293B] cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                          : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed shadow-none"
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
