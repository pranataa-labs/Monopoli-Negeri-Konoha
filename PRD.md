# Product Requirements Document (PRD)
**Nama Proyek (Working Title):** Monopoli Negeri Konoha: Edisi Pajak, Sawit & Orang Dalam  
**Genre:** Digital Board Game / Political & Economic Satire / Multiplayer Strategy  
**Platform Target:** Web (Browser/Mobile Web), PC, atau Mobile (Android/iOS)  
**Status Dokumen:** Draft 1.0  

---

## 1. Visi & Gambaran Umum Produk (Product Overview)
Game ini adalah adaptasi papan permainan strategi ekonomi klasik (seperti Monopoli) yang dibalut dengan satir sosial-politik, ekonomi, birokrasi, pajak, dan industri ekstraktif (sawit/tambang) yang sedang viral di Indonesia. 

Fokus utama dalam rekayasa sistem game ini adalah **Sinkronisasi Dinamis antara Wilayah Papan (*Board Sectors*) dan Kartu Kejadian (*Event Cards*)**. Berbeda dengan Monopoli standar di mana kartu hanya memotong/menambah uang secara statis, dalam game ini efek kartu akan bereaksi langsung terhadap portofolio sektor properti yang dimiliki pemain (misalnya: pemilik lahan sawit akan terdampak langsung oleh kartu regulasi CPO atau denda truk ODOL).

### Target Audiens
* **Demografi:** Usia 18–40 tahun di Indonesia (mahasiswa, pekerja kantoran, netizen aktif).
* **Psikografi:** Menyukai humor gelap/satir (*dark jokes*), mengikuti isu viral nasional, menyukai *party games* kasual untuk dimainkan bersama teman (tongkrongan/discord).

---

## 2. Mekanisme Utama Permainan (Core Gameplay Mechanics)

### 2.1. Parameter Ekonomi Awal
* **Jumlah Pemain:** 2 – 6 Pemain.
* **Modal Awal (Uang Pangkal):** Rp 15.000.000 per pemain.
* **Gaji Lewat START ("Pencairan Anggaran"):** Rp 2.000.000, namun **otomatis dipotong PPh 21 & Tapera sebesar 10% (Rp 200.000)** yang langsung masuk ke *Kas Negara Pool*. Pemain hanya menerima bersih Rp 1.800.000.

### 2.2. Sistem "Kas Negara Pool" (Global Tax Pool)
* Seluruh uang denda dari kartu pajak, pungli, bea cukai, dan potongan gaji **tidak hangus ke Bank**, melainkan ditampung dalam variabel global `kas_negara_pool` yang nominalnya ditampilkan secara *real-time* di tengah papan.
* Uang di dalam `kas_negara_pool` dapat dikuras oleh pemain yang mendarat di petak **"Pencairan Proyek APBN / Bansos"** (menggantikan Parkir Bebas) atau melalui kartu khusus **"Menang Tender Kementerian"**.

### 2.3. Sistem Upgrade Properti Berbasis Sektor
Istilah "Rumah" dan "Hotel" diganti mengikuti `sector_tag` wilayah untuk meningkatkan imersi:
* **Sektor UMKM & Pinggiran:** Ruko $\rightarrow$ Pasar Grosir
* **Sektor Industri & Pelabuhan:** Gudang Logistik $\rightarrow$ Kawasan Berikat
* **Sektor Sawit & Tambang:** Kebun Plasma $\rightarrow$ Pabrik CPO / Smelter
* **Sektor Wisata Elit:** Villa Privat $\rightarrow$ Resort Bintang 5
* **Sektor Oligarki & Kekuasaan:** Gedung Perkantoran $\rightarrow$ Menara Konglomerasi

### 2.4. Mekanisme "Rutan KPK" (Penjara)
Pemain masuk ke Rutan KPK jika mendarat di petak "OTT KPK", mendapat kartu tangkap tangan, atau lempar dadu kembar 3 kali berturut-turut (dianggap mencurigakan/pencucian uang).
* **Cara Keluar:**
  1. Menggunakan kartu *"Kenalan Orang Dalam"* (Bebas Penjara).
  2. Membayar *"Uang Jaminan & Pengacara Kondang"* sebesar Rp 500.000 ke Kas Negara.
  3. Pura-pura sakit pakai kursi roda (menunggu 3 giliran sambil mencoba dadu kembar).
* **Twist Satir:** Selama di dalam Rutan KPK, pemain **masih tetap bisa memungut uang sewa** dari properti miliknya (karena bisnis tetap jalan lewat kaki tangan), namun dipotong biaya "sewa sel fasilitas mewah" sebesar 20% dari setiap sewa yang diterima.

---

## 3. Arsitektur Papan Permainan (40 Petak Wilayah)

Berikut adalah pemetaan lengkap 40 petak papan dari indeks `0` hingga `39` beserta pengelompokan sektornya:

| Indeks | Nama Petak | Kategori / Warna | Sector Tag (`sector_tag`) | Harga Dasar |
| :--- | :--- | :--- | :--- | :--- |
| **0** | **CAIR ANGGARAN (START)** | Petak Sudut | `SPECIAL_START` | - |
| 1 | Pasar Tanah Abang | Cokelat | `UMKM_PINGGIRAN` | Rp 600.000 |
| 2 | Kebijakan Pemerintah | Kartu Dana Umum | `CARD_GOVERNMENT` | - |
| 3 | Cibaduyut Bandung | Cokelat | `UMKM_PINGGIRAN` | Rp 600.000 |
| 4 | Kantor Pajak Pratama (DJP) | Pajak (Bayar Rp 1 Jt) | `TAX_TILE` | - |
| 5 | Pelabuhan Merak | BUMN Transportasi | `BUMN_TRANSPORT` | Rp 2.000.000 |
| 6 | Margonda Depok | Biru Muda | `UMKM_PINGGIRAN` | Rp 1.000.000 |
| 7 | Lobi Orang Dalam | Kartu Kesempatan | `CARD_INSIDER` | - |
| 8 | Tambun Bekasi | Biru Muda | `UMKM_PINGGIRAN` | Rp 1.000.000 |
| 9 | Pasar Klewer Solo | Biru Muda | `UMKM_PINGGIRAN` | Rp 1.200.000 |
| **10** | **RUTAN KPK (Penjara/Besuk)** | Petak Sudut | `SPECIAL_JAIL` | - |
| 11 | Kawasan Industri Cikarang | Merah Muda | `INDUSTRI_PELABUHAN` | Rp 1.400.000 |
| 12 | PLN (Listrik Negara) | Utilitas BUMN | `BUMN_UTILITY` | Rp 1.500.000 |
| 13 | Pabrik Tekstil Karawang | Merah Muda | `INDUSTRI_PELABUHAN` | Rp 1.400.000 |
| 14 | Pelabuhan Tanjung Perak | Merah Muda | `INDUSTRI_PELABUHAN` | Rp 1.600.000 |
| 15 | Tol Trans-Jawa | BUMN Transportasi | `BUMN_TRANSPORT` | Rp 2.000.000 |
| 16 | Kawasan Bebas Batam | Oranye | `INDUSTRI_PELABUHAN` | Rp 1.800.000 |
| 17 | Kebijakan Pemerintah | Kartu Dana Umum | `CARD_GOVERNMENT` | - |
| 18 | Pelabuhan Tanjung Priok | Oranye | `INDUSTRI_PELABUHAN` | Rp 1.800.000 |
| 19 | Kawasan Industri Gresik | Oranye | `INDUSTRI_PELABUHAN` | Rp 2.000.000 |
| **20** | **CAIR PROYEK APBN / BANSOS** | Petak Sudut | `SPECIAL_FREEPARKING` | - |
| 21 | Kebun Sawit Riau | Merah | `SAWIT_TAMBANG` | Rp 2.200.000 |
| 22 | Lobi Orang Dalam | Kartu Kesempatan | `CARD_INSIDER` | - |
| 23 | Lahan Sawit Kalimantan Tengah | Merah | `SAWIT_TAMBANG` | Rp 2.200.000 |
| 24 | Perkebunan Sawit Jambi | Merah | `SAWIT_TAMBANG` | Rp 2.400.000 |
| 25 | Kereta Cepat Whoosh | BUMN Transportasi | `BUMN_TRANSPORT` | Rp 2.000.000 |
| 26 | Tambang Batu Bara Kaltim | Kuning | `SAWIT_TAMBANG` | Rp 2.600.000 |
| 27 | Kawasan Nikel Morowali | Kuning | `SAWIT_TAMBANG` | Rp 2.600.000 |
| 28 | Pertamina (Kilang & B40) | Utilitas BUMN | `BUMN_UTILITY` | Rp 1.500.000 |
| 29 | Tambang Emas Papua | Kuning | `SAWIT_TAMBANG` | Rp 2.800.000 |
| **30** | **TERJARING OTT KPK!** | Petak Sudut | `SPECIAL_GOTOJAIL` | - |
| 31 | Sirkuit Mandalika | Hijau | `WISATA_ELIT` | Rp 3.000.000 |
| 32 | Labuan Bajo | Hijau | `WISATA_ELIT` | Rp 3.000.000 |
| 33 | Kebijakan Pemerintah | Kartu Dana Umum | `CARD_GOVERNMENT` | - |
| 34 | Canggu Bali | Hijau | `WISATA_ELIT` | Rp 3.200.000 |
| 35 | Bandara Soekarno-Hatta | BUMN Transportasi | `BUMN_TRANSPORT` | Rp 2.000.000 |
| 36 | Lobi Orang Dalam | Kartu Kesempatan | `CARD_INSIDER` | - |
| 37 | Kawasan SCBD Jakarta | Biru Tua | `PUSAT_OLIGARKI` | Rp 3.500.000 |
| 38 | Pemeriksaan Bea Cukai | Pajak (Bayar Rp 2 Jt) | `TAX_TILE` | - |
| 39 | IKN Nusantara (Inti Pemerintahan) | Biru Tua | `PUSAT_OLIGARKI` | Rp 4.000.000 |

---

## 4. Katalog Kartu & Matriks Sinkronisasi Wilayah

Kartu dibagi menjadi 2 Dek:
1. **Dek Kebijakan Pemerintah (Dana Umum):** Berfokus pada pajak, birokrasi, bea cukai, dan nasib warga.
2. **Dek Lobi Orang Dalam (Kesempatan):** Berfokus pada konsesi sawit, proyek kementerian, korupsi, dan manuver politik.

### 4.1. Daftar Kartu "Kebijakan Pemerintah" (16 Kartu)

| ID | Teks Kartu | Tipe Aksi (`action_type`) | Target Sektor (`target_sector`) | Efek Utama | Efek Fallback (Jika Tak Punya Sektor Terkait) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GOV_01` | Lapor SPT Tahunan tepat waktu, ternyata ada kelebihan bayar dari kantor lama. Dapat restitusi pajak Rp 50.000. | `FLAT_GAIN` | `NONE` | +Rp 50.000 dari Bank | - |
| `GOV_02` | Beli barang receh dari luar negeri, kena palak Bea Cukai yang harganya lebih mahal dari barangnya sendiri. | `SECTOR_PENALTY` | `INDUSTRI_PELABUHAN` | -Rp 300.000 per properti `INDUSTRI_PELABUHAN` (Masuk Kas Negara) | Bayar Rp 150.000 ke Kas Negara |
| `GOV_03` | Kena imbas kenaikan PPN 12% dan iuran Tapera mendadak. Bayar pajak tambahan untuk setiap bangunan yang Anda miliki! | `PER_BUILDING_TAX` | `ALL` | -Rp 50.000 per upgrade level 1-4, -Rp 150.000 per level maksimal | Bayar Rp 50.000 pajak solidaritas |
| `GOV_04` | NIK KTP Anda belum dipadankan jadi NPWP, ditambah kena potong pajak natura gara-gara fasilitas kantor. | `FLAT_TAX` | `NONE` | -Rp 75.000 ke Kas Negara | - |
| `GOV_05` | Sistem aplikasi pajak seharga triliunan *down* pas hari terakhir lapor, tapi Anda yang disalahkan dan kena denda telat lapor. | `FLAT_TAX` | `NONE` | -Rp 300.000 ke Kas Negara | - |
| `GOV_06` | Truk angkutan buah sawit Anda ketahuan *overload* (ODOL) dan bikin jalan provinsi berlubang. Bayar denda tilang dan pajak alat berat! | `SECTOR_PENALTY` | `SAWIT_TAMBANG` | -Rp 250.000 per properti `SAWIT_TAMBANG` | Bayar Rp 100.000 (biaya benerin shockbreaker motor) |
| `GOV_07` | Jalanan depan ruko hancur dilindas truk tambang, pas komplain di medsos malah dilaporin pakai UU ITE. Bayar biaya cabut laporan! | `SECTOR_PENALTY` | `UMKM_PINGGIRAN` | -Rp 150.000 per properti `UMKM_PINGGIRAN` | Bayar Rp 100.000 biaya materai klarifikasi |
| `GOV_08` | Gaji Anda dipotong buat iuran ini-itu yang katanya 'demi kesejahteraan masa depan', tapi cairnya nunggu kiamat. | `PERCENT_CASH_TAX` | `NONE` | Potong 10% dari uang tunai saat ini ke Kas Negara | - |
| `GOV_09` | Pajak barang konsumsi dan hiburan naik lagi, sementara fasilitas pejabat makin mewah. Sumbang dana untuk beli mobil dinas baru! | `SECTOR_PENALTY` | `WISATA_ELIT` | -Rp 200.000 per properti `WISATA_ELIT` | Bayar Rp 50.000 per petak tanah apa saja yang dimiliki |
| `GOV_10` | Server Pusat Data Nasional kena *ransomware* dan gak ada *backup*, pejabatnya cuma bilang 'itu takdir'. Data sertifikat tanah Anda hilang, bayar urus ulang! | `PER_PROPERTY_TAX` | `ALL` | -Rp 50.000 untuk setiap sertifikat tanah yang dimiliki | Bayar Rp 50.000 biaya fotokopi KTP |
| `GOV_11` | Peti jenazah atau piala lomba dari luar negeri kena tagih bea masuk karena dianggap barang mewah. Bayar sambil mengelus dada. | `FLAT_TAX` | `NONE` | -Rp 300.000 ke Kas Negara | - |
| `GOV_12` | Token listrik bunyi 'tit-tit-tit' jam 2 pagi pas lagi dikejar *deadline*. Beli pulsa listrik darurat! | `UTILITY_INTERACTION` | `BUMN_UTILITY` | Bayar Rp 150.000 ke pemilik petak **PLN** (atau ke Kas Negara jika belum ada pemilik) | - |
| `GOV_13` | Bansos salah sasaran cair ke rekening Anda, langsung dipakai *checkout* keranjang belanja! | `POOL_SIPHON` | `NONE` | Ambil Rp 400.000 dari `kas_negara_pool` (atau dari Bank jika Kas Negara kurang) | - |
| `GOV_14` | Ikut program *Tax Amnesty* jilid kesekian. Pengemplang pajak triliunan dikasih karpet merah, UMKM salah hitung seribu rupiah dikejar sampai liang lahat. | `SECTOR_REWARD` | `PUSAT_OLIGARKI` | Jika punya properti `PUSAT_OLIGARKI` atau `SAWIT_TAMBANG`, terima +Rp 700.000. | Jika hanya punya `UMKM_PINGGIRAN`, bayar denda audit Rp 100.000! |
| `GOV_15` | Nomor HP Anda dicatut teman untuk kontak darurat pinjol ilegal. Diteror *debt collector* sampai pusing, bayar biaya ganti kartu. | `FLAT_TAX` | `NONE` | -Rp 75.000 ke Bank | - |
| `GOV_16` | Terpilih jadi Ketua RT/Satgas baru karena warga lain pura-pura batuk saat musyawarah. Kumpulkan 'dana koordinasi' dari setiap pemain. | `COLLECT_FROM_PLAYERS` | `NONE` | Terima +Rp 50.000 dari setiap pemain lain | - |

### 4.2. Daftar Kartu "Lobi Orang Dalam" (16 Kartu)

| ID | Teks Kartu | Tipe Aksi (`action_type`) | Target Sektor (`target_sector`) | Efek Utama | Efek Fallback (Jika Tak Punya Sektor Terkait) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `INS_01` | Lahan kebun sawit Anda yang tadinya 'nyasar' di kawasan hutan lindung berhasil diputihkan lewat program pengampunan pemerintah. Panen raya TBS! | `SECTOR_REWARD` | `SAWIT_TAMBANG` | Terima +Rp 500.000 untuk setiap properti `SAWIT_TAMBANG` yang dimiliki | Terima +Rp 200.000 sebagai makelar tanah |
| `INS_02` | Ikut rapat koordinasi pembahasan 'kemiskinan ekstrem' selama 3 hari 2 malam di resort bintang lima Bali. Pulang bawa uang saku perjalanan dinas! | `TELEPORT_AND_REWARD` | `WISATA_ELIT` | Pindah ke **Canggu Bali**. Terima uang saku +Rp 350.000. | - |
| `INS_03` | Pamer harta (*flexing*) mobil Rubicon dan tas mewah di medsos, padahal laporan LHKPN minus. Langsung diciduk KPK! | `GO_TO_JAIL` | `NONE` | Langsung pindah ke **Rutan KPK**. Tidak lewat START. | - |
| `INS_04` | Proyek pengadaan biodiesel B40 berbahan dasar minyak sawit Anda menang tender kementerian. | `SECTOR_SYNERGY` | `BUMN_UTILITY` | Jika punya **Pertamina** atau `SAWIT_TAMBANG`, terima +Rp 600.000. | Terima *fee* proyek +Rp 250.000 |
| `INS_05` | Lahan hutan lindung tiba-tiba berubah status jadi 'kebun sawit rakyat' yang ternyata milik korporasi Anda sendiri. Terima subsidi pupuk dan peremajaan! | `SECTOR_REWARD` | `SAWIT_TAMBANG` | Terima +Rp 800.000 jika punya minimal 1 properti `SAWIT_TAMBANG` | Terima +Rp 150.000 dana sosialisasi |
| `INS_06` | Anak Anda gak sengaja upload foto liburan naik jet pribadi buat 'beli roti'. Netizen ngamuk dan ngulik pajak perusahaan Anda. Bayar jasa buzzer! | `SECTOR_PENALTY` | `PUSAT_OLIGARKI` | Jika punya properti `PUSAT_OLIGARKI`, bayar Rp 600.000. | Bayar jasa buzzer Rp 250.000 |
| `INS_07` | Selamat! Anda lolos seleksi Komisaris BUMN jalur 'tim sukses'. Gak perlu tahu bedanya minyak sawit dan minyak kayu putih, yang penting terima tantiem! | `SECTOR_REWARD` | `BUMN_TRANSPORT` | Terima +Rp 400.000 per aset `BUMN_TRANSPORT` atau `BUMN_UTILITY` | Terima gaji buta +Rp 500.000 |
| `INS_08` | Bikin aplikasi pemerintah modal *template* gratisan dengan nama singkatan yang maksa banget, tapi anggaran proyeknya tembus miliaran. | `POOL_SIPHON` | `NONE` | Kuras 50% isi `kas_negara_pool` (Maksimal Rp 1.000.000, minimal dapat Rp 300.000 dari Bank) | - |
| `INS_09` | Ekspor CPO (minyak sawit mentah) dilarang pagi ini, tapi sorenya dibuka lagi karena 'sudah berkoordinasi'. Anda yang dapat bocoran orang dalam panen cuan! | `SECTOR_BUFF` | `SAWIT_TAMBANG` | Terima +Rp 500.000, dan sewa seluruh properti `SAWIT_TAMBANG` milikmu naik 2x lipat selama 1 putaran! | Terima +Rp 300.000 dari *insider trading* saham sawit |
| `INS_10` | Audit BPK menemukan 'kelebihan bayar' pada proyek pengadaan bibit sawit fiktif Anda. Untung bisa diselesaikan secara kekeluargaan. Setor uang tutup mulut! | `FLAT_TAX` | `NONE` | Bayar Rp 400.000 ke Kas Negara | - |
| `INS_11` | Menang tender pengadaan gorden dan kalender kementerian dengan harga *mark-up* gak ngotak. Cairkan anggaran! | `FLAT_GAIN` | `NONE` | Terima +Rp 450.000 | - |
| `INS_12` | Minyak goreng langka di pasaran padahal negara penghasil sawit terbesar di dunia. Anda tertangkap basah nimbun 500 dus di gudang belakang! | `GO_TO_JAIL` | `NONE` | Masuk **Rutan KPK** sekarang juga! | - |
| `INS_13` | Studi banding pengelolaan pajak dan sawit ke Eropa bareng keluarga besar berkedok 'kunjungan kerja'. Tagih patungan dari setiap pemain sebagai 'pajak rakyat'. | `COLLECT_FROM_PLAYERS` | `NONE` | Terima +Rp 75.000 dari setiap pemain lain | - |
| `INS_14` | Bikin regulasi kilat dalam semalam demi meloloskan izin konsesi tambang dan sawit milik besan. Dapat 'tanda terima kasih' dan pindah ke pusat kekuasaan! | `TELEPORT_AND_REWARD` | `PUSAT_OLIGARKI` | Maju ke **IKN Nusantara**, terima +Rp 500.000 (Jika melewati START, dapat gaji juga). | - |
| `INS_15` | Ketahuan jadi makelar kasus pajak kelas kakap. Karena panik, Anda pura-pura sakit keras, pakai kursi roda, dan mendadak religius pas konferensi pers. | `GO_TO_JAIL` | `NONE` | Tetap masuk **Rutan KPK** sekarang juga! | - |
| `INS_16` | Kartu Sakti: "Kenalan Pejabat Tinggi". Simpan kartu ini untuk bebas dari Rutan KPK kapan saja, atau jual ke pemain lain yang sedang panik. | `KEEP_JAIL_FREE` | `NONE` | Masuk ke inventaris pemain (`has_insider_pass = true`) | - |

---

## 5. Spesifikasi Teknis & Struktur Data (Technical Architecture)

Untuk mempermudah implementasi di *game engine* (Unity/Godot/Web JS), gunakan struktur objek berikut:

### 5.1. Struktur Data Pemain (`PlayerState`)
```json
{
  "player_id": "p1",
  "name": "Bapak Komisaris",
  "cash": 15000000,
  "position_index": 0,
  "in_jail": false,
  "jail_turns": 0,
  "has_insider_pass": false,
  "owned_properties": ["prop_01", "prop_21", "prop_23"],
  "active_buffs": [
    {
      "sector": "SAWIT_TAMBANG",
      "rent_multiplier": 2.0,
      "turns_remaining": 1
    }
  ]
}
```

### 5.2. Algoritma Resolusi Kartu (`CardResolverEngine`)
Saat pemain mendarat di petak kartu (`CARD_GOVERNMENT` atau `CARD_INSIDER`), sistem mengeksekusi fungsi berikut (ditulis dalam *pseudocode* TypeScript):

```typescript
function executeCard(player: PlayerState, card: EventCard, board: BoardState) {
  // 1. Cek kepemilikan properti di sektor target kartu
  const matchingProperties = player.owned_properties.filter(
    (propId) => board.getTile(propId).sector_tag === card.target_sector
  );

  switch (card.action_type) {
    case "SECTOR_PENALTY":
      if (matchingProperties.length > 0) {
        const totalPenalty = matchingProperties.length * Math.abs(card.amount);
        player.cash -= totalPenalty;
        board.kas_negara_pool += totalPenalty;
      } else {
        // Eksekusi Fallback jika tidak punya properti di sektor tersebut
        player.cash -= Math.abs(card.fallback_amount);
        board.kas_negara_pool += Math.abs(card.fallback_amount);
      }
      break;

    case "SECTOR_REWARD":
      if (matchingProperties.length > 0) {
        const totalReward = matchingProperties.length * card.amount;
        player.cash += totalReward;
      } else {
        player.cash += card.fallback_amount;
      }
      break;

    case "POOL_SIPHON":
      const siphonAmount = Math.min(board.kas_negara_pool * 0.5, 1000000);
      if (siphonAmount > 300000) {
        board.kas_negara_pool -= siphonAmount;
        player.cash += siphonAmount;
      } else {
        player.cash += 300000; // Subsidi talangan Bank
      }
      break;

    case "GO_TO_JAIL":
      player.position_index = 10; // Indeks Rutan KPK
      player.in_jail = true;
      break;
  }
}
```

---

## 6. Panduan Visual, UI/UX & Audio (Art Direction)

1. **Gaya Visual (Art Style):**
   * Karikatur satir bergaya poster propaganda retro atau ilustrasi komik koran Indonesia.
   * **Token Pion Pemain (6 Karakter):**
     1. *Mobil Rubicon Hitam* (Pelat nomor cantik).
     2. *Kursi Roda Rumah Sakit* (Simbol tersangka korupsi mendadak sakit).
     3. *Truk Sawit ODOL* (Muatan menggunung miring ke kiri).
     4. *Motor Matic Emak-Emak* (Lampu sein kanan menyala terus).
     5. *Koper Hitam Isi Uang Tunai* (Simbol dana taktis).
     6. *Rompi Oranye KPK*.
2. **Desain Antarmuka (UI):**
   * Di bagian tengah papan, tampilkan animasi **"Brankas Kas Negara / APBN"** yang makin menggembung saat pemain membayar denda pajak/bea cukai.
   * Saat kartu ditarik, tampilkan *pop-up* menyerupai **"Breaking News TV Nasional"** atau **"Surat Panggilan Resmi / Amplop Cokelat"**.
3. **Efek Suara (SFX):**
   * Bayar Pajak / Denda: Suara sirine atau suara tangisan dompet/kantung koin jatuh.
   * Dapat Kartu Orang Dalam: Suara bisik-bisik konspirasi diikuti suara mesin penghitung uang (*"Cring!"*).
   * Masuk Rutan KPK: Suara peluit atau borgol besi menutup.

---

## 7. Roadmap Pengembangan (MVP Milestones)

* **Fase 1: Prototype Core Loop (Minggu 1-2)**
  * Implementasi papan 40 petak berbasis teks/grid sederhana.
  * Sistem dadu, giliran, beli tanah, bayar sewa, dan *Kas Negara Pool*.
* **Fase 2: Integrasi Card Engine & Sektor (Minggu 3)**
  * Memasukkan database JSON 32 kartu dan menguji logika `SECTOR_PENALTY` serta `SECTOR_REWARD`.
* **Fase 3: UI/UX & Polish Satir (Minggu 4)**
  * Desain papan visual, animasi pop-up kartu, dan pengujian keseimbangan ekonomi (*balancing* agar pemain tidak terlalu cepat bangkrut atau terlalu cepat kaya dari sawit).