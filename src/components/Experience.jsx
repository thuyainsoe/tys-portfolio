import React from "react";
import { EXPERIENCES } from "../constants";
import { motion } from "framer-motion";

const Experience = () => {
  return (
    <div className="mb-20 lg:mb-40 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="lg:text-center text-4xl mb-15 text-left"
      >
        Experiences
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-left"
      >
        {EXPERIENCES.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="mb-8 flex flex-wrap lg:justify-center"
          >
            <div className="w-full lg:w-1/4">
              <p className="mb-2 text-sm text-neutral-400">{exp.year}</p>
            </div>
            <div className="w-full max-w-xl lg:w-3/4">
              <h6 className="mb-2 font-medium">
                {exp.role} -{" "}
                <span className="text-sm text-purple-100">{exp.company}</span>
              </h6>
              <p className="mb-4 text-neutral-400">{exp.description}</p>
              {exp.technologies?.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="mr-2 mt-4 rounded bg-white/90 px-2 py-1 text-xs font-medium text-black"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Experience;
