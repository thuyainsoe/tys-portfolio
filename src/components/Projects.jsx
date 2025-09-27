import { useRef, useCallback } from "react";
import { Github, Link as LinkIcon } from "lucide-react";
import AnimatedTitle from "./AnimatedTitle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

// Particle Library Imports
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

gsap.registerPlugin(ScrollTrigger);

// Your ProjectCard, BentoTilt, and projectsData components remain unchanged from the previous version
export const ProjectCard = ({
  title,
  description,
  techStack,
  liveLink,
  repoLink,
}) => (
  <div className="relative size-full">
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
    <div className="relative z-10 flex size-full flex-col justify-end p-4 text-white md:p-6">
      <div>
        <h1 className="bento-title special-font text-2xl font-bold md:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/80 md:text-base">
          {description}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        {liveLink && (
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:text-blue-400"
          >
            <LinkIcon size={16} />
            Live Site
          </a>
        )}
        {repoLink && (
          <a
            href={repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:text-gray-400"
          >
            <Github size={16} />
            Source Code
          </a>
        )}
      </div>
    </div>
  </div>
);
export const BentoTilt = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);
const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce platform with real-time product search and a Stripe-powered checkout system.",
    techStack: ["Next.js", "TypeScript", "NestJS", "PostgreSQL"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    id: 2,
    title: "Portfolio Website",
    description:
      "A personal portfolio website built with advanced GSAP animations and a focus on creating a memorable user experience.",
    techStack: ["React", "GSAP", "Framer Motion", "Tailwind CSS"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    id: 3,
    title: "Task Management App",
    description:
      "A Kanban-style task management app with a simple drag-and-drop interface for organizing tasks.",
    techStack: ["React", "Redux Toolkit", "Node.js", "MongoDB"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    id: 4,
    title: "Weather Dashboard",
    description:
      "A clean weather dashboard using the OpenWeatherMap API for real-time data visualization.",
    techStack: ["JavaScript", "Chart.js", "API", "HTML5 & CSS3"],
    liveLink: "#",
    repoLink: "#",
  },
];

const backgroundColors = [
  "bg-slate-900", // E-commerce အတွက်
  "bg-purple-950", // Portfolio အတွက် (Tailwind CSS မှာမပါရင် tailwind.config.js မှာ extend လုပ်ပါ)
  "bg-emerald-950", // Task App အတွက်
  "bg-sky-950", // Weather App အတွက်
];

const particleConfigs = [
  {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: 2 },
      links: {
        enable: true,
        distance: 150,
        color: "#6366f1",
        opacity: 0.2,
        width: 1,
      },
      move: { enable: true, speed: 1.5, direction: "none", out_mode: "out" },
    },
  },
  // Config 2: Portfolio (Creative Flow on a dark purple background)
  {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: ["circle", "triangle"] },
      opacity: { value: 0.2 },
      size: { value: { min: 1, max: 4 }, random: true },
      move: {
        enable: true,
        speed: 3,
        direction: "bottom-right",
        out_mode: "out",
      },
    },
  },
  // Config 3: Task App (Organized Grid on a dark green background)
  {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "edge" },
      opacity: { value: 0.4 },
      size: { value: 1.5 },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        straight: true,
        out_mode: "bounce",
      },
    },
  },
  // Config 4: Weather App (Rising Bubbles on a dark blue background)
  {
    particles: {
      number: { value: 25, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true },
      size: { value: { min: 2, max: 6 }, random: true },
      move: { enable: true, speed: 1.5, direction: "top", out_mode: "out" },
    },
  },
];

// Main Features Component
const Projects = () => {
  const mainRef = useRef(null);
  const particlesInit = useCallback(
    async (engine) => await loadSlim(engine),
    []
  );
  useGSAP(
    () => {
      gsap.set(".project-panel:not(:first-child)", { yPercent: 100 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          pin: true,
          start: "top top",
          end: `+=${projectsData.length * 1000}`,
          scrub: 1,
        },
      });
      tl.to(".projects-title-container", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
      projectsData.forEach((_, index) => {
        if (index > 0) {
          tl.to(
            `.project-panel-${index}`,
            { yPercent: 0, ease: "power2.inOut" },
            `project${index}`
          );
        }
      });
    },
    { scope: mainRef }
  );

  return (
    <section
      ref={mainRef}
      id="projects"
      className="relative min-h-screen w-screen overflow-hidden bg-black"
    >
      {/* Title Screen */}
      <div className="projects-title-container pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <AnimatedTitle
          title="My <b>Pro</b>jects"
          containerClass="!text-black text-center hero-heading special-font"
        />
        <p className="mt-4 max-w-2xl text-center text-base text-black/60 md:text-lg">
          Scroll down to explore my work.
        </p>
      </div>

      {/* Project Panels Wrapper */}
      <div className="projects-wrapper absolute inset-0">
        {projectsData.map((project, index) => (
          <div
            key={project.id}
            // ✨ 3. သက်ဆိုင်ရာ background color class ကို ဒီနေရာမှာ ထည့်သွင်းခြင်း
            className={`project-panel project-panel-${index} absolute inset-0 ${
              backgroundColors[index % backgroundColors.length]
            }`}
            style={{ zIndex: 10 + index }}
          >
            {/* Layer 0: Unique Particle Background */}
            <Particles
              id={`tsparticles-${project.id}`}
              init={particlesInit}
              options={particleConfigs[index % particleConfigs.length]}
              className="absolute inset-0 z-0"
            />

            {/* Layer 1: Project Content */}
            <div className="relative z-10 h-full w-full">
              <BentoTilt className="h-full w-full p-4 md:p-8">
                <ProjectCard {...project} />
              </BentoTilt>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
