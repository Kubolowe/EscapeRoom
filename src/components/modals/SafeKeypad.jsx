import React, { useState } from 'react';
import { X, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { playClick, playKeypadBeep, playError, playSafeMechanism, playFanfare } from '../../audio/soundEngine';
import confetti from 'canvas-confetti';

const TARGET_CODE = '2007';

export default function SafeKeypad({ 
  onClose, 
  onUnlockSuccess,
  collectedDigits 
}) {
  const [inputCode, setInputCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('WPROWADŹ KOD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleKeyPress = (num) => {
    if (isProcessing || isUnlocked) return;
    if (inputCode.length >= 4) return;

    playKeypadBeep(900 + num * 60);
    const nextCode = inputCode + num;
    setInputCode(nextCode);
    setIsError(false);
    setStatusMessage('WPROWADZANIE...');
  };

  const handleClear = () => {
    if (isProcessing || isUnlocked) return;
    playClick();
    setInputCode('');
    setIsError(false);
    setStatusMessage('WPROWADŹ KOD');
  };

  const handleEnter = () => {
    if (isProcessing || isUnlocked) return;
    if (inputCode.length !== 4) {
      playError();
      setIsError(true);
      setStatusMessage('KOD MUSI MIEĆ 4 CYFRY');
      return;
    }

    setIsProcessing(true);

    if (inputCode === TARGET_CODE) {
      // SUCCESS!
      setIsUnlocked(true);
      setStatusMessage('KOD POPRAWNY: OTWARCIE...');
      playSafeMechanism();

      // Launch victory confetti
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        playFanfare();
      }, 700);

      // Trigger app victory transition
      setTimeout(() => {
        onUnlockSuccess();
      }, 2400);
    } else {
      // WRONG CODE
      playError();
      setIsError(true);
      setStatusMessage('BŁĘDNY KOD - ODMOWA');
      setTimeout(() => {
        setInputCode('');
        setIsError(false);
        setStatusMessage('WPROWADŹ KOD');
        setIsProcessing(false);
      }, 1200);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {isUnlocked ? <Unlock size={18} color="var(--accent-green)" /> : <Lock size={18} color="var(--accent-cyan)" />}
            <span className="modal-title-text">Szyfrator Pancerny: Gabinet Dyrektora</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ alignItems: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', margin: 0 }}>
            Wprowadź 4-cyfrowy kod autoryzacyjny zebrany z poszczególnych stref logistycznych obiektu.
          </p>

          {/* Hint on collected digits from HUD */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 12,
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>Cyfry w Twoim notatniku logistycznym:</span>
            <strong style={{ letterSpacing: 2, fontFamily: 'var(--font-mono)' }}>
              {collectedDigits.map((d) => (d !== null && d !== undefined ? d : '•')).join(' ')}
            </strong>
          </div>

          {/* Tactile Keypad Panel */}
          <div className={`safe-keypad-panel ${isError ? 'keypad-shake' : ''}`}>
            {/* LED Screen */}
            <div className="safe-screen-outer">
              <div 
                className="safe-screen-led" 
                style={{ color: isUnlocked ? '#10b981' : isError ? '#ef4444' : '#38bdf8' }}
              >
                {inputCode.padEnd(4, '_').split('').join(' ')}
              </div>
              <div 
                className="safe-screen-status"
                style={{ color: isUnlocked ? '#10b981' : isError ? '#ef4444' : 'var(--text-muted)' }}
              >
                {statusMessage}
              </div>
            </div>

            {/* Keys Grid */}
            <div className="safe-keys-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  className="safe-num-btn"
                  onClick={() => handleKeyPress(num)}
                  disabled={isProcessing || isUnlocked}
                >
                  {num}
                </button>
              ))}

              <button
                className="safe-num-btn safe-func-btn safe-func-clear"
                onClick={handleClear}
                disabled={isProcessing || isUnlocked}
                title="Wyczyść kod"
              >
                C
              </button>

              <button
                className="safe-num-btn"
                onClick={() => handleKeyPress(0)}
                disabled={isProcessing || isUnlocked}
              >
                0
              </button>

              <button
                className="safe-num-btn safe-func-btn safe-func-enter"
                onClick={handleEnter}
                disabled={isProcessing || isUnlocked}
                title="Zatwierdź kod"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
