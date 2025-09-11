import React from "react";
import { ABOUT_TEXT } from "../constants";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="mb-20 lg:mb-40 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="lg:text-center text-4xl mb-15 text-left"
      >
        About Me
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col lg:flex-row w-full justify-between  items-center gap-y-5"
      >
        <div className="w-full justify-center items-center text-left mx-auto">
          <p className="font-light tracking-normal leading-[170%] w-full text-left  mx-auto">
            {ABOUT_TEXT}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
