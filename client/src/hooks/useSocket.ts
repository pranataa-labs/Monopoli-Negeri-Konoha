import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { GameSnapshot, PlayerClient, RollResult, CardResolutionEvent } from "../types/game";
import { sound } from "./useAudio";

export function useSocket(roomId = "KONOHA-01") {
  const [isConnected, setIsConnected] = useState(false);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [localPlayer, setLocalPlayer] = useState<PlayerClient | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeRoll, setActiveRoll] = useState<RollResult | null>(null);
  const [activeCard, setActiveCard] = useState<CardResolutionEvent | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Port 3001 is the backend server
    const serverUrl =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3001"
        : `http://${window.location.hostname}:3001`;

    const socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("room:get_state", { roomId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("game:snapshot", (data: GameSnapshot) => {
      setSnapshot(data);
      // Synchronize local player state if present
      if (socket.id) {
        const found = data.players.find((p) => p.id === socket.id);
        if (found) {
          setLocalPlayer(found);
        }
      }
    });

    socket.on("player:joined_success", ({ player }: { player: PlayerClient }) => {
      setLocalPlayer(player);
      sound.playClick();
    });

    socket.on("turn:dice_rolled", ({ rollResult, activeCardEvent }: { rollResult: RollResult; activeCardEvent?: CardResolutionEvent }) => {
      setActiveRoll(rollResult);
      sound.playDiceRoll();

      if (rollResult.passedStart) {
        setTimeout(() => sound.playCash(), 500);
      }

      if (activeCardEvent) {
        setTimeout(() => {
          setActiveCard(activeCardEvent);
          if (activeCardEvent.card.deck === "GOVERNMENT") {
            sound.playSiren();
          } else {
            sound.playCash();
          }
        }, 800);
      }
    });

    socket.on("property:purchased", () => {
      sound.playCash();
    });

    socket.on("property:upgraded", () => {
      sound.playCash();
    });

    socket.on("game:error", ({ message }: { message: string }) => {
      setLastError(message);
      sound.playBuzzer();
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const joinRoom = useCallback(
    (name: string, tokenId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("player:join", { roomId, name, tokenId });
      }
    },
    [roomId, isConnected]
  );

  const startGame = useCallback(() => {
    if (socketRef.current && isConnected) {
      sound.playClick();
      socketRef.current.emit("game:start", { roomId });
    }
  }, [roomId, isConnected]);

  const rollDice = useCallback(() => {
    if (socketRef.current && isConnected) {
      sound.playClick();
      socketRef.current.emit("turn:roll_dice", { roomId });
    }
  }, [roomId, isConnected]);

  const buyProperty = useCallback(() => {
    if (socketRef.current && isConnected) {
      sound.playClick();
      socketRef.current.emit("turn:buy_property", { roomId });
    }
  }, [roomId, isConnected]);

  const upgradeProperty = useCallback(
    (tileId: string) => {
      if (socketRef.current && isConnected) {
        sound.playClick();
        socketRef.current.emit("turn:upgrade_property", { roomId, tileId });
      }
    },
    [roomId, isConnected]
  );

  const payJailBail = useCallback(() => {
    if (socketRef.current && isConnected) {
      sound.playClick();
      socketRef.current.emit("jail:pay_bail", { roomId });
    }
  }, [roomId, isConnected]);

  const useJailPass = useCallback(() => {
    if (socketRef.current && isConnected) {
      sound.playClick();
      socketRef.current.emit("jail:use_pass", { roomId });
    }
  }, [roomId, isConnected]);

  const endTurn = useCallback(() => {
    if (socketRef.current && isConnected) {
      sound.playClick();
      socketRef.current.emit("turn:end", { roomId });
    }
  }, [roomId, isConnected]);

  const dismissCard = useCallback(() => {
    setActiveCard(null);
  }, []);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    socketId: socketRef.current?.id || null,
    isConnected,
    snapshot,
    localPlayer,
    lastError,
    activeRoll,
    activeCard,
    joinRoom,
    startGame,
    rollDice,
    buyProperty,
    upgradeProperty,
    payJailBail,
    useJailPass,
    endTurn,
    dismissCard,
    clearError,
  };
}
