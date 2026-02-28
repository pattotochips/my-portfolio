import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import {
  AcUnit as SnowIcon,
  Face as FaceIcon,
  PlayCircle as PlayIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Games as GamesIcon,
  DragHandle as DragHandleIcon,
  Timer as TimerIcon,
  Loop as LoopIcon,
  Shuffle as ShuffleIcon,
  Nature as TreeIcon,
  AllInclusive as InfiniteIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const MenuSettings = ({ settings, onSettingsChange, onStartVideo }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [uploadedFiles, setUploadedFiles] = useState({
    santaHat: null,
    santaBeard: null,
    elfHat: null,
    adsVideo: null,
    customProp: null,
  });
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [currentPeopleCount, setCurrentPeopleCount] = useState(0);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Available sequence items (filters, ads, games)
  const availableSequenceItems = [
    { id: 'none', name: 'Live Feed (No Filter)', icon: '📹', description: 'Live camera with no filter, snow enabled' },
    { id: 'santa', name: 'Santa Filter', icon: '🎅', description: 'Live feed with Santa hat and beard' },
    { id: 'tree', name: 'Tree Costume', icon: '🎄', description: 'Live feed with Christmas tree outfit' },
    { id: 'custom', name: 'Custom Prop', icon: '🎭', description: 'Live feed with your uploaded prop' },
    { id: 'ad', name: 'Advertisement', icon: '📺', description: 'Play uploaded video ad' },
    { id: 'game', name: 'Game Mode', icon: '🎮', description: 'Interactive hand-raising game' },
  ];

  // Sync localSettings with incoming settings prop
  useEffect(() => {
    // Ensure appSequence exists with defaults
    const settingsWithDefaults = {
      ...settings,
      appSequence: {
        enabled: false,
        frequency: 'loop', // 'once', 'loop', 'random'
        defaultDuration: 10, // Default duration for items without specific duration
        sequence: [], // Array of sequence items with durations
        ...settings.appSequence
      }
    };
    
    setLocalSettings(settingsWithDefaults);

    // Restore uploaded files state from settings
    setUploadedFiles({
      santaHat: settings.santa.hatImage || null,
      santaBeard: settings.santa.beardImage || null,
      elfHat: settings.santa.elfHatImage || null,
      adsVideo: settings.ads.videoFile || null,
      customProp: settings.customProp.imageFile || null,
    });
  }, [settings]);

  // Initialize people count and listen for changes
  useEffect(() => {
    const updateCount = () => {
      const count = parseInt(localStorage.getItem('peopleCount') || '0', 10);
      setCurrentPeopleCount(count);
    };
    
    // Initial load
    updateCount();
    
    // Listen for storage events
    window.addEventListener('storage', updateCount);
    
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  const handleChange = (category, field, value) => {
    const updated = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [field]: value,
      },
    };
    setLocalSettings(updated);
    onSettingsChange(updated);
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      // Show loading for video files
      if (type === 'adsVideo') {
        setIsVideoLoading(true);
      }

      setUploadedFiles({ ...uploadedFiles, [type]: file });

      // Update settings with file
      if (type === 'adsVideo') {
        // Simulate checking if video is valid/loaded
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          handleChange('ads', 'videoFile', file);
          setIsVideoLoading(false);
        };
        video.onerror = () => {
          setIsVideoLoading(false);
          alert('Failed to load video file. Please try another file.');
        };
        video.src = URL.createObjectURL(file);
      } else if (type === 'customProp') {
        handleChange('customProp', 'imageFile', file);
      } else if (type === 'santaHat') {
        handleChange('santa', 'hatImage', file);
      } else if (type === 'elfHat') {
        handleChange('santa', 'elfHatImage', file);
      } else if (type === 'santaBeard') {
        handleChange('santa', 'beardImage', file);
      }
    }
  };

  const handleRemoveFile = (type) => {
    setUploadedFiles({ ...uploadedFiles, [type]: null });

    if (type === 'adsVideo') {
      handleChange('ads', 'videoFile', null);
    } else if (type === 'customProp') {
      handleChange('customProp', 'imageFile', null);
    } else if (type === 'santaHat') {
      handleChange('santa', 'hatImage', null);
    } else if (type === 'elfHat') {
      handleChange('santa', 'elfHatImage', null);
    } else if (type === 'santaBeard') {
      handleChange('santa', 'beardImage', null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id && localSettings.appSequence?.sequence) {
      const sequence = localSettings.appSequence.sequence;
      const oldIndex = sequence.findIndex(item => item.uniqueId === active.id);
      const newIndex = sequence.findIndex(item => item.uniqueId === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSequence = arrayMove(sequence, oldIndex, newIndex);
        handleChange('appSequence', 'sequence', newSequence);
      }
    }
  };

  const addItemToSequence = (itemId) => {
    const currentSequence = localSettings.appSequence?.sequence || [];
    const sequenceItem = availableSequenceItems.find(f => f.id === itemId);
    
    // Determine default duration based on item type
    let defaultDuration = localSettings.appSequence?.defaultDuration || 10;
    if (itemId === 'ad') {
      defaultDuration = localSettings.ads?.duration || 30;
    } else if (itemId === 'game') {
      defaultDuration = 60; // Games typically last longer
    }
    
    const newSequence = [...currentSequence, { 
      ...sequenceItem, 
      duration: defaultDuration,
      uniqueId: `${itemId}_${Date.now()}` // Allow multiple instances
    }];
    
    handleChange('appSequence', 'sequence', newSequence);
  };

  const removeItemFromSequence = (uniqueId) => {
    const newSequence = (localSettings.appSequence?.sequence || []).filter(item => item.uniqueId !== uniqueId);
    handleChange('appSequence', 'sequence', newSequence);
  };

  const updateItemDuration = (uniqueId, duration) => {
    const newSequence = (localSettings.appSequence?.sequence || []).map(item =>
      item.uniqueId === uniqueId ? { ...item, duration } : item
    );
    handleChange('appSequence', 'sequence', newSequence);
  };

  // Sortable Item Component
  const SortableSequenceItem = ({ item, disabled }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.uniqueId, disabled });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    // Get max duration based on item type
    const getMaxDuration = (itemId) => {
      if (itemId === 'ad') return 600; // 10 minutes max for ads
      if (itemId === 'game') return 300; // 5 minutes max for games
      return 120; // 2 minutes max for filters
    };

    return (
      <ListItem
        ref={setNodeRef}
        style={style}
        sx={{
          background: isDragging ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderRadius: 1,
          mb: 0.5,
          border: isDragging ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        }}
      >
        {!disabled && (
          <ListItemIcon {...attributes} {...listeners}>
            <DragHandleIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
          </ListItemIcon>
        )}
        
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{item.icon}</span>
              <Typography variant="body2" fontWeight="500">
                {item.name}
              </Typography>
            </Box>
          }
          secondary={item.description}
        />
        
        {localSettings.appSequence?.frequency !== 'random' && (
          <TextField
            label="Duration (s)"
            type="number"
            value={item.duration || localSettings.appSequence?.defaultDuration || 10}
            onChange={(e) => updateItemDuration(item.uniqueId, parseInt(e.target.value))}
            inputProps={{ min: 5, max: getMaxDuration(item.id) }}
            size="small"
            sx={{ width: 100, mr: 1 }}
          />
        )}
        
        <IconButton
          size="small"
          onClick={() => removeItemFromSequence(item.uniqueId)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItem>
    );
  };



  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      py: 4,
    }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="700"
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Face Filter Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
            Customize your video experience
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Snow Filter Settings */}
          <Card
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mr: 2,
                }}>
                  <SnowIcon sx={{ fontSize: 22, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="600">
                  Snow Effect
                </Typography>
              </Box>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.snow.enabled}
                    onChange={(e) => handleChange('snow', 'enabled', e.target.checked)}
                  />
                }
                label={<Typography fontWeight="500">Enable Snow Effect</Typography>}
              />

              <Box>
                <Typography variant="body2" gutterBottom fontWeight="500">
                  Snowfall Speed: {localSettings.snow.speed}x
                </Typography>
                <Slider
                  value={localSettings.snow.speed}
                  onChange={(e, value) => handleChange('snow', 'speed', value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  valueLabelDisplay="auto"
                  disabled={!localSettings.snow.enabled}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom fontWeight="500">
                  Snow Pile Height: {localSettings.snow.pileHeight}%
                </Typography>
                <Slider
                  value={localSettings.snow.pileHeight}
                  onChange={(e, value) => handleChange('snow', 'pileHeight', value)}
                  min={0}
                  max={30}
                  step={1}
                  valueLabelDisplay="auto"
                  disabled={!localSettings.snow.enabled}
                  size="small"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Santa Filter Settings */}
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                mr: 2,
              }}>
                <FaceIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight="600">
                Santa Filter
              </Typography>
            </Box>

            <Alert
              severity="info"
              sx={{
                mb: 2,
                py: 0.5,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                '& .MuiAlert-icon': { color: '#2196f3' }
              }}
            >
              <Typography variant="caption">Merges with snow filter. Upload custom images or use defaults.</Typography>
            </Alert>

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight="500" gutterBottom>
                  Santa Hat
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    size="small"
                  >
                    Upload Hat
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/jpeg"
                      onChange={(e) => handleFileUpload('santaHat', e)}
                    />
                  </Button>
                  {uploadedFiles.santaHat && (
                    <Chip
                      label={uploadedFiles.santaHat.name}
                      onDelete={() => handleRemoveFile('santaHat')}
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                <Box sx={{
                  mt: 1.5,
                  p: 1.5,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box
                    component="img"
                    src={localSettings.santa.hatImage ? URL.createObjectURL(localSettings.santa.hatImage) : '/assets/santa-hat.png'}
                    alt="Santa Hat Preview"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {localSettings.santa.hatImage ? 'Custom Santa Hat' : 'Default Santa Hat'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="500" gutterBottom>
                  Elf Hat
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    size="small"
                  >
                    Upload Hat
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/jpeg"
                      onChange={(e) => handleFileUpload('elfHat', e)}
                    />
                  </Button>
                  {uploadedFiles.elfHat && (
                    <Chip
                      label={uploadedFiles.elfHat.name}
                      onDelete={() => handleRemoveFile('elfHat')}
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                <Box sx={{
                  mt: 1.5,
                  p: 1.5,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box
                    component="img"
                    src={localSettings.santa.elfHatImage ? URL.createObjectURL(localSettings.santa.elfHatImage) : '/assets/elf-hat.png'}
                    alt="Elf Hat Preview"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {localSettings.santa.elfHatImage ? 'Custom Elf Hat' : 'Default Elf Hat'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="500" gutterBottom>
                  Santa Beard
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    size="small"
                  >
                    Upload Beard
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/jpeg"
                      onChange={(e) => handleFileUpload('santaBeard', e)}
                    />
                  </Button>
                  {uploadedFiles.santaBeard && (
                    <Chip
                      label={uploadedFiles.santaBeard.name}
                      onDelete={() => handleRemoveFile('santaBeard')}
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                <Box sx={{
                  mt: 1.5,
                  p: 1.5,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}>
                  <Box
                    component="img"
                    src={localSettings.santa.beardImage ? URL.createObjectURL(localSettings.santa.beardImage) : '/assets/santa-beard.png'}
                    alt="Santa Beard Preview"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {localSettings.santa.beardImage ? 'Custom Santa Beard' : 'Default Santa Beard'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Ads Settings */}
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                mr: 2,
              }}>
                <PlayIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight="600">
                Advertisement Video
              </Typography>
            </Box>

            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={isVideoLoading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
                    size="small"
                    disabled={isVideoLoading}
                  >
                    {isVideoLoading ? 'Loading...' : 'Select Video'}
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={(e) => handleFileUpload('adsVideo', e)}
                      disabled={isVideoLoading}
                    />
                  </Button>
                  {uploadedFiles.adsVideo && !isVideoLoading && (
                    <Chip
                      label={uploadedFiles.adsVideo.name}
                      onDelete={() => handleRemoveFile('adsVideo')}
                      color="primary"
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Control Mode</InputLabel>
                <Select
                  value={localSettings.ads.controlMode}
                  label="Control Mode"
                  onChange={(e) => handleChange('ads', 'controlMode', e.target.value)}
                >
                  <MenuItem value="duration">Duration (seconds)</MenuItem>
                  <MenuItem value="loop">Loop Count</MenuItem>
                </Select>
              </FormControl>

              {localSettings.ads.controlMode === 'duration' ? (
                <TextField
                  label="Duration (seconds)"
                  type="number"
                  value={localSettings.ads.duration}
                  onChange={(e) => handleChange('ads', 'duration', parseInt(e.target.value))}
                  inputProps={{ min: 10, max: 600 }}
                  fullWidth
                  size="small"
                />
              ) : (
                <TextField
                  label="Loop Count"
                  type="number"
                  value={localSettings.ads.loopCount}
                  onChange={(e) => handleChange('ads', 'loopCount', parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 10 }}
                  fullWidth
                  size="small"
                />
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Custom Prop Filter */}
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                mr: 2,
              }}>
                <FaceIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight="600">
                Custom Prop Filter
              </Typography>
            </Box>

            <Alert
              severity="info"
              sx={{
                mb: 2,
                py: 0.5,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                '& .MuiAlert-icon': { color: '#2196f3' }
              }}
            >
              <Typography variant="caption">Upload a PNG with transparent background</Typography>
            </Alert>

            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    color="secondary"
                    size="small"
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/png"
                      onChange={(e) => handleFileUpload('customProp', e)}
                    />
                  </Button>
                  {uploadedFiles.customProp && (
                    <Chip
                      label={uploadedFiles.customProp.name}
                      onDelete={() => handleRemoveFile('customProp')}
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Apply Filter To</InputLabel>
                <Select
                  value={localSettings.customProp.position}
                  label="Apply Filter To"
                  onChange={(e) => handleChange('customProp', 'position', e.target.value)}
                >
                  <MenuItem value="face">Face</MenuItem>
                  <MenuItem value="nose">Nose</MenuItem>
                  <MenuItem value="head">Head</MenuItem>
                  <MenuItem value="eyes">Eyes</MenuItem>
                  <MenuItem value="mouth">Mouth</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Filter Name"
                value={localSettings.customProp.name}
                onChange={(e) => handleChange('customProp', 'name', e.target.value)}
                fullWidth
                size="small"
                placeholder="My Custom Filter"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* People Counter */}
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                mr: 2,
              }}>
                <FaceIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  People Counter
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Automatically count people staying on screen for 3+ seconds
                </Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: "white" }}>
                  Current Count: <strong>{currentPeopleCount}</strong>
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    localStorage.setItem('peopleCount', '0');
                    setCurrentPeopleCount(0);
                    // Dispatch event for VideoScreen to update
                    const event = new Event('storage');
                    window.dispatchEvent(event);
                  }}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Reset Count
                </Button>
              </Stack>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Use the people icon (👥) in the video toolbar to display the current count for 5 seconds.
                The counter runs automatically in the background while the camera is active.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* App Sequence Control */}
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                mr: 2,
              }}>
                <LoopIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  App Sequence Control
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Orchestrate filters, ads, and games in a custom sequence
                </Typography>
              </Box>
            </Box>

            <Alert
              severity="info"
              sx={{
                mb: 3,
                py: 0.5,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                '& .MuiAlert-icon': { color: '#2196f3' }
              }}
            >
              <Typography variant="caption">
                When disabled, the app follows default behavior: ads → live feed with snow (no filter)
              </Typography>
            </Alert>

            <Stack spacing={3}>
              {/* Enable Sequence Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={localSettings.appSequence?.enabled || false}
                    onChange={(e) => handleChange('appSequence', 'enabled', e.target.checked)}
                  />
                }
                label={<Typography fontWeight="500">Enable Custom Sequence</Typography>}
              />

              {localSettings.appSequence?.enabled && (
                <>
                  {/* Frequency Settings */}
                  <Box>
                    <Typography variant="body2" fontWeight="500" gutterBottom>
                      Sequence Behavior
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={localSettings.appSequence?.frequency || 'loop'}
                        onChange={(e) => handleChange('appSequence', 'frequency', e.target.value)}
                      >
                        <MenuItem value="once">Run Once</MenuItem>
                        <MenuItem value="loop">Loop Continuously</MenuItem>
                        <MenuItem value="random">Random Order (Infinite)</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Default Duration */}
                  <TextField
                    label="Default Duration (seconds)"
                    type="number"
                    value={localSettings.appSequence?.defaultDuration || 10}
                    onChange={(e) => handleChange('appSequence', 'defaultDuration', parseInt(e.target.value))}
                    inputProps={{ min: 5, max: 120 }}
                    size="small"
                    helperText="Default time for sequence items (can be overridden individually)"
                  />

                  {/* Add Items */}
                  <Box>
                    <Typography variant="body2" fontWeight="500" gutterBottom>
                      Add Items to Sequence
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {availableSequenceItems.map(item => {
                        // Hide ad button if no video uploaded
                        if (item.id === 'ad' && !localSettings.ads?.videoFile) {
                          return null;
                        }
                        
                        // Hide custom prop if no image uploaded
                        if (item.id === 'custom' && !localSettings.customProp?.imageFile) {
                          return null;
                        }
                        
                        return (
                          <Button
                            key={item.id}
                            variant="outlined"
                            size="small"
                            startIcon={<span>{item.icon}</span>}
                            onClick={() => addItemToSequence(item.id)}
                            sx={{ textTransform: 'none' }}
                          >
                            {item.name}
                          </Button>
                        );
                      })}
                    </Stack>
                    {!localSettings.ads?.videoFile && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        * Upload a video to enable Advertisement option
                      </Typography>
                    )}
                  </Box>

                  {/* Sequence List */}
                  {localSettings.appSequence?.sequence?.length > 0 && (
                    <Box>
                      <Typography variant="body2" fontWeight="500" gutterBottom>
                        Sequence Order {localSettings.appSequence?.frequency === 'random' ? '(Random Selection)' : '(Drag to Reorder)'}
                      </Typography>
                      
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={localSettings.appSequence?.sequence?.map(item => item.uniqueId) || []}
                          strategy={verticalListSortingStrategy}
                        >
                          <List
                            sx={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: 2,
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              p: 0,
                            }}
                          >
                            {localSettings.appSequence?.sequence?.map((item) => (
                              <SortableSequenceItem
                                key={item.uniqueId}
                                item={item}
                                disabled={localSettings.appSequence?.frequency === 'random'}
                              />
                            )) || []}
                          </List>
                        </SortableContext>
                      </DndContext>
                    </Box>
                  )}

                  {/* Sequence Preview */}
                  {localSettings.appSequence?.sequence?.length > 0 && (
                    <Alert
                      severity="success"
                      sx={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        '& .MuiAlert-icon': { color: '#4caf50' }
                      }}
                    >
                      <Typography variant="caption">
                        <strong>Sequence Preview:</strong> {localSettings.appSequence?.frequency === 'random' 
                          ? `Random selection from ${localSettings.appSequence?.sequence?.length || 0} items`
                          : `${localSettings.appSequence?.sequence?.length || 0} items, ${localSettings.appSequence?.frequency === 'loop' ? 'looping indefinitely' : 'running once'}`
                        }
                      </Typography>
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Game Mode Settings */}
        <Card
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                mr: 2,
              }}>
                <GamesIcon sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight="600">
                Game Mode Settings
              </Typography>
            </Box>

            <Alert
              severity="info"
              sx={{
                mb: 2,
                py: 0.5,
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                '& .MuiAlert-icon': { color: '#2196f3' }
              }}
            >
              <Typography variant="caption">Customize the news ticker that appears when a winner is selected</Typography>
            </Alert>

            <Stack spacing={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Game Start Mode</InputLabel>
                <Select
                  value={localSettings.game.startMode}
                  label="Game Start Mode"
                  onChange={(e) => handleChange('game', 'startMode', e.target.value)}
                >
                  <MenuItem value="automatic">Automatic - Start after joining countdown</MenuItem>
                  <MenuItem value="manual">Manual - Require button press to start</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Joining Wait Time (seconds)"
                type="number"
                value={localSettings.game.joiningWaitTime}
                onChange={(e) => handleChange('game', 'joiningWaitTime', parseInt(e.target.value))}
                inputProps={{ min: 5, max: 60 }}
                fullWidth
                size="small"
                helperText="Time to wait for more players after 2+ players are ready"
              />

              <TextField
                label="Result Display Time (seconds)"
                type="number"
                value={localSettings.game.resultDisplayTime}
                onChange={(e) => handleChange('game', 'resultDisplayTime', parseInt(e.target.value))}
                inputProps={{ min: 10, max: 300 }}
                fullWidth
                size="small"
                helperText="How long to show the winner before resetting"
              />

              <TextField
                label="Winner Announcement Text"
                value={localSettings.game.winnerText}
                onChange={(e) => handleChange('game', 'winnerText', e.target.value)}
                fullWidth
                size="small"
                placeholder="YOU WIN!"
                helperText="Text shown when a player wins"
              />

              <TextField
                label="Scrolling Message"
                value={localSettings.game.tickerText}
                onChange={(e) => handleChange('game', 'tickerText', e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Congratulations, you can now collect your 10% discount offer from the store!"
                helperText="Message that scrolls across the ticker"
              />

              <Box>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Ticker Speed: {localSettings.game.tickerSpeed.toFixed(1)}x
                </Typography>
                <Slider
                  value={localSettings.game.tickerSpeed}
                  onChange={(e, value) => handleChange('game', 'tickerSpeed', value)}
                  min={0.5}
                  max={5}
                  step={0.1}
                  marks={[
                    { value: 0.5, label: '0.5x' },
                    { value: 1.5, label: '1.5x' },
                    { value: 3, label: '3x' },
                    { value: 5, label: '5x' },
                  ]}
                  sx={{
                    color: '#f5576c',
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Start Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onStartVideo('live')}
            sx={{
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              }
            }}
            startIcon={<PlayIcon />}
            disabled={isVideoLoading}
          >
            Start Live Feed
          </Button>
          {localSettings.ads.videoFile && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => onStartVideo('ads')}
              sx={{
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(79, 172, 254, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(79, 172, 254, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
              startIcon={<PlayIcon />}
              disabled={isVideoLoading}
            >
              Start Ads Feed
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
    </Box>
  );
};

export default MenuSettings;
