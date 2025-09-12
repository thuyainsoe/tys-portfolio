import { PROJECTS } from "../constants";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import SectionTitle from "./SectionTitle";

const Projects = () => {
  return (
    <div className="mb-16 lg:mb-20 w-full">
      <SectionTitle
        title="Projects"
        subtitle="A showcase of my recent work and contributions"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4 lg:space-y-6"
      >
        {PROJECTS.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 lg:p-8 hover:border-neutral-700 transition-colors duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
              <div className="w-full lg:w-1/2 aspect-[893/475] overflow-hidden rounded-xl border border-neutral-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain object-center"
                />
              </div>

              <div className="w-full lg:w-1/2 space-y-3 flex flex-col justify-center">
                <h3 className="text-white font-medium text-lg text-left">
                  {project.title}
                </h3>

                <p className="text-neutral-400 text-sm text-left leading-relaxed">
                  {project.description}
                </p>

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
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Projects;