// components/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import {
  Users, TrendingUp, Clock, CreditCard,
  ArrowUpRight, BookOpen, CheckCircle2,
  AlertCircle, Bell, Settings, MoreHorizontal,
  Target, Activity, Calendar, DollarSign,
  Zap, Star, Award, BarChart3, Eye,
  ChevronRight, Sparkles, GraduationCap,
  TrendingDown, RefreshCw, Filter, Menu, X
} from "lucide-react";
import { useApp } from "../context/AppContext";

const T = {
  indigo: "#6366f1",
  indigoDark: "#4f46e5",
  emerald: "#10b981",
  amber: "#f59e0b",
  blue: "#3b82f6",
  rose: "#f43f5e",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  border: "#e8edf5",
  borderLight: "#f1f5f9",
  text: "#0d1117",
  textMid: "#334155",
  textMuted: "#64748b",
  textFaint: "#94a3b8",
};

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  * { box-sizing: border-box; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse2 {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }
  @keyframes barGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes slideRight {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }
  
  .dash-card {
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
  }
  .dash-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(99,102,241,0.12), 0 8px 20px rgba(0,0,0,0.04) !important;
  }
  .row-hover {
    transition: all 0.2s ease;
    border-radius: 12px;
  }
  .row-hover:hover {
    background: linear-gradient(90deg, #f8f9ff, #ffffff) !important;
  }
  .pill-btn {
    transition: all 0.2s ease;
  }
  .pill-btn:hover {
    background: #6366f1 !important;
    color: #fff !important;
    transform: translateY(-1px);
  }
  .mini-bar {
    transform-origin: bottom;
    animation: barGrow 0.7s cubic-bezier(.4,0,.2,1) forwards;
  }
  .progress-track {
    animation: slideRight 1s cubic-bezier(.4,0,.2,1) forwards;
  }
  .stat-val {
    animation: countUp 0.5s ease forwards;
  }

  /* Responsive Styles */
  .dashboard-root {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  /* Mobile First - Base styles */
  .dashboard-container {
    font-family: 'Bricolage Grotesque', sans-serif;
    padding: 12px;
  }
  
  /* Tablet */
  @media (min-width: 640px) {
    .dashboard-container {
      padding: 16px;
    }
    .hero-header {
      padding: 24px !important;
    }
    .hero-title {
      font-size: 26px !important;
    }
    .stat-card-value {
      font-size: 28px !important;
    }
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    .dashboard-container {
      padding: 20px;
    }
    .hero-header {
      padding: 30px 32px !important;
    }
    .hero-title {
      font-size: 30px !important;
    }
    .stat-card-value {
      font-size: 32px !important;
    }
    .students-list .student-item {
      padding: 13px 6px !important;
    }
  }
  
  /* Large Desktop */
  @media (min-width: 1280px) {
    .dashboard-container {
      padding: 24px;
    }
  }
  
  /* Grid responsive */
  .stats-grid {
    display: grid;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (min-width: 480px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
  }
  
  @media (min-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }
  }
  
  .two-col-grid {
    display: grid;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  @media (min-width: 768px) {
    .two-col-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }
  
  .hero-stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  @media (min-width: 640px) {
    .hero-stats {
      flex-wrap: nowrap;
    }
  }
  
  .hero-chip {
    min-width: 80px;
  }
  
  @media (min-width: 480px) {
    .hero-chip {
      min-width: 90px;
    }
  }
  
  @media (min-width: 640px) {
    .hero-chip {
      min-width: 100px;
    }
  }
`;

function Sparkline({ data = [], color = "#6366f1", height = 40, width = 100 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  });
  const area = `M${pts[0]} ${pts.slice(1).map(p => `L${p}`).join(" ")} L${width - pad},${height} L${pad},${height} Z`;
  const line = `M${pts.join(" L")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

function MiniBarChart({ data = [], color = "#6366f1" }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
      {data.map((v, i) => (
        <div key={i} className="mini-bar" style={{
          flex: 1, borderRadius: "4px 4px 0 0",
          height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? color : `${color}55`,
          animationDelay: `${i * 0.06}s`,
        }} />
      ))}
    </div>
  );
}

function Avatar({ initials, color, size = 40 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#fff", flexShrink: 0,
      boxShadow: hovered ? `0 6px 16px ${color}60` : `0 3px 10px ${color}45`,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      transform: hovered ? "scale(1.05)" : "scale(1)",
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}>
      {initials}
    </div>
  );
}

function Badge({ status }) {
  const config = {
    Attended:  { bg: "#ecfdf5", color: "#059669", dot: "#10b981", label: "Attended", icon: <CheckCircle2 size={10} /> },
    Missed:    { bg: "#fff1f2", color: "#e11d48", dot: "#f43f5e", label: "Missed", icon: <AlertCircle size={10} /> },
    Cancelled: { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", label: "Cancelled", icon: <X size={10} /> },
    Scheduled: { bg: "#eef2ff", color: "#4f46e5", dot: "#6366f1", label: "Scheduled", icon: <Clock size={10} /> },
    Completed: { bg: "#ecfdf5", color: "#059669", dot: "#10b981", label: "Completed", icon: <CheckCircle2 size={10} /> },
  };
  const cfg = config[status] || config.Attended;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      letterSpacing: "0.3px",
    }}>
      {cfg.icon}
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, sub, change, icon: Icon, gradient, glow, sparkData, barData, positive = true }) {
  return (
    <div className="dash-card" style={{
      background: T.surface,
      borderRadius: 20,
      border: `1px solid ${T.border}`,
      padding: "16px 14px 14px",
      position: "relative", overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 110, height: 110, borderRadius: "50%",
        background: gradient, opacity: 0.08,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -30, left: -30,
        width: 80, height: 80, borderRadius: "50%",
        background: gradient, opacity: 0.05,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 6px 16px ${glow}`,
        }}>
          <Icon size={18} color="#fff" strokeWidth={1.8} />
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 10, fontWeight: 700,
          color: positive ? T.emerald : T.rose,
          background: positive ? "#ecfdf5" : "#fff1f2",
          padding: "2px 6px", borderRadius: 20,
        }}>
          {positive ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          {change}
        </div>
      </div>

      <div className="stat-val" style={{
        fontSize: "clamp(24px, 5vw, 32px)",
        fontWeight: 800, color: T.text,
        letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 4,
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}>
        {value}
      </div>
      <div style={{ fontSize: "clamp(12px, 3vw, 13px)", fontWeight: 600, color: T.textMid, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: T.textFaint, marginBottom: 10 }}>{sub}</div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {sparkData && <Sparkline data={sparkData} color={gradient.includes("10b981") ? T.emerald : gradient.includes("f59e0b") ? T.amber : gradient.includes("3b82f6") ? T.blue : T.indigo} width={80} height={32} />}
        {barData && <MiniBarChart data={barData} color={gradient.includes("10b981") ? T.emerald : gradient.includes("f59e0b") ? T.amber : gradient.includes("3b82f6") ? T.blue : T.indigo} />}
      </div>
    </div>
  );
}

function SectionCard({ children, style = {} }) {
  return (
    <div className="dash-card" style={{
      background: T.surface,
      borderRadius: 20,
      border: `1px solid ${T.border}`,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, icon, gradient, action, actionLabel = "View all" }) {
  return (
    <div style={{
      padding: "14px 16px 12px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: `1px solid ${T.borderLight}`,
      flexWrap: "wrap",
      gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: T.text, fontSize: "clamp(13px, 3.5vw, 14.5px)", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{title}</div>
          <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: T.textMuted, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>
      {action && (
        <button className="pill-btn" onClick={action} style={{
          background: "#f1f5f9", border: "none", cursor: "pointer",
          color: T.textMid, fontSize: "clamp(10px, 2.5vw, 11px)", fontWeight: 600,
          display: "flex", alignItems: "center", gap: 3,
          padding: "4px 10px", borderRadius: 20,
        }}>
          {actionLabel} <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
}

function ProgressBar({ value, color, height = 5 }) {
  return (
    <div style={{ height, background: "#e2e8f0", borderRadius: height, overflow: "hidden", flex: 1 }}>
      <div className="progress-track" style={{
        height: "100%",
        width: `${Math.min(value, 100)}%`,
        background: color,
        borderRadius: height,
      }} />
    </div>
  );
}

function QuickChip({ label, value, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      background: `${color}12`,
      borderRadius: 12, padding: "8px 10px",
      border: `1px solid ${color}22`,
      flex: 1,
      transition: "all 0.2s ease",
      transform: hovered ? "translateY(-2px)" : "translateY(0)",
      boxShadow: hovered ? `0 4px 12px ${color}20` : "none",
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}>
      <div style={{ fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 800, color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{value}</div>
      <div style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: T.textMuted, fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { students, classes, payments, getStats } = useApp();
  const stats = getStats();
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const listLimit = isMobile ? 3 : 5;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const recentClasses = [...classes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, listLimit);
  const recentPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, listLimit);
  const upcomingClasses = classes
    .filter(c => new Date(c.date) >= new Date() && c.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, listLimit);

  const avatarColors = [T.indigo, T.emerald, T.amber, "#ef4444", T.violet, T.cyan, "#ec4899", "#14b8a6"];

  const baseVal = stats.totalStudents || 3;
  const sparkStudents = [baseVal - 2, baseVal - 1, baseVal, baseVal, baseVal + 1, baseVal + 2, baseVal + 1, baseVal + 3].map(v => Math.max(v, 0));
  const sparkEarnings = [0.6, 0.75, 0.55, 0.9, 0.8, 1.0, 0.85, 1.1].map(v => Math.round((stats.monthlyEarnings || 100) * v));
  const barCollection = [60, 72, 68, 80, 75, stats.collectionRate || 80];
  const barClasses = [3, 5, 4, 7, 6, stats.totalClasses > 0 ? stats.totalClasses % 10 || 5 : 5];

  const statCardsData = [
    {
      label: "Total Students",
      value: stats.totalStudents.toString(),
      sub: `${stats.activeStudents} active · ${stats.totalStudents - stats.activeStudents} inactive`,
      change: `+${stats.activeStudents}`,
      icon: Users,
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      glow: "rgba(99,102,241,0.28)",
      sparkData: sparkStudents,
      positive: true,
    },
    {
      label: "Monthly Earnings",
      value: `₹${stats.monthlyEarnings.toLocaleString()}`,
      sub: "Current month revenue",
      change: `+${stats.collectionRate}%`,
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      glow: "rgba(16,185,129,0.28)",
      sparkData: sparkEarnings,
      positive: true,
    },
    {
      label: "Collection Rate",
      value: `${stats.collectionRate}%`,
      sub: `₹${stats.totalCollected.toLocaleString()} of ₹${stats.totalFee.toLocaleString()}`,
      change: `${stats.collectionRate}%`,
      icon: Target,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      glow: "rgba(245,158,11,0.28)",
      barData: barCollection,
      positive: true,
    },
    {
      label: "Total Classes",
      value: stats.totalClasses.toString(),
      sub: `${stats.attendanceRate.toFixed(0)}% attendance rate`,
      change: `${stats.totalClasses} sessions`,
      icon: BookOpen,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      glow: "rgba(59,130,246,0.28)",
      barData: barClasses,
      positive: true,
    },
  ];

  return (
    <div className="dashboard-root">
      <style>{KEYFRAMES}</style>
      <div className="dashboard-container" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "none" : "translateY(10px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
      }}>
        {/* Hero Header */}
        <div className="hero-header" style={{
          borderRadius: 20,
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(125deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
          padding: "20px",
          boxShadow: "0 20px 60px rgba(99,102,241,0.35)",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(139,92,246,0.25)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: 60, width: 150, height: 150, borderRadius: "50%", background: "rgba(99,102,241,0.2)", filter: "blur(30px)", pointerEvents: "none" }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 20, padding: "2px 10px",
                  fontSize: 9, fontWeight: 700, color: "#e0e7ff", letterSpacing: "0.8px",
                }}>
                  BROWNBRICKS
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,0.85)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse2 2s infinite" }} />
                  Live
                </span>
              </div>

              <h1 className="hero-title" style={{ fontSize: "clamp(20px, 6vw, 30px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 4, lineHeight: 1.2 }}>
                {greeting}, Tutor!
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(10px, 3vw, 12px)" }}>{dateStr}</p>
            </div>

            <div className="hero-stats" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "Students", value: stats.totalStudents, color: "#a5b4fc" },
                { label: "This Month", value: `₹${stats.monthlyEarnings.toLocaleString()}`, color: "#6ee7b7" },
                { label: "Attendance", value: `${stats.attendanceRate.toFixed(0)}%`, color: "#fcd34d" },
              ].map(chip => (
                <div key={chip.label} className="hero-chip" style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 12,
                  padding: "8px 12px",
                  textAlign: "center",
                  minWidth: "70px",
                  transition: "all 0.2s ease",
                }}>
                  <div style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800, color: chip.color }}>{chip.value}</div>
                  <div style={{ fontSize: "clamp(8px, 2.5vw, 10px)", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.3px" }}>{chip.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: "clamp(9px, 2.5vw, 11px)", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Monthly Collection Progress</span>
              <span style={{ fontSize: "clamp(9px, 2.5vw, 11px)", color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{stats.collectionRate}%</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.15)", borderRadius: 5, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${stats.collectionRate}%`,
                background: "linear-gradient(90deg, #6ee7b7, #34d399)",
                borderRadius: 5,
                transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          {statCardsData.map((card, idx) => (
            <div key={card.label} style={{ animation: `fadeUp 0.5s ease ${0.05 + idx * 0.08}s both` }}>
              <StatCard {...card} />
            </div>
          ))}
        </div>

        {/* Two Column Grid - Recent & Upcoming Classes */}
        <div className="two-col-grid">
          <div style={{ animation: "fadeUp 0.5s ease 0.3s both" }}>
            <SectionCard>
              <SectionHeader
                title="Recent Classes"
                subtitle="Latest tutoring sessions"
                icon={<BookOpen size={14} color="#fff" />}
                gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
              />
              <div style={{ padding: "2px 16px 4px" }}>
                {recentClasses.map((c, idx) => (
                  <div key={c.id} className="row-hover" style={{
                    padding: "11px 4px",
                    borderBottom: idx === recentClasses.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 13.5px)", flex: 1 }}>{c.topic}</div>
                      <Badge status={c.status} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 3vw, 11.5px)", color: T.textMuted, flexWrap: "wrap", gap: 6 }}>
                      <span>{c.studentName} · <span style={{ color: T.indigo, fontWeight: 600 }}>{c.subject}</span></span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {recentClasses.length === 0 && (
                  <div style={{ padding: "40px 0", textAlign: "center", color: T.textFaint }}>
                    <BookOpen size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <div style={{ fontSize: 12 }}>No classes yet</div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <div style={{ animation: "fadeUp 0.5s ease 0.36s both" }}>
            <SectionCard>
              <SectionHeader
                title="Upcoming Classes"
                subtitle="Scheduled sessions"
                icon={<Calendar size={14} color="#fff" />}
                gradient="linear-gradient(135deg,#f59e0b,#d97706)"
              />
              <div style={{ padding: "2px 16px 4px" }}>
                {upcomingClasses.map((c, idx) => {
                  const daysLeft = Math.ceil((new Date(c.date) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={c.id} className="row-hover" style={{
                      padding: "11px 4px",
                      borderBottom: idx === upcomingClasses.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                      cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, flexWrap: "wrap", gap: 6 }}>
                        <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 13.5px)", flex: 1 }}>{c.topic}</div>
                        <span style={{
                          fontSize: "clamp(9px, 2.5vw, 10.5px)", fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: daysLeft <= 1 ? "#fff1f2" : daysLeft <= 3 ? "#fffbeb" : "#f0fdf4",
                          color: daysLeft <= 1 ? T.rose : daysLeft <= 3 ? T.amber : T.emerald,
                        }}>
                          {daysLeft <= 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft}d`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 3vw, 11.5px)", color: T.textMuted, flexWrap: "wrap", gap: 6 }}>
                        <span>{c.studentName} · <span style={{ color: T.amber, fontWeight: 600 }}>{c.subject}</span></span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
                {upcomingClasses.length === 0 && (
                  <div style={{ padding: "40px 0", textAlign: "center", color: T.textFaint }}>
                    <Calendar size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <div style={{ fontSize: 12 }}>No upcoming classes</div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Bottom Two Column Grid - Payments & Students */}
        <div className="two-col-grid">
          <div style={{ animation: "fadeUp 0.5s ease 0.42s both" }}>
            <SectionCard>
              <SectionHeader
                title="Recent Payments"
                subtitle="Latest transactions"
                icon={<CreditCard size={14} color="#fff" />}
                gradient="linear-gradient(135deg,#10b981,#059669)"
              />
              <div style={{ padding: "2px 16px 0" }}>
                {recentPayments.map((p, idx) => (
                  <div key={p.id} className="row-hover" style={{
                    padding: "11px 4px",
                    borderBottom: idx === recentPayments.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar
                          initials={p.studentName.split(" ").map(n => n[0]).join("")}
                          color={avatarColors[p.studentId % avatarColors.length]}
                          size={isMobile ? 34 : 38}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 13.5px)" }}>{p.studentName}</div>
                          <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: T.textMuted }}>{p.subject} · {p.method}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: isMobile ? "left" : "right" }}>
                        <div style={{ fontWeight: 800, color: T.emerald, fontSize: "clamp(13px, 3.5vw, 16px)", fontFamily: "'JetBrains Mono', monospace" }}>₹{p.amount.toLocaleString()}</div>
                        <div style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: T.textFaint }}>{new Date(p.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {recentPayments.length === 0 && (
                  <div style={{ padding: "40px 0", textAlign: "center", color: T.textFaint }}>
                    <CreditCard size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <div style={{ fontSize: 12 }}>No payments recorded</div>
                  </div>
                )}
              </div>

              <div style={{ padding: "10px 16px", background: T.surfaceAlt, borderTop: `1px solid ${T.borderLight}`, display: "flex", gap: 10 }}>
                <QuickChip label="Total Collected" value={`₹${stats.totalCollected.toLocaleString()}`} color={T.emerald} />
                <QuickChip label="Collection Rate" value={`${stats.collectionRate}%`} color={T.indigo} />
              </div>
            </SectionCard>
          </div>

          <div style={{ animation: "fadeUp 0.5s ease 0.48s both" }}>
            <SectionCard>
              <SectionHeader
                title="Active Students"
                subtitle="Your current roster"
                icon={<Users size={14} color="#fff" />}
                gradient="linear-gradient(135deg,#3b82f6,#2563eb)"
              />
              <div style={{ padding: "2px 16px 0" }}>
                {students.filter(s => s.status === "Active").slice(0, listLimit).map((s, idx) => {
                  const monthlyPayment = payments.find(
                    p => p.studentId === s.id &&
                      p.month === new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
                  );
                  const attendedCount = classes.filter(c => c.studentId === s.id && c.status === "Attended").length;
                  const totalCount = classes.filter(c => c.studentId === s.id).length;
                  const rate = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;

                  return (
                    <div key={s.id} className="row-hover" style={{
                      padding: "11px 4px",
                      borderBottom: idx === listLimit - 1 ? "none" : `1px solid ${T.borderLight}`,
                      cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar
                          initials={s.name.split(" ").map(n => n[0]).join("")}
                          color={avatarColors[s.id % avatarColors.length]}
                          size={isMobile ? 34 : 38}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 5 }}>
                            <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 13.5px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                            <span style={{
                              fontSize: "clamp(9px, 2.5vw, 10.5px)", fontWeight: 700,
                              color: monthlyPayment ? T.emerald : T.amber,
                              background: monthlyPayment ? "#ecfdf5" : "#fffbeb",
                              padding: "2px 8px", borderRadius: 20, flexShrink: 0,
                            }}>
                              {monthlyPayment ? "Paid ✓" : "Due"}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                            <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: T.textMuted }}>{s.subject} · ₹{s.fee}/mo</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                              <div style={{ width: 45 }}>
                                <ProgressBar value={rate} color={rate > 75 ? T.emerald : rate > 50 ? T.amber : T.rose} height={4} />
                              </div>
                              <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: T.textFaint }}>{rate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {students.filter(s => s.status === "Active").length === 0 && (
                  <div style={{ padding: "40px 0", textAlign: "center", color: T.textFaint }}>
                    <Users size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                    <div style={{ fontSize: 12 }}>No active students</div>
                  </div>
                )}
              </div>

              <div style={{ padding: "10px 16px", background: T.surfaceAlt, borderTop: `1px solid ${T.borderLight}`, display: "flex", gap: 10 }}>
                <QuickChip label="Total Students" value={students.length} color={T.blue} />
                <QuickChip label="Active Rate" value={`${Math.round((students.filter(s => s.status === "Active").length / students.length) * 100) || 0}%`} color={T.violet} />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}