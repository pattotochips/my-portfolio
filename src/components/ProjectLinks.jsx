import { Button, Stack, Typography } from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  PlayArrow as PlayIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { focusRing, text } from '../styles/shared';

/**
 * Paired "Live demo" / "View source" call to action.
 * `onLive` handles in-app demos; `liveUrl` handles externally hosted ones.
 */
const ProjectLinks = ({
  liveUrl,
  onLive,
  liveLabel = 'Try it Live',
  sourceUrl,
  sourceLabel = 'View Source',
  gradient,
  gradientHover,
  contrastText = '#ffffff',
  note,
  size = 'large',
}) => {
  const liveProps = onLive
    ? { onClick: onLive }
    : { href: liveUrl, target: '_blank', rel: 'noopener noreferrer' };

  return (
    <Stack spacing={2} alignItems="center">
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
        {(liveUrl || onLive) && (
          <Button
            variant="contained"
            size={size}
            startIcon={onLive ? <PlayIcon /> : <OpenInNewIcon />}
            {...liveProps}
            sx={{
              py: 1.8,
              px: 5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: gradient,
              borderRadius: 3,
              color: contrastText,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: gradientHover || gradient,
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '&:hover': { transform: 'none' },
              },
              ...focusRing,
            }}
          >
            {liveLabel}
          </Button>
        )}

        {sourceUrl && (
          <Button
            variant="outlined"
            size={size}
            startIcon={<GitHubIcon />}
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              py: 1.8,
              px: 5,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              color: text.primary,
              borderColor: 'rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.04)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '&:hover': { transform: 'none' },
              },
              ...focusRing,
            }}
          >
            {sourceLabel}
          </Button>
        )}
      </Stack>

      {note && (
        <Typography variant="caption" sx={{ color: text.faint, textAlign: 'center', maxWidth: 460 }}>
          {note}
        </Typography>
      )}
    </Stack>
  );
};

export default ProjectLinks;
