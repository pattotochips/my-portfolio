import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  Divider,
} from '@mui/material';
import {
  HelpOutline as ProblemIcon,
  Architecture as ApproachIcon,
  Balance as TradeoffIcon,
  TrendingUp as NextIcon,
  CheckCircleOutline as TestedIcon,
} from '@mui/icons-material';
import { glassCard, gradientText, text } from '../styles/shared';

const SectionHeading = ({ icon, title, gradient, id }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
    <Box
      aria-hidden="true"
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        '& svg': { color: 'white', fontSize: 22 },
      }}
    >
      {icon}
    </Box>
    <Typography
      id={id}
      variant="h5"
      component="h3"
      fontWeight={700}
      sx={{ color: text.primary, fontSize: { xs: '1.15rem', md: '1.4rem' } }}
    >
      {title}
    </Typography>
  </Stack>
);

/**
 * Uniform case-study section for a project landing page.
 * `study` comes from src/data/caseStudies.js; `gradient` is the project accent.
 */
const CaseStudy = ({ study, gradient }) => {
  if (!study) return null;

  return (
    <Box
      component="section"
      aria-labelledby="case-study-heading"
      sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}
    >
      <Container maxWidth="lg">
        <Typography
          id="case-study-heading"
          variant="h3"
          component="h2"
          fontWeight={700}
          textAlign="center"
          sx={{ ...gradientText(gradient), mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
        >
          Case Study
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ color: text.muted, mb: 6, maxWidth: 640, mx: 'auto', lineHeight: 1.8 }}
        >
          {study.context}
        </Typography>

        <Grid container spacing={3}>
          {/* The problem */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <SectionHeading
                  icon={<ProblemIcon />}
                  title="The problem"
                  gradient={gradient}
                  id="cs-problem"
                />
                <Stack spacing={2}>
                  {study.problem.map((para) => (
                    <Typography
                      key={para.slice(0, 40)}
                      variant="body2"
                      sx={{ color: text.muted, lineHeight: 1.85 }}
                    >
                      {para}
                    </Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Trade-offs */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <SectionHeading
                  icon={<TradeoffIcon />}
                  title="Trade-offs made"
                  gradient={gradient}
                  id="cs-tradeoffs"
                />
                <Stack spacing={2.5} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {study.tradeoffs.map((t) => (
                    <Box component="li" key={t.choice}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ color: text.secondary, mb: 0.5 }}
                      >
                        {t.choice}
                      </Typography>
                      <Typography variant="body2" sx={{ color: text.faint, lineHeight: 1.8 }}>
                        {t.why}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Approach */}
          <Grid size={{ xs: 12 }}>
            <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <SectionHeading
                  icon={<ApproachIcon />}
                  title="How I approached it"
                  gradient={gradient}
                  id="cs-approach"
                />
                <Grid container spacing={3} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {study.approach.map((step, i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={step.title} component="li">
                      <Stack direction="row" spacing={2}>
                        <Typography
                          aria-hidden="true"
                          sx={{
                            ...gradientText(gradient),
                            fontWeight: 800,
                            fontSize: '1.5rem',
                            lineHeight: 1.2,
                            flexShrink: 0,
                            minWidth: 32,
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </Typography>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ color: text.primary, mb: 0.75 }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: text.muted, lineHeight: 1.85 }}
                          >
                            {step.detail}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {study.tested && (
                  <>
                    <Divider sx={{ my: 3.5, borderColor: 'rgba(255,255,255,0.12)' }} />
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Chip
                        icon={<TestedIcon />}
                        label={study.tested.framework}
                        sx={{
                          fontWeight: 700,
                          background: 'rgba(67, 233, 123, 0.14)',
                          border: '1px solid rgba(67, 233, 123, 0.45)',
                          color: '#7ef0a8',
                          '& .MuiChip-icon': { color: '#7ef0a8' },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: text.muted, lineHeight: 1.8 }}>
                        {study.tested.detail}
                      </Typography>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* What I'd do differently */}
          <Grid size={{ xs: 12 }}>
            <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <SectionHeading
                  icon={<NextIcon />}
                  title="What I'd do differently"
                  gradient={gradient}
                  id="cs-next"
                />
                <Stack spacing={1.75} component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                  {study.learnings.map((item) => (
                    <Stack
                      component="li"
                      key={item.slice(0, 40)}
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
                          background: gradient,
                          mt: 1.25,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: text.muted, lineHeight: 1.85 }}>
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CaseStudy;
