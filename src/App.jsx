import React, { useState, useEffect, useRef } from 'react';
import HUD from './components/HUD';
import RoomScene from './components/RoomScene';
import OrientationAlert from './components/OrientationAlert';
import DocumentModal from './components/modals/DocumentModal';
import PuzzleRoom1Sequence from './components/modals/PuzzleRoom1Sequence';
import PuzzleRoom2Chest from './components/modals/PuzzleRoom2Chest';
import PuzzleRoom3Risk from './components/modals/PuzzleRoom3Risk';
import PuzzleRoom4Layout from './components/modals/PuzzleRoom4Layout';
import PuzzleRoom5Budget from './components/modals/PuzzleRoom5Budget';
import PuzzleRoom6Quality from './components/modals/PuzzleRoom6Quality';
import SafeKeypad from './components/modals/SafeKeypad';
import IntroModal from './components/modals/IntroModal';
import VictoryScreen from './components/modals/VictoryScreen';
import HelpModal from './components/modals/HelpModal';
import LogisticsHandbookModal from './components/modals/LogisticsHandbookModal';
import EasterEggModal from './components/modals/EasterEggModal';

import { ROOMS_DATA, INITIAL_TIME_SECONDS } from './data/roomsData';

export default function App() {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(INITIAL_TIME_SECONDS);
  const [collectedDigits, setCollectedDigits] = useState([null, null, null, null]);
  const [solvedRooms, setSolvedRooms] = useState([]);
  const [completedHotspots, setCompletedHotspots] = useState([]);
  const [activeModal, setActiveModal] = useState({ type: 'intro' });

  const timerRef = useRef(null);

  // 20-minute countdown timer
  useEffect(() => {
    if (gameStarted && !isCompleted && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, isCompleted, timerSeconds]);

  // Handle Game Start
  const handleStartGame = () => {
    setGameStarted(true);
    setActiveModal(null);
  };

  // Handle Hotspot Click
  const handleHotspotClick = (hotspot) => {
    if (hotspot.type === 'info') {
      setActiveModal({
        type: 'info',
        hotspotId: hotspot.id,
        title: hotspot.title || hotspot.label,
        content: hotspot.content
      });
    } else if (hotspot.type === 'puzzle') {
      setActiveModal({
        type: 'puzzle',
        puzzleId: hotspot.puzzleId,
        hotspotId: hotspot.id
      });
    } else if (hotspot.type === 'safe') {
      if (isCompleted) {
        setActiveModal({ type: 'victory' });
      } else {
        setActiveModal({
          type: 'safe',
          hotspotId: hotspot.id
        });
      }
    } else if (hotspot.type === 'easter-egg') {
      setActiveModal({
        type: 'easter-egg',
        hotspotId: hotspot.id
      });
    }
  };

  // Mark an info document as inspected
  const handleMarkHotspotDone = (hotspotId) => {
    if (hotspotId && !completedHotspots.includes(hotspotId)) {
      setCompletedHotspots((prev) => [...prev, hotspotId]);
    }
  };

  // Handle Solving a Puzzle
  const handleSolvePuzzle = (awardedDigit, digitIndex, roomId, hotspotId) => {
    if (awardedDigit !== null && awardedDigit !== undefined && digitIndex !== null && digitIndex !== undefined) {
      setCollectedDigits((prev) => {
        const next = [...prev];
        next[digitIndex] = awardedDigit;
        return next;
      });
    }

    if (roomId && !solvedRooms.includes(roomId)) {
      setSolvedRooms((prev) => [...prev, roomId]);
    }

    if (hotspotId && !completedHotspots.includes(hotspotId)) {
      setCompletedHotspots((prev) => [...prev, hotspotId]);
    }
  };

  // Handle Unlocking the Final Safe
  const handleSafeUnlockSuccess = () => {
    setIsCompleted(true);
    setActiveModal({ type: 'victory' });
  };

  // Advance to next room
  const handleAdvanceToNextRoom = () => {
    if (currentRoomIndex < ROOMS_DATA.length - 1) {
      setCurrentRoomIndex((prev) => prev + 1);
    }
  };

  // Restart Game
  const handleRestart = () => {
    setCurrentRoomIndex(0);
    setGameStarted(false);
    setIsCompleted(false);
    setTimerSeconds(INITIAL_TIME_SECONDS);
    setCollectedDigits([null, null, null, null]);
    setSolvedRooms([]);
    setCompletedHotspots([]);
    setActiveModal({ type: 'intro' });
  };

  const currentRoom = ROOMS_DATA[currentRoomIndex] || ROOMS_DATA[0];
  const isCurrentRoomSolved = solvedRooms.includes(currentRoom.id);
  const nextRoom = ROOMS_DATA[currentRoomIndex + 1];

  return (
    <div className="app-container">
      {/* Mobile Orientation Alert */}
      <OrientationAlert />

      {/* Main Top Navigation & Status HUD */}
      <HUD
        currentRoomIndex={currentRoomIndex}
        onSelectRoom={(idx) => setCurrentRoomIndex(idx)}
        rooms={ROOMS_DATA}
        solvedRooms={solvedRooms}
        collectedDigits={collectedDigits}
        timerSeconds={timerSeconds}
        isCompleted={isCompleted}
        onOpenVictory={() => setActiveModal({ type: 'victory' })}
        onOpenHelp={() => setActiveModal({ type: 'help' })}
      />

      {/* 16:9 Living Room Scene Container */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <RoomScene
          room={currentRoom}
          completedHotspots={completedHotspots}
          onHotspotClick={handleHotspotClick}
          isSolved={isCurrentRoomSolved}
          onNextRoom={nextRoom ? handleAdvanceToNextRoom : null}
          nextRoomName={nextRoom ? (nextRoom.isFinalRoom ? 'Sejf Dyrektora' : nextRoom.name) : null}
          onOpenHandbook={(chapter) => setActiveModal({ type: 'handbook', chapter: chapter || (currentRoomIndex + 1) })}
        />
      </main>

      {/* Active Modals */}
      {activeModal?.type === 'intro' && (
        <IntroModal onStartGame={handleStartGame} />
      )}

      {activeModal?.type === 'help' && (
        <HelpModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal?.type === 'handbook' && (
        <LogisticsHandbookModal
          initialChapter={activeModal.chapter || 1}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.type === 'victory' && (
        <VictoryScreen 
          timerSeconds={timerSeconds} 
          onRestart={handleRestart} 
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.type === 'info' && (
        <DocumentModal
          title={activeModal.title}
          content={activeModal.content}
          isRead={completedHotspots.includes(activeModal.hotspotId)}
          onMarkRead={() => handleMarkHotspotDone(activeModal.hotspotId)}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal?.type === 'safe' && (
        <SafeKeypad
          collectedDigits={collectedDigits}
          onClose={() => setActiveModal(null)}
          onUnlockSuccess={handleSafeUnlockSuccess}
        />
      )}

      {activeModal?.type === 'easter-egg' && (
        <EasterEggModal onClose={() => setActiveModal(null)} />
      )}

      {/* Room Puzzles */}
      {activeModal?.type === 'puzzle' && activeModal.puzzleId === 'puzzle-1' && (
        <PuzzleRoom1Sequence
          isAlreadySolved={solvedRooms.includes('room-1')}
          onClose={() => setActiveModal(null)}
          onSolve={(digit, idx) => handleSolvePuzzle(digit, idx, 'room-1', activeModal.hotspotId)}
        />
      )}

      {activeModal?.type === 'puzzle' && activeModal.puzzleId === 'puzzle-2' && (
        <PuzzleRoom2Chest
          isAlreadySolved={solvedRooms.includes('room-2')}
          onClose={() => setActiveModal(null)}
          onSolve={(digit, idx) => handleSolvePuzzle(digit, idx, 'room-2', activeModal.hotspotId)}
        />
      )}

      {activeModal?.type === 'puzzle' && activeModal.puzzleId === 'puzzle-3' && (
        <PuzzleRoom3Risk
          isAlreadySolved={solvedRooms.includes('room-3')}
          onClose={() => setActiveModal(null)}
          onSolve={(digit, idx) => handleSolvePuzzle(digit, idx, 'room-3', activeModal.hotspotId)}
        />
      )}

      {activeModal?.type === 'puzzle' && activeModal.puzzleId === 'puzzle-4' && (
        <PuzzleRoom4Layout
          isAlreadySolved={solvedRooms.includes('room-4')}
          onClose={() => setActiveModal(null)}
          onSolve={(digit, idx) => handleSolvePuzzle(digit, idx, 'room-4', activeModal.hotspotId)}
        />
      )}

      {activeModal?.type === 'puzzle' && activeModal.puzzleId === 'puzzle-5' && (
        <PuzzleRoom5Budget
          isAlreadySolved={solvedRooms.includes('room-5')}
          onClose={() => setActiveModal(null)}
          onSolve={(digit, idx) => handleSolvePuzzle(digit, idx, 'room-5', activeModal.hotspotId)}
        />
      )}

      {activeModal?.type === 'puzzle' && activeModal.puzzleId === 'puzzle-6' && (
        <PuzzleRoom6Quality
          isAlreadySolved={solvedRooms.includes('room-6')}
          onClose={() => setActiveModal(null)}
          onSolve={(digit, idx) => handleSolvePuzzle(digit, idx, 'room-6', activeModal.hotspotId)}
        />
      )}
    </div>
  );
}
