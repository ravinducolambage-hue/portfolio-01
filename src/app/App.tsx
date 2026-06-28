import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Moon, Sun, Github, Linkedin, Mail, ExternalLink, X,
  ArrowUp, Code2, Database, BarChart3, Cpu, Layers,
  Briefcase, GraduationCap, Award, Palette, ChevronDown,
  Check, AlertCircle, Terminal, Zap,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type AccentKey = "teal" | "python" | "powerbi";

interface Project {
  id: number; title: string; desc: string; tags: string[];
  stack: string[]; img: string; metrics: string[]; detail: string;
}
interface TimelineEntry {
  year: string; role: string; org: string; type: "work" | "edu" | "award"; desc: string;
}
type FormData = { name: string; email: string; subject: string; message: string };
type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ACCENTS: Record<AccentKey, { label: string; hex: string; glow: string }> = {
  teal:    { label: "DS Teal",  hex: "#00D4B1", glow: "rgba(0,212,177,0.18)" },
  python:  { label: "Python",   hex: "#F4C430", glow: "rgba(244,196,48,0.18)" },
  powerbi: { label: "Power BI", hex: "#F2A900", glow: "rgba(242,169,0,0.18)" },
};

const PHRASES = [
  "I turn raw data into actionable insights.",
  "I engineer data workflows with SQL and Python.",
  "I translate complex datasets into visual stories.",
  "I train predictive models.",
  "I build intelligent systems.",
];

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Roamly",
    desc: "A community-driven travel discovery platform for Sri Lanka connecting local travellers with authentic destinations.",
    tags: ["PHP", "MySQL", "JavaScript"],
    stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=420&fit=crop&auto=format",
    metrics: ["Community-driven", "3 User Roles", "Local Destinations", "Authentic Discovery"],
    detail: "Built with HTML, CSS, JavaScript, PHP, and MySQL. Features three distinct user roles and focuses on connecting local travellers with authentic Sri Lankan destinations.",
  }
];

const FILTER_TAGS = ["All", "Python", "SQL", "Java", "Power BI", "PHP"];

const SKILLS = [
  { label: "Java",             pct: 96, Icon: Code2 },
  { label: "SQL",              pct: 92, Icon: Database },
  { label: "Python",           pct: 88, Icon: Code2 },
  { label: "Power BI / DAX",   pct: 71, Icon: BarChart3 },
  { label: "Machine Learning", pct: 67, Icon: Cpu },
  { label: "Statistics",       pct: 59, Icon: Layers },
];

const TECH_TAGS = [
  { name: "Python",       note: "Primary language for ML, ETL, and analysis" },
  { name: "SQL",          note: "Advanced queries, window functions, stored procs" },
  { name: "Java",         note: "Object-oriented programming and application development" },
  { name: "Power BI",     note: "Data modeling, DAX, and interactive dashboards" },
  { name: "Pandas",       note: "Data wrangling, aggregation, time-series" },
  { name: "scikit-learn", note: "Classification, regression, clustering pipelines" },
  { name: "MATLAB",       note: "Mathematical modeling and numerical computing" },
  { name: "HTML/CSS",     note: "Web structure and styling" },
  { name: "PHP",          note: "Server-side scripting and backend logic" },
  { name: "MySQL",        note: "Relational database management" },
  { name: "Git/GitHub",   note: "Version control and collaborative development" },
  { name: "Docker",       note: "Containerization and environment reproducibility" },
];

const TIMELINE: TimelineEntry[] = [
  { year: "2024–Present", role: "Finance Head, Career Gateway 1.0", org: "IEEE Student Branch, Uni. of Sri Jayewardenepura", type: "work",
    desc: "Managing finances and budget allocation for the Career Gateway 1.0 initiative." },
  { year: "2024–Present", role: "IEEE Student Branch Member", org: "IEEE, Uni. of Sri Jayewardenepura", type: "work",
    desc: "Active member participating in technical and professional development events." },
  { year: "2023–Present", role: "Information and Communication Technology (ICT) – B.Sc. (General)", org: "University of Sri Jayewardenepura", type: "edu",
    desc: "Undergraduate degree focusing on Mathematics, Physics, and Information & Communication Technology." },
  { year: "Sports", role: "Sports Representative", org: "University & Mercantile", type: "award",
    desc: "University Cricket Team representative. University Baseball Team representative. Mercantile Cricket player." },
];

const NAV_LINKS = ["Home", "About", "Projects", "Experience", "Contact"];

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useTyping(phrases: string[]) {
  const [s, setS] = useState({ pIdx: 0, cIdx: 0, deleting: false, text: "" });
  useEffect(() => {
    const target = phrases[s.pIdx];
    if (!s.deleting && s.cIdx < target.length) {
      const t = setTimeout(() => setS(x => ({ ...x, cIdx: x.cIdx + 1, text: target.slice(0, x.cIdx + 1) })), 65);
      return () => clearTimeout(t);
    }
    if (!s.deleting && s.cIdx === target.length) {
      const t = setTimeout(() => setS(x => ({ ...x, deleting: true })), 2200);
      return () => clearTimeout(t);
    }
    if (s.deleting && s.cIdx > 0) {
      const t = setTimeout(() => setS(x => ({ ...x, cIdx: x.cIdx - 1, text: target.slice(0, x.cIdx - 1) })), 32);
      return () => clearTimeout(t);
    }
    if (s.deleting && s.cIdx === 0) {
      setS(x => ({ ...x, deleting: false, pIdx: (x.pIdx + 1) % phrases.length }));
    }
  }, [s, phrases]);
  return s.text;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function glassCard(isDark: boolean) {
  return isDark
    ? "bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl"
    : "bg-white/75 border border-slate-200/60 backdrop-blur-xl";
}

function SectionLabel({ text, hex }: { text: string; hex: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
      style={{ color: hex, fontFamily: "'DM Mono', monospace" }}>
      {text}
    </p>
  );
}

// ─── MESH BACKGROUND ─────────────────────────────────────────────────────────

function MeshBg({ isDark, accentHex }: { isDark: boolean; accentHex: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? "bg-[#040D1A]" : "bg-[#EEF2F8]"}`} />
      <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-[0.25] animate-[blob1_9s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, ${accentHex} 0%, transparent 65%)` }} />
      <div className="absolute top-1/3 -right-1/4 w-2/3 h-2/3 rounded-full opacity-[0.15] animate-[blob2_11s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, ${accentHex} 0%, transparent 65%)` }} />
      <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 rounded-full opacity-[0.12] animate-[blob3_13s_ease-in-out_infinite]"
        style={{ background: `radial-gradient(circle, ${accentHex} 0%, transparent 65%)` }} />
      <div className={`absolute inset-0 ${isDark ? "opacity-[0.025]" : "opacity-[0.04]"}`}
        style={{
          backgroundImage: `linear-gradient(${isDark ? "rgba(225,235,245,1)" : "rgba(26,37,53,1)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(225,235,245,1)" : "rgba(26,37,53,1)"} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }} />
    </div>
  );
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────

function MagneticBtn({ children, onClick, primary, accentHex, isDark, className = "" }: {
  children: React.ReactNode; onClick?: () => void; primary?: boolean;
  accentHex: string; isDark: boolean; className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [xy, setXY] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setXY({ x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.28 });
  };
  const style: React.CSSProperties = {
    transform: `translate(${xy.x}px,${xy.y}px)`,
    transition: "transform 0.15s ease",
    fontFamily: "'Outfit', sans-serif",
    ...(primary
      ? { background: accentHex, color: isDark ? "#040D1A" : "#fff" }
      : {
          border: `1.5px solid ${accentHex}55`,
          color: isDark ? "#E1EBF5" : "#1A2535",
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.6)",
        }),
  };
  return (
    <button ref={ref} onMouseMove={onMove} onMouseLeave={() => setXY({ x: 0, y: 0 })}
      onClick={onClick} style={style}
      className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:brightness-110 transition-[filter] duration-200 ${className}`}>
      {children}
    </button>
  );
}

// ─── FLIP CARD ───────────────────────────────────────────────────────────────

function FlipCard({ isDark, accentHex }: { isDark: boolean; accentHex: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="relative w-72 h-96 cursor-pointer select-none"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setFlipped(true)} onMouseLeave={() => setFlipped(false)}>
      <div className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}>
          <img src="/profile_p.HEIC"
            alt="Nirmal Colambage — Aspiring Data Scientist" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accentHex}60 0%, transparent 55%)` }} />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Nirmal Colambage</p>
            <p className="text-white/65 text-sm">Hover to flip →</p>
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold"
            style={{ background: accentHex, color: "#040D1A", fontFamily: "'DM Mono', monospace" }}>
            OPEN TO WORK
          </div>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 rounded-2xl p-6 flex flex-col gap-3 shadow-2xl ${isDark ? "bg-[#091629] border border-white/10" : "bg-white border border-slate-200"}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div className="mb-1">
            <p className="font-extrabold text-xl" style={{ color: accentHex, fontFamily: "'Outfit', sans-serif" }}>Nirmal Colambage</p>
            <p className={`text-sm ${isDark ? "text-white/55" : "text-slate-500"}`}>ICT Undergraduate & Aspiring Data Scientist</p>
          </div>
          {[
            ["University", "Uni. of Sri Jayewardenepura"],
            ["Degree", "Information and Communication Technology (ICT) – B.Sc. (General)"],
            ["Graduating", "2028"],
            ["Open to", "DS / DA / BA Roles"],
            ["Focus", "ML + SQL + Python"],
          ].map(([k, v]) => (
            <div key={k} className={`flex justify-between text-sm border-b pb-2 ${isDark ? "border-white/8" : "border-slate-100"}`}>
              <span className={isDark ? "text-white/45" : "text-slate-400"} style={{ fontFamily: "'DM Mono', monospace" }}>{k}</span>
              <span className={`font-semibold text-right max-w-[60%] ${isDark ? "text-white/90" : "text-slate-800"}`}>{v}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-auto">
            {[Github, Linkedin, Mail].map((Icon, i) => (
              <button key={i} className={`p-2 rounded-lg transition-colors ${isDark ? "bg-white/8 hover:bg-white/15" : "bg-slate-100 hover:bg-slate-200"}`}
                style={{ color: accentHex }}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SKILL GAUGE ─────────────────────────────────────────────────────────────

function SkillGauge({ label, pct, Icon, accentHex, isDark }: {
  label: string; pct: number; Icon: React.ElementType; accentHex: string; isDark: boolean;
}) {
  const { ref, inView } = useInView(0.3);
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(v + 1.6, pct);
      setCur(v);
      if (v >= pct) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [inView, pct]);
  const R = 44, C = 2 * Math.PI * R;
  const offset = C - (cur / 100) * C;
  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="6" className={isDark ? "stroke-white/10" : "stroke-slate-200"} />
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="6" strokeLinecap="round"
            stroke={accentHex} strokeDasharray={C} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.02s linear", filter: `drop-shadow(0 0 7px ${accentHex}90)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <Icon size={15} style={{ color: accentHex }} />
          <span className="text-lg font-extrabold" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {Math.round(cur)}%
          </span>
        </div>
      </div>
      <span className={`text-xs font-semibold text-center leading-tight ${isDark ? "text-white/60" : "text-slate-500"}`}
        style={{ fontFamily: "'DM Mono', monospace" }}>
        {label}
      </span>
    </div>
  );
}

// ─── TECH PILL ───────────────────────────────────────────────────────────────

function TechPill({ name, note, isDark }: { name: string; note: string; isDark: boolean }) {
  const [show, setShow] = useState(false);
  const iconMap: Record<string, string> = {
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "Power BI": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powerbi/powerbi-original.svg",
    Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "Machine Learning": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    Statistics: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
    Pandas: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    "scikit-learn": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sklearn/sklearn-original.svg",
    MATLAB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
    "HTML/CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "Git/GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    // Add more mappings as needed
  };
  const iconSrc = iconMap[name] || "";
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default transition-all duration-200 border ${
        isDark ? "bg-white/[0.07] border-white/[0.1] text-white/75 hover:bg-white/[0.14]" : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}>
        {iconSrc ? <img src={iconSrc} alt={name} className="h-6 w-6 inline-block" /> : name}
      </div>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }} transition={{ duration: 0.13 }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3 py-2 rounded-xl text-xs w-52 text-center z-20 shadow-2xl border ${
              isDark ? "bg-[#0D2044] border-white/15 text-white/80" : "bg-white border-slate-200/80 text-slate-600"
            }`}>
            {note}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent ${
              isDark ? "border-t-[#0D2044]" : "border-t-white"
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({ project, isDark, accentHex, onOpen }: {
  project: Project; isDark: boolean; accentHex: string; onOpen: () => void;
}) {
  return (
    <div onClick={onOpen}
      className={`rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 ${glassCard(isDark)}`}
      style={{ boxShadow: `0 4px 24px ${isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.07)"}` }}>
      <div className="relative h-44 overflow-hidden bg-slate-800">
        <img src={project.img} alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          style={{ background: `${accentHex}35` }}>
          <ExternalLink size={26} className="text-white drop-shadow-lg" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{ background: `${accentHex}20`, color: accentHex }}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className={`font-bold text-base mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          {project.title}
        </h3>
        <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-white/55" : "text-slate-500"}`}>
          {project.desc}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {project.metrics.slice(0, 2).map(m => (
            <div key={m} className={`text-xs px-2 py-1.5 rounded-lg font-medium ${isDark ? "bg-white/[0.05] text-white/65" : "bg-slate-50 text-slate-600"}`}
              style={{ fontFamily: "'DM Mono', monospace" }}>
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────

function ProjectModal({ project, isDark, accentHex, onClose }: {
  project: Project; isDark: boolean; accentHex: string; onClose: () => void;
}) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4,13,26,0.82)", backdropFilter: "blur(10px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.88, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 24 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border ${
          isDark ? "bg-[#071220] border-white/[0.1]" : "bg-white border-slate-200"
        }`}
        style={{ boxShadow: `0 32px 90px ${accentHex}28` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 bg-slate-800 overflow-hidden">
          <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${isDark ? "#071220" : "#fff"} 0%, transparent 55%)` }} />
          <button onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/20 hover:bg-black/35 text-white"}`}>
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{ background: `${accentHex}20`, color: accentHex }}>
                {tag}
              </span>
            ))}
          </div>
          <h3 className={`text-2xl font-extrabold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}>
            {project.title}
          </h3>
          <p className={`leading-relaxed mb-5 ${isDark ? "text-white/65" : "text-slate-600"}`}>
            {project.detail}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {project.metrics.map(m => (
              <div key={m} className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold ${isDark ? "bg-white/[0.05] text-white/80" : "bg-slate-50 text-slate-700"}`}>
                <Check size={13} style={{ color: accentHex, flexShrink: 0 }} />
                {m}
              </div>
            ))}
          </div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-white/35" : "text-slate-400"}`}
            style={{ fontFamily: "'DM Mono', monospace" }}>
            Stack
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.map(s => (
              <span key={s} className={`px-3 py-1 rounded-lg text-xs font-semibold border ${isDark ? "bg-white/[0.05] border-white/[0.1] text-white/65" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                {s}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/Chethiya4/FinalProject" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
              style={{ background: accentHex, color: isDark ? "#040D1A" : "#fff" }}>
              <Github size={15} /> GitHub
            </a>
            
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── TIMELINE NODE ────────────────────────────────────────────────────────────

function TimelineNode({ entry, index, isDark, accentHex }: {
  entry: TimelineEntry; index: number; isDark: boolean; accentHex: string;
}) {
  const { ref, inView } = useInView(0.2);
  const Icon = entry.type === "work" ? Briefcase : entry.type === "edu" ? GraduationCap : Award;
  return (
    <div ref={ref} className="flex gap-5 transition-all duration-700"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transitionDelay: `${index * 80}ms` }}>
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-600"
          style={{
            borderColor: inView ? accentHex : "transparent",
            background: inView ? `${accentHex}18` : (isDark ? "#0E2040" : "#EEF2F8"),
            boxShadow: inView ? `0 0 18px ${accentHex}45` : "none",
          }}>
          <Icon size={15} style={{ color: accentHex }} />
        </div>
        <div className="flex-1 w-px mt-2 min-h-[52px]" style={{ background: `linear-gradient(to bottom, ${accentHex}45, transparent)` }} />
      </div>
      <div className="pb-10 flex-1">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-1.5">
          <div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
              {entry.role}
            </h4>
            <p className="text-sm font-semibold" style={{ color: accentHex }}>{entry.org}</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
            style={{ background: `${accentHex}18`, color: accentHex, fontFamily: "'DM Mono', monospace" }}>
            {entry.year}
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${isDark ? "text-white/55" : "text-slate-500"}`}>{entry.desc}</p>
      </div>
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm({ isDark, accentHex }: { isDark: boolean; accentHex: string }) {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [shakingField, setShakingField] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.subject.trim()) e.subject = "Subject required";
    if (form.message.trim().length < 10) e.message = "At least 10 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      setShakingField(first);
      setTimeout(() => setShakingField(null), 600);
    } else {
      setLoading(true);
      setTimeout(() => { setLoading(false); setDone(true); }, 1400);
    }
  };

  const fieldBase = (f: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all duration-250 ${
      errors[f]
        ? "border-red-500 bg-red-500/8 text-red-400 placeholder-red-400/50"
        : isDark
        ? `bg-white/[0.05] border-white/[0.08] ${isDark ? "text-white/85" : "text-slate-800"} placeholder-white/25 focus:border-[${accentHex}]`
        : "bg-white/80 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400"
    } ${shakingField === f ? "animate-[shake_0.5s_ease]" : ""}`;

  if (done) {
    return (
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10, delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: accentHex, boxShadow: `0 0 32px ${accentHex}60` }}>
          <Check size={28} style={{ color: isDark ? "#040D1A" : "#fff" }} />
        </motion.div>
        <h3 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
          Message Sent! 🚀
        </h3>
        <p className={`text-sm ${isDark ? "text-white/55" : "text-slate-500"}`}>I'll respond within 24 hours.</p>
        <button onClick={() => { setDone(false); setForm({ name: "", email: "", subject: "", message: "" }); setErrors({}); }}
          className="text-sm font-bold mt-2" style={{ color: accentHex }}>
          Send another →
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input type="text" placeholder="Full Name" value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: undefined })); }}
            className={fieldBase("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email Address" value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(x => ({ ...x, email: undefined })); }}
            className={fieldBase("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
        </div>
      </div>
      <div>
        <input type="text" placeholder="Subject" value={form.subject}
          onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); setErrors(x => ({ ...x, subject: undefined })); }}
          className={fieldBase("subject")} />
        {errors.subject && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.subject}</p>}
      </div>
      <div>
        <textarea rows={5} placeholder="Your message..." value={form.message}
          onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(x => ({ ...x, message: undefined })); }}
          className={`${fieldBase("message")} resize-none`} />
        {errors.message && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{errors.message}</p>}
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{ background: accentHex, color: isDark ? "#040D1A" : "#fff", opacity: loading ? 0.7 : 1, fontFamily: "'Outfit', sans-serif" }}>
        {loading ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Sending…</> : <><Mail size={15} />Send Message</>}
      </button>
    </form>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ active, isDark, setIsDark, accent, setAccent }: {
  active: string; isDark: boolean; setIsDark: (v: boolean) => void;
  accent: AccentKey; setAccent: (v: AccentKey) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [accentOpen, setAccentOpen] = useState(false);
  const accentHex = ACCENTS[accent].hex;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
      ? `${isDark ? "bg-[#040D1A]/85 border-b border-white/[0.08]" : "bg-white/85 border-b border-slate-200/60"} backdrop-blur-2xl py-3`
      : "py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button onClick={() => goto("home")}
          className={`text-lg font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          Nirmal<span style={{ color: accentHex }}>.</span>Colambage
        </button>

        <div className="hidden md:flex items-center">
          {NAV_LINKS.map(item => {
            const id = item.toLowerCase();
            const isActive = active === id;
            return (
              <button key={item} onClick={() => goto(id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isDark
                    ? isActive ? "text-white" : "text-white/50 hover:text-white/85"
                    : isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                {item}
                {isActive && (
                  <motion.div layoutId="nav-ul" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background: accentHex }} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Accent swapper */}
          <div className="relative">
            <button onClick={() => setAccentOpen(!accentOpen)}
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/8" : "hover:bg-slate-100"}`}>
              <Palette size={17} style={{ color: accentHex }} />
            </button>
            <AnimatePresence>
              {accentOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.9, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }} transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-10 rounded-xl p-2.5 flex flex-col gap-1 min-w-[130px] shadow-2xl border ${
                    isDark ? "bg-[#0A1C30] border-white/[0.1]" : "bg-white border-slate-200"
                  }`}>
                  {(Object.keys(ACCENTS) as AccentKey[]).map(k => (
                    <button key={k} onClick={() => { setAccent(k); setAccentOpen(false); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        accent === k ? (isDark ? "bg-white/10" : "bg-slate-100") : (isDark ? "hover:bg-white/6" : "hover:bg-slate-50")
                      } ${isDark ? "text-white/80" : "text-slate-700"}`}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: ACCENTS[k].hex }} />
                      {ACCENTS[k].label}
                      {accent === k && <Check size={11} style={{ color: ACCENTS[k].hex, marginLeft: "auto" }} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Dark/light toggle */}
          <button onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/8" : "hover:bg-slate-100"}`}>
            {isDark ? <Sun size={17} className="text-white/60" /> : <Moon size={17} className="text-slate-500" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function HeroSection({ isDark, accent }: { isDark: boolean; accent: AccentKey }) {
  const accentHex = ACCENTS[accent].hex;
  const text = useTyping(PHRASES);
  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="flex items-center gap-2.5 mb-7">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: accentHex }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: accentHex }} />
            </span>
            <span className={`text-sm font-semibold ${isDark ? "text-white/55" : "text-slate-500"}`}
              style={{ fontFamily: "'DM Mono', monospace" }}>
              Open to Opportunities
            </span>
          </div>
          <h1 className={`text-5xl md:text-6xl xl:text-[5.5rem] font-extrabold leading-[1.02] tracking-tight mb-5 ${isDark ? "text-white" : "text-slate-900"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}>
            Hi, I'm{" "}
            <span style={{ color: accentHex, textShadow: `0 0 30px ${accentHex}60` }}>
              Nirmal Colambage
            </span>
          </h1>
          <div className={`text-xl md:text-2xl font-semibold mb-7 min-h-[1.8em] flex items-center gap-1 ${isDark ? "text-white/55" : "text-slate-500"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span style={{ color: accentHex }}>{text}</span>
            <span className="w-0.5 h-6 inline-block animate-pulse rounded-sm" style={{ background: accentHex }} />
          </div>
          <p className={`text-base leading-relaxed mb-10 max-w-md ${isDark ? "text-white/45" : "text-slate-500"}`}>
            ICT Undergraduate | Aspiring Data Scientist & AI Enthusiast
          </p>
          <div className="flex gap-4 flex-wrap mb-10">
            <MagneticBtn primary accentHex={accentHex} isDark={isDark} onClick={() => goto("projects")}>
              View My Work <Zap size={14} />
            </MagneticBtn>
            <MagneticBtn accentHex={accentHex} isDark={isDark} onClick={() => goto("contact")}>
              Contact Me
            </MagneticBtn>
          </div>
          <div className="flex gap-5">
            {[
              { Icon: Github, href: "https://github.com/ravinducolambage-hue", label: "github" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/nirmal-colambage/", label: "linkedin" },
              { Icon: Mail, href: "mailto:ravinducolambage@gmail.com", label: "mail" },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href}
                className={`transition-all duration-200 hover:scale-110 ${isDark ? "text-white/35 hover:text-white/80" : "text-slate-400 hover:text-slate-700"}`}
                style={{ transition: "color 0.2s, transform 0.2s" }}>
                <Icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — profile flip card */}
        <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
              style={{ background: accentHex, transform: "scale(0.85) translateY(20px)" }} />
            <FlipCard isDark={isDark} accentHex={accentHex} />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className={`text-xs ${isDark ? "text-white/25" : "text-slate-400"}`} style={{ fontFamily: "'DM Mono', monospace" }}>scroll</span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown size={14} className={isDark ? "text-white/25" : "text-slate-400"} />
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection({ isDark, accent }: { isDark: boolean; accent: AccentKey }) {
  const accentHex = ACCENTS[accent].hex;
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Parallax texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=900&fit=crop&auto=format"
          alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isDark ? 0.04 : 0.06, transform: `translateY(${scrollY * 0.12}px)`, filter: "blur(1px)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionLabel text="§02 — About" hex={accentHex} />
        <h2 className={`text-4xl md:text-5xl font-extrabold mb-14 ${isDark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          Who I Am
        </h2>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <div className="space-y-4">
            <p className={`text-base leading-relaxed ${isDark ? "text-white/65" : "text-slate-600"}`}>
              I am a second-year Information Technology undergraduate student at the University of Sri Jayewardenapura, specializing in data science and data analysis. My work bridges the gap between structured analytical insights and practical engineering by building optimized SQL databases, designing interactive Power BI dashboards, and developing clean Python workflows that translate complex data into clear business value.
            </p>
            <p className={`text-base leading-relaxed ${isDark ? "text-white/65" : "text-slate-600"}`}>
              I currently balance my academic studies with real-world execution as a part-time Assistant Sales Manager at Power Hands Plantation. When I am not writing scripts or managing repositories on GitHub, I combine my technical skills with my passion for sports analytics, specifically focusing on cricket statistics and university sports performance. I care deeply about making data accessible, intuitive, and highly actionable for decision-makers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["1", "Projects"], ["Still Searching", "Internships"], ["1.3K", "Users Reached"], ["Still Graduating", "GPA"]].map(([v, l]) => (
              <div key={l} className={`p-5 rounded-2xl border shadow-md ${glassCard(isDark)}`}>
                <p className={`${v.length > 5 ? "text-xl sm:text-2xl" : "text-3xl"} font-extrabold mb-1`} style={{ color: accentHex, fontFamily: "'Outfit', sans-serif" }}>{v}</p>
                <p className={`text-sm ${isDark ? "text-white/55" : "text-slate-500"}`}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skill gauges */}
        <div className={`p-8 rounded-2xl border shadow-lg mb-12 ${glassCard(isDark)}`}>
          <SectionLabel text="Core Proficiency" hex={accentHex} />
          <div className="flex flex-wrap gap-8 justify-center mt-6">
            {SKILLS.map(s => (
              <SkillGauge key={s.label} label={s.label} pct={s.pct} Icon={s.Icon} accentHex={accentHex} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Tech pills */}
        <div>
          <SectionLabel text="Tech Stack" hex={accentHex} />
          <div className="flex flex-wrap gap-2 mt-3">
            {TECH_TAGS.map(t => <TechPill key={t.name} name={t.name} note={t.note} isDark={isDark} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ isDark, accent }: { isDark: boolean; accent: AccentKey }) {
  const accentHex = ACCENTS[accent].hex;
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState<Project | null>(null);
  const filtered = tag === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(tag));

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel text="§03 — Full Stack Projects" hex={accentHex} />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <h2 className={`text-4xl md:text-5xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}>
            Full Stack Projects
          </h2>
          <a href="#" className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isDark ? "text-white/45 hover:text-white/80" : "text-slate-400 hover:text-slate-700"}`}>
            <Github size={16} /> View all on GitHub
          </a>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-10 items-center">
          {FILTER_TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={tag === t
                ? { background: accentHex, color: isDark ? "#040D1A" : "#fff", boxShadow: `0 4px 16px ${accentHex}45` }
                : {
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  color: isDark ? "rgba(225,235,245,0.65)" : "#64748B",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}>
              {t}
            </button>
          ))}
          <span className={`ml-2 text-xs font-medium ${isDark ? "text-white/35" : "text-slate-400"}`}
            style={{ fontFamily: "'DM Mono', monospace" }}>
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map(p => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93 }} transition={{ duration: 0.22 }}>
                <ProjectCard project={p} isDark={isDark} accentHex={accentHex} onOpen={() => setOpen(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} isDark={isDark} accentHex={accentHex} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ExperienceSection({ isDark, accent }: { isDark: boolean; accent: AccentKey }) {
  const accentHex = ACCENTS[accent].hex;
  return (
    <section id="experience" className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        <SectionLabel text="§04 — Experience" hex={accentHex} />
        <h2 className={`text-4xl md:text-5xl font-extrabold mb-14 ${isDark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          Career Roadmap
        </h2>
        <div>
          {TIMELINE.map((entry, i) => (
            <TimelineNode key={entry.year + entry.role} entry={entry} index={i} isDark={isDark} accentHex={accentHex} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ isDark, accent }: { isDark: boolean; accent: AccentKey }) {
  const accentHex = ACCENTS[accent].hex;
  return (
    <section id="contact" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionLabel text="§05 — Contact" hex={accentHex} />
        <h2 className={`text-4xl md:text-5xl font-extrabold mb-14 ${isDark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}>
          Let's Work Together
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <p className={`text-base leading-relaxed mb-8 ${isDark ? "text-white/55" : "text-slate-500"}`}>
              Open to data science internships, part-time analytics roles, and interesting research collaborations.
              I respond within 24 hours.
            </p>
            {[
              { Icon: Mail, label: "Email", value: "ravinducolambage@gmail.com", href: "mailto:ravinducolambage@gmail.com" },
              { Icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/nirmal-colambage", href: "https://www.linkedin.com/in/nirmal-colambage/" },
              { Icon: Github, label: "GitHub", value: "github.com/ravinducolambage-hue", href: "https://github.com/ravinducolambage-hue" },
            ].map(({ Icon, label, value, href }) => (
              <a key={label} href={href}
                className={`flex items-center gap-4 py-4 border-b group ${isDark ? "border-white/[0.07]" : "border-slate-100"}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ background: `${accentHex}18` }}>
                  <Icon size={17} style={{ color: accentHex }} />
                </div>
                <div>
                  <p className={`text-xs ${isDark ? "text-white/35" : "text-slate-400"}`} style={{ fontFamily: "'DM Mono', monospace" }}>{label}</p>
                  <p className={`text-sm font-semibold ${isDark ? "text-white/85" : "text-slate-800"}`}>{value}</p>
                </div>
                <ExternalLink size={12} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-white/40" : "text-slate-400"}`} />
              </a>
            ))}
          </div>

          {/* Form */}
          <div className={`p-7 rounded-2xl border shadow-xl ${glassCard(isDark)}`}>
            <ContactForm isDark={isDark} accentHex={accentHex} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ isDark, accentHex }: { isDark: boolean; accentHex: string }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <footer className={`border-t py-8 px-6 ${isDark ? "border-white/[0.07]" : "border-slate-200"}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`} style={{ fontFamily: "'DM Mono', monospace" }}>
          © 2025 Alex Rivera — Built with React + Tailwind
        </p>
        <p className={`text-xs ${isDark ? "text-white/30" : "text-slate-400"}`} style={{ fontFamily: "'DM Mono', monospace" }}>
          Seattle, WA · UW Class of 2026
        </p>
      </div>
      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40"
            style={{ background: accentHex, boxShadow: `0 4px 20px ${accentHex}60` }}>
            <ArrowUp size={18} style={{ color: "#040D1A" }} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState<AccentKey>("teal");
  const [active, setActive] = useState("home");
  const accentHex = ACCENTS[accent].hex;

  // Apply dark class to html
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Active section tracker
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.35, rootMargin: "-80px 0px -45% 0px" }
    );
    NAV_LINKS.forEach(name => {
      const el = document.getElementById(name.toLowerCase());
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "text-white" : "text-slate-900"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${accentHex}; border-radius: 2px; }
        * { scrollbar-width: thin; scrollbar-color: ${accentHex} transparent; }
        @keyframes blob1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(35px,-55px) scale(1.1); }
          66% { transform: translate(-25px,20px) scale(0.92); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-45px,32px) scale(1.06); }
          66% { transform: translate(22px,-42px) scale(0.94); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(18px,44px) scale(1.08); }
          66% { transform: translate(-32px,-18px) scale(0.93); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          18% { transform: translateX(-9px); }
          36% { transform: translateX(9px); }
          54% { transform: translateX(-5px); }
          72% { transform: translateX(5px); }
        }
      `}</style>

      <MeshBg isDark={isDark} accentHex={accentHex} />
      <Navbar active={active} isDark={isDark} setIsDark={setIsDark} accent={accent} setAccent={setAccent} />
      <HeroSection isDark={isDark} accent={accent} />
      <AboutSection isDark={isDark} accent={accent} />
      <ProjectsSection isDark={isDark} accent={accent} />
      <ExperienceSection isDark={isDark} accent={accent} />
      <ContactSection isDark={isDark} accent={accent} />
      <Footer isDark={isDark} accentHex={accentHex} />
    </div>
  );
}
