import React, { useState, useEffect, useCallback } from 'react';
import type { BreathingRite, Session, CovenantType } from '../types';
import { RealisticFlame } from './RealisticFlameComplete.tsx';
import { AudioNarrator } from './AudioNarrator';
import { DynamicBackground } from './DynamicBackground';
import { v4 as uuidv4 } from 'uuid';

interface BreathingSessionProps {
  rite: BreathingRite;
  covenant?: CovenantType;
  onComplete: (session: Session) => void;
  onCancel: () => void;
  preRitualNote?: string;
}

export const BreathingSession: React.FC<BreathingSessionProps> = ({
  rite,
  covenant,
  onComplete,
  onCancel,
  preRitualNote,
}) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const currentPhase = rite.phases[currentPhaseIndex];
  const totalCycles = rite.cycles || Infinity;

  const handleComplete = useCallback(() => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const session: Session = {
      id: uuidv4(),
      date: new Date(),
      rite: rite.id,
      duration,
      cycles: cycleCount,
      preRitualNote,
      covenant: covenant,
    };
    onComplete(session);
  }, [startTime, rite.id, cycleCount, preRitualNote, covenant, onComplete]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setPhaseProgress((prev) => {
        const next = prev + 0.1;
        if (next >= currentPhase.duration) {
          // Move to next phase
          const nextPhaseIndex = (currentPhaseIndex + 1) % rite.phases.length;
          setCurrentPhaseIndex(nextPhaseIndex);
          
          // If we completed a full cycle
          if (nextPhaseIndex === 0) {
            setCycleCount((c: number) => c + 1); // <-- Fixed implicit 'any' type
          }
          
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentPhaseIndex, currentPhase.duration, rite.phases.length, isPaused]);

  // Auto-complete for Dragon's Roar after set cycles
  useEffect(() => {
    if (rite.id === 'dragons-roar' && cycleCount >= totalCycles) {
      handleComplete();
    }
  }, [cycleCount, totalCycles, rite.id, handleComplete]);

  const progress = (phaseProgress / currentPhase.duration) * 100;
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Dynamic Background */}
      <DynamicBackground breathPhase={currentPhase.type} />
      
      {/* Background gradient based on covenant */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        covenant === 'respite' ? 'from-blue-900/20 to-transparent' :
        covenant === 'focus' ? 'from-slate-900/20 to-transparent' :
        covenant === 'vigor' ? 'from-yellow-900/20 to-transparent' :
        'from-transparent to-transparent'
      }`} />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-ember-400 mb-2 text-shadow-lg">
            {rite.name}
          </h2>
          <p className="text-ash-300 text-lg">{rite.description}</p>
        </div>

        {/* Realistic Flame */}
        <div className="mb-8">
          <RealisticFlame 
            level="steady-flame" 
            covenant={covenant}
            isBreathing={true}
            breathPhase={currentPhase.type}
          />
        </div>

        {/* Current Phase */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-ember-300 mb-4 text-shadow-lg">
            {currentPhase.instruction}
          </div>
          <div className="text-3xl text-ash-400 mb-2">
            {Math.ceil(currentPhase.duration - phaseProgress)}s
          </div>
          
          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto h-2 bg-ash-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-ember-600 to-bonfire-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8 text-ash-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-ember-400">{cycleCount}</div>
            <div className="text-sm">Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-ember-400">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm">Time</div>
          </div>
          {rite.cycles && (
            <div className="text-center">
              <div className="text-2xl font-bold text-ember-400">
                {Math.floor((cycleCount / totalCycles) * 100)}%
              </div>
              <div className="text-sm">Complete</div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-3 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="px-6 py-3 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            {audioEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>
          <button
            onClick={handleComplete}
            className="px-6 py-3 bg-ember-600 hover:bg-ember-500 text-ash-900 font-bold rounded-lg transition-colors"
          >
            Complete Rite
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-red-900/50 hover:bg-red-900/70 text-ash-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
        
        {/* Audio Narrator */}
        {!isPaused && <AudioNarrator phase={currentPhase} enabled={audioEnabled} />}
      </div>
    </div>
  );
};
