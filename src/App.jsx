import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Education from "./components/Education";
import Projects from "./components/Projects";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Hero />
      <About />
      <Experience />
      <Education />
      <Projects />
    </main>
  );
};

export default App;
