import { useState, useCallback } from "react";

function FullscreenButton({ onToggle }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        onToggle?.();
      }).catch(() => {
        onToggle?.();
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        onToggle?.();
      }).catch(() => {
        onToggle?.();
      });
    }
  }, [onToggle]);

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
