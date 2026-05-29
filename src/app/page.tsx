import Navigation from "@/components/Navigation";
import ScrollAnimationHero from "@/components/ScrollAnimationHero";
import Ingredients from "@/components/Ingredients";
import Technique from "@/components/Technique";
import Lab from "@/components/Lab";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030303] selection:bg-amber-gold/30 selection:text-amber-gold animate-fade-in">
      <Navigation />
      <ScrollAnimationHero />
      <Ingredients />
      <Technique />
      <Lab />
      <Gallery />
      <Footer />
    </main>
  );
}
