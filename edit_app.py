import os
import re

app_file = "c:/Users/USER/OneDrive/Desktop/portfolio-01-main/portfolio-01-main/src/app/App.tsx"

with open(app_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
import_replace = """  Zap,
  Phone,
  Globe,
  Building2,
  Copy,
  MapPin
} from "lucide-react";
import { REFERENCES_DATA } from "../data/referencesData";"""
content = content.replace('  Zap,\n} from "lucide-react";', import_replace)

# 2. NAV_LINKS
nav_find = """  "Projects",
  "Experience",
  "Articles",
  "Contact",
];"""
nav_replace = """  "Projects",
  "Experience",
  "Articles",
  "References",
  "Contact",
];"""
content = content.replace(nav_find, nav_replace)

# 3. Stats update
stats_find = '["1", "Projects"],'
stats_replace = '["3", "Projects"],'
content = content.replace(stats_find, stats_replace)

# 4. Reference Section
ref_section_code = """
// ─── REFERENCES SECTION ────────────────────────────────────────────────────────

function ReferenceCard({
  reference,
  isDark,
  accentHex,
}: {
  reference: any;
  isDark: boolean;
  accentHex: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryEmail = typeof reference.email === 'string' ? reference.email : reference.email.primary;
  
  return (
    <div
      className="relative w-full max-w-[320px] h-[420px] cursor-pointer select-none mx-auto"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden shadow-xl border flex flex-col items-center justify-center p-6 ${
            isDark ? "bg-[#0B1525] border-white/10" : "bg-white border-black/10"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="w-[120px] h-[120px] rounded-full flex items-center justify-center text-4xl font-bold mb-6 overflow-hidden relative"
            style={{ 
              border: `3px solid ${accentHex}`,
              background: `linear-gradient(135deg, ${accentHex}99 0%, ${accentHex}33 100%)`,
              color: "#fff"
            }}
          >
            {reference.photoFile ? (
              <img
                src={`${import.meta.env.BASE_URL}images/references/${reference.photoFile}`}
                alt={reference.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <span className="absolute inset-0 flex items-center justify-center -z-10">{reference.initials}</span>
          </div>
          
          <h3 className={`text-xl font-bold mb-1 text-center ${isDark ? "text-white" : "text-slate-900"}`}>
            {reference.name}
          </h3>
          <p className="text-[13px] text-center mb-6 text-slate-500 font-medium">
            {reference.title}
          </p>
          
          <div 
            className="mt-auto px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${accentHex}20`,
              color: isDark ? "#fff" : accentHex,
            }}
          >
            USJ
          </div>
        </div>

        {/* Back Face */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden shadow-xl border p-6 flex flex-col justify-between ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: isDark ? "#08101C" : "#f8fafc",
            backgroundImage: `linear-gradient(135deg, ${accentHex}10 0%, ${accentHex}05 100%)`,
          }}
        >
          <div className="space-y-4 text-sm relative z-10">
            <div className="flex items-start gap-3">
              <GraduationCap size={16} className="mt-1 flex-shrink-0" style={{ color: accentHex }} />
              <div>
                <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{reference.title}</div>
                <div className="text-slate-500 text-xs mt-0.5">{reference.department}</div>
                <div className="text-slate-500 text-xs">{reference.faculty}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building2 size={16} className="flex-shrink-0" style={{ color: accentHex }} />
              <div className="text-slate-500 text-xs">{reference.university}</div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="flex-shrink-0" style={{ color: accentHex }} />
              <div className="text-xs">
                {typeof reference.email === 'string' ? (
                  <a href={`mailto:${reference.email}`} className="hover:underline" style={{ color: accentHex }}>{reference.email}</a>
                ) : (
                  <>
                    <a href={`mailto:${reference.email.primary}`} className="hover:underline block" style={{ color: accentHex }}>{reference.email.primary}</a>
                    {reference.email.secondary && <a href={`mailto:${reference.email.secondary}`} className="hover:underline block mt-1" style={{ color: accentHex }}>{reference.email.secondary}</a>}
                  </>
                )}
              </div>
            </div>

            {(reference.mobile || reference.office || reference.tel) && (
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentHex }} />
                <div className="text-slate-500 text-xs space-y-1">
                  {reference.mobile && <div>Mobile: {reference.mobile}</div>}
                  {reference.office && <div>Office: {reference.office}</div>}
                  {reference.tel && <div>Tel: {reference.tel}</div>}
                </div>
              </div>
            )}

            {reference.website && (
              <div className="flex items-center gap-3">
                <Globe size={16} className="flex-shrink-0" style={{ color: accentHex }} />
                <a href={reference.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: accentHex }}>
                  Website
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col items-center gap-2 relative z-10">
            <button
              onClick={(e) => handleCopyEmail(e, primaryEmail)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors w-full"
              style={{
                backgroundColor: copied ? "#10B981" : accentHex,
                color: "#fff",
              }}
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copy Email
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-500 lg:hidden">
              ← Tap to flip back
            </p>
          </div>
          
          <div className="absolute inset-0 border-2 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
               style={{ borderColor: accentHex, boxShadow: `inset 0 0 20px ${accentHex}20` }} />
        </div>
      </div>
    </div>
  );
}

function ReferencesSection({
  isDark,
  accent,
}: {
  isDark: boolean;
  accent: AccentKey;
}) {
  const accentHex = ACCENTS[accent].hex;
  return (
    <section id="references" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionLabel text="References" hex={accentHex} />
        <h2
          className={`text-4xl md:text-5xl font-extrabold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          References
        </h2>
        <p className="text-slate-500 mb-14 max-w-2xl text-lg">
          Academic professionals I have had the privilege of learning from.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {REFERENCES_DATA.map((ref, i) => (
            <motion.div
              key={ref.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`w-full ${i === 2 ? 'md:col-span-2 lg:col-span-1 flex justify-center' : ''}`}
            >
              <ReferenceCard
                reference={ref}
                isDark={isDark}
                accentHex={accentHex}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({"""
content = content.replace("function ContactSection({", ref_section_code)

# 5. Injection in render
render_find = """      <ArticlesSection isDark={isDark} accent={accent} />
      <ContactSection isDark={isDark} accent={accent} />"""
render_replace = """      <ArticlesSection isDark={isDark} accent={accent} />
      <ReferencesSection isDark={isDark} accent={accent} />
      <ContactSection isDark={isDark} accent={accent} />"""
content = content.replace(render_find, render_replace)

with open(app_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied.")
