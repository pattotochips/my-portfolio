/**
 * Styling primitives shared across the home page and every project landing page.
 * Text colours here are chosen to clear WCAG AA against the #0a0e27–#1a1f3a
 * background — the old rgba(255,255,255,0.3) values did not.
 */

export const pageBackground = 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)';

export const text = {
  primary: '#ffffff',
  secondary: 'rgba(255, 255, 255, 0.82)',
  muted: 'rgba(255, 255, 255, 0.68)',
  faint: 'rgba(255, 255, 255, 0.58)',
};

export const glassCard = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 3,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
  },
  // Movement is decoration; honour the OS setting.
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'background 0.01ms',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      transform: 'none',
    },
  },
};

export const gradientText = (gradient) => ({
  background: gradient,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  // Fallback for forced-colors / high-contrast modes, where a clipped
  // gradient renders as invisible text.
  '@media (forced-colors: active)': {
    WebkitTextFillColor: 'currentcolor',
    background: 'none',
  },
});

/** Visible keyboard focus ring that works on top of the glass surfaces. */
export const focusRing = {
  '&:focus-visible': {
    outline: '3px solid #90caf9',
    outlineOffset: '2px',
  },
};
