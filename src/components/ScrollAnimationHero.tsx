"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Play } from "lucide-react";
import Link from "next/link";

// Register ScrollTrigger plugin for GSAP
gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 178;

export default function ScrollAnimationHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // High performance refs to avoid re-triggering React renders during scroll/RAF loops
  const loadedFramesRef = useRef<{ [key: number]: HTMLImageElement }>({});
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  
  // Text & Audio refs for luxury overlays
  const textOuterRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Loading status state
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // 1. Initial Load & Background Progression Queue
  useEffect(() => {
    // A. Immediately load Frame 1 so the page has a stunning hero image instantly (0 layout shift)
    const firstImg = new Image();
    firstImg.src = "/frames/ezgif-frame-001.jpg";
    firstImg.onload = () => {
      loadedFramesRef.current[1] = firstImg;
      setFirstFrameLoaded(true);
      
      // Render Frame 1 immediately on canvas
      drawFrame(1);
      
      // B. Start background downloading queue after first paint, so we do not choke page startup
      setTimeout(startProgressiveBackgroundLoading, 300);
    };

    const startProgressiveBackgroundLoading = () => {
      const batchSize = 6; // Load in small, gentle concurrency batches
      let currentIndex = 2;

      const loadNextBatch = () => {
        if (currentIndex > TOTAL_FRAMES) {
          return;
        }

        const promises: Promise<void>[] = [];
        const end = Math.min(currentIndex + batchSize, TOTAL_FRAMES + 1);

        for (let i = currentIndex; i < end; i++) {
          promises.push(
            new Promise<void>((resolve) => {
              const img = new Image();
              const paddedIndex = String(i).padStart(3, '0');
              img.src = `/frames/ezgif-frame-${paddedIndex}.jpg`;
              
              img.onload = () => {
                loadedFramesRef.current[i] = img;
                resolve();
              };
              
              img.onerror = () => {
                resolve(); // resolve on error to keep the queue walking
              };
            })
          );
        }

        currentIndex = end;
        
        Promise.all(promises).then(() => {
          // Defer next load batch to requestIdleCallback if supported to let browser do layout tasks
          if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(() => loadNextBatch());
          } else {
            setTimeout(loadNextBatch, 30);
          }
        });
      };

      loadNextBatch();
    };
  }, []);

  // Helper function to draw frames onto the high-DPI canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve requested frame, fallback to nearest available frame if still lazy-loading
    let img = loadedFramesRef.current[Math.round(frameIndex)];
    if (!img) {
      // Find nearest loaded frame backward
      for (let i = Math.round(frameIndex); i >= 1; i--) {
        if (loadedFramesRef.current[i]) {
          img = loadedFramesRef.current[i];
          break;
        }
      }
    }
    // Final fallback to frame 1 if nothing found
    if (!img) img = loadedFramesRef.current[1];
    if (!img) return;

    // Set canvas dimensions relative to display to prevent fuzzy scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Contain Aspect Scaling with custom zoom-out multiplier (fitFactor) to prevent blurriness
    const canvasRatio = rect.width / rect.height;
    const imgRatio = img.width / img.height;
    
    const fitFactor = 0.9; // Elegant 90% viewport boundary scaling for sharp details
    
    let drawWidth = rect.width * fitFactor;
    let drawHeight = rect.height * fitFactor;
    let offsetX = (rect.width - drawWidth) / 2;
    let offsetY = (rect.height - drawHeight) / 2;

    if (canvasRatio > imgRatio) {
      // Fit fully to viewport height, keeping native width proportional
      drawWidth = rect.height * imgRatio * fitFactor;
      offsetX = (rect.width - drawWidth) / 2;
    } else {
      // Fit fully to viewport width, keeping native height proportional
      drawHeight = rect.width / imgRatio * fitFactor;
      offsetY = (rect.height - drawHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 2. Setup GSAP ScrollTrigger and Pinned timeline
  useEffect(() => {
    if (!firstFrameLoaded) return;

    const scrollContainer = containerRef.current;
    const stickySection = stickyRef.current;
    if (!scrollContainer || !stickySection) return;

    // Set up standard loading intro text fade-in
    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        ".hero-entrance-text",
        {
          y: 45,
          opacity: 0,
          filter: "blur(12px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.8,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.4,
        }
      );
    }, containerRef);

    // Bind scroll progress directly to our target frame ref
    const trigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "+=250%", // Pins for 2.5x the viewport height
      pin: stickySection,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Map progress (0 to 1) linearly to frames (1 to TOTAL_FRAMES)
        const frameIndex = 1 + self.progress * (TOTAL_FRAMES - 1);
        targetFrameRef.current = frameIndex;

        // Animate text overlay exit: fades, blurs, and drifts upward, finishing exactly by 40% progress
        if (textOuterRef.current) {
          if (self.progress <= 0.4) {
            const textProgress = self.progress / 0.4;
            gsap.set(textOuterRef.current, {
              y: -textProgress * 80,
              opacity: 1 - textProgress,
              filter: `blur(${textProgress * 16}px)`,
            });
          } else {
            gsap.set(textOuterRef.current, { opacity: 0 });
          }
        }
      },
    });

    // Elegant Mouse interaction - 3D parallax responsive depth on the inner text container
    const handleMouseMove = (e: MouseEvent) => {
      if (!textInnerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xOffset = (clientX / innerWidth) - 0.5;
      const yOffset = (clientY / innerHeight) - 0.5;

      gsap.to(textInnerRef.current, {
        x: xOffset * 35,
        y: yOffset * 25,
        rotateY: xOffset * 6,
        rotateX: -yOffset * 6,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Auto-unmute on first user interaction
    const handleFirstInteraction = () => {
      const audio = audioRef.current;
      if (audio && isMuted) {
        audio.muted = false;
        audio.volume = 0;
        audio.play().catch(() => {});
        gsap.to(audio, {
          volume: 0.35,
          duration: 3,
          ease: "power1.inOut",
        });
        setIsMuted(false);
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    };

    // Subtle breathing glow animation behind the text container
    const breathingTween = gsap.to(".text-glow-panel", {
      boxShadow: "0 0 50px 15px rgba(10, 10, 10, 0.5)",
      borderColor: "rgba(245, 236, 215, 0.15)",
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("scroll", handleFirstInteraction);
    window.addEventListener("mousemove", handleMouseMove);

    // Handle canvas resizing dynamically
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      breathingTween.kill();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cleanupListeners();
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, [firstFrameLoaded, isMuted]);

  // 3. Liquid-Smooth Animation loop using LERP and RequestAnimationFrame
  useEffect(() => {
    if (!firstFrameLoaded) return;

    let rafId: number;
    const interpolationFactor = 0.12; // Easing value (lower = smoother cinematic delay, higher = snappier)

    const tick = () => {
      // Smoothly interpolate current frame towards the target frame scrolled to
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * interpolationFactor;
        drawFrame(currentFrameRef.current);
      }

      // Synchronize ambient audio time to match video scrub time
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        // Map 178 frames linearly to the audio's duration
        const targetAudioTime = ((currentFrameRef.current - 1) / (TOTAL_FRAMES - 1)) * (audio.duration || 5);
        const delta = Math.abs(audio.currentTime - targetAudioTime);
        if (delta > 0.3) {
          audio.currentTime = targetAudioTime;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [firstFrameLoaded]);

  // Luxury Audio Control Button Action
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      audio.volume = 0;
      audio.play().catch(() => {});
      gsap.to(audio, {
        volume: 0.35,
        duration: 1.5,
        ease: "power2.inOut",
      });
      setIsMuted(false);
    } else {
      gsap.to(audio, {
        volume: 0,
        duration: 1.0,
        ease: "power2.inOut",
        onComplete: () => {
          audio.pause();
          audio.muted = true;
          setIsMuted(true);
        },
      });
    }
  };

  return (
    <div 
      id="our-story"
      ref={containerRef} 
      className="relative w-full bg-[#030303]"
      style={{ height: "350vh" }} // Extra height creates the scroll travel space
    >
      <div 
        ref={stickyRef} 
        className="w-full h-screen sticky top-0 overflow-hidden flex flex-col items-center justify-center bg-obsidian z-10"
      >
        {/* Viewport Pinned Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ willChange: "transform" }}
        />

        {/* Ambient Loopable Audio Tag for high-fidelity soundtrack synchronization */}
        <audio 
          ref={audioRef} 
          src="/0529.mp4" 
          loop 
          muted 
          preload="auto" 
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 cinematic-vignette opacity-80 pointer-events-none z-1" />

        {/* Dynamic Film Grain Texture */}
        <div className="absolute inset-0 film-grain pointer-events-none z-2" />

        {/* Immersive bottom fade to next content */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-2" />

        {/* Minimal Luxury Audio Soundwave Button */}
        <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
          <button 
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute atmospheric audio" : "Mute atmospheric audio"}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full border border-aged-cream/20 bg-obsidian/45 backdrop-blur-md text-aged-cream hover:border-amber-gold hover:text-amber-gold transition-all duration-500 overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full bg-amber-gold/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
            
            <div className="relative z-10 flex items-center gap-[3px]">
              {isMuted ? (
                // Silent Wave Bars
                <div className="flex items-center gap-[2px] opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="w-[2px] h-3 bg-current rounded-full" />
                  <span className="w-[2px] h-2 bg-current rounded-full" />
                  <span className="w-[2px] h-1 bg-current rounded-full" />
                  <span className="absolute w-5 h-[1.5px] bg-aged-cream/60 group-hover:bg-amber-gold rotate-45 left-[-2px] transition-colors" />
                </div>
              ) : (
                // Animating Fluid Bars
                <div className="flex items-end gap-[3px] h-4">
                  <span className="w-[2px] h-2 bg-amber-gold rounded-full animate-[pulse-wave_1.2s_infinite_ease-in-out_alternate]" />
                  <span className="w-[2px] h-4 bg-amber-gold rounded-full animate-[pulse-wave_0.8s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.2s' }} />
                  <span className="w-[2px] h-3 bg-amber-gold rounded-full animate-[pulse-wave_1.0s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.4s' }} />
                  <span className="w-[2px] h-2.5 bg-amber-gold rounded-full animate-[pulse-wave_0.7s_infinite_ease-in-out_alternate]" style={{ animationDelay: '0.1s' }} />
                </div>
              )}
            </div>
          </button>
          
          <span className="hidden sm:inline-block text-[11px] font-accent uppercase tracking-[0.25em] text-aged-cream/40 select-none">
            {isMuted ? "Sound Off" : "Cinema Audio"}
          </span>
        </div>

        {/* Editorial Luxury Typography overlay box */}
        <div 
          ref={textOuterRef} 
          className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mt-12 w-full select-none"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {/* Inner 3D mouse parallax wrapper */}
          <div 
            ref={textInnerRef} 
            className="text-glow-panel bg-obsidian/30 backdrop-blur-[6px] border border-aged-cream/5 px-8 md:px-12 py-10 md:py-14 rounded-2xl transition-shadow duration-700 shadow-2xl flex flex-col items-center"
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
            <span 
              className="hero-entrance-text text-label text-amber-gold uppercase tracking-[0.22em] text-[11px] md:text-xs mb-6 font-semibold opacity-0"
              style={{ transform: "translateZ(30px)" }}
            >
              EST. 1965 — THE ORIGINAL INDULGENCE
            </span>
            
            <h1 
              className="hero-entrance-text text-4xl md:text-5xl lg:text-[58px] leading-[1.12] text-aged-cream font-display italic mb-6 opacity-0"
              style={{ transform: "translateZ(50px)" }}
            >
              Some drinks are ordered.<br />This one is savored.
            </h1>
            
            <p 
              className="hero-entrance-text text-[15px] md:text-lg text-aged-cream/70 font-body max-w-2xl mb-10 leading-relaxed tracking-wide opacity-0"
              style={{ transform: "translateZ(40px)" }}
            >
              Kahlúa. Vodka. Heavy cream. Three ingredients. One ritual.
            </p>

            <div 
              className="hero-entrance-text flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 w-full"
              style={{ transform: "translateZ(35px)" }}
            >
              <Link 
                href="#the-craft" 
                className="group relative h-[46px] w-[190px] flex items-center justify-center border border-amber-gold/40 rounded-sm text-amber-gold text-xs uppercase tracking-[0.18em] overflow-hidden transition-all duration-500 hover:border-amber-gold"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-obsidian font-semibold">
                  Discover the Craft
                </span>
                <div className="absolute inset-0 bg-amber-gold transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </Link>

              <button 
                onClick={toggleMute}
                className="flex items-center justify-center gap-3 text-aged-cream/80 hover:text-amber-gold transition-colors duration-500 py-2 px-4 group"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-aged-cream/20 group-hover:border-amber-gold/50 group-hover:scale-105 transition-all duration-500">
                  <Play size={13} className="ml-0.5 fill-current" />
                </span>
                <span className="text-xs uppercase tracking-[0.18em] font-medium">
                  {isMuted ? "Listen to the Pour" : "Mute Sound"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60 animate-bounce pointer-events-none">
          <span className="text-[9px] font-accent uppercase tracking-[0.3em] text-aged-cream/40">Scroll to Reveal</span>
          <ChevronDown className="text-aged-cream/40" size={18} />
        </div>
      </div>
    </div>
  );
}
