import React, { useState } from 'react';
import { X, ArrowUp, ArrowDown, Check, AlertCircle, Award, GripVertical } from 'lucide-react';
import { playClick, playSuccess, playError } from '../../audio/soundEngine';

const INITIAL_ITEMS = [
  { id: 'A', letter: 'A', text: 'Montaż sprzętu i okablowania w salach' },
  { id: 'C', letter: 'C', text: 'Określenie potrzeb logistycznych i specyfikacja techniczna' },
  { id: 'D', letter: 'D', text: 'Rozmieszczenie rekwizytów i finalne testy w pokojach' },
  { id: 'B', letter: 'B', text: 'Odbiór dostawy z magazynu centralnego i weryfikacja ilościowa' }
];

const CORRECT_ORDER = ['C', 'B', 'A', 'D'];

export default function PuzzleRoom1Sequence({ 
  onClose, 
  onSolve, 
  isAlreadySolved = false 
}) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [solved, setSolved] = useState(isAlreadySolved);
  const [errorMsg, setErrorMsg] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const moveItem = (fromIdx, toIdx) => {
    playClick();
    const updated = [...items];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setItems(updated);
    setErrorMsg('');
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      moveItem(sourceIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const verifyOrder = () => {
    const currentOrder = items.map((i) => i.letter);
    const isCorrect = currentOrder.every((val, idx) => val === CORRECT_ORDER[idx]);

    if (isCorrect) {
      playSuccess();
      setSolved(true);
      setErrorMsg('');
      onSolve('2', 0); // Award digit '2' at index 0
    } else {
      playError();
      // Informative hint
      if (currentOrder[0] !== 'C') {
        setErrorMsg('Błąd: Każdy projekt musi zacząć się od precyzyjnego określenia potrzeb logistycznych (C)!');
      } else if (currentOrder[1] !== 'B') {
        setErrorMsg('Błąd: Zanim zamontujesz sprzęt, musisz go najpierw odebrać i sprawdzić zgodność (B)!');
      } else {
        setErrorMsg('Błąd: Montaż instalacji (A) musi poprzedzać ostateczne rozmieszczenie rekwizytów (D)!');
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-title-text">Biuro Planowania: Harmonogram Fazy Krytycznej</span>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#e2e8f0', fontSize: 14 }}>
            Ułóż 4 etapy procesu logistycznego w poprawnej kolejności chronologicznej. 
            Możesz przeciągać kafelki lub używać przycisków strzałek (góra / dół).
          </p>

          {/* Sequence List */}
          <div className="sequence-list">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`sequence-item ${draggedIndex === index ? 'dragging' : ''}`}
                draggable={!solved}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="sequence-content">
                  <GripVertical size={18} style={{ color: 'var(--text-dim)', cursor: 'grab' }} />
                  <div className="sequence-badge">#{index + 1}</div>
                  <div className="sequence-label">
                    <strong>{item.letter}.</strong> {item.text}
                  </div>
                </div>

                {!solved && (
                  <div className="sequence-controls">
                    <button
                      className="seq-ctrl-btn"
                      disabled={index === 0}
                      onClick={() => moveItem(index, index - 1)}
                      title="Przesuń w górę"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      className="seq-ctrl-btn"
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(index, index + 1)}
                      title="Przesuń w dół"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Solved state and Educational Callout */}
          {solved ? (
            <div className="puzzle-success-banner">
              <div className="digit-reward-badge">2</div>
              <div>
                <h4 style={{ color: '#10b981', margin: 0, fontSize: 16 }}>Harmonogram Pomyślnie Zatwierdzony!</h4>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: '4px 0 0' }}>
                  Zdobyto 1. cyfrę do sejfu dyrektora: <strong>2</strong> (kod: <strong>2 _ _ _</strong>).
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn-primary" onClick={verifyOrder}>
                <Check size={16} />
                <span>Zatwierdź harmonogram</span>
              </button>
            </div>
          )}

          {/* Educational Note */}
          <div className="edu-callout">
            <Award size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div className="edu-callout-title">Wiedza Logistyczna: Ścieżka Krytyczna (CPM)</div>
              <div className="edu-callout-text">
                W logistyce projektowej <strong>ścieżka krytyczna</strong> określa ciąg zadań, których opóźnienie 
                bezpośrednio przesuwa termin oddania całej inwestycji. Zawsze najpierw identyfikuje się zapotrzebowanie (C), 
                odbiera materiał weryfikując WZ (B), montuje bazę techniczną (A) i dopiero dekoruje sale (D).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
