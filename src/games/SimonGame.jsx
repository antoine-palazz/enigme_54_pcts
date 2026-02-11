import { useState, useCallback, useRef, useEffect } from 'react';
import './SimonGame.css';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const LABELS = {
  red: 'Pierre rouge',
  blue: 'Pierre bleue',
  green: 'Pierre verte',
  yellow: 'Pierre jaune',
};
const WIN_LEVEL = 12;

/* Frequencies for Web Audio API tones */
const FREQS = { red: 329.63, blue: 261.63, green: 392.0, yellow: 440.0 };

function playTone(color, duration = 400) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = FREQS[color];
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    /* Web Audio not available */
  }
}

export default function SimonGame({ onComplete }) {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('idle'); /* idle | playing | input | fail | done */
  const timeoutRef = useRef([]);

  const clearTimeouts = useCallback(() => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const flashColor = useCallback((color, duration = 400) => {
    setActiveColor(color);
    playTone(color, duration);
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        setActiveColor(null);
        const id2 = setTimeout(resolve, 150);
        timeoutRef.current.push(id2);
      }, duration);
      timeoutRef.current.push(id);
    });
  }, []);

  const playSequence = useCallback(
    async (seq) => {
      setIsPlaying(true);
      setStatus('playing');
      await new Promise((r) => {
        const id = setTimeout(r, 500);
        timeoutRef.current.push(id);
      });
      for (const color of seq) {
        await flashColor(color);
      }
      setIsPlaying(false);
      setStatus('input');
    },
    [flashColor],
  );

  const startGame = useCallback(() => {
    clearTimeouts();
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setStatus('idle');
    /* Start first round with fresh sequence */
    const firstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSequence = [firstColor];
    setSequence(newSequence);
    setLevel(1);
    playSequence(newSequence);
  }, [clearTimeouts, playSequence]);

  const handleColorClick = useCallback(
    (color) => {
      if (isPlaying || status !== 'input') return;

      flashColor(color, 200);
      const newPlayerSequence = [...playerSequence, color];
      setPlayerSequence(newPlayerSequence);

      const currentIndex = newPlayerSequence.length - 1;

      if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
        /* Wrong! */
        setStatus('fail');
        return;
      }

      if (newPlayerSequence.length === sequence.length) {
        /* Round complete */
        if (level >= WIN_LEVEL) {
          setStatus('done');
          setTimeout(onComplete, 1200);
        } else {
          setStatus('playing');
          const id = setTimeout(() => {
            const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            const newSequence = [...sequence, nextColor];
            setSequence(newSequence);
            setPlayerSequence([]);
            setLevel((l) => l + 1);
            playSequence(newSequence);
          }, 800);
          timeoutRef.current.push(id);
        }
      }
    },
    [isPlaying, status, playerSequence, sequence, level, onComplete, flashColor, playSequence],
  );

  if (status === 'done') {
    return (
      <div className="game-success">
        La séquence sacrée a été reproduite ! 🔮
      </div>
    );
  }

  return (
    <div className="simon">
      <div className="simon__info">
        <span>Niveau : <strong>{level}</strong> / {WIN_LEVEL}</span>
        {status === 'fail' && (
          <span className="simon__fail">Erreur ! Recommencez.</span>
        )}
        {status === 'idle' && (
          <span className="simon__hint">Appuyez sur « Commencer » pour lancer la séquence.</span>
        )}
        {status === 'playing' && (
          <span className="simon__hint">Observez la séquence…</span>
        )}
        {status === 'input' && (
          <span className="simon__hint">À votre tour ! Reproduisez la séquence.</span>
        )}
      </div>

      <div className="simon__board">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`simon__btn simon__btn--${color} ${activeColor === color ? 'simon__btn--active' : ''}`}
            onClick={() => handleColorClick(color)}
            disabled={isPlaying || status === 'fail' || status === 'idle'}
            aria-label={LABELS[color]}
          />
        ))}
      </div>

      {(status === 'idle' || status === 'fail') && (
        <button className="game-btn game-btn--gold" onClick={startGame}>
          {status === 'fail' ? 'Réessayer' : 'Commencer'}
        </button>
      )}
    </div>
  );
}
