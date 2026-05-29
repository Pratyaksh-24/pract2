"use client";

import Link from "next/link";

function Instagram({ size = 20 }: { size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Twitter({ size = 20 }: { size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function Youtube({ size = 20 }: { size?: number }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-condensation-white/10 text-aged-cream">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          
          {/* Brand Manifesto */}
          <div className="col-span-1">
            <h3 className="text-2xl font-display italic text-amber-gold mb-6">Noir & Cream</h3>
            <p className="text-body font-body text-aged-cream/60 mb-8 max-w-sm">
              The White Russian asks nothing of you. It only asks that you slow down. Heavy cream doesn&apos;t float. It hovers. Waiting.
            </p>
          </div>

          {/* Site Links */}
          <div className="col-span-1 flex justify-center md:justify-start">
            <div className="flex flex-col gap-4">
              <h4 className="text-label tracking-widest text-aged-cream/40 uppercase mb-2">Explore</h4>
              {["Our Story", "The Craft", "Ingredients", "Gallery", "Reserve", "Journal"].map(link => (
                <Link 
                  key={link} 
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="text-body font-body text-aged-cream/80 hover:text-amber-gold transition-colors w-fit"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="col-span-1">
            <h4 className="text-label tracking-widest text-aged-cream/40 uppercase mb-4">
              For those who appreciate patience.
            </h4>
            <form className="flex flex-col gap-4 mb-10" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="bg-transparent border-b border-aged-cream/20 py-2 px-0 text-aged-cream focus:outline-none focus:border-amber-gold transition-colors font-body placeholder:text-aged-cream/30"
              />
              <button 
                type="submit"
                className="text-left font-accent italic text-amber-gold text-lg hover:text-aged-cream transition-colors mt-2"
              >
                Join the Circle →
              </button>
            </form>

            <div className="flex gap-6">
              <a href="#" className="text-aged-cream/40 hover:text-amber-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-aged-cream/40 hover:text-amber-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-aged-cream/40 hover:text-amber-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-aged-cream/10 text-xs font-body text-aged-cream/40 uppercase tracking-widest">
          <p>© 2025 Noir & Cream.</p>
          <p className="mt-4 md:mt-0 text-amber-gold/60">Drink responsibly. Must be 21+ to purchase.</p>
        </div>
      </div>
    </footer>
  );
}
