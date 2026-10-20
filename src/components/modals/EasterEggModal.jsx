import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playFanfare, playKeypadBeep, playNokiaTone } from '../../audio/soundEngine';

const GRID_SIZE = 12;
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 }
];

export default function EasterEggModal({ 
  onClose, 
  isTimeout = false,
  onRestart,
  onAddExtraTime 
}) {
  const [phoneMode, setPhoneMode] = useState(isTimeout ? 'timeout-sms' : 'menu');
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [scale, setScale] = useState(1);

  const dirRef = useRef(dir);
  dirRef.current = dir;

  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTimeout) {
      playNokiaTone();
    }
  }, [isTimeout]);

  useEffect(() => {
    const updateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      const targetHeight = isTimeout ? 560 : 520;
      const targetWidth = 330;
      
      const availableHeight = vh - 24;
      const availableWidth = vw - 16;
      
      const scaleH = availableHeight / targetHeight;
      const scaleW = availableWidth / targetWidth;
      const fitScale = Math.min(1, Math.min(scaleH, scaleW));
      
      setScale(Math.max(0.62, Number(fitScale.toFixed(2))));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isTimeout]);

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

  const handleTouchStart = (e) => {
    if (phoneMode !== 'snake') return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (phoneMode !== 'snake') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minDistance = 18;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minDistance) {
      const cur = dirRef.current;
      if (dx > 0 && cur.x === 0) setDir({ x: 1, y: 0 });
      else if (dx < 0 && cur.x === 0) setDir({ x: -1, y: 0 });
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minDistance) {
      const cur = dirRef.current;
      if (dy > 0 && cur.y === 0) setDir({ x: 0, y: 1 });
      else if (dy < 0 && cur.y === 0) setDir({ x: 0, y: -1 });
    }
  };

  useEffect(() => {
    if (!isPlaying || isGameOver || phoneMode !== 'snake') return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const nextHead = {
          x: (head.x + dirRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + dirRef.current.y + GRID_SIZE) % GRID_SIZE
        };

        if (prevSnake.some(seg => seg.x === nextHead.x && seg.y === nextHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [nextHead, ...prevSnake];

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
    <div className="modal-backdrop nokia-easter-backdrop" onClick={onClose}>
      <div 
        className="modal-window nokia-easter-window" 
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="nokia-phone-wrapper"
          style={{ 
            transform: scale < 1 ? `scale(${scale})` : 'none',
            transformOrigin: 'top center'
          }}
        >
          <div className="nokia-top-controls">
            {isTimeout && (
              <div className="nokia-timeout-banner">
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span><strong>CZAS MINĄŁ!</strong> Nowa wiadomość od Dyrektora!</span>
              </div>
            )}
            <button 
              type="button"
              className="modal-close-btn nokia-modal-close" 
              onClick={() => { playClick(); onClose(); }}
              title={isTimeout ? "Zamknij telefon" : "Schowaj telefon za obraz"}
              aria-label="Zamknij"
            >
              <X size={20} />
            </button>
          </div>

          <div className="nokia-3310-chassis">
            <div className="nokia-speaker-slot" />

            <div className="nokia-brand-logo">NOKIA</div>

            <div className="nokia-screen-bezel">
              <div 
                className="nokia-lcd-screen"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="nokia-lcd-statusbar">
                  <span className="nokia-signal-bars" title="Zasięg sieci">📶 IIII</span>
                  <span className="nokia-clock-text">{isTimeout ? '00:00' : '18:00'}</span>
                  <span className="nokia-battery-bars" title="Bateria">IIII 🔋</span>
                </div>

                {phoneMode === 'menu' && (
                  <div className="nokia-screen-content nokia-menu-layout">
                    <div className="nokia-lcd-title">MENU GŁÓWNE</div>
                    <div className="nokia-menu-items">
                      {isTimeout ? (
                        <>
                          <button 
                            type="button"
                            className="nokia-lcd-btn"
                            onClick={() => { playClick(); setPhoneMode('timeout-sms'); }}
                          >
                            ✉ 1. Wiadomość Dyrektora
                          </button>
                          <button 
                            type="button"
                            className="nokia-lcd-btn"
                            onClick={handleStartSnake}
                          >
                            🐍 2. Gra Snake II (Wąż)
                          </button>
                          {onAddExtraTime && (
                            <button 
                              type="button"
                              className="nokia-lcd-btn"
                              onClick={() => { playClick(); onAddExtraTime(300); }}
                            >
                              ⏳ 3. Poproś o +5 minut
                            </button>
                          )}
                          {onRestart && (
                            <button 
                              type="button"
                              className="nokia-lcd-btn"
                              onClick={() => { playClick(); onRestart(); }}
                            >
                              🔄 4. Zacznij od nowa
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button 
                            type="button"
                            className="nokia-lcd-btn"
                            onClick={() => { playClick(); setPhoneMode('sms'); }}
                          >
                            ✉ 1. Tajne SMS Dyrektora
                          </button>
                          <button 
                            type="button"
                            className="nokia-lcd-btn"
                            onClick={handleStartSnake}
                          >
                            🐍 2. Gra Snake (Wąż)
                          </button>
                          <button 
                            type="button"
                            className="nokia-lcd-btn"
                            onClick={triggerConfettiParty}
                          >
                            🎉 3. Bankiet & Konfetti
                          </button>
                        </>
                      )}
                    </div>
                    <div className="nokia-screen-footer">
                      <span>Wybierz</span>
                      <span onClick={() => { playClick(); onClose(); }} style={{ cursor: 'pointer' }}>Wyjdź</span>
                    </div>
                  </div>
                )}

                {phoneMode === 'timeout-sms' && (
                  <div className="nokia-screen-content nokia-sms-layout">
                    <div className="nokia-sms-header">
                      <span>✉ 1 NOWA (ALARM!)</span>
                      <span>00:00</span>
                    </div>
                    <div className="nokia-sms-body">
                      <div style={{ color: '#0d1a04', fontWeight: 800, fontSize: 12.5, marginBottom: 2 }}>
                        Od: Dyrektor Zarządu
                      </div>
                      <p style={{ fontWeight: 800, margin: '2px 0 4px', color: '#0d1a04', fontSize: 12 }}>
                        „CZAS MINĄŁ! Jak mogłeś nie wykonać tak prostego zadania?!”
                      </p>
                      <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.35, color: '#152406' }}>
                        „Otwarcie odwołane, komisja czeka pod drzwiami, a Ty nie ogarnąłeś podstaw logistyki i BHP! Co Ty tam w ogóle robiłeś?!”
                      </p>
                    </div>
                    <div className="nokia-sms-actions">
                      {onAddExtraTime && (
                        <button
                          type="button"
                          className="nokia-lcd-btn nokia-action-btn"
                          onClick={() => {
                            playClick();
                            onAddExtraTime(300);
                          }}
                        >
                          ⏳ Daj mi jeszcze 5 minut (+5 min)
                        </button>
                      )}
                      {onRestart && (
                        <button
                          type="button"
                          className="nokia-lcd-btn nokia-action-btn"
                          onClick={() => {
                            playClick();
                            onRestart();
                          }}
                        >
                          🔄 Zacznij misję od nowa
                        </button>
                      )}
                    </div>
                    <div className="nokia-screen-footer">
                      <span onClick={() => { playClick(); setPhoneMode('menu'); }} style={{ cursor: 'pointer' }}>Menu</span>
                      <span onClick={() => { playClick(); onClose(); }} style={{ cursor: 'pointer' }}>Zamknij</span>
                    </div>
                  </div>
                )}

                {phoneMode === 'sms' && (
                  <div className="nokia-screen-content nokia-sms-layout">
                    <div className="nokia-sms-header">
                      <span>✉ 1 Nowa Wiadomość</span>
                    </div>
                    <div className="nokia-sms-body">
                      <div style={{ color: '#0d1a04', fontWeight: 800, fontSize: 12.5, marginBottom: 2 }}>
                        Od: Dyrektor (Prywatny)
                      </div>
                      <p style={{ margin: '0 0 4px', fontSize: 12, lineHeight: 1.35 }}>
                        „Przyznaję się: żaden korek w Rusocinie! O 14:00 potknąłem się o kable w magazynie, bijąc rekord w Snake'a...
                      </p>
                      <p style={{ margin: '0 0 4px', fontSize: 12, lineHeight: 1.35 }}>
                        Ale najważniejsze: dzięki wielkie, że pracowaliście dla Japończyków! Bo wiecie... mamy rok 2007 i pierwszy prawdziwy escape room na świecie powstał właśnie w Japonii (Kioto), a nie w Polsce! 
                      </p>
                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.35 }}>
                        Więc oficjalnie robiliście nadgodziny dla centrali z Tokio. Arigato gozaimasu! Premia oczywiście w jenach (albo punktach w Snake'u). Jesteście mistrzami logistyki!”
                      </p>
                    </div>
                    <div className="nokia-screen-footer">
                      <span onClick={() => { playClick(); setPhoneMode('menu'); }} style={{ cursor: 'pointer' }}>Menu</span>
                      <span onClick={() => { playClick(); setPhoneMode('menu'); }} style={{ cursor: 'pointer' }}>Wstecz</span>
                    </div>
                  </div>
                )}

                {phoneMode === 'snake' && (
                  <div className="nokia-screen-content nokia-snake-layout">
                    <div className="nokia-snake-statusbar">
                      <span>WYNIK:{score}</span>
                      <span>REKORD:{highScore}</span>
                    </div>

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

                      {(!isPlaying || isGameOver) && (
                        <div className="nokia-game-overlay">
                          <div className="nokia-overlay-text">
                            {isGameOver ? 'KONIEC GRY' : 'SNAKE II'}
                          </div>
                          {isGameOver && (
                            <div className="nokia-overlay-sub">Pkt: {score}</div>
                          )}
                          <button 
                            type="button"
                            className="nokia-overlay-btn"
                            onClick={handleStartSnake}
                          >
                            {isGameOver ? 'ZAGRAJ [NAVI]' : 'START [NAVI]'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="nokia-screen-footer">
                      <span onClick={() => { playClick(); setPhoneMode(isTimeout ? 'timeout-sms' : 'menu'); }} style={{ cursor: 'pointer' }}>Wstecz</span>
                      <span>Przesuń palcem lub 2,4,6,8</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="nokia-nav-section">
              <button 
                type="button"
                className="nokia-btn nokia-btn-c" 
                onClick={() => {
                  playClick();
                  if (phoneMode === 'menu') onClose();
                  else setPhoneMode(isTimeout ? 'timeout-sms' : 'menu');
                }}
                title="Wstecz / Zamknij (C)"
              >
                C
              </button>

              <button 
                type="button"
                className="nokia-btn nokia-btn-navi"
                onClick={() => {
                  playClick();
                  if (phoneMode === 'menu') setPhoneMode('snake');
                  else if (phoneMode === 'snake' && (!isPlaying || isGameOver)) handleStartSnake();
                  else if (phoneMode === 'sms' || phoneMode === 'timeout-sms') setPhoneMode('menu');
                }}
                title="Przycisk główny NAVI"
              >
                <div className="nokia-navi-accent" />
              </button>

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

            <div className="nokia-keypad-grid">
              <button type="button" className="nokia-key" onClick={() => handleNumClick(1)}>
                <span className="nokia-key-num">1</span>
                <span className="nokia-key-sub">o_o</span>
              </button>
              <button 
                type="button" 
                className={`nokia-key ${phoneMode === 'snake' ? 'is-snake-dir' : ''}`} 
                onClick={() => handleNumClick(2)}
              >
                <span className="nokia-key-num">2</span>
                <span className="nokia-key-sub">{phoneMode === 'snake' ? '▲ GÓRA' : 'abc ▲'}</span>
              </button>
              <button type="button" className="nokia-key" onClick={() => handleNumClick(3)}>
                <span className="nokia-key-num">3</span>
                <span className="nokia-key-sub">def</span>
              </button>

              <button 
                type="button" 
                className={`nokia-key ${phoneMode === 'snake' ? 'is-snake-dir' : ''}`} 
                onClick={() => handleNumClick(4)}
              >
                <span className="nokia-key-num">4</span>
                <span className="nokia-key-sub">{phoneMode === 'snake' ? '◄ LEWO' : '◄ ghi'}</span>
              </button>
              <button 
                type="button" 
                className={`nokia-key ${phoneMode === 'snake' ? 'is-snake-dir' : ''}`} 
                onClick={() => handleNumClick(5)}
              >
                <span className="nokia-key-num">5</span>
                <span className="nokia-key-sub">{phoneMode === 'snake' ? 'START' : 'jkl'}</span>
              </button>
              <button 
                type="button" 
                className={`nokia-key ${phoneMode === 'snake' ? 'is-snake-dir' : ''}`} 
                onClick={() => handleNumClick(6)}
              >
                <span className="nokia-key-num">6</span>
                <span className="nokia-key-sub">{phoneMode === 'snake' ? 'PRAWO ►' : 'mno ►'}</span>
              </button>

              <button type="button" className="nokia-key" onClick={() => handleNumClick(7)}>
                <span className="nokia-key-num">7</span>
                <span className="nokia-key-sub">pqrs</span>
              </button>
              <button 
                type="button" 
                className={`nokia-key ${phoneMode === 'snake' ? 'is-snake-dir' : ''}`} 
                onClick={() => handleNumClick(8)}
              >
                <span className="nokia-key-num">8</span>
                <span className="nokia-key-sub">{phoneMode === 'snake' ? '▼ DÓŁ' : 'tuv ▼'}</span>
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

            <div className="nokia-mic-hole" />
          </div>
        </div>
      </div>
    </div>
  );
}
