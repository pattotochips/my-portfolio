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
  Person as SilhouetteIcon,
  Animation as StripeIcon,
  Tune as TuningIcon,
  FlipCameraAndroid as ModeIcon,
  Terminal as BuildIcon,
  Keyboard as KeyboardIcon,
  ArrowBack as BackIcon,
  DesktopWindows as DesktopIcon,
} from '@mui/icons-material';
import CaseStudy from './CaseStudy';
import ProjectLinks from './ProjectLinks';
import SiteFooter from './SiteFooter';
import MediaSlot from './MediaSlot';
import { caseStudies } from '../data/caseStudies';
import { repos } from '../data/profile';
import { glassCard, gradientText as makeGradientText, pageBackground, text, focusRing } from '../styles/shared';

const accent = 'linear-gradient(135deg, #AC2BFF 0%, #FF2BD1 100%)';
const accentHover = 'linear-gradient(135deg, #FF2BD1 0%, #AC2BFF 100%)';
const gradientText = makeGradientText(accent);

const features = [
  {
    icon: <SilhouetteIcon />,
    title: 'Stable Silhouette Extraction',
    description:
      'MediaPipe selfie segmentation gives a per-pixel confidence mask. Blur, dilate and erode clean the edge, then temporal smoothing stops the outline vibrating frame to frame.',
    gradient: 'linear-gradient(135deg, #AC2BFF 0%, #FF2BD1 100%)',
  },
  {
    icon: <StripeIcon />,
    title: 'Procedural Stripe Field',
    description:
      '120 animated stripe lines with random thickness pulses, cycling through a neon palette and alternating horizontal and vertical phases every ten seconds. Generated, so it never loops visibly.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <ModeIcon />,
    title: 'Two Modes, One Pipeline',
    description:
      'Mode 0 tints the silhouette over the stripes; mode 1 is an infrared-style white silhouette on black. Both reuse the same segmentation and compositing path.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <TuningIcon />,
    title: 'Per-Mode Tuning as Data',
    description:
      'SEG_CFG holds threshold, blur, dilate and erode per mode, so switching modes swaps a config entry instead of branching through the pipeline.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    icon: <KeyboardIcon />,
    title: 'Live Keyboard Controls',
    description:
      'M toggles mode, W toggles fullscreen, ESC exits — the controls that need to be reachable while the camera is running.',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6C5CE7 100%)',
  },
  {
    icon: <BuildIcon />,
    title: 'Ships as an Executable',
    description:
      'PyInstaller spec files are committed for both variants, so it distributes as a binary rather than a Python environment someone else has to reproduce.',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
];

const techStack = [
  { label: 'Python 3.7+', color: '#3776ab' },
  { label: 'OpenCV 4', color: '#5C3EE8' },
  { label: 'MediaPipe', color: '#FF2BD1' },
  { label: 'NumPy', color: '#4dabcf' },
  { label: 'PyInstaller', color: '#f5d78e' },
];

const controls = [
  { key: 'M', action: 'Toggle mode — Travis stripes / infrared' },
  { key: 'W', action: 'Toggle fullscreen and windowed' },
  { key: 'ESC', action: 'Exit' },
];

const TravisFilterLanding = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: pageBackground, overflowX: 'hidden' }}>
      {/* HERO */}
      <Box
        component="header"
        sx={{
          minHeight: { xs: 'auto', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          py: { xs: 10, md: 4 },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: { xs: -48, md: -60 },
              left: 0,
              color: text.muted,
              textTransform: 'none',
              '&:hover': { color: text.primary },
              ...focusRing,
            }}
          >
            All Projects
          </Button>

          <Box
            aria-hidden="true"
            sx={{
              width: 88,
              height: 88,
              borderRadius: 4,
              background: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 12px 40px rgba(172, 43, 255, 0.4)',
            }}
          >
            <SilhouetteIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>

          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              ...gradientText,
              fontSize: { xs: '2.3rem', sm: '3.2rem', md: '4.2rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Travis Filter
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: text.muted,
              maxWidth: 640,
              mx: 'auto',
              mb: 4,
              fontWeight: 300,
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
              lineHeight: 1.65,
            }}
          >
            A real-time desktop video filter: your silhouette cut out of the webcam feed and
            composited over animated psychedelic stripes. Python, OpenCV and MediaPipe, packaged as a
            standalone executable.
          </Typography>

          <Stack alignItems="center" spacing={3}>
            <Chip
              icon={<DesktopIcon />}
              label="Desktop app · Python + OpenCV + MediaPipe"
              sx={{
                fontWeight: 700,
                background: 'rgba(172, 43, 255, 0.18)',
                border: '1px solid rgba(255, 43, 209, 0.5)',
                color: '#f0b3ff',
                '& .MuiChip-icon': { color: '#f0b3ff' },
              }}
            />
            <ProjectLinks
              sourceUrl={repos.travisFilter}
              sourceLabel="View Source"
              gradient={accent}
              gradientHover={accentHover}
              note="A desktop OpenCV app needs a local webcam and a display window, so it cannot run in a browser."
            />
          </Stack>
        </Container>
      </Box>

      {/* DEMO SLOTS */}
      <Box component="section" aria-labelledby="demo-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            id="demo-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 5, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Both modes
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MediaSlot
                file="travis-filter-stripes.gif"
                caption="Mode 0 — tinted silhouette over animated stripes"
                gradient={accent}
                aspect="16 / 9"
                maxWidth="100%"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MediaSlot
                file="travis-filter-infrared.gif"
                caption="Mode 1 — infrared-style white silhouette on black"
                gradient={accent}
                aspect="16 / 9"
                maxWidth="100%"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box component="section" aria-labelledby="features-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            id="features-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            How it works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 6, maxWidth: 580, mx: 'auto', lineHeight: 1.8 }}
          >
            The whole effect rests on one thing: whether the silhouette edge is clean and holds still.
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      aria-hidden="true"
                      sx={{
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
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" fontWeight={600} sx={{ color: text.primary, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: text.muted, lineHeight: 1.75 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* RUN IT */}
      <Box component="section" aria-labelledby="run-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            id="run-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Run it locally
          </Typography>
          <Card elevation={0} sx={{ ...glassCard, '&:hover': { transform: 'none' }, mb: 3 }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: { xs: '0.76rem', md: '0.88rem' },
                  color: '#f0b3ff',
                  background: 'rgba(0,0,0,0.42)',
                  border: '1px solid rgba(255,43,209,0.22)',
                  borderRadius: 2,
                  p: 2.5,
                  m: 0,
                  overflowX: 'auto',
                  lineHeight: 1.8,
                }}
              >
{`git clone https://github.com/pattotochips/travis-filter.git
cd travis-filter
pip install -r requirements.txt
python travis_filter.py

# or build a standalone binary
pyinstaller travis_filter.spec`}
              </Typography>
            </CardContent>
          </Card>

          <Stack spacing={1.5}>
            {controls.map((c) => (
              <Stack key={c.key} direction="row" spacing={2} alignItems="center">
                <Box
                  component="kbd"
                  sx={{
                    minWidth: 52,
                    textAlign: 'center',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: text.primary,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderBottomWidth: 3,
                    borderRadius: 1.5,
                    px: 1.25,
                    py: 0.5,
                  }}
                >
                  {c.key}
                </Box>
                <Typography variant="body2" sx={{ color: text.muted }}>
                  {c.action}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CASE STUDY */}
      <CaseStudy study={caseStudies['travis-filter']} gradient={accent} />

      {/* TECH STACK */}
      <Box component="section" aria-labelledby="stack-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            id="stack-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Tech Stack
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
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${tech.color}55`,
                  color: tech.color,
                  '&:hover': { background: `${tech.color}1f` },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA */}
      <Box component="section" aria-labelledby="cta-heading" sx={{ py: { xs: 8, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography
            id="cta-heading"
            variant="h4"
            component="h2"
            fontWeight={700}
            sx={{ color: text.primary, mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            Read the code
          </Typography>
          <Typography variant="body1" sx={{ color: text.muted, mb: 4 }}>
            Segmentation, mask refinement and compositing in a single readable Python file.
          </Typography>
          <ProjectLinks
            sourceUrl={repos.travisFilter}
            sourceLabel="View on GitHub"
            gradient={accent}
            gradientHover={accentHover}
          />
        </Container>
      </Box>

      <SiteFooter note="Built with Python, OpenCV, MediaPipe, and NumPy." />
    </Box>
  );
};

export default TravisFilterLanding;
