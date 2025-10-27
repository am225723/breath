import React, { useEffect, useRef } from 'react'; // Removed useState, added useRef
import Lottie, { LottieRefCurrentProps } from 'lottie-react'; // Added LottieRefCurrentProps
import type { BonfireLevel, CovenantType } from '../types';
// Import the Lottie animation data
import flameAnimationData from '../assets/flame-animation.json';

// The props interface remains the same
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
  // Use a ref to control the Lottie animation directly
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // This effect runs when the breathing state changes
  useEffect(() => {
    // Wait until the Lottie animation has loaded and the ref is attached
    if (!lottieRef.current) {
      return;
    }

    // If not in an active breathing session, play at normal speed
    if (!isBreathing) {
      lottieRef.current.setSpeed(1.0);
      return;
    }

    // Adjust speed based on the breathing phase by calling setSpeed()
    switch (breathPhase) {
      case 'inhale':
        lottieRef.current.setSpeed(1.5); // Speed up for inhale
        break;
      case 'exhale':
        lottieRef.current.setSpeed(0.7); // Slow down for exhale
        break;
      case 'hold':
      case 'hold-empty':
      default:
        lottieRef.current.setSpeed(1.0); // Normal speed for holds
        break;
    }
  }, [isBreathing, breathPhase]); // Dependencies remain the same

  return (
    <div className="flex items-center justify-center" style={{ width: 400, height: 500 }}>
      <Lottie
        lottieRef={lottieRef} // Pass the ref here
        animationData={flameAnimationData}
        loop={true}
        autoplay={true}
        // The invalid 'speed' prop is removed
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default RealisticFlame;
