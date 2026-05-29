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
                
                {/* Crisp, Sharp SVG illustrations representing the luxury ingredients */}
                <div className="w-48 h-48 rounded-full border border-amber-gold/20 relative z-10 bg-obsidian/60 flex items-center justify-center overflow-hidden group-hover:border-amber-gold/60 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-kahlua-brown/10 to-transparent opacity-30 mix-blend-overlay"></div>
                  {item.number === "01" && (
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-gold fill-none transition-transform duration-700 group-hover:scale-110" stroke="currentColor">
                      <path 
                        d="M30,20 C15,35 15,65 30,80 C45,95 75,85 80,65 C85,45 75,15 50,15 C40,15 33,18 30,20 Z" 
                        className="stroke-amber-gold/40 fill-kahlua-brown/15"
                        strokeWidth="1.5"
                      />
                      <path 
                        d="M50,15 C45,35 55,45 45,65 C38,80 50,85 50,85" 
                        className="stroke-amber-gold"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="50" r="42" className="stroke-amber-gold/15" strokeDasharray="3 3" />
                    </svg>
                  )}
                  {item.number === "02" && (
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-aged-cream fill-none transition-transform duration-700 group-hover:scale-110" stroke="currentColor">
                      <polygon 
                        points="50,10 85,40 50,90 15,40" 
                        className="stroke-aged-cream/30 fill-white/5" 
                        strokeWidth="1.5"
                      />
                      <line x1="50" y1="10" x2="50" y2="90" className="stroke-aged-cream/50" strokeWidth="1" />
                      <line x1="15" y1="40" x2="85" y2="40" className="stroke-aged-cream/50" strokeWidth="1" />
                      <polygon 
                        points="50,25 70,40 50,70 30,40" 
                        className="stroke-amber-gold/60" 
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                  {item.number === "03" && (
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-gold fill-none transition-transform duration-700 group-hover:scale-110" stroke="currentColor">
                      <path 
                        d="M20,50 C30,30 40,70 50,50 C60,30 70,70 80,50" 
                        className="stroke-amber-gold/80" 
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path 
                        d="M15,60 C25,45 35,75 50,60 C65,45 75,75 85,60" 
                        className="stroke-aged-cream/30" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path 
                        d="M25,40 C35,25 45,55 50,40 C55,25 65,55 75,40" 
                        className="stroke-aged-cream/30" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="50" cy="50" r="38" className="stroke-amber-gold/15" />
                    </svg>
                  )}
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
