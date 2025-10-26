import React, { useState } from 'react';

interface JournalPromptProps {
  type: 'pre' | 'post';
  onSubmit: (note: string) => void;
  onSkip: () => void;
}

export const JournalPrompt: React.FC<JournalPromptProps> = ({ 
  type, 
  onSubmit, 
  onSkip 
}) => {
  const [note, setNote] = useState('');

  const prompt = type === 'pre' 
    ? 'What burdens do you bring to the flame?'
    : 'What clarity have you found?';

  const placeholder = type === 'pre'
    ? 'anxiety about work, feeling unfocused, anger...'
    : 'feeling calmer, more centered, ready to continue...';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <div className="bg-ash-800 rounded-lg p-8 max-w-2xl w-full border-2 border-ember-600 shadow-2xl">
        <h2 className="text-3xl font-bold text-ember-400 mb-4 text-center">
          {prompt}
        </h2>
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 bg-ash-900 text-ash-100 rounded-lg p-4 border border-ash-700 focus:border-ember-600 focus:outline-none resize-none mb-6"
          autoFocus
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSubmit(note)}
            className="px-8 py-3 bg-ember-600 hover:bg-ember-500 text-ash-900 font-bold rounded-lg transition-colors"
          >
            {type === 'pre' ? 'Begin Rite' : 'Complete'}
          </button>
          <button
            onClick={onSkip}
            className="px-8 py-3 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>

        <p className="text-ash-500 text-sm text-center mt-4">
          Your reflections are saved to your personal grimoire
        </p>
      </div>
    </div>
  );
};