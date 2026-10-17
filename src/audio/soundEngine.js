// Web Audio API Synthesis Engine for Escape Room 2007
// Generates all sound effects dynamically without external MP3 files

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted) {
  isMuted = muted;
}

export function getMuted() {
  return isMuted;
}

export function playClick() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playPaper() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    // White noise burst filtered as paper shuffle
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playKeypadBeep(freq = 950) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playError() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Dual-tone buzzer
    [160, 120].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.16);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playSuccess() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playSafeMechanism() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Heavy ratcheting bolt sequence
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140 + i * 25, now + i * 0.1);
      gain.gain.setValueAtTime(0.25, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.06);
    }

    // Heavy mechanical clunk / unlock thud
    const oscHeavy = ctx.createOscillator();
    const gainHeavy = ctx.createGain();
    oscHeavy.type = 'triangle';
    oscHeavy.frequency.setValueAtTime(85, now + 0.55);
    oscHeavy.frequency.exponentialRampToValueAtTime(35, now + 0.95);

    gainHeavy.gain.setValueAtTime(0.4, now + 0.55);
    gainHeavy.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    oscHeavy.connect(gainHeavy);
    gainHeavy.connect(ctx.destination);

    oscHeavy.start(now + 0.55);
    oscHeavy.stop(now + 0.95);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playFanfare() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Fanfare chords
    const sequence = [
      { notes: [392.00, 523.25], delay: 0.0, dur: 0.15 },       // G4, C5
      { notes: [392.00, 523.25], delay: 0.18, dur: 0.15 },      // G4, C5
      { notes: [392.00, 523.25], delay: 0.36, dur: 0.15 },      // G4, C5
      { notes: [523.25, 659.25, 783.99], delay: 0.54, dur: 0.55 }, // C5, E5, G5
      { notes: [440.00, 587.33, 698.46], delay: 1.15, dur: 0.3 },  // A4, D5, F5
      { notes: [523.25, 659.25, 1046.50], delay: 1.5, dur: 1.2 }  // C5, E5, C6
    ];

    sequence.forEach(({ notes, delay, dur }) => {
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + dur);
      });
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export function playNokiaTone() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Classic Nokia SMS double-beep pattern
    const beeps = [0, 0.1, 0.35, 0.45];
    beeps.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1318.5, now + t);
      gain.gain.setValueAtTime(0.25, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.08);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}
