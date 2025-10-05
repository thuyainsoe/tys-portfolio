import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Github, Linkedin, Mail, X } from "lucide-react";
import { useWindowScroll } from "react-use";
import gsap from "gsap";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
];

const NavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (navContainerRef.current) {
      gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.2,
      });
    }
  }, [isNavVisible]);

  return (
    <>
      <button
        ref={navContainerRef}
        onClick={toggleDrawer}
        className={clsx(
          "group fixed right-4 top-4 z-50 flex size-12 flex-col items-center justify-center gap-1.5 border border-black/10 bg-white transition-all duration-300 hover:bg-black hover:border-black md:right-8 md:top-8"
        )}
        aria-label="Toggle menu"
      >
        <div
          className={clsx(
            "h-px w-6 bg-black transition-all duration-300 ease-in-out group-hover:bg-white",
            { "translate-y-[7px] rotate-45": isDrawerOpen }
          )}
        />
        <div
          className={clsx(
            "h-px w-6 bg-black transition-all duration-300 ease-in-out group-hover:bg-white",
            { "opacity-0": isDrawerOpen }
          )}
        />
        <div
          className={clsx(
            "h-px w-6 bg-black transition-all duration-300 ease-in-out group-hover:bg-white",
            { "-translate-y-[7px] -rotate-45": isDrawerOpen }
          )}
        />
      </button>

      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-40 h-full w-full max-w-md transform border-l border-black/10 bg-white transition-transform duration-500 ease-in-out sm:w-96",
          { "translate-x-0": isDrawerOpen, "translate-x-full": !isDrawerOpen }
        )}
      >
        <div className="flex h-full flex-col justify-between p-8 md:p-12">
          <div>
            <div className="mb-16">
              <div className="mb-4 h-px w-16 bg-black" />
              <h2 className="special-font mb-2 text-3xl font-bold">
                Thu Yain Soe
              </h2>
              <p className="font-robert-regular text-sm uppercase tracking-widest text-black/40">
                Web Developer
              </p>
            </div>

            <nav className="flex flex-col gap-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={toggleDrawer}
                  className="group flex items-center gap-6 transition-all duration-300"
                >
                  <span className="font-mono text-xs text-black/20">
                    0{index + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="special-font text-2xl uppercase tracking-tight transition-all duration-300 group-hover:translate-x-2">
                      {item.name}
                    </span>
                    <div className="h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
                  </div>
                </a>
              ))}
            </nav>
          </div>

          <div>
            <div className="mb-8 h-px w-full bg-black/10" />

            <div className="mb-8 flex items-center gap-4">
              <a
                href="https://github.com/thuyainsoe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex size-12 items-center justify-center border border-black/10 text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                <Github size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.linkedin.com/in/thu-yain-soe-b49a2b242/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex size-12 items-center justify-center border border-black/10 text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
              <a
                href="mailto:thuyainsoe163361@gmail.com"
                aria-label="Email"
                className="flex size-12 items-center justify-center border border-black/10 text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>

            <p className="font-robert-regular text-xs uppercase tracking-widest text-black/20">
              © 2025 Thu Yain Soe
            </p>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default NavBar;
