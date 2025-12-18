/**
 * Audio utilities for biometric feedback
 */

// Create a simple beep sound using Web Audio API
export const playSuccessBeep = async (): Promise<void> => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure beep sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz
    oscillator.type = 'sine';

    // Quick envelope for beep
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    // Clean up after sound
    setTimeout(() => {
      audioContext.close();
    }, 300);
  } catch (error) {
    console.log('Audio not supported or failed:', error);
    // Silently fail if audio is not available
  }
};

// Alternative: Use a simple audio element with data URL
const createBeepDataURL = (): string => {
  // Create a simple beep sound as WAV data URL
  // This is a minimal 800Hz beep for 200ms
  const sampleRate = 44100;
  const duration = 0.2;
  const frequency = 800;
  const samples = sampleRate * duration;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);

  // Generate sine wave samples
  for (let i = 0; i < samples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.1;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  return 'data:audio/wav;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(buffer) as any));
};

export const playSuccessBeepSimple = (): void => {
  try {
    const audio = new Audio(createBeepDataURL());
    audio.volume = 0.3; // Not too loud
    audio.play().catch(() => {
      // Silently fail if audio is blocked
    });
  } catch (error) {
    console.log('Simple audio beep failed:', error);
  }
};