import { useState, useCallback, useEffect, useRef } from 'react';
import './MemoryGame.css';

const ICONS = ['🧭', '🗺️', '🔑', '💎', '💀', '🔦', '⚔️', '🛡️'];

function createDeck() {
  const pairs = ICONS.flatMap((icon, i) => [
    { id: i * 2, icon, matched: false },
    { id: i * 2 + 1, icon, matched: false },
  ]);
  /* Fisher-Yates shuffle */
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function MemoryGame({ onComplete }) {
  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [done, setDone] = useState(false);
  const lockRef = useRef(false);

  const handleFlip = useCallback(
    (index) => {
      if (lockRef.current) return;
      if (flipped.includes(index)) return;
      if (cards[index].matched) return;

      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        lockRef.current = true;
        setMoves((m) => m + 1);

        const [first, second] = newFlipped;
        if (cards[first].icon === cards[second].icon) {
          /* Match found */
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card, i) =>
                i === first || i === second ? { ...card, matched: true } : card,
              ),
            );
            setMatched((m) => m + 1);
            setFlipped([]);
            lockRef.current = false;
          }, 500);
        } else {
          /* No match */
          setTimeout(() => {
            setFlipped([]);
            lockRef.current = false;
          }, 800);
        }
      }
    },
    [flipped, cards],
  );

  useEffect(() => {
    if (matched === ICONS.length && !done) {
      setDone(true);
      setTimeout(onComplete, 1200);
    }
  }, [matched, done, onComplete]);

  if (done) {
    return (
      <div className="game-success">
        Toutes les paires retrouvées en {moves} coups ! 🎉
      </div>
    );
  }

  return (
    <div className="memory">
      <div className="memory__stats">
        <span>Paires trouvées : <strong>{matched}/{ICONS.length}</strong></span>
        <span>Coups : <strong>{moves}</strong></span>
      </div>

      <div className="memory__grid" role="grid" aria-label="Grille de mémoire">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || card.matched;
          return (
            <button
              key={card.id}
              className={`memory__card ${isFlipped ? 'memory__card--flipped' : ''} ${card.matched ? 'memory__card--matched' : ''}`}
              onClick={() => handleFlip(index)}
              aria-label={isFlipped ? card.icon : 'Carte cachée'}
              disabled={card.matched}
            >
              <span className="memory__card-front">?</span>
              <span className="memory__card-back">{card.icon}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
