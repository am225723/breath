import React, { useState } from 'react';
import { createEchoMessage } from '../utils/storage';
import { ECHO_TEMPLATES } from '../types';

interface LeaveEchoProps {
  onSubmit: (message: string) => void;
  onSkip: () => void;
}

export const LeaveEcho: React.FC<LeaveEchoProps> = ({ onSubmit, onSkip }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<[string, string] | null>(null);

  const handleSubmit = () => {
    if (selectedTemplate) {
      const message = createEchoMessage(selectedTemplate);
      onSubmit(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <div className="bg-ash-800 rounded-lg p-8 max-w-3xl w-full border-2 border-ember-600 shadow-2xl">
        <h2 className="text-3xl font-bold text-ember-400 mb-4 text-center">
          Leave an Echo for a Fellow Traveler
        </h2>
        
        <p className="text-ash-300 text-center mb-6">
          Your message will appear to others on their journey, offering support and solidarity
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 max-h-96 overflow-y-auto">
          {ECHO_TEMPLATES.map((template, index) => {
            const message = createEchoMessage(template as [string, string]);
            const isSelected = selectedTemplate === template;
            return (
              <button
                key={index}
                onClick={() => setSelectedTemplate(template as [string, string])}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'bg-ember-600 border-ember-400 text-ash-900'
                    : 'bg-ash-900 border-ash-700 text-ash-300 hover:border-ash-600'
                }`}
              >
                {message}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedTemplate}
            className={`px-8 py-3 font-bold rounded-lg transition-colors ${
              selectedTemplate
                ? 'bg-ember-600 hover:bg-ember-500 text-ash-900'
                : 'bg-ash-700 text-ash-500 cursor-not-allowed'
            }`}
          >
            Leave Echo
          </button>
          <button
            onClick={onSkip}
            className="px-8 py-3 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};