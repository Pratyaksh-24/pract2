"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
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
  
  // Text refs for luxury overlays
  const textOuterRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Loading status state
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

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
    // Pinned until the bottom of container reaches the bottom of the viewport
    const trigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
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

    // Subtle breathing glow animation behind the text container
    const breathingTween = gsap.to(".text-glow-panel", {
      boxShadow: "0 0 50px 15px rgba(10, 10, 10, 0.5)",
      borderColor: "rgba(245, 236, 215, 0.15)",
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

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
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, [firstFrameLoaded]);

  // 3. Liquid-Smooth Animation loop using LERP and RequestAnimationFrame
  useEffect(() => {
    if (!firstFrameLoaded) return;

    let rafId: number;
    const interpolationFactor = 0.12; // Easing value (lower = smoother delay, higher = snappier)

    const tick = () => {
      // Smoothly interpolate current frame towards the target frame scrolled to
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * interpolationFactor;
        drawFrame(currentFrameRef.current);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [firstFrameLoaded]);

  return (
    <div 
      id="our-story"
      ref={containerRef} 
      className="relative w-full bg-[#030303]"
      style={{ height: "350vh" }} // Extra height creates the scroll travel space
    >
      <div 
        ref={stickyRef} 
        className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-obsidian z-10"
      >
        {/* Viewport Pinned Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ willChange: "transform" }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 cinematic-vignette opacity-80 pointer-events-none z-1" />

        {/* Dynamic Film Grain Texture */}
        <div className="absolute inset-0 film-grain pointer-events-none z-2" />

        {/* Immersive bottom fade to next content */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent pointer-events-none z-2" />

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
