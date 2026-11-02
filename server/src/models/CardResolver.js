/**
 * Card Resolver Engine for Monopoli Negeri Konoha.
 * Executes dynamic sector penalties, synergies, Kas Negara Pool siphons, and jail mechanics.
 */

import { SECTORS } from "../constants/tiles.js";

export class CardResolver {
  /**
   * Resolves card effects on player and board state.
   * @param {Object} params
   * @param {Player} params.player
   * @param {Object} params.card
   * @param {Object} params.gameState
   * @param {Array<Player>} params.allPlayers
   * @returns {Object} Resolution report
   */
  static resolve({ player, card, gameState, allPlayers = [] }) {
    const tilesMap = gameState.tilesState;
    const tilesCatalog = gameState.tilesCatalog;

    // Filter player's properties that match the target sector
    const matchingProperties = player.properties.filter((tileId) => {
      const catalog = tilesCatalog.find((t) => t.id === tileId);
      return catalog && catalog.sector === card.targetSector;
    });

    let description = "";
    let cashDelta = 0;
    let poolDelta = 0;

    switch (card.actionType) {
      case "FLAT_GAIN": {
        cashDelta = card.amount;
        player.addCash(cashDelta);
        description = `${player.name} menerima Rp ${cashDelta.toLocaleString("id-ID")} dari Bank.`;
        break;
      }

      case "FLAT_TAX": {
        cashDelta = -card.amount;
        player.deductCash(card.amount);
        poolDelta = card.amount;
        gameState.kasNegaraPool += poolDelta;
        description = `${player.name} membayar pajak/denda Rp ${card.amount.toLocaleString("id-ID")} ke Kas Negara Pool.`;
        break;
      }

      case "PERCENT_CASH_TAX": {
        const tax = Math.round(player.cash * card.amount);
        cashDelta = -tax;
        player.deductCash(tax);
        poolDelta = tax;
        gameState.kasNegaraPool += poolDelta;
        description = `${player.name} kena potong 10% saldo tunai (Rp ${tax.toLocaleString("id-ID")}) ke Kas Negara Pool.`;
        break;
      }

      case "SECTOR_PENALTY": {
        if (matchingProperties.length > 0) {
          const totalPenalty = matchingProperties.length * card.amount;
          cashDelta = -totalPenalty;
          player.deductCash(totalPenalty);
          poolDelta = totalPenalty;
          gameState.kasNegaraPool += poolDelta;
          description = `${player.name} memiliki ${matchingProperties.length} aset di sektor ${card.targetSector}. Denda total: Rp ${totalPenalty.toLocaleString("id-ID")} disetor ke Kas Negara Pool.`;
        } else {
          const fallback = card.fallbackAmount || 0;
          cashDelta = -fallback;
          player.deductCash(fallback);
          poolDelta = fallback;
          gameState.kasNegaraPool += poolDelta;
          description = `${player.name} tidak memiliki aset di sektor ${card.targetSector}. Bayar denda fallback Rp ${fallback.toLocaleString("id-ID")} ke Kas Negara Pool.`;
        }
        break;
      }

      case "SECTOR_REWARD": {
        if (matchingProperties.length > 0) {
          const totalReward = matchingProperties.length * card.amount;
          cashDelta = totalReward;
          player.addCash(totalReward);
          description = `${player.name} panen cuan dari ${matchingProperties.length} aset di sektor ${card.targetSector}! Menerima Rp ${totalReward.toLocaleString("id-ID")} dari Bank.`;
        } else {
          const fallback = card.fallbackAmount || 0;
          cashDelta = fallback;
          if (fallback >= 0) {
            player.addCash(fallback);
            description = `${player.name} tidak punya aset di sektor ${card.targetSector}, tetapi menerima komisi Rp ${fallback.toLocaleString("id-ID")}.`;
          } else {
            // Negative fallback (misal audit UMKM)
            player.deductCash(Math.abs(fallback));
            poolDelta = Math.abs(fallback);
            gameState.kasNegaraPool += poolDelta;
            description = `${player.name} hanya punya UMKM, kena denda audit Rp ${Math.abs(fallback).toLocaleString("id-ID")} ke Kas Negara Pool.`;
          }
        }
        break;
      }

      case "POOL_SIPHON": {
        // Ambil 50% isi kas negara, maksimal 1.000.000, minimal 300.000 (disubsidi bank)
        const halfPool = Math.round(gameState.kasNegaraPool * 0.5);
        let siphon = Math.min(halfPool, 1000000);
        if (siphon < 300000) {
          siphon = 300000;
        }

        const actualTakenFromPool = Math.min(siphon, gameState.kasNegaraPool);
        gameState.kasNegaraPool -= actualTakenFromPool;
        poolDelta = -actualTakenFromPool;
        cashDelta = siphon;
        player.addCash(siphon);
        description = `${player.name} berhasil mencairkan dana Bansos / Proyek APBN sebesar Rp ${siphon.toLocaleString("id-ID")}!`;
        break;
      }

      case "GO_TO_JAIL": {
        player.sendToJail(14); // Index 14: Rutan KPK
        description = `${player.name} TERJARING OTT KPK! Langsung dijebloskan ke sel Rutan KPK.`;
        break;
      }

      case "KEEP_JAIL_FREE": {
        player.hasInsiderPass = true;
        description = `${player.name} memperoleh Kartu Sakti 'Kenalan Orang Dalam' untuk bebas dari Rutan KPK kapan saja!`;
        break;
      }

      case "COLLECT_FROM_PLAYERS": {
        const perPlayer = card.amount || 50000;
        let totalCollected = 0;
        allPlayers.forEach((other) => {
          if (other.id !== player.id && !other.isBankrupt) {
            other.deductCash(perPlayer);
            totalCollected += perPlayer;
          }
        });
        player.addCash(totalCollected);
        cashDelta = totalCollected;
        description = `${player.name} mengumpulkan uang koordinasi total Rp ${totalCollected.toLocaleString("id-ID")} dari para pemain lain!`;
        break;
      }

      case "PER_BUILDING_TAX": {
        let totalLevel1To4 = 0;
        let totalLevel5 = 0;
        player.properties.forEach((propId) => {
          const state = tilesMap[propId];
          if (state && state.level) {
            if (state.level === 5) totalLevel5++;
            else totalLevel1To4 += state.level;
          }
        });

        const totalTax = totalLevel1To4 * card.amount + totalLevel5 * (card.maxAmount || 150000);
        const finalTax = totalTax > 0 ? totalTax : card.fallbackAmount || 50000;
        cashDelta = -finalTax;
        player.deductCash(finalTax);
        poolDelta = finalTax;
        gameState.kasNegaraPool += poolDelta;
        description = `${player.name} membayar pajak bangunan/Tapera sebesar Rp ${finalTax.toLocaleString("id-ID")} ke Kas Negara Pool.`;
        break;
      }

      case "PER_PROPERTY_TAX": {
        const propCount = player.properties.length;
        const totalTax = propCount > 0 ? propCount * card.amount : card.fallbackAmount || 50000;
        cashDelta = -totalTax;
        player.deductCash(totalTax);
        poolDelta = totalTax;
        gameState.kasNegaraPool += poolDelta;
        description = `${player.name} membayar biaya urus sertifikat ulang sebesar Rp ${totalTax.toLocaleString("id-ID")} ke Kas Negara Pool.`;
        break;
      }

      case "TELEPORT_AND_REWARD": {
        const destination = card.destinationIndex || 0;
        player.position = destination;
        cashDelta = card.amount || 0;
        player.addCash(cashDelta);
        const targetTile = tilesCatalog.find((t) => t.index === destination);
        description = `${player.name} langsung pindah ke ${targetTile?.name || "tujuan"} dan menerima uang saku Rp ${cashDelta.toLocaleString("id-ID")}.`;
        break;
      }

      case "SECTOR_BUFF": {
        const buff = {
          sector: card.targetSector,
          rentMultiplier: card.buffMultiplier || 2.0,
          turnsRemaining: 1, // 1 putaran
        };
        player.activeBuffs.push(buff);
        cashDelta = card.amount || 0;
        player.addCash(cashDelta);
        description = `${player.name} menerima Rp ${cashDelta.toLocaleString("id-ID")} dan sewa seluruh properti sektor ${card.targetSector} miliknya NAIK 2x lipat selama 1 putaran!`;
        break;
      }

      case "SECTOR_SYNERGY": {
        const hasPertamina = player.properties.includes("tile_36");
        const hasSawit = matchingProperties.length > 0;
        if (hasPertamina || hasSawit) {
          cashDelta = card.amount;
          player.addCash(cashDelta);
          description = `${player.name} memiliki sinergi energi sawit/Pertamina dan menerima Rp ${cashDelta.toLocaleString("id-ID")}!`;
        } else {
          cashDelta = card.fallbackAmount;
          player.addCash(cashDelta);
          description = `${player.name} menerima fee proyek sebesar Rp ${cashDelta.toLocaleString("id-ID")}.`;
        }
        break;
      }

      case "UTILITY_INTERACTION": {
        const plnOwner = allPlayers.find((p) => p.hasProperty("tile_16"));
        cashDelta = -card.amount;
        player.deductCash(card.amount);
        if (plnOwner && plnOwner.id !== player.id) {
          plnOwner.addCash(card.amount);
          description = `${player.name} beli token listrik darurat Rp ${card.amount.toLocaleString("id-ID")} ke pemilik PLN (${plnOwner.name}).`;
        } else {
          poolDelta = card.amount;
          gameState.kasNegaraPool += poolDelta;
          description = `${player.name} beli token listrik darurat Rp ${card.amount.toLocaleString("id-ID")} disetor ke Kas Negara Pool.`;
        }
        break;
      }

      default:
        description = `${player.name} menarik kartu: ${card.title}.`;
    }

    return {
      card,
      player,
      cashDelta,
      poolDelta,
      description,
    };
  }
}
