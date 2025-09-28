import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// Data for the work experiences
const betterHRData = {
  id: 1,
  companyHighlight: "Better <b>H</b>R",
  role: "Front End Developer",
  duration: "Oct 2022 - Nov 2023",
  description:
    "Built responsive HR management features with Vue.js for employee data, attendance, leave, and payroll processing. Contributed to a SaaS platform managing $8M+ in monthly salaries across multiple countries, ensuring scalability and reliability. Optimized UI components and reduced bugs by 20%, improving user satisfaction and adoption.",
  skills: [
    "Vue.js",
    "Nuxt.js",
    "Javascript",
    "Tailwind CSS",
    "Figma",
    "Graphql",
  ],
};

const visibleOneData = {
  id: 2,
  companyHighlight: "Vis<b>i</b>ble One",
  role: "Front End Developer",
  duration: "Nov 2023 - Present",
  description:
    "Developed responsive websites and e-commerce platforms using React, TypeScript, and Next.js, improving page load speed by up to 30%. Implemented SEO best practices and optimized front-end performance, increasing search rankings and conversion rates. Collaborated with designers and backend developers to deliver custom digital solutions for businesses in Hong Kong across multiple industries.",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "PHP",
    "WordPress",
    "GSAP",
    "REST APIs",
  ],
};

const Experience = () => {
  useGSAP(() => {
    // --- INITIAL STATES ---
    // Removed: gsap.set(".experience-content", ...);
    gsap.set(".work-visible", { xPercent: -100 });
    gsap.set([".bh-skill", ".vo-skill"], { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#experience",
        pin: true,
        start: "top top",
        end: "+=4000",
        scrub: 1,
      },
    });

    // --- ANIMATION SEQUENCE ---
    // 1. Removed: tl.to(".experience-content", ...);

    // 2. Split the triangles (This is now the first animation)
    tl.to(
      ".clip-triangle-top",
      { xPercent: -100, ease: "power2.inOut" },
      "+=0.5"
    );
    tl.to(
      ".clip-triangle-bottom",
      { xPercent: 100, ease: "power2.inOut" },
      "<"
    );

    // 3. Reveal the "Better HR" section
    tl.to(".work-hr", { opacity: 1 }, "-=0.5");

    // 3a. Karaoke text reveal animation for Better HR
    tl.to(
      [".bh-company", ".bh-role", ".bh-duration", ".bh-desc"],
      { backgroundPosition: "0% 0", stagger: 0.2, ease: "none" },
      "-=0.2"
    );
    tl.to(".bh-skill", { opacity: 1, stagger: 0.05 }, "-=0.5");

    // 4. Transition to "Visible One"
    tl.to(".work-visible", { xPercent: 0 });
    tl.to(".work-visible", { opacity: 1, ease: "power3.out" }, "<");

    // 4a. Karaoke text reveal animation for Visible One
    tl.to(
      [".vo-company", ".vo-role", ".vo-duration", ".vo-desc"],
      { backgroundPosition: "0% 0", stagger: 0.2, ease: "none" },
      "-=0.2"
    );
    tl.to(".vo-skill", { opacity: 1, stagger: 0.05 }, "-=0.5");
  }, []);

  return (
    <div
      id="experience"
      className="relative min-h-screen w-screen overflow-hidden"
    >
      {/* Layer 1: The Title "Doors" with video backgrounds */}
      <div className="experience-title-container absolute inset-0 z-40">
        <div className="clip-triangle-top absolute inset-0 flex-center bg-white">
          {/* Video Background for Top Triangle */}
          <video
            src={"/videos/experience.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-40"></div>
          {/* Title Text */}
          <div className="relative z-10 special-font text-center font-zentry text-7xl font-black uppercase !text-[#1ed292] sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
        <div className="clip-triangle-bottom absolute inset-0 flex-center bg-white">
          {/* Video Background for Bottom Triangle */}
          <video
            src={"/videos/experience.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-40"></div>
          {/* Title Text */}
          <div className="relative z-10 special-font text-center font-zentry text-7xl font-black uppercase !text-[#ffae00] sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
      </div>

      {/* Layer 2: Better HR Experience */}
      <div className="work-hr pointer-events-none absolute inset-0 z-20 w-full">
        <div className="content-panel absolute left-0 top-0 z-10 h-full w-full bg-[#1ed292]">
          <div
            aria-hidden="true"
            className="special-font absolute -top-1/4 right-0 select-none text-[40rem] font-black leading-none tracking-tighter text-white opacity-30"
          >
            01
          </div>
          <div className="relative z-10 flex h-full w-full flex-col justify-center p-8 md:p-16 lg:p-24">
            <div className="max-w-4xl text-left">
              <div className="mb-8">
                <div
                  className="bh-company text-reveal text-reveal-bh special-font text-left font-zentry text-7xl font-black uppercase"
                  dangerouslySetInnerHTML={{
                    __html: betterHRData.companyHighlight,
                  }}
                />
                {/* Use text-reveal for the role as well for a strong headline effect */}
                <p className="bh-role text-reveal text-reveal-bh special-font mt-2 text-2xl uppercase md:text-4xl">
                  {betterHRData.role}
                </p>
                {/* Use semi-transparent white for secondary info */}
                <p className="bh-duration font-robert-regular mt-1 text-lg text-white/70">
                  {betterHRData.duration}
                </p>
              </div>
              <div>
                {/* Use a slightly more opaque white for the main description */}
                <p className="bh-desc font-robert-regular text-base text-white/90 md:text-lg">
                  {betterHRData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {betterHRData.skills.map((skill) => (
                    <span
                      key={skill}
                      /* Restyle skill tags for a modern, glassy look on the color background */
                      className="bh-skill rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Visible One Experience */}
      <div className="work-visible pointer-events-none absolute inset-0 z-30 w-full">
        <div className="content-panel absolute left-0 top-0 z-10 h-full w-full bg-[#ffae00]">
          <div
            aria-hidden="true"
            className="special-font absolute -bottom-1/4 right-0 select-none text-[40rem] font-black leading-none tracking-tighter text-white opacity-30"
          >
            02
          </div>
          <div className="relative z-10 flex h-full w-full flex-col justify-center p-8 md:p-16 lg:p-24">
            <div className="max-w-4xl text-left">
              <div className="mb-8">
                <div
                  className="vo-company text-reveal text-reveal-vo special-font text-left font-zentry text-7xl font-black uppercase"
                  dangerouslySetInnerHTML={{
                    __html: visibleOneData.companyHighlight,
                  }}
                />
                {/* Use text-reveal for the role */}
                <p className="vo-role text-reveal text-reveal-vo special-font mt-2 text-2xl uppercase md:text-4xl">
                  {visibleOneData.role}
                </p>
                {/* Use semi-transparent white for secondary info */}
                <p className="vo-duration font-robert-regular mt-1 text-lg text-white/70">
                  {visibleOneData.duration}
                </p>
              </div>
              <div>
                {/* Use a slightly more opaque white for the main description */}
                <p className="vo-desc font-robert-regular text-base text-white/90 md:text-lg">
                  {visibleOneData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {visibleOneData.skills.map((skill) => (
                    <span
                      key={skill}
                      /* Same glassy style for these skill tags */
                      className="vo-skill rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
