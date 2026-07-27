import { Box, Container, Typography, Stack, IconButton, Divider, Tooltip } from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Description as ResumeIcon,
} from '@mui/icons-material';
import { profile } from '../data/profile';
import { focusRing, text } from '../styles/shared';

const resumeUrl = import.meta.env.BASE_URL + profile.resume;

const contactLinks = [
  { label: 'Email', href: `mailto:${profile.email}`, icon: <EmailIcon />, external: false },
  { label: 'LinkedIn', href: profile.linkedin, icon: <LinkedInIcon />, external: true },
  { label: 'GitHub', href: profile.github, icon: <GitHubIcon />, external: true },
  { label: 'Résumé (PDF)', href: resumeUrl, icon: <ResumeIcon />, external: true },
];

const SiteFooter = ({ note }) => (
  <Box component="footer" sx={{ position: 'relative', zIndex: 1, pb: 5, pt: 2 }}>
    <Container maxWidth="lg">
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 4 }} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="body2" sx={{ color: text.secondary, fontWeight: 600 }}>
            {profile.name}
          </Typography>
          <Typography variant="caption" sx={{ color: text.faint }}>
            {profile.role} · {profile.location}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} component="nav" aria-label="Contact links">
          {contactLinks.map((link) => (
            <Tooltip title={link.label} key={link.label}>
              <IconButton
                href={link.href}
                aria-label={link.label}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                sx={{
                  color: text.muted,
                  border: '1px solid rgba(255,255,255,0.14)',
                  '&:hover': { color: text.primary, background: 'rgba(255,255,255,0.08)' },
                  ...focusRing,
                }}
              >
                {link.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Stack>

      {note && (
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ color: text.faint, mt: 4 }}
        >
          {note}
        </Typography>
      )}
    </Container>
  </Box>
);

export default SiteFooter;
