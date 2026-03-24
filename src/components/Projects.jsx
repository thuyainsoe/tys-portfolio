import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

// Panel 01 — Overview
import dashboard  from "../assets/images/panel01/dashobard.png";
import login      from "../assets/images/panel01/login.png";
import permission from "../assets/images/panel01/permission.png";

// Panel 02 — HRM
import employeeList from "../assets/images/panel02/employee_list.png";
import attendance   from "../assets/images/panel02/attendance.png";
import mobileOne    from "../assets/images/panel02/mobile_one.png";
import mobileTwo    from "../assets/images/panel02/mobile_two.png";

// Panel 03 — Trading
import productList from "../assets/images/panel03/product_list.png";
import saleForm    from "../assets/images/panel03/sale_form.png";

// Panel 04 — Restaurant
import restaurantPos     from "../assets/images/panel04/restaurant_pos.png";
import restaurantTable   from "../assets/images/panel04/restaurant_table.png";
import restaurantKitchen from "../assets/images/panel04/resturant_kitchen.png";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────
// DATA — 12 flat panels, each with unique layout + transition
// ─────────────────────────────────────────────────────────────────

const panels = [
  // ── Overview ──────────────────────────────────────────────────
  {
    id: 1,
    src: dashboard,
    caption: "Main Dashboard",
    explain:
      "Real-time overview of sales, inventory value, pending POs, and revenue vs expense chart — all scoped to the current tenant.",
    module: "NeoBot ERP",
    subtitle: "Multi-tenant SaaS Platform",
    tags: ["React 18", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Turborepo"],
    accent: "#f5d63d",
    layout: "full-bleed",
    bg: "bg-zinc-900",
  },
  {
    id: 2,
    src: login,
    caption: "Login & Branding",
    explain:
      "Marketing-facing entry point. Each tenant lands on the same URL but gets fully isolated data and user management after sign-in.",
    module: "NeoBot ERP",
    subtitle: "Multi-tenant SaaS Platform",
    tags: ["React 18", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Turborepo"],
    accent: "#f5d63d",
    layout: "split-left",
    bg: "bg-zinc-950",
  },
  {
    id: 3,
    src: permission,
    caption: "Roles & Permissions",
    explain:
      "Granular permission matrix per role — view / create / edit / delete for every resource across all modules. Roles are tenant-specific.",
    module: "NeoBot ERP",
    subtitle: "Multi-tenant SaaS Platform",
    tags: ["React 18", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Turborepo"],
    accent: "#f5d63d",
    layout: "bg-dim",
    bg: "bg-zinc-900",
  },
  // ── HRM ───────────────────────────────────────────────────────
  {
    id: 4,
    src: employeeList,
    caption: "Employee Records",
    explain:
      "Full employee registry with position, department, contact info, daily rate, and active/inactive status. Supports bulk import and per-row actions.",
    module: "HRM Module",
    subtitle: "Human Resource Management",
    tags: ["Employee CRUD", "Attendance", "Payroll Engine", "React + Capacitor", "Mobile App"],
    accent: "#00f6ff",
    layout: "split-right",
    bg: "bg-zinc-950",
  },
  {
    id: 5,
    src: attendance,
    caption: "Monthly Attendance Grid",
    explain:
      "Calendar-style attendance view for the entire team. Color-coded daily statuses (Present, Absent, Leave, OT) across projects with department filters.",
    module: "HRM Module",
    subtitle: "Human Resource Management",
    tags: ["Employee CRUD", "Attendance", "Payroll Engine", "React + Capacitor", "Mobile App"],
    accent: "#00f6ff",
    layout: "full-bleed",
    bg: "bg-zinc-900",
  },
  {
    id: 6,
    src: mobileOne,
    caption: "Employee Profile — Mobile",
    explain:
      "Capacitor mobile app for employees. Workers can view and update their own profile info, emergency contacts, and personal details from their phone.",
    module: "HRM Module",
    subtitle: "Human Resource Management",
    tags: ["Employee CRUD", "Attendance", "Payroll Engine", "React + Capacitor", "Mobile App"],
    accent: "#00f6ff",
    layout: "center-stage",
    bg: "bg-zinc-950",
  },
  {
    id: 7,
    src: mobileTwo,
    caption: "Mobile Check-In / Check-Out",
    explain:
      "Time-tracking home screen. Employees check in and out daily, see their shift timer, and access Leave, Overtime, and Payslip from a single screen.",
    module: "HRM Module",
    subtitle: "Human Resource Management",
    tags: ["Employee CRUD", "Attendance", "Payroll Engine", "React + Capacitor", "Mobile App"],
    accent: "#00f6ff",
    layout: "center-stage",
    bg: "bg-zinc-900",
  },
  // ── Trading ───────────────────────────────────────────────────
  {
    id: 8,
    src: productList,
    caption: "Product Catalog",
    explain:
      "Central product registry with SKU, category, unit, cost price, selling price, and live stock count. Low-stock badges trigger reorder visibility. Supports CSV import/export.",
    module: "Trading Module",
    subtitle: "Sales & Inventory Management",
    tags: ["Product Catalog", "Purchase Orders", "Sales & Invoices", "Inventory", "Import / Export"],
    accent: "#f5d63d",
    layout: "split-left",
    bg: "bg-zinc-950",
  },
  {
    id: 9,
    src: saleForm,
    caption: "Sales Invoice",
    explain:
      "Sales order detail view — line items with discount and tax, auto-calculated totals, customer info, and a one-click Generate Invoice action.",
    module: "Trading Module",
    subtitle: "Sales & Inventory Management",
    tags: ["Product Catalog", "Purchase Orders", "Sales & Invoices", "Inventory", "Import / Export"],
    accent: "#f5d63d",
    layout: "split-right",
    bg: "bg-zinc-900",
  },
  // ── Restaurant ────────────────────────────────────────────────
  {
    id: 10,
    src: restaurantPos,
    caption: "POS Terminal",
    explain:
      "Full-screen POS with menu grid (Appetisers, Mains, Drinks, Desserts), table selector on the left, and a live order panel on the right with Pay Later / Pay & Send.",
    module: "Restaurant Module",
    subtitle: "POS · Table Management · Kitchen Display",
    tags: ["POS Terminal", "Table Management", "Kitchen Display", "Real-time Orders"],
    accent: "#00f6ff",
    layout: "full-bleed",
    bg: "bg-zinc-950",
  },
  {
    id: 11,
    src: restaurantTable,
    caption: "Table Management",
    explain:
      "Floor map showing every table across Indoor, Outdoor, VIP, and Terrace zones. Color badges — Available, Occupied, Reserved — update in real time.",
    module: "Restaurant Module",
    subtitle: "POS · Table Management · Kitchen Display",
    tags: ["POS Terminal", "Table Management", "Kitchen Display", "Real-time Orders"],
    accent: "#00f6ff",
    layout: "bg-dim",
    bg: "bg-zinc-900",
  },
  {
    id: 12,
    src: restaurantKitchen,
    caption: "Kitchen Display System",
    explain:
      "Kanban-style KDS showing New Orders, Cooking, and Ready columns. Kitchen staff mark items done; the POS updates automatically without page refresh.",
    module: "Restaurant Module",
    subtitle: "POS · Table Management · Kitchen Display",
    tags: ["POS Terminal", "Table Management", "Kitchen Display", "Real-time Orders"],
    accent: "#00f6ff",
    layout: "split-left",
    bg: "bg-zinc-950",
  },
];

// ─────────────────────────────────────────────────────────────────
// TRANSITIONS — 12 unique entrance animations (index 0 = doors)
// ─────────────────────────────────────────────────────────────────

const transitions = [
  null, // 0 — first panel, revealed by doors
  // 1 — slide up
  {
    from: { yPercent: 100 },
    to:   { yPercent: 0, ease: "power2.inOut", duration: 0.8 },
  },
  // 2 — clip-path circle expand
  {
    from: { clipPath: "circle(0% at 50% 50%)" },
    to:   { clipPath: "circle(150% at 50% 50%)", ease: "power2.inOut", duration: 1.2 },
  },
  // 3 — slide from right
  {
    from: { xPercent: 100 },
    to:   { xPercent: 0, ease: "power2.inOut", duration: 0.8 },
  },
  // 4 — diagonal wipe
  {
    from: { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
    to:   { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", ease: "power3.inOut", duration: 1 },
  },
  // 5 — 3D flip
  {
    from: { rotateY: -90, transformPerspective: 1200, transformOrigin: "left center" },
    to:   { rotateY: 0, ease: "power2.inOut", duration: 1 },
  },
  // 6 — scale from center
  {
    from: { scale: 0.3, opacity: 0 },
    to:   { scale: 1, opacity: 1, ease: "back.out(1.2)", duration: 0.9 },
  },
  // 7 — clip-path from top
  {
    from: { clipPath: "inset(0 0 100% 0)" },
    to:   { clipPath: "inset(0 0 0% 0)", ease: "power2.inOut", duration: 1 },
  },
  // 8 — slide from left
  {
    from: { xPercent: -100 },
    to:   { xPercent: 0, ease: "power2.inOut", duration: 0.8 },
  },
  // 9 — blur in
  {
    from: { filter: "blur(20px)", opacity: 0 },
    to:   { filter: "blur(0px)", opacity: 1, ease: "power2.out", duration: 0.9 },
  },
  // 10 — slide down from top
  {
    from: { yPercent: -100 },
    to:   { yPercent: 0, ease: "power2.inOut", duration: 0.8 },
  },
  // 11 — rotate + scale in
  {
    from: { rotation: 8, scale: 0.7, opacity: 0 },
    to:   { rotation: 0, scale: 1, opacity: 1, ease: "power2.out", duration: 0.9 },
  },
];

// ─────────────────────────────────────────────────────────────────
// TEXT CONTENT — reusable across all layouts
// ─────────────────────────────────────────────────────────────────

const TextContent = ({ panel, index, centered = false }) => {
  const align = centered ? "items-center text-center" : "";
  return (
    <div className={`flex flex-col ${align}`}>
      {/* step counter */}
      <div className="flex items-center gap-3 panel-step">
        <div
          className="h-[2px] w-5 shrink-0"
          style={{ background: panel.accent }}
        />
        <span
          className="font-robert-regular text-xs tabular-nums"
          style={{ color: panel.accent + "80" }}
        >
          {String(index + 1).padStart(2, "0")}&nbsp;/&nbsp;
          {String(panels.length).padStart(2, "0")}
        </span>
      </div>

      {/* module name */}
      <div className="mt-3 overflow-hidden">
        <h2 className="panel-module special-font font-zentry text-2xl font-black text-white md:text-3xl lg:text-4xl">
          {panel.module}
        </h2>
      </div>

      {/* subtitle */}
      <p
        className="panel-subtitle mt-1 font-robert-regular text-xs uppercase tracking-[0.2em]"
        style={{ color: panel.accent }}
      >
        {panel.subtitle}
      </p>

      {/* caption */}
      <h3 className="panel-caption mt-4 font-robert-medium text-base text-white/80 lg:text-lg">
        {panel.caption}
      </h3>

      {/* explanation */}
      <p className="panel-explain mt-2 max-w-lg font-robert-regular text-sm leading-relaxed text-white/50">
        {panel.explain}
      </p>

      {/* tags */}
      <div
        className={`mt-4 flex flex-wrap gap-2 ${centered ? "justify-center" : ""}`}
      >
        {panel.tags.map((tag) => (
          <span
            key={tag}
            className="panel-tag rounded-full border border-white/15 px-3 py-1 text-xs text-white/40"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// LAYOUT TEMPLATES
// ─────────────────────────────────────────────────────────────────

const SplitLayout = ({ panel, index, reverse = false }) => (
  <div
    className={`flex h-full w-full flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
  >
    <div className="flex w-full flex-col justify-center px-8 py-8 lg:w-[35%] lg:px-12">
      <TextContent panel={panel} index={index} />
    </div>
    <div className="relative h-[50vh] w-full bg-[#0a0a0a] lg:h-full lg:w-[65%]">
      <img
        src={panel.src}
        alt={panel.caption}
        className="size-full object-contain"
      />
    </div>
  </div>
);

const FullBleedLayout = ({ panel, index }) => (
  <div className="relative h-full w-full">
    <img
      src={panel.src}
      alt={panel.caption}
      className="absolute inset-0 size-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
    <div className="absolute bottom-0 left-0 z-20 w-full p-6 lg:max-w-xl lg:p-12">
      <div className="panel-card rounded-2xl bg-black/50 p-6 ring-1 ring-white/10 backdrop-blur-xl lg:p-8">
        <TextContent panel={panel} index={index} />
      </div>
    </div>
  </div>
);

const BgDimLayout = ({ panel, index }) => (
  <div className="relative flex h-full w-full items-center justify-center">
    <img
      src={panel.src}
      alt={panel.caption}
      className="absolute inset-0 size-full object-cover opacity-[0.08]"
    />
    <div className="relative z-10 max-w-xl px-8">
      <TextContent panel={panel} index={index} centered />
    </div>
  </div>
);

const CenterStageLayout = ({ panel, index }) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a]">
    <img
      src={panel.src}
      alt={panel.caption}
      className="h-[50vh] w-auto object-contain drop-shadow-2xl"
    />
    <div className="mt-5 max-w-md px-6">
      <TextContent panel={panel} index={index} centered />
    </div>
  </div>
);

const layoutMap = {
  "split-left":  (p, i) => <SplitLayout panel={p} index={i} />,
  "split-right": (p, i) => <SplitLayout panel={p} index={i} reverse />,
  "full-bleed":  (p, i) => <FullBleedLayout panel={p} index={i} />,
  "bg-dim":      (p, i) => <BgDimLayout panel={p} index={i} />,
  "center-stage": (p, i) => <CenterStageLayout panel={p} index={i} />,
};

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────

const Projects = () => {
  const mainRef = useRef(null);

  useGSAP(
    () => {
      // ── initial hidden states ────────────────────────────────
      gsap.set(".panel-card",     { opacity: 0, y: 20 });
      gsap.set(".panel-step",     { opacity: 0, y: 10 });
      gsap.set(".panel-module",   { xPercent: 40, opacity: 0 });
      gsap.set(".panel-subtitle", { y: 8, opacity: 0 });
      gsap.set(".panel-caption",  { y: 12, opacity: 0 });
      gsap.set(".panel-explain",  { y: 12, opacity: 0 });
      gsap.set(".panel-tag",      { y: 10, opacity: 0 });

      // set each panel's entrance initial state
      panels.forEach((_, i) => {
        if (i === 0) return;
        const t = transitions[i];
        if (t) gsap.set(`.panel-${i}`, t.from);
      });

      // ── timeline ─────────────────────────────────────────────
      const DOORS     = 600;
      const PER_PANEL = 750;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          pin: true,
          start: "top top",
          end: `+=${DOORS + panels.length * PER_PANEL}`,
          scrub: 2,
        },
      });

      // helper: stagger-reveal text inside a panel
      const revealText = (sel, start) => {
        tl
          .to(`${sel} .panel-card`,     { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, start)
          .to(`${sel} .panel-step`,     { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "<0.05")
          .to(`${sel} .panel-module`,   { xPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, "<0.1")
          .to(`${sel} .panel-subtitle`, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, "<0.1")
          .to(`${sel} .panel-caption`,  { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.15")
          .to(`${sel} .panel-explain`,  { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "<0.15")
          .to(`${sel} .panel-tag`,      { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: "power2.out" }, "<0.15");
      };

      // ── doors open ───────────────────────────────────────────
      tl.to(".clip-triangle-top-project",    { xPercent: -100, ease: "power2.inOut", duration: 1 });
      tl.to(".clip-triangle-bottom-project", { xPercent:  100, ease: "power2.inOut", duration: 1 }, "<");
      tl.set(".experience-title-container",  { zIndex: 1 });

      // ── first panel (no transition, revealed by doors) ───────
      revealText(".panel-0", ">-0.2");
      tl.to({}, { duration: 0.6 });

      // ── panels 1–11 ──────────────────────────────────────────
      panels.forEach((_, i) => {
        if (i === 0) return;
        const t = transitions[i];
        if (t) tl.to(`.panel-${i}`, { ...t.to });
        revealText(`.panel-${i}`, "<0.3");
        tl.to({}, { duration: 0.6 }); // hold for reading
      });
    },
    { scope: mainRef },
  );

  return (
    <section
      ref={mainRef}
      id="projects"
      className="relative min-h-screen w-screen overflow-hidden bg-black"
    >
      {/* ── doors title reveal ───────────────────────────────── */}
      <div className="experience-title-container absolute inset-0 z-50">
        <div className="clip-triangle-top-project absolute inset-0 flex-center bg-white">
          <video
            src="/videos/hero-2.mp4"
            autoPlay loop muted playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-50" />
          <div className="relative z-10 special-font text-center font-zentry text-7xl font-black uppercase !text-[#00f6ff] sm:text-9xl md:text-8xl lg:text-[10rem]">
            Pro<b>je</b>ct<b>s</b>
          </div>
        </div>
        <div className="clip-triangle-bottom-project absolute inset-0 flex-center bg-white">
          <video
            src="/videos/hero-2.mp4"
            autoPlay loop muted playsInline
            className="absolute left-0 top-0 z-0 size-full object-cover"
          />
          <div className="absolute inset-0 z-0 bg-black opacity-50" />
          <div className="relative z-10 special-font text-center font-zentry text-7xl font-black uppercase !text-[#f5d63d] sm:text-9xl md:text-8xl lg:text-[10rem]">
            Pro<b>je</b>ct<b>s</b>
          </div>
        </div>
      </div>

      {/* ── 12 stacked panels ────────────────────────────────── */}
      <div className="projects-wrapper absolute inset-0">
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className={`project-panel panel-${index} absolute inset-0 overflow-hidden ${panel.bg}`}
            style={{ zIndex: 10 + index }}
          >
            <div className="relative z-10 h-full w-full">
              {layoutMap[panel.layout](panel, index)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
