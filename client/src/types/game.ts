export type SectorType =
  | "SPECIAL_START"
  | "UMKM_PINGGIRAN"
  | "INDUSTRI_PELABUHAN"
  | "SAWIT_TAMBANG"
  | "WISATA_ELIT"
  | "PUSAT_OLIGARKI"
  | "BUMN_TRANSPORT"
  | "BUMN_UTILITY"
  | "CARD_GOVERNMENT"
  | "CARD_INSIDER"
  | "TAX_TILE"
  | "PUNGLI_ORBIT"
  | "SPECIAL_JAIL"
  | "SPECIAL_FREEPARKING"
  | "SPECIAL_GOTOJAIL";

export interface TileData {
  id: string;
  index: number;
  name: string;
  tag: SectorType;
  sector: SectorType;
  gridRow: number;
  gridCol: number;
  price: number;
  rent: number;
  upgradeCost?: number;
  rentLevels?: number[];
  colorGroup: string;
  desc: string;
}

export interface TileState {
  ownerId: string | null;
  level: number;
  mortgaged: boolean;
}

export interface SatiricalToken {
  id: string;
  name: string;
  icon: string;
  slogan: string;
  color: string;
  emojiTag: string;
  badge: string;
}

export interface PlayerClient {
  id: string;
  name: string;
  color: string;
  cash: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  hasInsiderPass: boolean;
  properties: string[];
  activeBuffs: Array<{ sector: SectorType; rentMultiplier: number; turnsRemaining: number }>;
  isBankrupt: boolean;
  token: SatiricalToken;
}

export interface EventCardData {
  id: string;
  deck: "GOVERNMENT" | "INSIDER";
  title: string;
  text: string;
  actionType: string;
  targetSector: string;
  amount: number;
  fallbackAmount?: number;
  maxAmount?: number;
  buffMultiplier?: number;
  destinationIndex?: number;
}

export interface CardResolutionEvent {
  card: EventCardData;
  player: PlayerClient;
  cashDelta: number;
  poolDelta: number;
  description: string;
}

export interface RollResult {
  d1: number;
  d2: number;
  sum: number;
  isDouble: boolean;
  previousPosition: number;
  newPosition: number;
  passedStart: boolean;
}

export interface GameLog {
  id: string;
  time: string;
  text: string;
  type: "INFO" | "SUCCESS" | "WARN" | "ERROR" | "ROLL" | "CARD" | "GAME" | "PLAYER" | "SYSTEM";
}

export interface GameSnapshot {
  roomId: string;
  status: "LOBBY" | "PLAYING" | "GAME_OVER";
  currentTurnIndex: number;
  activePlayerId: string | null;
  kasNegaraPool: number;
  dice: [number, number];
  hasRolled: boolean;
  lastRollResult: RollResult | null;
  activeCardEvent: CardResolutionEvent | null;
  players: PlayerClient[];
  tilesState: Record<string, TileState>;
  logs: GameLog[];
}

export interface NetworkConfig {
  localIp: string;
  port: number;
  clientPort: number;
  joinUrl: string;
  qrCodeDataUrl: string;
}
