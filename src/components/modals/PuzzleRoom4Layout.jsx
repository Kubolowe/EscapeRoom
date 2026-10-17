import React, { useState } from 'react';
import { 
  X, 
  Map, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  ShieldAlert, 
  Square,
  Search
} from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

const BLUEPRINT_ZONES = [
  {
    id: 'z1-exit',
    num: 1,
    category: 'Uchybienie BHP',
    name: 'Drzwi Wyjścia Ewakuacyjnego (EXIT)',
    shortName: 'Drzwi ewakuacyjne (EXIT)',
    isHazard: true,
    top: '10%',
    left: '68%',
    width: '28%',
    height: '26%',
    desc: 'BŁĄD KRYTYCZNY BHP: Drzwi ewakuacyjne zastawione paletą ze starymi pudłami i owinięte łańcuchem!'
  },
  {
    id: 'z2-fast-rotation',
    num: 2,
    category: 'Błąd Logistyczny',
    name: 'Magazyn Rekwizytów Klasy A (Wysoka Rotacja)',
    shortName: 'Magazyn rekwizytów (Grupa A)',
    isHazard: true,
    top: '62%',
    left: '68%',
    width: '28%',
    height: '30%',
    desc: 'BŁĄD LOGISTYCZNY: Najczęściej używane rekwizyty (Grupa A) umieszczono na szarym końcu korytarza zamiast przy wejściu!'
  },
  {
    id: 'z3-corridor',
    num: 3,
    category: 'Weryfikacja',
    name: 'Główny ciąg pieszy (Szerokość 1,8m)',
    shortName: 'Główny ciąg pieszy (1,8m)',
    isHazard: false,
    top: '38%',
    left: '26%',
    width: '38%',
    height: '22%',
    desc: 'STREFA PRAWIDŁOWA: Ciąg pieszy spełnia wymagane normy szerokości (> 1,4m) i nie zawiera żadnych przeszkód.'
  },
  {
    id: 'z4-extinguisher',
    num: 4,
    category: 'Weryfikacja',
    name: 'Punkt Gaśniczy PPOŻ i Apteczka',
    shortName: 'Punkt gaśniczy i apteczka',
    isHazard: false,
    top: '10%',
    left: '8%',
    width: '26%',
    height: '26%',
    desc: 'STREFA PRAWIDŁOWA: Gaśnica proszkowa 6kg z ważnym atestem i oznakowaniem fotoluminescencyjnym.'
  },
  {
    id: 'z5-control-desk',
    num: 5,
    category: 'Weryfikacja',
    name: 'Stanowisko Mistrza Gry',
    shortName: 'Stanowisko Mistrza Gry',
    isHazard: false,
    top: '62%',
    left: '8%',
    width: '26%',
    height: '30%',
    desc: 'STREFA PRAWIDŁOWA: Ergonomiczne stanowisko pracy z bezpośrednim podglądem na wyjścia i monitoring.'
  }
];

export default function PuzzleRoom4Layout({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [foundHazards, setFoundHazards] = useState(
    isAlreadySolved ? ['z1-exit', 'z2-fast-rotation'] : []
  );
  const [inspectedSafe, setInspectedSafe] = useState([]);
  const [solved, setSolved] = useState(isAlreadySolved);
  const [feedback, setFeedback] = useState(null);

  const handleZoneClick = (zone) => {
    if (solved) {
      setFeedback({
        isError: false,
        isSuccess: true,
        title: zone.name,
        text: zone.desc
      });
      return;
    }

    if (zone.isHazard) {
      if (!foundHazards.includes(zone.id)) {
        const next = [...foundHazards, zone.id];
        setFoundHazards(next);

        if (next.length === 2) {
          playSuccess();
          setSolved(true);
          setFeedback({
            isError: false,
            isSuccess: true,
            title: 'Wykryto 2. błąd! Audyt zakończony pełnym sukcesem!',
            text: zone.desc
          });
          onSolve('0', 2); // Award digit '0' at index 2
        } else {
          playClick();
          setFeedback({
            isError: false,
            isSuccess: false,
            title: `Wykryto 1. błąd (${zone.category})!`,
            text: `${zone.desc} Wskaż jeszcze drugie zagrożenie!`
          });
        }
      } else {
        playClick();
        setFeedback({
          isError: false,
          isSuccess: false,
          title: 'Strefa już zaznaczona w audycie',
          text: `Ten błąd został już wprowadzony: ${zone.desc}`
        });
      }
    } else {
      playError();
      if (!inspectedSafe.includes(zone.id)) {
        setInspectedSafe((prev) => [...prev, zone.id]);
      }
      setFeedback({
        isError: true,
        isSuccess: false,
        title: `${zone.name} – Strefa Zgodna z Normą`,
        text: zone.desc
      });
    }
  };

  const hasExitHazard = foundHazards.includes('z1-exit');
  const hasRotationHazard = foundHazards.includes('z2-fast-rotation');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window blueprint-modal-window" style={{ maxWidth: 780 }} onClick={(e) => e.stopPropagation()}>
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
          <p style={{ color: '#e2e8f0', fontSize: 14, margin: '0 0 6px' }}>
            Przeanalizuj poniższy rzut techniczny (blueprint). Dotknij strefy bezpośrednio na planie 
            lub wybierz ją z listy poniżej, aby wskazać <strong>2 krytyczne błędy</strong> (uchybienie BHP oraz błąd alokacji logistycznej).
          </p>

          {/* Progress Tracker Slots */}
          <div className="blueprint-tracker-slots">
            <div className={`tracker-slot ${hasExitHazard ? 'is-complete' : ''}`}>
              <div className="tracker-slot-icon">
                {hasExitHazard ? (
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                ) : (
                  <AlertTriangle size={16} color="var(--accent-amber)" />
                )}
              </div>
              <div className="tracker-slot-content">
                <div className="tracker-slot-label">1. Uchybienie BHP (Wyjście Ewakuacyjne)</div>
                <div className="tracker-slot-status">
                  {hasExitHazard ? 'Zidentyfikowano (Zastawione drzwi EXIT)' : 'Oczekuje na wskazanie...'}
                </div>
              </div>
            </div>

            <div className={`tracker-slot ${hasRotationHazard ? 'is-complete' : ''}`}>
              <div className="tracker-slot-icon">
                {hasRotationHazard ? (
                  <CheckCircle2 size={16} color="var(--accent-green)" />
                ) : (
                  <AlertTriangle size={16} color="var(--accent-amber)" />
                )}
              </div>
              <div className="tracker-slot-content">
                <div className="tracker-slot-label">2. Błąd Logistyczny (Rotacja ABC)</div>
                <div className="tracker-slot-status">
                  {hasRotationHazard ? 'Zidentyfikowano (Grupa A na końcu sali)' : 'Oczekuje na wskazanie...'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Blueprint Canvas Map */}
          <div className="blueprint-container">
            {BLUEPRINT_ZONES.map((zone) => {
              const isFound = foundHazards.includes(zone.id);
              const isSafeInspected = inspectedSafe.includes(zone.id);

              return (
                <div
                  key={zone.id}
                  className={`blueprint-zone ${
                    isFound 
                      ? 'is-found' 
                      : isSafeInspected 
                        ? 'is-inspected-safe' 
                        : 'is-uninspected'
                  }`}
                  style={{
                    top: zone.top,
                    left: zone.left,
                    width: zone.width,
                    height: zone.height
                  }}
                  onClick={() => handleZoneClick(zone)}
                  role="button"
                  tabIndex={0}
                  title={zone.name}
                >
                  <div className="blueprint-zone-inner">
                    <div className="blueprint-zone-badge">
                      {isFound ? (
                        <span className="zone-tag hazard-tag">
                          <ShieldAlert size={12} /> BŁĄD
                        </span>
                      ) : isSafeInspected ? (
                        <span className="zone-tag safe-tag">
                          <Check size={12} /> ZGODNE
                        </span>
                      ) : (
                        <span className="zone-tag uninspected-tag">
                          <Square size={11} /> #{zone.num}
                        </span>
                      )}
                    </div>
                    <span className="blueprint-zone-title">{zone.shortName}</span>
                    {!isFound && !isSafeInspected && (
                      <span className="blueprint-zone-prompt">Kliknij by zbadać</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div 
              className={`blueprint-feedback-banner ${
                feedback.isSuccess 
                  ? 'feedback-success' 
                  : feedback.isError 
                    ? 'feedback-error' 
                    : 'feedback-warning'
              }`}
            >
              <div className="feedback-banner-icon">
                {feedback.isSuccess ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : feedback.isError ? (
                  <AlertTriangle size={20} color="#f59e0b" />
                ) : (
                  <ShieldAlert size={20} color="#ef4444" />
                )}
              </div>
              <div className="feedback-banner-body">
                <div className="feedback-banner-title">{feedback.title}</div>
                <div className="feedback-banner-text">{feedback.text}</div>
              </div>
            </div>
          )}

          {/* Mobile & Touch-Friendly Verification Card List */}
          <div className="blueprint-list-section">
            <div className="blueprint-list-header">
              <Search size={15} color="var(--accent-cyan)" />
              <span>Strefy do weryfikacji audytu (dotknij wybraną pozycję):</span>
            </div>

            <div className="blueprint-cards-grid">
              {BLUEPRINT_ZONES.map((zone) => {
                const isFound = foundHazards.includes(zone.id);
                const isSafeInspected = inspectedSafe.includes(zone.id);

                return (
                  <button
                    key={zone.id}
                    type="button"
                    className={`blueprint-card-btn ${
                      isFound 
                        ? 'card-hazard' 
                        : isSafeInspected 
                          ? 'card-safe' 
                          : 'card-uninspected'
                    }`}
                    onClick={() => handleZoneClick(zone)}
                  >
                    <div className="blueprint-card-status-col">
                      {isFound ? (
                        <div className="status-indicator hazard">
                          <ShieldAlert size={20} />
                        </div>
                      ) : isSafeInspected ? (
                        <div className="status-indicator safe">
                          <CheckCircle2 size={20} />
                        </div>
                      ) : (
                        <div className="status-indicator pending">
                          <Square size={20} />
                        </div>
                      )}
                    </div>

                    <div className="blueprint-card-text-col">
                      <div className="blueprint-card-title">
                        <span className="card-num-pill">#{zone.num}</span>
                        <span>{zone.name}</span>
                      </div>
                      <div className="blueprint-card-sub">
                        {isFound ? (
                          <span className="text-hazard">WYKRYTO BŁĄD ({zone.category})</span>
                        ) : isSafeInspected ? (
                          <span className="text-safe">Zweryfikowano: Spełnia normy bezpieczeństwa</span>
                        ) : (
                          <span className="text-pending">Niezbadana strefa • Dotknij, aby zweryfikować</span>
                        )}
                      </div>
                    </div>

                    <div className="blueprint-card-action-col">
                      {isFound ? (
                        <span className="action-pill action-hazard">Zaznaczono</span>
                      ) : isSafeInspected ? (
                        <span className="action-pill action-safe">Zgodne</span>
                      ) : (
                        <span className="action-pill action-check">Zbadaj</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {solved && (
            <div className="puzzle-success-banner">
              <div className="digit-reward-badge">0</div>
              <div>
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Audyt BHP i Layoutu Zakończony Sukcesem!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Wykryto zastawione wyjście ewakuacyjne oraz rażący błąd alokacji zapasów rotacji ABC. Zdobyto 3. cyfrę do sejfu: <strong>0</strong> (kod: <strong>2 0 0 _</strong>).
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
