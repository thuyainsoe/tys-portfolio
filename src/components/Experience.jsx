import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

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
    gsap.set(".work-visible", { xPercent: 100 });
    gsap.set([".bh-skill", ".vo-skill"], { opacity: 0, y: 20 });
    gsap.set([".bh-content", ".vo-content"], { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#experience",
        pin: true,
        start: "top top",
        end: "+=4000",
        scrub: 1,
      },
    });

    // Split the title panels
    tl.to(".clip-panel-left", { xPercent: -100, ease: "power2.inOut" });
    tl.to(".clip-panel-right", { xPercent: 100, ease: "power2.inOut" }, "<");

    // Reveal Better HR
    tl.to(".work-hr", { opacity: 1 });
    tl.to(".bh-content", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    tl.to(".bh-skill", { opacity: 1, y: 0, stagger: 0.05 }, "-=0.3");

    // Transition to Visible One
    tl.to(".work-visible", { xPercent: 0 });
    tl.to(".work-visible", { opacity: 1, ease: "power3.out" }, "<");
    tl.to(".vo-content", { opacity: 1, y: 0, duration: 0.5 });
    tl.to(".vo-skill", { opacity: 1, y: 0, stagger: 0.05 }, "-=0.3");
  }, []);

  return (
    <div id="experience" className="relative min-h-screen w-screen overflow-hidden">
      {/* Title Panels */}
      <div className="experience-title-container absolute inset-0 z-40">
        <div className="clip-panel-left absolute inset-0 flex-center bg-white">
          <div className="special-font text-center font-zentry text-7xl font-black uppercase text-black sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
        <div className="clip-panel-right absolute inset-0 flex-center bg-black">
          <div className="special-font text-center font-zentry text-7xl font-black uppercase text-white sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
      </div>

      {/* Better HR */}
      <div className="work-hr pointer-events-none absolute inset-0 z-20 w-full">
        <div className="content-panel absolute left-0 top-0 z-10 h-full w-full bg-white">
          <div className="special-font absolute -right-20 -top-20 select-none text-[25rem] font-black leading-none tracking-tighter text-black opacity-[0.02]">
            01
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12 lg:p-24">
            <div className="bh-content relative max-w-4xl border border-black/10 p-8 md:p-12">
              <div className="mb-8">
                <div className="mb-2 h-px w-16 bg-black" />
                <div
                  className="special-font font-zentry text-4xl font-black uppercase md:text-6xl lg:text-7xl"
                  dangerouslySetInnerHTML={{
                    __html: betterHRData.companyHighlight,
                  }}
                />
                <p className="special-font mt-4 text-xl uppercase text-black/60 md:text-2xl lg:text-3xl">
                  {betterHRData.role}
                </p>
                <p className="font-robert-regular mt-2 text-base text-black/40 md:text-lg">
                  {betterHRData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular text-sm leading-relaxed text-black/70 md:text-base lg:text-lg">
                  {betterHRData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {betterHRData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bh-skill font-robert-regular rounded-full border border-black/10 px-4 py-1.5 text-xs uppercase tracking-wide"
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

      {/* Visible One */}
      <div className="work-visible pointer-events-none absolute inset-0 z-30 w-full">
        <div className="content-panel absolute left-0 top-0 z-10 h-full w-full bg-black">
          <div className="special-font absolute -left-20 -bottom-20 select-none text-[25rem] font-black leading-none tracking-tighter text-white opacity-[0.05]">
            02
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12 lg:p-24">
            <div className="vo-content relative max-w-4xl border border-white/10 p-8 md:p-12">
              <div className="mb-8">
                <div className="mb-2 h-px w-16 bg-white" />
                <div
                  className="special-font font-zentry text-4xl font-black uppercase text-white md:text-6xl lg:text-7xl"
                  dangerouslySetInnerHTML={{
                    __html: visibleOneData.companyHighlight,
                  }}
                />
                <p className="special-font mt-4 text-xl uppercase text-white/60 md:text-2xl lg:text-3xl">
                  {visibleOneData.role}
                </p>
                <p className="font-robert-regular mt-2 text-base text-white/40 md:text-lg">
                  {visibleOneData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular text-sm leading-relaxed text-white/70 md:text-base lg:text-lg">
                  {visibleOneData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {visibleOneData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="vo-skill font-robert-regular rounded-full border border-white/10 px-4 py-1.5 text-xs uppercase tracking-wide text-white"
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
