import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    // --- INITIAL STATES ---
    gsap.set(".experience-title-container", { yPercent: -100, scale: 1 });
    gsap.set(".work-hr", { xPercent: 100 });
    gsap.set(".work-visible", { xPercent: 100 });

    // --- MAIN TIMELINE ---
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#experience",
        pin: true,
        start: "top top",
        end: "+=5000",
        scrub: 0.6,
      },
    });

    // Animate the progress bar in sync with the timeline
    tl.to(".scroll-progress-bar", { scaleX: 1, ease: "none" }, 0);

    // Sequence of page animations
    tl.to(".experience-content", { xPercent: -100, ease: "power2.inOut" }, "<");
    tl.to(
      ".experience-title-container",
      { yPercent: 0, scale: 1.5, ease: "power3.out" },
      "<"
    );
    tl.to(
      ".work-hr",
      { xPercent: 0, duration: 1.5, ease: "power3.out" },
      "0.6"
    );
    tl.to(
      ".work-hr",
      { xPercent: -100, duration: 1.5, ease: "power3.in" },
      "2.5"
    );
    tl.to(
      ".work-visible",
      { xPercent: 0, duration: 1.5, ease: "power3.out" },
      "<"
    );
  }, []);

  return (
    <div
      id="experience"
      className="relative min-h-screen w-screen overflow-hidden pt-36"
    >
      {/* Video background (z-0) */}
      <div className="experience-content absolute inset-0 text-center">
        <div className="mask-clip-path about-image">
          <video
            src={"/videos/experience.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover object-[70%] md:object-center"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
      </div>

      {/* Title (z-10) */}
      <div className="experience-title-container absolute inset-0 z-10 flex-center bg-white">
        <AnimatedTitle
          title="Exp<b>e</b>rie<b>nc</b>e"
          containerClass="!text-black text-center hero-heading special-font"
        />
      </div>

      {/* Better HR (z-20) */}
      <div className="work-hr pointer-events-none absolute inset-0 z-20 flex-center bg-[#1ed292] text-6xl font-bold text-white">
        <AnimatedTitle
          title="Better <b>H</b>R"
          containerClass="!text-white text-center hero-heading special-font"
        />
      </div>

      {/* Visible One (z-30) */}
      <div className="work-visible pointer-events-none absolute inset-0 z-30 flex-center bg-[#ffae00]  font-bold text-white">
        <AnimatedTitle
          title="Vis<b>i</b>ble One"
          containerClass="!text-white text-center hero-heading special-font"
        />
      </div>
    </div>
  );
};

export default Experience;
