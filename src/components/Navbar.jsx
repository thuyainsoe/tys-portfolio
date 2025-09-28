import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Github, Linkedin } from "lucide-react";
import { useWindowScroll } from "react-use";
import gsap from "gsap";

// --- NavBar Component ---
// ✨ FIX: NavBar component ကို ဤ file ထဲသို့ တိုက်ရိုက်ထည့်သွင်းထားပါသည်
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
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
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
          "fixed !rounded-full top-4 right-3 z-50 flex h-10 w-10 flex-col items-center justify-center gap-1  border border-white/10 bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-800"
        )}
        aria-label="Toggle menu"
      >
        {/* ✨ FIX: translate-y တန်ဖိုးကို 6px သို့ ပြောင်းထားပါသည် */}
        <div
          className={clsx(
            "h-0.5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out",
            { "translate-y-[6px] rotate-45": isDrawerOpen }
          )}
        />
        <div
          className={clsx(
            "h-0.5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out",
            {
              "opacity-0": isDrawerOpen,
            }
          )}
        />
        {/* ✨ FIX: translate-y တန်ဖိုးကို -6px သို့ ပြောင်းထားပါသည် */}
        <div
          className={clsx(
            "h-0.5 w-5 rounded-full bg-white transition-all duration-300 ease-in-out",
            { "-translate-y-[6px] -rotate-45": isDrawerOpen }
          )}
        />
      </button>

      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-40 h-full w-full max-w-sm transform bg-white p-8 shadow-xl transition-transform duration-500 ease-in-out sm:w-80",
          { "translate-x-0": isDrawerOpen, "-translate-x-full": !isDrawerOpen }
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Thu Yain Soe
            </h2>
            <nav className="mt-12 flex flex-col gap-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={toggleDrawer}
                  className="group flex items-center gap-4"
                >
                  <span className="text-xs font-mono text-zinc-400">
                    0{index + 1}
                  </span>
                  <span className="special-font text-xl font-zentry tracking-wider text-zinc-600 transition-all duration-300 group-hover:translate-x-2 group-hover:text-black">
                    {item.name}
                  </span>
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/thuyainsoe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="text-zinc-500 transition-colors hover:text-black"
            >
              <Github size={22} strokeWidth={1.5} />
            </a>
            <a
              href="https://www.linkedin.com/in/thu-yain-soe-b49a2b242/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="text-zinc-500 transition-colors hover:text-black"
            >
              <Linkedin size={22} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default NavBar;
