# Monopoli Negeri Konoha 15×15
> Simulasi Board Game Satir Ekonomi-Politik Indonesia Multi-Perangkat via Wi-Fi Lokal

[`react`](https://github.com/topics/react) • [`typescript`](https://github.com/topics/typescript) • [`tailwind`](https://github.com/topics/tailwind) • [`socket-io`](https://github.com/topics/socket-io) • [`nodejs`](https://github.com/topics/nodejs) • [`express`](https://github.com/topics/express) • [`vite`](https://github.com/topics/vite) • [`board-game`](https://github.com/topics/board-game) • [`multiplayer`](https://github.com/topics/multiplayer)

---

## 1. Ikhtisar Proyek

**Monopoli Negeri Konoha** adalah adaptasi papan monopoli digital berukuran besar $15 \times 15$ (56 petak keliling) yang mengadopsi dinamika satir ekonomi-politik Indonesia. Proyek ini dirancang untuk dimainkan secara multi-perangkat melalui jaringan Wi-Fi lokal (*Local Area Network*) tanpa memerlukan instalasi aplikasi tambahan pada gawai pemain.

### Arsitektur Dual-View
1. **Host Screen (`/`):** Layar monitor utama (PC, laptop, atau Smart TV) yang menampilkan papan 15×15, animasi pion, status Brankas Kas Negara (APBN Pool), lemparan dadu, berita kilat (*Breaking News*), dan QR Code pairing.
2. **Mobile Controller (`/play`):** Antarmuka kendali ponsel cerdas berbasis sentuhan (*Thumb-Zone Optimized*), getaran haptik (*tactile vibration*), pengelolaan portofolio properti, pelunasan jaminan rutan, dan tombol aksi lempar dadu.

---

## 2. Fitur & Mekanisme Permainan

- **Geometri Papan 15×15 (56 Petak):**
  - **4 Sudut Khusus:** CAIR ANGGARAN (START), RUTAN KPK (Penjara), CAIR APBN / BANSOS (Free Parking), dan TERJARING OTT KPK.
  - **Sektor Tematik:** UMKM Pinggiran, Industri & Pelabuhan, Sawit & Tambang, Wisata Elit, serta Pusat Oligarki & IKN.
  - **Utilitas & Pajak:** PLN Listrik Negara, Pertamina B40, Kereta Cepat Whoosh, Bea Cukai, Iuran Tapera, dan Parkir Liar Minimarket.
- **Brankas Kas Negara (APBN Pool):**
  - Setiap pemain yang melewati petak START dikenakan potongan otomatis 10% (Rp 200.000) untuk setoran Kas Negara.
  - Pembayaran denda audit DJP, cukai, dan pungli masuk ke dalam pool APBN.
  - Pemain yang mendarat tepat di petak **CAIR APBN / BANSOS** berhak menguras seluruh saldo Kas Negara yang terkumpul.
- **32 Kartu Event Satir:**
  - 16 Kartu Kebijakan Pemerintah (Dana Umum).
  - 16 Kartu Lobi Orang Dalam (Kesempatan).
  - Dilengkapi logika dinamis berbasis kepemilikan aset (*sector penalty/reward*) dan mitigasi fallback balance.
- **Pion Satir Khas Republik:**
  - Mobil Rubicon Hitam (Pelat Nomor Cantik)
  - Kursi Roda Sakit Mendadak (Amnesia Sidang Tipikor)
  - Truk Sawit ODOL (Muatan Menggunung)
  - Motor Matic Emak-Emak (Sein Kanan Belok Kiri)
  - Koper Hitam Dana Taktis (Pecahan Seratus Ribu)
  - Rompi Oranye KPK (Senyum Lambaikan Tangan)
- **Zero External Assets Synthesizer:** Efek suara retro dadu, register kas, sirine penangkapan KPK, dan bel peringatan dibangkitkan langsung via Web Audio API browser tanpa dependensi file audio eksternal.

---

## 3. Struktur Direktori

```text
monopoli-negeri-konoha/
├── client/                     # Frontend React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/
│   │   │   ├── controller/     # Layar kendali mobile (ActionPad, WalletCard, JoinRoom)
│   │   │   └── host/           # Layar monitor utama (BoardGrid, CenterHub, TileCell, BreakingNews)
│   │   ├── constants/          # Konfigurasi 56 petak dan 6 pion satir
│   │   ├── hooks/              # Socket.io client sync dan Web Audio API engine
│   │   └── types/              # Deklarasi antarmuka TypeScript lengkap
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend Node.js + Express + Socket.io authoritative engine
│   ├── src/
│   │   ├── constants/          # Master data 56 petak, 32 kartu, dan token
│   │   ├── models/             # GameState, Player, dan CardResolver logic
│   │   ├── socket/             # Handler event real-time Socket.io
│   │   ├── config.js           # Deteksi IP lokal LAN & generator QR Code
│   │   └── index.js            # Express server & static asset server
│   ├── tests/                  # Unit tests & E2E multiplayer integration tests
│   └── package.json
├── docs/                       # PRD dan dokumen perencanaan arsitektur
├── package.json                # Monorepo root scripts
└── README.md
```

---

## 4. Panduan Instalasi & Menjalankan

### Prasyarat
- Node.js versi 18 atau lebih baru.
- Seluruh perangkat (Host PC dan Ponsel Pemain) terhubung pada jaringan Wi-Fi / Hotspot lokal yang sama.

### Langkah Menjalankan

1. **Pasang Dependensi:**
   ```bash
   cd monopoli-negeri-konoha
   npm run build
   ```

2. **Jalankan Server Monopoli:**
   ```bash
   npm start
   ```

3. **Akses Permainan:**
   - **Pada Komputer Host:** Buka browser di `http://localhost:3001` (atau `http://localhost:5173` dalam mode pengembangan).
   - **Pada Ponsel Pemain:** Pindai kode QR yang tampil di tengah papan layar Host, atau masukkan alamat IP yang tertera (contoh: `http://192.168.0.100:3001/play`).

---

## 5. Verifikasi & Pengujian

Suite pengujian mencakup validasi konsistensi data petak, kalkulasi sewa, resolver efek kartu, serta aliran integrasi multi-koneksi Socket.io secara menyeluruh:

```bash
npm test
```

Hasil verifikasi:
```text
✔ Board 15x15 Constants Validation (2.234ms)
✔ Satirical Event Cards Validation (0.2722ms)
✔ Satirical Tokens Validation (0.1968ms)
✔ E2E Multiplayer Socket.io Flow (78.4578ms)
✔ GameState - Player Management & Start Game (18.7578ms)
✔ GameState - Passing START with Tapera Cut (1.2244ms)
✔ GameState - Free Parking Drains Kas Negara Pool (3.5374ms)
✔ CardResolver - Dynamic Sector Penalty vs Fallback (2.5932ms)
✔ GameState - Rent in Jail has 20% Luxury Cell Cut (1.0412ms)
ℹ tests 9
ℹ pass 9
ℹ fail 0
```

---

## 6. Lisensi

Hak Cipta (c) 2026 pranataa-labs. Didistribusikan di bawah Lisensi MIT.
