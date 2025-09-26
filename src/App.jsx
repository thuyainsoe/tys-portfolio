import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Hero />
      <About />
      <Experience />
      <div className="h-screen w-screen "></div>
    </main>
  );
};

export default App;
