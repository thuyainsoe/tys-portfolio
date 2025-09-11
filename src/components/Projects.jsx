import { PROJECTS } from "../constants";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const Projects = () => {
  return (
    <div className="mb-20 lg:mb-40 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="lg:text-center text-4xl mb-10 lg:mb-15 text-left"
      >
        Projects
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-12 lg:space-y-16"
      >
        {PROJECTS.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full"
          >
            {/* Image container */}
            <div className="w-full lg:w-1/2 aspect-[893/475] overflow-hidden rounded-xl border border-neutral-800">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-contain object-center"
              />
            </div>

            {/* Content section */}
            <div className="w-full lg:w-1/2 space-y-3 flex flex-col justify-center">
              {/* Title */}
              <h3 className="text-white font-medium text-lg text-left">
                {project.title}
              </h3>
              
              {/* Description */}
              <p className="text-neutral-400 text-sm text-left leading-relaxed">
                {project.description}
              </p>
              
              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {project.technologies?.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 text-xs text-neutral-400 bg-neutral-900/50 rounded border border-neutral-800/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Links section */}
              {(project.github || project.demo) && (
                <div className="flex gap-4 text-xs">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                    >
                      <FaGithub className="w-3 h-3" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                    >
                      <FaExternalLinkAlt className="w-3 h-3" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Projects;
