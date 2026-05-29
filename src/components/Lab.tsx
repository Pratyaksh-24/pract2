"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Lab() {
  const [kahlua, setKahlua] = useState(2);
  const [vodka, setVodka] = useState(1);
  const [cream, setCream] = useState("Heavy Cream");
  const [ice, setIce] = useState("Large Cube");

  const creamOptions = ["Heavy Cream", "Half & Half", "Oat Milk", "Cold Foam"];
  const iceOptions = ["Large Cube", "Crushed", "Sphere", "No Ice"];

  // Calculate percentages for the glass visualization
  const totalOz = kahlua + vodka + 1; // 1oz cream is fixed volume visually for simplicity
  const kahluaPct = (kahlua / totalOz) * 100;
  const vodkaPct = (vodka / totalOz) * 100;
  const creamPct = (1 / totalOz) * 100;

  return (
    <section className="py-24 bg-[#0A0A0A] border-y border-amber-gold/10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-h2 font-display italic text-amber-gold mb-4">Make it yours.</h2>
          <p className="text-body font-body text-aged-cream/80 max-w-md mx-auto">
            Dial in your White Russian. Adjust ratios, cream type, and ice style.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">
          
          {/* Controls Panel */}
          <div className="w-full lg:w-1/2 space-y-10 glass-panel p-8 rounded-xl">
            {/* Kahlua Slider */}
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-label text-aged-cream tracking-[0.18em] uppercase">Kahlúa</label>
                <span className="text-amber-gold font-accent italic">{kahlua} oz</span>
              </div>
              <input 
                type="range" 
                min="1" max="3" step="0.25" 
                value={kahlua} 
                onChange={(e) => setKahlua(parseFloat(e.target.value))}
                className="w-full accent-kahlua-brown"
              />
            </div>

            {/* Vodka Slider */}
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-label text-aged-cream tracking-[0.18em] uppercase">Vodka</label>
                <span className="text-condensation-white font-accent italic">{vodka} oz</span>
              </div>
              <input 
                type="range" 
                min="0.5" max="2" step="0.25" 
                value={vodka} 
                onChange={(e) => setVodka(parseFloat(e.target.value))}
                className="w-full accent-condensation-white"
              />
            </div>

            {/* Cream Toggle */}
            <div>
              <label className="text-label text-aged-cream tracking-[0.18em] uppercase block mb-4">Cream</label>
              <div className="grid grid-cols-2 gap-3">
                {creamOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setCream(opt)}
                    className={`py-2 px-4 text-sm font-body border rounded-sm transition-all duration-300 ${
                      cream === opt 
                        ? "border-aged-cream text-obsidian bg-aged-cream" 
                        : "border-aged-cream/20 text-aged-cream/60 hover:border-aged-cream/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice Toggle */}
            <div>
              <label className="text-label text-aged-cream tracking-[0.18em] uppercase block mb-4">Ice Style</label>
              <div className="grid grid-cols-2 gap-3">
                {iceOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setIce(opt)}
                    className={`py-2 px-4 text-sm font-body border rounded-sm transition-all duration-300 ${
                      ice === opt 
                        ? "border-amber-gold text-amber-gold bg-amber-gold/10" 
                        : "border-amber-gold/20 text-aged-cream/60 hover:border-amber-gold/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-amber-gold text-obsidian font-display italic text-xl hover:bg-[#D4B982] transition-colors rounded-sm">
              Save My Recipe →
            </button>
          </div>

          {/* Visualization Panel */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-64 h-80 border-x-2 border-b-2 border-condensation-white/40 rounded-b-xl flex flex-col justify-end p-2 overflow-hidden">
              
              {/* Glass Rim */}
              <div className="absolute top-0 left-0 right-0 h-4 border-t-2 border-x-2 border-condensation-white/40 rounded-[50%] -translate-y-1/2" />
              
              {/* Ice Representation */}
              {ice !== "No Ice" && (
                <div className="absolute inset-x-4 bottom-4 top-20 z-10 flex flex-wrap justify-center items-end gap-1 opacity-40 mix-blend-overlay pointer-events-none">
                  {ice === "Large Cube" && <div className="w-24 h-24 border border-white/40 bg-white/10 rounded-sm transform rotate-12" />}
                  {ice === "Sphere" && <div className="w-32 h-32 border border-white/40 bg-white/10 rounded-full" />}
                  {ice === "Crushed" && Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="w-8 h-8 border border-white/30 bg-white/5 transform rotate-45" />
                  ))}
                </div>
              )}

              {/* Liquid Layers */}
              <div className="w-full relative z-0 flex flex-col justify-end h-full">
                <motion.div 
                  className="w-full bg-[#fdfaf6] opacity-90 rounded-t-sm"
                  initial={false}
                  animate={{ height: `${creamPct}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />
                <motion.div 
                  className="w-full bg-condensation-white/50"
                  initial={false}
                  animate={{ height: `${vodkaPct}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />
                <motion.div 
                  className="w-full bg-kahlua-brown"
                  initial={false}
                  animate={{ height: `${kahluaPct}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />
              </div>
            </div>

            <div className="mt-12 text-center max-w-sm">
              <h4 className="font-accent italic text-amber-gold text-xl mb-2">Tasting Profile</h4>
              <p className="text-aged-cream/70 text-sm">
                {kahlua > 2 ? "A deeply robust, coffee-forward expression " : "A balanced, refined classic "}
                {cream === "Oat Milk" ? "with a modern, earthy finish." : "with a traditional silk texture."}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
