"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Our Story", href: "#our-story" },
    { name: "The Craft", href: "#the-craft" },
    { name: "Ingredients", href: "#ingredients" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reserve", href: "#reserve" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-obsidian/85 backdrop-blur-md py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          <Link href="/" className="font-accent text-2xl text-aged-cream hover:text-amber-gold transition-colors z-50 relative">
            Noir & Cream
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm tracking-widest uppercase text-aged-cream/80 hover:text-amber-gold transition-colors group relative"
              >
                {link.name}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-amber-gold group-hover:w-full group-hover:left-0 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-aged-cream z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-obsidian z-40 flex flex-col items-center justify-center transition-opacity duration-500 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {links.map((link, idx) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-display italic text-aged-cream hover:text-amber-gold transition-colors"
              style={{
                transitionDelay: mobileMenuOpen ? `${idx * 100 + 100}ms` : '0ms',
                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileMenuOpen ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
