"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const textOuterRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    let rafId: number;
    let targetTime = 0;
    let currentTime = 0;
    const ease = 0.08; // High-performance smoothing interpolation factor

    const setupScrubTimeline = () => {
      if (!containerRef.current || !heroRef.current || !videoRef.current) return;
      const duration = video.duration || 5;

      ctxRef.current = gsap.context(() => {
        // Initial intro text fade-in on page load
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

        // ScrollTrigger pinning the hero section
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // Generous scroll distance (3x viewport height)
          pin: heroRef.current,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Map scroll progress (0 to 1) directly to video playback time
            targetTime = self.progress * duration;

            // Dynamically scale/zoom the video based on scroll progress
            if (video) {
              const currentScale = 1 + self.progress * 0.12; // Zoom in up to 1.12
              gsap.set(video, { scale: currentScale });
            }

            // Darken vignette overlay as we scroll deeper into focus
            if (vignetteRef.current) {
              const currentVignette = 0.65 + self.progress * 0.3; // Up to 0.95 dark
              gsap.set(vignetteRef.current, { opacity: currentVignette });
            }

            // Animate text overlay exit: fades, blurs, and drifts upward, finishing exactly by 40% progress
            if (textOuterRef.current) {
              if (self.progress <= 0.4) {
                const textProgress = self.progress / 0.4; // Normalized (0 to 1)
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
      }, containerRef);
    };

    // Handle metadata loading to set up scrub timeline properly
    const handleMetadata = () => {
      setIsVideoLoaded(true);
      setupScrubTimeline();
    };

    if (video.readyState >= 1) {
      handleMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleMetadata);
    }

    // Smooth RAF Interpolation loop to eliminate decoding jitter
    const updateInterpolation = () => {
      if (video && video.duration) {
        // Interpolate currentTime towards target scroll-scrubbed time
        currentTime += (targetTime - currentTime) * ease;
        
        // Update video currentTime if the difference is meaningful
        if (Math.abs(targetTime - currentTime) > 0.001) {
          video.currentTime = currentTime;
        }

        // Synchronize ambient audio time to match video scrub time
        // Using a 0.3s tolerance threshold to prevent sound stuttering while scrubbing
        if (audio && !audio.paused) {
          const delta = Math.abs(audio.currentTime - currentTime);
          if (delta > 0.3) {
            audio.currentTime = currentTime;
          }
        }
      }
      rafId = requestAnimationFrame(updateInterpolation);
    };
    rafId = requestAnimationFrame(updateInterpolation);

    // Subtle breathing glow animation behind the text container
    const breathingTween = gsap.to(".text-glow-panel", {
      boxShadow: "0 0 50px 15px rgba(10, 10, 10, 0.5)",
      borderColor: "rgba(245, 236, 215, 0.15)",
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
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

    // Ambient sound fade-in upon first interaction (scroll/click) to bypass browser policy
    const handleFirstInteraction = () => {
      if (audio && isMuted) {
        audio.muted = false;
        audio.volume = 0;
        audio.play().catch(() => {});
        gsap.to(audio, {
          volume: 0.35, // Premium soft volume
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

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("scroll", handleFirstInteraction);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      cancelAnimationFrame(rafId);
      breathingTween.kill();
      window.removeEventListener("mousemove", handleMouseMove);
      cleanupListeners();
      if (ctxRef.current) {
        ctxRef.current.revert();
      }
    };
  }, [isMuted, isVideoLoaded]);

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
    <div ref={containerRef} className="relative w-full h-[380vh] bg-obsidian z-10">
      <div 
        ref={heroRef} 
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-obsidian"
      >
        {/* Scroll-scrubbed hardware-accelerated local video */}
        <video 
          ref={videoRef}
          muted 
          playsInline 
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover gpu-accelerated pointer-events-none select-none z-0"
          style={{
            filter: "contrast(1.08) brightness(0.92) saturate(1.02)",
            willChange: "transform",
          }}
        >
          <source src="/0529.mp4" type="video/mp4" />
        </video>

        {/* Ambient Loopable Audio Tag for high-fidelity soundtrack synchronization */}
        <audio 
          ref={audioRef} 
          src="/0529.mp4" 
          loop 
          muted 
          preload="auto" 
        />

        {/* Cinematic Radial Vignette Overlay */}
        <div 
          ref={vignetteRef}
          className="absolute inset-0 cinematic-vignette opacity-65 pointer-events-none select-none z-1" 
          style={{ willChange: "opacity" }}
        />

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
            {/* Elegant button expand animation layer */}
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
