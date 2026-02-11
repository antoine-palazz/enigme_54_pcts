import { useState, useCallback } from 'react';
import './RiddleGame.css';

const RIDDLES = [
  {
    question: 'Je suis toujours devant vous mais ne peux jamais être vu. Qui suis-je ?',
    answers: ['avenir', 'l\'avenir', 'le futur', 'futur'],
    hint: 'Pensez au temps qui passe…',
  },
  {
    question: 'Plus je sèche, plus je suis mouillée. Qui suis-je ?',
    answers: ['serviette', 'une serviette', 'la serviette'],
    hint: 'On l\'utilise après la douche.',
  },
  {
    question: 'J\'ai des villes, mais pas de maisons. J\'ai des forêts, mais pas d\'arbres. J\'ai de l\'eau, mais pas de poissons. Qui suis-je ?',
    answers: ['carte', 'une carte', 'la carte', 'carte geographique', 'une carte geographique'],
    hint: 'Un explorateur en a toujours une dans son sac.',
  },
];

/**
 * Normalize a string for comparison: lowercase, remove accents, trim.
 */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

export default function RiddleGame({ onComplete }) {
  const [riddleIndex, setRiddleIndex] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  const currentRiddle = RIDDLES[riddleIndex];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      const normalizedInput = normalize(input);
      const isCorrect = currentRiddle.answers.some(
        (ans) => normalize(ans) === normalizedInput,
      );

      if (isCorrect) {
        setFeedback('correct');
        setInput('');
        setAttempts(0);
        setShowHint(false);

        if (riddleIndex === RIDDLES.length - 1) {
          setDone(true);
          setTimeout(onComplete, 1200);
        } else {
          setTimeout(() => {
            setRiddleIndex((prev) => prev + 1);
            setFeedback(null);
          }, 1000);
        }
      } else {
        setFeedback('wrong');
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= 3) {
          setShowHint(true);
        }
        setTimeout(() => setFeedback(null), 600);
      }
    },
    [input, currentRiddle, riddleIndex, attempts, onComplete],
  );

  if (done) {
    return (
      <div className="game-success">
        Le Sphinx s'incline devant votre sagesse ! 🗿
      </div>
    );
  }

  return (
    <div className="riddle">
      <div className="riddle__progress">
        Énigme {riddleIndex + 1} sur {RIDDLES.length}
      </div>

      <blockquote className="riddle__question">
        « {currentRiddle.question} »
      </blockquote>

      {showHint && (
        <p className="riddle__hint animate-fade-in">
          💡 Indice : {currentRiddle.hint}
        </p>
      )}

      <form className="riddle__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`game-input ${feedback === 'wrong' ? 'animate-shake' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Votre réponse…"
          autoFocus
          aria-label="Votre réponse"
        />
        <button type="submit" className="game-btn game-btn--gold">
          Répondre
        </button>
      </form>

      {feedback === 'correct' && (
        <p className="riddle__feedback riddle__feedback--correct animate-fade-in">
          Bonne réponse !
        </p>
      )}
      {feedback === 'wrong' && (
        <p className="riddle__feedback riddle__feedback--wrong">
          Ce n'est pas la bonne réponse. Essayez encore !
        </p>
      )}
    </div>
  );
}
