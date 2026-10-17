import React from 'react';
import HotspotCircle from './HotspotCircle';
import DustMotes from './DustMotes';
import CRTOverlay from './CRTOverlay';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { playClick } from '../audio/soundEngine';

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
            title="Przeczytaj co logistyk musi zrobić na tym etapie"
          >
            <BookOpen size={14} color="var(--accent-amber)" />
            <span>Co logistyk musi tu zrobić? (Wytyczne)</span>
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
          {room.hotspots.map((h) => {
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
