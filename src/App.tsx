import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Preloader from "./components/layout/Preloader";
import CustomCursor from "./components/layout/CustomCursor";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Gallery from "./components/sections/Gallery";
import Blog from "./components/sections/Blog";
import Contact from "./components/sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);

  // Locks background scroll while the preloader covers the screen, ported
  // from the original site's useLockBodyScroll behaviour on first paint.
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      {loading && <Preloader onDone={() => setLoading(false)} />}

      <CustomCursor />

      <a href="#hero" className="skip-link">
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Gallery />
        <Blog />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
