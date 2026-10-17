import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { playClick } from '../../audio/soundEngine';

const CHAPTERS = [
  {
    id: 1,
    title: '1. Planowanie i Harmonogramowanie (Biuro Planowania)',
    role: 'Koordynator Harmonogramu i Ścieżki Krytycznej',
    whatMustDo: [
      'Zdefiniować sekwencję nadrzędną zadań projektowych: najpierw identyfikacja zapotrzebowania technicznego (C), następnie weryfikacja i odbiór dostawy (B), potem montaż bazy instalacyjnej (A) i na końcu rozmieszczenie rekwizytów (D).',
      'Wyznaczyć Ścieżkę Krytyczną (metoda CPM — Critical Path Method), czyli ciąg zadań o zerowym marginesie czasowym, których opóźnienie bezpośrednio przekłada się na termin otwarcia obiektu.',
      'Zidentyfikować i wyeliminować potencjalne wąskie gardła (bottlenecks) przed rozpoczęciem prac montażowych.'
    ],
    documents: 'Arkusz Harmonogramu GANTT / CPM, Zlecenie Projektowe, Specyfikacja Wymagań Technicznych.',
    criticalError: 'Rozpoczęcie montażu instalacji bez wcześniejszego odbioru i kontroli ilościowej dostarczonych materiałów (grozi przestojem ekipy technicznej i kosztami kar umownych).',
    goldenRule: 'Logistyk nigdy nie pozwala ekipie montażowej wejść na obiekt bez fizycznie zweryfikowanych komponentów na stanie.'
  },
  {
    id: 2,
    title: '2. Ewidencja i Magazynowanie (Magazyn Podręczny)',
    role: 'Kierownik Magazynu i Zabezpieczenia Ładunków',
    whatMustDo: [
      'Przeprowadzić segregację asortymentową: bezwzględnie oddzielić ciężkie narzędzia stalowe od czułej aparatury optoelektronicznej (lasery, pryzmaty, fotokomórki).',
      'Wymusić stosowanie międzynarodowych znaków manipulacyjnych wg normy ISO 780 (symbol kieliszka — ładunek kruchy / delikatny).',
      'Dobrać opakowanie z profilowaną pianką poliuretanową o zamkniętych komórkach, tłumiącą drgania i wstrząsy transportowe.',
      'Zgodnie z BHP ładunki o masie powyżej 25 kg (narzędzia, wiertarki) składować wyłącznie na najniższych kondygnacjach paletowych, eliminując ryzyko upadku z wysokości i urazów kręgosłupa.'
    ],
    documents: 'Karty Magazynowe (PZ — Przyjęcie Zewnętrzne, WZ — Wydanie Zewnętrzne), Oznaczenia Manipulacyjne ISO 780.',
    criticalError: 'Złożenie sensorów optycznych do metalowej skrzyni narzędziowej z młotami i kluczami (nieodwracalne uszkodzenie soczewek i strata tysięcy złotych).',
    goldenRule: 'Bezpieczeństwo ładunku zaczyna się od właściwego opakowania i rygorystycznego strefowania magazynu.'
  },
  {
    id: 3,
    title: '3. Transport i Reakcja na Ryzyko (Strefa Dostaw — Trójmiasto)',
    role: 'Dyspozytor Transportu i Zarządca Ciągłości Łańcucha Dostaw',
    whatMustDo: [
      'Wdrożyć procedurę zarządzania zakłóceniami transportowymi (Supply Chain Disruption Plan).',
      'Utrzymywać żelazny Bufor Bezpieczeństwa (Safety / Buffer Stock) w magazynie podręcznym, chroniący projekt przed opóźnieniami na trasie DK1 / autostradzie A1 przed Trójmiastem.',
      'W razie karambolu lub korka natychmiast uruchomić zapas buforowy i złożyć interwencyjne zamówienie na brakujący drobny osprzęt u lokalnego dostawcy w Trójmieście (Gdańsk / Gdynia).',
      'Weryfikować listy przewozowe CMR i dokumenty WZ pod kątem zgodności z deklarowanym czasem dostawy (Lead Time).'
    ],
    documents: 'Międzynarodowy List Przewozowy (CMR), Awizacja Transportu, Protokół Szkody Transportowej.',
    criticalError: 'Pasywne czekanie 40 minut na zakorkowaną ciężarówkę lub paniczne zamawianie transportu lotniczego, które doprowadza do bankructwa budżetu.',
    goldenRule: 'Odporny łańcuch dostaw (Resilient Supply Chain) zawsze posiada alternatywę lokalną i zapas buforowy.'
  },
  {
    id: 4,
    title: '4. Layout Przestrzeni i Drogi Ewakuacyjne (Sala Projektowa)',
    role: 'Audytor Layoutu Logistycznego i Koordynator BHP/PPOŻ',
    whatMustDo: [
      'Zaprojektować ciągi komunikacyjne o parametrach zgodnych z rozporządzeniem MSWiA: minimalna szerokość ciągów ewakuacyjnych nie może być mniejsza niż 1,4 m.',
      'Zastosować regułę rotacji ABC: towary i wyposażenie o najwyższej rotacji (grupa A — 80% pobrań) muszą znajdować się najbliżej wejścia/strefy wydań, minimalizując czas i drogę transportu wewnętrznego.',
      'Bezwzględnie dopilnować, aby drzwi ewakuacyjne EXIT otwierały się na zewnątrz i pod żadnym pozorem nie były zastawiane paletami, pudłami ani blokowane łańcuchami.'
    ],
    documents: 'Instrukcja Bezpieczeństwa Pożarowego (IBP), Rzut Architektoniczny Ciągów Komunikacyjnych, Analiza Rotacji ABC.',
    criticalError: 'Zastawienie drzwi pożarowych pudłami buforowymi w celu "zaoszczędzenia miejsca" (stwarza bezpośrednie zagrożenie utraty życia ludzkiego w przypadku zadymienia).',
    goldenRule: 'Przepisy BHP i drogi ewakuacyjne są nienaruszalne. Żaden cel logistyczny nie usprawiedliwia blokowania wyjść ewakuacyjnych.'
  },
  {
    id: 5,
    title: '5. Budżetowanie i Priorytetyzacja (Dział Kosztów i Zakupów)',
    role: 'Specjalista ds. Zakupów Logistycznych i Kontrolingu CAPEX',
    whatMustDo: [
      'Dokonać bezwzględnej hierarchizacji zakupów: Compliance & Życie > Funkcjonalność mechaniczna > Estetyka i dekoracje.',
      'W warunkach twardego limitu 500 PLN zaalokować środki na pozycje krytyczne: elektrozamki fail-safe (180 PLN), oświetlenie awaryjne z akumulatorem (120 PLN) oraz niepalne okablowanie atestowane (90 PLN) = 390 PLN.',
      'Świadomie odrzucić wydatki dekoracyjne (plakaty retro 160 PLN), gdyż doprowadziłyby do przekroczenia budżetu (550 PLN) i braku środków na instalacje ratujące życie.'
    ],
    documents: 'Arkusz Zapotrzebowania Materiałowego (BOM — Bill of Materials), Zestawienie Ofert Dostawców, Bilans Kosztów CAPEX/OPEX.',
    criticalError: 'Uleganie presji estetycznej i zakup dekoracji kosztem atestowanego sprzętu przeciwpożarowego lub oświetlenia awaryjnego.',
    goldenRule: 'Prawdziwy logistyk potrafi powiedzieć „NIE” wydatkom luksusowym, gdy stawką jest bezpieczeństwo użytkowników.'
  },
  {
    id: 6,
    title: '6. Kontrola Jakości i Odbiór Końcowy (Centrum Kontroli)',
    role: 'Kierownik Odbioru Jakościowego (Quality Assurance / Quality Gate)',
    whatMustDo: [
      'Przeprowadzić pełne testy funkcjonalno-obciążeniowe wszystkich systemów przed dopuszczeniem obiektu do eksploatacji.',
      'Działać jako niezależna bramka jakościowa (Quality Gate): zweryfikować zasilanie awaryjne, wentylację oraz mechanikę zagadek.',
      'W przypadku wykrycia zacinania mechanizmu (sensor laserowy przerywa w cyklu #4 i #7) BEZWZGLĘDNIE WSTRZYMAĆ ODBIÓR TECHNICZNY (opcja NIE) i wymusić natychmiastową naprawę przed wpuszczeniem gości.'
    ],
    documents: 'Protokół Odbioru Końcowego (POK), Raport Niezgodności Jakościowej (NCR — Non-Conformance Report), Checklista Testów Obciążeniowych.',
    criticalError: 'Podpisanie protokołu odbioru ze świadomością usterki lasera ("może jakoś zadziała"), co prowadzi do kompromitacji podczas uroczystego otwarcia przed komisją.',
    goldenRule: 'Logistyka kończy się dopiero wtedy, gdy sprawdzony i bezpieczny produkt działa bezawaryjnie w rękach klienta.'
  }
];

export default function LogisticsHandbookModal({ 
  onClose, 
  initialChapter = 1 
}) {
  const [selectedChapterId, setSelectedChapterId] = useState(initialChapter);

  const currentChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" style={{ maxWidth: 880, maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <BookOpen size={20} color="var(--accent-amber)" />
            <div>
              <div className="modal-title-text">Księga Standardów i Obowiązków Logistyka</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Vademecum Merytoryczne • Procedury Logistyczne i BHP (Escape Room Trójmiasto 2007)
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => { playClick(); onClose(); }}>
            <X size={16} />
          </button>
        </div>

        {/* Body Layout: Sidebar Chapters + Chapter Detail */}
        <div className="modal-body" style={{ padding: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          {/* Chapters Sidebar */}
          <div style={{
            width: '35%',
            minWidth: 230,
            background: 'rgba(0, 0, 0, 0.35)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            overflowY: 'auto',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, padding: '4px 8px' }}>
              Spis Węzłów Logistycznych
            </div>

            {CHAPTERS.map((ch) => {
              const isSelected = ch.id === selectedChapterId;
              return (
                <button
                  key={ch.id}
                  onClick={() => { playClick(); setSelectedChapterId(ch.id); }}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: 6,
                    padding: '8px 12px',
                    textAlign: 'left',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    lineHeight: 1.3,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{ch.title.split('(')[0]}</span>
                  {isSelected && <ChevronRight size={14} color="var(--accent-cyan)" />}
                </button>
              );
            })}
          </div>

          {/* Chapter Content Details */}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Title & Role */}
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: 10 }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--accent-amber)', fontWeight: 700 }}>
                {currentChapter.title}
              </div>
              <h2 style={{ fontSize: 18, color: '#ffffff', margin: '4px 0 2px' }}>
                Rola: {currentChapter.role}
              </h2>
            </div>

            {/* What Logistician MUST do */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              borderLeft: '4px solid var(--accent-green)',
              borderRadius: '0 8px 8px 0',
              padding: '12px 16px'
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle size={16} />
                <span>CO LOGISTYK MUSI ZROBIĆ NA TYM ETAPIE:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentChapter.whatMustDo.map((item, idx) => (
                  <li key={idx} style={{ lineHeight: 1.45 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Critical Mistake */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              borderLeft: '4px solid var(--accent-red)',
              borderRadius: '0 8px 8px 0',
              padding: '12px 16px'
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={16} />
                <span>KRYTYCZNY BŁĄD LOGISTYCZNY I JEGO SKUTKI:</span>
              </div>
              <div style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.4 }}>
                {currentChapter.criticalError}
              </div>
            </div>

            {/* Documents & ISO */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10
            }}>
              <FileText size={18} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  Kluczowa Dokumentacja i Normy:
                </div>
                <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 2 }}>
                  {currentChapter.documents}
                </div>
              </div>
            </div>

            {/* Golden Rule */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <ShieldCheck size={24} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  Złota Zasada Zawodowa Logistyka:
                </div>
                <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 600, marginTop: 2 }}>
                  „{currentChapter.goldenRule}”
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(12, 17, 28, 0.95)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Wytyczne merytoryczne zgodne ze standardami zarządzania logistyką i BHP.
          </span>
          <button className="btn-primary" onClick={() => { playClick(); onClose(); }}>
            Rozumiem, wracam do zadań
          </button>
        </div>
      </div>
    </div>
  );
}
