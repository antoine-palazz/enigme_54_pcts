import { useEffect, useRef, useState } from 'react';
import './IntroOverlay.css';

export default function IntroOverlay({ onClose }) {
  const [canContinue, setCanContinue] = useState(false);
  const continueBtnRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t1 = window.setTimeout(() => setCanContinue(true), 1200);

    return () => {
      window.clearTimeout(t1);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (canContinue && continueBtnRef.current) {
      continueBtnRef.current.focus();
    }
  }, [canContinue]);

  return (
    <div className="intro" role="dialog" aria-modal="true" aria-label="Message d'accueil">
      <div className="intro__backdrop" aria-hidden="true" />

      <div className="intro__card animate-fade-in">
        <div className="intro__top">
          <div className="intro__compass" aria-hidden="true">
            🧭
          </div>
          <div>
            <h2 className="intro__title">Pause de campement</h2>
            <p className="intro__subtitle">Message scellé</p>
          </div>
        </div>

        <div className="intro__scroll">
          <p className="intro__line intro__line--1">
            Hé vous… oui, <strong>vous</strong>.
          </p>
          <p className="intro__line intro__line--2">
            <strong>Antoine</strong> vous félicite d’avoir dépassé la moitié des énigmes.
          </p>
          <p className="intro__line intro__line--3">
            Il espère que vous vous amusez bien, il est fier de vous…
          </p>
          <p className="intro__line intro__line--4">
            …et il a hâte de vous voir à l’arrivée. Continuez comme ça !
          </p>

          <div className="intro__stamp" aria-hidden="true">
            Cachet officiel : <span className="intro__stamp-badge">Club des 52%+</span>
          </div>

          <p className="intro__signature">— Antoine</p>
        </div>

        <div className="intro__actions">
          <button
            ref={continueBtnRef}
            className={`game-btn game-btn--gold ${canContinue ? '' : 'intro__btn--disabled'}`}
            onClick={onClose}
            disabled={!canContinue}
          >
            Continuer l’aventure
          </button>
        </div>
      </div>
    </div>
  );
}

