import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playFanfare, playKeypadBeep } from '../../audio/soundEngine';

const GRID_SIZE = 12;
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 }
];

export default function EasterEggModal({ onClose }) {
  const [phoneMode, setPhoneMode] = useState('menu'); // 'menu' | 'sms' | 'snake'
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  // Generate food not on snake body
  const spawnFood = (currentSnake) => {
    let newFood;
    while (!newFood || currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    }
    return newFood;
  };

  const handleStartSnake = () => {
    playClick();
    setSnake(INITIAL_SNAKE);
    setDir({ x: 0, y: -1 });
    dirRef.current = { x: 0, y: -1 };
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(spawnFood(INITIAL_SNAKE));
    setPhoneMode('snake');
  };

  const triggerConfettiParty = () => {
    playFanfare();
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  // Keyboard navigation for Snake (both arrows and classic Nokia 2, 4, 6, 8 keys!)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const cur = dirRef.current;
      if (phoneMode === 'snake') {
        if ((e.key === 'ArrowUp' || e.key === '2') && cur.y === 0) {
          e.preventDefault();
          setDir({ x: 0, y: -1 });
        } else if ((e.key === 'ArrowDown' || e.key === '8') && cur.y === 0) {
          e.preventDefault();
          setDir({ x: 0, y: 1 });
        } else if ((e.key === 'ArrowLeft' || e.key === '4') && cur.x === 0) {
          e.preventDefault();
          setDir({ x: -1, y: 0 });
        } else if ((e.key === 'ArrowRight' || e.key === '6') && cur.x === 0) {
          e.preventDefault();
          setDir({ x: 1, y: 0 });
        } else if (e.key === ' ' || e.key === 'Enter') {
          if (!isPlaying || isGameOver) {
            e.preventDefault();
            handleStartSnake();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phoneMode, isPlaying, isGameOver]);

  // Snake loop tick
  useEffect(() => {
    if (!isPlaying || isGameOver || phoneMode !== 'snake') return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead = {
          x: (head.x + dirRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + dirRef.current.y + GRID_SIZE) % GRID_SIZE
        };

        // Self collision check
        if (prevSnake.some(seg => seg.x === nextHead.x && seg.y === nextHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

        // Eat food check
        if (nextHead.x === food.x && nextHead.y === food.y) {
          playKeypadBeep(1400);
          setScore((s) => {
            const nextScore = s + 1;
            if (nextScore > highScore) setHighScore(nextScore);
            return nextScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 170);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, food, phoneMode, highScore]);

  // Keypad click handler for 3310 numeric keys
  const handleNumClick = (key) => {
    playKeypadBeep(800 + key * 40);
    const cur = dirRef.current;
    if (phoneMode === 'snake') {
      if (key === 2 && cur.y === 0) setDir({ x: 0, y: -1 });
      else if (key === 8 && cur.y === 0) setDir({ x: 0, y: 1 });
      else if (key === 4 && cur.x === 0) setDir({ x: -1, y: 0 });
      else if (key === 6 && cur.x === 0) setDir({ x: 1, y: 0 });
      else if (key === 5) {
        if (!isPlaying || isGameOver) handleStartSnake();
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-window nokia-easter-window" 
        style={{ 
          maxWidth: 440,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button outside phone */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
          <button 
            className="modal-close-btn" 
            onClick={() => { playClick(); onClose(); }}
            title="Schowaj telefon za portret"
            aria-label="Zamknij"
            style={{ background: 'rgba(0, 0, 0, 0.7)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* NOKIA 3310 CHASSIS */}
        <div className="nokia-3310-chassis">
          {/* Top Speaker Earpiece */}
          <div className="nokia-speaker-slot" />

          {/* NOKIA Brand Imprint */}
          <div className="nokia-brand-logo">NOKIA</div>

          {/* Silver/Grey Screen Bezel */}
          <div className="nokia-screen-bezel">
            {/* Authentic Nokia Monochrome Greenish LCD Display */}
            <div className="nokia-lcd-screen">
              {/* LCD Top Status Bar (Signal bars, Battery bars, Clock) */}
              <div className="nokia-lcd-statusbar">
                <span className="nokia-signal-bars" title="Zasięg sieci">📶 IIII</span>
                <span className="nokia-clock-text">18:00</span>
                <span className="nokia-battery-bars" title="Bateria">IIII 🔋</span>
              </div>

              {/* SCREEN CONTENT: 1. MENU */}
              {phoneMode === 'menu' && (
                <div className="nokia-screen-content nokia-menu-layout">
                  <div className="nokia-lcd-title">MENU GŁÓWNE</div>
                  <div className="nokia-menu-items">
                    <button 
                      className="nokia-lcd-btn"
                      onClick={() => { playClick(); setPhoneMode('sms'); }}
                    >
                      ✉ 1. Tajne SMS Dyrektora
                    </button>
                    <button 
                      className="nokia-lcd-btn"
                      onClick={handleStartSnake}
                    >
                      🐍 2. Gra Snake (Wąż)
                    </button>
                    <button 
                      className="nokia-lcd-btn"
                      onClick={triggerConfettiParty}
                    >
                      🎉 3. Bankiet & Konfetti
                    </button>
                  </div>
                  <div className="nokia-screen-footer">
                    <span>Wybierz</span>
                    <span>Wstecz</span>
                  </div>
                </div>
              )}

              {/* SCREEN CONTENT: 2. SECRET SMS CONFESSION */}
              {phoneMode === 'sms' && (
                <div className="nokia-screen-content nokia-sms-layout">
                  <div className="nokia-sms-header">
                    <span>✉ 1 Nowa Wiadomość</span>
                  </div>
                  <div className="nokia-sms-body">
                    <strong>Od: Dyrektor</strong>
                    <p>
                      „Przyznaję się: żaden korek w Rusocinie! O 14:00 potknąłem się o kable w magazynie, bijąc rekord w Snake'a...
                    </p>
                    <p style={{ marginTop: 4 }}>
                      Ale najważniejsze: dzięki wielkie, że tak solidnie zapieprzaliście dla Japończyków! Bo wiecie... mamy rok 2007 i pierwszy prawdziwy escape room na świecie powstał właśnie w Japonii (Kioto), a nie w Polsce! 
                    </p>
                    <p style={{ marginTop: 4 }}>
                      Więc oficjalnie robiliście nadgodziny dla centrali z Tokio. Arigato gozaimasu! 🇯🇵🍣 Premia oczywiście w jenach (albo punktach w Snake'u). Jesteście mistrzami logistyki!”
                    </p>
                  </div>
                  <div className="nokia-screen-footer">
                    <span onClick={() => { playClick(); setPhoneMode('menu'); }} style={{ cursor: 'pointer' }}>Menu</span>
                    <span onClick={() => { playClick(); setPhoneMode('menu'); }} style={{ cursor: 'pointer' }}>Wstecz</span>
                  </div>
                </div>
              )}

              {/* SCREEN CONTENT: 3. PLAYABLE SNAKE GAME */}
              {phoneMode === 'snake' && (
                <div className="nokia-screen-content nokia-snake-layout">
                  <div className="nokia-snake-statusbar">
                    <span>WYNIK:{score}</span>
                    <span>REKORD:{highScore}</span>
                  </div>

                  {/* 12x12 Pixel Grid Canvas */}
                  <div className="nokia-snake-grid">
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                      const x = idx % GRID_SIZE;
                      const y = Math.floor(idx / GRID_SIZE);
                      const isHead = snake[0].x === x && snake[0].y === y;
                      const isBody = snake.some((seg, sIdx) => sIdx > 0 && seg.x === x && seg.y === y);
                      const isFoodCell = food.x === x && food.y === y;

                      let cellClass = 'nokia-pixel';
                      if (isHead) cellClass += ' is-head';
                      else if (isBody) cellClass += ' is-body';
                      else if (isFoodCell) cellClass += ' is-food';

                      return <div key={idx} className={cellClass} />;
                    })}

                    {/* Game Over / Start Overlay */}
                    {(!isPlaying || isGameOver) && (
                      <div className="nokia-game-overlay">
                        <div className="nokia-overlay-text">
                          {isGameOver ? 'KONIEC GRY' : 'SNAKE II'}
                        </div>
                        {isGameOver && (
                          <div className="nokia-overlay-sub">Pkt: {score}</div>
                        )}
                        <button 
                          className="nokia-overlay-btn"
                          onClick={handleStartSnake}
                        >
                          {isGameOver ? 'ZAGRAJ [NAVI]' : 'START [NAVI]'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="nokia-screen-footer">
                    <span onClick={() => { playClick(); setPhoneMode('menu'); }} style={{ cursor: 'pointer' }}>Menu</span>
                    <span>Steruj 2,4,6,8</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* NOKIA CONTROL BUTTONS: Navi-Key, C Key, Scroll Up/Down */}
          <div className="nokia-nav-section">
            {/* Left 'C' (Clear/Back) button */}
            <button 
              type="button"
              className="nokia-btn nokia-btn-c" 
              onClick={() => {
                playClick();
                if (phoneMode !== 'menu') setPhoneMode('menu');
                else onClose();
              }}
              title="Wstecz / Menu (C)"
            >
              C
            </button>

            {/* Central Iconic Oval NAVI Key */}
            <button 
              type="button"
              className="nokia-btn nokia-btn-navi"
              onClick={() => {
                playClick();
                if (phoneMode === 'menu') setPhoneMode('snake');
                else if (phoneMode === 'snake' && (!isPlaying || isGameOver)) handleStartSnake();
                else if (phoneMode === 'sms') setPhoneMode('menu');
              }}
              title="Przycisk główny NAVI"
            >
              <div className="nokia-navi-accent" />
            </button>

            {/* Right Scroll Up/Down Double Button */}
            <div className="nokia-btn-scroll-group">
              <button 
                type="button"
                className="nokia-scroll-arrow nokia-scroll-up"
                onClick={() => {
                  playClick();
                  const cur = dirRef.current;
                  if (phoneMode === 'snake' && cur.y === 0) setDir({ x: 0, y: -1 });
                }}
                title="W górę (▲)"
              >
                ▲
              </button>
              <button 
                type="button"
                className="nokia-scroll-arrow nokia-scroll-down"
                onClick={() => {
                  playClick();
                  const cur = dirRef.current;
                  if (phoneMode === 'snake' && cur.y === 0) setDir({ x: 0, y: 1 });
                }}
                title="W dół (▼)"
              >
                ▼
              </button>
            </div>
          </div>

          {/* 3x4 CLASSIC NUMERIC KEYPAD */}
          <div className="nokia-keypad-grid">
            <button type="button" className="nokia-key" onClick={() => handleNumClick(1)}>
              <span className="nokia-key-num">1</span>
              <span className="nokia-key-sub">o_o</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(2)}>
              <span className="nokia-key-num">2</span>
              <span className="nokia-key-sub">abc ▲</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(3)}>
              <span className="nokia-key-num">3</span>
              <span className="nokia-key-sub">def</span>
            </button>

            <button type="button" className="nokia-key" onClick={() => handleNumClick(4)}>
              <span className="nokia-key-num">4</span>
              <span className="nokia-key-sub">◄ ghi</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(5)}>
              <span className="nokia-key-num">5</span>
              <span className="nokia-key-sub">jkl</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(6)}>
              <span className="nokia-key-num">6</span>
              <span className="nokia-key-sub">mno ►</span>
            </button>

            <button type="button" className="nokia-key" onClick={() => handleNumClick(7)}>
              <span className="nokia-key-num">7</span>
              <span className="nokia-key-sub">pqrs</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(8)}>
              <span className="nokia-key-num">8</span>
              <span className="nokia-key-sub">tuv ▼</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(9)}>
              <span className="nokia-key-num">9</span>
              <span className="nokia-key-sub">wxyz</span>
            </button>

            <button type="button" className="nokia-key" onClick={() => handleNumClick(10)}>
              <span className="nokia-key-num">*</span>
              <span className="nokia-key-sub">+</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(0)}>
              <span className="nokia-key-num">0</span>
              <span className="nokia-key-sub">␣</span>
            </button>
            <button type="button" className="nokia-key" onClick={() => handleNumClick(11)}>
              <span className="nokia-key-num">#</span>
              <span className="nokia-key-sub">⇧</span>
            </button>
          </div>

          {/* Bottom Microphone Hole */}
          <div className="nokia-mic-hole" />
        </div>
      </div>
    </div>
  );
}
