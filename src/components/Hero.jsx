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
  const titleRef = useRef(null);
  const linesRef = useRef([]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  useGSAP(() => {
    if (!isLoading && videoLoaded) {
      const tl = gsap.timeline({ delay: 0.3 });

      // Animated decorative lines
      tl.from(linesRef.current, {
        scaleX: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Title reveal with split effect
      tl.from("#hero-heading-name .letter", {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.03,
        ease: "power3.out",
      }, "-=0.5");

      tl.from("#hero-text-content p", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5");

      tl.from("#hero-text-content button", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.3");

      // Scroll-triggered video animation
      const videoTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-container",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      videoTl.to("#video-frame", {
        scale: 0.85,
        borderRadius: "24px",
        ease: "power2.inOut",
      });

      videoTl.to("#hero-content-inside-video", {
        opacity: 0,
        y: -80,
        ease: "power2.inOut",
      }, "<");
    }
  }, [isLoading, videoLoaded]);

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="letter inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <>
      {isLoading && <Loader onLoadComplete={handleLoadComplete} />}
      <div className="hero-container relative h-dvh w-screen overflow-x-hidden bg-white">
        {/* Decorative corner lines */}
        <div className="absolute left-0 top-0 z-30 p-8">
          <div ref={el => linesRef.current[0] = el} className="mb-2 h-px w-20 origin-left bg-black" />
          <div ref={el => linesRef.current[1] = el} className="h-px w-16 origin-left bg-black/40" />
        </div>
        <div className="absolute right-0 top-0 z-30 p-8">
          <div ref={el => linesRef.current[2] = el} className="mb-2 h-px w-20 origin-right bg-black" />
          <div ref={el => linesRef.current[3] = el} className="h-px w-16 origin-right bg-black/40" />
        </div>

        <div
          id="video-frame"
          className="relative z-10 h-dvh w-screen overflow-hidden"
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
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div
            id="hero-content-inside-video"
            className="absolute left-0 top-0 z-40 size-full"
          >
            <div className="flex h-full flex-col justify-between p-8 md:p-12 lg:p-16" id="hero-text-content">
              <div className="mt-12 md:mt-24">
                <h1
                  id="hero-heading-name"
                  ref={titleRef}
                  className="special-font mb-6 overflow-hidden text-6xl font-black uppercase leading-[0.9] text-white md:text-8xl lg:text-9xl"
                >
                  <div className="overflow-hidden">
                    {splitText('THU YAIN')}
                  </div>
                  <div className="overflow-hidden">
                    {splitText('SOE')}
                  </div>
                </h1>
                <div className="mb-8 h-px w-24 bg-white" />
                <p className="font-robert-regular max-w-md text-sm leading-relaxed text-white/90 md:max-w-xl md:text-base lg:max-w-2xl lg:text-lg">
                  I craft responsive, SEO-friendly, and scalable web applications
                  using React, TypeScript, and modern frameworks. With 3+ years of
                  experience, I specialize in building HR systems, e-commerce
                  platforms, and business websites.
                </p>
              </div>

              <div className="flex items-end justify-between">
                <a href="mailto:thuyainsoe163361@gmail.com">
                  <Button
                    id="contact-me-button"
                    title="Get in Touch"
                    leftIcon={<TiLocationArrow />}
                    containerClass="!bg-white !text-black hover:!bg-black hover:!text-white transition-all duration-300 flex-center gap-1"
                  />
                </a>

                <div className="font-robert-regular hidden text-right text-xs uppercase tracking-widest text-white/60 md:block">
                  <div>Web Developer</div>
                  <div className="mt-1">Based in Yangon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
