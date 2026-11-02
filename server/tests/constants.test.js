import test from "node:test";
import assert from "node:assert/strict";
import { TILES, SECTORS } from "../src/constants/tiles.js";
import { GOVERNMENT_CARDS, INSIDER_CARDS } from "../src/constants/cards.js";
import { TOKENS } from "../src/constants/tokens.js";

test("Board 15x15 Constants Validation", () => {
  assert.equal(TILES.length, 56, "Papan harus memiliki tepat 56 petak keliling");

  // Validate index continuity
  TILES.forEach((tile, idx) => {
    assert.equal(tile.index, idx, `Petak pada index ${idx} harus cocok`);
    assert.ok(tile.name, `Petak ${idx} harus punya nama`);
    assert.ok(tile.sector, `Petak ${idx} harus punya sektor`);
    assert.ok(tile.gridRow >= 0 && tile.gridRow <= 14, `Baris petak ${idx} harus 0-14`);
    assert.ok(tile.gridCol >= 0 && tile.gridCol <= 14, `Kolom petak ${idx} harus 0-14`);
  });

  // Check 4 Corner Coordinates
  assert.equal(TILES[0].tag, "SPECIAL_START");
  assert.deepEqual([TILES[0].gridRow, TILES[0].gridCol], [14, 14]);

  assert.equal(TILES[14].tag, "SPECIAL_JAIL");
  assert.deepEqual([TILES[14].gridRow, TILES[14].gridCol], [14, 0]);

  assert.equal(TILES[28].tag, "SPECIAL_FREEPARKING");
  assert.deepEqual([TILES[28].gridRow, TILES[28].gridCol], [0, 0]);

  assert.equal(TILES[42].tag, "SPECIAL_GOTOJAIL");
  assert.deepEqual([TILES[42].gridRow, TILES[42].gridCol], [0, 14]);
});

test("Satirical Event Cards Validation", () => {
  assert.equal(GOVERNMENT_CARDS.length, 16, "Harus ada 16 kartu Kebijakan Pemerintah");
  assert.equal(INSIDER_CARDS.length, 16, "Harus ada 16 kartu Lobi Orang Dalam");

  const allCards = [...GOVERNMENT_CARDS, ...INSIDER_CARDS];
  assert.equal(allCards.length, 32, "Total harus ada 32 kartu");

  allCards.forEach((c) => {
    assert.ok(c.id, "Kartu harus punya ID");
    assert.ok(c.title, "Kartu harus punya judul");
    assert.ok(c.text, "Kartu harus punya narasi sarkas");
    assert.ok(c.actionType, "Kartu harus punya actionType");
  });
});

test("Satirical Tokens Validation", () => {
  assert.equal(TOKENS.length, 6, "Harus ada tepat 6 token satir");
  const tokenIds = new Set(TOKENS.map((t) => t.id));
  assert.equal(tokenIds.size, 6, "ID token tidak boleh ada yang duplikat");
});
