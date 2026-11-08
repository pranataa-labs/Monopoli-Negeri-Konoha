import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { PORT, getNetworkConfig } from "./config.js";
import { registerGameHandlers } from "./socket/gameHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// REST Endpoint: Informasi Jaringan Lokal & QR Code
app.get("/api/network", async (req, res) => {
  const roomId = req.query.room || "KONOHA-01";
  const networkInfo = await getNetworkConfig(roomId);
  res.json(networkInfo);
});

// REST Endpoint: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: Date.now() });
});

// Sajikan static client jika folder ../client/dist tersedia
const clientDistPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDistPath, {
  etag: false,
  maxAge: 0,
}));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("Monopoli Negeri Konoha Server Running. Vite client dev server runs on port 5173.");
    }
  });
});

// Register Socket.io events
io.on("connection", (socket) => {
  registerGameHandlers(io, socket);
});

server.listen(PORT, "0.0.0.0", async () => {
  const config = await getNetworkConfig("KONOHA-01");
  console.log(`[SERVER] Monopoli Negeri Konoha Server aktif di port ${PORT}`);
  console.log(`[NETWORK] IP Lokal Host: ${config.localIp}`);
  console.log(`[NETWORK] Join URL: ${config.joinUrl}`);
});
