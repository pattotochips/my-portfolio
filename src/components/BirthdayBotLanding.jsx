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
  Cake as CakeIcon,
  Alarm as AlarmIcon,
  Public as TimezoneIcon,
  Terminal as CommandIcon,
  Campaign as AnnounceIcon,
  CloudQueue as HostIcon,
  DeleteSweep as CleanupIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import CaseStudy from './CaseStudy';
import ProjectLinks from './ProjectLinks';
import SiteFooter from './SiteFooter';
import MediaSlot from './MediaSlot';
import { caseStudies } from '../data/caseStudies';
import { repos } from '../data/profile';
import { glassCard, gradientText, pageBackground, text, focusRing } from '../styles/shared';

const accent = 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)';
const accentHover = 'linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%)';

const features = [
  {
    icon: <CommandIcon />,
    title: 'Chat-Command Interface',
    description:
      'Prefix commands parsed straight off messageCreate. Adding a reminder is one message in the channel — no web form, no dashboard, no context switch.',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  },
  {
    icon: <AlarmIcon />,
    title: 'Relative & Absolute',
    description:
      '!addreminder takes a delay in minutes for "remind us shortly". !adddaterem takes a YYYY-MM-DD HH:MM for an event on a specific day.',
    gradient: 'linear-gradient(135deg, #FFD93D 0%, #F0A500 100%)',
  },
  {
    icon: <TimezoneIcon />,
    title: 'Timezone-Aware Dates',
    description:
      'date-fns-tz resolves absolute reminders so a date entered by one member does not fire at the wrong hour for everyone else.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <AnnounceIcon />,
    title: 'In-Channel Announcements',
    description:
      'The reminder lands where the conversation already is, pinging the channel when it comes due instead of sitting in a calendar nobody opens.',
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6C5CE7 100%)',
  },
  {
    icon: <CleanupIcon />,
    title: 'Per-User Timer Tracking',
    description:
      'Pending timers are held in a Map keyed by author ID, so reminders can be listed and cancelled by their creator and fired timers get cleaned out.',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    icon: <HostIcon />,
    title: 'Stays Awake on Free Tiers',
    description:
      'A minimal Express endpoint runs alongside the bot so a free-tier host has something to health-check, keeping the process alive between events.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
];

const techStack = [
  { label: 'Node.js', color: '#68a063' },
  { label: 'discord.js 14', color: '#5865F2' },
  { label: 'Express 5', color: '#ffffff' },
  { label: 'date-fns-tz', color: '#FFD93D' },
  { label: 'dotenv', color: '#ecd53f' },
];

const commands = [
  {
    command: '!addreminder 20 Standup in the voice channel',
    description: 'Fires 20 minutes from now.',
  },
  {
    command: "!adddaterem 2026-08-19 00:00 Utsav's Birthday",
    description: 'Fires at that exact date and time, timezone-resolved.',
  },
];

const BirthdayBotLanding = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: pageBackground, overflowX: 'hidden' }}>
      {/* HERO */}
      <Box
        component="header"
        sx={{
          minHeight: { xs: 'auto', md: '85vh' },
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
              boxShadow: '0 12px 40px rgba(255, 107, 107, 0.35)',
            }}
          >
            <CakeIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>

          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              ...gradientText(accent),
              fontSize: { xs: '2.3rem', sm: '3.2rem', md: '4.2rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Birthday Reminder Bot
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: text.muted,
              maxWidth: 620,
              mx: 'auto',
              mb: 5,
              fontWeight: 300,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.35rem' },
              lineHeight: 1.65,
            }}
          >
            A Discord bot that takes reminders by chat command and announces them in the channel
            when they come due. Built because everyone already had a calendar and nobody looked
            at it.
          </Typography>

          <ProjectLinks
            sourceUrl={repos.birthdayBot}
            sourceLabel="View Source"
            gradient={accent}
            gradientHover={accentHover}
            contrastText="#2b1b00"
            note="Self-hosted — it runs against a specific Discord server, so there is no public demo to click. The README covers running your own instance."
          />
        </Container>
      </Box>

      {/* COMMANDS */}
      <Box component="section" aria-labelledby="commands-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            id="commands-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText(accent), mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Commands
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 5, maxWidth: 500, mx: 'auto' }}
          >
            Two commands cover both kinds of reminder.
          </Typography>
          <Stack spacing={2}>
            {commands.map((item) => (
              <Card elevation={0} key={item.command} sx={glassCard}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    component="code"
                    sx={{
                      display: 'block',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: { xs: '0.82rem', md: '0.95rem' },
                      color: '#FFD93D',
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid rgba(255,217,61,0.25)',
                      borderRadius: 2,
                      px: 2,
                      py: 1.25,
                      mb: 1.5,
                      overflowX: 'auto',
                      whiteSpace: 'pre',
                    }}
                  >
                    {item.command}
                  </Typography>
                  <Typography variant="body2" sx={{ color: text.muted }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
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
            sx={{ ...gradientText(accent), mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 6, maxWidth: 520, mx: 'auto' }}
          >
            Small surface area, deliberately. The interesting parts are scheduling and timezones.
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

      {/* SCREENSHOTS */}
      <Box component="section" aria-labelledby="media-heading" sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            id="media-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText(accent), mb: 5, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Screenshots
          </Typography>
          <Stack spacing={3} alignItems="center">
            <MediaSlot
              file="birthday-bot-discord.png"
              caption="Adding a reminder and the bot announcing it in-channel"
              gradient={accent}
            />
          </Stack>
        </Container>
      </Box>

      {/* CASE STUDY */}
      <CaseStudy study={caseStudies['birthday-bot']} gradient={accent} />

      {/* TECH STACK */}
      <Box component="section" aria-labelledby="stack-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            id="stack-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText(accent), mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
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

      {/* FOOTER CTA */}
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
            Roughly 200 lines of Node — command parsing, scheduling, and cleanup.
          </Typography>
          <ProjectLinks
            sourceUrl={repos.birthdayBot}
            sourceLabel="View on GitHub"
            gradient={accent}
            gradientHover={accentHover}
            contrastText="#2b1b00"
          />
        </Container>
      </Box>

      <SiteFooter note="Built with Node.js, discord.js 14, and date-fns-tz." />
    </Box>
  );
};

export default BirthdayBotLanding;
