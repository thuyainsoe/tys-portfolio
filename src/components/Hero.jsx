import profilePic from "../assets/profile.jpg";
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
    <div className="text-left flex flex-col lg:flex-row items-center lg:items-center lg:justify-between mb-20 lg:mb-40 gap-y-10">
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
          className="bg-gradient-to-r w-full from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-4xl tracking-tight text-transparent"
        >
          Frontend Developer
        </motion.p>
        <motion.p
          variants={container(1)}
          initial="hidden"
          animate="visible"
          className="my-2  py-6 font-light tracking-normal leading-[170%] w-full text-left"
        >
          {HERO_CONTENT}
        </motion.p>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex justify-center lg:justify-end">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="relative w-full lg:w-[80%] max-w-md"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Main image container */}
            <div className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 p-1 rounded-full shadow-2xl">
              <img
                className="w-full aspect-square object-cover rounded-full border-2 border-neutral-700 hover:border-purple-500/50 transition-all duration-500 hover:brightness-110 hover:contrast-110"
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
