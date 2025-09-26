import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

// Data for the work experiences
const betterHRData = {
  id: 1,
  companyHighlight: "Better <b>H</b>R",
  role: "Front End Developer",
  duration: "Oct 2023 - Nov 2022",
  description:
    "As a key member of the front-end team, I spearheaded the development of responsive and interactive user interfaces using React and Next.js. I collaborated closely with UI/UX designers to translate complex requirements into pixel-perfect, high-performance web applications, improving user engagement by 25%.",
  skills: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "Figma",
    "REST APIs",
  ],
};

const visibleOneData = {
  id: 2,
  companyHighlight: "Vis<b>i</b>ble One",
  role: "Front End Developer",
  duration: "May 2022 - Present",
  description:
    "During my internship, I contributed to various client projects, focusing on building and maintaining WordPress websites. I gained hands-on experience with PHP, JavaScript, and CSS, and learned to work effectively in an agile development environment, assisting senior developers in delivering high-quality web solutions.",
  skills: [
    "HTML5 & CSS3",
    "JavaScript (ES6+)",
    "PHP",
    "WordPress",
    "jQuery",
    "Bootstrap",
    "SEO Principles",
  ],
};

const Experience = () => {
  useGSAP(() => {
    // --- INITIAL STATES ---
    // Set initial positions for the elements to be animated
    gsap.set(".experience-title-container", { yPercent: 100, scale: 1 });
    gsap.set(".work-hr", { xPercent: 100 });
    gsap.set(".work-visible", { xPercent: -100 });

    // --- MAIN TIMELINE ---
    // Create a timeline that is controlled by the scroll position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#experience",
        pin: true,
        start: "top top",
        end: "+=2000", // The animation will last for 2000px of scroll
        scrub: 0.6,
      },
    });

    // --- ANIMATION SEQUENCE ---
    // 1. Animate the video background into view
    tl.to(".experience-content", { xPercent: 0, ease: "power2.inOut" }, "<");

    // 2. Animate the main "Experience" title into view
    tl.to(
      ".experience-title-container",
      { yPercent: 0, scale: 1, ease: "power3.out" },
      "<"
    );

    // 3. Animate the "Better HR" section in from the right
    tl.to(
      ".work-hr",
      { xPercent: 0, duration: 1.5, ease: "power3.out" },
      "0.6"
    );

    // 4. Animate the "Visible One" section in from the left, which also pushes the "Better HR" section out
    tl.to(".work-hr", { xPercent: 0, duration: 1.5, ease: "power3.in" }, "2.5");
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
      {/* Layer 0: Video background */}
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

      <div className="experience-title-container absolute inset-0 z-10 flex-center">
        {/* Top Triangle */}
        <div className="absolute inset-0 bg-black clip-triangle-top flex-center">
          <div className="special-font text-center font-zentry text-7xl font-black uppercase !text-[#1ed292] sm:right-10 sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>

        {/* Bottom Triangle */}
        <div className="absolute inset-0 bg-black clip-triangle-bottom flex-center">
          <div className="special-font text-center font-zentry text-7xl font-black uppercase !text-[#ffae00] sm:right-10 sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
      </div>

      {/* Layer 2: Better HR Experience */}
      <div className="work-hr pointer-events-none absolute inset-0 z-20 w-full overflow-hidden bg-[#1ed292]">
        {/* Background Decoration */}
        <div
          aria-hidden="true"
          className="special-font absolute -top-1/4 right-0 select-none text-[40rem] font-black leading-none tracking-tighter text-white opacity-10"
        >
          01
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-center p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl text-left">
            <div className="mb-8">
              <div className="special-font text-left font-zentry text-7xl font-black uppercase !text-white">
                Better <b>HR</b>
              </div>
              <p className="special-font mt-2 text-2xl uppercase text-green-100 md:text-4xl">
                {betterHRData.role}
              </p>
              <p className="font-robert-regular mt-1 text-lg text-white">
                {betterHRData.duration}
              </p>
            </div>
            <div>
              <p className="font-robert-regular text-base text-white md:text-lg">
                {betterHRData.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {betterHRData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#1ed292]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Visible One Experience */}
      <div className="work-visible pointer-events-none absolute inset-0 z-30 overflow-hidden bg-[#ffae00]">
        <div
          aria-hidden="true"
          className="special-font absolute -bottom-1/4 right-0 select-none text-[40rem] font-black leading-none tracking-tighter text-black opacity-10"
        >
          02
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-center p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl text-left">
            <div className="mb-8">
              <div className="special-font text-left font-zentry text-7xl font-black uppercase !text-white">
                Visible <b>One</b>
              </div>
              <p className="special-font mt-2 text-2xl uppercase text-white md:text-4xl">
                {visibleOneData.role}
              </p>
              <p className="font-robert-regular mt-1 text-lg text-white">
                {visibleOneData.duration}
              </p>
            </div>
            <div>
              <p className="font-robert-regular text-base text-white md:text-lg">
                {visibleOneData.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {visibleOneData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-amber-950 px-3 py-1 text-sm font-medium text-white"
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
  );
};

export default Experience;
