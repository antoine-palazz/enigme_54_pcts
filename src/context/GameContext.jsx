import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import GAMES from '../games';

const STORAGE_KEY = 'enigme54_progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === GAMES.length) {
        return parsed;
      }
    }
  } catch {
    /* ignore corrupted data */
  }
  return GAMES.map(() => false);
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* localStorage might be full or disabled */
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [completedGames, setCompletedGames] = useState(loadProgress);

  const completeGame = useCallback((gameIndex) => {
    setCompletedGames((prev) => {
      if (prev[gameIndex]) return prev;
      const next = [...prev];
      next[gameIndex] = true;
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = GAMES.map(() => false);
    setCompletedGames(fresh);
    saveProgress(fresh);
  }, []);

  const currentGameIndex = useMemo(
    () => {
      const idx = completedGames.indexOf(false);
      return idx === -1 ? GAMES.length : idx;
    },
    [completedGames],
  );

  const allCompleted = useMemo(
    () => completedGames.every(Boolean),
    [completedGames],
  );

  const value = useMemo(
    () => ({
      games: GAMES,
      completedGames,
      currentGameIndex,
      allCompleted,
      completeGame,
      resetProgress,
    }),
    [completedGames, currentGameIndex, allCompleted, completeGame, resetProgress],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
