import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Login from './Login';
import MenuSettings from './MenuSettings';
import VideoScreen from './VideoScreen';

const defaultSettings = {
  snow: {
    enabled: true,
    speed: 1,
    pileHeight: 20,
  },
  santa: {
    hatImage: null,
    beardImage: null,
  },
  ads: {
    videoFile: null,
    controlMode: 'duration', // 'duration' or 'loop'
    duration: 60,
    loopCount: 1,
  },
  customProp: {
    imageFile: null,
    position: 'face', // 'face', 'nose', 'head', 'eyes', 'mouth'
    name: '',
  },
  game: {
    tickerText: 'Congratulations, you can now collect your 10% discount offer from the store!',
    tickerSpeed: 1.5,
    winnerText: 'YOU WIN!',
    joiningWaitTime: 20,
    resultDisplayTime: 60,
    startMode: 'automatic',
  },
};

/**
 * The face filter application itself. Split out of App.jsx and loaded lazily so
 * MediaPipe, dnd-kit and the 2.5k-line video screen stay out of the initial
 * bundle for anyone just browsing the portfolio.
 */
const FaceFilterApp = () => {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === '1';
  const [isAuthenticated, setIsAuthenticated] = useState(isDemoMode);
  const [currentView, setCurrentView] = useState('menu'); // 'menu' or 'video'
  const [startMode, setStartMode] = useState('live'); // 'live' or 'ads'
  const [settings, setSettings] = useState(defaultSettings);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleStartVideo = (mode = 'live') => {
    setStartMode(mode);
    setCurrentView('video');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return currentView === 'menu' ? (
    <MenuSettings
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onStartVideo={handleStartVideo}
    />
  ) : (
    <VideoScreen
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onBackToMenu={handleBackToMenu}
      startMode={startMode}
    />
  );
};

export default FaceFilterApp;
