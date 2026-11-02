# Monopoli Negeri Konoha 15×15 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Build an interactive, real-time, local Wi-Fi multiplayer Monopoly game based on the satirical Indonesian political-economy theme (*Negeri Konoha: Edisi Pajak, Sawit & Orang Dalam*). Features a 15×15 grid (56 perimeter tiles), dynamic sector-event synchronization, `kas_negara_pool` global tax bank, 32 satirical event cards, dual-view architecture (Host Board Display + Mobile Touch Controller), and automatic local Wi-Fi QR pairing.

---

## File Structure & System Architecture

```
monopoli-negeri-konoha/
├── docs/
│   ├── PRD.md                       # Official Product Requirements Document
│   └── plans/
│       └── 2026-11-02-monopoli-negeri-konoha-15x15.md
├── server/                          # Real-Time WebSocket Backend (Node.js + Express + Socket.io)
│   ├── src/
│   │   ├── config.js                # Server ports, local IP detection, QR generator
│   │   ├── constants/
│   │   │   ├── tiles.js             # 56 perimeter tiles data (sectors, prices, upgrade rules)
│   │   │   ├── cards.js             # 32 event cards (16 Government + 16 Insider)
│   │   │   └── tokens.js            # 6 satirical tokens (Rubicon, Kursi Roda, ODOL, etc.)
│   │   ├── models/
│   │   │   ├── GameState.js         # Authoritative state machine
│   │   │   ├── Player.js            # Player entity, portfolio, cash, jail tracking
│   │   │   └── CardResolver.js      # Sector-card dynamic synergy & penalty engine
│   │   ├── socket/
│   │   │   └── gameHandler.js       # Socket.io event listeners & broadcast logic
│   │   └── index.js                 # HTTP & WebSocket entrypoint
│   └── package.json
├── client/                          # React 19 + TypeScript + Vite + Tailwind CSS v4 Frontend
│   ├── public/
│   │   └── sfx/                     # Web Audio synth / audio cues
│   ├── src/
│   │   ├── types/
│   │   │   └── game.ts              # TypeScript schemas for game state, tiles, cards
│   │   ├── components/
│   │   │   ├── host/                # Host Big Board (Laptop / TV 16:9 view)
│   │   │   │   ├── BoardGrid.tsx    # 15×15 CSS Grid perimeter renderer
│   │   │   │   ├── TileCell.tsx     # Individual tile card with color group & badge
│   │   │   │   ├── CenterHub.tsx    # Brankas APBN animation, Dice, QR code, News
│   │   │   │   ├── PlayerToken.tsx  # Smooth moving pion on 15×15 coordinate matrix
│   │   │   │   └── BreakingNews.tsx # Satirical card pop-up overlay
│   │   │   ├── controller/          # Mobile Controller View (Smartphones via QR code)
│   │   │   │   ├── JoinRoom.tsx     # Mobile onboarding & token selection
│   │   │   │   ├── ActionPad.tsx    # Big tactile roll button & haptic controls
│   │   │   │   ├── WalletCard.tsx   # Player cash, tax burden & properties portfolio
│   │   │   │   └── PropertyDeed.tsx # Modal for mortgage / house & hotel upgrades
│   │   │   └── ui/                  # Atomic buttons, dialogs, badges
│   │   ├── hooks/
│   │   │   ├── useSocket.ts         # Socket.io client connector with auto-reconnect
│   │   │   ├── useAudio.ts          # Web Audio synthesizer for rolling, cash, sirens
│   │   │   └── useHaptic.ts         # Mobile vibration API triggers
│   │   ├── App.tsx                  # Route switch: `/` (Host) vs `/play` (Mobile Controller)
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Tasks Breakdown

- [ ] **Task 1: Project Scaffolding & Shared Data Constants**
  - Initialize project manifests for `server/` and `client/`.
  - Create `server/src/constants/tiles.js`: define all 56 tiles around the 15×15 perimeter (index 0 to 55) mapped with accurate sector tags, basic prices, and upgrade thresholds.
  - Create `server/src/constants/cards.js`: implement the exact 32 event cards (16 `CARD_GOVERNMENT` and 16 `CARD_INSIDER`) from the PRD with structured action types (`SECTOR_PENALTY`, `SECTOR_REWARD`, `POOL_SIPHON`, `GO_TO_JAIL`, `KEEP_JAIL_FREE`, etc.).
  - Create `server/src/constants/tokens.js`: define 6 satirical tokens with icons, slogans, and colors.
  - Create TypeScript definitions in `client/src/types/game.ts` mirroring server constants.
  - *Verification:* Run Node test verifying all 56 tiles and 32 cards validate against schema.

- [ ] **Task 2: Authoritative Game Engine & Card Resolver (Server)**
  - Implement `server/src/models/Player.js` (cash = Rp 15.000.000, position = 0, properties, jail status, insider pass).
  - Implement `server/src/models/CardResolver.js` adhering to PRD Section 5.2 (dynamic sector synergy and fallback execution).
  - Implement `server/src/models/GameState.js`:
    - Dice rolling physics (2d6 with double roll detection; 3 doubles = instant KPK jail).
    - Tile movement resolution: pass START (collect Rp 2.000.000, auto-deduct 10% to `kas_negara_pool`).
    - Property transactions: buying vacant property, rent calculation based on upgrade level and active sector buffs/penalties.
    - Siphoning `kas_negara_pool` on landing at petak "CAIR PROYEK APBN / BANSOS" (Tile 28).
    - Jail turn penalties (20% fee deduction on rents collected while imprisoned).
  - *Verification:* Write automated Jest / Vitest unit tests for the card resolver and state transitions.

- [ ] **Task 3: Local Wi-Fi Discovery, QR Generation & Socket.io Handlers**
  - Implement `server/src/config.js` to detect host LAN IP via `os.networkInterfaces()` (ignoring internal 127.0.0.1 and virtual adapters).
  - Generate dynamic QR Code using `qrcode` package pointing to `http://<LAN_IP>:<PORT>/play?room=<ROOM_ID>`.
  - Implement `server/src/socket/gameHandler.js`:
    - Events: `room:create`, `player:join`, `player:ready`, `game:start`, `turn:roll_dice`, `turn:buy_property`, `turn:upgrade_property`, `turn:end`, `jail:pay_fine`, `jail:use_pass`.
    - Broadcast full synchronized snapshot to Host screen and private status to individual controllers.
  - *Verification:* Start server, verify HTTP endpoint `/api/network` returns real local IP and QR SVG.

- [ ] **Task 4: Host Big Board View (15×15 Grid & Interactive Stage)**
  - Implement `client/src/components/host/BoardGrid.tsx`:
    - CSS Grid `grid-cols-15 grid-rows-15` spanning the 16:9 viewport.
    - Render 56 perimeter cells matching coordinate order (Bottom right -> Bottom left -> Top left -> Top right -> Bottom right).
  - Implement `client/src/components/host/CenterHub.tsx`:
    - Interactive 3D Dice roll animation.
    - Animated "Brankas Kas Negara / APBN" showing real-time accumulated tax pool.
    - Prominent QR Code for players to scan from mobile.
    - Active turn indicator and turn timer.
  - Implement `client/src/components/host/PlayerToken.tsx`:
    - Animated token movement with step-by-step jumping transitions along the 15×15 perimeter.
  - Implement `client/src/components/host/BreakingNews.tsx`:
    - Satirical news flash pop-up overlay when a card is drawn.
  - *Verification:* Load Host view in browser, test visual alignment and responsiveness of all 56 cells.

- [ ] **Task 5: Mobile Touch Controller View (Thumb-Zone Optimized)**
  - Implement `client/src/components/controller/JoinRoom.tsx`:
    - Room code pre-fill, player name input, and 6 satirical avatar selection cards.
  - Implement `client/src/components/controller/ActionPad.tsx`:
    - Big touch-friendly "Lempar Dadu" button with vibration haptic trigger (`navigator.vibrate`).
    - Contextual action bar: "Beli Tanah", "Bangun Kos/Pabrik/Hotel", "Lewati / Selesai Giliran".
  - Implement `client/src/components/controller/WalletCard.tsx`:
    - Real-time Rupiah cash balance, list of owned property certificates, and mortgage options.
  - *Verification:* Test mobile controller in Chrome DevTools Device Mode (iPhone / Android viewport).

- [ ] **Task 6: Audio Synthesizer, Sound Effects & Visual Polish**
  - Implement `client/src/hooks/useAudio.ts` using Web Audio API:
    - Custom synth sound effects: dice rattle, cash register (*Cring!*), police siren for KPK arrest, and buzzer for bankruptcy.
  - Polish UI animations with Framer Motion: bank vault expanding when tax is collected, card flipping, and confetti on bankruptcy/victory.
  - *Verification:* Verify all audio cues trigger on corresponding game state changes.

- [ ] **Task 7: End-to-End Local Playtesting & Production Release**
  - Conduct full simulation with 3 players: join via simulated sockets, roll dice, draw cards, collect tax into `kas_negara_pool`, siphon APBN pool, and trigger jail mechanics.
  - Create professional `README.md` with Rule 11.1 topic badges, architecture diagram, instructions to run on local Wi-Fi, and screenshots.
  - Initialize Git repository, commit with Rule 12.1 trailer, and publish to GitHub under `pranataa-labs/Monopoli-Negeri-Konoha`.
