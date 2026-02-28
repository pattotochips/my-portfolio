import { useState } from 'react';
import { HashRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './components/Login';
import MenuSettings from './components/MenuSettings';
import VideoScreen from './components/VideoScreen';
import DemoLanding from './components/DemoLanding';
import ExpenseSplitterLanding from './components/ExpenseSplitterLanding';
import OOOGeneratorLanding from './components/OOOGeneratorLanding';
import PortfolioHome from './components/PortfolioHome';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function AppMain() {
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get('demo') === '1';
  const [isAuthenticated, setIsAuthenticated] = useState(isDemoMode);
  const [currentView, setCurrentView] = useState('menu'); // 'menu' or 'video'
  const [startMode, setStartMode] = useState('live'); // 'live' or 'ads'
  const [settings, setSettings] = useState({
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
  });

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
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/face-filter" element={<DemoLanding />} />
          <Route path="/expense-splitter" element={<ExpenseSplitterLanding />} />
          <Route path="/ooo-generator" element={<OOOGeneratorLanding />} />
          <Route path="/face-filter/app" element={<AppMain />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
