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
      "A full-stack application built with NestJS and React, designed to manage users, products, and purchase orders. Demonstrates my ability to structure backend APIs, integrate them with a React frontend, and build scalable features.",
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
      "Contributed to the UI development of a corporate site showcasing Uni-China Group's 25-year business presence. Focused on responsive design, clean layout, and modern frontend practices.",
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

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const { title, description, techStack, liveLink, repoLink } = project;

  useGSAP(
    () => {
      const card = cardRef.current;

      gsap.set(card, { y: 100, opacity: 0 });

      gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Hover animation
      const handleMouseEnter = () => {
        gsap.to(card.querySelector(".project-number"), {
          scale: 1.1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(card.querySelector(".project-line"), {
          scaleX: 1,
          duration: 0.6,
          ease: "power3.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card.querySelector(".project-number"), {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(card.querySelector(".project-line"), {
          scaleX: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className="group relative border-b border-black/10 p-8 transition-colors duration-300 hover:bg-black hover:text-white md:p-12"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-6">
          <div className="project-number special-font text-6xl font-black text-black/10 transition-colors duration-300 group-hover:text-white/20 md:text-8xl">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <h3 className="special-font mb-2 text-2xl font-bold md:text-4xl">
              {title}
            </h3>
            <div className="project-line h-px w-24 origin-left scale-x-0 bg-white" />
          </div>
        </div>
        <div className="flex gap-3">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-black/20 transition-all duration-300 hover:bg-white hover:text-black group-hover:border-white/30 md:size-12"
              aria-label="Live site"
            >
              <ArrowUpRight size={18} />
            </a>
          )}
          {repoLink && (
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-black/20 transition-all duration-300 hover:bg-white hover:text-black group-hover:border-white/30 md:size-12"
              aria-label="GitHub repository"
            >
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="ml-0 md:ml-32">
        <p className="font-robert-regular mb-6 max-w-3xl text-sm leading-relaxed text-black/70 transition-colors duration-300 group-hover:text-white/80 md:text-base">
          {description}
        </p>

        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="font-robert-regular rounded-full border border-black/10 px-4 py-1.5 text-xs uppercase tracking-wide transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        {(liveLink || repoLink) && (
          <div className="mt-6 flex flex-wrap gap-6 border-t border-black/10 pt-6 transition-colors duration-300 group-hover:border-white/10">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-robert-regular flex items-center gap-2 text-sm uppercase tracking-wide transition-all duration-300 hover:translate-x-1"
              >
                <LinkIcon size={14} />
                View Live
              </a>
            )}
            {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-robert-regular flex items-center gap-2 text-sm uppercase tracking-wide text-black/60 transition-all duration-300 hover:translate-x-1 group-hover:text-white/60"
              >
                <Github size={14} />
                Source
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

      gsap.from(".projects-line", {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        scaleX: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen w-screen overflow-hidden bg-white py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="mb-20 text-center">
          <h2 className="projects-title special-font mb-6 text-6xl font-black uppercase md:text-8xl lg:text-9xl">
            Selected Work
          </h2>
          <div className="mx-auto h-px w-32 origin-center bg-black projects-line" />
        </div>

        <div className="divide-y divide-black/10">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
