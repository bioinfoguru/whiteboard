import { useState, useEffect, useCallback } from "react";

function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <button
      onClick={toggle}
      style={{
        background: "rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.3)",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "0.25rem",
        cursor: "pointer",
        fontSize: "0.9rem",
      }}
    >
      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </button>
  );
}

export default FullscreenButton;
