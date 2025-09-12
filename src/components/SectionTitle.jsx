import { motion } from "framer-motion";

const SectionTitle = ({ title, subtitle, centered = false }) => {
  return (
    <div className={`mb-8 lg:mb-10 ${centered ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-2"
      >
        <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-white">
          {title}
        </h1>
        
        <div className={`w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 ${
          centered ? 'mx-auto' : ''
        }`}></div>
        
        {subtitle && (
          <p className="text-neutral-400 text-sm mt-2">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default SectionTitle;