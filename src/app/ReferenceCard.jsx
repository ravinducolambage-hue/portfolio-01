import { useState } from "react";
import { GraduationCap, Building2, Mail, Phone, Globe, Check, Copy } from "lucide-react";

export default function ReferenceCard({ reference, isDark, accentHex }) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e, email) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const primaryEmail = reference.primaryEmail;

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
            {reference.photo ? (
              <img
                src={`${import.meta.env.BASE_URL}${reference.photo.replace(/^\//, "")}`}
                alt={reference.name}
                className="w-full h-full object-cover relative z-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <span className="absolute inset-0 flex items-center justify-center z-0">{reference.initials}</span>
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
                {reference.emails && reference.emails.map((em, idx) => (
                  <a key={idx} href={`mailto:${em}`} className="hover:underline block mt-0.5" style={{ color: accentHex }}>{em}</a>
                ))}
              </div>
            </div>

            {reference.phones && reference.phones.length > 0 && (
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentHex }} />
                <div className="text-slate-500 text-xs space-y-1">
                  {reference.phones.map((ph, idx) => (
                    <div key={idx}>{ph.label}: {ph.number}</div>
                  ))}
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
