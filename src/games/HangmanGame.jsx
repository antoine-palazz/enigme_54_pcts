import { useState, useCallback, useEffect } from 'react';
import './HangmanGame.css';

const WORD_POOL = [
  'EXPEDITION', 'BOUSSOLE', 'TRESOR', 'AVENTURE', 'PYRAMIDE',
  'CARTOGRAPHIE', 'EXPLORATION', 'DECOUVERT', 'MYSTERE', 'ARTEFACT',
  'PARCHEMIN', 'NAVIGATEUR', 'EQUATEUR', 'SANCTUAIRE', 'RELIQUE',
];

const MAX_ERRORS = 7;
const WORDS_TO_WIN = 3;

const KEYBOARD_ROWS = [
  'AZERTYUIOP',
  'QSDFGHJKLM',
  'WXCVBN',
];

function pickWord(usedWords) {
  const available = WORD_POOL.filter((w) => !usedWords.includes(w));
  const pool = available.length > 0 ? available : WORD_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

function HangmanSvg({ errors }) {
  return (
    <svg viewBox="0 0 200 220" className="hangman__svg" aria-hidden="true">
      {/* Base */}
      <line x1="20" y1="200" x2="100" y2="200" stroke="#5c3d2e" strokeWidth="4" strokeLinecap="round" />
      {/* Pole */}
      {errors >= 1 && <line x1="60" y1="200" x2="60" y2="30" stroke="#5c3d2e" strokeWidth="4" strokeLinecap="round" />}
      {/* Top bar */}
      {errors >= 1 && <line x1="60" y1="30" x2="140" y2="30" stroke="#5c3d2e" strokeWidth="4" strokeLinecap="round" />}
      {/* Rope */}
      {errors >= 1 && <line x1="140" y1="30" x2="140" y2="55" stroke="#8b6914" strokeWidth="3" strokeLinecap="round" />}
      {/* Head */}
      {errors >= 2 && <circle cx="140" cy="70" r="15" fill="none" stroke="#5c3d2e" strokeWidth="3" />}
      {/* Body */}
      {errors >= 3 && <line x1="140" y1="85" x2="140" y2="135" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />}
      {/* Left arm */}
      {errors >= 4 && <line x1="140" y1="100" x2="115" y2="120" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />}
      {/* Right arm */}
      {errors >= 5 && <line x1="140" y1="100" x2="165" y2="120" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />}
      {/* Left leg */}
      {errors >= 6 && <line x1="140" y1="135" x2="115" y2="165" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />}
      {/* Right leg */}
      {errors >= 7 && <line x1="140" y1="135" x2="165" y2="165" stroke="#5c3d2e" strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}

export default function HangmanGame({ onComplete }) {
  const [wordsWon, setWordsWon] = useState(0);
  const [usedWords, setUsedWords] = useState([]);
  const [word, setWord] = useState(() => pickWord([]));
  const [guessed, setGuessed] = useState(new Set());
  const [errors, setErrors] = useState(0);
  const [roundStatus, setRoundStatus] = useState('playing'); /* playing | won | lost */
  const [done, setDone] = useState(false);

  const isLetterRevealed = useCallback(
    (letter) => guessed.has(letter),
    [guessed],
  );

  const hasWonRound = word.split('').every((l) => guessed.has(l));
  const hasLostRound = errors >= MAX_ERRORS;

  useEffect(() => {
    if (roundStatus !== 'playing') return;
    if (hasWonRound) {
      setRoundStatus('won');
      const nextWon = wordsWon + 1;
      setWordsWon(nextWon);
      if (nextWon >= WORDS_TO_WIN) {
        setDone(true);
        setTimeout(onComplete, 1500);
      }
    } else if (hasLostRound) {
      setRoundStatus('lost');
      setWordsWon(0); /* Reset streak */
    }
  }, [hasWonRound, hasLostRound, roundStatus, wordsWon, onComplete]);

  const handleGuess = useCallback(
    (letter) => {
      if (roundStatus !== 'playing') return;
      if (guessed.has(letter)) return;

      const newGuessed = new Set(guessed);
      newGuessed.add(letter);
      setGuessed(newGuessed);

      if (!word.includes(letter)) {
        setErrors((e) => e + 1);
      }
    },
    [guessed, word, roundStatus],
  );

  /* Physical keyboard support */
  useEffect(() => {
    const handleKey = (e) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        handleGuess(letter);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleGuess]);

  const startNextWord = () => {
    const newUsed = [...usedWords, word];
    setUsedWords(newUsed);
    const next = pickWord(newUsed);
    setWord(next);
    setGuessed(new Set());
    setErrors(0);
    setRoundStatus('playing');
  };

  if (done) {
    return (
      <div className="game-success">
        {WORDS_TO_WIN} mots devinés d'affilée ! Vous êtes un vrai aventurier ! ⚔️
      </div>
    );
  }

  return (
    <div className="hangman">
      <div className="hangman__info">
        <span>Série : <strong>{wordsWon}</strong> / {WORDS_TO_WIN}</span>
        <span>Erreurs : <strong>{errors}</strong> / {MAX_ERRORS}</span>
      </div>

      <HangmanSvg errors={errors} />

      <div className="hangman__word" aria-live="polite">
        {word.split('').map((letter, i) => (
          <span
            key={i}
            className={`hangman__letter ${isLetterRevealed(letter) ? 'hangman__letter--revealed' : ''} ${roundStatus === 'lost' && !isLetterRevealed(letter) ? 'hangman__letter--missed' : ''}`}
          >
            {isLetterRevealed(letter) || roundStatus === 'lost' ? letter : '_'}
          </span>
        ))}
      </div>

      {roundStatus === 'playing' && (
        <div className="hangman__keyboard" role="group" aria-label="Clavier">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="hangman__keyboard-row">
              {row.split('').map((letter) => (
                <button
                  key={letter}
                  className={`hangman__key ${guessed.has(letter) ? (word.includes(letter) ? 'hangman__key--correct' : 'hangman__key--wrong') : ''}`}
                  onClick={() => handleGuess(letter)}
                  disabled={guessed.has(letter)}
                  aria-label={letter}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {roundStatus === 'won' && !done && (
        <div className="hangman__round-result animate-fade-in">
          <p className="hangman__round-text hangman__round-text--won">
            Bravo ! Mot trouvé !
          </p>
          <button className="game-btn game-btn--gold" onClick={startNextWord}>
            Mot suivant
          </button>
        </div>
      )}

      {roundStatus === 'lost' && (
        <div className="hangman__round-result animate-fade-in">
          <p className="hangman__round-text hangman__round-text--lost">
            Perdu ! Le mot était « {word} ». La série est remise à zéro.
          </p>
          <button className="game-btn" onClick={startNextWord}>
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
