import React from 'react';
import { X, HelpCircle, Target, KeyRound, Lightbulb, Volume2 } from 'lucide-react';
import { playClick } from '../../audio/soundEngine';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: 620 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <HelpCircle size={18} color="var(--accent-cyan)" />
            <span className="modal-title-text">Instrukcja i Zasady Gry Dydaktycznej</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Target size={22} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Cel Rozgrywki</strong>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>
                  Przejdź przez 6 pokoi logistycznych, zbadaj interaktywne przedmioty oznaczone pulsującymi kółkami i rozwiąż zagadki decyzyjne. 
                  Cztery z pokoi ujawnią cyfry składające się na 4-cyfrowy kod do sejfu w Gabinecie Dyrektora.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <KeyRound size={22} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Kod do Sejfu Dyrektora</strong>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>
                  Na górnym pasku HUD widzisz postęp odblokowywania kodu (np. <strong>2 _ _ _</strong>). 
                  Kiedy zbierzesz wszystkie 4 cyfry, wejdź do Gabinetu Dyrektora, kliknij sejf i wprowadź kod na klawiaturze numerycznej.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Lightbulb size={22} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Interaktywne Kółka (Hotspoty)</strong>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>
                  Każde pulsujące kółko kryje dokument, raport techniczny lub zagadkę. 
                  Po rozwiązaniu zagadki kółko otrzyma zielony znacznik ukończenia.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Volume2 size={22} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: '#ffffff' }}>Efekty Dźwiękowe (Web Audio API)</strong>
                <p style={{ color: '#cbd5e1', fontSize: 13, marginTop: 2 }}>
                  Wszystkie dźwięki generowane są proceduralnie przez procesor przeglądarki. 
                  Możesz w każdej chwili wyciszyć lub włączyć dźwięk przyciskiem głośnika na pasku HUD.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
            <button className="btn-primary" onClick={() => { playClick(); onClose(); }}>
              Powrót do gry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
