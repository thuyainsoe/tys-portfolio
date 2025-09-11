import profilePic from "../assets/kevinRushProfile.png";
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
          <motion.img
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="rounded-full"
            src={profilePic}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
