import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Projects from "./components/Projects";
import NavBar from "./components/Navbar";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="experience">
        <Experience />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="education">
        <Education />
      </section>
    </main>
  );
};

export default App;
