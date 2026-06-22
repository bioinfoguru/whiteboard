import FullscreenButton from "./FullscreenButton";

function PresentationControls({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onExit,
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "0.35rem 1rem",
        borderRadius: "9999px",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <button
        onClick={onPrev}
        disabled={currentSlide === 0}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: currentSlide === 0 ? "not-allowed" : "pointer",
          opacity: currentSlide === 0 ? 0.5 : 1,
          fontSize: "1.25rem",
          padding: "0.25rem 0.75rem",
        }}
      >
        ◀
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          minWidth: "6rem",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={currentSlide >= totalSlides - 1}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: currentSlide >= totalSlides - 1 ? "not-allowed" : "pointer",
          opacity: currentSlide >= totalSlides - 1 ? 0.5 : 1,
          fontSize: "1.25rem",
          padding: "0.25rem 0.75rem",
        }}
      >
        ▶
      </button>

      <div
        style={{
          width: "1px",
          height: "1.5rem",
          background: "rgba(255,255,255,0.3)",
          margin: "0 0.5rem",
        }}
      />

      <FullscreenButton />

      <button
        onClick={onExit}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "white",
          padding: "0.4rem 0.75rem",
          borderRadius: "0.25rem",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Exit
      </button>
    </div>
  );
}

export default PresentationControls;
