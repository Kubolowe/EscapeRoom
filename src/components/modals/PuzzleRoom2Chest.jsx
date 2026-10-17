import React, { useState } from 'react';
import { X, Box, Check, AlertCircle, Award, ShieldCheck, GlassWater } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

const CHESTS = [
  {
    id: 'A',
    name: 'Skrzynia A (Kable i osprzęt)',
    symbol: '⚡ Osprzęt 12V / Kable',
    desc: 'Twarde ścianki ze sklejki, brak wyściółki wewnętrznej. Luźno wrzucone ciężkie zasilacze i zwoje przewodów miedzianych.',
    warning: 'Brak amortyzacji. Luźne kable i zasilacze natychmiast zmiażdżyłyby delikatne soczewki optyczne!'
  },
  {
    id: 'B',
    name: 'Skrzynia B (Sensory optyczne & Szkło)',
    symbol: '🍸 Delikatne (ISO 780)',
    desc: 'Specjalistyczna skrzynia amortyzowana wielowarstwową pianką poliuretanową o zamkniętych komórkach. Oznaczona piktogramem kieliszka (Ładunek kruchy).',
    isCorrect: true
  },
  {
    id: 'C',
    name: 'Skrzynia C (Narzędzia montażowe)',
    symbol: '🔨 Narzędzia stalowe',
    desc: 'Ciężka, nitowana skrzynia z blachy stalowej. Wewnątrz młoty, klucze francuskie, szlifierka kątowa i wiertarka udarowa.',
    warning: 'Stalowe narzędzia podczas transportu natychmiast roztrzaskałyby precyzyjną optykę!'
  }
];

export default function PuzzleRoom2Chest({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [selectedId, setSelectedId] = useState(isAlreadySolved ? 'B' : null);
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
      setErrorMsg('Wybierz jedną ze skrzyń magazynowych, aby dokonać alokacji.');
      return;
    }

    if (selectedId === 'B') {
      playSuccess();
      setSolved(true);
      setErrorMsg('');
      onSolve('0', 1); // Award digit '0' at index 1
    } else {
      playError();
      const chest = CHESTS.find((c) => c.id === selectedId);
      setErrorMsg(chest?.warning || 'Błędny wybór strefy składowania!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-title-text">Magazyn Podręczny: Ochrona Ładunku Wrażliwego</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#e2e8f0', fontSize: 14 }}>
            Do magazynu trafił zestaw precyzyjnych modułów optycznych i sensorów podczerwieni do laserowych zagadek escape roomu. 
            Wybierz właściwy pojemnik transportowy, który gwarantuje integralność i bezpieczne magazynowanie.
          </p>

          <div className="chests-grid">
            {CHESTS.map((chest) => (
              <div
                key={chest.id}
                className={`chest-card ${selectedId === chest.id ? 'selected' : ''}`}
                onClick={() => handleSelect(chest.id)}
                role="button"
                tabIndex={0}
              >
                <div className="chest-icon-box">
                  <Box size={28} />
                </div>
                <div className="chest-name">{chest.name}</div>
                <div style={{ color: 'var(--accent-amber)', fontSize: 11, fontWeight: 700 }}>
                  {chest.symbol}
                </div>
                <div className="chest-desc">{chest.desc}</div>
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
              <div className="digit-reward-badge">0</div>
              <div>
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Ładunek Prawidłowo Zabezpieczony!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Zdobyto 2. cyfrę do sejfu dyrektora: <strong>0</strong> (kod: <strong>2 0 _ _</strong>).
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-primary" onClick={handleConfirm}>
                <Check size={16} />
                <span>Zatwierdź wybór skrzyni</span>
              </button>
            </div>
          )}

          <div className="edu-callout">
            <Award size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="edu-callout-title">Wiedza Logistyczna: Kodowanie i Strefowanie Towarów</div>
              <div className="edu-callout-text">
                W standardach gospodarki magazynowej towary wrażliwe (kruche, podatne na wstrząsy) wymagają opakowań ze znakiem 
                manipulacyjnym <strong>ISO 780 (kieliszek)</strong> oraz miękkiego wkładu tłumiącego drgania. 
                Nigdy nie łączy się ładunków ciężkich i twardych z precyzyjną optyką w jednej jednostce ładunkowej.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
