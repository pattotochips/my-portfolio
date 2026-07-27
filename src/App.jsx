import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import PortfolioHome from './components/PortfolioHome';
import { pageBackground } from './styles/shared';

// Everything past the home page loads on demand. The face filter app in
// particular drags in MediaPipe and dnd-kit, which have no business being in
// the bundle someone downloads to read the home page.
const DemoLanding = lazy(() => import('./components/DemoLanding'));
const ExpenseSplitterLanding = lazy(() => import('./components/ExpenseSplitterLanding'));
const OOOGeneratorLanding = lazy(() => import('./components/OOOGeneratorLanding'));
const BirthdayBotLanding = lazy(() => import('./components/BirthdayBotLanding'));
const FaceFilterApp = lazy(() => import('./components/FaceFilterApp'));

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

const RouteFallback = () => (
  <Box
    role="status"
    aria-live="polite"
    aria-label="Loading page"
    sx={{
      minHeight: '100vh',
      background: pageBackground,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress aria-hidden="true" />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Box
          component="a"
          href="#main"
          sx={{
            position: 'absolute',
            left: -9999,
            top: 0,
            zIndex: 2000,
            px: 2,
            py: 1.25,
            borderRadius: '0 0 8px 0',
            background: '#ffffff',
            color: '#0a0e27',
            fontWeight: 700,
            textDecoration: 'none',
            '&:focus': { left: 0 },
          }}
        >
          Skip to content
        </Box>
        {/* tabIndex makes the skip link actually move focus here — browsers do
            not reliably focus a non-focusable anchor target. */}
        <Box component="main" id="main" tabIndex={-1}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<PortfolioHome />} />
              <Route path="/face-filter" element={<DemoLanding />} />
              <Route path="/expense-splitter" element={<ExpenseSplitterLanding />} />
              <Route path="/ooo-generator" element={<OOOGeneratorLanding />} />
              <Route path="/birthday-bot" element={<BirthdayBotLanding />} />
              <Route path="/face-filter/app" element={<FaceFilterApp />} />
              {/* GitHub Pages serves 404.html for unknown paths; the router lands
                  here and sends the visitor home rather than showing a blank page. */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
