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
  AcUnit as SnowIcon,
  Face as FaceIcon,
  Park as TreeIcon,
  Games as GamesIcon,
  PlaylistPlay as SequenceIcon,
  CameraAlt as CameraIcon,
  Visibility as VisionIcon,
  Speed as SpeedIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

const assetBase = import.meta.env.BASE_URL + 'assets/';

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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const features = [
  {
    icon: <FaceIcon />,
    title: 'Santa Filter',
    description: 'Real-time Santa hat and beard overlay with multi-face support and smooth landmark tracking.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    image: 'santa-hat.png',
  },
  {
    icon: <TreeIcon />,
    title: 'Tree Costume',
    description: 'Full Christmas tree outfit with intelligent face-hole positioning that tracks head movement.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    image: 'tree-outfit.png',
  },
  {
    icon: <SnowIcon />,
    title: 'Snow Effects',
    description: 'Image-based particle system with realistic physics, configurable speed, and snow pile accumulation.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: 'snow.png',
  },
  {
    icon: <GamesIcon />,
    title: 'Game Mode',
    description: 'Interactive hand-gesture game with automatic detection, countdown timer, and winner selection.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    image: 'game-arrow.png',
  },
{
    icon: <SequenceIcon />,
    title: 'App Sequencing',
    description: 'Drag-and-drop sequence builder to orchestrate filters, ads, and games with flexible timing.',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
];

const techStack = [
  { label: 'React 19', color: '#61dafb' },
  { label: 'Vite 5', color: '#646cff' },
  { label: 'Material UI 7', color: '#007fff' },
  { label: 'MediaPipe', color: '#0f9d58' },
  { label: 'Canvas API', color: '#f5576c' },
  { label: 'WebGL', color: '#fa709a' },
];

const steps = [
  {
    icon: <CameraIcon sx={{ fontSize: 36 }} />,
    title: 'Camera Capture',
    description: 'Accesses your webcam and streams video frames to an HTML5 canvas.',
  },
  {
    icon: <VisionIcon sx={{ fontSize: 36 }} />,
    title: 'AI Face Detection',
    description: 'MediaPipe detects 478 facial landmarks per face with GPU-accelerated inference.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 36 }} />,
    title: 'Real-time Rendering',
    description: 'Filters render at 60fps with 5-frame smoothing for jitter-free overlays.',
  },
];

const floatKeyframes = {
  '@keyframes float1': {
    '0%, 100%': { transform: 'translateY(0px) rotate(-12deg)' },
    '50%': { transform: 'translateY(-20px) rotate(-8deg)' },
  },
  '@keyframes float2': {
    '0%, 100%': { transform: 'translateY(0px) rotate(10deg)' },
    '50%': { transform: 'translateY(-15px) rotate(14deg)' },
  },
  '@keyframes float3': {
    '0%, 100%': { transform: 'translateY(0px) rotate(5deg)' },
    '50%': { transform: 'translateY(-25px) rotate(-2deg)' },
  },
  '@keyframes snowfall': {
    '0%': { transform: 'translateY(-10vh) translateX(0)', opacity: 1 },
    '100%': { transform: 'translateY(105vh) translateX(20px)', opacity: 0.3 },
  },
};

const DemoLanding = () => {
  const navigate = useNavigate();

  const handleTryLive = () => {
    navigate('/face-filter/app?demo=1');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      overflowX: 'hidden',
      ...floatKeyframes,
    }}>
      {/* CSS Snow Particles */}
      <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 4 + Math.random() * 4,
              height: 4 + Math.random() * 4,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 10}vh`,
              animation: `snowfall ${5 + Math.random() * 8}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
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
        {/* Floating assets */}
        <Box
          component="img"
          src={`${assetBase}santa-hat.png`}
          alt=""
          sx={{
            position: 'absolute',
            top: { xs: '5%', md: '12%' },
            left: { xs: '5%', md: '10%' },
            width: { xs: 80, md: 120 },
            opacity: 0.25,
            animation: 'float1 6s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          component="img"
          src={`${assetBase}elf-hat.png`}
          alt=""
          sx={{
            position: 'absolute',
            top: { xs: '10%', md: '18%' },
            right: { xs: '5%', md: '12%' },
            width: { xs: 70, md: 100 },
            opacity: 0.2,
            animation: 'float2 7s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          component="img"
          src={`${assetBase}tree-outfit.png`}
          alt=""
          sx={{
            position: 'absolute',
            bottom: { xs: '8%', md: '15%' },
            right: { xs: '8%', md: '15%' },
            width: { xs: 60, md: 90 },
            opacity: 0.15,
            animation: 'float3 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <Box
          component="img"
          src={`${assetBase}santa-sledge.png`}
          alt=""
          sx={{
            position: 'absolute',
            bottom: { xs: '12%', md: '20%' },
            left: { xs: '6%', md: '8%' },
            width: { xs: 70, md: 110 },
            opacity: 0.18,
            animation: 'float2 9s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
            Face Filter App
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
            Real-time AI-powered face filters built with React and MediaPipe.
            Detects 478 facial landmarks for smooth, jitter-free overlays at 60fps.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayIcon />}
            onClick={handleTryLive}
            sx={{
              py: 1.8,
              px: 5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)',
              },
            }}
          >
            Try it Live
          </Button>
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
            Built with computer vision and real-time rendering for an interactive experience.
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
                      boxShadow: `0 4px 15px ${feature.gradient.includes('#f093fb') ? 'rgba(240,147,251,0.3)' : 'rgba(0,0,0,0.3)'}`,
                      '& svg': { color: 'white', fontSize: 24 },
                    }}>
                      {feature.icon}
                    </Box>
                    {feature.image && (
                      <Box
                        component="img"
                        src={`${assetBase}${feature.image}`}
                        alt={feature.title}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'contain',
                          mb: 2,
                          opacity: 0.85,
                          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
                        }}
                      />
                    )}
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
            Three-stage pipeline from camera to rendered overlay.
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            Modern web technologies for real-time AI video processing.
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
            Ready to try it?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}
          >
            Grant camera access and see the filters in action on your own face.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayIcon />}
            onClick={handleTryLive}
            sx={{
              py: 1.8,
              px: 5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)',
              },
            }}
          >
            Try it Live
          </Button>
          <Typography
            variant="caption"
            display="block"
            sx={{ color: 'rgba(255,255,255,0.3)', mt: 6, pb: 2 }}
          >
            Requires camera access. Works best in Chrome or Edge.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default DemoLanding;
