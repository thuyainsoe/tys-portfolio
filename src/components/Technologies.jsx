import React from "react";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiSass,
  SiNodedotjs,
  SiVuedotjs,
  SiTailwindcss,
  SiRedux,
  SiGit,
  SiVite,
  SiGraphql,
  SiWordpress,
  SiPhp,
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import { motion } from "framer-motion";

const Technologies = () => {
  const technologies = [
    {
      name: "React",
      icon: <SiReact className="w-12 h-12" />,
      color: "text-blue-400",
    },
    {
      name: "Next.js",
      icon: <SiNextdotjs className="w-12 h-12" />,
      color: "text-white",
    },
    {
      name: "TypeScript",
      icon: <SiTypescript className="w-12 h-12" />,
      color: "text-blue-600",
    },
    {
      name: "JavaScript",
      icon: <SiJavascript className="w-12 h-12" />,
      color: "text-yellow-400",
    },
    {
      name: "Vue.js",
      icon: <SiVuedotjs className="w-12 h-12" />,
      color: "text-green-500",
    },
    {
      name: "HTML5",
      icon: <SiHtml5 className="w-12 h-12" />,
      color: "text-orange-500",
    },
    {
      name: "CSS3",
      icon: <SiCss3 className="w-12 h-12" />,
      color: "text-blue-500",
    },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss className="w-12 h-12" />,
      color: "text-cyan-400",
    },
    {
      name: "Sass",
      icon: <SiSass className="w-12 h-12" />,
      color: "text-pink-500",
    },
    {
      name: "Redux",
      icon: <SiRedux className="w-12 h-12" />,
      color: "text-purple-500",
    },
    {
      name: "Node.js",
      icon: <SiNodedotjs className="w-12 h-12" />,
      color: "text-green-600",
    },
    {
      name: "GraphQL",
      icon: <SiGraphql className="w-12 h-12" />,
      color: "text-pink-400",
    },
    {
      name: "Git",
      icon: <SiGit className="w-12 h-12" />,
      color: "text-orange-600",
    },
    {
      name: "Vite",
      icon: <SiVite className="w-12 h-12" />,
      color: "text-yellow-500",
    },
    {
      name: "WordPress",
      icon: <SiWordpress className="w-12 h-12" />,
      color: "text-blue-600",
    },
    {
      name: "PHP",
      icon: <SiPhp className="w-12 h-12" />,
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="mb-20 lg:mb-40">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="lg:text-center text-4xl mb-10 lg:mb-15 text-left"
      >
        Technologies
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-6 justify-items-center"
      >
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className=" flex flex-col items-center gap-3 px-4 py-4 lg:py-0 rounded-xl  transition-all duration-300 hover:scale-105"
          >
            <div className={tech.color}>{tech.icon}</div>
            <span className="font-light tracking-tighter text-neutral-300 text-sm">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Technologies;
