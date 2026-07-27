import { Box, Typography, Stack } from '@mui/material';
import { ImageOutlined as ImageIcon } from '@mui/icons-material';
import { text } from '../styles/shared';

const mediaBase = import.meta.env.BASE_URL + 'media/';

/**
 * A slot for a screenshot or GIF that has not been captured yet.
 *
 * Pass `file` (a filename inside public/media/) and the slot renders the real
 * asset once that file exists. Until then it draws a labelled dashed frame at
 * the right aspect ratio, so layout is already correct and dropping the file in
 * is the only remaining step.
 *
 * `ready` is the switch: flip it to true (or just add the file and set it) to go
 * live. It is explicit rather than inferred because a missing image would
 * otherwise render as a broken-image icon in production.
 */
const MediaSlot = ({
  file,
  caption,
  alt,
  ready = false,
  aspect = '16 / 9',
  gradient,
  maxWidth = 900,
}) => (
  <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
    <Box
      sx={{
        width: '100%',
        maxWidth,
        aspectRatio: aspect,
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.04)',
        border: ready ? '1px solid rgba(255,255,255,0.14)' : '2px dashed rgba(255,255,255,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {ready ? (
        <Box
          component="img"
          src={`${mediaBase}${file}`}
          alt={alt || caption || ''}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Stack spacing={1.25} alignItems="center" sx={{ p: 3, textAlign: 'center' }}>
          <Box
            aria-hidden="true"
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              background: gradient || 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': { color: 'white', fontSize: 26 },
            }}
          >
            <ImageIcon />
          </Box>
          <Typography variant="body2" sx={{ color: text.secondary, fontWeight: 600 }}>
            {caption || 'Screenshot pending'}
          </Typography>
          <Typography
            component="code"
            sx={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '0.78rem',
              color: text.faint,
              background: 'rgba(0,0,0,0.35)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 1.5,
              px: 1.25,
              py: 0.5,
            }}
          >
            public/media/{file}
          </Typography>
        </Stack>
      )}
    </Box>

    {ready && caption && (
      <Typography variant="caption" sx={{ color: text.faint, textAlign: 'center' }}>
        {caption}
      </Typography>
    )}
  </Stack>
);

export default MediaSlot;
