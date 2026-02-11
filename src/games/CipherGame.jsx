import { useState, useCallback } from 'react';
import './CipherGame.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ORIGINAL_TEXT = 'LE TRESOR EST CACHE SOUS LA PIERRE ANCIENNE';
const SHIFT = 7;

function normalize(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function encrypt(text, shift) {
  return text
    .split('')
    .map((ch) => {
      const idx = ALPHABET.indexOf(ch.toUpperCase());
      if (idx === -1) return ch;
      return ALPHABET[(idx + shift) % 26];
    })
    .join('');
}

const ENCRYPTED_TEXT = encrypt(ORIGINAL_TEXT, SHIFT);

export default function CipherGame({ onComplete }) {
  const [currentShift, setCurrentShift] = useState(1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null); // null | 'wrong'
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const handleValidate = useCallback(
    (e) => {
      e.preventDefault();
      if (done) return;

      const okShift = currentShift === SHIFT;
      const okText = normalize(guess) === normalize(ORIGINAL_TEXT);

      if (okShift && okText) {
        setRevealed(true);
        setDone(true);
        setTimeout(onComplete, 1400);
        return;
      }

      setAttempts((a) => a + 1);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 700);
    },
    [currentShift, guess, done, onComplete],
  );

  if (done) {
    return (
      <div className="game-success">
        Le code secret a été percé ! 🔓
      </div>
    );
  }

  const wordCount = ENCRYPTED_TEXT.trim().split(/\s+/).filter(Boolean).length;
  const charCount = ENCRYPTED_TEXT.replace(/\s/g, '').length;

  return (
    <div className="cipher">
      <p className="cipher__instruction">
        Ce message a été chiffré avec un <strong>code de César</strong>.
        Utilisez le curseur pour trouver le bon décalage… mais <strong>le texte déchiffré ne sera pas affiché</strong>
        avant validation. À vous de le reconstituer et de le saisir !
      </p>

      <div className="cipher__encrypted">
        <span className="cipher__label">Message chiffré :</span>
        <code className="cipher__text">{ENCRYPTED_TEXT}</code>
        <p className="cipher__meta">
          Indices (très radins) : <strong>{wordCount}</strong> mots, <strong>{charCount}</strong> lettres (hors espaces).
        </p>
      </div>

      <div className="cipher__controls">
        <label className="cipher__slider-label" htmlFor="shift-slider">
          Décalage : <strong>{currentShift}</strong>
        </label>
        <input
          id="shift-slider"
          type="range"
          min="1"
          max="25"
          value={currentShift}
          onChange={(e) => setCurrentShift(Number(e.target.value))}
          className="cipher__slider"
          aria-label={`Décalage : ${currentShift}`}
        />
        <div className="cipher__slider-range">
          <span>1</span>
          <span>25</span>
        </div>
      </div>

      <div className="cipher__wheel" aria-hidden="true">
        {ALPHABET.split('').map((letter, i) => (
          <span key={letter} className="cipher__wheel-letter">
            <span className="cipher__wheel-original">{letter}</span>
            <span className="cipher__wheel-arrow">→</span>
            <span className="cipher__wheel-shifted">
              {ALPHABET[(i + currentShift) % 26]}
            </span>
          </span>
        ))}
      </div>

      <form className="cipher__answer" onSubmit={handleValidate}>
        <label className="cipher__label" htmlFor="cipher-guess">
          Votre texte déchiffré (recopiez la phrase complète) :
        </label>
        <input
          id="cipher-guess"
          type="text"
          className={`game-input ${feedback === 'wrong' ? 'animate-shake' : ''}`}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Ex: LE ... (gardez les espaces)"
          autoComplete="off"
          spellCheck={false}
          aria-describedby="cipher-help"
        />
        <p id="cipher-help" className="cipher__help">
          Astuce : majuscules/minuscules et accents ne comptent pas. Les espaces comptent.
          {attempts >= 3 ? (
            <>
              {' '}
              Bonus : le message commence par <strong>LE</strong>.
            </>
          ) : null}
        </p>

        <div className="cipher__action">
          <button className="game-btn game-btn--gold" type="submit">
            Valider
          </button>
          <span className="cipher__tries" aria-live="polite">
            Tentatives : <strong>{attempts}</strong>
          </span>
        </div>
      </form>

      {revealed ? (
        <div className="cipher__reveal animate-fade-in">
          <span className="cipher__label">Message déchiffré :</span>
          <code className="cipher__text cipher__text--result cipher__text--correct">
            {ORIGINAL_TEXT}
          </code>
        </div>
      ) : null}
    </div>
  );
}
