import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { Github, Link as LinkIcon } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// Mock Data
const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    image: "/images/project-1.png",
    description:
      "A full-stack e-commerce platform with real-time product search, user authentication, and a Stripe-powered checkout system.",
    tech: ["Next.js", "TypeScript", "NestJS", "PostgreSQL", "Tailwind CSS"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    id: 2,
    title: "Portfolio Website",
    image: "/images/project-2.png",
    description:
      "A personal portfolio website built with advanced GSAP animations and a focus on creating a memorable user experience.",
    tech: ["React", "GSAP", "Framer Motion", "Tailwind CSS"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    id: 3,
    title: "Task Management App",
    image: "/images/project-3.png",
    description:
      "A Kanban-style task management app with a simple drag-and-drop interface for organizing and tracking tasks.",
    tech: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB"],
    liveLink: "#",
    repoLink: "#",
  },
  {
    id: 4,
    title: "Weather Dashboard",
    image: "/images/project-4.png",
    description:
      "A clean weather dashboard using the OpenWeatherMap API and Chart.js for real-time data visualization.",
    tech: ["JavaScript (ES6+)", "Chart.js", "API Integration", "HTML5 & CSS3"],
    liveLink: "#",
    repoLink: "#",
  },
];

// Reusable Project Card Component
const ProjectCard = ({ className, children }) => (
  // ✨ RESPONSIVE: Full width & half height on mobile, half width & full height on desktop
  <div className={`w-full md:w-1/2 h-1/2 md:h-full p-2 md:p-4 ${className}`}>
    <div className="flex h-full w-full flex-col p-2">{children}</div>
  </div>
);

const Projects = () => {
  const main = useRef();

  useGSAP(
    () => {
      // ✨ RESPONSIVE ANIMATIONS using matchMedia
      gsap.matchMedia(main).add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          let { isDesktop } = context.conditions;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: main.current,
              pin: true,
              start: "top top",
              end: "+=3000",
              scrub: 1,
            },
          });

          // --- Title Animation (Faster & improved UX) ---
          tl.to(".projects-title", { opacity: 0, duration: 0.5 }, "<0.2");

          if (isDesktop) {
            // --- DESKTOP: Top/Bottom Entrance ---
            gsap.set(".project-1", { yPercent: -100, opacity: 1 });
            gsap.set(".project-2", { yPercent: 100, opacity: 1 });
            gsap.set(".project-3", { yPercent: -100, opacity: 1 });
            gsap.set(".project-4", { yPercent: 100, opacity: 1 });
            gsap.set(".screen-2", { xPercent: 100 });

            tl.to([".project-1", ".project-2"], {
              yPercent: 0,
              opacity: 1,
              stagger: 0.1,
              ease: "power2.out",
            });

            tl.to([".p-title-1", ".p-desc-1", ".p-title-2", ".p-desc-2"], {
              backgroundPosition: "0% 0",
              stagger: 0.1,
              ease: "none",
            });

            tl.to(".screen-1", { xPercent: 0, ease: "power2.inOut" });
            tl.to(".screen-2", { xPercent: 0, ease: "power2.inOut" }, "<");

            tl.to([".project-1"], {
              yPercent: 100,
              opacity: 1,
              stagger: 0.1,
              ease: "power2.out",
            });

            tl.to(
              [".project-2"],
              {
                yPercent: -100,
                opacity: 1,
                stagger: 0.1,
                ease: "power2.out",
              },
              "<"
            );

            tl.to(
              [".project-3", ".project-4"],
              {
                yPercent: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "power2.out",
              },
              "<"
            );

            tl.to([".p-title-3", ".p-desc-3", ".p-title-4", ".p-desc-4"], {
              backgroundPosition: "0% 0",
              stagger: 0.1,
              ease: "none",
            });
          } else {
            // isMobile
            // --- MOBILE: Left/Right Entrance ---
            gsap.set(".project-1", { xPercent: -100, opacity: 0 });
            gsap.set(".project-2", { xPercent: 100, opacity: 0 });
            gsap.set(".project-3", { xPercent: -100, opacity: 0 });
            gsap.set(".project-4", { xPercent: 100, opacity: 0 });
            gsap.set(".screen-2", { yPercent: 100 }); // Mobile scrolls vertically between screens

            tl.to([".project-1", ".project-2"], {
              xPercent: 0,
              opacity: 1,
              stagger: 0.1,
              ease: "power2.out",
            });
            tl.to([".p-title-1", ".p-desc-1", ".p-title-2", ".p-desc-2"], {
              backgroundPosition: "0% 0",
              stagger: 0.1,
              ease: "none",
            });

            tl.to(".screen-1", { yPercent: 0, ease: "power2.inOut" });
            tl.to(".screen-2", { yPercent: 0, ease: "power2.inOut" }, "<");

            tl.to([".project-1"], {
              xPercent: 100,
              opacity: 1,
              stagger: 0.1,
              ease: "power2.out",
            });

            tl.to(
              [".project-2"],
              {
                xPercent: -100,
                opacity: 1,
                stagger: 0.1,
                ease: "power2.out",
              },
              "<"
            );

            tl.to(
              [".project-3", ".project-4"],
              {
                xPercent: 0,
                opacity: 1,
                stagger: 0.1,
                ease: "power2.out",
              },
              "<"
            );

            tl.to([".p-title-3", ".p-desc-3", ".p-title-4", ".p-desc-4"], {
              backgroundPosition: "0% 0",
              stagger: 0.1,
              ease: "none",
            });
          }
        }
      );
    },
    { scope: main }
  );

  const renderProjectContent = (project) => (
    <>
      <div className="h-2/5 md:h-1/2 w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="size-full object-cover"
        />
      </div>
      <div className="flex h-3/5 md:h-1/2 flex-col pt-4">
        <h2
          className={`p-title-${project.id} text-reveal special-font text-2xl md:text-3xl font-bold tracking-tight text-white`}
        >
          {project.title}
        </h2>
        <p
          className={`p-desc-${project.id} text-reveal font-robert-regular mt-1 text-sm text-white/80`}
        >
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
          >
            <LinkIcon size={18} /> Live Site
          </a>
          <a
            href={project.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
          >
            <Github size={18} /> Code
          </a>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={main}
      id="projects"
      className="relative min-h-screen w-screen overflow-hidden bg-white"
    >
      <div className="projects-title pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white">
        <h1 className="special-font font-zentry text-center text-7xl font-black uppercase text-black sm:text-9xl md:text-[10rem]">
          Pro<b>je</b>cts
        </h1>
      </div>

      {/* This container will hold the sliding screens */}
      <div className="projects-filmstrip relative h-screen w-full bg-zinc-900">
        {/* Screen 1 */}
        <div className="screen-1 absolute inset-0 z-10 flex h-full w-full flex-col items-center md:flex-row">
          <ProjectCard
            project={projectsData[0]}
            className="project-1 bg-zinc-900"
          >
            {renderProjectContent(projectsData[0])}
          </ProjectCard>
          <ProjectCard
            project={projectsData[1]}
            className="project-2 bg-zinc-900"
          >
            {renderProjectContent(projectsData[1])}
          </ProjectCard>
        </div>

        {/* Screen 2 */}
        <div className="screen-2 absolute inset-0 z-20 flex h-full w-full flex-col items-center md:flex-row">
          <ProjectCard
            project={projectsData[2]}
            className="project-3 bg-zinc-900"
          >
            {renderProjectContent(projectsData[2])}
          </ProjectCard>
          <ProjectCard
            project={projectsData[3]}
            className="project-4 bg-zinc-900"
          >
            {renderProjectContent(projectsData[3])}
          </ProjectCard>
        </div>
      </div>
    </div>
  );
};

export default Projects;
