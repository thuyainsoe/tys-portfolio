import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { GraduationCap } from "lucide-react"; // lucide-react မှ icon ကို import လုပ်ခြင်း

gsap.registerPlugin(ScrollTrigger);

// Updated education details from your request
const educationData = {
  school: "University Of Computer Studies,Yangon",
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
    // --- Main timeline for the entire section ---
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#education",
        pin: true,
        start: "top top",
        end: "+=3000", // Increased for smoother animations
        scrub: 1,
      },
    });

    // --- Initial states for animations ---
    // အစပိုင်းမှာ content တွေကို ဖျောက်ထားပြီး ခေါင်းစဉ်ကိုပဲပြထားမယ်
    gsap.set(".education-content-container", { yPercent: 100 });
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
    // 1. Animate the main title out
    mainTl.to(".education-main-title", {
      yPercent: -120, // Title slides up
      ease: "power2.in",
    });

    // 2. Animate the content container in
    mainTl.to(
      ".education-content-container",
      {
        yPercent: 0, // Content slides in from bottom
        ease: "power2.out",
      },
      "<" // Starts at the same time as the title animation
    );

    // 3. Staggered animation for the content details
    // content ပေါ်လာပြီးတဲ့အခါမှာ အထဲကစာသားတွေတစ်ခုချင်းစီပေါ်လာမယ်
    mainTl
      .to(".edu-school", { y: 0, opacity: 1, ease: "power3.out" }, "-=0.2")
      .to(".edu-degree", { y: 0, opacity: 1, ease: "power3.out" }, "-=0.7")
      .to(".edu-duration", { y: 0, opacity: 1, ease: "power3.out" }, "-=0.7")
      .to(
        ".edu-description",
        { y: 0, opacity: 1, ease: "power2.inOut" },
        "-=0.5"
      )
      .to(
        ".edu-subject",
        { y: 0, opacity: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.5"
      );
  }, []);

  return (
    // Changed background to a deep navy blue for a more academic feel
    <div
      id="education"
      className="relative min-h-screen w-screen overflow-hidden bg-[#0a192f]"
    >
      {/* Main Title that animates on scroll */}
      <div className="education-main-title absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="special-font font-zentry text-center text-7xl font-black uppercase text-white sm:text-9xl md:text-[10rem]">
          Edu<b>ca</b>tion
        </h1>
      </div>

      {/* Container for the detailed content */}
      <div className="education-content-container pointer-events-none absolute inset-0 z-20 w-full bg-[#0a192f]">
        {/* Background Decoration: Replaced inline SVG with the GraduationCap component */}
        <div
          aria-hidden="true"
          className="absolute -bottom-1/4 left-0 select-none text-white opacity-10"
        >
          <GraduationCap className="h-[40rem] w-[40rem]" strokeWidth={1} />
        </div>

        {/* Content Details */}
        <div className="relative z-10 flex h-full w-full flex-col justify-center p-8 md:p-16 lg:p-24">
          <div className="max-w-4xl text-left">
            <div className="mb-8">
              <h2 className="special-font font-general tracking-tight  edu-school font-black text-white text-3xl md:text-6xl">
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
              <p className="font-robert-regular edu-description text-sm md:text-base text-white">
                {educationData.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {educationData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="edu-subject rounded-full bg-blue-900/50 px-3 py-1 text-xs md:text-sm font-medium text-blue-300"
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
  );
};

export default Education;
