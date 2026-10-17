import React from 'react';
import { Play, ShieldAlert, Clock, KeyRound, Sparkles } from 'lucide-react';
import { playClick, playSuccess } from '../../audio/soundEngine';

export default function IntroModal({ onStartGame }) {
  const handleStart = () => {
    playSuccess();
    onStartGame();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-window" style={{ maxWidth: 660 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-title-text">PILNY KOMUNIKAT OPERACYJNY</span>
          </div>
        </div>

        <div className="modal-body">
          {/* Retro Fax Briefing */}
          <div className="paper-document">
            <div className="paper-stamp">PILNE / START</div>
            <div style={{ fontSize: 13, color: '#b45309', fontWeight: 700, marginBottom: 8 }}>
              FAKS PRZYCHODZĄCY • NADAWCA: DYREKCJA GENERALNA ESCAPE ROOM POLSKA
            </div>
            <h3 className="paper-heading">Data nadania: 14 października 2007 r., godz. 18:00</h3>
            <div className="paper-text">
              {`DO WIADOMOŚCI: GŁÓWNY KOORDYNATOR LOGISTYKI I BEZPIECZEŃSTWA

Mamy krytyczną sytuację! Za dokładnie 20 minut nastąpi uroczyste otwarcie pierwszego w Trójmieście (Gdańsk / Gdynia / Sopot) komercyjnego obiektu Escape Room. Na miejscu pojawią się dziennikarze oraz przedstawiciele Wojewódzkiego Inspektoratu Nadzoru Budowlanego i Straży Pożarnej.

W obiekcie panuje całkowity chaos operacyjny:
• W Biurze Planowania nie zamknięto harmonogramu ścieżki krytycznej.
• W Magazynie nie zabezpieczono wrażliwych sensorów optycznych.
• Ciężarówka z dostawą do Trójmiasta utknęła w zatorze przed węzłem Rusocin.
• Na rzutach architektonicznych wykryto niebezpieczne naruszenia BHP.
• Budżet interwencyjny 500 PLN wisi na włosku.
• W Centrum Kontroli pojawiły się usterki w testach odbiorczych.

Twoim zadaniem jest opanowanie 6 węzłów logistycznych, rozwiązanie problemów i zebranie 4-cyfrowego kodu do pancernego sejfu dyrektora (kod: _ _ _ _). 

W sejfie zdeponowano oficjalną Pieczęć i Licencję na otwarcie obiektu. Czas ucieka!`}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            margin: '4px 0'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: 10,
              textAlign: 'center'
            }}>
              <Clock size={20} color="var(--accent-cyan)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LIMIT CZASU</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>20:00 minut</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: 10,
              textAlign: 'center'
            }}>
              <ShieldAlert size={20} color="var(--accent-amber)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>OBSZAR BADAŃ</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>6 Węzłów BHP & Logistyki</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: 10,
              textAlign: 'center'
            }}>
              <KeyRound size={20} color="var(--accent-green)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CEL MISJI</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>Otwarcie Sejfu Dyrektora</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <button 
              className="btn-primary" 
              style={{ fontSize: 16, padding: '14px 32px' }}
              onClick={handleStart}
            >
              <Play size={18} fill="#ffffff" />
              <span>ROZPOCZNIJ MISJĘ LOGISTYCZNĄ (START 20:00)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
