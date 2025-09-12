import { useState, useEffect } from "react";

const MouseGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const followMouse = () => {
      setGlowPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
    };

    const animationFrame = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition, glowPosition]);

  return (
    <div
      className="fixed pointer-events-none z-50 mix-blend-screen"
      style={{
        left: glowPosition.x - 150,
        top: glowPosition.y - 150,
        width: "300px",
        height: "300px",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.05) 70%, transparent 100%)",
        borderRadius: "50%",
        filter: "blur(25px)",
        transition: "opacity 0.3s ease",
        opacity: 1,
      }}
    />
  );
};

export default MouseGlow;
