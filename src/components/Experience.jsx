import React from "react";
import { EXPERIENCES } from "../constants";
import SectionTitle from "./SectionTitle";

const Experience = () => {
  return (
    <div className="mb-16 lg:mb-20 w-full">
      <SectionTitle
        title="Experience"
        subtitle="My professional journey and career highlights"
      />
      <div className="space-y-4 lg:space-y-6 text-left">
        {EXPERIENCES.map((exp, index) => (
          <div
            key={index}
            className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 lg:p-8 hover:border-neutral-700 transition-colors duration-300"
          >
            <div className="space-y-4">
              {/* Header section with year, role, and company */}
              <div className="space-y-2">
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                  {exp.year}
                </p>
                <h3 className="text-white font-medium text-lg">{exp.role}</h3>
                <a
                  href={exp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium inline-block"
                >
                  @ {exp.company}
                </a>
              </div>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-relaxed">
                {exp.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.technologies?.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 text-xs text-neutral-400 bg-neutral-900/50 rounded border border-neutral-800/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;