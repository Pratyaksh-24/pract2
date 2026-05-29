"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { id: 1, tag: "The Classic", title: "Perfect Pour", url: "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[4/5]" },
  { id: 2, tag: "Behind the Bar", title: "Tools of the Trade", url: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80&w=800", aspect: "aspect-square" },
  { id: 3, tag: "Occasions", title: "Midnight Solitude", url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[3/4]" },
  { id: 4, tag: "Variations", title: "Espresso Infusion", url: "https://images.unsplash.com/photo-1620021614275-c5171120025f?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[4/3]" },
  { id: 5, tag: "The Classic", title: "Ice Integrity", url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800", aspect: "aspect-square" },
  { id: 6, tag: "Occasions", title: "Shared Silence", url: "https://images.unsplash.com/photo-1543033503-4903df7f29bb?auto=format&fit=crop&q=80&w=800", aspect: "aspect-[4/5]" },
];

const filterTags = ["All", "The Classic", "Variations", "Occasions", "Behind the Bar"];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = activeFilter === "All" 
    ? images 
    : images.filter(img => img.tag === activeFilter);

  return (
    <section id="gallery" className="py-24 bg-[#050505]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-h2 font-display italic text-aged-cream mb-4">Visual Journey</h2>
            <p className="text-body font-body text-aged-cream/60 max-w-md">
              A curated collection of the White Russian experience.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
            {filterTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`text-sm tracking-widest uppercase transition-colors pb-1 border-b ${
                  activeFilter === tag 
                    ? "text-amber-gold border-amber-gold" 
                    : "text-aged-cream/40 border-transparent hover:text-aged-cream/80"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img) => (
            <div 
              key={img.id} 
              className="relative group overflow-hidden cursor-pointer rounded-sm"
              onClick={() => setLightboxIndex(images.findIndex(i => i.id === img.id))}
            >
              <div className={`w-full ${img.aspect} bg-obsidian`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-obsidian to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
                <span className="text-label text-amber-gold tracking-[0.18em] uppercase block mb-1">
                  {img.tag}
                </span>
                <h4 className="text-xl font-display italic text-aged-cream">
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-obsidian flex items-center justify-center">
          <button 
            className="absolute top-8 right-8 text-aged-cream/60 hover:text-amber-gold transition-colors"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={32} />
          </button>
          
          <button 
            className="absolute left-8 text-aged-cream/60 hover:text-amber-gold transition-colors"
            onClick={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))}
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
          
          <div className="w-full max-w-5xl px-20 aspect-video flex flex-col items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={images[lightboxIndex].url} 
              alt={images[lightboxIndex].title}
              className="max-h-[80vh] w-auto object-contain"
            />
            <div className="mt-6 text-center">
              <span className="text-amber-gold tracking-widest uppercase text-xs">
                {images[lightboxIndex].tag}
              </span>
              <h3 className="text-2xl font-display italic text-aged-cream mt-2">
                {images[lightboxIndex].title}
              </h3>
            </div>
          </div>
          
          <button 
            className="absolute right-8 text-aged-cream/60 hover:text-amber-gold transition-colors"
            onClick={() => setLightboxIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))}
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>
      )}
    </section>
  );
}
