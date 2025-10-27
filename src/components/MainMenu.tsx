import React from 'react';
import type { BreathingPattern, UserProgress } from '../types';
import { BREATHING_RITES } from '../data/breathingRites';
import { COVENANTS } from '../data/covenants';
// FIX: Use default import and add .tsx extension
import RealisticFlame from './RealisticFlameComplete.tsx';

interface MainMenuProps {
  progress: UserProgress;
  onSelectRite: (rite: BreathingPattern) => void;
  onViewProgress: () => void;
  onViewInfo: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  progress, 
  onSelectRite,
  onViewProgress,
  onViewInfo
}) => {
  const covenant = progress.covenant ? COVENANTS[progress.covenant] : null;

  const getBonfireLevelText = () => {
    switch (progress.bonfireLevel) {
      case 'first-flame': return 'First Flame';
      case 'roaring': return 'Roaring';
      case 'steady-flame': return 'Steady Flame';
      default: return 'Smoldering';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Covenant background tint */}
      {covenant && (
        <div className={`absolute inset-0 bg-gradient-to-b ${covenant.uiTint}`} />
      )}

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header with Soul Ember */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-ember-400 mb-4 text-shadow-lg">
            The Path of Embers
          </h1>
          {covenant && (
            <div className="text-xl text-ash-300 mb-2">
              {covenant.name}
            </div>
          )}
        </div>

        {/* Realistic Flame Display */}
        <div className="mb-8">
          <RealisticFlame 
            level={progress.bonfireLevel} 
            covenant={progress.covenant}
          />
        </div>

        {/* Bonfire Status */}
        <div className="text-center mb-8">
          <div className="inline-block bg-ash-800/80 backdrop-blur-sm rounded-lg p-6 border border-ash-700">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-ember-400">
                  {progress.currentStreak}
                </div>
                <div className="text-sm text-ash-400">Day Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-ember-400">
                  {getBonfireLevelText()}
                </div>
                <div className="text-sm text-ash-400">Bonfire Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-ember-400">
                  {progress.totalSessions}
                </div>
                <div className="text-sm text-ash-400">Total Sessions</div>
              </div>
            </div>
            
            {progress.gracePeriodEnd && new Date() < progress.gracePeriodEnd && (
              <div className="mt-4 text-amber-400 text-sm">
                ⚠️ Grace Period Active - Complete a session to restore your flame
              </div>
            )}
          </div>
        </div>

        {/* Breathing Rites Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ember-300 mb-4 text-center">
            Choose Your Rite
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(BREATHING_RITES).map((rite) => {
              const isPreferred = covenant?.preferredRites.includes(rite.id);
              return (
                <button
                  key={rite.id}
                  onClick={() => onSelectRite(rite.id)}
                  className={`group p-6 rounded-lg border-2 transition-all duration-300 text-left ${
                    isPreferred
                      ? 'bg-ash-800 border-ember-600 hover:bg-ash-700'
                      : 'bg-ash-800/50 border-ash-700 hover:bg-ash-800 hover:border-ash-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-ember-400">
                      {rite.name}
                    </h3>
                    {isPreferred && (
                      <span className="text-xs bg-ember-600 text-ash-900 px-2 py-1 rounded">
                        Preferred
                      </span>
                    )}
                  </div>
                  <p className="text-ash-300 text-sm">
                    {rite.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Progress Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onViewProgress}
            className="px-8 py-3 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            📜 Chronicler's Map
          </button>
          <button
            onClick={onViewInfo}
            className="px-8 py-3 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            ℹ️ About
          </button>
        </div>
      </div>
    </div>
  );
};

