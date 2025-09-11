import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";
import project4 from "../assets/projects/project-4.jpg";

export const HERO_CONTENT = `I craft responsive, SEO-friendly, and scalable web applications using React, TypeScript, and modern frameworks. With 3+ years of experience, I specialize in building HR systems, e-commerce platforms, and business websites that combine performance with great user experience.`;

export const ABOUT_TEXT = `I’m a Frontend Engineer with over 3 years of experience turning ideas into interactive, reliable, and high-performing digital products. My expertise spans React, Next.js, and Vue.js, along with modern tools like Tailwind CSS, Framer Motion, and TanStack Query.

I’ve worked on diverse projects—from HR management systems handling $8M+ monthly salaries to e-commerce websites optimized for SEO and speed—helping businesses achieve both technical and business goals.

Beyond coding, I enjoy collaborating with teams, learning new technologies, and finding creative solutions that make products both user-friendly and future-proof.`;

export const EXPERIENCES = [
  {
    year: "Nov 2023 - Present",
    role: "Frontend Developer",
    company: "Visible One",
    description: `Developed responsive websites and e-commerce platforms using React, TypeScript, and Next.js, improving page load speed by up to 30%. Implemented SEO best practices and optimized front-end performance, increasing search rankings and conversion rates. Collaborated with designers and backend developers to deliver custom digital solutions for businesses in Hong Kong across multiple industries.`,
    technologies: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Shadcn",
    ],
  },
  {
    year: "Oct 2022 - Nov 2023",
    role: "Frontend Developer",
    company: "Better HR",
    description: `Built responsive HR management features with Vue.js for employee data, attendance, leave, and payroll processing. Contributed to a SaaS platform managing $8M+ in monthly salaries across multiple countries, ensuring scalability and reliability. Optimized UI components and reduced bugs by 20%, improving user satisfaction and adoption.`,
    technologies: ["Vue.js", "JavaScript", "CSS", "HTML", "SaaS"],
  },
];

export const PROJECTS = [
  {
    title: "E-Commerce Website",
    image: project1,
    description:
      "A fully functional e-commerce website with features like product listing, shopping cart, and user authentication.",
    technologies: ["HTML", "CSS", "React", "Node.js", "MongoDB"],
  },
  {
    title: "Task Management App",
    image: project2,
    description:
      "An application for managing tasks and projects, with features such as task creation, assignment, and progress tracking.",
    technologies: ["HTML", "CSS", "Angular", "Firebase"],
  },
  {
    title: "Portfolio Website",
    image: project3,
    description:
      "A personal portfolio website showcasing projects, skills, and contact information.",
    technologies: ["HTML", "CSS", "React", "Bootstrap"],
  },
  {
    title: "Blogging Platform",
    image: project4,
    description:
      "A platform for creating and publishing blog posts, with features like rich text editing, commenting, and user profiles.",
    technologies: ["HTML", "CSS", "Vue.js", "Express", "mySQL"],
  },
];

export const CONTACT = {
  address: "767 Fifth Avenue, New York, NY 10153 ",
  phoneNo: "+12 4555 666 00 ",
  email: "me@example.com",
};
