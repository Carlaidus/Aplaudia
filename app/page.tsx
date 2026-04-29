import { Header } from "@/components/sections/header"
import { Hero } from "@/components/sections/hero"
import { ScrollStory } from "@/components/sections/scroll-story"
import { Services } from "@/components/sections/services"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Showcase } from "@/components/sections/showcase"
import { WhatsAppDemo } from "@/components/sections/whatsapp-demo"
import { VisualGallery } from "@/components/sections/visual-gallery"
import { Benefits } from "@/components/sections/benefits"
import { About } from "@/components/sections/about"
import { FinalCTA } from "@/components/sections/final-cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollStory />
        <WhatsAppDemo />
        <Services />
        <HowItWorks />
        <Showcase />
        <VisualGallery />
        <Benefits />
        <About />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
