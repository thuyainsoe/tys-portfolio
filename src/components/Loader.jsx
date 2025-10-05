import { useEffect, useRef } from "react";
import gsap from "gsap";

const Loader = ({ onLoadComplete }) => {
  const loaderRef = useRef(null);
  const progressBarRef = useRef(null);
  const percentTextRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Animate loader out with reveal effect
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (onLoadComplete) onLoadComplete();
          },
        });
      },
    });

    // Animate decorative lines
    tl.from(linesRef.current, {
      scaleX: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    });

    // Animate percentage counter and progress bar together
    const counter = { value: 0 };

    // Progress bar animation
    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 2,
      ease: "power2.inOut",
    }, "-=0.3");

    // Percentage counter animation
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        const percent = Math.floor(counter.value);
        if (percentTextRef.current) {
          percentTextRef.current.textContent = `${percent}`;
        }
      },
    }, "<");
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      {/* Decorative corner lines */}
      <div className="absolute left-0 top-0 p-8">
        <div ref={el => linesRef.current[0] = el} className="mb-2 h-px w-16 origin-left bg-black" />
        <div ref={el => linesRef.current[1] = el} className="h-px w-12 origin-left bg-black/60" />
      </div>
      <div className="absolute right-0 top-0 p-8">
        <div ref={el => linesRef.current[2] = el} className="mb-2 h-px w-16 origin-right bg-black" />
        <div ref={el => linesRef.current[3] = el} className="h-px w-12 origin-right bg-black/60" />
      </div>
      <div className="absolute bottom-0 left-0 p-8">
        <div ref={el => linesRef.current[4] = el} className="mb-2 h-px w-12 origin-left bg-black/60" />
        <div ref={el => linesRef.current[5] = el} className="h-px w-16 origin-left bg-black" />
      </div>
      <div className="absolute bottom-0 right-0 p-8">
        <div ref={el => linesRef.current[6] = el} className="mb-2 h-px w-12 origin-right bg-black/60" />
        <div ref={el => linesRef.current[7] = el} className="h-px w-16 origin-right bg-black" />
      </div>

      {/* Main content */}
      <div className="text-center">
        <div className="mb-8 flex items-baseline justify-center gap-2">
          <div
            ref={percentTextRef}
            className="special-font text-[10rem] font-black leading-none text-black md:text-[12rem]"
          >
            0
          </div>
          <div className="special-font text-4xl font-black text-black md:text-5xl">%</div>
        </div>
        <p className="font-robert-regular mb-12 text-xs uppercase tracking-[0.3em] text-black/60">
          Loading
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-px w-64 overflow-hidden bg-black/10 md:w-96">
        <div
          ref={progressBarRef}
          className="h-full origin-left scale-x-0 bg-black"
        />
      </div>

      {/* Footer text */}
      <div className="absolute bottom-8 text-center">
        <p className="font-robert-regular text-xs tracking-widest text-black/40">
          THU YAIN SOE
        </p>
      </div>
    </div>
  );
};

export default Loader;
