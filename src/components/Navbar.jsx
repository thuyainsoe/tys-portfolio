import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Github, Linkedin, Mail } from "lucide-react";
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
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <>
      <button
        ref={navContainerRef}
        onClick={toggleDrawer}
        className={clsx(
          "group fixed right-3 top-4 z-50 flex h-12 w-12 flex-col items-center justify-center gap-1 !rounded-full border border-white/20 bg-black/30 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-black/50"
        )}
        aria-label="Toggle menu"
      >
        <div
          className={clsx(
            "h-0.5 w-6 rounded-full bg-white transition-all duration-300 ease-in-out group-hover:bg-cyan-400",
            { "translate-y-[6px] rotate-45": isDrawerOpen }
          )}
        />
        <div
          className={clsx(
            "h-0.5 w-6 rounded-full bg-white transition-all duration-300 ease-in-out group-hover:bg-cyan-400",
            {
              "opacity-0": isDrawerOpen,
            }
          )}
        />
        <div
          className={clsx(
            "h-0.5 w-6 rounded-full bg-white transition-all duration-300 ease-in-out group-hover:bg-cyan-400",
            { "-translate-y-[6px] -rotate-45": isDrawerOpen }
          )}
        />
      </button>

      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-40 h-full w-full max-w-sm transform border-r border-white/10 bg-gradient-to-br from-slate-950 via-black to-slate-900 p-8 shadow-2xl backdrop-blur-2xl transition-transform duration-500 ease-in-out sm:w-80",
          { "translate-x-0": isDrawerOpen, "-translate-x-full": !isDrawerOpen }
        )}
      >
        {/* Ambient gradients */}
        <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-yellow-500/10 blur-[100px]" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div className="mb-12">
              <h2 className="special-font text-2xl font-bold text-white">
                Thu Yain Soe
              </h2>
              <p className="font-robert-regular mt-1 text-sm text-gray-400">
                Web Developer
              </p>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-yellow-400" />
            </div>

            <nav className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={toggleDrawer}
                  className="group flex items-center gap-4 transition-all duration-300"
                >
                  <span className="font-mono text-xs text-cyan-400/60">
                    0{index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-gradient-to-r from-cyan-400/0 to-cyan-400/60 transition-all duration-300 group-hover:w-12 group-hover:to-cyan-400" />
                    <span className="special-font text-lg uppercase tracking-wide text-gray-400 transition-all duration-300 group-hover:text-white">
                      {item.name}
                    </span>
                  </div>
                </a>
              ))}
            </nav>
          </div>

          <div>
            <div className="mb-6 h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/thuyainsoe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-400"
              >
                <Github size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.linkedin.com/in/thu-yain-soe-b49a2b242/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-400"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
              <a
                href="mailto:thuyainsoe163361@gmail.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-cyan-400"
              >
                <Mail size={18} strokeWidth={1.5} />
              </a>
            </div>

            <p className="font-robert-regular mt-6 text-xs text-gray-600">
              © 2025 Thu Yain Soe
            </p>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default NavBar;
