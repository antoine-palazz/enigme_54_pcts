import { useState, useEffect, useCallback, useRef } from 'react';
import './MazeGame.css';

const COLS = 11;
const ROWS = 11;
const CELL_SIZE = 28;

/**
 * Generate a maze using recursive backtracking.
 * Returns a 2D grid where:
 *   0 = wall, 1 = path, 2 = start, 3 = end
 */
function generateMaze(rows, cols) {
  /* Initialize grid with all walls */
  const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

  function carve(r, c) {
    grid[r][c] = 1;
    const dirs = [
      [0, 2], [0, -2], [2, 0], [-2, 0],
    ];
    /* Shuffle directions */
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
        grid[r + dr / 2][c + dc / 2] = 1; /* carve wall between */
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);
  grid[1][1] = 2; /* start */
  grid[rows - 2][cols - 2] = 3; /* end */
  return grid;
}

function drawMaze(ctx, maze, playerPos, fogEnabled) {
  const width = maze[0].length * CELL_SIZE;
  const height = maze.length * CELL_SIZE;
  ctx.clearRect(0, 0, width, height);

  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[0].length; c++) {
      const x = c * CELL_SIZE;
      const y = r * CELL_SIZE;

      if (fogEnabled) {
        const dist = Math.abs(r - playerPos.row) + Math.abs(c - playerPos.col);
        if (dist > 4) {
          ctx.fillStyle = '#2a1a0e';
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          continue;
        }
      }

      const cell = maze[r][c];
      if (cell === 0) {
        ctx.fillStyle = '#5c3d2e';
      } else if (cell === 2) {
        ctx.fillStyle = '#c9a84c';
      } else if (cell === 3) {
        ctx.fillStyle = '#4a7a2e';
      } else {
        ctx.fillStyle = '#f4e4c1';
      }
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      /* Grid lines */
      ctx.strokeStyle = 'rgba(92, 61, 46, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }

  /* Draw player */
  const px = playerPos.col * CELL_SIZE + CELL_SIZE / 2;
  const py = playerPos.row * CELL_SIZE + CELL_SIZE / 2;
  ctx.beginPath();
  ctx.arc(px, py, CELL_SIZE * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = '#c0392b';
  ctx.fill();
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = 2;
  ctx.stroke();

  /* Draw end marker */
  const endR = maze.length - 2;
  const endC = maze[0].length - 2;
  const ex = endC * CELL_SIZE + CELL_SIZE / 2;
  const ey = endR * CELL_SIZE + CELL_SIZE / 2;
  ctx.font = `${CELL_SIZE * 0.6}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⭐', ex, ey);
}

export default function MazeGame({ onComplete }) {
  const canvasRef = useRef(null);
  const [maze, setMaze] = useState(() => generateMaze(ROWS, COLS));
  const [playerPos, setPlayerPos] = useState({ row: 1, col: 1 });
  const [done, setDone] = useState(false);
  const [moves, setMoves] = useState(0);
  const touchRef = useRef(null);

  /* Draw whenever state changes */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawMaze(ctx, maze, playerPos, true);
  }, [maze, playerPos]);

  const move = useCallback(
    (dr, dc) => {
      if (done) return;
      setPlayerPos((prev) => {
        const nr = prev.row + dr;
        const nc = prev.col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev;
        if (maze[nr][nc] === 0) return prev;
        setMoves((m) => m + 1);

        if (maze[nr][nc] === 3) {
          setDone(true);
          setTimeout(onComplete, 1000);
        }
        return { row: nr, col: nc };
      });
    },
    [maze, done, onComplete],
  );

  /* Keyboard controls */
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': e.preventDefault(); move(-1, 0); break;
        case 'ArrowDown': case 's': case 'S': e.preventDefault(); move(1, 0); break;
        case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); move(0, -1); break;
        case 'ArrowRight': case 'd': case 'D': e.preventDefault(); move(0, 1); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  /* Touch controls */
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchRef.current.x;
    const dy = touch.clientY - touchRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 20;

    if (Math.max(absDx, absDy) < threshold) return;

    if (absDx > absDy) {
      move(0, dx > 0 ? 1 : -1);
    } else {
      move(dy > 0 ? 1 : -1, 0);
    }
    touchRef.current = null;
  };

  const handleRegenerate = () => {
    setMaze(generateMaze(ROWS, COLS));
    setPlayerPos({ row: 1, col: 1 });
    setMoves(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="game-success">
        Sorti du labyrinthe en {moves} pas ! 🏛️
      </div>
    );
  }

  return (
    <div className="maze">
      <div className="maze__stats">
        Pas : <strong>{moves}</strong>
      </div>

      <div className="maze__canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={COLS * CELL_SIZE}
          height={ROWS * CELL_SIZE}
          className="maze__canvas"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Labyrinthe — utilisez les flèches du clavier ou glissez pour naviguer"
          tabIndex={0}
        />
      </div>

      <div className="maze__controls">
        <div className="maze__dpad">
          <button className="maze__dpad-btn" onClick={() => move(-1, 0)} aria-label="Haut">↑</button>
          <div className="maze__dpad-row">
            <button className="maze__dpad-btn" onClick={() => move(0, -1)} aria-label="Gauche">←</button>
            <button className="maze__dpad-btn" onClick={() => move(1, 0)} aria-label="Bas">↓</button>
            <button className="maze__dpad-btn" onClick={() => move(0, 1)} aria-label="Droite">→</button>
          </div>
        </div>
      </div>

      <p className="maze__tip">
        🔴 = vous &nbsp; ⭐ = sortie &nbsp;|&nbsp; Flèches / WASD / Swipe
      </p>

      <button className="game-btn" onClick={handleRegenerate} style={{ alignSelf: 'center' }}>
        Nouveau labyrinthe
      </button>
    </div>
  );
}
