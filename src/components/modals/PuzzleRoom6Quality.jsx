import React, { useState } from 'react';
import { X, ClipboardCheck, Check, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

export default function PuzzleRoom6Quality({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [solved, setSolved] = useState(isAlreadySolved);
  const [errorMsg, setErrorMsg] = useState('');

  const handleDecision = (sign) => {
    if (solved) return;
    playClick();

    if (sign) {
      playError();
      setErrorMsg('Błąd krytyczny! Podpisanie protokołu z zacinającym się laserem skutkuje przerwaniem gry w trakcie uroczystego otwarcia i kompromitacją firmy!');
    } else {
      playSuccess();
      setSolved(true);
      setErrorMsg('');
      onSolve('7', 3); // Award digit '7' at index 3
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <ClipboardCheck size={18} color="var(--accent-cyan)" />
            <span className="modal-title-text">Centrum Kontroli: Protokół Odbioru Końcowego (QA)</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Quality Checklist Sheet */}
          <div className="qa-checklist-sheet">
            <h4 style={{ margin: '0 0 8px', textTransform: 'uppercase', fontSize: 15, letterSpacing: 0.5 }}>
              Protokół Kontroli Jakości i Dopuszczenia Obiektu
            </h4>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
              Inspekcja przedstartowa • 14 października 2007 • Stanowisko QC-1
            </div>

            <table className="qa-table">
              <thead>
                <tr>
                  <th>Węzeł Techniczny</th>
                  <th>Procedura Kontrolna</th>
                  <th>Wynik Testu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Zasilanie Główne & UPS</td>
                  <td>Symulacja odcięcia zasilania 230V</td>
                  <td className="qa-status-pass">POZYTYWNY (Zgodny)</td>
                </tr>
                <tr>
                  <td>Wentylacja & PPOŻ</td>
                  <td>Próba aerozolowa czujek dymu</td>
                  <td className="qa-status-pass">POZYTYWNY (Zgodny)</td>
                </tr>
                <tr>
                  <td><strong>Mechanizm Zagadki Laserowej</strong></td>
                  <td>10-krotny cykl rozbrajania fotokomórki</td>
                  <td className="qa-status-fail">ZACINA SIĘ W CYKLU #4 I #7!</td>
                </tr>
                <tr>
                  <td>Rygle Elektromagnetyczne</td>
                  <td>Test siły docisku i trybu fail-safe</td>
                  <td className="qa-status-pass">POZYTYWNY (Zgodny)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
            Do wejścia pierwszych graczy zostało kilkanaście minut. 
            Czy jako Koordynator Logistyki podpisujesz bezwarunkowy protokół odbioru końcowego?
          </p>

          {!solved && (
            <div className="qa-buttons-choice">
              <button className="qa-btn qa-btn-sign" onClick={() => handleDecision(true)}>
                TAK - Podpisz odbiór (Ryzykuj start)
              </button>
              <button className="qa-btn qa-btn-reject" onClick={() => handleDecision(false)}>
                NIE - Wstrzymaj odbiór (Wymuś naprawę)
              </button>
            </div>
          )}

          {errorMsg && (
            <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {solved && (
            <div className="puzzle-success-banner">
              <div className="digit-reward-badge">7</div>
              <div>
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Prawidłowa Odpowiedzialność Jakościowa!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Wstrzymano odbiór - usterka została naprawiona przed wejściem gości. 
                  Zdobyto 4. cyfrę do sejfu: <strong>7</strong> (pełny kod: <strong>2 0 0 7</strong>)!
                </p>
              </div>
            </div>
          )}

          <div className="edu-callout">
            <Award size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="edu-callout-title">Wiedza Logistyczna: Kontrola Jakości (Quality Assurance)</div>
              <div className="edu-callout-text">
                Odbiór jakościowy to ostateczna bramka kontrolna (Quality Gate). 
                Logistyk nigdy nie dopuszcza do eksploatacji sprzętu wykazującego anomalie w testach. 
                Koszt usunięcia wady przed otwarciem jest znikomy w porównaniu z kosztami wizerunkowymi i prawnymi awarii w trakcie użytkowania.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
