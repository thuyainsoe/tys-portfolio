import { useRef } from "react";
import { Github, Link as LinkIcon, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 1,
    title: "Inventory Management System",
    description:
      "A full-stack application built with NestJS and React, designed to manage users, products, and purchase orders. The project is still in progress and serves as a practical learning experience while I explore and improve my skills with NestJS. It demonstrates my ability to structure backend APIs, integrate them with a React frontend, and build scalable features step by step.",
    techStack: ["NestJS", "React", "TypeScript", "PostgreSQL"],
    repoLink: "https://github.com/thuyainsoe/inventory-management",
    accent: "cyan",
  },
  {
    id: 2,
    title: "Fototapety",
    description:
      "An e-commerce platform for selling wallpapers and stickers, featuring product browsing, checkout, and secure payment integration for a smooth shopping experience.",
    techStack: ["NextJS", "TypeScript", "Tailwind", "Laravel", "MySQL"],
    liveLink: "https://fototapety-one.vercel.app/",
    accent: "yellow",
  },
  {
    id: 3,
    title: "Uni China",
    description:
      "Contributed to the UI development of a corporate site showcasing Uni-China Group's 25-year business presence across retail, food trading, and F&B. Focused on responsive design, clean layout, and modern frontend practices",
    techStack: ["HTML", "CSS", "Wordpress", "Javascript", "PHP"],
    liveLink: "https://uni-china.com/",
    accent: "cyan",
  },
  {
    id: 4,
    title: "E-Commerce Website",
    description:
      "A fully functional e-commerce website with features like product listing, shopping cart, and user authentication.",
    techStack: ["HTML", "CSS", "React", "Node.js", "MongoDB"],
    repoLink: "https://github.com/thuyainsoe/neobyte",
    liveLink: "http://neobyte.vercel.app/",
    accent: "yellow",
  },
];

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const { title, description, techStack, liveLink, repoLink, accent } = project;

  const accentColors = {
    cyan: {
      border: "border-cyan-400/30",
      glow: "shadow-cyan-500/20",
      text: "text-cyan-400",
      bg: "from-cyan-500/10 to-transparent",
      number: "text-cyan-400/20",
      hover: "hover:border-cyan-400/50 hover:shadow-cyan-500/30",
    },
    yellow: {
      border: "border-yellow-400/30",
      glow: "shadow-yellow-500/20",
      text: "text-yellow-400",
      bg: "from-yellow-500/10 to-transparent",
      number: "text-yellow-400/20",
      hover: "hover:border-yellow-400/50 hover:shadow-yellow-500/30",
    },
  };

  const colors = accentColors[accent];

  useGSAP(
    () => {
      const card = cardRef.current;

      // Initial state
      gsap.set(card, { y: 50, opacity: 0 });

      // Scroll animation
      gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Mouse move parallax effect
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
          rotateX: -rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl border ${colors.border} ${colors.hover} bg-zinc-900/50 p-8 shadow-2xl ${colors.glow} backdrop-blur-sm transition-all duration-300`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Animated gradient background */}
      <div
        className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${colors.bg} opacity-30 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-50`}
      />

      {/* Project number watermark */}
      <div
        className={`special-font pointer-events-none absolute -right-8 -top-4 select-none text-[12rem] font-black leading-none ${colors.number} transition-all duration-500 group-hover:scale-110`}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title with accent */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className={`special-font text-3xl font-bold text-white transition-colors duration-300 ${colors.text}`}>
            {title}
          </h3>
          <div className="flex gap-2">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex size-10 items-center justify-center rounded-lg border ${colors.border} bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${colors.hover}`}
                aria-label="Live site"
              >
                <ArrowUpRight size={18} className={colors.text} />
              </a>
            )}
            {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex size-10 items-center justify-center rounded-lg border ${colors.border} bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${colors.hover}`}
                aria-label="GitHub repository"
              >
                <Github size={18} className={colors.text} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 font-robert-regular leading-relaxed text-gray-300">
          {description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links section */}
        {(liveLink || repoLink) && (
          <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-6">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${colors.text} hover:gap-3`}
              >
                <LinkIcon size={16} />
                View Live Site
              </a>
            )}
            {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-400 transition-all duration-300 hover:gap-3 hover:text-white"
              >
                <Github size={16} />
                Source Code
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(
    () => {
      // Title animation
      gsap.from(".projects-title", {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Subtitle animation
      gsap.from(".projects-subtitle", {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen w-screen overflow-hidden bg-black py-20 md:py-32"
    >
      {/* Ambient background elements */}
      <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-yellow-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className="mb-16 text-center">
          <h2 className="projects-title special-font mb-4 text-6xl font-black uppercase text-white sm:text-7xl md:text-8xl lg:text-9xl">
            Pro<span className="text-cyan-400">je</span>ct
            <span className="text-yellow-400">s</span>
          </h2>
          <p className="projects-subtitle font-robert-regular mx-auto max-w-2xl text-lg text-gray-400">
            A collection of projects showcasing my skills in full-stack
            development, UI/UX design, and modern web technologies.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
