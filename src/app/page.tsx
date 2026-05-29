import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Ingredients from "@/components/Ingredients";
import Technique from "@/components/Technique";
import Lab from "@/components/Lab";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian text-aged-cream selection:bg-amber-gold/30 selection:text-amber-gold">
      <Navigation />
      
      <Hero />
      
      <Ingredients />
      
      <Technique />
      
      <Lab />
      
      {/* Quote Break Section */}
      <section className="py-32 md:py-48 bg-obsidian flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-amber-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-[52px] font-accent italic text-aged-cream leading-tight mb-8">
            &ldquo;The White Russian asks nothing of you. It only asks that you slow down.&rdquo;
          </h2>
          <p className="text-amber-gold/70 font-body uppercase tracking-[0.2em] text-sm">
            — Jeff Bridges, probably
          </p>
        </div>
      </section>
      
      <Gallery />
      
      <Footer />
    </main>
  );
}
