import { useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingRef = useRef(null);

  useGSAP(() => {
    // Hide hero text initially — revealed after loading exits
    gsap.set("#hero-heading-name", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      y: 20,
      opacity: 0,
    });
    gsap.set("#hero-text-content p, #hero-text-content button", {
      y: 20,
      opacity: 0,
    });

    // Loading screen entrance — name letters stagger in
    gsap.set(["#loading-thu", "#loading-yain", "#loading-soe"], {
      y: 80,
      opacity: 0,
    });
    gsap.to(["#loading-thu", "#loading-yain", "#loading-soe"], {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
    });

    // Yellow bar pulse loop
    gsap.to("#loading-bar", {
      scaleX: 1,
      duration: 1.4,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "left center",
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
      "#hero-content-inside-video",
      {
        y: -150,
        opacity: 0,
        ease: "power2.inOut",
      },
      "<",
    );
  }, []);

  const handleVideoReady = () => {
    // Slide loading screen up and out
    gsap.to(loadingRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        setIsLoading(false);

        // Reveal hero text after loading exits
        gsap.to("#hero-heading-name", {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          y: 0,
          opacity: 1,
          delay: 0.1,
          duration: 1,
          ease: "power3.out",
        });
        gsap.to("#hero-text-content p", {
          y: 0,
          opacity: 1,
          delay: 0.5,
          duration: 0.8,
          ease: "power2.out",
        });
        gsap.to("#hero-text-content button", {
          y: 0,
          opacity: 1,
          delay: 0.7,
          duration: 0.8,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <div className="hero-container relative h-dvh w-screen overflow-x-hidden">
      {/* Loading Screen */}
      {isLoading && (
        <div
          ref={loadingRef}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#1e1e2f] overflow-hidden"
        >
          {/* Decorative top-left accent line */}
          <div className="absolute top-0 left-0 w-32 h-[2px] bg-[#f5d63d]" />
          <div className="absolute top-0 left-0 w-[2px] h-32 bg-[#f5d63d]" />
          {/* Decorative bottom-right accent line */}
          <div className="absolute bottom-0 right-0 w-32 h-[2px] bg-[#f5d63d]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-32 bg-[#f5d63d]" />

          {/* Name */}
          <div className="overflow-hidden flex gap-4 sm:gap-6">
            <span
              id="loading-thu"
              className="special-font font-zentry font-black text-5xl sm:text-7xl md:text-8xl text-white uppercase inline-block"
            >
              <b>THU</b>
            </span>
            <span
              id="loading-yain"
              className="special-font font-zentry font-black text-5xl sm:text-7xl md:text-8xl text-[#f5d63d] uppercase inline-block"
            >
              <b>YAIN</b>
            </span>
            <span
              id="loading-soe"
              className="special-font font-zentry font-black text-5xl sm:text-7xl md:text-8xl text-white uppercase inline-block"
            >
              <b>SOE</b>
            </span>
          </div>

          {/* Yellow animated bar */}
          <div className="mt-6 w-48 sm:w-64 h-[2px] bg-white/10 overflow-hidden">
            <div
              id="loading-bar"
              className="h-full bg-[#f5d63d] w-full scale-x-0 origin-left"
            />
          </div>

          {/* Subtitle */}
          <p className="mt-4 font-robert-regular text-white/40 text-xs uppercase tracking-[0.3em]">
            Web Developer
          </p>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden bg-blue-75"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          borderRadius: "0% 0% 0% 0%",
        }}
      >
        <video
          src={"/videos/hero-1.mp4"}
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={handleVideoReady}
          className="absolute left-0 top-0 size-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 z-10 bg-black opacity-50"></div>

        <div
          id="hero-content-inside-video"
          className="absolute left-0 top-0 z-40 size-full"
        >
          <div className="mt-24 px-5 sm:px-10" id="hero-text-content">
            <h1
              id="hero-heading-name"
              className="hero-heading text-white special-font mb-5 lg:mb-0"
            >
              <b>THU</b> <b>YAIN</b> <b>SOE</b>
            </h1>
            <p className="mb-5 max-w-64 md:max-w-80 lg:max-w-3xl font-robert-regular text-white">
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
  );
};

export default Hero;
