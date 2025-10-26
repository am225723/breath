import React from 'react';
import type { CovenantType } from '../types';
import { COVENANTS } from '../data/covenants';

interface CovenantSelectionProps {
  onSelect: (covenant: CovenantType) => void;
}

export const CovenantSelection: React.FC<CovenantSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-ember-400 mb-4 text-shadow-lg">
            Swear Your Oath
          </h1>
          <p className="text-xl text-ash-300">
            Choose a Covenant to guide your journey through the Path of Embers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(COVENANTS).map((covenant) => (
            <button
              key={covenant.id}
              onClick={() => onSelect(covenant.id)}
              className="group relative p-6 bg-ash-800 hover:bg-ash-700 rounded-lg border-2 border-ash-700 hover:border-ember-600 transition-all duration-300 text-left"
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{ backgroundColor: covenant.glowColor }}
              />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-ember-400 mb-2">
                  {covenant.name}
                </h3>
                <div className="text-sm text-ash-400 italic mb-4">
                  {covenant.title}
                </div>
                <p className="text-ash-300 mb-4">
                  {covenant.description}
                </p>
                <div className="border-t border-ash-700 pt-4">
                  <div className="text-sm text-ash-400 mb-2">Goal:</div>
                  <div className="text-ember-300 font-semibold">
                    {covenant.goal}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-ash-500 text-sm">
            Your choice will theme your journey, but you can practice any breathing rite
          </p>
        </div>
      </div>
    </div>
  );
};