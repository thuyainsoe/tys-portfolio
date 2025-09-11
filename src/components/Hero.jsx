import profilePic from "../assets/profile-1.png";
import { HERO_CONTENT } from "../constants";
import { delay, motion } from "framer-motion";

const container = (delay) => ({
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: delay,
    },
  },
});

const Hero = () => {
  return (
    <div className="text-left flex flex-col lg:flex-row items-center lg:items-center lg:justify-between mb-16 lg:mb-20 gap-y-8">
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
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="relative w-full  aspect-square lg:w-[80%] lg:h-auto lg:max-w-md"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-full blur-2xl animate-pulse"></div>

            {/* Main image container */}
            <div className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 p-1 rounded-full shadow-2xl w-full h-full">
              <img
                className="w-full h-full object-cover object-center rounded-full border-2 border-neutral-700 transition-all duration-500"
                src={profilePic}
                alt="Thurein Soe - Frontend Developer"
              />

              {/* Subtle overlay for better contrast */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
