import { useCallback, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import './GameContainer.css';

export default function GameContainer({ gameIndex }) {
  const { games, completedGames, currentGameIndex, completeGame } = useGame();
  const game = games[gameIndex];
  const isCompleted = completedGames[gameIndex];
  const isCurrent = gameIndex === currentGameIndex;
  const isLocked = gameIndex > currentGameIndex;
  const containerRef = useRef(null);

  const GameComponent = game.component;

  const handleComplete = useCallback(() => {
    completeGame(gameIndex);
  }, [completeGame, gameIndex]);

  /* Auto-scroll to current game when it becomes active */
  useEffect(() => {
    if (isCurrent && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrent]);

  if (isLocked) {
    return (
      <section className="game-container game-container--locked" aria-hidden="true">
        <div className="game-container__header">
          <span className="game-container__icon">🔒</span>
          <h2 className="game-container__title">{game.title}</h2>
        </div>
        <p className="game-container__locked-text">
          Complétez l'épreuve précédente pour débloquer celle-ci.
        </p>
      </section>
    );
  }

  if (isCompleted) {
    return (
      <section className="game-container game-container--completed">
        <div className="game-container__header">
          <span className="game-container__icon">✓</span>
          <h2 className="game-container__title">{game.title}</h2>
        </div>
        <p className="game-container__completed-text">Épreuve réussie !</p>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="game-container game-container--active animate-fade-in"
    >
      <div className="game-container__header">
        <span className="game-container__icon">{game.icon}</span>
        <div>
          <h2 className="game-container__title">{game.title}</h2>
          <p className="game-container__description">{game.description}</p>
        </div>
      </div>
      <div className="game-container__body">
        <GameComponent onComplete={handleComplete} />
      </div>
    </section>
  );
}
