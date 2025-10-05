import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const sectionsData = [
  {
    id: 1,
    title: "My Journey / Background",
    content:
      "As a student at the University of Computer Studies, I discovered my passion for web development early on, in my first year. This strong interest drove me to thoroughly learn the fundamentals, starting with JavaScript, which ultimately launched my journey into the field of frontend development.",
  },
  {
    id: 2,
    title: "Values & Mindset",
    content:
      "My philosophy is simple: write clean code and build things that help people. I love working in a team where there's mutual respect, and I have a strong passion for designing neat, user-friendly UIs that people enjoy using.",
  },
  {
    id: 3,
    title: "What I'm Learning / Future Goals",
    content:
      "I am continuously learning new technologies. My current focus is on backend development with NestJS and Express.js, alongside advancing my frontend skills in Three.js and GSAP. I am also very interested in exploring AI next.",
  },
  {
    id: 4,
    title: "Fun Facts",
    content:
      "Outside of coding, my main passion is playing football ⚽. When I am coding, I love getting lost in the details of creating beautiful user interfaces and dynamic web animations.",
  },
];

const About = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.set(".horizontal-scroll-wrapper", { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "top top",
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
    <div id="about" className="min-h-screen w-screen bg-white" ref={sectionRef}>
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <AnimatedTitle
          title="Ab<b>o</b>ut <b>Me</b>"
          containerClass="mt-3 !text-black text-center hero-heading special-font"
        />
      </div>

      <div className="min-h-dvh w-screen" id="clip">
        <div className="scroll-progress-bar absolute left-0 top-0 z-30 h-px w-full origin-left scale-x-0 bg-black" />

        <div className="mask-clip-path about-image">
          <img
            src="/images/about-me-1.jpg"
            alt="Thurein Soe"
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80" />
        </div>

        <div className="horizontal-scroll-wrapper absolute left-0 top-0 z-20 size-full overflow-hidden">
          <div
            className="sections-filmstrip flex h-full"
            style={{ width: `${sectionsData.length * 100}%` }}
          >
            {sectionsData.map((section, index) => (
              <div
                key={section.id}
                className="relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden p-8 bg-white"
              >
                <div className="special-font pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none text-[18rem] font-black leading-none tracking-tighter text-black opacity-[0.02]">
                  0{section.id}
                </div>

                <div className="relative z-10 max-w-3xl">
                  <div className="mb-8 h-px w-16 bg-black" />
                  <h2 className="special-font mb-8 text-4xl font-black uppercase md:text-6xl">
                    {section.title}
                  </h2>
                  <p className="font-robert-regular text-lg leading-relaxed text-black/80 md:text-xl">
                    {section.content}
                  </p>
                  <div className="mt-8 h-px w-full bg-black/10" />
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
