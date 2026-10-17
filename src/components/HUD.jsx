import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Lock, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  HelpCircle, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { playClick, playError, getMuted, setMuted } from '../audio/soundEngine';

export default function HUD({
  currentRoomIndex,
  onSelectRoom,
  rooms = [],
  solvedRooms = [],
  collectedDigits = [null, null, null, null],
  timerSeconds = 1200,
  onOpenHelp,
  onOpenHandbook
}) {
  const [muted, setLocalMuted] = useState(getMuted());
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [lockToast, setLockToast] = useState(null);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const currentRoom = rooms[currentRoomIndex] || rooms[0];

  const formatTime = (totalSeconds) => {
    const safeSec = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSec / 60);
    const seconds = safeSec % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    const nextState = !muted;
    setMuted(nextState);
    setLocalMuted(nextState);
    if (!nextState) {
      playClick();
    }
  };

  const handleToggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const isRoomAccessible = (idx) => {
    if (idx === 0) return true;
    if (idx <= currentRoomIndex) return true;
    // Accessible if previous room is solved
    const prevRoom = rooms[idx - 1];
    if (prevRoom && solvedRooms.includes(prevRoom.id)) return true;
    return false;
  };

  const handleRoomClick = (idx) => {
    if (idx === currentRoomIndex) return;

    if (isRoomAccessible(idx)) {
      playClick();
      onSelectRoom(idx);
    } else {
      playError();
      const targetRoom = rooms[idx];
      setLockToast(`Dostęp zablokowany: Najpierw rozwiąż zagadkę w poprzednim pokoju!`);
      setTimeout(() => {
        setLockToast(null);
      }, 3000);
    }
  };

  const canGoNext = currentRoomIndex < rooms.length - 1 && isRoomAccessible(currentRoomIndex + 1);

  return (
    <header className="hud-header">
      {/* Toast Notification for Locked Rooms */}
      {lockToast && (
        <div className="hud-lock-toast" role="alert">
          <Lock size={16} />
          <span>{lockToast}</span>
        </div>
      )}

      {/* Brand & Room Info */}
      <div className="hud-title-zone">
        <div className="hud-brand">
          <Shield size={18} color="#38bdf8" />
          <span>Escape ROOM: Misja Logistyka</span>
        </div>
        <div className="hud-room-subtitle">
          {currentRoom ? currentRoom.name : ''}
        </div>
      </div>

      {/* Desktop Rooms Navigation Bar */}
      <nav className="hud-rooms-nav" aria-label="Nawigacja po pokojach">
        {rooms.map((room, idx) => {
          const isCurrent = idx === currentRoomIndex;
          const isSolved = solvedRooms.includes(room.id);
          const isAccessible = isRoomAccessible(idx);
          const isFinal = Boolean(room.isFinalRoom);

          let stateClass = '';
          if (isCurrent) stateClass += ' is-current';
          if (isSolved) stateClass += ' is-solved';
          if (isFinal) stateClass += ' is-final';
          if (!isAccessible) stateClass += ' is-locked';

          return (
            <button
              key={room.id}
              type="button"
              className={`hud-room-btn${stateClass}`}
              onClick={() => handleRoomClick(idx)}
              title={`${room.number ? `Pokój ${room.number}: ` : ''}${room.name}${!isAccessible ? ' (Zablokowany)' : ''}`}
            >
              {isSolved ? (
                <CheckCircle2 size={13} color="#10b981" />
              ) : !isAccessible ? (
                <Lock size={12} />
              ) : null}
              <span>{isFinal ? 'Sejf' : `P${idx + 1}`}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Stepper */}
      <div className="hud-mobile-stepper">
        <button
          type="button"
          className="hud-stepper-btn"
          disabled={currentRoomIndex === 0}
          onClick={() => {
            playClick();
            onSelectRoom(currentRoomIndex - 1);
          }}
          aria-label="Poprzedni pokój"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="hud-stepper-label">
          {currentRoom?.isFinalRoom ? 'Sejf Dyrektora' : `Pokój ${currentRoomIndex + 1} / ${rooms.length}`}
        </span>

        <button
          type="button"
          className="hud-stepper-btn"
          disabled={!canGoNext}
          onClick={() => {
            if (canGoNext) {
              playClick();
              onSelectRoom(currentRoomIndex + 1);
            }
          }}
          aria-label="Następny pokój"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Center/Right Stats Zone: Timer & Safe Code */}
      <div className="hud-stats-zone">
        {/* Handbook Button */}
        {onOpenHandbook && (
          <button
            type="button"
            className="hud-action-btn hud-handbook-btn"
            onClick={() => {
              playClick();
              onOpenHandbook();
            }}
            title="Otwórz Podręcznik Logistyki i BHP"
          >
            <BookOpen size={16} color="#fbbf24" />
            <span className="hud-handbook-text">Podręcznik BHP</span>
          </button>
        )}

        {/* Digital Countdown Timer */}
        <div 
          className={`hud-timer-container ${timerSeconds <= 300 ? 'is-warning' : ''}`}
          title="Pozostały czas na otwarcie obiektu"
        >
          <Clock size={15} className="hud-timer-icon" />
          <span className="hud-timer-digits">{formatTime(timerSeconds)}</span>
        </div>

        {/* Safe Code Digits Tracker */}
        <div className="hud-code-display" title="Cyfry kodu do sejfu zdobyte w zagadkach">
          <span className="hud-code-label">KOD:</span>
          <div className="hud-code-slots">
            {[0, 1, 2, 3].map((slotIdx) => {
              const digit = collectedDigits[slotIdx];
              const isFound = digit !== null && digit !== undefined;
              return (
                <div
                  key={slotIdx}
                  className={`hud-code-digit-box ${isFound ? 'is-unlocked' : ''}`}
                >
                  {isFound ? digit : '?'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls: Sound, Fullscreen, Help */}
        <div className="hud-actions-group">
          <button
            type="button"
            className="hud-action-btn"
            onClick={handleToggleMute}
            title={muted ? 'Włącz dźwięk' : 'Wycisz dźwięk'}
            aria-label="Przełącz dźwięk"
          >
            {muted ? <VolumeX size={17} color="#ef4444" /> : <Volume2 size={17} />}
          </button>

          <button
            type="button"
            className="hud-action-btn"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Opuść pełny ekran' : 'Tryb pełnoekranowy'}
            aria-label="Przełącz pełny ekran"
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </button>

          {onOpenHelp && (
            <button
              type="button"
              className="hud-action-btn"
              onClick={() => {
                playClick();
                onOpenHelp();
              }}
              title="Instrukcja i zasady gry"
              aria-label="Pomoc"
            >
              <HelpCircle size={17} color="#38bdf8" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
