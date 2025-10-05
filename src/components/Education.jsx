import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { GraduationCap, BookOpen, Award } from "lucide-react";

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

    // Fade in content container
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
      className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
    >
      {/* Ambient background elements */}
      <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Education Content */}
      <div className="education-content-container pointer-events-none absolute inset-0 z-20 flex w-full items-center justify-center">
        <div className="relative h-full w-full">
          {/* Background Icon */}
          <div
            aria-hidden="true"
            className="absolute -bottom-1/4 left-0 select-none text-white opacity-5"
          >
            <GraduationCap className="h-[40rem] w-[40rem]" strokeWidth={0.5} />
          </div>

          <div className="flex h-full w-full items-center justify-center p-4 md:p-16 lg:p-24">
            <div className="relative max-w-4xl rounded-3xl border border-blue-400/30 bg-blue-500/10 p-6 backdrop-blur-xl md:p-12">
              {/* Decorative floating icons */}
              <div className="absolute -left-4 -top-4 rounded-full border border-blue-400/30 bg-blue-500/20 p-3 backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div className="absolute -right-4 -bottom-4 rounded-full border border-cyan-400/30 bg-cyan-500/20 p-3 backdrop-blur-sm">
                <Award className="h-6 w-6 text-cyan-400" />
              </div>

              <div className="mb-6">
                <h2 className="special-font edu-school font-general text-2xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                  {educationData.school}
                </h2>
                <div className="special-font edu-degree mt-3 text-sm uppercase text-blue-300 md:text-xl lg:text-2xl">
                  {educationData.degree}
                </div>
                <p className="font-robert-regular edu-duration mt-1 text-base text-gray-400 md:text-lg">
                  {educationData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular edu-description text-sm leading-relaxed text-gray-300 md:text-base">
                  {educationData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {educationData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="edu-subject rounded-lg border border-blue-400/20 bg-blue-900/30 px-3 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-900/50 md:text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute left-4 top-4 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-blue-400/30" />
              <div className="absolute bottom-4 right-4 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-cyan-400/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="education-main-title pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <h1 className="special-font font-zentry text-center text-7xl font-black uppercase text-white sm:text-9xl md:text-[10rem]">
          Edu<b className="text-blue-400">ca</b>tion
        </h1>
      </div>
    </div>
  );
};

export default Education;
