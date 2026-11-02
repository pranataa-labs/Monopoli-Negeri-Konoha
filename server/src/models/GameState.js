/**
 * Authoritative GameState Machine for Monopoli Negeri Konoha 15x15.
 */

import { TILES, SECTORS } from "../constants/tiles.js";
import { GOVERNMENT_CARDS, INSIDER_CARDS } from "../constants/cards.js";
import { Player } from "./Player.js";
import { CardResolver } from "./CardResolver.js";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class GameState {
  constructor(roomId = "KONOHA-01") {
    this.roomId = roomId;
    this.players = [];
    this.currentTurnIndex = 0;
    this.kasNegaraPool = 1000000; // Modal stimulus awal Kas Negara Rp 1.000.000
    this.status = "LOBBY"; // LOBBY, PLAYING, GAME_OVER
    this.dice = [1, 1];
    this.doubleStreak = 0;
    this.hasRolled = false;

    this.tilesCatalog = TILES;
    this.tilesState = {};
    TILES.forEach((t) => {
      this.tilesState[t.id] = {
        ownerId: null,
        level: 0, // 0 = tanah kosong, 1-4 = ruko/gudang/villa, 5 = hotel/resort/pasar
        mortgaged: false,
      };
    });

    this.governmentDeck = shuffle(GOVERNMENT_CARDS);
    this.insiderDeck = shuffle(INSIDER_CARDS);
    this.activeCardEvent = null;
    this.lastRollResult = null;
    this.logs = [];

    this.addLog("Ruangan Monopoli Negeri Konoha dibuat. Menunggu pemain...", "SYSTEM");
  }

  addLog(text, type = "INFO") {
    this.logs.unshift({
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      text,
      type,
    });
    if (this.logs.length > 50) this.logs.pop();
  }

  addPlayer(playerParams) {
    if (this.status !== "LOBBY") {
      throw new Error("Permainan sudah dimulai!");
    }
    if (this.players.length >= 6) {
      throw new Error("Maksimal 6 pemain per ruangan!");
    }
    const player = new Player(playerParams);
    this.players.push(player);
    this.addLog(`${player.name} bergabung menggunakan pion ${player.token.name}.`, "PLAYER");
    return player;
  }

  removePlayer(playerId) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) return null;

    // Lepas seluruh kepemilikan properti pemain
    player.properties.forEach((tileId) => {
      if (this.tilesState[tileId]) {
        this.tilesState[tileId].ownerId = null;
        this.tilesState[tileId].level = 0;
      }
    });

    this.players = this.players.filter((p) => p.id !== playerId);
    this.addLog(`${player.name} keluar dari permainan.`, "WARN");

    if (this.players.length === 0) {
      this.status = "LOBBY";
      this.currentTurnIndex = 0;
    } else {
      this.currentTurnIndex = this.currentTurnIndex % this.players.length;
    }
    return player;
  }

  startGame() {
    if (this.players.length < 2) {
      throw new Error("Minimal 2 pemain untuk memulai permainan!");
    }
    this.status = "PLAYING";
    this.currentTurnIndex = 0;
    this.doubleStreak = 0;
    this.hasRolled = false;
    const activePlayer = this.getCurrentPlayer();
    this.addLog(`Permainan dimulai! Giliran pertama: ${activePlayer.name}.`, "GAME");
  }

  getCurrentPlayer() {
    if (this.players.length === 0) return null;
    return this.players[this.currentTurnIndex % this.players.length];
  }

  /**
   * Mengocok dadu dan memindahkan posisi pemain
   */
  rollDice(forcedDice = null) {
    const player = this.getCurrentPlayer();
    if (!player) throw new Error("Tidak ada pemain aktif");
    if (this.hasRolled) throw new Error("Anda sudah melempar dadu pada giliran ini!");

    const d1 = forcedDice ? forcedDice[0] : Math.floor(Math.random() * 6) + 1;
    const d2 = forcedDice ? forcedDice[1] : Math.floor(Math.random() * 6) + 1;
    this.dice = [d1, d2];
    const sum = d1 + d2;
    const isDouble = d1 === d2;

    this.hasRolled = true;

    // Jika sedang di dalam penjara
    if (player.inJail) {
      if (isDouble) {
        player.releaseFromJail();
        this.addLog(`${player.name} melempar dadu kembar (${d1}-${d2}) dan BEBAS dari Rutan KPK!`, "SUCCESS");
      } else {
        player.jailTurns++;
        if (player.jailTurns >= 3) {
          // Wajib bayar jaminan Rp 500.000 setelah 3 giliran
          player.deductCash(500000);
          this.kasNegaraPool += 500000;
          player.releaseFromJail();
          this.addLog(`${player.name} sudah 3 giliran di Rutan KPK. Bayar jaminan pengacara Rp 500.000 dan bebas.`, "WARN");
        } else {
          this.addLog(`${player.name} gagal melempar dadu kembar (${d1}-${d2}), masih ditahan di Rutan KPK (Giliran ke-${player.jailTurns}).`, "WARN");
          this.lastRollResult = { d1, d2, sum, isDouble, previousPosition: player.position, newPosition: player.position, passedStart: false };
          return this.lastRollResult;
        }
      }
    }

    // Cek double streak (3 kali berturut-turut masuk penjara)
    if (isDouble) {
      this.doubleStreak++;
      if (this.doubleStreak >= 3) {
        player.sendToJail(10);
        this.doubleStreak = 0;
        this.hasRolled = true;
        this.addLog(`${player.name} melempar dadu kembar 3 kali berturut-turut! Dianggap mencurigakan (OTT KPK) dan masuk sel!`, "ERROR");
        this.lastRollResult = { d1, d2, sum, isDouble, previousPosition: player.position, newPosition: 10, passedStart: false };
        return this.lastRollResult;
      }
    } else {
      this.doubleStreak = 0;
    }

    const prevPos = player.position;
    const rawPos = prevPos + sum;
    const boardSize = this.tilesCatalog.length;
    const newPos = rawPos % boardSize;
    const passedStart = rawPos >= boardSize;

    player.moveTo(newPos);

    // Gaji START: Rp 2.000.000 dipotong Tapera & PPh 10% (Rp 200.000)
    if (passedStart && newPos !== 0) {
      player.addCash(1800000);
      this.kasNegaraPool += 200000;
      this.addLog(`${player.name} melewati petak START! Terima gaji bersih Rp 1.800.000 (Dipangkas Tapera 10% = Rp 200.000 ke Kas Negara).`, "SUCCESS");
    } else if (newPos === 0) {
      player.addCash(1800000);
      this.kasNegaraPool += 200000;
      this.addLog(`${player.name} mendarat pas di petak START! Terima gaji bersih Rp 1.800.000 (+Rp 200.000 ke Kas Negara).`, "SUCCESS");
    }

    this.lastRollResult = { d1, d2, sum, isDouble, previousPosition: prevPos, newPosition: newPos, passedStart };
    this.addLog(`${player.name} melempar dadu [${d1}, ${d2}] (Total ${sum}) dan melangkah ke petak #${newPos} (${this.tilesCatalog[newPos].name}).`, "ROLL");

    // Selesaikan efek petak secara otomatis
    this.resolveTileEffect(player, newPos);

    return this.lastRollResult;
  }

  /**
   * Menangani efek petak saat pemain mendarat
   */
  resolveTileEffect(player, tileIndex) {
    const tile = this.tilesCatalog[tileIndex];
    const tileState = this.tilesState[tile.id];

    switch (tile.sector) {
      case SECTORS.SPECIAL_GOTOJAIL: {
        player.sendToJail(10);
        this.addLog(`${player.name} TERJARING OTT KPK di petak #${tileIndex}! Langsung diseret ke Rutan KPK.`, "ERROR");
        break;
      }

      case SECTORS.SPECIAL_FREEPARKING: {
        // Mendarat di CAIR PROYEK APBN / BANSOS: Kuras seluruh Kas Negara Pool!
        const bounty = this.kasNegaraPool;
        if (bounty > 0) {
          player.addCash(bounty);
          this.kasNegaraPool = 0;
          this.addLog(`${player.name} MENDARAT DI PROYEK APBN / BANSOS! Menguras seluruh Kas Negara Pool sebesar Rp ${bounty.toLocaleString("id-ID")}!`, "SUCCESS");
        } else {
          this.addLog(`${player.name} nongkrong di proyek APBN, tapi kas negara sedang kosong!`, "INFO");
        }
        break;
      }

      case SECTORS.TAX_TILE:
      case SECTORS.PUNGLI_ORBIT: {
        const tax = tile.rent || 500000;
        player.deductCash(tax);
        this.kasNegaraPool += tax;
        this.addLog(`${player.name} mendarat di ${tile.name}. Bayar pajak/denda Rp ${tax.toLocaleString("id-ID")} ke Kas Negara Pool.`, "WARN");
        break;
      }

      case SECTORS.CARD_GOVERNMENT: {
        this.drawCard(player, "GOVERNMENT");
        break;
      }

      case SECTORS.CARD_INSIDER: {
        this.drawCard(player, "INSIDER");
        break;
      }

      default: {
        // Petak Properti / Transport / Utilitas
        if (tile.price > 0) {
          if (tileState.ownerId && tileState.ownerId !== player.id) {
            // Bayar uang sewa ke pemilik
            const owner = this.players.find((p) => p.id === tileState.ownerId);
            if (owner && !owner.isBankrupt && !tileState.mortgaged) {
              this.payRent(player, owner, tile, tileState);
            }
          }
        }
      }
    }
  }

  payRent(tenant, landlord, tile, tileState) {
    let rent = tile.rent || 50000;
    if (tile.rentLevels && tileState.level > 0) {
      rent = tile.rentLevels[tileState.level] || rent;
    }

    // Cek active buffs sektor
    const buff = landlord.activeBuffs.find((b) => b.sector === tile.sector);
    if (buff) {
      rent = Math.round(rent * buff.rentMultiplier);
    }

    // Twist Satir: Jika pemilik sedang di Rutan KPK, dipotong biaya fasilitas sel 20%
    if (landlord.inJail) {
      const jailCut = Math.round(rent * 0.2);
      const landlordShare = rent - jailCut;
      tenant.deductCash(rent);
      landlord.addCash(landlordShare);
      this.kasNegaraPool += jailCut;
      this.addLog(`${tenant.name} membayar sewa Rp ${rent.toLocaleString("id-ID")} ke ${landlord.name} yang sedang di sel KPK. Dipotong sewa sel mewah 20% (Rp ${jailCut.toLocaleString("id-ID")} ke Kas Negara).`, "WARN");
    } else {
      tenant.deductCash(rent);
      landlord.addCash(rent);
      this.addLog(`${tenant.name} membayar sewa Rp ${rent.toLocaleString("id-ID")} ke ${landlord.name} di ${tile.name}.`, "WARN");
    }
  }

  drawCard(player, deckType) {
    let card = null;
    if (deckType === "GOVERNMENT") {
      card = this.governmentDeck.shift();
      this.governmentDeck.push(card);
    } else {
      card = this.insiderDeck.shift();
      this.insiderDeck.push(card);
    }

    if (!card) return null;

    const resolution = CardResolver.resolve({
      player,
      card,
      gameState: this,
      allPlayers: this.players,
    });

    this.activeCardEvent = resolution;
    this.addLog(`[KARTU ${card.deck === "GOVERNMENT" ? "KEBIJAKAN" : "ORANG DALAM"}] ${card.title}: ${resolution.description}`, "CARD");
    return resolution;
  }

  buyCurrentTile(playerId) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Pemain tidak ditemukan");
    if (player.id !== this.getCurrentPlayer()?.id) throw new Error("Bukan giliran Anda!");

    const tile = this.tilesCatalog[player.position];
    const tileState = this.tilesState[tile.id];

    if (!tile.price || tile.price === 0) throw new Error("Petak ini tidak dapat dibeli!");
    if (tileState.ownerId) throw new Error("Petak ini sudah dimiliki pemain lain!");
    if (player.cash < tile.price) throw new Error("Saldo uang tidak mencukupi untuk membeli petak ini!");

    player.deductCash(tile.price);
    tileState.ownerId = player.id;
    tileState.level = 0;
    player.addProperty(tile.id);

    this.addLog(`${player.name} membeli hak milik ${tile.name} seharga Rp ${tile.price.toLocaleString("id-ID")}!`, "SUCCESS");
    return { player, tile, tileState };
  }

  upgradeTile(playerId, tileId) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Pemain tidak ditemukan");

    const tile = this.tilesCatalog.find((t) => t.id === tileId);
    const tileState = this.tilesState[tileId];

    if (!tile || !tileState) throw new Error("Petak tidak valid!");
    if (tileState.ownerId !== player.id) throw new Error("Anda bukan pemilik petak ini!");
    if (!tile.upgradeCost) throw new Error("Petak ini tidak memiliki izin peningkatan bangunan!");
    if (tileState.level >= 5) throw new Error("Bangunan sudah mencapai tingkat maksimal (Hotel/Resort/Menara)!");
    if (player.cash < tile.upgradeCost) throw new Error("Saldo tidak cukup untuk biaya upgrade!");

    player.deductCash(tile.upgradeCost);
    tileState.level += 1;

    this.addLog(`${player.name} meningkatkan level ${tile.name} ke Tingkat ${tileState.level} seharga Rp ${tile.upgradeCost.toLocaleString("id-ID")}.`, "SUCCESS");
    return { player, tile, tileState };
  }

  payJailBail(playerId) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.inJail) throw new Error("Pemain tidak sedang ditahan di sel!");
    if (player.cash < 500000) throw new Error("Saldo tidak cukup untuk membayar jaminan pengacara!");

    player.deductCash(500000);
    this.kasNegaraPool += 500000;
    player.releaseFromJail();
    this.addLog(`${player.name} membayar uang jaminan & pengacara kondang Rp 500.000 dan BEBAS dari Rutan KPK!`, "SUCCESS");
    return player;
  }

  useJailPass(playerId) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.inJail) throw new Error("Pemain tidak sedang ditahan di sel!");
    if (!player.hasInsiderPass) throw new Error("Anda tidak memiliki Kartu Sakti 'Kenalan Orang Dalam'!");

    player.hasInsiderPass = false;
    player.releaseFromJail();
    this.addLog(`${player.name} mengeluarkan Kartu Sakti 'Kenalan Pejabat Tinggi' dan bebas seketika tanpa bayar denda!`, "SUCCESS");
    return player;
  }

  endTurn() {
    const player = this.getCurrentPlayer();
    if (!player) return null;

    // Bersihkan kartu pop-up
    this.activeCardEvent = null;

    // Turunkan sisa durasi buff
    player.decrementBuffs();

    // Jika melempar dadu kembar (double) dan tidak masuk penjara, dapat giliran ekstra!
    if (this.lastRollResult && this.lastRollResult.isDouble && !player.inJail) {
      this.hasRolled = false;
      this.addLog(`${player.name} melempar dadu kembar dan mendapat GILIRAN TAMBAHAN!`, "SUCCESS");
      return { nextPlayer: player, extraTurn: true };
    }

    // Giliran beralih ke pemain berikutnya
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    this.hasRolled = false;
    this.doubleStreak = 0;
    const nextPlayer = this.getCurrentPlayer();
    this.addLog(`Giliran berganti ke ${nextPlayer.name}.`, "INFO");
    return { nextPlayer, extraTurn: false };
  }

  getPublicSnapshot() {
    return {
      roomId: this.roomId,
      status: this.status,
      currentTurnIndex: this.currentTurnIndex,
      activePlayerId: this.getCurrentPlayer()?.id || null,
      kasNegaraPool: this.kasNegaraPool,
      dice: this.dice,
      hasRolled: this.hasRolled,
      lastRollResult: this.lastRollResult,
      activeCardEvent: this.activeCardEvent,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        cash: p.cash,
        position: p.position,
        inJail: p.inJail,
        jailTurns: p.jailTurns,
        hasInsiderPass: p.hasInsiderPass,
        properties: p.properties,
        activeBuffs: p.activeBuffs,
        isBankrupt: p.isBankrupt,
        token: p.token,
      })),
      tilesState: this.tilesState,
      logs: this.logs.slice(0, 20),
    };
  }
}
