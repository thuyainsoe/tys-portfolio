import { useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ onLoadComplete }) => {
  const loaderRef = useRef(null);
  const progressBarRef = useRef(null);
  const percentTextRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Animate loader out
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            if (onLoadComplete) onLoadComplete();
          },
        });
      },
    });

    // Animate percentage counter and progress bar together
    const counter = { value: 0 };

    // Progress bar animation using GSAP (more reliable)
    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 2.5,
      ease: "power2.inOut",
    }, 0);

    // Percentage counter animation
    tl.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const percent = Math.floor(counter.value);
        if (percentTextRef.current) {
          percentTextRef.current.textContent = `${percent}%`;
        }
      },
    }, 0);

    // Pulse effect on circle
    tl.to(
      circleRef.current,
      {
        scale: 1.2,
        opacity: 0.6,
        duration: 0.8,
        repeat: 2,
        yoyo: true,
        ease: "sine.inOut",
      },
      0
    );

    // Rotate animation (infinite)
    gsap.to(circleRef.current, {
      rotation: 360,
      duration: 2.5,
      ease: "linear",
      repeat: -1,
    });
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      {/* Animated Background Gradients */}
      <div className="absolute left-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-[120px] animation-delay-1000" />

      {/* Loading Circle */}
      <div className="relative mb-12">
        <div
          ref={circleRef}
          className="h-32 w-32 rounded-full border-4 border-cyan-500/30 border-t-cyan-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full border-4 border-yellow-500/30 border-t-yellow-400" />
        </div>
      </div>

      {/* Percentage Text */}
      <div className="mb-8 text-center">
        <div
          ref={percentTextRef}
          className="special-font text-6xl font-black text-white md:text-8xl"
        >
          0%
        </div>
        <p className="font-robert-regular mt-2 text-sm uppercase tracking-widest text-gray-400">
          Loading Experience
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10 md:w-96">
        <div
          ref={progressBarRef}
          className="h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400"
        />
      </div>

      {/* Decorative Text */}
      <div className="absolute bottom-8 text-center">
        <p className="font-robert-regular text-xs text-gray-600">
          THU YAIN SOE - WEB DEVELOPER
        </p>
      </div>
    </div>
  );
};

export default Loader;
