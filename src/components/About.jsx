import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const sectionsData = [
  {
    id: 1,
    gradient: "from-cyan-500/20 via-transparent to-transparent",
    borderColor: "border-cyan-400/30",
    titleColor: "text-cyan-400",
    title: "My Journey / Background",
    content:
      "As a student at the University of Computer Studies, I discovered my passion for web development early on, in my first year. This strong interest drove me to thoroughly learn the fundamentals, starting with JavaScript, which ultimately launched my journey into the field of frontend development.",
  },
  {
    id: 2,
    gradient: "from-yellow-500/20 via-transparent to-transparent",
    borderColor: "border-yellow-400/30",
    titleColor: "text-yellow-400",
    title: "Values & Mindset",
    content:
      "My philosophy is simple: write clean code and build things that help people. I love working in a team where there's mutual respect, and I have a strong passion for designing neat, user-friendly UIs that people enjoy using.",
  },
  {
    id: 3,
    gradient: "from-cyan-500/20 via-transparent to-transparent",
    borderColor: "border-cyan-400/30",
    titleColor: "text-cyan-400",
    title: "What I'm Learning / Future Goals",
    content:
      "I am continuously learning new technologies. My current focus is on backend development with NestJS and Express.js, alongside advancing my frontend skills in Three.js and GSAP. I am also very interested in exploring AI next.",
  },
  {
    id: 4,
    gradient: "from-yellow-500/20 via-transparent to-transparent",
    borderColor: "border-yellow-400/30",
    titleColor: "text-yellow-400",
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

    // Parallax effect for cards
    sectionsData.forEach((_, index) => {
      gsap.to(`.about-card-${index}`, {
        y: -30,
        scrollTrigger: {
          trigger: `.about-section-${index}`,
          start: "left center",
          end: "right center",
          scrub: 1,
          containerAnimation: tl,
        },
      });
    });
  }, []);

  return (
    <div id="about" className="min-h-screen w-screen" ref={sectionRef}>
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <AnimatedTitle
          title="Ab<b>o</b>ut <b>Me</b>"
          containerClass="mt-3 !text-black text-center hero-heading special-font"
        />
      </div>

      <div className="min-h-dvh w-screen" id="clip">
        <div className="scroll-progress-bar absolute left-0 top-0 z-30 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 to-yellow-400" />

        <div className="mask-clip-path about-image">
          <img
            src="/images/about-me-1.jpg"
            alt="Thurein Soe"
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="horizontal-scroll-wrapper absolute left-0 top-0 z-20 size-full overflow-hidden">
          <div
            className="sections-filmstrip flex h-full"
            style={{ width: `${sectionsData.length * 100}%` }}
          >
            {sectionsData.map((section, index) => (
              <div
                key={section.id}
                className={`about-section-${index} relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden p-8`}
              >
                {/* Ambient background gradient */}
                <div className={`absolute left-0 top-0 h-full w-full bg-gradient-to-br ${section.gradient} blur-3xl`} />

                {/* Large number background */}
                <div
                  aria-hidden="true"
                  className="special-font pointer-events-none absolute -right-10 -top-10 select-none text-[20rem] font-black leading-none tracking-tighter text-white opacity-5"
                >
                  0{section.id}
                </div>

                {/* Glass morphism card */}
                <div
                  className={`about-card-${index} relative z-10 max-w-3xl rounded-3xl border ${section.borderColor} bg-black/30 p-8 shadow-2xl backdrop-blur-xl md:p-12`}
                >
                  <div className={`absolute -left-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br ${section.gradient} blur-2xl opacity-50`} />
                  <div className={`absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br ${section.gradient} blur-2xl opacity-50`} />

                  <div className="relative">
                    <h2 className={`special-font mb-6 text-4xl font-black md:text-5xl ${section.titleColor}`}>
                      {section.title}
                    </h2>
                    <p className="font-robert-regular text-lg leading-relaxed text-white md:text-xl">
                      {section.content}
                    </p>
                  </div>

                  {/* Decorative corner elements */}
                  <div className={`absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 ${section.borderColor} rounded-tl-2xl`} />
                  <div className={`absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 ${section.borderColor} rounded-br-2xl`} />
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
