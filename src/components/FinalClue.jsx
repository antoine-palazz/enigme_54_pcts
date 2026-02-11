import { useState, useEffect, useRef } from 'react';
import './FinalClue.css';

/* Obfuscated URL split across constants to deter casual source inspection */
const _A = atob('ZG9jcy5nb29nbGUuY29t'); // docs.google.com
const _B = atob('L2RvY3VtZW50L2Qv'); // /document/d/
const _C = atob('MWJNaXZDaVQwbUNmX2ZFZ0JCN2QxZ2txZ0xLQlFzSi0tYnJibnFEN19LYWs='); // 1bMivCiT0mCf_fEgBB7d1gkqgLKBQsJ--brbnqD7_Kak
const _D = atob('L2VkaXQ/dXNwPXNoYXJpbmc='); // /edit?usp=sharing
function getClueUrl() {
  return `${_A}${_B}${_C}${_D}`;
}

function Confetti() {
  const colors = ['#c9a84c', '#5c3d2e', '#2d5016', '#e0c872', '#8b6914', '#c0392b'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti__piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function FinalClue() {
  const [revealed, setRevealed] = useState(false);
  const urlRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const url = getClueUrl();
  const fullUrl = `https://${url}`;

  return (
    <div className="final-clue">
      <Confetti />
      <div className={`final-clue__scroll ${revealed ? 'final-clue__scroll--open' : ''}`}>
        <div className="final-clue__content">
          <h2 className="final-clue__heading">Félicitations, aventurier !</h2>
          <p className="final-clue__text">
            Vous avez triomphé de toutes les épreuves.
            <br />
            Voici votre indice pour la suite de la chasse au trésor :
          </p>
          <a
            ref={urlRef}
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="final-clue__url"
          >
            {fullUrl}
          </a>
          <p className="final-clue__hint">
            Notez bien cet indice avant de continuer votre quête !
          </p>
        </div>
      </div>
    </div>
  );
}
