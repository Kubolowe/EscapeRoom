import React, { useState } from 'react';
import { X, Phone, Check, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

const DECISIONS = [
  {
    id: 1,
    title: 'Czekać biernie na ciężarówkę na DK1',
    desc: 'Brak jakichkolwiek działań. Zespół montażowy stoi bezczynnie przez 40 minut, tracąc okno czasowe przed przybyciem komisji.',
    warning: 'Niedopuszczalne! Pasywne oczekiwanie gwarantuje zerwanie terminu odbioru i paraliż całego projektu.'
  },
  {
    id: 2,
    title: 'Uruchomić zapas buforowy (Buffer Stock) i zamówić brakujące złączki u lokalnego dostawcy',
    desc: 'Wykorzystanie żelaznego zapasu bezpieczeństwa z magazynu podręcznego oraz błyskawiczny zakup drobnych akcesoriów w lokalnej hurtowni 3 km dalej.',
    isCorrect: true
  },
  {
    id: 3,
    title: 'Zamówić cały transport od nowa ekspresowym kurierem VIP za potrójną stawkę',
    desc: 'Przepalenie całego budżetu interwencyjnego na kuriera, który i tak nie dowiezie paczki w 10 minut.',
    warning: 'Błąd logistyczny! Zamówienie ekspresowe przekroczy budżet i fizycznie nie dotrze w wymaganym czasie (Lead Time > 10 min).'
  }
];

export default function PuzzleRoom3Risk({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [selectedId, setSelectedId] = useState(isAlreadySolved ? 2 : null);
  const [solved, setSolved] = useState(isAlreadySolved);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelect = (id) => {
    if (solved) return;
    playClick();
    setSelectedId(id);
    setErrorMsg('');
  };

  const handleConfirm = () => {
    if (!selectedId) {
      setErrorMsg('Wybierz wariant reakcji na opóźnienie w łańcuchu dostaw.');
      return;
    }

    if (selectedId === 2) {
      playSuccess();
      setSolved(true);
      setErrorMsg('');
      onSolve(null, null); // Room 3 solves logistics crisis
    } else {
      playError();
      const choice = DECISIONS.find((d) => d.id === selectedId);
      setErrorMsg(choice?.warning || 'Nieefektywna decyzja logistyczna!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Phone size={18} color="var(--accent-cyan)" />
            <span className="modal-title-text">Strefa Dostaw: Telefon Nokia 3310 & Kryzys Transportowy</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="nokia-container">
            <div className="nokia-phone">
              <div className="nokia-brand">NOKIA</div>
              <div className="nokia-screen">
                <div className="nokia-screen-header">
                  <span>1 NOWA WIADOMOŚĆ</span>
                  <span>18:04</span>
                </div>
                <div className="nokia-sms-text">
                  OD: KIEROWCA TRANS-LOG<br />
                  „Ciężarówka do Trójmiasta utknęła w zatorze na dojeździe do Gdańska przed węzłem Rusocin! Blokada pasów, opóźnienie min. 45 min. Co robić?”
                </div>
              </div>
              <div className="nokia-keypad-mock">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
                  <div key={k} className="nokia-key-mock" />
                ))}
              </div>
            </div>
          </div>

          <p style={{ color: '#e2e8f0', fontSize: 14 }}>
            Montaż instalacji rozpoczyna się za 10 minut. Wybierz profesjonalną strategię zarządzania ryzykiem:
          </p>

          <div className="decision-options">
            {DECISIONS.map((dec) => (
              <div
                key={dec.id}
                className={`decision-btn ${selectedId === dec.id ? 'correct-choice' : ''}`}
                onClick={() => handleSelect(dec.id)}
                role="button"
                tabIndex={0}
              >
                <div className="decision-btn-num">{dec.id}</div>
                <div>
                  <div className="decision-text"><strong>{dec.title}</strong></div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 3 }}>{dec.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {solved ? (
            <div className="puzzle-success-banner">
              <CheckCircle2 size={36} color="var(--accent-green)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Łańcuch Dostaw Uratowany!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Zapas buforowy natychmiast wszedł do akcji. Harmonogram montażu został utrzymany bez ani minuty przestoju!
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-primary" onClick={handleConfirm}>
                <Check size={16} />
                <span>Wdrożenie planu awaryjnego</span>
              </button>
            </div>
          )}

          <div className="edu-callout">
            <Award size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="edu-callout-title">Wiedza Logistyczna: Bufor Bezpieczeństwa (Safety Stock)</div>
              <div className="edu-callout-text">
                Współczesna logistyka zakłada nieuchronność zakłóceń losowych (korki, awarie pojazdów). 
                Kluczem do odporności łańcucha dostaw (Resilience) jest utrzymywanie racjonalnego 
                <strong>zapasu bezpieczeństwa (buffer stock)</strong> oraz dywersyfikacja źródeł zaopatrzenia u dostawców lokalnych.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
