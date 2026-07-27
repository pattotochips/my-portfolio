import { Box, Typography, Stack, Card, CardContent } from '@mui/material';
import { ArrowForward as ArrowIcon, ArrowDownward as DownIcon } from '@mui/icons-material';
import { glassCard, text } from '../styles/shared';

/**
 * Renders a request pipeline as a row of labelled stages.
 *
 * Used instead of a screenshot for the HR Query Engine, where the architecture
 * *is* the thing worth showing and a UI screenshot would say very little. Flows
 * horizontally on desktop and stacks vertically on mobile, with the arrow
 * direction following the axis.
 */
const PipelineDiagram = ({ title, subtitle, stages, gradient }) => (
  <Card elevation={0} sx={{ ...glassCard, '&:hover': { transform: 'none' } }}>
    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
      <Typography variant="subtitle1" component="h4" fontWeight={700} sx={{ color: text.primary, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: text.muted, mb: 3, lineHeight: 1.75 }}>
          {subtitle}
        </Typography>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'stretch' }}
        spacing={0}
        component="ol"
        sx={{ listStyle: 'none', m: 0, p: 0 }}
      >
        {stages.map((stage, i) => (
          <Stack
            key={stage.label}
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            component="li"
            sx={{ flex: 1, minWidth: 0 }}
          >
            <Box
              sx={{
                flex: 1,
                width: '100%',
                minWidth: 0,
                textAlign: 'center',
                px: 1.5,
                py: 2,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.13)',
              }}
            >
              <Typography
                aria-hidden="true"
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  background: gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                  '@media (forced-colors: active)': {
                    WebkitTextFillColor: 'currentcolor',
                    background: 'none',
                  },
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ color: text.primary, lineHeight: 1.4 }}>
                {stage.label}
              </Typography>
              {stage.detail && (
                <Typography variant="caption" display="block" sx={{ color: text.faint, mt: 0.5, lineHeight: 1.5 }}>
                  {stage.detail}
                </Typography>
              )}
            </Box>

            {i < stages.length - 1 && (
              <>
                <ArrowIcon
                  aria-hidden="true"
                  sx={{
                    color: text.faint,
                    fontSize: 20,
                    mx: 0.5,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                  }}
                />
                <DownIcon
                  aria-hidden="true"
                  sx={{
                    color: text.faint,
                    fontSize: 20,
                    my: 0.5,
                    flexShrink: 0,
                    display: { xs: 'block', md: 'none' },
                  }}
                />
              </>
            )}
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default PipelineDiagram;
