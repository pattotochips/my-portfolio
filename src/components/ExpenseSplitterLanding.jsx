import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import {
  Group as GroupIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  CurrencyExchange as CurrencyIcon,
  Notifications as NotifyIcon,
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  Calculate as CalculateIcon,
  Handshake as SettleIcon,
  OpenInNew as OpenInNewIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 3,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  },
};

const gradientText = {
  background: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const features = [
  {
    icon: <GroupIcon />,
    title: 'Group Management',
    description: 'Create expense groups, add members by email, and manage shared finances with your roommates, friends, or travel buddies.',
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
  },
  {
    icon: <ReceiptIcon />,
    title: 'Expense Tracking',
    description: 'Add expenses with descriptions, specify who paid, and choose which members to split among. View all expenses in one place.',
    gradient: 'linear-gradient(135deg, #00CEC9 0%, #81ecec 100%)',
  },
  {
    icon: <WalletIcon />,
    title: 'Auto Balance Calculation',
    description: 'Greedy algorithm minimizes transactions needed to settle up. See exactly who owes whom and how much at a glance.',
    gradient: 'linear-gradient(135deg, #00B894 0%, #55efc4 100%)',
  },
  {
    icon: <CurrencyIcon />,
    title: 'Multi-Currency',
    description: 'Support for 10 currencies including USD, EUR, GBP, INR, and more. Currency preference saved locally per user.',
    gradient: 'linear-gradient(135deg, #FDCB6E 0%, #ffeaa7 100%)',
  },
  {
    icon: <NotifyIcon />,
    title: 'Invite System',
    description: 'Add non-registered users to groups via email invites. Pending invites auto-process when they sign up.',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #fab1a0 100%)',
  },
  {
    icon: <DashboardIcon />,
    title: 'Dashboard Overview',
    description: 'Global balance summary showing total owed, total owing, and net balance across all your groups.',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6C5CE7 100%)',
  },
];

const techStack = [
  { label: 'React 18', color: '#61dafb' },
  { label: 'Firebase Auth', color: '#FFCA28' },
  { label: 'Cloud Firestore', color: '#FF8F00' },
  { label: 'Material UI 6', color: '#007fff' },
  { label: 'React Router 6', color: '#f44250' },
  { label: 'Emotion', color: '#d36ac2' },
];

const steps = [
  {
    icon: <PersonAddIcon sx={{ fontSize: 36 }} />,
    title: 'Create & Invite',
    description: 'Sign up, create an expense group, and invite members by email.',
  },
  {
    icon: <CalculateIcon sx={{ fontSize: 36 }} />,
    title: 'Track Expenses',
    description: 'Add shared expenses, specify payer and split among selected members.',
  },
  {
    icon: <SettleIcon sx={{ fontSize: 36 }} />,
    title: 'Settle Up',
    description: 'View auto-calculated balances and settlement suggestions to minimize payments.',
  },
];

const floatKeyframes = {
  '@keyframes float1': {
    '0%, 100%': { transform: 'translateY(0px) rotate(-5deg)' },
    '50%': { transform: 'translateY(-20px) rotate(2deg)' },
  },
  '@keyframes float2': {
    '0%, 100%': { transform: 'translateY(0px) rotate(5deg)' },
    '50%': { transform: 'translateY(-15px) rotate(-3deg)' },
  },
  '@keyframes float3': {
    '0%, 100%': { transform: 'translateY(0px) scale(1)' },
    '50%': { transform: 'translateY(-18px) scale(1.05)' },
  },
  '@keyframes pulse': {
    '0%, 100%': { opacity: 0.15 },
    '50%': { opacity: 0.3 },
  },
};

const LIVE_URL = 'https://papaya-pie-7204f0.netlify.app/';

const ExpenseSplitterLanding = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      overflowX: 'hidden',
      ...floatKeyframes,
    }}>
      {/* Decorative background orbs */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)',
          top: '10%',
          left: '-5%',
          animation: 'pulse 6s ease-in-out infinite',
        }} />
        <Box sx={{
          position: 'absolute',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,206,201,0.12) 0%, transparent 70%)',
          bottom: '10%',
          right: '-5%',
          animation: 'pulse 8s ease-in-out infinite',
          animationDelay: '2s',
        }} />
      </Box>

      {/* HERO SECTION */}
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        py: 4,
      }}>
        {/* Floating icons */}
        <Box sx={{
          position: 'absolute',
          top: { xs: '8%', md: '15%' },
          left: { xs: '5%', md: '12%' },
          opacity: 0.2,
          animation: 'float1 6s ease-in-out infinite',
          pointerEvents: 'none',
          color: '#6C5CE7',
        }}>
          <WalletIcon sx={{ fontSize: { xs: 48, md: 72 } }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          top: { xs: '12%', md: '20%' },
          right: { xs: '5%', md: '14%' },
          opacity: 0.15,
          animation: 'float2 7s ease-in-out infinite',
          pointerEvents: 'none',
          color: '#00CEC9',
        }}>
          <ReceiptIcon sx={{ fontSize: { xs: 40, md: 60 } }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: { xs: '10%', md: '18%' },
          right: { xs: '10%', md: '18%' },
          opacity: 0.18,
          animation: 'float3 8s ease-in-out infinite',
          pointerEvents: 'none',
          color: '#00B894',
        }}>
          <CurrencyIcon sx={{ fontSize: { xs: 44, md: 64 } }} />
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: { xs: '15%', md: '22%' },
          left: { xs: '8%', md: '10%' },
          opacity: 0.15,
          animation: 'float2 9s ease-in-out infinite',
          pointerEvents: 'none',
          color: '#FDCB6E',
        }}>
          <GroupIcon sx={{ fontSize: { xs: 44, md: 64 } }} />
        </Box>

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: { xs: -40, md: -60 },
              left: 0,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
              '&:hover': { color: 'rgba(255,255,255,0.8)' },
            }}
          >
            All Projects
          </Button>

          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              ...gradientText,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Expense Splitter
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: 600,
              mx: 'auto',
              mb: 5,
              fontWeight: 300,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
              lineHeight: 1.6,
            }}
          >
            A full-stack app to split expenses among groups.
            Firebase-powered with real-time data, automatic balance calculation, and multi-currency support.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              size="large"
              startIcon={<OpenInNewIcon />}
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 1.8,
                px: 5,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(108, 92, 231, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00CEC9 0%, #6C5CE7 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(108, 92, 231, 0.6)',
                },
              }}
            >
              Try it Live
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Features
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: 'rgba(255,255,255,0.5)', mb: 6, maxWidth: 500, mx: 'auto' }}
          >
            Everything you need to manage shared expenses without the spreadsheet headaches.
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                      '& svg': { color: 'white', fontSize: 24 },
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS SECTION */}
      <Box sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: 'rgba(255,255,255,0.5)', mb: 6, maxWidth: 500, mx: 'auto' }}
          >
            Three simple steps to manage shared expenses.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 4 }} key={step.title}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    position: 'relative',
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'white',
                    }}>
                      {index + 1}
                    </Box>
                    <Box sx={{ color: 'rgba(255,255,255,0.7)' }}>{step.icon}</Box>
                  </Box>
                  <Typography variant="h6" fontWeight={600} sx={{ color: 'white', mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280, mx: 'auto' }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TECH STACK SECTION */}
      <Box sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Tech Stack
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: 'rgba(255,255,255,0.5)', mb: 5, maxWidth: 400, mx: 'auto' }}
          >
            Built with React and Firebase for real-time collaboration.
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5}>
            {techStack.map((tech) => (
              <Chip
                key={tech.label}
                label={tech.label}
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  py: 2.5,
                  px: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${tech.color}33`,
                  color: tech.color,
                  '&:hover': {
                    background: `${tech.color}15`,
                  },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* FOOTER CTA */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: 'white', mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Ready to split some expenses?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}
          >
            Try the live app or explore the full codebase on GitHub.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              size="large"
              startIcon={<OpenInNewIcon />}
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 1.8,
                px: 5,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(108, 92, 231, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00CEC9 0%, #6C5CE7 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(108, 92, 231, 0.6)',
                },
              }}
            >
              Try it Live
            </Button>
          </Stack>
          <Typography
            variant="caption"
            display="block"
            sx={{ color: 'rgba(255,255,255,0.3)', mt: 6, pb: 2 }}
          >
            Built with React, Firebase Auth, and Cloud Firestore.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ExpenseSplitterLanding;
