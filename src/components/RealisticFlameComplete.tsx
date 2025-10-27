import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import type { BonfireLevel, CovenantType } from '../types';
// Import the Lottie animation data
import flameAnimationData from '../assets/flame-animation.json';

// The props interface remains the same to avoid breaking other components
interface RealisticFlameProps {
  level: BonfireLevel;
  covenant?: CovenantType;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'hold-empty';
}

/**
 * This component is now a wrapper for the Lottie animation.
 * It renders the provided JSON file and controls its playback speed
 * based on the breathing phase.
 * * The 'level' prop is no longer used to change the flame's appearance,
 * as the Lottie file provides a single, consistent visual.
 */
const RealisticFlame: React.FC<RealisticFlameProps> = ({
  isBreathing = false,
  breathPhase = 'hold'
}) => {
  const [animationSpeed, setAnimationSpeed] = useState(1.0);

  // This effect runs when the breathing state changes
  useEffect(() => {
    // If not in an active breathing session, play at normal speed
    if (!isBreathing) {
      setAnimationSpeed(1.0);
      return;
    }

    // Adjust speed based on the breathing phase
    switch (breathPhase) {
      case 'inhale':
        setAnimationSpeed(1.5); // Speed up for inhale
        break;
      case 'exhale':
        setAnimationSpeed(0.7); // Slow down for exhale
        break;
      case 'hold':
      case 'hold-empty':
      default:
        setAnimationSpeed(1.0); // Normal speed for holds
        break;
    }
  }, [isBreathing, breathPhase]);

  return (
    <div className="flex items-center justify-center" style={{ width: 400, height: 500 }}>
      <Lottie
        animationData={flameAnimationData}
        loop={true}
        autoplay={true}
        speed={animationSpeed}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default RealisticFlame;
