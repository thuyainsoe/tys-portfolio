import { PROJECTS } from "../constants";
import { motion } from "framer-motion";

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
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      >
        {PROJECTS.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full"
          >
            {/* Title above the image */}
            <h6 className="text-white font-semibold text-xl mb-4 text-left">
              {project.title}
            </h6>

            {/* Image container with hover/touch effects */}
            <div className="relative w-full aspect-[3/2] shadow-lg overflow-hidden rounded-xl group cursor-pointer active:scale-[0.98] transition-transform duration-150">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
              />

              {/* Overlay with description and tech stack */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 lg:p-6 text-center"
              >
                <p className="text-white text-sm lg:text-base mb-3 lg:mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {project.technologies?.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="rounded-full bg-white/90 px-2 py-1 lg:px-3 lg:py-1 text-xs font-medium text-black"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Projects;
