import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Grid,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  ReceiptLong as ReceiptIcon,
  BeachAccess as BeachIcon,
  Cake as CakeIcon,
  Psychology as SemanticIcon,
  AccountTree as GraphIcon,
  BorderColor as HighlightIcon,
  Person as SilhouetteIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Description as ResumeIcon,
  Verified as TestedIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { profile, skills, experience, education, repos } from '../data/profile';
import SiteFooter from './SiteFooter';
import { glassCard, gradientText, pageBackground, text, focusRing } from '../styles/shared';

const assetBase = import.meta.env.BASE_URL + 'assets/';
const publicBase = import.meta.env.BASE_URL;

const brandGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

const projects = [
  {
    id: 'face-filter',
    title: 'Face Filter App',
    description:
      'Real-time AI face filters over a live camera feed. Three MediaPipe models in one render loop, positional smoothing to kill jitter, snow particles, a hand-gesture game, and a drag-and-drop sequencer so a non-developer can reconfigure the whole thing.',
    image: 'santa-hat.webp',
    tags: ['React 19', 'MediaPipe', 'Canvas API', 'MUI 7'],
    gradient: brandGradient,
    route: '/face-filter',
    repo: repos.faceFilter,
  },
  {
    id: 'expense-splitter',
    title: 'Expense Splitter',
    description:
      'Shared-expense tracker for groups. Firebase Auth for identity, Firestore listeners so balances update across devices without a refresh, and balances derived from the expense list rather than stored as a counter that can drift.',
    icon: <ReceiptIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['React 18', 'Firebase', 'Firestore', 'MUI 6'],
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
    route: '/expense-splitter',
    repo: repos.expenseSplitter,
  },
  {
    id: 'ooo-generator',
    title: 'OOO Generator',
    description:
      'Pixel-art Out of Office generator. Four tones that each restructure the message rather than swapping adjectives, deterministic generation with no model call, and a chiptune loop synthesized at runtime with the Web Audio API.',
    icon: <BeachIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Web Audio API'],
    gradient: 'linear-gradient(135deg, #0077A8 0%, #F5D78E 100%)',
    route: '/ooo-generator',
    repo: repos.oooGenerator,
    tested: 'Jest + RTL',
  },
  {
    id: 'birthday-bot',
    title: 'Birthday Reminder Bot',
    description:
      'Discord bot that takes reminders by chat command and announces them in-channel. Relative and absolute scheduling, timezone-aware dates via date-fns-tz, per-user timer tracking, and an Express health endpoint to survive free-tier hosting.',
    icon: <CakeIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['Node.js', 'discord.js 14', 'Express', 'date-fns-tz'],
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
    route: '/birthday-bot',
    repo: repos.birthdayBot,
  },
  {
    id: 'hr-query-engine',
    title: 'HR Query Engine',
    description:
      'Hybrid AI employee search. GPT splits a natural-language query into meaning and hard constraints; Weaviate handles semantic similarity while PostgreSQL enforces the filters. Embedding cache keeps API cost bounded.',
    icon: <SemanticIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['TypeScript', 'Weaviate', 'PostgreSQL', 'OpenAI'],
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    route: '/hr-query-engine',
    repo: repos.hrBackend,
    badge: 'Backend',
  },
  {
    id: 'wikitrail',
    title: 'WikiTrail',
    description:
      'Browser extension that records your Wikipedia rabbit holes and renders each as an interactive D3 graph. Dwell time sets node size, per-tab sessions, annotations, and three export formats.',
    icon: <GraphIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['Manifest V3', 'D3 v7', 'Vanilla JS', '5 browsers'],
    gradient: 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)',
    route: '/wikitrail',
    repo: repos.wikiTrail,
    badge: 'Extension',
  },
  {
    id: 'inkmark',
    title: 'Inkmark',
    description:
      'Persistent web highlighter in four colours with inline notes. The real problem is re-anchoring a highlight after the page is rebuilt — solved with XPath anchored to the nearest stable id. Zero dependencies.',
    icon: <HighlightIcon sx={{ fontSize: 68, color: '#3b2a12', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))' }} />,
    tags: ['Manifest V3', 'Vanilla JS', 'XPath', '0 deps'],
    gradient: 'linear-gradient(135deg, #F6D365 0%, #FDA085 100%)',
    route: '/inkmark',
    repo: repos.inkmark,
    badge: 'Extension',
  },
  {
    id: 'travis-filter',
    title: 'Travis Filter',
    description:
      'Desktop real-time video filter — silhouette segmentation composited over procedural neon stripes. Morphological mask refinement plus temporal smoothing to stop the outline flickering. Ships as a binary.',
    icon: <SilhouetteIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['Python', 'OpenCV', 'MediaPipe', 'PyInstaller'],
    gradient: 'linear-gradient(135deg, #AC2BFF 0%, #FF2BD1 100%)',
    route: '/travis-filter',
    repo: repos.travisFilter,
    badge: 'Desktop',
  },
];

const heroLinks = [
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: <EmailIcon />,
    variant: 'contained',
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin,
    icon: <LinkedInIcon />,
    variant: 'outlined',
    external: true,
  },
  {
    label: 'GitHub',
    href: profile.github,
    icon: <GitHubIcon />,
    variant: 'outlined',
    external: true,
  },
  {
    label: 'Résumé',
    href: publicBase + profile.resume,
    icon: <ResumeIcon />,
    variant: 'outlined',
    external: true,
  },
];

const SectionTitle = ({ id, children, subtitle }) => (
  <>
    <Typography
      id={id}
      variant="h3"
      component="h2"
      fontWeight={700}
      textAlign="center"
      sx={{ ...gradientText(brandGradient), mb: subtitle ? 1.5 : 5, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
    >
      {children}
    </Typography>
    {subtitle && (
      <Typography
        variant="body1"
        textAlign="center"
        sx={{ color: text.muted, mb: 6, maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}
      >
        {subtitle}
      </Typography>
    )}
  </>
);

const PortfolioHome = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: pageBackground }}>
      {/* ---------------- HERO ---------------- */}
      <Box
        component="header"
        sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 }, textAlign: 'center' }}
      >
        <Container maxWidth="md">
          <Avatar
            src={publicBase + profile.avatar}
            alt={`Portrait of ${profile.name}`}
            sx={{
              width: { xs: 96, md: 120 },
              height: { xs: 96, md: 120 },
              mx: 'auto',
              mb: 3,
              border: '3px solid rgba(255,255,255,0.16)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
            }}
          />
          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              ...gradientText(brandGradient),
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              mb: 1.5,
              letterSpacing: '-0.02em',
            }}
          >
            {profile.name}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: text.primary,
              fontWeight: 600,
              mb: 1.5,
              fontSize: { xs: '1.1rem', md: '1.4rem' },
            }}
          >
            {profile.role}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: text.muted,
              maxWidth: 620,
              mx: 'auto',
              lineHeight: 1.8,
              fontSize: { xs: '0.98rem', md: '1.1rem' },
              mb: 2,
            }}
          >
            {profile.tagline}
          </Typography>
          <Stack
            direction="row"
            spacing={0.75}
            justifyContent="center"
            alignItems="center"
            sx={{ color: text.faint, mb: 4 }}
          >
            <PlaceIcon fontSize="small" aria-hidden="true" />
            <Typography variant="body2">{profile.location}</Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
            {heroLinks.map((link) => (
              <Button
                key={link.label}
                variant={link.variant}
                startIcon={link.icon}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  py: 1.1,
                  px: 2.5,
                  ...(link.variant === 'contained'
                    ? {
                        background: brandGradient,
                        color: '#ffffff',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                        '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' },
                      }
                    : {
                        color: text.primary,
                        borderColor: 'rgba(255,255,255,0.32)',
                        background: 'rgba(255,255,255,0.04)',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.7)',
                          background: 'rgba(255,255,255,0.1)',
                        },
                      }),
                  ...focusRing,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ---------------- PROJECTS ---------------- */}
      <Box component="section" aria-labelledby="projects-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <SectionTitle id="projects-heading" subtitle="Side projects, each with a written case study covering the problem, the approach, and the trade-offs.">
            Projects
          </SectionTitle>
          <Grid container spacing={3} justifyContent="center">
            {projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={project.id}>
                <Card
                  elevation={0}
                  sx={{
                    ...glassCard,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    '&:hover': {
                      ...glassCard['&:hover'],
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                      '& .arrow-icon': { transform: 'translateX(4px)' },
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(project.route)}
                    aria-label={`${project.title} — read the case study`}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      ...focusRing,
                    }}
                  >
                    <Box
                      sx={{
                        height: 160,
                        background: project.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {project.image ? (
                        <Box
                          component="img"
                          src={`${assetBase}${project.image}`}
                          alt=""
                          loading="lazy"
                          width="112"
                          height="140"
                          sx={{
                            height: '70%',
                            width: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
                          }}
                        />
                      ) : (
                        <Box aria-hidden="true" sx={{ display: 'flex' }}>{project.icon}</Box>
                      )}
                    </Box>

                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ mb: 1.5 }}
                      >
                        <Typography variant="h6" component="h3" fontWeight={700} sx={{ color: text.primary }}>
                          {project.title}
                        </Typography>
                        <ArrowIcon
                          className="arrow-icon"
                          aria-hidden="true"
                          sx={{
                            color: text.faint,
                            flexShrink: 0,
                            mt: 0.4,
                            transition: 'transform 0.3s ease',
                            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                          }}
                        />
                      </Stack>

                      {(project.badge || project.tested) && (
                        <Stack direction="row" flexWrap="wrap" gap={0.7} sx={{ mb: 1.5 }}>
                          {project.badge && (
                            <Chip
                              label={project.badge}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '0.03em',
                                background: 'rgba(144, 202, 249, 0.16)',
                                border: '1px solid rgba(144, 202, 249, 0.45)',
                                color: '#bbdefb',
                              }}
                            />
                          )}
                          {project.tested && (
                            <Chip
                              icon={<TestedIcon />}
                              label={`Tested · ${project.tested}`}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                background: 'rgba(67, 233, 123, 0.14)',
                                border: '1px solid rgba(67, 233, 123, 0.45)',
                                color: '#7ef0a8',
                                '& .MuiChip-icon': { color: '#7ef0a8', fontSize: 15 },
                              }}
                            />
                          )}
                        </Stack>
                      )}

                      <Typography
                        variant="body2"
                        sx={{ color: text.muted, lineHeight: 1.75, mb: 2.5, flexGrow: 1 }}
                      >
                        {project.description}
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={0.8}>
                        {project.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.14)',
                              color: text.secondary,
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </CardActionArea>

                  <Box sx={{ px: 3, pb: 2.5, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<GitHubIcon />}
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source on GitHub`}
                      sx={{
                        textTransform: 'none',
                        color: text.muted,
                        fontWeight: 600,
                        '&:hover': { color: text.primary, background: 'rgba(255,255,255,0.06)' },
                        ...focusRing,
                      }}
                    >
                      Source
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ---------------- ABOUT ---------------- */}
      <Box component="section" aria-labelledby="about-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <SectionTitle id="about-heading">About</SectionTitle>
          <Stack spacing={2.5}>
            {profile.about.map((para) => (
              <Typography
                key={para.slice(0, 40)}
                variant="body1"
                sx={{ color: text.muted, lineHeight: 1.9, fontSize: { xs: '0.98rem', md: '1.05rem' } }}
              >
                {para}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ---------------- SKILLS ---------------- */}
      <Box component="section" aria-labelledby="skills-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionTitle id="skills-heading">Skills</SectionTitle>
          <Grid container spacing={3}>
            {skills.map((group) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.category}>
                <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="subtitle1"
                      component="h3"
                      fontWeight={700}
                      sx={{ color: text.primary, mb: 2 }}
                    >
                      {group.category}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.8} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                      {group.items.map((item) => (
                        <Box component="li" key={item} sx={{ display: 'inline-flex' }}>
                          <Chip
                            label={item}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'rgba(255, 255, 255, 0.07)',
                              border: '1px solid rgba(255, 255, 255, 0.14)',
                              color: text.secondary,
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ---------------- EXPERIENCE ---------------- */}
      <Box component="section" aria-labelledby="experience-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <SectionTitle id="experience-heading" subtitle="8+ years across product engineering and large-scale modernization work.">
            Experience
          </SectionTitle>
          <Stack spacing={3} component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {experience.map((job) => (
              <Card component="li" elevation={0} key={`${job.company}-${job.period}`} sx={glassCard}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <WorkIcon aria-hidden="true" sx={{ color: text.faint, fontSize: 18 }} />
                        <Typography variant="h6" component="h3" fontWeight={700} sx={{ color: text.primary }}>
                          {job.company}
                        </Typography>
                        {job.current && (
                          <Chip
                            label="Current"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: 'rgba(67, 233, 123, 0.16)',
                              border: '1px solid rgba(67, 233, 123, 0.45)',
                              color: '#7ef0a8',
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" sx={{ color: text.faint, mt: 0.5 }}>
                        via {job.employer} · {job.location}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: text.secondary, fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      {job.period}
                    </Typography>
                  </Stack>

                  <Stack direction="row" flexWrap="wrap" gap={0.7} sx={{ mb: 2.5 }}>
                    {job.stack.map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: 'rgba(102, 126, 234, 0.14)',
                          border: '1px solid rgba(102, 126, 234, 0.4)',
                          color: '#b3c0ff',
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack spacing={1.4} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                    {job.highlights.map((point) => (
                      <Stack
                        component="li"
                        key={point.slice(0, 40)}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <Box
                          aria-hidden="true"
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: brandGradient,
                            mt: 1.15,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: text.muted, lineHeight: 1.8 }}>
                          {point}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ---------------- EDUCATION ---------------- */}
      <Box component="section" aria-labelledby="education-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <SectionTitle id="education-heading">Education</SectionTitle>
          <Card elevation={0} sx={glassCard}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />} spacing={2.5}>
                {education.map((item) => (
                  <Stack
                    key={item.institution}
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={0.5}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <SchoolIcon aria-hidden="true" sx={{ color: text.faint, fontSize: 18 }} />
                        <Typography variant="subtitle1" component="h3" fontWeight={700} sx={{ color: text.primary }}>
                          {item.institution}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ color: text.muted, mt: 0.5 }}>
                        {item.qualification} · {item.detail}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: text.secondary, fontWeight: 600 }}>
                      {item.year}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* ---------------- CONTACT ---------------- */}
      <Box component="section" aria-labelledby="contact-heading" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <SectionTitle id="contact-heading">Get in touch</SectionTitle>
          <Typography variant="body1" sx={{ color: text.muted, mb: 4, lineHeight: 1.8 }}>
            Open to conversations about full-stack and frontend architecture roles. The fastest way
            to reach me is email.
          </Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              size="large"
              startIcon={<EmailIcon />}
              href={`mailto:${profile.email}`}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.05rem',
                py: 1.5,
                px: 4,
                borderRadius: 3,
                background: brandGradient,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' },
                ...focusRing,
              }}
            >
              {profile.email}
            </Button>
          </Stack>
        </Container>
      </Box>

      <SiteFooter note="Built with React 19, Vite, and MUI 7. Source on GitHub." />
    </Box>
  );
};

export default PortfolioHome;
