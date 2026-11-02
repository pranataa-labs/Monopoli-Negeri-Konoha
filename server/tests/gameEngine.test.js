import test from "node:test";
import assert from "node:assert/strict";
import { GameState } from "../src/models/GameState.js";
import { Player } from "../src/models/Player.js";
import { TOKENS } from "../src/constants/tokens.js";
import { CardResolver } from "../src/models/CardResolver.js";
import { SECTORS } from "../src/constants/tiles.js";

test("GameState - Player Management & Start Game", () => {
  const game = new GameState("TEST-ROOM");
  const p1 = game.addPlayer({ id: "p1", name: "Bapak Oligarki", token: TOKENS[0] });
  const p2 = game.addPlayer({ id: "p2", name: "Anak Pejabat", token: TOKENS[1] });

  assert.equal(game.players.length, 2);
  assert.equal(p1.cash, 15000000, "Modal awal harus Rp 15.000.000");

  game.startGame();
  assert.equal(game.status, "PLAYING");
  assert.equal(game.getCurrentPlayer().id, "p1");
});

test("GameState - Passing START with Tapera Cut", () => {
  const game = new GameState("TEST-ROOM");
  const p1 = game.addPlayer({ id: "p1", name: "Pemain 1", token: TOKENS[0] });
  game.addPlayer({ id: "p2", name: "Pemain 2", token: TOKENS[1] });
  game.startGame();

  p1.position = 54; // 2 langkah lagi lewat START (Tile 0)
  const initialPool = game.kasNegaraPool;
  const initialCash = p1.cash;

  // Lempar dadu 3 (54 + 3 = 57 % 56 = index 1) -> lewat START
  game.rollDice([1, 2]);

  assert.equal(p1.position, 1);
  assert.equal(p1.cash, initialCash + 1800000, "Pemain menerima bersih Rp 1.800.000");
  assert.equal(game.kasNegaraPool, initialPool + 200000, "Kas Negara Pool bertambah Rp 200.000 dari Tapera");
});

test("GameState - Free Parking Drains Kas Negara Pool", () => {
  const game = new GameState("TEST-ROOM");
  const p1 = game.addPlayer({ id: "p1", name: "Pemain 1", token: TOKENS[0] });
  game.addPlayer({ id: "p2", name: "Pemain 2", token: TOKENS[1] });
  game.startGame();

  game.kasNegaraPool = 2500000;
  p1.position = 25;
  const initialCash = p1.cash;

  // Lempar dadu 3 (25 + 3 = 28 -> CAIR PROYEK APBN / BANSOS)
  game.rollDice([1, 2]);

  assert.equal(p1.position, 28);
  assert.equal(p1.cash, initialCash + 2500000, "Pemain menguras seluruh Kas Negara Pool");
  assert.equal(game.kasNegaraPool, 0, "Kas Negara Pool menjadi Rp 0");
});

test("CardResolver - Dynamic Sector Penalty vs Fallback", () => {
  const game = new GameState("TEST-ROOM");
  const p1 = game.addPlayer({ id: "p1", name: "Juragan Sawit", token: TOKENS[2] });
  game.addPlayer({ id: "p2", name: "Pemain 2", token: TOKENS[1] });
  game.startGame();

  // Kartu ODOL (Denda Truk Sawit): Rp 250.000 per properti sawit, fallback Rp 100.000
  const odolCard = {
    id: "GOV_06",
    actionType: "SECTOR_PENALTY",
    targetSector: SECTORS.SAWIT_TAMBANG,
    amount: 250000,
    fallbackAmount: 100000,
  };

  // Kasus 1: Belum punya properti sawit (eksekusi fallback)
  const poolBefore = game.kasNegaraPool;
  const res1 = CardResolver.resolve({ player: p1, card: odolCard, gameState: game });
  assert.equal(res1.cashDelta, -100000, "Harus bayar fallback Rp 100.000");
  assert.equal(game.kasNegaraPool, poolBefore + 100000);

  // Kasus 2: Memiliki 2 properti sawit (tile_29 & tile_31)
  p1.addProperty("tile_29");
  p1.addProperty("tile_31");
  const res2 = CardResolver.resolve({ player: p1, card: odolCard, gameState: game });
  assert.equal(res2.cashDelta, -500000, "Denda 2 aset sawit x Rp 250.000 = Rp 500.000");
});

test("GameState - Rent in Jail has 20% Luxury Cell Cut", () => {
  const game = new GameState("TEST-ROOM");
  const p1 = game.addPlayer({ id: "p1", name: "Narapidana Mewah", token: TOKENS[1] });
  const p2 = game.addPlayer({ id: "p2", name: "Penyewa", token: TOKENS[3] });
  game.startGame();

  // p1 punya properti tile_01 (Pasar Tanah Abang, sewa dasar Rp 50.000)
  p1.addProperty("tile_01");
  game.tilesState["tile_01"].ownerId = p1.id;
  p1.sendToJail(14); // Masuk Rutan KPK

  const p1InitialCash = p1.cash;
  const p2InitialCash = p2.cash;
  const poolBefore = game.kasNegaraPool;

  // p2 mendarat di tile_01
  const tile01 = game.tilesCatalog[1];
  game.payRent(p2, p1, tile01, game.tilesState["tile_01"]);

  // Sewa Rp 50.000 -> Dipotong 20% (Rp 10.000 ke Kas Negara) -> p1 terima Rp 40.000
  assert.equal(p2.cash, p2InitialCash - 50000);
  assert.equal(p1.cash, p1InitialCash + 40000);
  assert.equal(game.kasNegaraPool, poolBefore + 10000);
});
