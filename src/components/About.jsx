import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// Data for each section - simplified for the new design
const sectionsData = [
  {
    id: 1,
    bgColor: "bg-zinc-900",
    textColor: "text-white",
    title: "My Journey / Background",
    content:
      "As a student at the University of Computer Studies, I discovered my passion for web development early on, in my first year. This strong interest drove me to thoroughly learn the fundamentals, starting with JavaScript, which ultimately launched my journey into the field of frontend development.",
  },
  {
    id: 2,
    bgColor: "bg-white",
    textColor: "text-black",
    title: "Values & Mindset",
    content:
      "My philosophy is simple: write clean code and build things that help people. I love working in a team where there's mutual respect, and I have a strong passion for designing neat, user-friendly UIs that people enjoy using.",
  },
  {
    id: 3,
    bgColor: "bg-zinc-900",
    textColor: "text-white",
    title: "What I’m Learning / Future Goals",
    content:
      "I am continuously learning new technologies. My current focus is on backend development with NestJS and Express.js, alongside advancing my frontend skills in Three.js and GSAP. I am also very interested in exploring AI next.",
  },
  {
    id: 5,
    bgColor: "bg-white",
    textColor: "text-black",
    title: "Fun Facts",
    content:
      "Outside of coding, my main passion is playing football ⚽. When I am coding, I love getting lost in the details of creating beautiful user interfaces and dynamic web animations.",
  },
];

const About = () => {
  // The GSAP animation logic remains the same
  useGSAP(() => {
    gsap.set(".horizontal-scroll-wrapper", { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=3000",
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    });

    tl.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power2.inOut",
    });

    tl.to(".horizontal-scroll-wrapper", {
      opacity: 1,
      ease: "power1.inOut",
    });

    tl.to(".sections-filmstrip", {
      x: () => `-${(sectionsData.length - 1) * 100}vw`,
      ease: "none",
    });

    gsap.to(".scroll-progress-bar", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=1500",
        scrub: 1,
      },
    });
  }, []);

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <AnimatedTitle
          title="Ab<b>o</b>ut <b>Me</b>"
          containerClass="mt-3 !text-black text-center hero-heading special-font"
        />
      </div>

      <div className="min-h-dvh w-screen" id="clip">
        <div className="scroll-progress-bar absolute top-0 left-0 z-30 h-1 w-full origin-left scale-x-0 bg-accent-red" />

        <div className="mask-clip-path about-image">
          <img
            src="/images/about-me-1.jpg"
            alt="Thurein Soe"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>

        <div className="horizontal-scroll-wrapper absolute top-0 left-0 z-20 size-full overflow-hidden">
          <div
            className="sections-filmstrip flex h-full"
            style={{ width: `${sectionsData.length * 100}%` }}
          >
            {/* ✨ UPDATED: Section structure refactored for typographical decoration */}
            {sectionsData.map((section) => (
              <div
                key={section.id}
                className={`relative h-full w-screen shrink-0 flex-center overflow-hidden p-8 ${section.bgColor}`}
              >
                {/* Background Decoration: Large, semi-transparent number */}
                <div
                  aria-hidden="true"
                  className={`special-font absolute -top-1/4 right-0 select-none text-[40rem] font-black leading-none tracking-tighter opacity-10 ${
                    section.textColor === "text-white"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  0{section.id}
                </div>

                {/* Foreground Content */}
                <div
                  className={`relative z-10 max-w-4xl text-center ${section.textColor}`}
                >
                  <h2 className="bento-title mb-6">{section.title}</h2>
                  <p className="font-robert-regular text-lg md:text-xl">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
