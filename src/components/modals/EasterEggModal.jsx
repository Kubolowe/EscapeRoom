import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Trophy, Gamepad2, Play, RotateCcw, Volume2, Award, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playFanfare, playKeypadBeep } from '../../audio/soundEngine';

const GRID_SIZE = 12;
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 }
];

export default function EasterEggModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('confession'); // 'confession' | 'snake'
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 0, y: -1 }); // moving up
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
  };

  const triggerConfettiParty = () => {
    playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Keyboard navigation for Snake
  useEffect(() => {
    if (activeTab !== 'snake') return;

    const handleKeyDown = (e) => {
      const cur = dirRef.current;
      if (e.key === 'ArrowUp' && cur.y === 0) {
        e.preventDefault();
        setDir({ x: 0, y: -1 });
      } else if (e.key === 'ArrowDown' && cur.y === 0) {
        e.preventDefault();
        setDir({ x: 0, y: 1 });
      } else if (e.key === 'ArrowLeft' && cur.x === 0) {
        e.preventDefault();
        setDir({ x: -1, y: 0 });
      } else if (e.key === 'ArrowRight' && cur.x === 0) {
        e.preventDefault();
        setDir({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Game loop tick
  useEffect(() => {
    if (!isPlaying || isGameOver || activeTab !== 'snake') return;

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
    }, 180);

    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, food, activeTab, highScore]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-window" 
        style={{ 
          maxWidth: 680, 
          border: '1px solid rgba(245, 158, 11, 0.5)',
          boxShadow: '0 0 35px rgba(245, 158, 11, 0.25)' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
          <div className="modal-title-group">
            <Sparkles size={20} color="#fbbf24" />
            <div>
              <div className="modal-title-text" style={{ color: '#fbbf24' }}>
                SEKRETNY SCHOWEK ZA OBRAZEM (EASTER EGG ✨)
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Ukryta skrytka Dyrektora Generalnego • Rok 2007
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        {/* Navigation Tabs inside Easter Egg */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          <button
            onClick={() => { playClick(); setActiveTab('confession'); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: activeTab === 'confession' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'confession' ? '2px solid #fbbf24' : '2px solid transparent',
              color: activeTab === 'confession' ? '#fbbf24' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <span>📜 Tajne Wyznanie Dyrektora</span>
          </button>

          <button
            onClick={() => { playClick(); setActiveTab('snake'); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: activeTab === 'snake' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'snake' ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === 'snake' ? '#10b981' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <Gamepad2 size={16} />
            <span>Nokia Snake 2007 (Mini-gra)</span>
          </button>
        </div>

        <div className="modal-body" style={{ padding: 20 }}>
          {/* TAB 1: Confession & Fun Facts */}
          {activeTab === 'confession' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Retro Paper Confession */}
              <div className="paper-document" style={{ border: '2px dashed #b45309', background: '#fffbeb' }}>
                <div className="paper-stamp" style={{ borderColor: '#dc2626', color: '#dc2626' }}>ŚCIŚLE TAJNE</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 6 }}>
                  OSOBISTY ZAPIS DYREKTORA • 14 PAŹDZIERNIKA 2007, GODZ. 16:45
                </div>
                <div className="paper-text" style={{ color: '#451a03', fontStyle: 'italic', lineHeight: 1.6 }}>
                  {`"Jeśli to czytasz, to znaczy, że odsunąłeś mój portret założycielski... Brawo za spostrzegawczość!
                  
Muszę się do czegoś przyznać: ten cały paraliż z zatorami i pomylonymi skrzyniami to nie była do końca wina dostawcy z Katowic. O 14:30 próbowałem wgrać węża (Snake) na telefon służbowy i potknąłem się o główny przedłużacz w Magazynie, rozłączając procedury... 
                  
Ale to właśnie sprawdzian dla prawdziwego Zespołu Logistyki! Poradziliście sobie fenomenalnie — opanowaliście ścieżkę krytyczną, zabezpieczyliście optykę, wyprostowaliście BHP i uratowaliście otwarcie obiektu. Jesteście legendami logistyki!"`}
                </div>
              </div>

              {/* Action: Confetti Launch */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 16px',
                borderRadius: 8
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: 14 }}>
                    🎉 Ukryty Toast Dyrektora
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Wystrzel confetti i odpal fanfarę za odnalezienie schowka!
                  </div>
                </div>

                <button
                  type="button"
                  className="hud-action-btn"
                  onClick={triggerConfettiParty}
                  style={{
                    width: 'auto',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000000',
                    fontWeight: 700,
                    borderRadius: 6,
                    gap: 6
                  }}
                >
                  <Sparkles size={16} />
                  <span>Wiwat!</span>
                </button>
              </div>

              {/* Historical Trivia */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                color: '#e0f2fe',
                lineHeight: 1.5
              }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>💡 Ciekawostka historyczna:</strong> W 2007 roku w Polsce komercyjne Escape Roomy jeszcze w ogóle nie istniały! 
                Pierwszy oficjalny pokój ucieczek powstał w Kioto w Japonii właśnie w 2007 roku (autorstwa Takao Kato / SCRAP). 
                Dopiero 4 lata później zjawisko dotarło do Europy (Budapeszt 2011). Nasza gra to nostalgiczny wehikuł czasu!
              </div>
            </div>
          )}

          {/* TAB 2: Playable Snake 2007 */}
          {activeTab === 'snake' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: 320,
                fontSize: 13,
                fontWeight: 700
              }}>
                <span style={{ color: '#10b981' }}>WYNIK: {score}</span>
                <span style={{ color: '#fbbf24' }}>REKORD: {highScore}</span>
              </div>

              {/* Nokia Green Phosphor Screen */}
              <div style={{
                width: 264,
                height: 264,
                background: '#8bac0f',
                border: '6px solid #306230',
                borderRadius: 8,
                boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.4), 0 4px 14px rgba(0,0,0,0.6)',
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                padding: 4,
                boxSizing: 'border-box'
              }}>
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                  const x = idx % GRID_SIZE;
                  const y = Math.floor(idx / GRID_SIZE);
                  const isHead = snake[0].x === x && snake[0].y === y;
                  const isBody = snake.some((seg, sIdx) => sIdx > 0 && seg.x === x && seg.y === y);
                  const isFoodCell = food.x === x && food.y === y;

                  let cellColor = 'transparent';
                  if (isHead) cellColor = '#0f380f';
                  else if (isBody) cellColor = '#306230';
                  else if (isFoodCell) cellColor = '#0f380f';

                  return (
                    <div
                      key={idx}
                      style={{
                        background: cellColor,
                        borderRadius: isFoodCell ? '50%' : 1,
                        margin: 1,
                        boxShadow: isHead ? '0 0 2px #0f380f' : 'none'
                      }}
                    />
                  );
                })}

                {/* Overlay when game over or not started */}
                {(!isPlaying || isGameOver) && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 56, 15, 0.88)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderRadius: 4,
                    color: '#9bbc0f',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>
                      {isGameOver ? 'KONIEC GRY' : 'SNAKE 2007'}
                    </div>
                    {isGameOver && (
                      <div style={{ fontSize: 12 }}>Zdobyte punkty: {score}</div>
                    )}
                    <button
                      onClick={handleStartSnake}
                      style={{
                        marginTop: 4,
                        background: '#9bbc0f',
                        color: '#0f380f',
                        border: 'none',
                        padding: '6px 14px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: 4
                      }}
                    >
                      {isGameOver ? 'ZAGRAJ PONOWNIE' : 'START GRY'}
                    </button>
                  </div>
                )}
              </div>

              {/* On-screen controls for mobile / ease of use */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 44px)',
                gridTemplateRows: 'repeat(2, 40px)',
                gap: 6,
                marginTop: 4
              }}>
                <div />
                <button
                  type="button"
                  className="hud-action-btn"
                  onClick={() => { if (dirRef.current.y === 0) setDir({ x: 0, y: -1 }); }}
                  disabled={!isPlaying}
                  style={{ width: '100%', height: '100%' }}
                  aria-label="W górę"
                >
                  ▲
                </button>
                <div />
                <button
                  type="button"
                  className="hud-action-btn"
                  onClick={() => { if (dirRef.current.x === 0) setDir({ x: -1, y: 0 }); }}
                  disabled={!isPlaying}
                  style={{ width: '100%', height: '100%' }}
                  aria-label="W lewo"
                >
                  ◄
                </button>
                <button
                  type="button"
                  className="hud-action-btn"
                  onClick={() => { if (dirRef.current.y === 0) setDir({ x: 0, y: 1 }); }}
                  disabled={!isPlaying}
                  style={{ width: '100%', height: '100%' }}
                  aria-label="W dół"
                >
                  ▼
                </button>
                <button
                  type="button"
                  className="hud-action-btn"
                  onClick={() => { if (dirRef.current.x === 0) setDir({ x: 1, y: 0 }); }}
                  disabled={!isPlaying}
                  style={{ width: '100%', height: '100%' }}
                  aria-label="W prawo"
                >
                  ►
                </button>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Steruj strzałkami na klawiaturze lub przyciskami powyżej.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
