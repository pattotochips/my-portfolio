import { useRef, useEffect, useState, useCallback } from "react";
import { FaceLandmarker, HandLandmarker, PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Box, AppBar, Toolbar, IconButton, Button, Fab, Slide, ToggleButtonGroup, ToggleButton, Tooltip, Paper, Typography, CircularProgress, Backdrop, Dialog, DialogTitle, DialogContent } from "@mui/material";
import {
  Menu as MenuIcon,
  Videocam as VideocamIcon,
  Movie as MovieIcon,
  AcUnit as SnowIcon,
  Face as FaceIcon,
  FilterNone as FilterNoneIcon,
  CloudUpload as UploadIcon,
  Games as GamesIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

const VideoScreen = ({ settings, onSettingsChange, onBackToMenu, startMode }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [handLandmarker, setHandLandmarker] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(startMode === "live");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [showEpilepsyWarning, setShowEpilepsyWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoUrlRef = useRef(null);
  const [snowflakes, setSnowflakes] = useState([]);
  const snowflakesRef = useRef([]);
  const [snowPileHeight, setSnowPileHeight] = useState(0);
  
  // People counter state
  const [peopleCount, setPeopleCount] = useState(0);
  const [showCounter, setShowCounter] = useState(false);
  const [counterTimeout, setCounterTimeout] = useState(null);
  const faceTrackingRef = useRef(new Map()); // Track face detection timestamps
  const peopleCountRef = useRef(0);
  
  // App sequence state
  const [sequenceActive, setSequenceActive] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [sequenceTimer, setSequenceTimer] = useState(null);
  const sequenceTimeoutRef = useRef(null);
  const santaHatImageRef = useRef(null);
  const santaBeardImageRef = useRef(null);
  const santaOutfitImageRef = useRef(null);
  const elfHatImageRef = useRef(null);
  const santaSledgeImageRef = useRef(null);
  const customPropImageRef = useRef(null);
  const snowImageRef = useRef(null);
  const snowPileImageRef = useRef(null);
  const treeOutfitImageRef = useRef(null);
  const gameArrowImageRef = useRef(null);
  const [useElfHat, setUseElfHat] = useState(false);
  const [showSantaSledge, setShowSantaSledge] = useState(true);
  const sledgePositionRef = useRef(130); // Start from right side
  const [isGameMode, setIsGameMode] = useState(false);
  const [gameState, setGameState] = useState("waiting");
  const [countdown, setCountdown] = useState(5);
  const [joinCountdown, setJoinCountdown] = useState(20);
  const [raisedHandPlayers, setRaisedHandPlayers] = useState([]);
  const [arrowPosition, setArrowPosition] = useState(null);
  const [smoothArrowPosition, setSmoothArrowPosition] = useState(null);
  const [winner, setWinner] = useState(null);
  const [confetti, setConfetti] = useState([]);
  const [currentLoopCount, setCurrentLoopCount] = useState(0);
  const [tickerPosition, setTickerPosition] = useState(100);
  const currentLoopCountRef = useRef(0);
  const [videoStartTime, setVideoStartTime] = useState(null);
  const videoTimerRef = useRef(null);
  const [canStartGame, setCanStartGame] = useState(false);
  const webglCanvasRef = useRef(null);
  const glContextRef = useRef(null);
  const webglProgramRef = useRef(null);
  const landmarkHistoryRef = useRef([]);
  const [smoothedLandmarks, setSmoothedLandmarks] = useState(null);

  // Use settings directly instead of state to ensure they stay in sync
  const videoDuration = settings.ads.duration;
  const videoLoopCount = settings.ads.loopCount;
  const videoControlMode = settings.ads.controlMode;

  // Smooth face landmarks to reduce jitter
  const smoothLandmarks = (newLandmarks) => {
    if (!newLandmarks || newLandmarks.length === 0) return null;

    const history = landmarkHistoryRef.current;
    const maxHistory = 5; // Keep last 5 frames for smoothing
    const smoothingFactor = 0.7; // Higher = more smoothing, lower = more responsive

    // Add new landmarks to history
    history.push(newLandmarks[0]); // Use first face detected
    if (history.length > maxHistory) {
      history.shift(); // Remove oldest
    }

    // If we don't have enough history, return current landmarks
    if (history.length < 2) {
      return newLandmarks[0];
    }

    // Calculate weighted average of recent landmark positions
    const smoothed = newLandmarks[0].map((landmark, index) => {
      let totalX = 0, totalY = 0, totalZ = 0;
      let totalWeight = 0;

      history.forEach((frame, frameIndex) => {
        const weight = Math.pow(smoothingFactor, history.length - frameIndex - 1);
        if (frame[index]) {
          totalX += frame[index].x * weight;
          totalY += frame[index].y * weight;
          totalZ += frame[index].z * weight;
          totalWeight += weight;
        }
      });

      return {
        x: totalX / totalWeight,
        y: totalY / totalWeight,
        z: totalZ / totalWeight
      };
    });

    return smoothed;
  };

  // Initialize MediaPipe Face Landmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 5,
        });

        setFaceLandmarker(landmarker);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing face landmarker:", err);
        setError("Failed to load face detection model");
        setIsLoading(false);
      }
    };

    initializeFaceLandmarker();
  }, []);

  // Initialize MediaPipe Hand Landmarker
  useEffect(() => {
    const initializeHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 10,
        });

        setHandLandmarker(landmarker);
      } catch (err) {
        console.error("Error initializing hand landmarker:", err);
      }
    };

    initializeHandLandmarker();
  }, []);

  // Initialize MediaPipe Pose Landmarker
  useEffect(() => {
    const initializePoseLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 2,
        });

        setPoseLandmarker(landmarker);
      } catch (err) {
        console.error("Error initializing pose landmarker:", err);
      }
    };

    initializePoseLandmarker();
  }, []);

  // Initialize sequence when settings change
  useEffect(() => {
    console.log('Sequence settings changed:', settings.appSequence);
    if (settings.appSequence?.enabled && settings.appSequence?.sequence?.length > 0) {
      console.log('Starting sequence with items:', settings.appSequence.sequence);
      setSequenceActive(true);
      setCurrentSequenceIndex(0);
      startSequenceItem(0);
    } else {
      console.log('Sequence disabled or no items');
      setSequenceActive(false);
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current);
      }
    }
  }, [settings.appSequence?.enabled, settings.appSequence?.sequence]);

  const startSequenceItem = (index) => {
    const sequence = settings.appSequence?.sequence;
    if (!sequence || index >= sequence.length) {
      // End of sequence - handle frequency
      if (settings.appSequence?.frequency === 'loop') {
        setCurrentSequenceIndex(0);
        startSequenceItem(0);
      } else if (settings.appSequence?.frequency === 'random') {
        const randomIndex = Math.floor(Math.random() * sequence.length);
        setCurrentSequenceIndex(randomIndex);
        startSequenceItem(randomIndex);
      } else {
        // 'once' - stop sequence
        setSequenceActive(false);
      }
      return;
    }

    const item = sequence[index];
    const duration = item.duration || settings.appSequence?.defaultDuration || 10;

    // Execute the sequence item
    executeSequenceItem(item);

    // Set timeout for next item
    sequenceTimeoutRef.current = setTimeout(() => {
      const nextIndex = index + 1;
      setCurrentSequenceIndex(nextIndex);
      startSequenceItem(nextIndex);
    }, duration * 1000);
  };

  const executeSequenceItem = (item) => {
    console.log('Executing sequence item:', item);
    
    switch (item.id) {
      case 'none':
        setSelectedFilter('none');
        break;
      case 'santa':
        setSelectedFilter('santa');
        break;
      case 'tree':
        setSelectedFilter('tree');
        break;
      case 'custom':
        setSelectedFilter('custom');
        break;
      case 'ad':
        // TODO: Play advertisement video
        console.log('Playing advertisement');
        break;
      case 'game':
        // TODO: Start game mode
        setIsGameMode(true);
        break;
      default:
        console.log('Unknown sequence item:', item.id);
    }
  };

  // Initialize people count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem('peopleCount');
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      setPeopleCount(count);
      peopleCountRef.current = count;
    }
    
    // Listen for localStorage changes from settings page
    const handleStorageChange = (e) => {
      if (e.key === 'peopleCount' || e.type === 'storage') {
        const newCount = parseInt(localStorage.getItem('peopleCount') || '0', 10);
        setPeopleCount(newCount);
        peopleCountRef.current = newCount;
        faceTrackingRef.current.clear();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize snowflakes based on settings
  useEffect(() => {
    if (settings.snow.enabled) {
      const initialSnowflakes = [];
      for (let i = 0; i < 50; i++) {
        initialSnowflakes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 2, // Keep for backward compatibility
          scale: Math.random() * 0.8 + 0.3, // Random scale between 0.3 and 1.1 for image sizing
          speed: Math.random() * settings.snow.speed + 0.5,
          drift: Math.random() * 0.5 - 0.25,
        });
      }
      setSnowflakes(initialSnowflakes);
      snowflakesRef.current = [...initialSnowflakes];
    } else {
      setSnowflakes([]);
      snowflakesRef.current = [];
    }
  }, [settings.snow.enabled, settings.snow.speed]);

  // Load Santa/Elf images and assets
  useEffect(() => {
    // Load custom or default Santa hat
    if (settings.santa.hatImage) {
      const hatImg = new Image();
      hatImg.src = URL.createObjectURL(settings.santa.hatImage);
      hatImg.onload = () => {
        santaHatImageRef.current = hatImg;
      };
      hatImg.onerror = () => {
        console.error("Failed to load custom Santa hat image");
        santaHatImageRef.current = null;
      };
    } else {
      const hatImg = new Image();
      hatImg.src = "/assets/santa-hat.png";
      hatImg.onload = () => {
        santaHatImageRef.current = hatImg;
      };
      hatImg.onerror = () => {
        santaHatImageRef.current = null;
      };
    }

    // Load custom or default Elf hat
    if (settings.santa.elfHatImage) {
      const elfHatImg = new Image();
      elfHatImg.src = URL.createObjectURL(settings.santa.elfHatImage);
      elfHatImg.onload = () => {
        elfHatImageRef.current = elfHatImg;
      };
      elfHatImg.onerror = () => {
        console.error("Failed to load custom Elf hat image");
        elfHatImageRef.current = null;
      };
    } else {
      const elfHatImg = new Image();
      elfHatImg.src = "/assets/elf-hat.png";
      elfHatImg.onload = () => {
        elfHatImageRef.current = elfHatImg;
      };
      elfHatImg.onerror = () => {
        elfHatImageRef.current = null;
      };
    }

    // Load custom or default Santa beard
    if (settings.santa.beardImage) {
      const beardImg = new Image();
      beardImg.src = URL.createObjectURL(settings.santa.beardImage);
      beardImg.onload = () => {
        santaBeardImageRef.current = beardImg;
      };
      beardImg.onerror = () => {
        console.error("Failed to load custom Santa beard image");
        santaBeardImageRef.current = null;
      };
    } else {
      const beardImg = new Image();
      beardImg.src = "/assets/santa-beard.png";
      beardImg.onload = () => {
        santaBeardImageRef.current = beardImg;
      };
      beardImg.onerror = () => {
        santaBeardImageRef.current = null;
      };
    }

    // Load Santa outfit
    const outfitImg = new Image();
    outfitImg.src = "/assets/santa-outfit.png";
    outfitImg.onload = () => {
      santaOutfitImageRef.current = outfitImg;
    };
    outfitImg.onerror = () => {
      santaOutfitImageRef.current = null;
    };

    // Load Santa sledge
    const sledgeImg = new Image();
    sledgeImg.src = "/assets/santa-sledge.png";
    sledgeImg.onload = () => {
      santaSledgeImageRef.current = sledgeImg;
    };
    sledgeImg.onerror = () => {
      santaSledgeImageRef.current = null;
    };

    // Load snow image
    const snowImg = new Image();
    snowImg.src = "/assets/snow.png";
    snowImg.onload = () => {
      snowImageRef.current = snowImg;
    };
    snowImg.onerror = () => {
      console.error("Failed to load snow image");
      snowImageRef.current = null;
    };

    // Load snow pile image
    const snowPileImg = new Image();
    snowPileImg.src = "/assets/snow-pile.png";
    snowPileImg.onload = () => {
      snowPileImageRef.current = snowPileImg;
    };
    snowPileImg.onerror = () => {
      console.error("Failed to load snow pile image");
      snowPileImageRef.current = null;
    };

    // Load tree outfit image
    const treeOutfitImg = new Image();
    treeOutfitImg.src = "/assets/tree-outfit.png";
    treeOutfitImg.onload = () => {
      treeOutfitImageRef.current = treeOutfitImg;
    };
    treeOutfitImg.onerror = () => {
      console.error("Failed to load tree outfit image");
      treeOutfitImageRef.current = null;
    };

    // Load game arrow image
    const gameArrowImg = new Image();
    gameArrowImg.src = "/assets/game-arrow.png";
    gameArrowImg.onload = () => {
      gameArrowImageRef.current = gameArrowImg;
    };
    gameArrowImg.onerror = () => {
      console.error("Failed to load game arrow image");
      gameArrowImageRef.current = null;
    };

    // Load custom prop if provided
    if (settings.customProp.imageFile) {
      const propImg = new Image();
      propImg.src = URL.createObjectURL(settings.customProp.imageFile);
      propImg.onload = () => {
        customPropImageRef.current = propImg;
      };
      propImg.onerror = () => {
        console.error("Failed to load custom prop image");
        customPropImageRef.current = null;
      };
    } else {
      customPropImageRef.current = null;
    }
  }, [settings]);

  // Initialize WebGL for negative 3 filter
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = document.createElement("canvas");
    webglCanvasRef.current = canvas;
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      console.warn("WebGL not supported, negative 3 filter will not be available");
      return;
    }

    glContextRef.current = gl;

    // Vertex shader - defines the geometry (full screen quad)
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader - processes each pixel for infrared effect
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_image;
      uniform float u_threshold;

      void main() {
        // Sample the texture
        vec4 color = texture2D(u_image, v_texCoord);

        // Calculate luminance (perceived brightness)
        float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));

        // Apply Gaussian-like blur by sampling nearby pixels
        vec2 texelSize = vec2(1.0 / 1280.0, 1.0 / 720.0);
        float blurredLuminance = 0.0;

        // 3x3 blur kernel
        for(float x = -1.0; x <= 1.0; x += 1.0) {
          for(float y = -1.0; y <= 1.0; y += 1.0) {
            vec2 offset = vec2(x, y) * texelSize * 2.0;
            vec4 sample = texture2D(u_image, v_texCoord + offset);
            float sampleLum = dot(sample.rgb, vec3(0.299, 0.587, 0.114));
            blurredLuminance += sampleLum * 0.111; // 1/9 for each sample
          }
        }

        // Create infrared silhouette effect
        // Darker areas (people) become white, brighter areas (background) become black
        float value = blurredLuminance < u_threshold ? 1.0 : 0.0;

        // Output pure black or white
        gl_FragColor = vec4(vec3(value), 1.0);
      }
    `;

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    webglProgramRef.current = program;

    // Set up geometry (full screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), gl.STATIC_DRAW);

    // Set up texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return () => {
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, []);

  // Start camera when in live mode
  useEffect(() => {
    if (isLiveMode && !isLoading) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
        videoUrlRef.current = null;
      }
      if (videoTimerRef.current) {
        clearTimeout(videoTimerRef.current);
        videoTimerRef.current = null;
      }
    };
  }, [isLiveMode, isLoading]);

  // Load ads video if provided in settings and starting in ads mode
  useEffect(() => {
    if (startMode === "ads" && settings.ads.videoFile && !isLoading) {
      setIsLiveMode(false);
      // Wait a bit for the component to mount and face landmarker to load
      setTimeout(() => {
        if (videoRef.current) {
          handleVideoUpload({ target: { files: [settings.ads.videoFile] } });
        }
      }, 200);
    }
  }, [startMode, settings.ads.videoFile, isLoading]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.muted = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectFaces();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please grant camera permissions.");
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && videoRef.current) {
      setIsVideoLoading(true);
      setError(null); // Clear any previous errors

      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }

      const url = URL.createObjectURL(file);
      videoUrlRef.current = url;
      videoRef.current.src = url;
      videoRef.current.muted = false;
      setCurrentLoopCount(0);
      currentLoopCountRef.current = 0;
      setVideoStartTime(Date.now());

      if (videoControlMode === "duration") {
        videoRef.current.loop = false;
        videoRef.current.onloadedmetadata = () => {
          setIsVideoLoading(false);
          setError(null); // Clear error on successful load
          videoRef.current.play();
          detectFaces();
          startVideoTimer();
        };
        videoRef.current.onerror = () => {
          setIsVideoLoading(false);
          setError("Failed to load video file");
        };
        videoRef.current.onended = () => {
          switchToLiveMode();
        };
      } else {
        videoRef.current.loop = false;
        videoRef.current.onloadedmetadata = () => {
          setIsVideoLoading(false);
          setError(null); // Clear error on successful load
          videoRef.current.play();
          detectFaces();
        };
        videoRef.current.onerror = () => {
          setIsVideoLoading(false);
          setError("Failed to load video file");
        };
        videoRef.current.onended = () => {
          currentLoopCountRef.current += 1;
          const newLoopCount = currentLoopCountRef.current;
          setCurrentLoopCount(newLoopCount);

          if (newLoopCount < videoLoopCount) {
            // Reset to beginning and play again
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch((err) => {
              console.error("Error replaying video:", err);
              setError("Failed to replay video");
            });
          } else {
            switchToLiveMode();
          }
        };
      }
    }
  };

  const startVideoTimer = () => {
    if (videoTimerRef.current) {
      clearTimeout(videoTimerRef.current);
    }

    videoTimerRef.current = setTimeout(() => {
      switchToLiveMode();
    }, videoDuration * 1000);
  };

  const switchToLiveMode = () => {
    if (videoTimerRef.current) {
      clearTimeout(videoTimerRef.current);
      videoTimerRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      // Clear all event handlers before clearing src to avoid spurious errors
      videoRef.current.onended = null;
      videoRef.current.onerror = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.src = "";
    }

    // Reset to default state: snow on, Santa off, no game mode
    setSelectedFilter("none");
    setIsGameMode(false);

    // Enable snow and reset settings
    const resetSettings = {
      ...settings,
      snow: {
        ...settings.snow,
        enabled: true,
      },
    };
    onSettingsChange(resetSettings);

    // Clear any error state when switching to live mode
    setError(null);
    setIsLiveMode(true);
    setCurrentLoopCount(0);
    currentLoopCountRef.current = 0;
    setVideoStartTime(null);
  };

  const isHandRaised = (handLandmarks) => {
    const wrist = handLandmarks[0];
    const indexTip = handLandmarks[8];
    return wrist && indexTip && indexTip.y < wrist.y - 0.1;
  };

  const NUM_LINES = 120;

  let stripes = Array.from({ length: NUM_LINES }, () => ({
    pos: Math.random() * 2000, // y for horizontal, x for vertical
    thickness: 10 + Math.random() * 40,
    baseThickness: 10,
    pulseOffset: Math.random() * Math.PI * 2,
    colorIndex: Math.floor(Math.random() * 7),
  }));

  const lineColors = [
    "#ff004c", // hot pink
    "#ff7b00", // orange
    "#ffee00", // yellow
    "#00ff57", // neon green
    "#00c8ff", // cyan
    "#0077ff", // blue
    "#7b00ff", // purple
    "#ff00d4", // magenta
  ];

  // const lineColors = [
  //   "#662445",
  //   "#7a4f24",
  //   "#7a7724",
  //   "#1f662f",
  //   "#1f5b66",
  //   "#243e7a",
  //   "#4b247a",
  //   "#662469"
  // ];

  let horizontalPhase = true; // start with horizontal lines
  let lastSwitch = Date.now();
  const PHASE_DURATION = 10000; // 10 seconds

  // GLOBAL OFFSETS (movement)
  let verticalOffset = 0;
  let horizontalOffset = 0;

  const drawLineBackground = (ctx, width, height) => {
    const now = Date.now();

    // Switch between horizontal and vertical phases every 10 seconds
    if (now - lastSwitch > PHASE_DURATION) {
      horizontalPhase = !horizontalPhase;
      lastSwitch = now;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // Time for slow breathing animation
    const t = now * 0.0005;

    if (horizontalPhase) {
      verticalOffset += 30;
      if (verticalOffset > height) verticalOffset = 0;

      let y = -verticalOffset;
      let i = 0; // index into stripes array

      while (y < height) {
        const s = stripes[i % NUM_LINES];

        s.thickness = s.baseThickness + Math.sin(t + s.pulseOffset) * 6;
        const h = s.thickness;

        const color = lineColors[Math.floor(s.colorIndex)];
        s.colorIndex = (s.colorIndex + 0.015) % lineColors.length;

        ctx.fillStyle = color;
        ctx.fillRect(0, y, width, h);

        y += h;
        i++;
      }
    } else {
      horizontalOffset += 30;
      if (horizontalOffset > width) horizontalOffset = 0;

      let x = -horizontalOffset;
      let i = 0;

      while (x < width) {
        const s = stripes[i % NUM_LINES];

        s.thickness = s.baseThickness + Math.sin(t + s.pulseOffset) * 6;
        const w = s.thickness;

        const color = lineColors[Math.floor(s.colorIndex)];
        s.colorIndex = (s.colorIndex + 0.015) % lineColors.length;

        ctx.fillStyle = color;
        ctx.fillRect(x, 0, w, height);

        x += w;
        i++;
      }
    }
  };

  const SILHOUETTE_TINTS = [
    { r: 255, g: 80, b: 80 }, // red
    { r: 80, g: 255, b: 80 }, // green
    { r: 255, g: 255, b: 80 }, // yellow
    { r: 80, g: 160, b: 255 }, // blue
    { r: 255, g: 80, b: 200 }, // pink
  ];

  const detectFaces = useCallback(() => {
    if (!faceLandmarker || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detect = () => {
      if (video.paused || video.ended) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const startTimeMs = performance.now();
      const results = faceLandmarker.detectForVideo(video, startTimeMs);
      
      // Apply smoothing to face landmarks
      const smoothedFaceLandmarks = results.faceLandmarks && results.faceLandmarks.length > 0 
        ? smoothLandmarks(results.faceLandmarks) 
        : null;

      // Get pose landmarks for body detection (optimized - run every 3rd frame)
      let poseResults = null;
      if (poseLandmarker && selectedFilter === "santa") {
        // Only run pose detection every 3rd frame to improve performance
        if (!window.poseFrameCounter) window.poseFrameCounter = 0;
        if (!window.cachedPoseResults) window.cachedPoseResults = null;
        
        if (window.poseFrameCounter % 3 === 0) {
          window.cachedPoseResults = poseLandmarker.detectForVideo(video, startTimeMs);
        }
        poseResults = window.cachedPoseResults;
        window.poseFrameCounter++;
      }

      const hasFaces = results.faceLandmarks && results.faceLandmarks.length > 0;
      
      // Track people for counter (always runs in background)
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        trackPeopleOnScreen(results.faceLandmarks);
      } else {
        // No faces detected, clear tracking
        faceTrackingRef.current.clear();
      }

      if (isGameMode && handLandmarker) {
        const handResults = handLandmarker.detectForVideo(video, startTimeMs);
        const playersWithRaisedHands = [];

        if (handResults.landmarks && handResults.landmarks.length > 0) {
          handResults.landmarks.forEach((handLandmarks, index) => {
            if (isHandRaised(handLandmarks)) {
              const wrist = handLandmarks[0];
              playersWithRaisedHands.push({
                index,
                x: wrist.x * canvas.width,
                y: wrist.y * canvas.height,
              });
            }
          });
        }

        setRaisedHandPlayers(playersWithRaisedHands);

        if (playersWithRaisedHands.length >= 2 && gameState === "waiting") {
          if (settings.game.startMode === "automatic") {
            setGameState("joining");
            setJoinCountdown(settings.game.joiningWaitTime);
          } else {
            // Manual mode: enable the start button
            setCanStartGame(true);
          }
        } else if (playersWithRaisedHands.length < 2) {
          setCanStartGame(false);
        }
      }

      // Additional filter processing can be added here
      if (false) { // Placeholder for future filters
        const width = canvas.width;
        const height = canvas.height;

        // ---------------------------
        // STEP 1: CREATE SILHOUETTE MASK
        // ---------------------------
        if (!window.silhouetteMaskCanvas) {
          window.silhouetteMaskCanvas = document.createElement('canvas');
        }
        const maskCanvas = window.silhouetteMaskCanvas;
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');

        // CLEAR first
        maskCtx.clearRect(0, 0, width, height);

        // Draw video with heavy blur to create smooth solid mask
        maskCtx.filter = 'blur(12px)';
        maskCtx.drawImage(video, 0, 0, width, height);
        maskCtx.filter = 'none';

        // Get pixel data and create binary alpha mask
        const maskData = maskCtx.getImageData(0, 0, width, height);
        const pixels = maskData.data;
        const threshold = 90;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

          // Create mask: white with varying alpha
          const isSilhouette = luminance < threshold;
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
          pixels[i + 3] = isSilhouette ? 255 : 0;
        }

        maskCtx.putImageData(maskData, 0, 0);

        // Apply ONE more blur to smooth the alpha edges
        maskCtx.globalCompositeOperation = 'source-over';
        maskCtx.filter = 'blur(6px)';
        maskCtx.drawImage(maskCanvas, 0, 0);
        maskCtx.filter = 'none';

        // ---------------------------
        // STEP 2: DRAW TINTED SILHOUETTES (bottom layer)
        // ---------------------------

        // Get tint color
        if (!window.currentTint || Date.now() > window.nextTintChangeTime) {
          window.currentTint = SILHOUETTE_TINTS[Math.floor(Math.random() * SILHOUETTE_TINTS.length)];
          window.nextTintChangeTime = Date.now() + 2000;
        }
        const tint = window.currentTint;

        // Create tinted silhouette in temp canvas
        if (!window.silhouetteCanvas) {
          window.silhouetteCanvas = document.createElement('canvas');
        }
        const silCanvas = window.silhouetteCanvas;
        silCanvas.width = width;
        silCanvas.height = height;
        const silCtx = silCanvas.getContext('2d');

        // CLEAR
        silCtx.clearRect(0, 0, width, height);
        silCtx.globalCompositeOperation = 'source-over';

        // Draw video
        silCtx.drawImage(video, 0, 0, width, height);

        // Apply tint
        silCtx.globalCompositeOperation = 'multiply';
        silCtx.fillStyle = `rgb(${tint.r}, ${tint.g}, ${tint.b})`;
        silCtx.fillRect(0, 0, width, height);

        silCtx.globalCompositeOperation = 'lighter';
        silCtx.fillStyle = `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.5)`;
        silCtx.fillRect(0, 0, width, height);

        // Cut out silhouette shape using mask
        silCtx.globalCompositeOperation = 'destination-in';
        silCtx.drawImage(maskCanvas, 0, 0);

        // Reset and draw tinted silhouettes to main canvas
        silCtx.globalCompositeOperation = 'source-over';
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(silCanvas, 0, 0);

        // ---------------------------
        // STEP 3: DRAW LINES WITH HOLES CUT OUT (top layer)
        // ---------------------------

        // Create lines layer in temp canvas
        if (!window.linesCanvas) {
          window.linesCanvas = document.createElement('canvas');
        }
        const linesCanvas = window.linesCanvas;
        linesCanvas.width = width;
        linesCanvas.height = height;
        const linesCtx = linesCanvas.getContext('2d', { alpha: true });

        // CLEAR
        linesCtx.clearRect(0, 0, width, height);
        linesCtx.globalCompositeOperation = 'source-over';

        // Draw lines background
        drawLineBackground(linesCtx, width, height);

        // CUT OUT holes where silhouettes are - mask alpha determines what's removed
        linesCtx.globalCompositeOperation = 'destination-out';
        linesCtx.drawImage(maskCanvas, 0, 0);

        // Reset and draw lines (with holes) over silhouettes
        linesCtx.globalCompositeOperation = 'source-over';
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(linesCanvas, 0, 0);

        // ---------------------------
        // STEP 4: DRAW WHITE OUTLINES
        // ---------------------------

        // Create outline from mask edge
        if (!window.outlineCanvas) {
          window.outlineCanvas = document.createElement('canvas');
        }
        const outlineCanvas = window.outlineCanvas;
        outlineCanvas.width = width;
        outlineCanvas.height = height;
        const outlineCtx = outlineCanvas.getContext('2d');

        // CLEAR
        outlineCtx.clearRect(0, 0, width, height);
        outlineCtx.globalCompositeOperation = 'source-over';

        // Dilated mask
        outlineCtx.filter = 'blur(3px)';
        outlineCtx.drawImage(maskCanvas, 0, 0);
        outlineCtx.filter = 'none';

        // Remove original to leave edge
        outlineCtx.globalCompositeOperation = 'destination-out';
        outlineCtx.drawImage(maskCanvas, 0, 0);

        // Make edge white
        outlineCtx.globalCompositeOperation = 'source-in';
        outlineCtx.fillStyle = 'white';
        outlineCtx.fillRect(0, 0, width, height);

        // Reset and draw outline
        outlineCtx.globalCompositeOperation = 'source-over';
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(outlineCanvas, 0, 0);
      }

      if (hasFaces && !isGameMode && smoothedFaceLandmarks) {
        // Use smoothed landmarks for stable filter rendering
        const poseLandmarks = poseResults?.landmarks?.[0] || null;
        drawFilter(ctx, smoothedFaceLandmarks, canvas.width, canvas.height, poseLandmarks);
      } else {
        // No faces detected, clear tracking
        faceTrackingRef.current.clear();
      }

      if (!isGameMode && settings.snow.enabled) {
        drawSnowEffect(ctx, canvas.width, canvas.height);
      }

      // Draw Santa sledge if conditions are met
      if (!isGameMode && selectedFilter === "santa" && settings.snow.enabled && showSantaSledge) {
        drawSantaSledge(ctx, canvas.width, canvas.height);
      }

      if (isGameMode) {
        drawGameOverlay(ctx, canvas.width, canvas.height, results.faceLandmarks);
      }

      // Update sledge position for smooth 60fps animation
      updateSledgePosition();

      // Draw people counter if enabled
      if (showCounter) {
        drawPeopleCounter(ctx, canvas.width, canvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, [
    faceLandmarker,
    handLandmarker,
    poseLandmarker,
    selectedFilter,
    snowPileHeight,
    isGameMode,
    gameState,
    raisedHandPlayers,
    confetti,
    settings,
    useElfHat,
    showSantaSledge,
    smoothArrowPosition,
    showCounter,
    peopleCount,
    sequenceActive,
    currentSequenceIndex,
  ]);

  useEffect(() => {
    if (gameState === "joining" && joinCountdown > 0) {
      const timer = setTimeout(() => {
        setJoinCountdown(joinCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "joining" && joinCountdown === 0) {
      // Check if we still have minimum 2 players before proceeding
      if (raisedHandPlayers.length >= 2) {
        setGameState("countdown");
        setCountdown(5);
      } else {
        // Not enough players, return to waiting state
        setGameState("waiting");
        setCanStartGame(false);
      }
    }
  }, [gameState, joinCountdown, raisedHandPlayers.length]);

  useEffect(() => {
    if (gameState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "countdown" && countdown === 0) {
      // Final check before starting the game
      if (raisedHandPlayers.length >= 2) {
        setGameState("animating");
        startArrowAnimation();
      } else {
        // Not enough players, return to waiting state
        setGameState("waiting");
        setCanStartGame(false);
      }
    }
  }, [gameState, countdown, raisedHandPlayers.length]);

  useEffect(() => {
    if (isGameMode) {
      setGameState("waiting");
      setCountdown(5);
      setWinner(null);
      setArrowPosition(null);
      setTickerPosition(100);
      setShowToolbar(false); // Hide toolbar when game mode starts
    } else {
      setShowToolbar(true); // Show toolbar when game mode ends
    }
  }, [isGameMode]);

  // Animate ticker position with high-precision requestAnimationFrame
  useEffect(() => {
    let tickerAnimationFrame;
    
    const animateTicker = () => {
      setTickerPosition((prev) => {
        // Continuously decrease position for smooth scrolling
        const newPos = prev - settings.game.tickerSpeed ; // Smoother, more consistent speed
        // Reset to 100 when it goes below -100 for seamless loop
        if (newPos < -100) {
          return 100;
        }
        return newPos;
      });
      
      if (isGameMode && gameState === "result") {
        tickerAnimationFrame = requestAnimationFrame(animateTicker);
      }
    };

    if (isGameMode && gameState === "result") {
      tickerAnimationFrame = requestAnimationFrame(animateTicker);
    }

    return () => {
      if (tickerAnimationFrame) {
        cancelAnimationFrame(tickerAnimationFrame);
      }
    };
  }, [isGameMode, gameState, settings.game.tickerSpeed]);

  // Smooth arrow position interpolation
  useEffect(() => {
    if (!arrowPosition) {
      setSmoothArrowPosition(null);
      return;
    }

    let arrowAnimationFrame;
    const startPos = smoothArrowPosition || arrowPosition;
    const targetPos = arrowPosition;
    const startTime = performance.now();
    const duration = 150; // 150ms smooth transition

    const animateArrow = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const smoothX = startPos.x + (targetPos.x - startPos.x) * easeOut;
      const smoothY = startPos.y + (targetPos.y - startPos.y) * easeOut;
      
      setSmoothArrowPosition({ x: smoothX, y: smoothY, index: targetPos.index });
      
      if (progress < 1) {
        arrowAnimationFrame = requestAnimationFrame(animateArrow);
      }
    };

    arrowAnimationFrame = requestAnimationFrame(animateArrow);

    return () => {
      if (arrowAnimationFrame) {
        cancelAnimationFrame(arrowAnimationFrame);
      }
    };
  }, [arrowPosition]);

  useEffect(() => {
    if (!isLoading && faceLandmarker && videoRef.current && !videoRef.current.paused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      detectFaces();
    }
  }, [selectedFilter, detectFaces, isLoading, faceLandmarker]);

  const drawFilter = (ctx, landmarks, width, height, poseLandmarks = null) => {
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseTip = landmarks[1];
    const forehead = landmarks[10];
    const chin = landmarks[152];

    const leftEyeX = leftEye.x * width;
    const leftEyeY = leftEye.y * height;
    const rightEyeX = rightEye.x * width;
    const rightEyeY = rightEye.y * height;
    const foreheadX = forehead.x * width;
    const foreheadY = forehead.y * height;
    const noseX = noseTip.x * width;
    const noseY = noseTip.y * height;
    const chinY = chin.y * height;

    const faceHeight = chinY - foreheadY;
    const headX = foreheadX;
    const headY = foreheadY - faceHeight * 0.3;

    const eyeDistance = Math.sqrt(Math.pow(rightEyeX - leftEyeX, 2) + Math.pow(rightEyeY - leftEyeY, 2));
    const angle = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);

    // Calculate better head width using temple landmarks for more accurate hat sizing
    const leftTemple = landmarks[127]; // Left temple area
    const rightTemple = landmarks[356]; // Right temple area
    const headWidth = Math.sqrt(Math.pow((rightTemple.x - leftTemple.x) * width, 2) + Math.pow((rightTemple.y - leftTemple.y) * height, 2));

    ctx.save();

    if (selectedFilter === "santa") {
      // Draw Santa outfit first (behind everything) using pose landmarks if available
      // drawSantaOutfit(ctx, landmarks, width, height, poseLandmarks); // Temporarily disabled
      // Draw hat (Santa or Elf based on toggle)
      if (useElfHat) {
        drawElfHat(ctx, headX, headY, headWidth, angle);
      } else {
        drawSantaHat(ctx, headX, headY, headWidth, angle);
      }
      // Draw beard on top
      drawSantaBeard(ctx, noseX, noseY, chinY, eyeDistance, angle);
    } else if (selectedFilter === "tree") {
      drawTreeOutfit(ctx, landmarks, width, height);
    } else if (selectedFilter === "custom" && customPropImageRef.current) {
      drawCustomProp(ctx, landmarks, width, height, eyeDistance, angle);
    }

    ctx.restore();
  };

  const drawSantaHat = (ctx, x, y, faceWidth, angle) => {
    if (!santaHatImageRef.current) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const img = santaHatImageRef.current;
    const imgWidth = faceWidth * 1.8; // Increased from 1.2 to 1.8 to better match head width
    const imgHeight = (img.height / img.width) * imgWidth;
    const offsetY = -imgHeight * 0.65; // Lowered from 0.85 to 0.65 to sit on head

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, -imgWidth / 2, offsetY, imgWidth, imgHeight);
    ctx.restore();
  };

  const drawSantaBeard = (ctx, noseX, noseY, chinY, faceWidth, angle) => {
    if (!santaBeardImageRef.current) return;

    ctx.save();
    const centerX = noseX;
    const centerY = noseY + (chinY - noseY) * 0.45; // Move beard lower

    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    const img = santaBeardImageRef.current;
    const imgWidth = faceWidth * 1.3;
    const imgHeight = (img.height / img.width) * imgWidth;

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, -imgWidth / 2, -imgHeight * 0.4, imgWidth, imgHeight);
    ctx.restore();
  };

  const drawTreeOutfit = (ctx, landmarks, width, height) => {
    if (!treeOutfitImageRef.current || !landmarks || landmarks.length === 0) return;

    ctx.save();

    // Get face center and dimensions
    const noseTip = landmarks[1]; // Nose tip landmark
    const leftEye = landmarks[33]; // Left eye outer corner
    const rightEye = landmarks[263]; // Right eye outer corner
    const chin = landmarks[152]; // Chin point
    const forehead = landmarks[10]; // Forehead center

    // Calculate face dimensions and position
    const faceWidth = Math.abs((rightEye.x - leftEye.x) * width);
    const faceHeight = Math.abs((chin.y - forehead.y) * height);
    
    // Calculate the center of the entire face (not just nose)
    const faceCenterX = ((leftEye.x + rightEye.x) / 2) * width;
    const faceCenterY = ((forehead.y + chin.y) / 2) * height;

    // Tree outfit should be proportional to the person's size
    const outfitWidth = faceWidth * 8; // Much larger scale so face hole can accommodate full face
    const outfitHeight = (treeOutfitImageRef.current.height / treeOutfitImageRef.current.width) * outfitWidth;
    
    // Position the tree outfit so the face hole aligns with the center of the detected face
    // The face hole should encompass the entire face area
    const faceHoleOffsetX = 0; // Face hole is centered horizontally
    const faceHoleOffsetY = outfitHeight * 0.34; // Face hole is about 34% down from the top of the outfit
    
    const outfitX = faceCenterX - outfitWidth / 2 + faceHoleOffsetX;
    const outfitY = faceCenterY - faceHoleOffsetY; // Position outfit so face hole centers on the entire face

    // Draw the tree outfit
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      treeOutfitImageRef.current,
      outfitX,
      outfitY,
      outfitWidth,
      outfitHeight
    );

    ctx.restore();
  };

  const drawCustomProp = (ctx, landmarks, width, height, faceWidth, angle) => {
    if (!customPropImageRef.current) return;

    const position = settings.customProp.position;
    let x, y;

    // Determine position based on settings
    switch (position) {
      case "nose":
        const nose = landmarks[1];
        x = nose.x * width;
        y = nose.y * height;
        break;
      case "head":
        const forehead = landmarks[10];
        x = forehead.x * width;
        y = forehead.y * height - height * 0.1;
        break;
      case "eyes":
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        x = ((leftEye.x + rightEye.x) / 2) * width;
        y = ((leftEye.y + rightEye.y) / 2) * height;
        break;
      case "mouth":
        const mouth = landmarks[13];
        x = mouth.x * width;
        y = mouth.y * height;
        break;
      default: // face
        const center = landmarks[1];
        x = center.x * width;
        y = center.y * height;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const img = customPropImageRef.current;
    const imgWidth = faceWidth * 1.2;
    const imgHeight = (img.height / img.width) * imgWidth;

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    ctx.restore();
  };

  const drawElfHat = (ctx, x, y, faceWidth, angle) => {
    if (!elfHatImageRef.current) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const img = elfHatImageRef.current;
    const imgWidth = faceWidth * 1.8; // Increased from 1.2 to 1.8 to better match head width
    const imgHeight = (img.height / img.width) * imgWidth;
    const offsetY = -imgHeight * 0.65; // Lowered from 0.85 to 0.65 to sit on head

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, -imgWidth / 2, offsetY, imgWidth, imgHeight);
    ctx.restore();
  };

  const drawSantaOutfit = (ctx, faceLandmarks, width, height, poseLandmarks = null) => {
    if (!santaOutfitImageRef.current) return;

    let centerX, centerY, shoulderDistance;

    if (poseLandmarks && poseLandmarks.length > 11) {
      // Use MediaPipe Pose landmarks for accurate body detection
      // Landmark indices: 11 = left shoulder, 12 = right shoulder, 23 = left hip, 24 = right hip
      const leftShoulder = poseLandmarks[11];
      const rightShoulder = poseLandmarks[12];
      const leftHip = poseLandmarks[23];
      const rightHip = poseLandmarks[24];

      // Calculate center point between shoulders
      centerX = ((leftShoulder.x + rightShoulder.x) / 2) * width;
      const shoulderY = ((leftShoulder.y + rightShoulder.y) / 2) * height;

      // Position outfit slightly below shoulders
      centerY = shoulderY + height * 0.05;

      // Calculate outfit size based on actual shoulder distance
      shoulderDistance = Math.sqrt(Math.pow((rightShoulder.x - leftShoulder.x) * width, 2) + Math.pow((rightShoulder.y - leftShoulder.y) * height, 2));
    } else {
      // Fallback: estimate from face landmarks
      const leftFace = faceLandmarks[234];
      const rightFace = faceLandmarks[454];
      const chin = faceLandmarks[152];

      centerX = ((leftFace.x + rightFace.x) / 2) * width;
      centerY = chin.y * height + height * 0.15;

      shoulderDistance = Math.sqrt(Math.pow((rightFace.x - leftFace.x) * width, 2) + Math.pow((rightFace.y - leftFace.y) * height, 2)) * 2; // Estimate wider for body
    }

    ctx.save();
    ctx.translate(centerX, centerY);

    const img = santaOutfitImageRef.current;
    const imgWidth = shoulderDistance * 1.8; // Proportional to actual shoulder width
    const imgHeight = (img.height / img.width) * imgWidth;

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, -imgWidth / 2, 0, imgWidth, imgHeight);
    ctx.restore();
  };

  // Update sledge position directly in ref for smooth animation
  const updateSledgePosition = () => {
    if (selectedFilter === "santa" && settings.snow.enabled && showSantaSledge && !isGameMode) {
      // Move sledge from right to left across screen (30% slower)
      sledgePositionRef.current -= 0.84; // Reduced by 30% from 1.2 to 0.84
      // Reset when it goes completely off screen
      if (sledgePositionRef.current < -30) {
        sledgePositionRef.current = 130; // Start from right side with buffer
      }
    }
  };

  const trackPeopleOnScreen = (faceLandmarks) => {
    const currentTime = Date.now();
    const stayDuration = 3000; // 3 seconds
    
    // Create a simple face ID based on approximate position
    faceLandmarks.forEach((face, index) => {
      if (face && face.length > 0) {
        const centerX = face[1]?.x || face[0]?.x || 0; // Nose tip or first landmark
        const centerY = face[1]?.y || face[0]?.y || 0;
        const faceId = `face_${Math.round(centerX * 20)}_${Math.round(centerY * 20)}`;
        
        if (!faceTrackingRef.current.has(faceId)) {
          // New face detected
          faceTrackingRef.current.set(faceId, currentTime);
        } else {
          // Check if face has been on screen long enough
          const startTime = faceTrackingRef.current.get(faceId);
          if (currentTime - startTime >= stayDuration) {
            // Count this person and remove from tracking to avoid double counting
            peopleCountRef.current += 1;
            setPeopleCount(peopleCountRef.current);
            localStorage.setItem('peopleCount', peopleCountRef.current.toString());
            faceTrackingRef.current.delete(faceId);
          }
        }
      }
    });
    
    // Clean up old tracking entries (faces that disappeared)
    const entriesToDelete = [];
    for (const [faceId, startTime] of faceTrackingRef.current.entries()) {
      if (currentTime - startTime > stayDuration + 2000) { // 2 second grace period
        entriesToDelete.push(faceId);
      }
    }
    entriesToDelete.forEach(id => faceTrackingRef.current.delete(id));
  };

  const drawPeopleCounter = (ctx, width, height) => {
    const padding = 20;
    const text = `People: ${peopleCount}`;
    
    ctx.save();
    
    // Set font and measure text
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Simple positioning - top left corner with more margin
    const x = 30;
    const y = 100; // Increased from 50 to 80 for more top margin
    
    // Draw text with black outline for visibility
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    
    ctx.restore();
  };

  const toggleCounter = () => {
    setShowCounter(true);
    
    // Clear existing timeout
    if (counterTimeout) {
      clearTimeout(counterTimeout);
    }
    
    // Hide counter after 5 seconds
    const timeout = setTimeout(() => {
      setShowCounter(false);
    }, 5000);
    
    setCounterTimeout(timeout);
  };

  const resetCounter = () => {
    peopleCountRef.current = 0;
    setPeopleCount(0);
    localStorage.setItem('peopleCount', '0');
    faceTrackingRef.current.clear();
  };

  const drawSantaSledge = (ctx, width, height) => {
    if (!santaSledgeImageRef.current) return;

    ctx.save();

    const img = santaSledgeImageRef.current;
    const imgWidth = width * 0.12; // 12% of screen width
    const imgHeight = (img.height / img.width) * imgWidth;

    // Calculate x position for right-to-left movement
    const sledgeX = width + imgWidth - (sledgePositionRef.current / 100) * (width + imgWidth * 2); // Sledge moves right to left

    const bottomY = height * 0.6; // 60% from top (40% from bottom)

    ctx.globalCompositeOperation = "source-over";

    // Draw single sledge moving right to left at bottom
    ctx.drawImage(img, sledgeX, bottomY, imgWidth, imgHeight);

    ctx.restore();
  };

  const applyNegativeFilter = (ctx, width, height) => {
    // Apply blur to smooth out grainy areas before thresholding
    ctx.filter = "blur(5px)";
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = "none";

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Create high-contrast silhouette effect (background black, people white)
    const threshold = 90; // Higher threshold to capture more details (fingers, edges)

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate luminance (brightness)
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // People (darker areas) appear white, brighter areas (background) appear black
      const value = luminance < threshold ? 255 : 0;

      data[i] = value; // Red
      data[i + 1] = value; // Green
      data[i + 2] = value; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyNegative3FilterWebGL = (ctx, width, height) => {
    const gl = glContextRef.current;
    const program = webglProgramRef.current;
    const webglCanvas = webglCanvasRef.current;

    if (!gl || !program || !webglCanvas) {
      console.warn("WebGL not initialized, falling back to CPU filter");
      applyNegativeFilter(ctx, width, height);
      return;
    }

    // Set WebGL canvas size to match main canvas
    if (webglCanvas.width !== width || webglCanvas.height !== height) {
      webglCanvas.width = width;
      webglCanvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    // Upload the current canvas content as a texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Use the shader program
    gl.useProgram(program);

    // Set up position attribute
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up texture coordinate attribute
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    const thresholdLocation = gl.getUniformLocation(program, "u_threshold");
    gl.uniform1f(thresholdLocation, 0.35); // Normalized threshold (90/255)

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Copy the result back to the 2D canvas
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(webglCanvas, 0, 0);

    // Clean up
    gl.deleteTexture(texture);
    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(texCoordBuffer);
  };

  const drawSnowEffect = (ctx, width, height) => {
    // Reduce snowflake update frequency during animations to improve performance
    if (!isAnimating || Math.random() < 0.7) { // Skip 30% of updates during animations
      snowflakesRef.current = snowflakesRef.current.map((flake) => {
        let newY = flake.y + flake.speed * 0.5;
        let newX = flake.x + flake.drift;

        if (newY > 100) {
          newY = -5;
          newX = Math.random() * 100;
        }

        if (newX > 100) newX = 0;
        if (newX < 0) newX = 100;

        return {
          ...flake,
          x: newX,
          y: newY,
        };
      });
    }

    // Draw snowflakes using snow image if available, otherwise fallback to circles
    if (snowImageRef.current) {
      snowflakesRef.current.forEach((flake) => {
        const x = (flake.x / 100) * width;
        const y = (flake.y / 100) * height;
        const imageSize = 20 * flake.scale; // Base size of 20px scaled by random factor
        
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.drawImage(
          snowImageRef.current,
          x - imageSize / 2,
          y - imageSize / 2,
          imageSize,
          imageSize
        );
        ctx.restore();
      });
    } else {
      // Fallback to circle drawing if image not loaded
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#FFFFFF";

      snowflakesRef.current.forEach((flake) => {
        ctx.beginPath();
        ctx.arc((flake.x / 100) * width, (flake.y / 100) * height, flake.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    }

    if (isLiveMode) {
      const maxPileHeight = Math.max(350, (settings.snow.pileHeight / 100) * height); // Minimum 350px height
      setSnowPileHeight((prev) => Math.min(prev + 8, maxPileHeight)); // Much faster growth (8px per frame)

      if (snowPileHeight > 0) {
        // Use snow pile image if available, otherwise fallback to drawn pile
        if (snowPileImageRef.current) {
          const pileImg = snowPileImageRef.current;
          
          // Use 3 tiles to cover the width with overlap to eliminate gaps
          const tileWidth = width / 2.5; // Slightly wider tiles for overlap
          const tileHeight = snowPileHeight;
          
          ctx.save();
          ctx.globalAlpha = 0.95;
          
          // Draw first tile
          ctx.drawImage(
            pileImg,
            0,
            height - tileHeight,
            tileWidth,
            tileHeight
          );
          
          // Draw second tile (middle) with slight overlap
          ctx.drawImage(
            pileImg,
            tileWidth * 0.8,
            height - tileHeight,
            tileWidth,
            tileHeight
          );
          
          // Draw third tile with overlap
          ctx.drawImage(
            pileImg,
            tileWidth * 1.6,
            height - tileHeight,
            tileWidth,
            tileHeight
          );
          
          ctx.restore();
        } else {
          // Fallback to simple drawn snow pile if image not loaded
          const gradient = ctx.createLinearGradient(0, height - snowPileHeight, 0, height);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, height);
          
          for (let x = 0; x <= width; x += 20) {
            const wave = Math.sin(x * 0.05) * 10;
            ctx.lineTo(x, height - snowPileHeight + wave);
          }
          
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fill();
        }
      }
    } else {
      setSnowPileHeight(0);
    }
  };

  const startArrowAnimation = () => {
    if (raisedHandPlayers.length < 2) return;

    let jumps = 0;
    const maxJumps = 10 + Math.floor(Math.random() * 5);
    const jumpInterval = 300;

    const jump = () => {
      if (jumps < maxJumps) {
        const randomPlayer = raisedHandPlayers[Math.floor(Math.random() * raisedHandPlayers.length)];
        setArrowPosition(randomPlayer);
        jumps++;
        setTimeout(jump, jumpInterval);
      } else {
        const winnerPlayer = raisedHandPlayers[Math.floor(Math.random() * raisedHandPlayers.length)];
        setArrowPosition(winnerPlayer);
        setWinner(winnerPlayer);
        setGameState("result");

        const initialConfetti = [];
        for (let i = 0; i < 100; i++) {
          initialConfetti.push({
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: Math.random() * 2 + 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"][Math.floor(Math.random() * 6)],
            size: Math.random() * 8 + 4,
          });
        }
        setConfetti(initialConfetti);

        setTimeout(() => {
          setGameState("waiting");
          setCountdown(5);
          setArrowPosition(null);
          setWinner(null);
          setConfetti([]);
          setCanStartGame(false);
        }, settings.game.resultDisplayTime * 1000);
      }
    };

    jump();
  };

  const drawGameOverlay = (ctx, width, height, allLandmarks) => {
    ctx.save();
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";

    if (gameState === "waiting") {
      ctx.strokeText("WHO'S GOT THE NEXT ROUND?", width / 2, height * 0.3);
      ctx.fillText("WHO'S GOT THE NEXT ROUND?", width / 2, height * 0.3);

      ctx.font = "bold 36px Arial";
      ctx.strokeText("Raise your hand to play", width / 2, height * 0.4);
      ctx.fillText("Raise your hand to play", width / 2, height * 0.4);

      ctx.font = "bold 28px Arial";
      const playerText = `Players ready: ${raisedHandPlayers.length}/2 minimum`;
      ctx.strokeText(playerText, width / 2, height * 0.5);
      ctx.fillText(playerText, width / 2, height * 0.5);

      // Show requirement message if not enough players
      if (raisedHandPlayers.length < 2) {
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#FF6B6B";
        ctx.strokeText("Need at least 2 players to start", width / 2, height * 0.58);
        ctx.fillText("Need at least 2 players to start", width / 2, height * 0.58);
        ctx.fillStyle = "#FFFFFF";
      }

      // Show instruction for manual mode
      if (settings.game.startMode === "manual" && raisedHandPlayers.length >= 2) {
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = "#00f2fe";
        ctx.strokeText('Press "Start Game" to begin', width / 2, height * 0.65);
        ctx.fillText('Press "Start Game" to begin', width / 2, height * 0.65);
      }
    } else if (gameState === "joining") {
      ctx.strokeText("More players can join!", width / 2, height * 0.25);
      ctx.fillText("More players can join!", width / 2, height * 0.25);

      // Display countdown prominently
      ctx.font = "bold 140px Arial";
      ctx.fillStyle = "#FFD700";
      ctx.strokeText(joinCountdown.toString(), width / 2, height / 2);
      ctx.fillText(joinCountdown.toString(), width / 2, height / 2);

      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeText(`${raisedHandPlayers.length} players ready`, width / 2, height * 0.65);
      ctx.fillText(`${raisedHandPlayers.length} players ready`, width / 2, height * 0.65);
    } else if (gameState === "countdown") {
      ctx.font = "bold 120px Arial";
      ctx.strokeText(countdown.toString(), width / 2, height / 2);
      ctx.fillText(countdown.toString(), width / 2, height / 2);
    } else if (gameState === "animating" || gameState === "result") {
      // Show arrow during both animating and result states
      if (arrowPosition) {
        drawArrow(ctx, arrowPosition.x, arrowPosition.y - 100);
      }

      if (gameState === "result") {
        ctx.font = "bold 60px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.strokeText(settings.game.winnerText, width / 2, height * 0.15);
        ctx.fillText(settings.game.winnerText, width / 2, height * 0.15);

        drawConfetti(ctx, width, height);
        drawNewsTicker(ctx, width, height);
      }
    }

    if (raisedHandPlayers.length > 0 && allLandmarks) {
      raisedHandPlayers.forEach((player) => {
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
        ctx.fill();
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    }

    ctx.restore();
  };

  const drawNewsTicker = (ctx, width, height) => {
    ctx.save();

    // Modern ticker design
    const tickerHeight = 70;
    const tickerY = height - tickerHeight - 40; // Add 10px margin from bottom

    // Modern gradient background with glassmorphism effect
    const bgGradient = ctx.createLinearGradient(0, tickerY, 0, height);
    bgGradient.addColorStop(0, "rgba(18, 25, 44, 0.95)");
    bgGradient.addColorStop(1, "rgba(30, 40, 60, 0.98)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, tickerY, width, tickerHeight);

    // Top accent line with gradient
    const accentGradient = ctx.createLinearGradient(0, tickerY, width, tickerY);
    accentGradient.addColorStop(0, "rgba(102, 126, 234, 0.8)");
    accentGradient.addColorStop(0.5, "rgba(118, 75, 162, 0.8)");
    accentGradient.addColorStop(1, "rgba(102, 126, 234, 0.8)");
    ctx.fillStyle = accentGradient;
    ctx.fillRect(0, tickerY, width, 3);

    // Bottom subtle shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, tickerY + tickerHeight - 1, width, 1);

    // Scrolling text with modern styling
    ctx.font = 'bold 32px "Roboto", "Helvetica", "Arial", sans-serif';
    ctx.textAlign = "left";

    const tickerText = settings.game.tickerText;
    const textWidth = ctx.measureText(tickerText).width;
    const spacing = 150; // Space between repeated text
    const totalTextWidth = textWidth + spacing;

    // Calculate position for RIGHT TO LEFT movement
    // tickerPosition goes from 100 to -100
    // We want text to start from right (width) and move to left (0)
    const scrollProgress = (100 - tickerPosition) / 200; // 0 to 1 as ticker moves right to left
    const offsetX = scrollProgress * totalTextWidth;
    const baseX = width - offsetX;

    // Draw text with gradient fill for modern look
    const textGradient = ctx.createLinearGradient(0, tickerY, 0, tickerY + tickerHeight);
    textGradient.addColorStop(0, "#FFFFFF");
    textGradient.addColorStop(1, "#E0E0E0");
    ctx.fillStyle = textGradient;

    // Add subtle glow effect
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(102, 126, 234, 0.4)";

    // Calculate how many copies we need to fill the screen
    const numCopies = Math.ceil((width + totalTextWidth) / totalTextWidth) + 2;

    // Draw multiple copies for seamless looping (RIGHT TO LEFT)
    for (let i = -1; i < numCopies; i++) {
      const x = baseX + i * totalTextWidth;
      if (x > -totalTextWidth && x < width + totalTextWidth) {
        ctx.fillText(tickerText, x, tickerY + 45);
      }
    }

    ctx.restore();
  };

  const drawArrow = (ctx, x, y) => {
    if (!gameArrowImageRef.current) {
      // Fallback to drawn arrow if image not loaded
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#FFD700";
      const gradient = ctx.createLinearGradient(x, y - 40, x, y + 60);
      gradient.addColorStop(0, "#FFD700");
      gradient.addColorStop(0.5, "#FF6B00");
      gradient.addColorStop(1, "#FF0000");
      ctx.fillStyle = gradient;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, y + 70);
      ctx.lineTo(x - 40, y);
      ctx.lineTo(x - 18, y);
      ctx.lineTo(x - 18, y - 50);
      ctx.lineTo(x + 18, y - 50);
      ctx.lineTo(x + 18, y);
      ctx.lineTo(x + 40, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.save();
    
    // Add glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FFD700";
    
    const img = gameArrowImageRef.current;
    const arrowWidth = 120; // Arrow width
    const arrowHeight = (img.height / img.width) * arrowWidth;
    
    // Draw the game arrow image
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      img,
      x - arrowWidth / 2,
      y - arrowHeight / 2,
      arrowWidth,
      arrowHeight
    );
    
    ctx.restore();
  };

  const drawConfetti = (ctx, width, height) => {
    setConfetti((prevConfetti) =>
      prevConfetti
        .map((piece) => {
          let newY = piece.y + piece.velocityY * 0.5;
          let newX = piece.x + piece.velocityX * 0.3;
          let newRotation = piece.rotation + piece.rotationSpeed;
          let newVelocityY = piece.velocityY + 0.1;

          return {
            ...piece,
            x: newX,
            y: newY,
            rotation: newRotation,
            velocityY: newVelocityY,
          };
        })
        .filter((piece) => piece.y < 120)
    );

    confetti.forEach((piece) => {
      ctx.save();

      const x = (piece.x / 100) * width;
      const y = (piece.y / 100) * height;

      ctx.translate(x, y);
      ctx.rotate((piece.rotation * Math.PI) / 180);

      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);

      ctx.restore();
    });
  };

  const handleModeToggle = () => {
    setError(null); // Clear any errors when switching modes

    // If switching from video mode to live mode, clean up video
    if (!isLiveMode) {
      // We're currently in video mode, switching to live
      if (videoRef.current) {
        videoRef.current.pause();
        // Clear all event handlers before clearing src to avoid spurious errors
        videoRef.current.onended = null;
        videoRef.current.onerror = null;
        videoRef.current.onloadedmetadata = null;
        videoRef.current.src = "";
      }

      // Clear video timer if running
      if (videoTimerRef.current) {
        clearTimeout(videoTimerRef.current);
        videoTimerRef.current = null;
      }

      // Reset loop count
      setCurrentLoopCount(0);
      currentLoopCountRef.current = 0;
      setVideoStartTime(null);
    }

    setIsLiveMode(!isLiveMode);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      // Epilepsy warning can be added for future filters that need it
      if (false) {
        setShowEpilepsyWarning(true);
      }
      setSelectedFilter(newFilter);
    }
  };

  const handleStartGame = () => {
    if (canStartGame && gameState === "waiting" && raisedHandPlayers.length >= 2) {
      setGameState("joining");
      setJoinCountdown(settings.game.joiningWaitTime);
      setCanStartGame(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        bgcolor: "black",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {isLoading && (
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", zIndex: 10 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress color="primary" />
            <Typography variant="body2">Loading face detection model...</Typography>
          </Box>
        </Box>
      )}

      {isVideoLoading && (
        <Backdrop
          sx={{
            position: "absolute",
            zIndex: 100,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.8)",
          }}
          open={isVideoLoading}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress color="primary" size={60} />
            <Typography variant="h6">Loading video...</Typography>
          </Box>
        </Backdrop>
      )}

      {error && !isVideoLoading && (
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "red", zIndex: 10 }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Video Container */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", objectFit: "cover", display: "block" }} />

        {/* Toolbar Toggle Button */}
        <IconButton
          onClick={() => {
            setIsAnimating(true);
            setShowToolbar(!showToolbar);
            // Reset animation flag after transition completes
            setTimeout(() => setIsAnimating(false), 250);
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 60, // Match controls panel width
            height: 48,
            color: "#764ba2",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.25)",
              color: "#667eea",
            },
            zIndex: 1000,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Right Side Controls Panel */}
      <Slide direction="left" in={showToolbar} mountOnEnter unmountOnExit timeout={200}>
        <Paper
          sx={{
            position: "fixed",
            top: 72, // Below the MenuIcon with gap
            right: 12,
            width: 60,
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)", // Increased for better glass effect
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            zIndex: 999,
            py: 1,
            willChange: "transform", // Optimize for animations
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "center" }}>
            {/* Filter Toggle Buttons */}
            <Tooltip title="No Filter" placement="left">
              <IconButton
                size="small"
                color={selectedFilter === "none" ? "primary" : "default"}
                onClick={() => handleFilterChange(null, "none")}
                sx={{
                  background: selectedFilter === "none" ? "rgba(102, 126, 234, 0.2)" : "transparent",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <FilterNoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Santa Filter" placement="left">
              <IconButton
                size="small"
                color={selectedFilter === "santa" ? "primary" : "default"}
                onClick={() => handleFilterChange(null, "santa")}
                disabled={!isLiveMode}
                sx={{
                  background: selectedFilter === "santa" ? "rgba(102, 126, 234, 0.2)" : "transparent",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                🎅
              </IconButton>
            </Tooltip>

            <Tooltip title="Tree Filter" placement="left">
              <IconButton
                size="small"
                color={selectedFilter === "tree" ? "primary" : "default"}
                onClick={() => handleFilterChange(null, "tree")}
                disabled={!isLiveMode}
                sx={{
                  background: selectedFilter === "tree" ? "rgba(102, 126, 234, 0.2)" : "transparent",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                🎄
              </IconButton>
            </Tooltip>

            {settings.customProp.imageFile && (
              <Tooltip title="Custom Filter" placement="left">
                <IconButton
                  size="small"
                  color={selectedFilter === "custom" ? "primary" : "default"}
                  onClick={() => handleFilterChange(null, "custom")}
                  disabled={!isLiveMode}
                  sx={{
                    background: selectedFilter === "custom" ? "rgba(102, 126, 234, 0.2)" : "transparent",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.1)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  ✨
                </IconButton>
              </Tooltip>
            )}

            {/* Divider */}
            <Box sx={{ width: 20, height: 1, background: "rgba(255, 255, 255, 0.2)", my: 0.5 }} />

            {/* Snow Toggle */}
            <Tooltip title={settings.snow.enabled ? "Hide Snow" : "Show Snow"} placement="left">
              <IconButton
                size="small"
                color={settings.snow.enabled ? "primary" : "default"}
                onClick={() => {
                  const newSettings = {
                    ...settings,
                    snow: {
                      ...settings.snow,
                      enabled: !settings.snow.enabled,
                    },
                  };
                  onSettingsChange(newSettings);
                }}
              >
                <SnowIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Hat Toggle - only show when Santa filter is active */}
            {selectedFilter === "santa" && (
              <Tooltip title={useElfHat ? "Switch to Santa Hat" : "Switch to Elf Hat"} placement="left">
                <IconButton size="small" color={useElfHat ? "secondary" : "primary"} onClick={() => setUseElfHat(!useElfHat)} sx={{ fontSize: "1rem" }}>
                  🎩
                </IconButton>
              </Tooltip>
            )}

            {/* Sledge Toggle - only show when Santa filter and snow are active */}
            {selectedFilter === "santa" && settings.snow.enabled && (
              <Tooltip title={showSantaSledge ? "Hide Santa Sledge" : "Show Santa Sledge"} placement="left">
                <IconButton 
                  size="small" 
                  color={showSantaSledge ? "primary" : "default"} 
                  onClick={() => setShowSantaSledge(!showSantaSledge)} 
                  sx={{ 
                    fontSize: "1rem",
                    opacity: showSantaSledge ? 1 : 0.5,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  🛷
                </IconButton>
              </Tooltip>
            )}

            {/* Divider */}
            <Box sx={{ width: 20, height: 1, background: "rgba(255, 255, 255, 0.2)", my: 0.5 }} />

            {/* Settings */}
            <Tooltip title="Settings" placement="left">
              <IconButton size="small" color="inherit" onClick={onBackToMenu}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Mode Toggle */}
            <Tooltip title={isLiveMode ? "Live Camera" : "Video Mode"} placement="left">
              <IconButton size="small" color={isLiveMode ? "primary" : "default"} onClick={handleModeToggle}>
                {isLiveMode ? <VideocamIcon fontSize="small" /> : <MovieIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {!isLiveMode && (
              <Tooltip title="Upload Video" placement="left">
                <IconButton size="small" color="inherit" onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* Game Mode Toggle */}
            <Tooltip title="Game Mode" placement="left">
              <IconButton 
                size="small" 
                color={isGameMode ? "primary" : "default"} 
                onClick={() => setIsGameMode(!isGameMode)} 
                disabled={!isLiveMode}
                sx={{
                  "&.Mui-disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                  },
                }}
              >
                <GamesIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* People Counter Toggle */}
            <Tooltip title="Show People Counter" placement="left">
              <IconButton 
                size="small" 
                color={showCounter ? "primary" : "default"} 
                onClick={toggleCounter}
                sx={{
                  opacity: showCounter ? 1 : 0.7,
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                <PeopleIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {isGameMode && (
              <Tooltip title={canStartGame ? "Start the game with raised hands!" : "Need at least 2 players to start"} placement="left">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (canStartGame) {
                        setGameState("starting");
                        setCountdown(5);
                      }
                    }}
                    disabled={!canStartGame}
                    sx={{
                      color: canStartGame ? "white" : "rgba(255, 255, 255, 0.3)",
                      background: canStartGame ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        background: canStartGame ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" : "rgba(255, 255, 255, 0.1)",
                      },
                      "&.Mui-disabled": {
                        color: "rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
        </Paper>
      </Slide>



      <input type="file" ref={fileInputRef} accept="video/*" onChange={handleVideoUpload} style={{ display: "none" }} />

      <Dialog open={showEpilepsyWarning} onClose={() => setShowEpilepsyWarning(false)}>
        <DialogTitle>Epilepsy Warning</DialogTitle>
        <DialogContent>
          <Typography>
            Epilepsy Warning: This effect contains flashing lights and may trigger seizures in photosensitive individuals.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VideoScreen;
