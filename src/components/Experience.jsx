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
  gradient: "from-emerald-500/30 to-cyan-500/30",
  bgColor: "bg-emerald-500/10",
  borderColor: "border-emerald-400/30",
  accentColor: "text-emerald-400",
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
  gradient: "from-yellow-500/30 to-orange-500/30",
  bgColor: "bg-yellow-500/10",
  borderColor: "border-yellow-400/30",
  accentColor: "text-yellow-400",
};

const Experience = () => {
  useGSAP(() => {
    gsap.set(".work-visible", { xPercent: -100 });
    gsap.set([".bh-skill", ".vo-skill"], { opacity: 0 });
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

    // Split the triangles
    tl.to(".clip-triangle-top", { xPercent: -100, ease: "power2.inOut" });
    tl.to(
      ".clip-triangle-bottom",
      { xPercent: 100, ease: "power2.inOut" },
      "<"
    );

    // Reveal the "Better HR" section
    tl.to(".work-hr", { opacity: 1 });

    // Fade in Better HR content
    tl.to(".bh-content", { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    tl.to(".bh-skill", { opacity: 1, stagger: 0.05 }, "-=0.3");

    // Transition to "Visible One"
    tl.to(".work-visible", { xPercent: 0 });
    tl.to(".work-visible", { opacity: 1, ease: "power3.out" }, "<");

    // Fade in Visible One content
    tl.to(".vo-content", { opacity: 1, y: 0, duration: 0.5 });
    tl.to(".vo-skill", { opacity: 1, stagger: 0.05 }, "-=0.3");
  }, []);

  return (
    <div
      id="experience"
      className="relative min-h-screen w-screen overflow-hidden"
    >
      {/* Title "Doors" with video backgrounds */}
      <div className="experience-title-container absolute inset-0 z-40">
        <div className="clip-triangle-top absolute inset-0 flex-center bg-white">
          <video
            src={"/videos/experience.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-40"></div>
          <div className="special-font relative z-10 text-center font-zentry text-7xl font-black uppercase !text-emerald-400 sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
        <div className="clip-triangle-bottom absolute inset-0 flex-center bg-white">
          <video
            src={"/videos/experience.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-40"></div>
          <div className="special-font relative z-10 text-center font-zentry text-7xl font-black uppercase !text-yellow-400 sm:text-9xl md:text-8xl lg:text-[10rem]">
            Exp<b>e</b>rie<b>nc</b>e
          </div>
        </div>
      </div>

      {/* Better HR Experience */}
      <div className="work-hr pointer-events-none absolute inset-0 z-20 w-full">
        <div className="content-panel absolute left-0 top-0 z-10 h-full w-full bg-black">
          {/* Ambient background gradient */}
          <div className={`absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br ${betterHRData.gradient} blur-[120px] opacity-60`} />
          <div className={`absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br ${betterHRData.gradient} blur-[120px] opacity-60`} />

          <div
            aria-hidden="true"
            className="special-font absolute -right-20 -top-20 select-none text-[25rem] font-black leading-none tracking-tighter text-white opacity-5"
          >
            01
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12 lg:p-24">
            <div className={`bh-content relative max-w-4xl rounded-3xl border ${betterHRData.borderColor} ${betterHRData.bgColor} p-6 backdrop-blur-xl md:p-10 lg:p-12`}>
              <div className="mb-6">
                <div
                  className={`special-font font-zentry text-3xl font-black uppercase md:text-5xl lg:text-6xl ${betterHRData.accentColor}`}
                  dangerouslySetInnerHTML={{
                    __html: betterHRData.companyHighlight,
                  }}
                />
                <p className="special-font mt-3 text-xl uppercase text-white md:text-2xl lg:text-3xl">
                  {betterHRData.role}
                </p>
                <p className="font-robert-regular mt-2 text-base text-gray-400 md:text-lg">
                  {betterHRData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular text-sm leading-relaxed text-gray-300 md:text-base lg:text-lg">
                  {betterHRData.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {betterHRData.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`bh-skill rounded-lg border ${betterHRData.borderColor} bg-white/5 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm md:text-sm`}
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

      {/* Visible One Experience */}
      <div className="work-visible pointer-events-none absolute inset-0 z-30 w-full">
        <div className="content-panel absolute left-0 top-0 z-10 h-full w-full bg-black">
          {/* Ambient background gradient */}
          <div className={`absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br ${visibleOneData.gradient} blur-[120px] opacity-60`} />
          <div className={`absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br ${visibleOneData.gradient} blur-[120px] opacity-60`} />

          <div
            aria-hidden="true"
            className="special-font absolute -left-20 -bottom-20 select-none text-[25rem] font-black leading-none tracking-tighter text-white opacity-5"
          >
            02
          </div>

          <div className="relative z-10 flex h-full w-full items-center justify-center p-4 md:p-12 lg:p-24">
            <div className={`vo-content relative max-w-4xl rounded-3xl border ${visibleOneData.borderColor} ${visibleOneData.bgColor} p-6 backdrop-blur-xl md:p-10 lg:p-12`}>
              <div className="mb-6">
                <div
                  className={`special-font font-zentry text-3xl font-black uppercase md:text-5xl lg:text-6xl ${visibleOneData.accentColor}`}
                  dangerouslySetInnerHTML={{
                    __html: visibleOneData.companyHighlight,
                  }}
                />
                <p className="special-font mt-3 text-xl uppercase text-white md:text-2xl lg:text-3xl">
                  {visibleOneData.role}
                </p>
                <p className="font-robert-regular mt-2 text-base text-gray-400 md:text-lg">
                  {visibleOneData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular text-sm leading-relaxed text-gray-300 md:text-base lg:text-lg">
                  {visibleOneData.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {visibleOneData.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`vo-skill rounded-lg border ${visibleOneData.borderColor} bg-white/5 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm md:text-sm`}
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
