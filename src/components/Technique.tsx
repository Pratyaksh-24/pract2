"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: 1,
    title: "The Foundation",
    body: "Fill a rocks glass to the brim with large, clear ice cubes. Size matters — bigger cubes melt slower, preserve integrity.",
  },
  {
    step: 2,
    title: "The Soul",
    body: "Pour 2oz Kahlúa along the inside edge. Watch it coat the ice — dark, viscous, aromatic.",
  },
  {
    step: 3,
    title: "The Backbone",
    body: "1oz of premium vodka, added directly. The drink is already extraordinary — the cream hasn't arrived yet.",
  },
  {
    step: 4,
    title: "The Signature",
    body: "Float 1oz of heavy cream over the back of a bar spoon. Room temperature. Unchilled. Slowly.",
  },
  {
    step: 5,
    title: "The Ritual",
    body: "Do not stir. Lift the glass. Let the cream surrender at your lips. The swirl happens in the drinking.",
  }
];

export default function Technique() {
  const containerRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // We would use ScrollTrigger to update activeStep based on scroll position
    // For this implementation, we set up a simpler ScrollTrigger
    const ctx = gsap.context(() => {
      const stepElements = gsap.utils.toArray<HTMLElement>(".step-item");
      
      stepElements.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="the-craft" ref={containerRef} className="relative bg-obsidian text-aged-cream">
      <div className="flex flex-col md:flex-row w-full relative">
        
        {/* Left Sticky Panel (Visuals) */}
        <div 
          ref={leftPanelRef}
          className="md:w-1/2 md:h-screen md:sticky md:top-0 bg-[#050505] flex items-center justify-center p-8 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian/50 z-10 pointer-events-none" />
          
          <div className="relative w-full max-w-md aspect-[3/4] glass-panel rounded-lg flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out">
            {/* Mock Visual State representing the cocktail layers */}
            <div className="absolute inset-0 flex flex-col justify-end opacity-80">
              {/* Kahlua Layer */}
              <div 
                className="w-full bg-kahlua-brown transition-all duration-1000 ease-in-out"
                style={{ height: activeStep >= 1 ? '40%' : '0%' }}
              />
              {/* Vodka Layer (invisible but adds volume) */}
              <div 
                className="w-full bg-condensation-white mix-blend-screen transition-all duration-1000 ease-in-out"
                style={{ height: activeStep >= 2 ? '20%' : '0%' }}
              />
              {/* Cream Layer */}
              <div 
                className="w-full bg-aged-cream transition-all duration-1000 ease-in-out"
                style={{ height: activeStep >= 3 ? '30%' : '0%' }}
              />
            </div>
            
            <div className="z-20 text-center mix-blend-difference">
              <span className="text-h2 font-display italic text-aged-cream">
                0{activeStep + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Right Scrollable Panel (Text) */}
        <div ref={rightPanelRef} className="md:w-1/2 py-24 md:py-0">
          <div className="max-w-xl mx-auto px-6">
            {/* Add some top padding to allow scrolling */}
            <div className="h-[20vh] hidden md:block"></div>
            
            {steps.map((item, i) => (
              <div 
                key={item.step} 
                className={`step-item min-h-[60vh] flex flex-col justify-center transition-opacity duration-500 ${
                  i === activeStep ? "opacity-100" : "opacity-30"
                }`}
              >
                <span className="text-amber-gold font-accent text-2xl italic mb-4 block">
                  Step 0{item.step}
                </span>
                <h3 className="text-h2 font-display italic mb-6">
                  {item.title}
                </h3>
                <p className="text-body font-body text-aged-cream/80 text-lg">
                  {item.body}
                </p>
              </div>
            ))}
            
            {/* Add some bottom padding */}
            <div className="h-[20vh] hidden md:block"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
