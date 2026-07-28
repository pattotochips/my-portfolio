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
  AccountTree as GraphIcon,
  Timer as TimeIcon,
  Tab as TabIcon,
  EditNote as NoteIcon,
  IosShare as ExportIcon,
  Public as BrowserIcon,
  Search as SearchIcon,
  ArrowBack as BackIcon,
  Extension as ExtensionIcon,
} from '@mui/icons-material';
import CaseStudy from './CaseStudy';
import ProjectLinks from './ProjectLinks';
import SiteFooter from './SiteFooter';
import { caseStudies } from '../data/caseStudies';
import { repos } from '../data/profile';
import { glassCard, gradientText as makeGradientText, pageBackground, text, focusRing } from '../styles/shared';

// The extension itself cannot be demoed in a browser, but the repo's exported
// sample trail is a self-contained interactive page served from GitHub Pages.
const SAMPLE_TRAIL_URL = 'https://pattotochips.github.io/WikiTrail/sample-trail.html';

const accent = 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)';
const accentHover = 'linear-gradient(135deg, #91EAE4 0%, #7F7FD5 100%)';
const gradientText = makeGradientText(accent);

const features = [
  {
    icon: <GraphIcon />,
    title: 'Interactive D3 Graph',
    description:
      'Force-directed layout of every article in a session. Drag nodes, scroll to zoom, double-click to open the article. Arrows show which way you navigated.',
    gradient: 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 100%)',
  },
  {
    icon: <TimeIcon />,
    title: 'Dwell Time as Node Size',
    description:
      'The article you were genuinely absorbed in is the biggest circle on screen. That single encoding is the whole insight the visualisation exists to deliver.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <TabIcon />,
    title: 'Per-Tab Sessions',
    description:
      'Session state is keyed by tab ID, so three Wikipedia tabs give three independent trails instead of one tangled graph. A 30-minute gap starts a fresh session.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <NoteIcon />,
    title: 'Annotations',
    description:
      'Attach a note to any node. Annotated articles get a gold dot in the graph and in exports, and the notes are indexed by search alongside titles.',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  },
  {
    icon: <ExportIcon />,
    title: 'Three Export Formats',
    description:
      'A 2× PNG for sharing, a self-contained interactive HTML page that works without the extension, and Markdown with linked titles for Obsidian or Notion.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    icon: <SearchIcon />,
    title: 'Search & Lifetime Stats',
    description:
      'Search titles and annotations across every session. Totals for articles, time on Wikipedia, most-visited pages, and your most frequent topic word.',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6C5CE7 100%)',
  },
];

const techStack = [
  { label: 'Manifest V3', color: '#4285f4' },
  { label: 'Vanilla JS', color: '#f7df1e' },
  { label: 'D3 v7', color: '#f9a03c' },
  { label: 'Service Worker', color: '#91EAE4' },
  { label: 'webNavigation API', color: '#86A8E7' },
  { label: 'webextension-polyfill', color: '#ff7139' },
];

const browsers = ['Chrome', 'Edge', 'Brave', 'Opera', 'Firefox'];

const WikiTrailLanding = () => {
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
              boxShadow: '0 12px 40px rgba(127, 127, 213, 0.4)',
            }}
          >
            <GraphIcon sx={{ fontSize: 48, color: 'white' }} />
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
            WikiTrail
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
            A browser extension that records your Wikipedia rabbit holes and renders each one as an
            interactive graph. Browser history keeps the pages and throws away the shape of the
            journey — this keeps the shape.
          </Typography>

          <Stack alignItems="center" spacing={3}>
            <Chip
              icon={<ExtensionIcon />}
              label="Browser extension · Manifest V3 · 5 browsers"
              sx={{
                fontWeight: 700,
                background: 'rgba(127, 127, 213, 0.18)',
                border: '1px solid rgba(145, 234, 228, 0.45)',
                color: '#b9c8f5',
                '& .MuiChip-icon': { color: '#b9c8f5' },
              }}
            />
            <ProjectLinks
              liveUrl={SAMPLE_TRAIL_URL}
              liveLabel="Open Interactive Demo"
              sourceUrl={repos.wikiTrail}
              sourceLabel="View Source"
              gradient={accent}
              gradientHover={accentHover}
              contrastText="#141833"
              note="A real exported trail — Coffee → Battle of Waterloo. Drag nodes, scroll to zoom, click to inspect. No extension needed."
            />
          </Stack>
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
            What it does
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 6, maxWidth: 540, mx: 'auto' }}
          >
            Capture is passive. You browse normally and the graph builds itself.
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

      {/* DATA MODEL */}
      <Box component="section" aria-labelledby="data-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            id="data-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Where the data lives
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 4, maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}
          >
            Entirely on your machine. For a record of what you read, that is the only defensible
            default — no account, no server, nothing to leak.
          </Typography>
          <Card elevation={0} sx={{ ...glassCard, '&:hover': { transform: 'none' } }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: { xs: '0.74rem', md: '0.85rem' },
                  color: '#c9d4f7',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(145,234,228,0.2)',
                  borderRadius: 2,
                  p: 2.5,
                  m: 0,
                  overflowX: 'auto',
                  lineHeight: 1.8,
                }}
              >
{`browser.storage.local

  wikitrail:sessions  →  Session[]
  wikitrail:tabs      →  { [tabId]: sessionId }   one entry per open tab
  wikitrail:stats     →  { totalArticles, totalSessions,
                           totalTimeMs, topTopics }`}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* CASE STUDY */}
      <CaseStudy study={caseStudies.wikitrail} gradient={accent} />

      {/* TECH + BROWSERS */}
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
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1.5} sx={{ mb: 5 }}>
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
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" flexWrap="wrap" useFlexGap>
            <BrowserIcon aria-hidden="true" sx={{ color: text.faint, fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: text.faint }}>
              One codebase across {browsers.join(', ')} via the Mozilla webextension-polyfill.
            </Typography>
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
            Try it yourself
          </Typography>
          <Typography variant="body1" sx={{ color: text.muted, mb: 4 }}>
            Load unpacked in Chrome, Edge, Brave or Opera, or as a temporary add-on in Firefox. The
            README walks through both.
          </Typography>
          <ProjectLinks
            liveUrl={SAMPLE_TRAIL_URL}
            liveLabel="Open Interactive Demo"
            sourceUrl={repos.wikiTrail}
            sourceLabel="View on GitHub"
            gradient={accent}
            gradientHover={accentHover}
            contrastText="#141833"
          />
        </Container>
      </Box>

      <SiteFooter note="Built with vanilla JavaScript, D3 v7, and the Manifest V3 extension APIs." />
    </Box>
  );
};

export default WikiTrailLanding;
