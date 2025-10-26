import React, { useEffect, useState } from 'react';

interface TravelerEchoProps {
  message: string;
  onDismiss: () => void;
}

export const TravelerEcho: React.FC<TravelerEchoProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 100);

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div 
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-ash-800/90 backdrop-blur-sm border-2 border-ember-600 rounded-lg px-6 py-4 shadow-2xl">
        <div className="text-ember-400 font-semibold text-center">
          {message}
        </div>
        <div className="text-ash-500 text-xs text-center mt-1">
          — A fellow traveler
        </div>
      </div>
    </div>
  );
};