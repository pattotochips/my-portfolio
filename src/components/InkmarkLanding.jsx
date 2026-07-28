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
  BorderColor as HighlightIcon,
  Anchor as AnchorIcon,
  StickyNote2 as NoteIcon,
  Dashboard as DashboardIcon,
  Download as ExportIcon,
  Lock as PrivacyIcon,
  ArrowBack as BackIcon,
  Extension as ExtensionIcon,
} from '@mui/icons-material';
import CaseStudy from './CaseStudy';
import ProjectLinks from './ProjectLinks';
import SiteFooter from './SiteFooter';
import { caseStudies } from '../data/caseStudies';
import { repos } from '../data/profile';
import { glassCard, gradientText as makeGradientText, pageBackground, text, focusRing } from '../styles/shared';

const accent = 'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)';
const accentHover = 'linear-gradient(135deg, #FDA085 0%, #F6D365 100%)';
const gradientText = makeGradientText(accent);

const highlightColors = [
  { name: 'Yellow', hex: '#ffe066' },
  { name: 'Green', hex: '#8ce99a' },
  { name: 'Pink', hex: '#faa2c1' },
  { name: 'Blue', hex: '#74c0fc' },
];

const features = [
  {
    icon: <HighlightIcon />,
    title: 'Four Colours, One Tap',
    description:
      'Select text and pick a colour from the tooltip. A closed set keeps it to a single tap — a colour picker would be more flexible and slower every single time.',
    gradient: 'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
  },
  {
    icon: <AnchorIcon />,
    title: 'Highlights That Come Back',
    description:
      'XPath anchored to the nearest element with a stable id, so an injected banner elsewhere on the page does not invalidate the path to your highlight.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <NoteIcon />,
    title: 'Inline Notes',
    description:
      'Attach a short note to any highlight, shown on hover. Notes are searchable from the dashboard alongside the highlighted text.',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6C5CE7 100%)',
  },
  {
    icon: <DashboardIcon />,
    title: 'Dashboard',
    description:
      'Every highlight grouped by site, searchable across text, notes and site name, with delete. The store is simple enough that the dashboard is a plain read of it.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    icon: <ExportIcon />,
    title: 'JSON Export',
    description:
      'Download everything as a single inkmark-export.json. Your highlights are yours and there is a door out.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <PrivacyIcon />,
    title: 'Zero Dependencies',
    description:
      'Ships as raw files — no bundler, nothing to audit, nothing to keep updated. For an extension that can read every page you visit, that is a security property.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
];

const techStack = [
  { label: 'Manifest V3', color: '#4285f4' },
  { label: 'Vanilla JS', color: '#f7df1e' },
  { label: 'XPath', color: '#F6D365' },
  { label: 'chrome.storage.local', color: '#FDA085' },
  { label: 'Zero dependencies', color: '#8ce99a' },
];

const InkmarkLanding = () => {
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
              boxShadow: '0 12px 40px rgba(246, 211, 101, 0.35)',
            }}
          >
            <HighlightIcon sx={{ fontSize: 44, color: '#3b2a12' }} />
          </Box>

          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              ...gradientText,
              fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.4rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Inkmark
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: text.muted,
              maxWidth: 620,
              mx: 'auto',
              mb: 3,
              fontWeight: 300,
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
              lineHeight: 1.65,
            }}
          >
            Highlight text on any page in four colours, add notes, and find your highlights still
            there next time. The hard part is not drawing the highlight — it is finding the same text
            again after the page has been rebuilt.
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 4 }}>
            {highlightColors.map((c) => (
              <Box
                key={c.name}
                title={c.name}
                sx={{
                  width: 34,
                  height: 20,
                  borderRadius: 1,
                  background: c.hex,
                  border: '1px solid rgba(0,0,0,0.25)',
                }}
              />
            ))}
          </Stack>

          <Stack alignItems="center" spacing={3}>
            <Chip
              icon={<ExtensionIcon />}
              label="Browser extension · Manifest V3 · 0 dependencies"
              sx={{
                fontWeight: 700,
                background: 'rgba(246, 211, 101, 0.16)',
                border: '1px solid rgba(253, 160, 133, 0.5)',
                color: '#f8d9a0',
                '& .MuiChip-icon': { color: '#f8d9a0' },
              }}
            />
            <ProjectLinks
              sourceUrl={repos.inkmark}
              sourceLabel="View Source"
              gradient={accent}
              gradientHover={accentHover}
              contrastText="#3b2a12"
              note="Install with Load Unpacked in Chrome, Edge or Brave, or as a temporary add-on in Firefox. Safari needs the Xcode converter."
            />
          </Stack>
        </Container>
      </Box>

      {/* THE ANCHORING PROBLEM */}
      <Box component="section" aria-labelledby="anchor-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Typography
            id="anchor-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            The anchoring problem
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}
          >
            A highlight has to survive the page being regenerated. Naive approaches break
            immediately — this is the fix.
          </Typography>
          <Card elevation={0} sx={{ ...glassCard, '&:hover': { transform: 'none' } }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: { xs: '0.72rem', md: '0.83rem' },
                  color: '#f8e3b8',
                  background: 'rgba(0,0,0,0.42)',
                  border: '1px solid rgba(246,211,101,0.22)',
                  borderRadius: 2,
                  p: 2.5,
                  m: 0,
                  overflowX: 'auto',
                  lineHeight: 1.8,
                }}
              >
{`✗  /html/body/div[3]/div[2]/p[7]
   Positional from the root — a banner injected above
   shifts every index and the highlight is lost.

✓  //*[@id="mw-content-text"]/div[1]/p[7]
   Anchored at the nearest stable unique id. Nodes added
   elsewhere in the document cannot invalidate it.`}
              </Typography>
              <Typography variant="body2" sx={{ color: text.muted, mt: 2.5, lineHeight: 1.8 }}>
                <Box component="code" sx={{ color: '#f8d9a0' }}>getXPath</Box> walks up from the
                target and stops at the first element with a unique id, rather than continuing to the
                document root. Storage is keyed by origin plus pathname — query strings excluded, so
                tracking parameters do not fragment one article into several entries. If a path
                stops resolving, lookup returns null rather than throwing, so a restructured page
                loses one highlight instead of breaking the extension on every load.
              </Typography>
            </CardContent>
          </Card>
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
            sx={{ ...gradientText, mb: 6, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            What it does
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

      {/* CASE STUDY */}
      <CaseStudy study={caseStudies.inkmark} gradient={accent} />

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
            Small enough to read end to end — the anchoring logic lives in{' '}
            <Box component="code" sx={{ color: '#f8d9a0' }}>utils.js</Box>.
          </Typography>
          <ProjectLinks
            sourceUrl={repos.inkmark}
            sourceLabel="View on GitHub"
            gradient={accent}
            gradientHover={accentHover}
            contrastText="#3b2a12"
          />
        </Container>
      </Box>

      <SiteFooter note="Built with vanilla JavaScript and the Manifest V3 extension APIs. Zero dependencies." />
    </Box>
  );
};

export default InkmarkLanding;
