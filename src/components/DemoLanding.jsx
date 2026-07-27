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
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import CaseStudy from './CaseStudy';
import ProjectLinks from './ProjectLinks';
import SiteFooter from './SiteFooter';
import { caseStudies } from '../data/caseStudies';
import { repos } from '../data/profile';
import { glassCard, gradientText as makeGradientText, text, focusRing } from '../styles/shared';

const assetBase = import.meta.env.BASE_URL + 'assets/';

const accent = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const accentHover = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';

const gradientText = makeGradientText(accent);

const features = [
  {
    icon: <FaceIcon />,
    title: 'Santa Filter',
    description: 'Real-time Santa hat and beard overlay with multi-face support and smooth landmark tracking.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    image: 'santa-hat.webp',
  },
  {
    icon: <TreeIcon />,
    title: 'Tree Costume',
    description: 'Full Christmas tree outfit with intelligent face-hole positioning that tracks head movement.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    image: 'tree-outfit.webp',
  },
  {
    icon: <SnowIcon />,
    title: 'Snow Effects',
    description: 'Image-based particle system with realistic physics, configurable speed, and snow pile accumulation.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: 'snow.webp',
  },
  {
    icon: <GamesIcon />,
    title: 'Game Mode',
    description: 'Interactive hand-gesture game with automatic detection, countdown timer, and winner selection.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    image: 'game-arrow.webp',
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

/**
 * Decorative snow, generated once at module load. Randomising these inside the
 * render body is impure and makes the snow jump on every re-render.
 */
const snowflakes = Array.from({ length: 30 }, (_, id) => ({
  id,
  size: 4 + Math.random() * 4,
  left: Math.random() * 100,
  top: Math.random() * 10,
  duration: 5 + Math.random() * 8,
  delay: Math.random() * 8,
  opacity: 0.3 + Math.random() * 0.5,
}));

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
        {snowflakes.map((flake) => (
          <Box
            key={flake.id}
            sx={{
              position: 'absolute',
              width: flake.size,
              height: flake.size,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              left: `${flake.left}%`,
              top: `-${flake.top}vh`,
              animation: `snowfall ${flake.duration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
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
          src={`${assetBase}santa-hat.webp`}
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
          src={`${assetBase}elf-hat.webp`}
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
          src={`${assetBase}tree-outfit.webp`}
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
          src={`${assetBase}santa-sledge.webp`}
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
          {/* Back button */}
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: { xs: -40, md: -60 },
              left: 0,
              color: text.muted,
              textTransform: 'none',
              '&:hover': { color: text.primary },
              ...focusRing,
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
            Face Filter App
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: text.secondary,
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
          <ProjectLinks
            onLive={handleTryLive}
            sourceUrl={repos.portfolio}
            gradient={accent}
            gradientHover={accentHover}
            note="Runs entirely in your browser and needs camera access. Frames never leave the page — there is no backend."
          />
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Features
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 6, maxWidth: 500, mx: 'auto' }}
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
                        /* Decorative: the feature title is already the heading
                           directly below, so alt text here would repeat it. */
                        alt=""
                        loading="lazy"
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
                    <Typography variant="h6" component="h3" fontWeight={600} sx={{ color: text.primary, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: text.muted, lineHeight: 1.7 }}>
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
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 6, maxWidth: 500, mx: 'auto' }}
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
                    <Box sx={{ color: text.secondary }}>{step.icon}</Box>
                  </Box>
                  <Typography variant="h6" component="h3" fontWeight={600} sx={{ color: text.primary, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: text.muted, lineHeight: 1.7, maxWidth: 280, mx: 'auto' }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CASE STUDY */}
      <CaseStudy study={caseStudies['face-filter']} gradient={accent} />

      {/* TECH STACK SECTION */}
      <Box sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Tech Stack
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 5, maxWidth: 400, mx: 'auto' }}
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
            component="h2"
            fontWeight={700}
            sx={{ color: text.primary, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Ready to try it?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: text.muted, mb: 4 }}
          >
            Grant camera access and see the filters in action on your own face.
          </Typography>
          <ProjectLinks
            onLive={handleTryLive}
            sourceUrl={repos.portfolio}
            gradient={accent}
            gradientHover={accentHover}
            note="Requires camera access. Works best in Chrome or Edge."
          />
        </Container>
      </Box>

      <SiteFooter note="Built with React 19, MediaPipe Tasks Vision, and the Canvas API." />
    </Box>
  );
};

export default DemoLanding;
