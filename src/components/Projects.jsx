import { useRef, useCallback } from "react";
import { Github, Link as LinkIcon } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

gsap.registerPlugin(ScrollTrigger);

export const ProjectCard = ({
  projectNumber,
  title,
  description,
  techStack,
  liveLink,
  repoLink,
}) => {
  return (
    <div className="relative size-full overflow-hidden">
      <div
        aria-hidden="true"
        className={`special-font pointer-events-none absolute -top-1/4 right-0 select-none text-[40rem] font-black leading-none tracking-tighter opacity-30 ${
          projectNumber === "01" || projectNumber === "03"
            ? "text-[#e0b800]"
            : "text-[#00d1db]"
        }`}
      >
        {projectNumber}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div
        onClick={() => {
          console.log("lee");
        }}
        className="relative z-10 flex size-full flex-col justify-end p-4 text-white md:p-6 lg:p-8"
      >
        <div>
          <h1 className="bento-title special-font text-2xl font-bold md:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="project-description font-robert-regular mt-2 max-w-2xl text-sm text-white/80 md:text-base">
            {description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="tech-tag rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
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
              className="project-link flex items-center gap-2 text-sm transition-colors hover:text-yellow-300"
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
              className="project-link flex items-center gap-2 text-sm transition-colors hover:text-gray-400"
            >
              <Github size={16} />
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const BentoTilt = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const projectsData = [
  {
    id: 1,
    title: "Inventory Management System",
    description:
      "A full-stack application built with NestJS and React, designed to manage users, products, and purchase orders. The project is still in progress and serves as a practical learning experience while I explore and improve my skills with NestJS. It demonstrates my ability to structure backend APIs, integrate them with a React frontend, and build scalable features step by step.",
    techStack: ["NestJS", "React", "TypeScript", "PostgreSQL"],
    repoLink: "https://github.com/thuyainsoe/inventory-management",
  },
  {
    id: 2,
    title: "Fototapety",
    description:
      "An e-commerce platform for selling wallpapers and stickers, featuring product browsing, checkout, and secure payment integration for a smooth shopping experience.",
    techStack: ["NextJS", "TypeScript", "Tailwind", "Laravel", "MySQL"],
    liveLink: "https://fototapety-one.vercel.app/",
  },
  {
    id: 3,
    title: "Uni China",
    description:
      "Contributed to the UI development of a corporate site showcasing Uni-China Group’s 25-year business presence across retail, food trading, and F&B. Focused on responsive design, clean layout, and modern frontend practices",
    techStack: ["HTML", "CSS", "Wordpress", "Javascript", "PHP"],
    liveLink: "https://uni-china.com/",
  },
  {
    id: 4,
    title: "E-Commerce Website",
    description:
      "A fully functional e-commerce website with features like product listing, shopping cart, and user authentication.",
    techStack: ["HTML", "CSS", "React", "Node.js", "MongoDB"],
    repoLink: "https://github.com/thuyainsoe/neobyte",
    liveLink: "http://neobyte.vercel.app/",
  },
];

const backgroundColors = [
  "bg-zinc-900", // Project 1
  "bg-zinc-950", // Project 2
  "bg-zinc-900", // Project 3
  "bg-zinc-950", // Project 4
];

const particleConfigs = [
  // Config 1 (Yellow Accent)
  {
    particles: {
      number: { value: 60 },
      color: { value: "#ffffff" },
      opacity: { value: 0.3 },
      size: { value: 2 },
      links: {
        enable: true,
        distance: 150,
        color: "#f5d63d",
        opacity: 0.2,
        width: 1,
      },
      move: { enable: true, speed: 1.5 },
    },
  },
  // Config 2 (Red Accent)
  {
    particles: {
      number: { value: 40 },
      color: { value: "#ff4747" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: { min: 1, max: 4 }, random: true },
      move: {
        enable: true,
        speed: 3,
        direction: "bottom-right",
        out_mode: "out",
      },
    },
  },
  // Config 3 (Yellow Accent)
  {
    particles: {
      number: { value: 50 },
      color: { value: "#ffffff" },
      shape: { type: "edge" },
      opacity: { value: 0.4 },
      size: { value: 1.5 },
      move: { enable: true, speed: 1, straight: true, out_mode: "bounce" },
    },
  },
  // Config 4 (Red Accent)
  {
    particles: {
      number: { value: 25 },
      color: { value: "#ff4747" },
      shape: { type: "circle" },
      opacity: { value: 0.6, random: true },
      size: { value: { min: 2, max: 6 }, random: true },
      move: { enable: true, speed: 1.5, direction: "top", out_mode: "out" },
    },
  },
];

const Projects = () => {
  const mainRef = useRef(null);
  const particlesInit = useCallback(
    async (engine) => await loadSlim(engine),
    []
  );

  useGSAP(
    () => {
      gsap.set(".project-panel:not(:first-child)", { yPercent: 100 });
      gsap.set(".bento-title", { xPercent: 100, opacity: 0 });
      gsap.set(".project-description", { yPercent: 50, opacity: 0 });
      gsap.set([".tech-tag", ".project-link"], { yPercent: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          pin: true,
          start: "top top",
          end: `+=${projectsData.length * 1000}`,
          scrub: 1,
        },
      });

      // Title Doors Animation
      tl.to(
        ".clip-triangle-top-project",
        { xPercent: -100, ease: "power2.inOut" },
        "+=0.5"
      );
      tl.to(
        ".clip-triangle-bottom-project",
        { xPercent: 100, ease: "power2.inOut" },
        "<"
      );

      tl.set(".experience-title-container", { zIndex: 1 });

      tl.to(
        ".project-panel-0 .bento-title",
        { xPercent: 0, opacity: 1, ease: "power3.out", duration: 1 },
        ">-0.5"
      )
        .to(
          ".project-panel-0 .project-description",
          { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.8 },
          "<0.2"
        )
        .to(
          ".project-panel-0 .tech-tag",
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.05,
            ease: "power2.out",
            duration: 0.5,
          },
          "<0.3"
        )
        .to(
          ".project-panel-0 .project-link",
          { yPercent: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
          "<"
        );

      projectsData.forEach((_, index) => {
        if (index > 0) {
          const panelSelector = `.project-panel-${index}`;
          tl.to(
            panelSelector,
            { yPercent: 0, ease: "power2.inOut" },
            `project${index}`
          );

          tl.to(
            `${panelSelector} .bento-title`,
            { xPercent: 0, opacity: 1, ease: "power3.out", duration: 1 },
            "<0.5"
          )
            .to(
              `${panelSelector} .project-description`,
              { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.8 },
              "<0.2"
            )
            .to(
              `${panelSelector} .tech-tag`,
              {
                yPercent: 0,
                opacity: 1,
                stagger: 0.05,
                ease: "power2.out",
                duration: 0.5,
              },
              "<0.3"
            )
            .to(
              `${panelSelector} .project-link`,
              { yPercent: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
              "<"
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
      <div className="experience-title-container absolute inset-0 z-50">
        <div className="clip-triangle-top-project absolute inset-0 flex-center bg-white">
          <video
            src={"/videos/hero-2.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-50"></div>
          <div className="relative z-10 special-font text-center font-zentry text-7xl font-black uppercase !text-[#00f6ff] sm:text-9xl md:text-8xl lg:text-[10rem]">
            Pro<b>je</b>ct<b>s</b>
          </div>
        </div>
        <div className="clip-triangle-bottom-project absolute inset-0 flex-center bg-white">
          <video
            src={"/videos/hero-2.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-50"></div>
          <div className="relative z-10 special-font text-center font-zentry text-7xl font-black uppercase !text-[#f5d63d] sm:text-9xl md:text-8xl lg:text-[10rem]">
            Pro<b>je</b>ct<b>s</b>
          </div>
        </div>
      </div>

      <div className="projects-wrapper absolute inset-0">
        {projectsData.map((project, index) => (
          <div
            key={project.id}
            className={`project-panel project-panel-${index} absolute inset-0 ${backgroundColors[index]}`}
            style={{ zIndex: 10 + index }}
          >
            <Particles
              id={`tsparticles-${project.id}`}
              init={particlesInit}
              options={particleConfigs[index]}
              className="absolute inset-0 z-0"
            />
            <div className="relative z-10 h-full w-full">
              <BentoTilt className="h-full w-full p-4 md:p-8">
                <ProjectCard
                  {...project}
                  projectNumber={String(index + 1).padStart(2, "0")}
                />
              </BentoTilt>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
