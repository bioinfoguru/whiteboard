import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Excalidraw } from "@excalidraw/excalidraw";
import { loadBoard } from "../lib/loadBoard";
import { getFrames } from "../lib/getFrames";
import PresentationControls from "../components/PresentationControls";

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: "1.5rem",
      }}
    >
      Loading presentation...
    </div>
  );
}

function NoFrames({ name, onExit }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1rem",
      }}
    >
      <h2>No Frames Found</h2>
      <p>
        This board contains no frames. Create Excalidraw frames to use
        presentation mode.
      </p>
      <Link
        to={`/board/${name}`}
        style={{
          background: "#3498db",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.25rem",
          textDecoration: "none",
        }}
      >
        Back to Editor
      </Link>
      <button
        onClick={onExit}
        style={{
          background: "transparent",
          border: "1px solid #ccc",
          padding: "0.5rem 1rem",
          borderRadius: "0.25rem",
          cursor: "pointer",
        }}
      >
        Exit Presentation
      </button>
    </div>
  );
}

function PresentationNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1rem",
      }}
    >
      <h2>Presentation not found.</h2>
      <Link to="/">Home</Link>
      <Link to="/boards">Browse Boards</Link>
    </div>
  );
}

export default function PresentationPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [scene, setScene] = useState(null);
  const [frames, setFrames] = useState([]);
  const [error, setError] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  const handleAPI = useCallback((api) => {
    setExcalidrawAPI(api);
  }, []);

  const frameElementsMap = useMemo(() => {
    if (!scene) return {};
    const map = {};
    frames.forEach((frame) => {
      map[frame.id] = scene.elements.filter((e) => e.frameId === frame.id);
    });
    return map;
  }, [scene, frames]);

  useEffect(() => {
    let cancelled = false;

    loadBoard(name)
      .then((data) => {
        if (!cancelled) {
          const frames = getFrames(data);
          const scene = {
            ...data,
            elements: data.elements.map((el) =>
              el.type === "frame" ? { ...el, name: "" } : el
            ),
          };
          setScene(scene);
          setFrames(frames);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  useEffect(() => {
    if (!excalidrawAPI) return;
    if (frames.length === 0) return;

    const frame = frames[slideIndex];
    if (!frame) return;

    const elements = frameElementsMap[frame.id] || [frame];

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        excalidrawAPI.scrollToContent(elements, {
          fitToContent: true,
          animate: true,
          padding: 20,
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [slideIndex, frames, excalidrawAPI, frameElementsMap]);

  useEffect(() => {
    let timer = null;

    function refitCurrentFrame() {
      if (!excalidrawAPI) return;
      if (frames.length === 0) return;

      const frame = frames[slideIndex];
      if (!frame) return;

      const elements = frameElementsMap[frame.id] || [frame];

      requestAnimationFrame(() => {
        excalidrawAPI.scrollToContent(elements, {
          fitToContent: true,
          animate: false,
          padding: 20,
        });
      });
    }

    function onFullscreenChange() {
      clearTimeout(timer);
      timer = setTimeout(refitCurrentFrame, 300);
    }

    function onResize() {
      clearTimeout(timer);
      timer = setTimeout(refitCurrentFrame, 150);
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("resize", onResize);
      if (timer) clearTimeout(timer);
    };
  }, [slideIndex, frames, excalidrawAPI, frameElementsMap]);

  useEffect(() => {
    function handleKey(e) {
      const target = e.target;
      const tag = target.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      let handled = true;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          setSlideIndex((prev) => Math.min(prev + 1, frames.length - 1));
          break;
        case "ArrowLeft":
          e.preventDefault();
          e.stopPropagation();
          setSlideIndex((prev) => Math.max(prev - 1, 0));
          break;
        case " ":
          e.preventDefault();
          e.stopPropagation();
          setSlideIndex((prev) => Math.min(prev + 1, frames.length - 1));
          break;
        case "Home":
          e.preventDefault();
          e.stopPropagation();
          setSlideIndex(0);
          break;
        case "End":
          e.preventDefault();
          e.stopPropagation();
          setSlideIndex(frames.length - 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          e.stopPropagation();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          navigate(`/board/${name}`);
          break;
        default:
          handled = false;
      }

      if (handled) {
        e.stopImmediatePropagation();
      }
    }

    window.addEventListener("keydown", handleKey, true);

    return () => {
      window.removeEventListener("keydown", handleKey, true);
    };
    }, [name, navigate, frames.length]);

  if (error) {
    return <PresentationNotFound />;
  }

  if (!scene) {
    return <Spinner />;
  }

  if (frames.length === 0) {
    return (
      <NoFrames
        name={name}
        onExit={navigate}
      />
    );
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Excalidraw
        key={`present-${name}`}
        initialData={scene}
        viewModeEnabled={true}
        zenModeEnabled={true}
        excalidrawAPI={handleAPI}
      />
      <PresentationControls
        currentSlide={slideIndex}
        totalSlides={frames.length}
        onPrev={() => setSlideIndex((prev) => Math.max(prev - 1, 0))}
        onNext={() =>
          setSlideIndex((prev) => Math.min(prev + 1, frames.length - 1))
        }
        onExit={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          navigate(`/board/${name}`);
        }}
      />
    </div>
  );
}
