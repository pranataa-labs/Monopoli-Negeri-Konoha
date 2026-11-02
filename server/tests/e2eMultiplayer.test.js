import test from "node:test";
import assert from "node:assert";
import http from "node:http";
import express from "express";
import { Server } from "socket.io";
import { io as ClientIO } from "socket.io-client";
import { registerGameHandlers } from "../src/socket/gameHandler.js";

test("E2E Multiplayer Socket.io Flow", async (t) => {
  // Setup ephemeral test server
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    registerGameHandlers(io, socket);
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const serverUrl = `http://localhost:${port}`;

  const roomId = "TEST-ROOM-99";

  // Connect Host Client
  const hostSocket = ClientIO(serverUrl, { transports: ["websocket"] });
  // Connect Player 1 Client
  const p1Socket = ClientIO(serverUrl, { transports: ["websocket"] });
  // Connect Player 2 Client
  const p2Socket = ClientIO(serverUrl, { transports: ["websocket"] });

  await new Promise((resolve) => {
    let connected = 0;
    const check = () => {
      connected++;
      if (connected === 3) resolve();
    };
    hostSocket.on("connect", check);
    p1Socket.on("connect", check);
    p2Socket.on("connect", check);
  });

  // Step 1: Host requests initial state
  await new Promise((resolve) => {
    hostSocket.emit("room:get_state", { roomId });
    hostSocket.on("game:snapshot", (snapshot) => {
      if (snapshot.roomId === roomId && snapshot.status === "LOBBY") {
        resolve();
      }
    });
  });

  // Step 2: Player 1 Joins
  await new Promise((resolve) => {
    p1Socket.emit("player:join", {
      roomId,
      name: "Juragan CPO",
      tokenId: "token_odol",
    });
    p1Socket.on("player:joined_success", (data) => {
      assert.strictEqual(data.player.name, "Juragan CPO");
      assert.strictEqual(data.player.token.id, "token_odol");
      resolve();
    });
  });

  // Step 3: Player 2 Joins
  await new Promise((resolve) => {
    p2Socket.emit("player:join", {
      roomId,
      name: "Taipan SCBD",
      tokenId: "token_rubicon",
    });
    p2Socket.on("player:joined_success", (data) => {
      assert.strictEqual(data.player.name, "Taipan SCBD");
      assert.strictEqual(data.player.token.id, "token_rubicon");
      resolve();
    });
  });

  // Step 4: Start Game
  await new Promise((resolve) => {
    hostSocket.emit("game:start", { roomId });
    hostSocket.on("game:started", (data) => {
      assert.ok(data.firstPlayer);
      resolve();
    });
  });

  // Clean up
  hostSocket.disconnect();
  p1Socket.disconnect();
  p2Socket.disconnect();
  await new Promise((resolve) => server.close(resolve));
});
