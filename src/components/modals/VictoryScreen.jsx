import React, { useRef, useState } from 'react';
import { Award, Printer, RotateCcw, CheckCircle, ShieldCheck, Download, Check, X, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import { LOGISTICS_PILLARS } from '../../data/roomsData';
import { playClick, playSuccess } from '../../audio/soundEngine';

export default function VictoryScreen({ 
  timerSeconds, 
  onRestart,
  onClose
}) {
  const certRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const timeUsed = (20 * 60) - timerSeconds;
  const usedMin = Math.floor(timeUsed / 60);
  const usedSec = timeUsed % 60;

  const leftMin = Math.floor(timerSeconds / 60);
  const leftSec = timerSeconds % 60;

  const handlePrint = () => {
    playClick();
    const prevTitle = document.title;
    // Set document title to blank so browser header does NOT print page title
    document.title = "";

    const restoreTitle = () => {
      document.title = prevTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.print();

    // Fallback if afterprint doesn't trigger
    setTimeout(restoreTitle, 2000);
  };

  const handleDownloadPng = async () => {
    if (!certRef.current || isExporting) return;
    playClick();
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = 'Certyfikat_Logistyka_Grupa_8.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      playSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Błąd podczas eksportu certyfikatu do PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestartGame = () => {
    playClick();
    onRestart();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-window" style={{ maxWidth: 840, maxHeight: '95vh', position: 'relative' }}>
        {/* Header with Close Option */}
        <div className="modal-header" style={{ padding: '10px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-green)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <Award size={18} />
            <span>Obiekt Otwarty • Misja Zakończona Sukcesem</span>
          </div>
          {onClose && (
            <button 
              className="modal-close-btn" 
              onClick={() => { playClick(); onClose(); }}
              title="Zamknij i przejdź do swobodnego przeglądania pokoi"
              aria-label="Zamknij"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="modal-body" style={{ padding: 24 }}>
          {/* Certificate of Logistics Excellence */}
          <div className="certificate-frame" ref={certRef}>
            <div className="cert-seal">
              <ShieldCheck size={28} />
              <span>ATEST 2007</span>
            </div>

            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, color: '#78350f', fontWeight: 700, marginBottom: 4 }}>
              Rzeczpospolita Polska: Departament Bezpieczeństwa i Logistyki
            </div>
            
            <h1 className="cert-title">CERTYFIKAT ZATWIERDZENIA PROJEKTU</h1>
            
            <div className="cert-subtitle">
              Oficjalne świadectwo odbioru technicznego i gotowości operacyjnej obiektu Escape Room
            </div>

            <div style={{
              background: 'rgba(120, 53, 15, 0.08)',
              border: '1px solid rgba(120, 53, 15, 0.2)',
              borderRadius: 6,
              padding: '12px 18px',
              margin: '16px auto',
              maxWidth: 620,
              fontSize: 14,
              color: '#44403c'
            }}>
              Niniejszym zaświadcza się, że <strong>Główny Koordynator Logistyki</strong> rozwiązał 
              wszystkie zakłócenia operacyjne, odblokował sejf dyrektora kodem <strong>2 0 0 7</strong> oraz 
              pomyślnie dopuścił obiekt do inauguracji w dniu <strong>14 października 2007 r.</strong>
              <div style={{ marginTop: 8, fontWeight: 700, color: '#166534' }}>
                {timerSeconds > 0 ? (
                  <>Czas realizacji misji: {usedMin} min {usedSec} s (Pozostały zapas bezpieczeństwa: {leftMin} min {leftSec} s przed wejściem gości!).</>
                ) : (
                  <>Ukończono misję rzutem na taśmę tuż przed wejściem komisji (20:00 minut intensywnej pracy logistycznej)!</>
                )}
              </div>
            </div>

            {/* 6 Logistics Pillars Review */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: '#1c1917',
              margin: '20px 0 10px',
              borderBottom: '2px solid #78350f',
              paddingBottom: 4
            }}>
              Opanowane Filary Wiedzy Logistycznej (Serious Game)
            </h3>

            <div className="pillars-summary-grid">
              {LOGISTICS_PILLARS.map((p) => (
                <div key={p.id} className="pillar-item-card">
                  <div className="pillar-item-title">
                    <CheckCircle size={15} color="#16a34a" />
                    <span>{p.id}. {p.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9a3412', fontWeight: 600 }}>{p.room}</div>
                  <div className="pillar-item-desc">{p.desc}</div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: 20,
              paddingTop: 12,
              borderTop: '1px solid #78350f',
              fontSize: 12,
              color: '#78716c'
            }}>
              <div>
                Rejestr: PL/BHP/LOG/2007/0491
              </div>
              <div style={{ textAlign: 'right' }}>
                Zatwierdzono przez Zespół:<br />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#78350f', fontWeight: 700 }}>
                  Grupa 8
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="modal-actions-print-hide" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginTop: 18
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12
            }}>
              <button 
                className="btn-primary" 
                onClick={handleDownloadPng}
                disabled={isExporting}
                style={{ 
                  background: 'linear-gradient(135deg, #16a34a, #15803d)', 
                  borderColor: '#22c55e',
                  boxShadow: '0 0 15px rgba(22, 163, 74, 0.4)' 
                }}
              >
                {downloadSuccess ? <Check size={18} /> : <Download size={18} />}
                <span>
                  {isExporting ? 'Generowanie PNG...' : downloadSuccess ? 'Pobrano Certyfikat PNG!' : 'Pobierz Certyfikat (Czysty PNG)'}
                </span>
              </button>

              <button className="btn-secondary" onClick={handlePrint}>
                <Printer size={18} />
                <span>Drukuj / Zapisz (PDF)</span>
              </button>

              {onClose && (
                <button 
                  className="btn-secondary" 
                  onClick={() => { playClick(); onClose(); }}
                  style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                  title="Powróć do gry i swobodnie zwiedzaj wszystkie pokoje"
                >
                  <Eye size={18} />
                  <span>Wróć do pokoi</span>
                </button>
              )}

              <button className="btn-secondary" onClick={handleRestartGame}>
                <RotateCcw size={18} />
                <span>Zagraj ponownie</span>
              </button>
            </div>

            <div style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center',
              maxWidth: 600,
              lineHeight: 1.5,
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              💡 <strong>Czysty wydruk:</strong> Użyj zielonego przycisku <em>„Pobierz Certyfikat (Czysty PNG)”</em>, aby pobrać grafikę w wysokiej rozdzielczości bez daty i adresu URL strony! Jeśli drukujesz do PDF, w oknie drukowania odznacz opcję <em>„Nagłówki i stopki”</em>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
