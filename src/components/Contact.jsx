import React from "react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="mb-20 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="text-center text-4xl mb-10 lg:mb-15"
      >
        Get in Touch
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="my-4 text-neutral-400"
        >
          Feel free to reach out for collaborations or just a friendly hello!
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          href="mailto:thuyainsoe163361@gmail.com"
          className="text-white hover:text-purple-300 transition-colors"
        >
          thuyainsoe163361@gmail.com
        </motion.a>
      </motion.div>
    </div>
  );
};

export default Contact;
