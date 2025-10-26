import { useState, useEffect } from 'react';
import { CovenantSelection } from './components/CovenantSelection';
import { MainMenu } from './components/MainMenu';
import { BreathingSession } from './components/BreathingSession';
import { JournalPrompt } from './components/JournalPrompt';
import { ChroniclersMap } from './components/ChroniclersMap';
import { TravelerEcho } from './components/TravelerEcho';
import { LeaveEcho } from './components/LeaveEcho';
import { InfoPanel } from './components/InfoPanel';
import { BREATHING_RITES } from './data/breathingRites';
import { 
  loadProgress, 
  saveProgress, 
  addSession,
  getRandomEcho,
  saveEcho
} from './utils/storage';
import type { UserProgress, BreathingPattern, CovenantType, Session } from './types';

type AppState = 
  | 'covenant-selection'
  | 'main-menu'
  | 'pre-ritual'
  | 'breathing'
  | 'post-ritual'
  | 'leave-echo'
  | 'chroniclers-map'
  | 'info';

function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [appState, setAppState] = useState<AppState>(
    progress.covenant ? 'main-menu' : 'covenant-selection'
  );
  const [selectedRite, setSelectedRite] = useState<BreathingPattern | null>(null);
  const [preRitualNote, setPreRitualNote] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [showEcho, setShowEcho] = useState(false);
  const [echoMessage, setEchoMessage] = useState<string>('');

  // Show random echo on mount
  useEffect(() => {
    const echo = getRandomEcho();
    if (echo) {
      setEchoMessage(echo);
      setShowEcho(true);
    }
  }, []);

  const handleCovenantSelect = (covenant: CovenantType) => {
    const updatedProgress = {
      ...progress,
      covenant,
    };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
    setAppState('main-menu');
  };

  const handleRiteSelect = (rite: BreathingPattern) => {
    setSelectedRite(rite);
    setAppState('pre-ritual');
  };

  const handlePreRitualSubmit = (note: string) => {
    setPreRitualNote(note);
    setAppState('breathing');
  };

  const handleSessionComplete = (session: Session) => {
    setCurrentSession(session);
    setAppState('post-ritual');
  };

  const handlePostRitualSubmit = (note: string) => {
    if (currentSession) {
      const sessionWithNote = {
        ...currentSession,
        postRitualNote: note,
      };
      
      const updatedProgress = addSession(progress, sessionWithNote);
      setProgress(updatedProgress);
      saveProgress(updatedProgress);

      // Show leave echo prompt if session was > 5 minutes
      if (sessionWithNote.duration >= 300) {
        setAppState('leave-echo');
      } else {
        setAppState('main-menu');
      }
      
      setCurrentSession(null);
      setPreRitualNote('');
    }
  };

  const handleLeaveEcho = (message: string) => {
    saveEcho({
      id: crypto.randomUUID(),
      message,
      timestamp: new Date(),
    });
    setAppState('main-menu');
  };

  const handleSkipEcho = () => {
    setAppState('main-menu');
  };

  const handleViewProgress = () => {
    setAppState('chroniclers-map');
  };

  const handleCloseMap = () => {
    setAppState('main-menu');
  };

  const handleViewInfo = () => {
    setAppState('info');
  };

  const handleCloseInfo = () => {
    setAppState('main-menu');
  };

  const handleCancelSession = () => {
    setSelectedRite(null);
    setPreRitualNote('');
    setAppState('main-menu');
  };

  return (
    <div className="min-h-screen bg-ash-900">
      {appState === 'covenant-selection' && (
        <CovenantSelection onSelect={handleCovenantSelect} />
      )}

      {appState === 'main-menu' && (
        <MainMenu 
          progress={progress}
          onSelectRite={handleRiteSelect}
          onViewProgress={handleViewProgress}
          onViewInfo={handleViewInfo}
        />
      )}

      {appState === 'pre-ritual' && (
        <JournalPrompt
          type="pre"
          onSubmit={handlePreRitualSubmit}
          onSkip={() => handlePreRitualSubmit('')}
        />
      )}

      {appState === 'breathing' && selectedRite && (
        <BreathingSession
          rite={BREATHING_RITES[selectedRite]}
          covenant={progress.covenant}
          onComplete={handleSessionComplete}
          onCancel={handleCancelSession}
          preRitualNote={preRitualNote}
        />
      )}

      {appState === 'post-ritual' && (
        <JournalPrompt
          type="post"
          onSubmit={handlePostRitualSubmit}
          onSkip={() => handlePostRitualSubmit('')}
        />
      )}

      {appState === 'leave-echo' && (
        <LeaveEcho
          onSubmit={handleLeaveEcho}
          onSkip={handleSkipEcho}
        />
      )}

      {appState === 'chroniclers-map' && (
        <ChroniclersMap
          progress={progress}
          onClose={handleCloseMap}
        />
      )}

      {appState === 'info' && (
        <InfoPanel onClose={handleCloseInfo} />
      )}

      {showEcho && echoMessage && (
        <TravelerEcho
          message={echoMessage}
          onDismiss={() => setShowEcho(false)}
        />
      )}
    </div>
  );
}

export default App;