import React, { useState } from 'react';
import { X, ShoppingCart, Check, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

const BUDGET_ITEMS = [
  {
    id: 'locks',
    name: 'Elektrozamki awaryjne z funkcją fail-safe',
    cost: 180,
    isCritical: true,
    category: 'Mechanika i Bezpieczeństwo',
    desc: 'Wymóg odblokowania drzwi w przypadku zaniku zasilania.'
  },
  {
    id: 'light',
    name: 'Oprawy oświetlenia awaryjnego z akumulatorem buforowym',
    cost: 120,
    isCritical: true,
    category: 'BHP i PPOŻ',
    desc: 'Zapewnia widoczność drogi ucieczki przez min. 2 godziny.'
  },
  {
    id: 'cables',
    name: 'Okablowanie bezhalogenowe atestowane (3x1.5mm)',
    cost: 90,
    isCritical: true,
    category: 'Instalacja PPOŻ',
    desc: 'Odporne na ogień, nie emituje toksycznych gazów.'
  },
  {
    id: 'posters',
    name: 'Zestaw plakatów retro i szyldów neonowych',
    cost: 160,
    isCritical: false,
    category: 'Dekoracje i Estetyka',
    desc: 'Dodatkowe ozdoby klimatyczne. Brak wpływu na bezpieczeństwo.'
  }
];

const BUDGET_LIMIT = 500;

export default function PuzzleRoom5Budget({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [selectedIds, setSelectedIds] = useState(
    isAlreadySolved ? ['locks', 'light', 'cables'] : []
  );
  const [solved, setSolved] = useState(isAlreadySolved);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleItem = (id) => {
    if (solved) return;
    playClick();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setErrorMsg('');
  };

  const currentTotal = selectedIds.reduce((sum, id) => {
    const item = BUDGET_ITEMS.find((b) => b.id === id);
    return sum + (item ? item.cost : 0);
  }, 0);

  const isOverBudget = currentTotal > BUDGET_LIMIT;

  const handleValidate = () => {
    if (isOverBudget) {
      playError();
      setErrorMsg(`Przekroczono limit budżetowy o ${currentTotal - BUDGET_LIMIT} PLN! Odrzuć wydatki nieistotne.`);
      return;
    }

    const hasLocks = selectedIds.includes('locks');
    const hasLight = selectedIds.includes('light');
    const hasCables = selectedIds.includes('cables');
    const hasPosters = selectedIds.includes('posters');

    if (!hasLocks || !hasLight || !hasCables) {
      playError();
      setErrorMsg('Błąd priorytetyzacji: Odrzucono pozycję o kluczowym znaczeniu dla bezpieczeństwa ludzi!');
      return;
    }

    if (hasPosters) {
      playError();
      setErrorMsg('Budżet nie pomieści ozdób retro. Rezygnacja z estetyki to konieczny kompromis logistyczny!');
      return;
    }

    // Success! Total = 390 PLN
    playSuccess();
    setSolved(true);
    setErrorMsg('');
    onSolve(null, null); // Budget authorized
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <ShoppingCart size={18} color="var(--accent-cyan)" />
            <span className="modal-title-text">Dział Zakupów: Alokacja Sztywnego Budżetu 500 PLN</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#e2e8f0', fontSize: 14 }}>
            Twój limit na pilne zakupy interwencyjne to <strong>500,00 PLN</strong>. 
            Zaznacz pozycje krytyczne dla bezpiecznego rozruchu obiektu, mieszcząc się w wyznaczonym limicie.
          </p>

          {/* Budget Meter */}
          <div className="budget-meter">
            <div className="budget-val-group">
              <span className="budget-val-title">Suma wybranych pozycji</span>
              <span className={`budget-val-number ${isOverBudget ? 'over-budget' : ''}`}>
                {currentTotal.toFixed(2)} PLN
              </span>
            </div>
            <div className="budget-val-group" style={{ textAlign: 'right' }}>
              <span className="budget-val-title">Maksymalny limit budżetu</span>
              <span className="budget-val-number" style={{ color: 'var(--accent-amber)' }}>
                {BUDGET_LIMIT.toFixed(2)} PLN
              </span>
            </div>
          </div>

          {/* Selection List */}
          <div className="items-selection-list">
            {BUDGET_ITEMS.map((item) => {
              const isChecked = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`budget-item-row ${isChecked ? 'is-checked' : ''}`}
                  onClick={() => toggleItem(item.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="budget-item-checkbox">
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#ffffff', fontSize: 14 }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {item.category} • {item.desc}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--accent-cyan)' }}>
                    +{item.cost} PLN
                  </div>
                </div>
              );
            })}
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
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Koszyk Zakupowy Zaakceptowany!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Wydano 390 PLN z 500 PLN. Zabezpieczono wszystkie krytyczne instalacje BHP bez przekroczenia budżetu.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-primary" onClick={handleValidate}>
                <Check size={16} />
                <span>Zatwierdź bilans zakupów</span>
              </button>
            </div>
          )}

          <div className="edu-callout">
            <Award size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="edu-callout-title">Wiedza Logistyczna: Priorytetyzacja Wydatków (CAPEX/OPEX)</div>
              <div className="edu-callout-text">
                W logistyce zaopatrzenia priorytet mają zawsze komponenty o charakterze 
                <strong>compliance (zgodność z prawem i bezpieczeństwo)</strong>. Elementy dekoracyjne i estetyczne 
                muszą ustąpić miejsca atestowanemu sprzętowi podtrzymującemu ciągłość działania obiektu.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
