"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ingredients = [
  {
    number: "01",
    name: "Kahlúa",
    descriptor: "Coffee Liqueur",
    origin: "Veracruz, Mexico",
    notes: "Roasted arabica, dark rum, vanilla. The soul of the glass.",
  },
  {
    number: "02",
    name: "Vodka",
    descriptor: "Triple Distilled",
    origin: "Eastern European tradition",
    notes: "Crystal-clear spirit. The invisible backbone.",
  },
  {
    number: "03",
    name: "Heavy Cream",
    descriptor: "Fresh, Unchilled",
    origin: "Local dairy, grass-fed",
    notes: "Room temperature for the perfect float. The silk layer.",
  }
];

export default function Ingredients() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".ingredient-card");
      
      gsap.from(cards, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="ingredients" ref={sectionRef} className="py-32 bg-obsidian text-aged-cream relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-16">
          {ingredients.map((item) => (
            <div key={item.number} className="ingredient-card flex flex-col items-center text-center group">
              <div className="relative mb-8 w-full flex justify-center">
                <span className="text-[120px] lg:text-[180px] font-display text-condensation-white leading-none absolute top-1/2 -translate-y-1/2 select-none z-0 group-hover:text-amber-gold/10 transition-colors duration-700">
                  {item.number}
                </span>
                
                {/* Visual placeholder - in a real implementation we'd use SVG illustrations */}
                <div className="w-48 h-48 rounded-full border border-amber-gold/20 relative z-10 glass-panel flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-kahlua-brown/20 to-transparent opacity-50 mix-blend-overlay"></div>
                </div>
              </div>
              
              <h3 className="text-3xl font-display italic mb-2 relative z-20 text-amber-gold">{item.name}</h3>
              <span className="text-label tracking-[0.18em] uppercase mb-6 text-aged-cream/60 block relative z-20">
                {item.descriptor}
              </span>
              
              <div className="w-8 h-[1px] bg-amber-gold/30 mb-6 relative z-20" />
              
              <p className="text-sm font-accent text-aged-cream/80 mb-2 italic relative z-20">
                {item.origin}
              </p>
              <p className="text-body font-body text-aged-cream/70 max-w-xs relative z-20">
                {item.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
