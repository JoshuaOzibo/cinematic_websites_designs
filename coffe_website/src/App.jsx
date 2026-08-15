import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Collections from './components/Collections'
import Highlight from './components/Highlight'
import TastingNotes from './components/TastingNotes'
import Locations from './components/Locations'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Collections />
        <Highlight />
        <TastingNotes />
        <Locations />
      </main>
      <Footer />
    </>
  )
}
