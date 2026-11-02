/**
 * Socket.io Event Handler for Monopoli Negeri Konoha.
 */

import { GameState } from "../models/GameState.js";
import { TOKENS } from "../constants/tokens.js";

// Multi-room state store
const rooms = new Map();

export function getOrCreateGame(roomId = "KONOHA-01") {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new GameState(roomId));
  }
  return rooms.get(roomId);
}

export function registerGameHandlers(io, socket) {
  let currentRoomId = "KONOHA-01";
  let currentPlayerId = null;

  // 1. Minta Snapshot State Saat Ini
  socket.on("room:get_state", ({ roomId = "KONOHA-01" } = {}) => {
    currentRoomId = roomId;
    socket.join(roomId);
    const game = getOrCreateGame(roomId);
    socket.emit("game:snapshot", game.getPublicSnapshot());
  });

  // 2. Pemain Bergabung (Mobile Controller)
  socket.on("player:join", ({ roomId = "KONOHA-01", name, tokenId }) => {
    try {
      currentRoomId = roomId;
      socket.join(roomId);
      const game = getOrCreateGame(roomId);

      // Cari token yang dipilih
      const token = TOKENS.find((t) => t.id === tokenId) || TOKENS[game.players.length % TOKENS.length];

      // Periksa apakah token sudah dipakai pemain lain
      const tokenTaken = game.players.some((p) => p.token.id === token.id);
      if (tokenTaken) {
        socket.emit("game:error", { message: `Pion ${token.name} sudah dipilih pemain lain!` });
        return;
      }

      currentPlayerId = socket.id;
      const player = game.addPlayer({
        id: socket.id,
        name: name || `Konglomerat #${game.players.length + 1}`,
        token,
        color: token.color,
      });

      socket.emit("player:joined_success", { player });
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 3. Mulai Permainan (Host atau Pemain)
  socket.on("game:start", ({ roomId = currentRoomId } = {}) => {
    try {
      const game = getOrCreateGame(roomId);
      game.startGame();
      io.to(roomId).emit("game:started", { firstPlayer: game.getCurrentPlayer() });
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 4. Lempar Dadu
  socket.on("turn:roll_dice", ({ roomId = currentRoomId } = {}) => {
    try {
      const game = getOrCreateGame(roomId);
      const activePlayer = game.getCurrentPlayer();
      if (!activePlayer || activePlayer.id !== socket.id) {
        socket.emit("game:error", { message: "Bukan giliran Anda untuk melempar dadu!" });
        return;
      }

      const rollResult = game.rollDice();
      io.to(roomId).emit("turn:dice_rolled", {
        playerId: activePlayer.id,
        rollResult,
        activeCardEvent: game.activeCardEvent,
      });
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 5. Beli Petak Properti Saat Ini
  socket.on("turn:buy_property", ({ roomId = currentRoomId } = {}) => {
    try {
      const game = getOrCreateGame(roomId);
      const res = game.buyCurrentTile(socket.id);
      io.to(roomId).emit("property:purchased", res);
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 6. Tingkatkan Bangunan Properti (Ruko -> Pasar / Kebun -> Pabrik CPO)
  socket.on("turn:upgrade_property", ({ roomId = currentRoomId, tileId }) => {
    try {
      const game = getOrCreateGame(roomId);
      const res = game.upgradeTile(socket.id, tileId);
      io.to(roomId).emit("property:upgraded", res);
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 7. Bayar Jaminan Rutan KPK (Rp 500.000)
  socket.on("jail:pay_bail", ({ roomId = currentRoomId } = {}) => {
    try {
      const game = getOrCreateGame(roomId);
      game.payJailBail(socket.id);
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 8. Pakai Kartu Sakti Bebas KPK
  socket.on("jail:use_pass", ({ roomId = currentRoomId } = {}) => {
    try {
      const game = getOrCreateGame(roomId);
      game.useJailPass(socket.id);
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 9. Selesaikan Giliran
  socket.on("turn:end", ({ roomId = currentRoomId } = {}) => {
    try {
      const game = getOrCreateGame(roomId);
      const activePlayer = game.getCurrentPlayer();
      if (!activePlayer || activePlayer.id !== socket.id) {
        socket.emit("game:error", { message: "Bukan giliran Anda!" });
        return;
      }
      if (!game.hasRolled && !activePlayer.inJail) {
        socket.emit("game:error", { message: "Anda harus melempar dadu terlebih dahulu!" });
        return;
      }

      const turnResult = game.endTurn();
      io.to(roomId).emit("turn:ended", turnResult);
      io.to(roomId).emit("game:snapshot", game.getPublicSnapshot());
    } catch (err) {
      socket.emit("game:error", { message: err.message });
    }
  });

  // 10. Disconnect
  socket.on("disconnect", () => {
    if (currentPlayerId && currentRoomId) {
      const game = rooms.get(currentRoomId);
      if (game) {
        game.removePlayer(currentPlayerId);
        io.to(currentRoomId).emit("game:snapshot", game.getPublicSnapshot());
      }
    }
  });
}
