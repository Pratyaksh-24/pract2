"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  
  // Loading status state
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isBackgroundFullyLoaded, setIsBackgroundFullyLoaded] = useState(false);

  // 1. Initial Load & Background Progression Queue
  useEffect(() => {
    // A. Immediately load Frame 1 so the page has a stunning hero image instantly (0 layout shift)
    const firstImg = new Image();
    firstImg.src = "/frames/ezgif-frame-001.jpg";
    firstImg.onload = () => {
      loadedFramesRef.current[1] = firstImg;
      setFirstFrameLoaded(true);
      setLoadedCount(1);
      
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
          setIsBackgroundFullyLoaded(true);
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
                setLoadedCount((prev) => prev + 1);
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
      },
    });

    // Handle canvas resizing dynamically
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [firstFrameLoaded]);

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

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [firstFrameLoaded]);

  return (
    <div 
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

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 cinematic-vignette opacity-80 pointer-events-none z-1" />
      </div>
    </div>
  );
}
