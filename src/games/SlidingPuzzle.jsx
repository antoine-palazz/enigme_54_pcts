import { useState, useCallback } from 'react';
import './SlidingPuzzle.css';

const SIZE = 3;
const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

/**
 * Count inversions to check solvability.
 * For a 3x3 puzzle, solvable if inversions count is even.
 */
function countInversions(tiles) {
  let inversions = 0;
  const nums = tiles.filter((t) => t !== 0);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inversions++;
    }
  }
  return inversions;
}

function shuffle() {
  let tiles;
  do {
    tiles = [...GOAL];
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (
    countInversions(tiles) % 2 !== 0 ||
    tiles.every((t, i) => t === GOAL[i])
  );
  return tiles;
}

function isSolved(tiles) {
  return tiles.every((t, i) => t === GOAL[i]);
}

export default function SlidingPuzzle({ onComplete }) {
  const [tiles, setTiles] = useState(shuffle);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const emptyIndex = tiles.indexOf(0);
  const emptyRow = Math.floor(emptyIndex / SIZE);
  const emptyCol = emptyIndex % SIZE;

  const handleClick = useCallback(
    (index) => {
      if (done) return;
      const row = Math.floor(index / SIZE);
      const col = index % SIZE;

      /* Check adjacency */
      const isAdjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);

      if (!isAdjacent) return;

      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves((m) => m + 1);

      if (isSolved(newTiles)) {
        setDone(true);
        setTimeout(onComplete, 1200);
      }
    },
    [tiles, emptyIndex, emptyRow, emptyCol, done, onComplete],
  );

  if (done) {
    return (
      <div className="game-success">
        Taquin résolu en {moves} coups ! La malédiction est brisée ! 🧩
      </div>
    );
  }

  return (
    <div className="sliding">
      <div className="sliding__stats">
        Coups : <strong>{moves}</strong>
      </div>

      <div
        className="sliding__grid"
        role="grid"
        aria-label="Taquin"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {tiles.map((value, index) => (
          <button
            key={index}
            className={`sliding__tile ${value === 0 ? 'sliding__tile--empty' : ''}`}
            onClick={() => handleClick(index)}
            disabled={value === 0}
            aria-label={value === 0 ? 'Case vide' : `Tuile ${value}`}
          >
            {value !== 0 ? value : ''}
          </button>
        ))}
      </div>

      <p className="sliding__tip">
        Cliquez sur une tuile adjacente à la case vide pour la déplacer.
      </p>
    </div>
  );
}
