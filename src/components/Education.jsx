import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const educationData = {
  school: "University Of Computer Studies, Yangon",
  degree: "Bachelor of Computer Science (B.C.Sc)",
  duration: "2018 - 2023",
  description:
    "Focused on core computer science principles including software development, data structures, and algorithms. My final year project involved developing a full-stack web application, which sparked my passion for front-end development and user experience design.",
  subjects: [
    "Software Engineering",
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Web Development",
    "Database Management",
    "Computer Networks",
    "UI/UX Fundamentals",
  ],
};

const Education = () => {
  useGSAP(() => {
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#education",
        pin: true,
        start: "top top",
        end: "+=2000",
        scrub: 1,
      },
    });

    gsap.set(".education-main-title", { opacity: 1 });
    gsap.set(".education-content-container", { opacity: 0, y: 50 });
    gsap.set(
      [
        ".edu-school",
        ".edu-degree",
        ".edu-duration",
        ".edu-description",
        ".edu-subject",
      ],
      { y: 50, opacity: 0 }
    );

    // Fade in content
    mainTl.to(".education-content-container", {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 1,
    });

    // Fade out title
    mainTl.to(
      ".education-main-title",
      {
        yPercent: -50,
        opacity: 0,
        ease: "power2.out",
        duration: 1,
      },
      "<"
    );

    // Reveal content details
    mainTl.to(
      [
        ".edu-school",
        ".edu-degree",
        ".edu-duration",
        ".edu-description",
        ".edu-subject",
      ],
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power3.out",
        duration: 0.8,
      },
      "-=0.5"
    );
  }, []);

  return (
    <div
      id="education"
      className="relative min-h-screen w-screen overflow-hidden bg-white"
    >
      {/* Education Content */}
      <div className="education-content-container pointer-events-none absolute inset-0 z-20 flex w-full items-center justify-center">
        <div className="relative h-full w-full">
          <div
            aria-hidden="true"
            className="absolute -bottom-1/4 left-0 select-none text-black opacity-[0.02]"
          >
            <GraduationCap className="h-[40rem] w-[40rem]" strokeWidth={0.5} />
          </div>

          <div className="flex h-full w-full items-center justify-center p-4 md:p-16 lg:p-24">
            <div className="relative max-w-4xl border border-black/10 p-8 md:p-12">
              <div className="mb-2 h-px w-16 bg-black" />

              <div className="mb-8">
                <h2 className="special-font edu-school font-general text-2xl font-black tracking-tight md:text-4xl lg:text-5xl">
                  {educationData.school}
                </h2>
                <div className="special-font edu-degree mt-4 text-sm uppercase text-black/60 md:text-xl lg:text-2xl">
                  {educationData.degree}
                </div>
                <p className="font-robert-regular edu-duration mt-1 text-base text-black/40 md:text-lg">
                  {educationData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular edu-description text-sm leading-relaxed text-black/70 md:text-base">
                  {educationData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {educationData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="edu-subject font-robert-regular rounded-full border border-black/10 px-4 py-1.5 text-xs uppercase tracking-wide md:text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 h-px w-full bg-black/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="education-main-title pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <h1 className="special-font font-zentry text-center text-7xl font-black uppercase sm:text-9xl md:text-[10rem]">
          Edu<b>ca</b>tion
        </h1>
      </div>
    </div>
  );
};

export default Education;
