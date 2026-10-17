import React from 'react';
import HotspotCircle from './HotspotCircle';
import DustMotes from './DustMotes';
import CRTOverlay from './CRTOverlay';
import { 
  BookOpen, 
  ArrowRight, 
  CheckCircle2,
  Calendar,
  Package,
  Truck,
  LayoutGrid,
  Calculator,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { playClick } from '../audio/soundEngine';

const ROOM_THEMES = {
  1: { short: '1. Planowanie', Icon: Calendar },
  2: { short: '2. Magazyn', Icon: Package },
  3: { short: '3. Dostawy', Icon: Truck },
  4: { short: '4. Projekt', Icon: LayoutGrid },
  5: { short: '5. Budżet', Icon: Calculator },
  6: { short: '6. Kontrola', Icon: ShieldCheck },
  7: { short: '7. Sejf', Icon: KeyRound },
};

export default function RoomScene({
  room,
  completedHotspots,
  onHotspotClick,
  isSolved = false,
  onNextRoom,
  nextRoomName,
  onOpenHandbook
}) {
  const atmosphere = room.atmosphere || 'default';
  const currentTheme = ROOM_THEMES[room.number] || { short: `Pokój ${room.number || 1}`, Icon: BookOpen };
  const RoomThemeIcon = currentTheme.Icon;

  return (
    <div className="stage-wrapper">
      <div className="stage-16-9">
        {/* Living Room Background */}
        <div 
          className="room-scene-canvas"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${room.bgImage ? room.bgImage.replace(/^\//, '') : ''})` }}
        />

        {/* Room Specific Atmospheric Animations */}
        {/* Room 1: Biuro Planowania (Excel cursor & lamp glow) */}
        {atmosphere === 'crt-excel' && (
          <>
            <div className="atmosphere-cursor" aria-hidden="true" />
            <div className="lamp-glow-overlay lamp-glow-room1" aria-hidden="true" />
          </>
        )}

        {/* Room 2 & 3: Warehouse & Delivery (Swinging cable shadow) */}
        {(atmosphere === 'warehouse-shadow' || atmosphere === 'delivery-flicker') && (
          <div className="warehouse-cable-shadow" aria-hidden="true" />
        )}

        {/* Room 4: Sala Projektowa (Venetian blinds light beam) */}
        {atmosphere === 'blinds-light' && (
          <div className="blinds-light-beam" aria-hidden="true" />
        )}

        {/* Room 5: Dział Kosztów i Zakupów (Banker lamp glow) */}
        {atmosphere === 'desk-lamp' && (
          <div className="lamp-glow-overlay lamp-glow-room5" aria-hidden="true" />
        )}

        {/* Room 6: Centrum Kontroli (CCTV static screen & blinking LEDs) */}
        {atmosphere === 'cctv-static' && (
          <>
            <div className="cctv-static-box" aria-hidden="true" />
            <div className="cctv-led cctv-led-red" aria-hidden="true" />
            <div className="cctv-led cctv-led-green" aria-hidden="true" />
          </>
        )}

        {/* Final: Gabinet Dyrektora (Sunbeam on safe & keypad display) */}
        {atmosphere === 'safe-glow' && (
          <>
            <div className="safe-beam-light" aria-hidden="true" />
            <div className="safe-led-display-blink" aria-hidden="true">
              SEC-07
            </div>
          </>
        )}

        {/* Floating dust motes in light beams */}
        <DustMotes count={32} />

        {/* CRT Scanline and subtle flicker */}
        <CRTOverlay enabled={true} />

        {/* Methodological Guidance floating pill inside the scene */}
        {!room.isFinalRoom && (
          <button
            className="room-handbook-pill"
            onClick={() => {
              playClick();
              if (onOpenHandbook) onOpenHandbook(room.number);
            }}
            title={`Przeczytaj wytyczne: Co logistyk musi tu zrobić? (${currentTheme.short})`}
          >
            <RoomThemeIcon size={14} color="#38bdf8" />
            <span className="room-handbook-room-tag">{currentTheme.short}:</span>
            <span>Co logistyk musi tu zrobić?</span>
          </button>
        )}

        {/* Interactive Hotspots on the 16:9 canvas */}
        {room.hotspots.map((hotspot) => {
          const isDone = completedHotspots.includes(hotspot.id);

          return (
            <HotspotCircle
              key={hotspot.id}
              x={hotspot.x}
              y={hotspot.y}
              label={hotspot.label}
              icon={hotspot.icon}
              isCompleted={isDone}
              isSecret={Boolean(hotspot.isSecret || hotspot.type === 'easter-egg')}
              onClick={() => onHotspotClick(hotspot)}
            />
          );
        })}

        {/* Next Room floating banner when puzzle is solved */}
        {isSolved && onNextRoom && (
          <div className="room-solved-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={18} color="var(--accent-green)" />
              <span className="room-solved-text">Etap zaliczony!</span>
            </div>
            <button 
              className="btn-next-room"
              onClick={() => {
                playClick();
                onNextRoom();
              }}
            >
              <span>Przejdź do: {nextRoomName}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile-Friendly Quick Hotspots Action Bar */}
      <div className="room-mobile-quickbar">
        <div className="mobile-quickbar-title">Dotknij obiektu do zbadania:</div>
        <div className="mobile-quickbar-items">
          {room.hotspots
            .filter((h) => !h.isSecret && h.type !== 'easter-egg')
            .map((h) => {
              const isDone = completedHotspots.includes(h.id);
              return (
                <button
                  key={h.id}
                  className={`mobile-quick-btn ${isDone ? 'is-done' : ''}`}
                  onClick={() => onHotspotClick(h)}
                >
                  <span>{h.label.split('(')[0]}</span>
                  {isDone && <CheckCircle2 size={13} color="var(--accent-green)" />}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
