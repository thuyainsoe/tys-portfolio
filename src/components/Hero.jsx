import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Loader from "./Loader";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useGSAP(() => {
    if (!isLoading && videoLoaded) {
    // Initial setup for text for the reveal effect
    // We want the text to be initially hidden (clipped)
    gsap.set("#hero-heading-name", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      y: 20, // Slightly offset downwards initially
      opacity: 0,
    });
    gsap.set("#hero-text-content p, #hero-text-content button", {
      y: 20,
      opacity: 0,
    });

    // --- ScrollTrigger for the Video Clip-Path ---
    const videoTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-container",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    videoTl.to("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
      ease: "power2.inOut",
    });

    videoTl.to(
      "#hero-content-inside-video", // Target the container for content *within* the video frame
      {
        y: -150, // Move it up
        opacity: 0, // Fade it out
        ease: "power2.inOut",
      },
      "<"
    );

    // --- Separate Animation for Initial Text Entrance (not scroll-triggered, but on load) ---
    // Or, you can also tie this to the ScrollTrigger if you want it to appear as you scroll into view
    // For now, let's make it appear shortly after the component mounts.

    gsap.to("#hero-heading-name", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Reveal from bottom to top
      y: 0,
      opacity: 1,
      delay: 0.5, // Start after a small delay
      duration: 1,
      ease: "power3.out",
    });

    gsap.to("#hero-text-content p", {
      y: 0,
      opacity: 1,
      delay: 1, // Stagger slightly after heading
      duration: 0.8,
      ease: "power2.out",
    });

    gsap.to("#hero-text-content button", {
      y: 0,
      opacity: 1,
      delay: 1.2, // Stagger slightly after paragraph
      duration: 0.8,
      ease: "power2.out",
    });
    }
  }, [isLoading, videoLoaded]);

  return (
    <>
      {isLoading && <Loader onLoadComplete={handleLoadComplete} />}
    <div className="hero-container relative h-dvh w-screen overflow-x-hidden">
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden bg-blue-75"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          borderRadius: "0% 0% 0% 0%",
        }}
      >
        <video
          ref={videoRef}
          src={"/videos/hero-1.mp4"}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          className="absolute left-0 top-0 z-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-black opacity-50"></div>

        {/* This div (#hero-content-inside-video) is what gets animated *out* by scroll */}
        <div
          id="hero-content-inside-video"
          className="absolute left-0 top-0 z-40 size-full"
        >
          <div className="mt-24 px-5 sm:px-10" id="hero-text-content">
            <h1
              id="hero-heading-name"
              className="hero-heading special-font mb-5 text-white lg:mb-0"
            >
              <b>THU</b> <b>YAIN</b> <b>SOE</b>
            </h1>
            <p className="font-robert-regular mb-5 max-w-64 text-white md:max-w-80 lg:max-w-3xl">
              I craft responsive, SEO-friendly, and scalable web applications
              using React, TypeScript, and modern frameworks. With 3+ years of
              experience, I specialize in building HR systems, e-commerce
              platforms, and business websites that combine performance with
              great user experience.
            </p>
            <a href="mailto:thuyainsoe163361@gmail.com">
              <Button
                id="contact-me-button"
                title="Contact Me"
                leftIcon={<TiLocationArrow />}
                containerClass={
                  "!bg-accent-yellow flex-center gap-1 text-white"
                }
              />
            </a>
          </div>
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-white">
          <b>WEB</b> <b>DEVELOPER</b>
        </h1>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        <b>WEB</b> DEVELOPER
      </h1>
    </div>
    </>
  );
};

export default Hero;
