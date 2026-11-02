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
    const iconSize = size === "sm" ? 12 : size === "md" ? 18 : 24;
    switch (player.token?.id) {
      case "token_rubicon":
        return <Car size={iconSize} className="text-white" />;
      case "token_wheelchair":
        return <Accessibility size={iconSize} className="text-white" />;
      case "token_odol":
        return <Truck size={iconSize} className="text-white" />;
      case "token_matic":
        return <Bike size={iconSize} className="text-white" />;
      case "token_briefcase":
        return <Briefcase size={iconSize} className="text-white" />;
      case "token_vest":
        return <ShieldAlert size={iconSize} className="text-white" />;
      default:
        return <User size={iconSize} className="text-white" />;
    }
  };

  const containerSizes = {
    sm: "w-5 h-5 ring-1",
    md: "w-7 h-7 ring-2",
    lg: "w-10 h-10 ring-2",
  };

  return (
    <div className="flex items-center gap-1.5 animate-bounce-short">
      <div
        className={`${containerSizes[size]} rounded-full flex items-center justify-center ring-white/80 shadow-md font-bold text-white transition-all transform hover:scale-110`}
        style={{ backgroundColor: player.token?.color || player.color || "#0284c7" }}
        title={`${player.name} (${player.token?.name})`}
      >
        {renderIcon()}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px]">
          {player.name}
        </span>
      )}
    </div>
  );
};
