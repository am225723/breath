import React, { useEffect } from 'react';
import type { BreathingPhase } from '../types';

interface AudioNarratorProps {
  phase: BreathingPhase;
  enabled: boolean;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({ phase, enabled }) => {
  useEffect(() => {
    if (!enabled || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    const newUtterance = new SpeechSynthesisUtterance(phase.instruction);
    
    // Configure voice settings for a deeper, more atmospheric tone
    newUtterance.rate = 0.8;
    newUtterance.pitch = 0.7;
    newUtterance.volume = 0.8;

    // Try to find a deeper voice
    const voices = synth.getVoices();
    const deepVoice = voices.find(voice => 
      voice.name.includes('Male') || 
      voice.name.includes('Deep') ||
      voice.lang.startsWith('en')
    );
    if (deepVoice) {
      newUtterance.voice = deepVoice;
    }

    synth.speak(newUtterance);

    return () => {
      synth.cancel();
    };
  }, [phase, enabled]);

  return null;
};