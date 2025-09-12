import profilePic from "../assets/dev-nobg.png";
import { HERO_CONTENT } from "../constants";
import { motion } from "framer-motion";

const container = (delay) => ({
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: delay,
      ease: "easeOut",
    },
  },
});

const Hero = () => {
  return (
    <div
      className="text-left flex flex-col lg:flex-row items-center lg:items-center lg:justify-between mb-16 lg:mb-20 gap-y-8"
      style={{ transform: "translateZ(0)" }}
    >
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
        <motion.h1
          variants={container(0)}
          initial="hidden"
          animate="visible"
          className="pb-8 text-6xl font-thin tracking-tight  lg:text-8xl text-left w-full"
        >
          Thurein Soe
        </motion.h1>
        <motion.p
          variants={container(0.5)}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r w-full from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl lg:text-4xl tracking-tight text-transparent mb-4"
        >
          Frontend Developer
        </motion.p>
        <motion.div
          variants={container(1)}
          initial="hidden"
          animate="visible"
          className="my-2  py-2 font-light tracking-normal leading-[170%] w-full text-left"
        >
          <p className="text-neutral-400 text-sm leading-relaxed">
            {HERO_CONTENT}
          </p>
        </motion.div>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="relative w-full aspect-square lg:w-[80%] lg:h-auto lg:max-w-lg"
          >
            {/* Main image container */}
            <div className="relative  rounded-full  w-full h-full">
              <img
                className="w-full h-full object-cover object-center rounded-full  transition-all duration-500"
                src={profilePic}
                alt="Thu Yain Soe - Frontend Developer"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
