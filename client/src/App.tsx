import React, { useState, useEffect } from "react";
import { HostScreen } from "./components/host/HostScreen";
import { ControllerScreen } from "./components/controller/ControllerScreen";
import { Smartphone } from "lucide-react";

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

  const isLocalhost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  return (
    <div className="w-full relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Floating Toggle View Button (Only for Local Testing on Desktop) */}
      {isLocalhost && mode === "HOST" && (
        <div className="fixed bottom-3 right-3 z-50 opacity-50 hover:opacity-100 transition-opacity">
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 border border-slate-700 text-xs font-mono text-slate-300 shadow-xl backdrop-blur-md cursor-pointer hover:border-amber-400 hover:text-amber-300 active:scale-95 transition-all"
            title="Ganti ke mode Kontroler Ponsel (/play)"
          >
            <Smartphone size={13} className="text-amber-400" />
            <span>Simulasi HP</span>
          </button>
        </div>
      )}

      {mode === "HOST" ? <HostScreen /> : <ControllerScreen />}
    </div>
  );
};

export default App;
