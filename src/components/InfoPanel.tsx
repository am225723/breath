import React from 'react';

interface InfoPanelProps {
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-50 overflow-y-auto">
      <div className="bg-ash-800 rounded-lg p-8 max-w-4xl w-full border-2 border-ember-600 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-ember-400">
            About The Path of Embers
          </h2>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 text-ash-300">
          <section>
            <h3 className="text-xl font-bold text-ember-300 mb-3">🔥 The Journey</h3>
            <p className="mb-2">
              The Path of Embers transforms breathing practice into a meaningful journey inspired by Dark Souls. 
              Your dedication is visualized through an evolving bonfire, growing from a smoldering ember to the First Flame.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-ember-300 mb-3">⚔️ Breathing Techniques</h3>
            <div className="space-y-3">
              <div className="bg-ash-900 p-4 rounded-lg">
                <h4 className="font-bold text-ember-400">Twilit Respite (4-7-8)</h4>
                <p className="text-sm">Inhale for 4 seconds, hold for 7, exhale for 8. Calms the nervous system and reduces anxiety.</p>
              </div>
              <div className="bg-ash-900 p-4 rounded-lg">
                <h4 className="font-bold text-ember-400">Iron Flesh Technique (Box Breathing)</h4>
                <p className="text-sm">Equal parts: 4 seconds each for inhale, hold, exhale, hold. Enhances focus and mental clarity.</p>
              </div>
              <div className="bg-ash-900 p-4 rounded-lg">
                <h4 className="font-bold text-ember-400">The Dragon's Roar (Wim Hof Inspired)</h4>
                <p className="text-sm">30 cycles of powerful breathing. Increases energy, reduces stress, and boosts immune function.</p>
              </div>
              <div className="bg-ash-900 p-4 rounded-lg">
                <h4 className="font-bold text-ember-400">Estus Breath (Resonance)</h4>
                <p className="text-sm">5 seconds in, 5 seconds out. Optimizes heart rate variability and promotes healing.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-ember-300 mb-3">🛡️ Covenants</h3>
            <p className="mb-2">
              Choose a covenant to theme your journey and receive preferred breathing techniques:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><span className="text-blue-400">Covenant of Respite</span> - For stress and anxiety reduction</li>
              <li><span className="text-slate-400">Covenant of Focus</span> - For discipline and productivity</li>
              <li><span className="text-yellow-400">Covenant of Vigor</span> - For energy and vitality</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-ember-300 mb-3">📈 Progression System</h3>
            <div className="space-y-2">
              <p><span className="text-ember-400 font-bold">Days 1-3:</span> Smoldering - Your journey begins</p>
              <p><span className="text-ember-400 font-bold">Days 4-7:</span> Steady Flame - Consistency builds</p>
              <p><span className="text-ember-400 font-bold">Days 8-14:</span> Roaring - Power grows</p>
              <p><span className="text-ember-400 font-bold">Days 15+:</span> First Flame - Mastery achieved</p>
            </div>
            <p className="mt-3 text-amber-400 text-sm">
              ⚠️ Grace Period: Miss a day? You have 2 days to complete a session and restore your flame.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-ember-300 mb-3">💬 Echoes of Travelers</h3>
            <p>
              Leave supportive messages for fellow travelers after completing sessions longer than 5 minutes. 
              Receive random encouraging echoes from the community. All messages use pre-set templates to maintain positivity.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-ember-300 mb-3">📊 Privacy</h3>
            <p>
              All your data is stored locally in your browser. Nothing is sent to external servers. 
              Your journey, journal entries, and progress are yours alone.
            </p>
          </section>

          <section className="border-t border-ash-700 pt-4">
            <p className="text-center text-ash-500 italic">
              "Don't give up, skeleton"
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};