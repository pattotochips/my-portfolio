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
  Psychology as SemanticIcon,
  FilterAlt as FilterIcon,
  Storage as VectorIcon,
  Bolt as CacheIcon,
  UploadFile as UploadIcon,
  Api as ApiIcon,
  ArrowBack as BackIcon,
  Hub as ArchIcon,
} from '@mui/icons-material';
import CaseStudy from './CaseStudy';
import ProjectLinks from './ProjectLinks';
import SiteFooter from './SiteFooter';
import PipelineDiagram from './PipelineDiagram';
import { caseStudies } from '../data/caseStudies';
import { repos } from '../data/profile';
import { glassCard, gradientText as makeGradientText, pageBackground, text, focusRing } from '../styles/shared';

const accent = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
const accentHover = 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)';
const gradientText = makeGradientText(accent);

const features = [
  {
    icon: <SemanticIcon />,
    title: 'Hybrid Query Interpretation',
    description:
      'GPT reads the natural-language query and extracts structured filters — department, minimum performance score — as data. The meaning and the constraints then take different paths.',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    icon: <VectorIcon />,
    title: 'Weaviate Vector Search',
    description:
      'Role, skills, and feedback notes are embedded and stored in Weaviate, so "strong system design" matches a record whose feedback says "excellent architectural instincts".',
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
  },
  {
    icon: <FilterIcon />,
    title: 'PostgreSQL as System of Record',
    description:
      'Structured employee data lives in Postgres and hard constraints are applied against it — a numeric threshold is never left to a similarity score to approximate.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: <CacheIcon />,
    title: 'Embedding Cache',
    description:
      'A cache layer in front of the OpenAI calls means identical text is embedded once. Matters most on re-ingestion, where the same dataset gets processed repeatedly.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: <UploadIcon />,
    title: 'CSV Bulk Ingest',
    description:
      'HR data arrives as a spreadsheet export, so upload goes through Multer and csv-parser: parse, write to Postgres, embed, store vectors — one pass.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: <ApiIcon />,
    title: 'Documented REST API',
    description:
      'Upload, search, and health endpoints with curl examples and response shapes in the README, plus Docker Compose for the Weaviate instance.',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
];

const techStack = [
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Node.js', color: '#68a063' },
  { label: 'Express 5', color: '#ffffff' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Weaviate', color: '#38ef7d' },
  { label: 'OpenAI API', color: '#74aa9c' },
  { label: 'Docker Compose', color: '#2496ed' },
  { label: 'React 19', color: '#61dafb' },
];

const searchPipeline = [
  { label: 'User query', detail: 'Natural language' },
  { label: 'Interpret', detail: 'GPT → filters' },
  { label: 'Embed', detail: 'OpenAI + cache' },
  { label: 'Vector search', detail: 'Weaviate' },
  { label: 'Filter', detail: 'PostgreSQL' },
  { label: 'Response', detail: 'Ranked records' },
];

const uploadPipeline = [
  { label: 'CSV upload', detail: 'Multer' },
  { label: 'Parse', detail: 'csv-parser' },
  { label: 'Embed', detail: 'OpenAI' },
  { label: 'Store rows', detail: 'PostgreSQL' },
  { label: 'Store vectors', detail: 'Weaviate' },
];

const HRQueryEngineLanding = () => {
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
              boxShadow: '0 12px 40px rgba(17, 153, 142, 0.35)',
            }}
          >
            <SemanticIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>

          <Typography
            variant="h1"
            fontWeight={800}
            sx={{
              ...gradientText,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            HR Query Engine
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: text.muted,
              maxWidth: 660,
              mx: 'auto',
              mb: 4,
              fontWeight: 300,
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
              lineHeight: 1.65,
            }}
          >
            Hybrid AI employee search. A GPT pass splits a natural-language question into meaning and
            hard constraints, then vector similarity and relational filtering each handle the half
            they are actually good at.
          </Typography>

          <Stack alignItems="center" spacing={3}>
            <Chip
              icon={<ArchIcon />}
              label="Backend-focused · TypeScript + Postgres + Weaviate"
              sx={{
                fontWeight: 700,
                background: 'rgba(17, 153, 142, 0.16)',
                border: '1px solid rgba(56, 239, 125, 0.45)',
                color: '#7ef0a8',
                '& .MuiChip-icon': { color: '#7ef0a8' },
              }}
            />
            <ProjectLinks
              sourceUrl={repos.hrBackend}
              sourceLabel="Backend Source"
              gradient={accent}
              gradientHover={accentHover}
              contrastText="#04231f"
              note="Two repositories: the Express/TypeScript API does the retrieval work, and a thin React client sits on top."
            />
            <Button
              variant="text"
              href={repos.hrFrontend}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: text.secondary,
                '&:hover': { color: text.primary, background: 'rgba(255,255,255,0.06)' },
                ...focusRing,
              }}
            >
              Frontend repository →
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ARCHITECTURE */}
      <Box component="section" aria-labelledby="arch-heading" sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Typography
            id="arch-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Architecture
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ color: text.muted, mb: 5, maxWidth: 620, mx: 'auto', lineHeight: 1.8 }}
          >
            The pipelines are the interesting part of this project, so they are shown directly rather
            than through a screenshot of a search box.
          </Typography>
          <Stack spacing={3}>
            <PipelineDiagram
              title="Search pipeline"
              subtitle="A query is split before it is answered: GPT extracts the structured filters, the remainder is embedded and matched semantically, and the filters are applied against relational data so hard constraints hold."
              stages={searchPipeline}
              gradient={accent}
            />
            <PipelineDiagram
              title="Upload pipeline"
              subtitle="CSV in, rows and vectors out — parsed once, written to both stores in a single pass."
              stages={uploadPipeline}
              gradient={accent}
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
            sx={{ color: text.muted, mb: 6, maxWidth: 560, mx: 'auto' }}
          >
            Retrieval, filtering, and the cost control that makes running it viable.
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

      {/* EXAMPLE QUERY */}
      <Box component="section" aria-labelledby="query-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            id="query-heading"
            variant="h3"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ ...gradientText, mb: 4, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            A query, end to end
          </Typography>
          <Card elevation={0} sx={{ ...glassCard, '&:hover': { transform: 'none' } }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: { xs: '0.74rem', md: '0.86rem' },
                  color: '#a5f3d0',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(56,239,125,0.22)',
                  borderRadius: 2,
                  p: 2.5,
                  m: 0,
                  overflowX: 'auto',
                  lineHeight: 1.7,
                }}
              >
{`POST /api/search
{ "query": "Find backend engineers in engineering with strong design skills" }

  ├─ GPT interpretation  → { department: "Engineering", minPerformance: null }
  ├─ Semantic remainder  → "backend engineer strong design skills"
  ├─ Embedding           → cache hit, no OpenAI call
  ├─ Weaviate            → top-k by cosine similarity
  └─ PostgreSQL filter   → department = 'Engineering'

[ { "name": "John Doe", "role": "Backend Engineer",
    "department": "Engineering", "performance_score": 88,
    "skills": "Node.js, PostgreSQL",
    "feedback_notes": "Strong system design" } ]`}
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: text.faint, mt: 2 }}>
                The phrase &ldquo;strong design skills&rdquo; never appears in the record — it matches on
                meaning, while the department is enforced exactly.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* CASE STUDY */}
      <CaseStudy study={caseStudies['hr-query-engine']} gradient={accent} />

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
            The retrieval logic lives in <Box component="code" sx={{ color: '#a5f3d0' }}>src/ai</Box> —
            query interpretation, embedding service, cache, and the Weaviate client.
          </Typography>
          <ProjectLinks
            sourceUrl={repos.hrBackend}
            sourceLabel="Backend on GitHub"
            gradient={accent}
            gradientHover={accentHover}
            contrastText="#04231f"
          />
        </Container>
      </Box>

      <SiteFooter note="Built with TypeScript, Express, PostgreSQL, Weaviate, and the OpenAI API." />
    </Box>
  );
};

export default HRQueryEngineLanding;
