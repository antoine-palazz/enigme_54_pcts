import { useCallback, useState } from 'react';
import { useGame } from '../context/GameContext';
import GameContainer from './GameContainer';
import FinalClue from './FinalClue';
import IntroOverlay from './IntroOverlay';
import './Layout.css';

export default function Layout() {
  const { games, completedGames, currentGameIndex, allCompleted, resetProgress } = useGame();
  const [showIntro, setShowIntro] = useState(true);

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir recommencer depuis le début ?')) {
      resetProgress();
    }
  };

  const handleCloseIntro = useCallback(() => setShowIntro(false), []);

  return (
    <>
      {showIntro ? <IntroOverlay onClose={handleCloseIntro} /> : null}

      <header className="header">
        <h1 className="header__title">L'Énigme des 54 Pourcents</h1>
        <p className="header__subtitle">Une chasse au trésor virtuelle</p>
      </header>

      <nav className="progress-bar" aria-label="Progression des épreuves">
        {games.map((game, index) => {
          const isCompleted = completedGames[index];
          const isCurrent = index === currentGameIndex;
          const isLocked = index > currentGameIndex;

          let status = 'locked';
          if (isCompleted) status = 'completed';
          else if (isCurrent) status = 'current';

          return (
            <div
              key={game.id}
              className={`progress-bar__step progress-bar__step--${status}`}
              aria-label={`${game.title} — ${
                isCompleted ? 'terminé' : isCurrent ? 'en cours' : 'verrouillé'
              }`}
            >
              <span className="progress-bar__icon">
                {isCompleted ? '✓' : isLocked ? '🔒' : game.icon}
              </span>
              <span className="progress-bar__label">{index + 1}</span>
            </div>
          );
        })}
      </nav>

      <main className="main">
        {allCompleted ? (
          <FinalClue />
        ) : (
          games.map((game, index) => (
            <GameContainer key={game.id} gameIndex={index} />
          ))
        )}
      </main>

      <footer className="footer">
        <button className="footer__reset" onClick={handleReset}>
          Recommencer l'aventure
        </button>
      </footer>
    </>
  );
}
