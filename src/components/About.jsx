import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

// Data for each section
const sectionsData = [
  // ... (your sectionsData array is unchanged)
  {
    id: 1,
    bgColor: "bg-[#1D2D44]",
    textColor: "text-white",
    title: "My Journey / Background",
    content:
      "From designing my first static website in high school to leading frontend development in real-world projects, my journey has been driven by curiosity and persistence.",
  },
  {
    id: 2,
    bgColor: "bg-[#3E5C76]",
    textColor: "text-white",
    title: "Values & Mindset",
    content:
      "I believe in clean code, collaborative teamwork, and building products that solve real problems while creating delightful user experiences.",
  },
  {
    id: 3,
    bgColor: "bg-[#F0EBD8]",
    textColor: "text-slate-900",
    title: "What I’m Learning / Future Goals",
    content:
      "I’m currently diving deeper into Three.js and AI-powered frontend experiences to push the boundaries of interactive design.",
  },
  {
    id: 4,
    bgColor: "bg-[#748CAB]",
    textColor: "text-white",
    title: "Testimonials / Collaborations",
    content:
      "I’ve collaborated with startups, SaaS platforms, and e-commerce companies to ship high-impact products.",
  },
  {
    id: 5,
    bgColor: "bg-[#5E3B5D]",
    textColor: "text-white",
    title: "Fun Facts",
    content:
      "I drink too much coffee ☕, love football ⚽, and can spend hours tweaking UI details.",
  },
];

const About = () => {
  useGSAP(() => {
    // --- INITIAL STATES (Unchanged) ---
    sectionsData.forEach((section) => {
      gsap.set(`.about-content-wrapper-${section.id}`, { opacity: 0 });
      gsap.set(`.about-text-content-${section.id}`, { x: "100%" });
    });

    const scrollTriggerConfig = {
      trigger: "#clip",
      start: "center center",
      end: "+=5000",
      scrub: 0.8,
      pin: true,
      pinSpacing: true,
    };

    // --- MAIN TIMELINE ---
    const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig });

    tl.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "power2.inOut",
    });
    tl.to(".about-content-wrapper-1", { opacity: 1, ease: "power2.inOut" });

    // ✨ CHANGED: Added elastic ease and duration for the first section's entrance
    tl.to(
      ".about-text-content-1",
      {
        x: "0%",
        ease: "elastic.out(1, 0.5)",
        duration: 1.5,
      },
      "<"
    );

    sectionsData.slice(0, -1).forEach((section) => {
      const currentId = section.id;
      const nextId = currentId + 1;

      // Animate OUT (Unchanged)
      tl.to(`.about-text-content-${currentId}`, {
        x: "-100%",
        ease: "power2.inOut",
      });
      tl.to(
        `.about-content-wrapper-${currentId}`,
        { opacity: 0, ease: "power2.inOut" },
        "<"
      );

      // Animate IN the next wrapper (Unchanged)
      tl.to(
        `.about-content-wrapper-${nextId}`,
        { opacity: 1, ease: "power2.inOut" },
        "<"
      );

      // ✨ CHANGED: Added elastic ease and duration for all subsequent section entrances
      tl.to(
        `.about-text-content-${nextId}`,
        {
          x: "0%",
          ease: "elastic.out(1, 0.5)",
          duration: 1.5,
        },
        "<"
      );
    });

    // --- PROGRESS BAR (Unchanged) ---
    gsap.to(".scroll-progress-bar", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { ...scrollTriggerConfig, pin: false },
    });
  }, []);

  return (
    // ... (your JSX is unchanged)
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <AnimatedTitle
          title="Ab<b>o</b>ut <b>Me</b>"
          containerClass="mt-5 !text-black text-center hero-heading special-font"
        />
      </div>

      <div className="h-[100vh] w-screen" id="clip">
        <div className="scroll-progress-bar absolute top-0 left-0 z-30 h-1 w-full origin-left scale-x-0 bg-white" />

        <div className="mask-clip-path about-image">
          <img
            src="/images/about-me-1.jpg"
            alt="Thurein Soe"
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-10 bg-black opacity-40"></div>
        </div>

        {sectionsData.map((section) => (
          <div
            key={section.id}
            className={`about-content-wrapper-${section.id} absolute-center z-20 flex-center size-full overflow-hidden ${section.bgColor}`}
          >
            <div
              className={`about-text-content-${section.id} max-w-5xl px-8 ${section.textColor}`}
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
  );
};

export default About;
