/**
 * Player Entity for Monopoli Negeri Konoha.
 */

export class Player {
  constructor({ id, name, token, color = "#0284c7" }) {
    this.id = id;
    this.name = name;
    this.token = token; // token object { id, name, icon, color }
    this.color = color;
    this.cash = 15000000; // Modal awal Rp 15.000.000
    this.position = 0; // Mulai di Petak START (Index 0)
    this.inJail = false;
    this.jailTurns = 0;
    this.hasInsiderPass = false;
    this.properties = []; // Array of tile IDs
    this.activeBuffs = []; // [{ sector, rentMultiplier, turnsRemaining }]
    this.isBankrupt = false;
    this.ready = false;
  }

  addCash(amount) {
    this.cash += Math.max(0, Math.round(amount));
    return this.cash;
  }

  deductCash(amount) {
    const val = Math.max(0, Math.round(amount));
    this.cash -= val;
    if (this.cash < 0) {
      // Pemain berpotensi bangkrut jika tidak bisa melunasi
    }
    return this.cash;
  }

  moveTo(targetIndex) {
    this.position = targetIndex % 56;
    return this.position;
  }

  sendToJail(jailIndex = 14) {
    this.position = jailIndex;
    this.inJail = true;
    this.jailTurns = 0;
  }

  releaseFromJail() {
    this.inJail = false;
    this.jailTurns = 0;
  }

  addProperty(tileId) {
    if (!this.properties.includes(tileId)) {
      this.properties.push(tileId);
    }
  }

  removeProperty(tileId) {
    this.properties = this.properties.filter((id) => id !== tileId);
  }

  hasProperty(tileId) {
    return this.properties.includes(tileId);
  }

  getNetWorth(tilesMap = {}) {
    let total = this.cash;
    for (const tileId of this.properties) {
      const tile = tilesMap[tileId];
      if (tile) {
        total += tile.price || 0;
        const level = tile.level || 0;
        total += level * (tile.upgradeCost || 0);
      }
    }
    return total;
  }

  decrementBuffs() {
    this.activeBuffs = this.activeBuffs
      .map((b) => ({ ...b, turnsRemaining: b.turnsRemaining - 1 }))
      .filter((b) => b.turnsRemaining > 0);
  }
}
