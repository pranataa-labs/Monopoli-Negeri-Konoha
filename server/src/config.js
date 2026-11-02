import os from "os";
import QRCode from "qrcode";

export const PORT = process.env.PORT || 3001;
export const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

/**
 * Mendapatkan IP Address lokal Wi-Fi/LAN mesin Host
 */
export function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Lewati IPv6 dan internal 127.0.0.1
      if (iface.family === "IPv4" && !iface.internal) {
        // Prioritaskan Wi-Fi atau Ethernet
        if (
          name.toLowerCase().includes("wi-fi") ||
          name.toLowerCase().includes("wlan") ||
          name.toLowerCase().includes("ethernet") ||
          name.toLowerCase().includes("local")
        ) {
          return iface.address;
        }
      }
    }
  }

  // Fallback ke alamat IPv4 non-internal pertama yang ditemukan
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "127.0.0.1";
}

/**
 * Menghasilkan URL join dan QR Code data URL untuk ponsel pemain
 */
export async function getNetworkConfig(roomId = "KONOHA-01") {
  const localIp = getLocalIp();
  // Dalam development, client berjalan di CLIENT_PORT (misal 5173)
  // Dalam production, client diserve langsung oleh express di PORT
  const portToUse = process.env.NODE_ENV === "production" ? PORT : CLIENT_PORT;
  const joinUrl = `http://${localIp}:${portToUse}/play?room=${roomId}`;

  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await QRCode.toDataURL(joinUrl, {
      margin: 2,
      width: 256,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Gagal membuat QR Code:", err);
  }

  return {
    localIp,
    port: PORT,
    clientPort: portToUse,
    joinUrl,
    qrCodeDataUrl,
  };
}
