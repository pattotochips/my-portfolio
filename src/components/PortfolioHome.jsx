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
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  ReceiptLong as ReceiptIcon,
  BeachAccess as BeachIcon,
} from '@mui/icons-material';

const assetBase = import.meta.env.BASE_URL + 'assets/';

const gradientText = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const projects = [
  {
    id: 'face-filter',
    title: 'Face Filter App',
    description: 'Real-time AI-powered face filters using MediaPipe for 478-landmark detection. Features Santa/tree costumes, snow effects, interactive game mode, and drag-and-drop sequencing.',
    image: 'santa-hat.png',
    tags: ['React 19', 'MediaPipe', 'Canvas API', 'MUI 7'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/face-filter',
  },
  {
    id: 'expense-splitter',
    title: 'Expense Splitter',
    description: 'Full-stack expense splitting app with Firebase auth, real-time Firestore data, group management, automatic balance calculation, and multi-currency support.',
    icon: <ReceiptIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['React 18', 'Firebase', 'Firestore', 'MUI 6'],
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
    route: '/expense-splitter',
  },
  {
    id: 'ooo-generator',
    title: 'OOO Generator',
    description: 'Pixel art-styled Out of Office message generator with 4 tone presets, live preview, copy-to-clipboard, and a procedural 8-bit chiptune music player.',
    icon: <BeachIcon sx={{ fontSize: 72, color: 'white', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }} />,
    tags: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Web Audio API'],
    gradient: 'linear-gradient(135deg, #0077A8 0%, #F5D78E 100%)',
    route: '/ooo-generator',
  },
];

const PortfolioHome = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
    }}>
      {/* Hero */}
      <Box sx={{
        pt: { xs: 10, md: 16 },
        pb: { xs: 6, md: 10 },
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              ...gradientText,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            My Projects
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 300,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            Interactive demos built with modern web technologies.
          </Typography>
        </Container>
      </Box>

      {/* Project Cards */}
      <Box sx={{ pb: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {projects.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                      '& .arrow-icon': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(project.route)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                    {/* Project thumbnail */}
                    <Box sx={{
                      height: 180,
                      background: project.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {project.image ? (
                        <Box
                          component="img"
                          src={`${assetBase}${project.image}`}
                          alt={project.title}
                          sx={{
                            height: '70%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
                          }}
                        />
                      ) : project.icon ? (
                        project.icon
                      ) : null}
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                          {project.title}
                        </Typography>
                        <ArrowIcon
                          className="arrow-icon"
                          sx={{
                            color: 'rgba(255,255,255,0.4)',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, mb: 2.5 }}
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
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PortfolioHome;
