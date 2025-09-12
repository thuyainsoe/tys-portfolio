import React from "react";
import { ABOUT_TEXT } from "../constants";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";

const About = () => {
  return (
    <div className="mb-16 lg:mb-20 w-full">
      <SectionTitle
        title="About Me"
        subtitle="Get to know more about my background and experience"
      />
      <motion.div
        initial={{ y: 30, scale: 0.95 }}
        whileInView={{ y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 lg:p-8 hover:border-neutral-700 transition-colors duration-300"
        style={{transform: 'translateZ(0)'}}
      >
        <div className="space-y-4">
          <p className="text-neutral-400 text-sm leading-relaxed text-left">
            {ABOUT_TEXT}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
