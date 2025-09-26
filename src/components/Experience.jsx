import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    // Set the initial off-screen position for the content
    gsap.set(".experience-content", {
      x: "0%", // Start off-screen to the left
    });

    gsap.set(".experience-title-container", {
      xPercent: -50, // Start centered
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#experience",
        pin: true,
        start: "top top",
        end: "+=500",
        scrub: 1,
      },
    });

    // Animate the title moving out to the left
    tl.to(".experience-title-container", {
      xPercent: 0, // Changed to xPercent for consistency
      ease: "power2.inOut",
    });

    // Animate the content sliding in from the left AT THE SAME TIME
    tl.to(
      ".experience-content",
      {
        x: "-100%", // Move to center (0% from -100%)
        ease: "power2.inOut",
      },
      "<" // Start at the same time as the previous animation
    );
  }, []);

  return (
    // ✨ FIX 1: Add `relative` to make this the positioning parent
    <div id="experience" className="relative min-h-screen w-screen pt-36">
      <div className="experience-title-container flex flex-col items-center gap-5">
        <AnimatedTitle
          title="Exp<b>e</b>rie<b>nc</b>e"
          containerClass="!text-black text-center hero-heading special-font"
        />
      </div>

      {/* ✨ FIX 2: Use absolute positioning to overlay this on top */}
      <div className="flex-center absolute-center w-screen h-screen inset-0 text-center experience-content bg-black text-white">
        <div className="mask-clip-path about-image">
          <video
            src={"/videos/experience.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 size-full object-cover object-[70%] md:object-center z-0"
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
