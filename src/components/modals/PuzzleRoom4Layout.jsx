import React, { useState } from 'react';
import { X, Map, Check, AlertTriangle, Award, ShieldAlert } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

const BLUEPRINT_ZONES = [
  {
    id: 'z1-exit',
    name: 'Drzwi Wyjścia Ewakuacyjnego (EXIT)',
    isHazard: true,
    top: '12%',
    left: '68%',
    width: '26%',
    height: '24%',
    desc: 'BŁĄD KRYTYCZNY BHP: Drzwi ewakuacyjne zastawione paletą ze starymi pudłami i owinięte łańcuchem!'
  },
  {
    id: 'z2-fast-rotation',
    name: 'Magazyn Rekwizytów Klasy A (Wysoka Rotacja)',
    isHazard: true,
    top: '64%',
    left: '70%',
    width: '24%',
    height: '28%',
    desc: 'BŁĄD LOGISTYCZNY: Najczęściej używane rekwizyty umieszczono na szarym końcu korytarza (50m drogi), zamiast przy wejściu!'
  },
  {
    id: 'z3-corridor',
    name: 'Główny ciąg pieszy (Szerokość 1,8m)',
    isHazard: false,
    top: '40%',
    left: '26%',
    width: '40%',
    height: '20%',
    desc: 'STREFA PRAWIDŁOWA: Ciąg pieszy spełnia wymagane normy szerokości (> 1,4m) i nie zawiera przeszkód.'
  },
  {
    id: 'z4-extinguisher',
    name: 'Punkt Gaśniczy PPOŻ i Apteczka',
    isHazard: false,
    top: '14%',
    left: '10%',
    width: '24%',
    height: '22%',
    desc: 'STREFA PRAWIDŁOWA: Gaśnica proszkowa 6kg z ważnym atestem 2007 r. i oznakowaniem fotoluminescencyjnym.'
  },
  {
    id: 'z5-control-desk',
    name: 'Stanowisko Mistrza Gry',
    isHazard: false,
    top: '64%',
    left: '10%',
    width: '25%',
    height: '28%',
    desc: 'STREFA PRAWIDŁOWA: Ergonomiczne stanowisko pracy z bezpośrednim podglądem na wyjścia.'
  }
];

export default function PuzzleRoom4Layout({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [foundHazards, setFoundHazards] = useState(isAlreadySolved ? ['z1-exit', 'z2-fast-rotation'] : []);
  const [solved, setSolved] = useState(isAlreadySolved);
  const [feedback, setFeedback] = useState(null);

  const handleZoneClick = (zone) => {
    if (solved) return;
    playClick();

    if (zone.isHazard) {
      if (!foundHazards.includes(zone.id)) {
        const next = [...foundHazards, zone.id];
        setFoundHazards(next);
        setFeedback({ isError: false, text: `Wykryto zagrożenie! ${zone.desc}` });

        if (next.length === 2) {
          playSuccess();
          setSolved(true);
          onSolve('0', 2); // Award digit '0' at index 2
        }
      }
    } else {
      playError();
      setFeedback({ isError: true, text: `${zone.name}: ${zone.desc}` });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: 740 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Map size={18} color="var(--accent-cyan)" />
            <span className="modal-title-text">Sala Projektowa: Audyt Layoutu i Bezpieczeństwa BHP</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#e2e8f0', fontSize: 14 }}>
            Przeanalizuj poniższy rzut techniczny (blueprint). 
            Kliknij i wskaż <strong>2 krytyczne błędy</strong> (1 uchybienie BHP oraz 1 rażący błąd przepływu logistycznego).
            Znaleziono: <strong>{foundHazards.length} / 2</strong> błędów.
          </p>

          {/* Interactive Blueprint Layout */}
          <div className="blueprint-container">
            {BLUEPRINT_ZONES.map((zone) => {
              const isFound = foundHazards.includes(zone.id);

              return (
                <div
                  key={zone.id}
                  className={`blueprint-zone ${zone.isHazard ? 'is-hazard' : 'is-safe'} ${isFound ? 'is-found' : ''}`}
                  style={{
                    top: zone.top,
                    left: zone.left,
                    width: zone.width,
                    height: zone.height
                  }}
                  onClick={() => handleZoneClick(zone)}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    {isFound && <ShieldAlert size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />}
                    <span>{zone.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div style={{
              background: feedback.isError ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${feedback.isError ? 'var(--accent-amber)' : 'var(--accent-red)'}`,
              borderRadius: 6,
              padding: '10px 14px',
              fontSize: 13,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <AlertTriangle size={16} color={feedback.isError ? 'var(--accent-amber)' : 'var(--accent-red)'} />
              <span>{feedback.text}</span>
            </div>
          )}

          {solved && (
            <div className="puzzle-success-banner">
              <div className="digit-reward-badge">0</div>
              <div>
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Audyt BHP i Layoutu Zakończony Sukcesem!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Wykryto zastawione wyjście oraz złą alokację zapasów. Zdobyto 3. cyfrę do sejfu: <strong>0</strong> (kod: <strong>2 0 0 _</strong>).
                </p>
              </div>
            </div>
          )}

          <div className="edu-callout">
            <Award size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="edu-callout-title">Wiedza Logistyczna: Analiza ABC i Drogi Ewakuacyjne</div>
              <div className="edu-callout-text">
                W logistyce magazynowej <strong>zasada ABC</strong> nakazuje umieszczać towary o najwyższej rotacji 
                (grupa A) w strefie o najkrótszej drodze transportu, redukując zbędny ruch wózka i pracowników. 
                Ponadto <strong>drogi ewakuacyjne</strong> to bezwzględny priorytet prawny BHP - nie mogą być zastawione nawet tymczasowo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
