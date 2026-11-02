import React, { useState, useEffect } from "react";
import { HostScreen } from "./components/host/HostScreen";
import { ControllerScreen } from "./components/controller/ControllerScreen";
import { Smartphone, Monitor } from "lucide-react";

export const App: React.FC = () => {
  const getInitialMode = (): "HOST" | "CONTROLLER" => {
    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (path.includes("/play") || path.includes("/controller") || params.has("play")) {
      return "CONTROLLER";
    }
    return "HOST";
  };

  const [mode, setMode] = useState<"HOST" | "CONTROLLER">(getInitialMode);

  useEffect(() => {
    const handlePopState = () => {
      setMode(getInitialMode());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const toggleMode = () => {
    const nextMode = mode === "HOST" ? "CONTROLLER" : "HOST";
    setMode(nextMode);
    if (nextMode === "CONTROLLER") {
      window.history.pushState({}, "", "/play");
    } else {
      window.history.pushState({}, "", "/");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans">
      {/* Floating Toggle View Button (For testing & convenience) */}
      <div className="fixed top-2 right-2 z-50 opacity-40 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleMode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 shadow-md backdrop-blur-sm cursor-pointer hover:border-amber-400 hover:text-amber-300"
          title={`Ganti ke mode ${mode === "HOST" ? "Kontroler Ponsel (/play)" : "Layar Utama (/)"}`}
        >
          {mode === "HOST" ? (
            <>
              <Smartphone size={12} />
              <span>Buka Kontroler HP</span>
            </>
          ) : (
            <>
              <Monitor size={12} />
              <span>Buka Layar Utama</span>
            </>
          )}
        </button>
      </div>

      {mode === "HOST" ? <HostScreen /> : <ControllerScreen />}
    </div>
  );
};

export default App;
