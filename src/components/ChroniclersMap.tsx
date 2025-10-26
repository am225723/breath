import React, { useEffect, useRef } from 'react';
import type { UserProgress, Session } from '../types';

interface ChroniclersMapProps {
  progress: UserProgress;
  onClose: () => void;
}

export const ChroniclersMap: React.FC<ChroniclersMapProps> = ({ progress, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;

    // Draw parchment background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create a grid for days
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 90); // Show last 90 days

    const sessions = progress.sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= startDate;
    });

    // Group sessions by day
    const sessionsByDay = new Map<string, Session[]>();
    sessions.forEach(session => {
      const dateKey = new Date(session.date).toDateString();
      if (!sessionsByDay.has(dateKey)) {
        sessionsByDay.set(dateKey, []);
      }
      sessionsByDay.get(dateKey)!.push(session);
    });

    // Draw constellation
    const cols = 13;
    const rows = 7;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    let dayIndex = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + dayIndex);
        
        if (currentDate > today) break;

        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;

        const dateKey = currentDate.toDateString();
        const daySessions = sessionsByDay.get(dateKey) || [];

        if (daySessions.length > 0) {
          // Draw bonfire
          const intensity = Math.min(daySessions.length, 5);
          const size = 10 + intensity * 3;

          // Glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
          gradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 159, 0, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 159, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = '#ffc800';
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();

          // Connect to previous day if exists
          if (dayIndex > 0) {
            const prevCol = (col - 1 + cols) % cols;
            const prevRow = col === 0 ? row - 1 : row;
            if (prevRow >= 0) {
              const prevDate = new Date(startDate);
              prevDate.setDate(prevDate.getDate() + dayIndex - 1);
              const prevDateKey = prevDate.toDateString();
              const prevSessions = sessionsByDay.get(prevDateKey) || [];
              
              if (prevSessions.length > 0) {
                const prevX = prevCol * cellWidth + cellWidth / 2;
                const prevY = prevRow * cellHeight + cellHeight / 2;
                
                ctx.strokeStyle = 'rgba(255, 200, 0, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
              }
            }
          }
        } else {
          // Empty day - small dim marker
          ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        dayIndex++;
      }
    }

    // Draw legend
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '14px sans-serif';
    ctx.fillText('Your Journey - Last 90 Days', 20, 30);
    ctx.fillText(`Total Sessions: ${progress.totalSessions}`, 20, 50);
    ctx.fillText(`Current Streak: ${progress.currentStreak} days`, 20, 70);
    ctx.fillText(`Longest Streak: ${progress.longestStreak} days`, 20, 90);

  }, [progress]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-50">
      <div className="bg-ash-800 rounded-lg p-8 max-w-7xl w-full border-2 border-ember-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-ember-400">
            The Chronicler's Map
          </h2>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-ash-700 hover:bg-ash-600 text-ash-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        <canvas 
          ref={canvasRef}
          className="w-full h-auto border border-ash-700 rounded-lg"
        />

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-ash-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-ember-400">
              {progress.totalSessions}
            </div>
            <div className="text-sm text-ash-400">Total Sessions</div>
          </div>
          <div className="bg-ash-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-ember-400">
              {progress.totalMinutes}
            </div>
            <div className="text-sm text-ash-400">Total Minutes</div>
          </div>
          <div className="bg-ash-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-ember-400">
              {progress.currentStreak}
            </div>
            <div className="text-sm text-ash-400">Current Streak</div>
          </div>
          <div className="bg-ash-900 p-4 rounded-lg">
            <div className="text-2xl font-bold text-ember-400">
              {progress.longestStreak}
            </div>
            <div className="text-sm text-ash-400">Longest Streak</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-ember-300 mb-4">Recent Sessions</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {progress.sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="bg-ash-900 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-ember-400 font-semibold">
                    {session.rite.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                  <div className="text-sm text-ash-400">
                    {new Date(session.date).toLocaleDateString()} - {Math.floor(session.duration / 60)}m {session.duration % 60}s
                  </div>
                </div>
                {session.preRitualNote && (
                  <div className="text-xs text-ash-500 max-w-xs truncate">
                    "{session.preRitualNote}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};