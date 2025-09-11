import project1 from "../assets/projects/project-1.png";
import project2 from "../assets/projects/project-2.png";
import project3 from "../assets/projects/project-3.png";
import project4 from "../assets/projects/project-4.png";

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
    link: "https://visibleone.com/",
  },
  {
    year: "Oct 2022 - Nov 2023",
    role: "Frontend Developer",
    company: "Better HR",
    description: `Built responsive HR management features with Vue.js for employee data, attendance, leave, and payroll processing. Contributed to a SaaS platform managing $8M+ in monthly salaries across multiple countries, ensuring scalability and reliability. Optimized UI components and reduced bugs by 20%, improving user satisfaction and adoption.`,
    technologies: ["Vue.js", "JavaScript", "CSS", "HTML", "SaaS"],
    link: "https://betterhr.io/",
  },
];

export const PROJECTS = [
  {
    title: "Inventory Management System",
    image: project4,
    description:
      "A full-stack application built with NestJS and React, designed to manage users, products, and purchase orders. The project is still in progress and serves as a practical learning experience while I explore and improve my skills with NestJS. It demonstrates my ability to structure backend APIs, integrate them with a React frontend, and build scalable features step by step.",
    technologies: ["NestJS", "React", "TypeScript", "PostgreSQL"],
    github: "https://github.com/thuyainsoe/inventory-management",
  },
  {
    title: "E-Commerce Website",
    image: project1,
    description:
      "A fully functional e-commerce website with features like product listing, shopping cart, and user authentication.",
    technologies: ["HTML", "CSS", "React", "Node.js", "MongoDB"],
    github: "https://github.com/thuyainsoe/neobyte",
    demo: "http://neobyte.vercel.app/",
  },
  {
    title: "NFT Marketplace",
    image: project2,
    description:
      "A UI preview of an NFT marketplace platform showcasing features like wallet integration and smart contracts for buying, selling, and trading NFTs",
    technologies: ["HTML", "CSS", "React", "Tailwind CSS"],
    github: "https://github.com/thuyainsoe/nft-marketplace",
    demo: "https://nft-marketplace-psi-rouge.vercel.app/",
  },
  {
    title: "Uni China",
    image: project3,
    description:
      "Contributed to the UI development of a corporate site showcasing Uni-China Group’s 25-year business presence across retail, food trading, and F&B. Focused on responsive design, clean layout, and modern frontend practices",
    technologies: ["HTML", "CSS", "Wordpress", "Javascript", "PHP"],
    demo: "https://uni-china.com/",
  },
  // {
  //   title: "Portfolio Website",
  //   image: project3,
  //   description:
  //     "A personal portfolio website showcasing projects, skills, and contact information.",
  //   technologies: ["HTML", "CSS", "React", "Bootstrap"],
  //   github: "https://github.com/username/portfolio",
  //   demo: "https://portfolio-demo.vercel.app",
  // },
  // {
  //   title: "Blogging Platform",
  //   image: project4,
  //   description:
  //     "A platform for creating and publishing blog posts, with features like rich text editing, commenting, and user profiles.",
  //   technologies: ["HTML", "CSS", "Vue.js", "Express", "mySQL"],
  //   github: "https://github.com/username/blog-platform",
  //   demo: "https://blog-platform-demo.vercel.app",
  // },
];

export const CONTACT = {
  address: "199 Lasalle Rd, Bang Na Tai, Bang Na, Bangkok",
  phoneNo: "+66 642925437",
  email: "thuyainsoe163361@gmail.com",
};
