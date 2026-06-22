import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { HashRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
      Loading...
    </div>
  );
}

function BoardNotFound({ name }) {
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
      <h2>Board "{name}" not found.</h2>
      <Link to="/">Go Home</Link>
      <Link to="/boards">Browse Boards</Link>
    </div>
  );
}

function BoardViewerInner({ name }) {
  const [scene, setScene] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/boards/${name}.excalidraw`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setScene(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  if (error) return <BoardNotFound name={name} />;
  if (!scene) return <Spinner />;

  return <Excalidraw key={name} initialData={scene} />;
}

function BoardViewer() {
  const { name } = useParams();
  const valid = /^[A-Za-z0-9_-]+$/.test(name);

  if (!valid) {
    return <BoardNotFound name={name} />;
  }

  return <BoardViewerInner key={name} name={name} />;
}

function BoardsList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch("/boards.json")
      .then((r) => r.json())
      .then((data) => setBoards(data.boards || []));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "0.5rem",
      }}
    >
      <h2>Boards</h2>
      {boards.length === 0 && <p>No boards found.</p>}
      <ul>
        {boards.map((b) => (
          <li key={b}>
            <Link to={`/board/${b}`}>{b}</Link>
          </li>
        ))}
      </ul>
      <Link to="/">New Board</Link>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Excalidraw />
      <Link
        to="/boards"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 1000,
          background: "rgba(0,0,0,0.05)",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          textDecoration: "none",
          color: "#1e1e1e",
        }}
      >
        Boards
      </Link>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<BoardsList />} />
        <Route path="/board/:name" element={<BoardViewer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
