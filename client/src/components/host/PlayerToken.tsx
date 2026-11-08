import React from "react";
import { Car, Accessibility, Truck, Bike, Briefcase, ShieldAlert, User } from "lucide-react";
import { PlayerClient } from "../../types/game";

interface PlayerTokenProps {
  player: PlayerClient;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({ player, size = "md", showLabel = false }) => {
  const renderIcon = () => {
    const iconSize = size === "sm" ? 11 : size === "md" ? 16 : 22;
    switch (player.token?.id) {
      case "token_rubicon":
        return <Car size={iconSize} className="text-white drop-shadow-xs" />;
      case "token_wheelchair":
        return <Accessibility size={iconSize} className="text-white drop-shadow-xs" />;
      case "token_odol":
        return <Truck size={iconSize} className="text-white drop-shadow-xs" />;
      case "token_matic":
        return <Bike size={iconSize} className="text-white drop-shadow-xs" />;
      case "token_briefcase":
        return <Briefcase size={iconSize} className="text-white drop-shadow-xs" />;
      case "token_vest":
        return <ShieldAlert size={iconSize} className="text-white drop-shadow-xs" />;
      default:
        return <User size={iconSize} className="text-white drop-shadow-xs" />;
    }
  };

  const containerSizes = {
    sm: "w-5 h-5 border border-sky-400/80 shadow-[0_0_6px_rgba(56,189,248,0.6)]",
    md: "w-7 h-7 border-2 border-sky-400/80 shadow-[0_0_10px_rgba(56,189,248,0.6)]",
    lg: "w-10 h-10 border-2 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.7)]",
  };

  return (
    <div className="flex items-center gap-1.5 animate-bounce-short select-none">
      <div
        className={`${containerSizes[size]} rounded-full flex items-center justify-center font-bold text-white transition-transform hover:scale-110`}
        style={{ backgroundColor: player.token?.color || player.color || "#0284c7" }}
        title={`${player.name} (${player.token?.name})`}
      >
        {renderIcon()}
      </div>
      {showLabel && (
        <span className="text-xs font-primary font-bold text-sky-200 truncate max-w-[90px]">
          {player.name}
        </span>
      )}
    </div>
  );
};
