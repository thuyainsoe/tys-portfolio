import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Education details data object
const educationData = {
  school: "University Of Computer Studies, Yangon",
  degree: "Bachelor of Computer Science (B.C.Sc)",
  duration: "2016 - 2020",
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
    // --- Main timeline for the Education section ---
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#education",
        pin: true,
        start: "top top",
        end: "+=2000", // Animation အတိုลงအတွက် end value ကို ပြန်ချိန်ညှိထားပါတယ်
        scrub: 1,
      },
    });

    // --- Initial States ---
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

    // --- Animation Sequence ---

    mainTl.to(".education-content-container", {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 1,
    });

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
      "-=0.5" // Title fade out ဖြစ်နေတုန်းမှာပဲ စပေါ်လာမယ်
    );
  }, []);

  return (
    <div
      id="education"
      className="relative min-h-screen w-screen overflow-hidden bg-[#0a192f]"
    >
      {/* Education Content (z-20) */}
      <div className="education-content-container pointer-events-none absolute inset-0 z-20 flex w-full items-center justify-center">
        <div className="relative h-full w-full">
          <div
            aria-hidden="true"
            className="absolute -bottom-1/4 left-0 select-none text-white opacity-10"
          >
            <GraduationCap className="h-[40rem] w-[40rem]" strokeWidth={1} />
          </div>
          <div className="flex h-full w-full flex-col justify-center p-8 md:p-16 lg:p-24">
            <div className="max-w-4xl text-left">
              <div className="mb-8">
                <h2 className="special-font font-general tracking-tight edu-school text-3xl font-black text-white md:text-6xl">
                  {educationData.school}
                </h2>
                <div className="special-font edu-degree mt-4 text-base uppercase text-blue-300 md:text-2xl">
                  {educationData.degree}
                </div>
                <p className="font-robert-regular edu-duration mt-1 text-lg text-gray-400">
                  {educationData.duration}
                </p>
              </div>
              <div>
                <p className="font-robert-regular edu-description text-sm text-white md:text-base">
                  {educationData.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {educationData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="edu-subject rounded-full bg-blue-900/50 px-3 py-1 text-xs font-medium text-blue-300 md:text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title (z-30) */}
      <div className="education-main-title pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <h1 className="special-font font-zentry text-center text-7xl font-black uppercase text-white sm:text-9xl md:text-[10rem]">
          Edu<b>ca</b>tion
        </h1>
      </div>
    </div>
  );
};

export default Education;
