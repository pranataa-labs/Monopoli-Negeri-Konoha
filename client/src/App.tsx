import React, { useState, useEffect } from "react";
import { HostScreen } from "./components/host/HostScreen";
import { ControllerScreen } from "./components/controller/ControllerScreen";

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

  return (
    <div className="w-full relative min-h-screen bg-[#0B0B0D] font-sans text-[#F2F2F2] overflow-x-hidden">
      {mode === "HOST" ? <HostScreen /> : <ControllerScreen />}
    </div>
  );
};

export default App;
