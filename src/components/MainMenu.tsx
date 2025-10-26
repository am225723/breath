import React from 'react';
// FIX: Import the full 'Covenant' object type, not just 'CovenantType'
import type { BreathingRite, CovenantType, Session, Covenant } from '../types'; 
import { BREATHING_RITES } from '../data/breathingRites';
import { COVENANTS } from '../data/covenants';
import { RealisticFlame } from './RealisticFlameComplete.tsx';

interface MainMenuProps {
  onStartSession: (rite: BreathingRite, covenant?: CovenantType) => void;
  onShowJournal: () => void;
  onShowMap: () => void;
  lastSession?: Session;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartSession,
  onShowJournal,
  onShowMap,
  lastSession,
}) => {
  const defaultRite = Object.values(BREATHING_RITES)[0];
  
  // FIX: Change the parameter 'c' to be of type 'Covenant'
  const lastCovenant = lastSession 
    ? Object.values(COVENANTS).find((c: Covenant) => c.id === lastSession.covenant) 
    : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-ash-300">
      
      {/* Background gradient based on last covenant */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        lastCovenant?.id === 'respite' ? 'from-blue-900/20 to-transparent' :
        lastCovenant?.id === 'focus' ? 'from-slate-900/20 to-transparent' :
        lastCovenant?.id === 'vigor' ? 'from-yellow-900/20 to-transparent' :
        'from-transparent to-transparent'
      }`} />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Flame */}
        <div className="mb-8">
          <RealisticFlame 
            level="steady-flame"
            covenant={lastCovenant?.id}
            isBreathing={false}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-ember-400 mb-4 text-shadow-lg">
            Path of Embers
          </h1>
          <p className="text-xl text-ash-400">
            {lastSession 
              ? `Welcome back, traveler. Your last rite was ${lastSession.rite}.`
              : 'A traveler arrives. Kindle the flame and begin your journey.'
            }
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col sm-flex-row gap-6 mb-12">
          <button
            onClick={() => onStartSession(defaultRite, lastCovenant?.id)}
            className="px-10 py-5 bg-ember-600 hover:bg-ember-500 text-ash-900 text-2xl font-bold rounded-lg transition-colors text-shadow-sm shadow-lg"
          >
            Begin Rite
          </button>
          <button
            onClick={onShowJournal}
            className="px-8 py-4 bg-ash-700 hover:bg-ash-600 text-ash-100 text-xl rounded-lg transition-colors shadow-md"
          >
            Chronicler's Journal
          </button>
          <button
            onClick={onShowMap}
            className="px-8 py-4 bg-ash-700 hover:bg-ash-600 text-ash-100 text-xl rounded-lg transition-colors shadow-md"
          >
            Traveler's Map
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-ash-500">
          <p>Select a breathing rite to begin, or review your past journeys.</p>
        </div>
      </div>
    </div>
  );
};
