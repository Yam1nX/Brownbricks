import { useState, useEffect, useRef } from "react";
import {
  Users, TrendingUp, Clock, CreditCard,
  ArrowUpRight, BookOpen, CheckCircle2,
  AlertCircle, Bell, Settings, MoreHorizontal,
  Target, Activity, Calendar, DollarSign,
  Zap, Star, Award, BarChart3, Eye,
  ChevronRight, Sparkles, GraduationCap,
  TrendingDown, RefreshCw, Filter, Menu, X,
  Wallet, GraduationCapIcon, Trophy, LineChart
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
  @keyframes glowPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  @keyframes numberPop {
    0% { transform: scale(0.8); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .dash-card {
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
  }
  .dash-card:hover {
    transform: translateY(-6px);
  }
  .stat-card-new {
    transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  }
  .stat-card-new:hover {
    transform: translateY(-6px);
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
  .glow-animation {
    animation: glowPulse 3s ease-in-out infinite;
  }
  .number-animation {
    animation: numberPop 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
  }

  /* Responsive Styles */
  .dashboard-root {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
  }
  
  .dashboard-container {
    font-family: 'Bricolage Grotesque', sans-serif;
    padding: 12px;
  }
  
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
  }
  
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
  }
  
  @media (min-width: 1280px) {
    .dashboard-container {
      padding: 24px;
    }
  }
  
  .stats-grid-new {
    display: grid;
    gap: 20px;
    margin-bottom: 28px;
  }
  
  @media (min-width: 640px) {
    .stats-grid-new {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  
  @media (min-width: 1024px) {
    .stats-grid-new {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
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

// Modern Sparkline with gradient
function ModernSparkline({ data = [], color = "#6366f1", height = 44, width = 110 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 4;
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
        <linearGradient id={`spark-grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-grad-${color.replace("#","")})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="3.5" fill={color} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

// Advanced Stat Card Component
function AdvancedStatCard({ 
  label, 
  value, 
  subValue, 
  trend, 
  trendValue, 
  icon: Icon, 
  gradient, 
  iconGradient,
  sparkData, 
  progressValue,
  progressTarget,
  prefix = "",
  suffix = "",
  isPositive = true 
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="stat-card-new"
      style={{
        position: "relative",
        background: T.surface,
        borderRadius: 24,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        boxShadow: isHovered 
          ? `0 20px 35px -12px ${gradient.replace("linear-gradient(135deg, ", "").replace(")", "").split(",")[0]}40, 0 4px 12px rgba(0,0,0,0.05)` 
          : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: gradient,
        transition: "height 0.3s ease",
        ...(isHovered && { height: 6 }),
      }} />
      
      {/* Decorative circles */}
      <div style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: gradient,
        opacity: 0.06,
        pointerEvents: "none",
        transition: "transform 0.4s ease",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }} />
      <div style={{
        position: "absolute",
        bottom: -20,
        left: -20,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: gradient,
        opacity: 0.04,
        pointerEvents: "none",
      }} />

      <div style={{ padding: "20px 18px", position: "relative", zIndex: 2 }}>
        {/* Header with icon and trend */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: iconGradient || gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 20px ${gradient.replace("linear-gradient(135deg, ", "").replace(")", "").split(",")[0]}30`,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            transform: isHovered ? "scale(1.05) rotate(5deg)" : "scale(1) rotate(0deg)",
          }}>
            <Icon size={22} color="#fff" strokeWidth={1.7} />
          </div>
          
          {trend && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: isPositive ? "#ecfdf5" : "#fff1f2",
              padding: "5px 10px",
              borderRadius: 40,
              fontSize: 11,
              fontWeight: 700,
              color: isPositive ? T.emerald : T.rose,
            }}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Value with animation */}
        <div style={{
          fontSize: "clamp(28px, 6vw, 36px)",
          fontWeight: 800,
          color: T.text,
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
          marginBottom: 6,
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}>
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>

        {/* Label and sub info */}
        <div style={{ 
          fontSize: "clamp(13px, 3.5vw, 14px)", 
          fontWeight: 600, 
          color: T.textMid, 
          marginBottom: 4 
        }}>
          {label}
        </div>
        {subValue && (
          <div style={{ 
            fontSize: "clamp(10px, 2.5vw, 11px)", 
            color: T.textFaint, 
            marginBottom: 12 
          }}>
            {subValue}
          </div>
        )}

        {/* Sparkline or Progress Bar */}
        {sparkData && (
          <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
            <ModernSparkline 
              data={sparkData} 
              color={gradient.includes("10b981") ? T.emerald : gradient.includes("f59e0b") ? T.amber : gradient.includes("3b82f6") ? T.blue : T.indigo} 
              width={100} 
              height={38} 
            />
          </div>
        )}

        {progressValue !== undefined && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: T.textMuted }}>Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{progressValue}%</span>
            </div>
            <div style={{ 
              height: 6, 
              background: "#e2e8f0", 
              borderRadius: 10, 
              overflow: "hidden",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min(progressValue, 100)}%`,
                background: gradient,
                borderRadius: 10,
                transition: "width 1s cubic-bezier(0.34, 1.2, 0.64, 1)",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "shimmer 2s infinite",
                }} />
              </div>
            </div>
            {progressTarget && (
              <div style={{ fontSize: 9, color: T.textFaint, marginTop: 4 }}>
                Target: {progressTarget}
              </div>
            )}
          </div>
        )}
      </div>
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

function SectionCard({ children, style = {} }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="dash-card" 
      style={{
        background: T.surface,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        boxShadow: isHovered ? "0 8px 25px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          transition: "all 0.2s ease",
        }}>
          {actionLabel} <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
}

function ProgressBar({ value, color, height = 5 }) {
  const displayValue = Math.min(Math.max(value, 0), 100);
  return (
    <div style={{ height, background: "#e2e8f0", borderRadius: height, overflow: "hidden", flex: 1 }}>
      <div className="progress-track" style={{
        height: "100%",
        width: `${displayValue}%`,
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
  const listLimit = isMobile ? 3 : 5;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Helper function to calculate payment status for a student
  const getStudentPaymentStatus = (studentId, studentFee) => {
    const studentPayments = payments.filter(p => p.studentId === studentId && p.month === currentMonth);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const due = Math.max(0, studentFee - totalPaid);
    return { totalPaid, due, isFullyPaid: due === 0 && totalPaid > 0, hasPartialPayment: totalPaid > 0 && due > 0 };
  };

  const recentClasses = [...classes].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, listLimit);
  const recentPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, listLimit);
  const upcomingClasses = classes
    .filter(c => new Date(c.date) >= new Date() && c.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, listLimit);

  const avatarColors = [T.indigo, T.emerald, T.amber, "#ef4444", T.violet, T.cyan, "#ec4899", "#14b8a6"];

  // CORRECTED calculations for dashboard
  const totalClassesForAttendance = classes.filter(c => c.status === "Attended" || c.status === "Missed" || c.status === "Completed").length;
  const attendedClassesCount = classes.filter(c => c.status === "Attended" || c.status === "Completed").length;
  const attendanceRate = totalClassesForAttendance > 0 ? (attendedClassesCount / totalClassesForAttendance) * 100 : 0;
  
  // Total expected fees for current month
  const totalExpectedFees = students.reduce((sum, s) => sum + (s.fee || 0), 0);
  
  // Total collected for current month (sum of all payments with current month)
  const totalCollectedThisMonth = payments
    .filter(p => p.month === currentMonth)
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Collection rate for current month
  const collectionRate = totalExpectedFees > 0 ? Math.min(Math.round((totalCollectedThisMonth / totalExpectedFees) * 100), 100) : 0;
  
  // Total due for current month
  const totalDueThisMonth = totalExpectedFees - totalCollectedThisMonth;
  
  // Active rate
  const activeRate = students.length > 0 ? Math.round((stats.activeStudents / students.length) * 100) : 0;
  
  // Monthly revenue is the total collected this month
  const monthlyRevenue = totalCollectedThisMonth;
  
  // Safe sparkline data generation
  const baseVal = stats.totalStudents || 1;
  const sparkStudents = [Math.max(baseVal - 2, 0), Math.max(baseVal - 1, 0), baseVal, baseVal, baseVal + 1, baseVal + 2, baseVal + 1, baseVal + 3];
  const sparkEarnings = [0.6, 0.75, 0.55, 0.9, 0.8, 1.0, 0.85, 1.1].map(v => Math.max(Math.round((monthlyRevenue || 100) * v), 0));
  
  // Advanced stat cards configuration with BDT currency
  const advancedStatCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      subValue: `${stats.activeStudents} active · ${stats.totalStudents - stats.activeStudents} inactive`,
      trend: true,
      trendValue: `${activeRate}%`,
      icon: Users,
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      iconGradient: "linear-gradient(135deg, #6366f1, #a855f7)",
      sparkData: sparkStudents,
      isPositive: true,
      prefix: "",
      suffix: "",
    },
    {
      label: "Monthly Revenue",
      value: monthlyRevenue,
      subValue: `Collected in ${currentMonth}`,
      trend: true,
      trendValue: `${collectionRate}%`,
      icon: DollarSign,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      iconGradient: "linear-gradient(135deg, #10b981, #34d399)",
      sparkData: sparkEarnings,
      isPositive: true,
      prefix: "৳",
      suffix: "",
    },
    {
      label: "Collection Rate",
      value: collectionRate,
      subValue: `৳${totalCollectedThisMonth.toLocaleString()} of ৳${totalExpectedFees.toLocaleString()}`,
      trend: true,
      trendValue: `${collectionRate}%`,
      icon: Target,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      iconGradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      progressValue: collectionRate,
      progressTarget: "100% collected",
      prefix: "",
      suffix: "%",
      isPositive: true,
    },
    {
      label: "Total Due",
      value: totalDueThisMonth,
      subValue: `${students.filter(s => {
        const { due } = getStudentPaymentStatus(s.id, s.fee);
        return due > 0;
      }).length} students have pending fees`,
      trend: false,
      trendValue: `${totalDueThisMonth > 0 ? "Due" : "All Paid"}`,
      icon: AlertCircle,
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      iconGradient: "linear-gradient(135deg, #ef4444, #f87171)",
      progressValue: totalExpectedFees > 0 ? Math.round((totalDueThisMonth / totalExpectedFees) * 100) : 0,
      progressTarget: "Clear all dues",
      prefix: "৳",
      suffix: "",
      isPositive: false,
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
        {/* Hero Header - Modern Gradient */}
        <div className="hero-header" style={{
          borderRadius: 24,
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 65%, #6366f1 100%)",
          padding: "24px 28px",
          boxShadow: "0 25px 50px -12px rgba(99,102,241,0.4)",
        }}>
          {/* Animated background effects */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "rgba(139,92,246,0.3)", filter: "blur(60px)", pointerEvents: "none", animation: "glowPulse 4s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: -60, left: 100, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.25)", filter: "blur(50px)", pointerEvents: "none", animation: "glowPulse 5s ease-in-out infinite 1s" }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none",
            backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 30, padding: "4px 14px",
                  fontSize: 10, fontWeight: 700, color: "#e0e7ff", letterSpacing: "1px",
                }}>
                  BROWNBRICKS ACADEMY
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse2 2s infinite" }} />
                  Live Dashboard
                </span>
              </div>

              <h1 className="hero-title" style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 6, lineHeight: 1.2 }}>
                {greeting}, <span style={{ background: "linear-gradient(135deg, #c084fc, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Tutor!</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(11px, 3vw, 13px)" }}>{dateStr}</p>
            </div>

            <div className="hero-stats" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Active Students", value: stats.activeStudents, color: "#a5b4fc", icon: <Users size={12} /> },
                { label: "Monthly Revenue", value: `৳${monthlyRevenue.toLocaleString()}`, color: "#6ee7b7", icon: <Wallet size={12} /> },
                { label: "Attendance", value: `${attendanceRate.toFixed(0)}%`, color: "#fcd34d", icon: <Trophy size={12} /> },
              ].map(chip => (
                <div key={chip.label} className="hero-chip" style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  padding: "10px 16px",
                  minWidth: "100px",
                  transition: "all 0.2s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    {chip.icon}
                    <span style={{ fontSize: "clamp(8px, 2.5vw, 9px)", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{chip.label}</span>
                  </div>
                  <div style={{ fontSize: "clamp(18px, 4.5vw, 24px)", fontWeight: 800, color: chip.color, lineHeight: 1.2 }}>{chip.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div style={{ position: "relative", zIndex: 2, marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Monthly Collection Target</span>
              <span style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{collectionRate}% • ৳{totalCollectedThisMonth.toLocaleString()} / ৳{totalExpectedFees.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${collectionRate}%`,
                background: "linear-gradient(90deg, #34d399, #6ee7b7)",
                borderRadius: 10,
                transition: "width 1.2s cubic-bezier(0.34, 1.2, 0.64, 1)",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "shimmer 2s infinite",
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Stat Cards Grid */}
        <div className="stats-grid-new">
          {advancedStatCards.map((card, idx) => (
            <div key={card.label} style={{ animation: `fadeUp 0.5s ease ${0.05 + idx * 0.1}s both` }}>
              <AdvancedStatCard {...card} />
            </div>
          ))}
        </div>

        {/* Two Column Grid - Recent & Upcoming Classes */}
        <div className="two-col-grid">
          <div style={{ animation: "fadeUp 0.5s ease 0.45s both" }}>
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
                    padding: "12px 4px",
                    borderBottom: idx === recentClasses.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 14px)", flex: 1 }}>{c.topic}</div>
                      <Badge status={c.status} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 3vw, 12px)", color: T.textMuted, flexWrap: "wrap", gap: 6 }}>
                      <span>{c.studentName || `Student #${c.studentId}`} · <span style={{ color: T.indigo, fontWeight: 500 }}>{c.subject}</span></span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{new Date(c.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {recentClasses.length === 0 && (
                  <div style={{ padding: "50px 0", textAlign: "center", color: T.textFaint }}>
                    <BookOpen size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
                    <div style={{ fontSize: 13 }}>No classes yet</div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <div style={{ animation: "fadeUp 0.5s ease 0.55s both" }}>
            <SectionCard>
              <SectionHeader
                title="Upcoming Classes"
                subtitle="Scheduled sessions"
                icon={<Calendar size={14} color="#fff" />}
                gradient="linear-gradient(135deg,#f59e0b,#d97706)"
              />
              <div style={{ padding: "2px 16px 4px" }}>
                {upcomingClasses.map((c, idx) => {
                  const daysLeft = Math.max(0, Math.ceil((new Date(c.date) - new Date()) / (1000 * 60 * 60 * 24)));
                  return (
                    <div key={c.id} className="row-hover" style={{
                      padding: "12px 4px",
                      borderBottom: idx === upcomingClasses.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                      cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                        <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 14px)", flex: 1 }}>{c.topic}</div>
                        <span style={{
                          fontSize: "clamp(10px, 2.5vw, 11px)", fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                          background: daysLeft <= 1 ? "#fff1f2" : daysLeft <= 3 ? "#fffbeb" : "#f0fdf4",
                          color: daysLeft <= 1 ? T.rose : daysLeft <= 3 ? T.amber : T.emerald,
                        }}>
                          {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft}d`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(10px, 3vw, 12px)", color: T.textMuted, flexWrap: "wrap", gap: 6 }}>
                        <span>{c.studentName || `Student #${c.studentId}`} · <span style={{ color: T.amber, fontWeight: 500 }}>{c.subject}</span></span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
                {upcomingClasses.length === 0 && (
                  <div style={{ padding: "50px 0", textAlign: "center", color: T.textFaint }}>
                    <Calendar size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
                    <div style={{ fontSize: 13 }}>No upcoming classes</div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Bottom Two Column Grid - Payments & Students */}
        <div className="two-col-grid">
          <div style={{ animation: "fadeUp 0.5s ease 0.65s both" }}>
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
                    padding: "12px 4px",
                    borderBottom: idx === recentPayments.length - 1 ? "none" : `1px solid ${T.borderLight}`,
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar
                          initials={p.studentName ? p.studentName.split(" ").map(n => n[0]).join("") : "S"}
                          color={avatarColors[(p.studentId || idx) % avatarColors.length]}
                          size={isMobile ? 36 : 40}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 14px)" }}>{p.studentName || "Student"}</div>
                          <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: T.textMuted }}>{p.subject || "—"} · {p.method || "Payment"}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: isMobile ? "left" : "right" }}>
                        <div style={{ fontWeight: 800, color: T.emerald, fontSize: "clamp(14px, 4vw, 18px)", fontFamily: "'JetBrains Mono', monospace" }}>৳{p.amount.toLocaleString()}</div>
                        <div style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: T.textFaint }}>{new Date(p.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {recentPayments.length === 0 && (
                  <div style={{ padding: "50px 0", textAlign: "center", color: T.textFaint }}>
                    <CreditCard size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
                    <div style={{ fontSize: 13 }}>No payments recorded</div>
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 16px", background: T.surfaceAlt, borderTop: `1px solid ${T.borderLight}`, display: "flex", gap: 12 }}>
                <QuickChip label="Total Collected" value={`৳${stats.totalCollected.toLocaleString()}`} color={T.emerald} />
                <QuickChip label="Collection Rate" value={`${collectionRate}%`} color={T.indigo} />
              </div>
            </SectionCard>
          </div>

          <div style={{ animation: "fadeUp 0.5s ease 0.75s both" }}>
            <SectionCard>
              <SectionHeader
                title="Active Students"
                subtitle="Your current roster"
                icon={<Users size={14} color="#fff" />}
                gradient="linear-gradient(135deg,#3b82f6,#2563eb)"
              />
              <div style={{ padding: "2px 16px 0" }}>
                {students.filter(s => s.status === "Active").slice(0, listLimit).map((s, idx) => {
                  const { totalPaid, due, isFullyPaid, hasPartialPayment } = getStudentPaymentStatus(s.id, s.fee);
                  const attendedCount = classes.filter(c => c.studentId === s.id && (c.status === "Attended" || c.status === "Completed")).length;
                  const totalCount = classes.filter(c => c.studentId === s.id && (c.status === "Attended" || c.status === "Missed" || c.status === "Completed" || c.status === "Scheduled")).length;
                  const rate = totalCount > 0 ? Math.min(Math.round((attendedCount / totalCount) * 100), 100) : 0;

                  let paymentStatusText = "";
                  let paymentStatusColor = "";
                  let paymentStatusBg = "";
                  
                  if (isFullyPaid) {
                    paymentStatusText = "Paid";
                    paymentStatusColor = T.emerald;
                    paymentStatusBg = "#ecfdf5";
                  } else if (hasPartialPayment) {
                    paymentStatusText = `Partial (৳${due.toLocaleString()} due)`;
                    paymentStatusColor = T.amber;
                    paymentStatusBg = "#fffbeb";
                  } else {
                    paymentStatusText = `Due ৳${due.toLocaleString()}`;
                    paymentStatusColor = T.rose;
                    paymentStatusBg = "#fef2f2";
                  }

                  return (
                    <div key={s.id} className="row-hover" style={{
                      padding: "12px 4px",
                      borderBottom: idx === listLimit - 1 ? "none" : `1px solid ${T.borderLight}`,
                      cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar
                          initials={s.name.split(" ").map(n => n[0]).join("")}
                          color={avatarColors[s.id % avatarColors.length]}
                          size={isMobile ? 36 : 40}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 6 }}>
                            <div style={{ fontWeight: 600, color: T.text, fontSize: "clamp(12px, 3.5vw, 14px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                            <span style={{
                              fontSize: "clamp(9px, 2.5vw, 11px)", fontWeight: 700,
                              color: paymentStatusColor,
                              background: paymentStatusBg,
                              padding: "2px 10px", borderRadius: 20, flexShrink: 0,
                            }}>
                              {paymentStatusText}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <div style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: T.textMuted }}>{s.subject} · ৳{s.fee.toLocaleString()}/mo</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                              <div style={{ width: 50 }}>
                                <ProgressBar value={rate} color={rate > 75 ? T.emerald : rate > 50 ? T.amber : T.rose} height={4} />
                              </div>
                              <span style={{ fontSize: "clamp(9px, 2.5vw, 10px)", color: T.textFaint, fontWeight: 500 }}>{rate}%</span>
                            </div>
                          </div>
                          {hasPartialPayment && (
                            <div style={{ marginTop: 4 }}>
                              <div style={{ height: 3, background: "#e2e8f0", borderRadius: 3, overflow: "hidden", maxWidth: 120 }}>
                                <div style={{
                                  height: "100%",
                                  width: `${(totalPaid / s.fee) * 100}%`,
                                  background: T.amber,
                                  borderRadius: 3,
                                }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {students.filter(s => s.status === "Active").length === 0 && (
                  <div style={{ padding: "50px 0", textAlign: "center", color: T.textFaint }}>
                    <Users size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
                    <div style={{ fontSize: 13 }}>No active students</div>
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 16px", background: T.surfaceAlt, borderTop: `1px solid ${T.borderLight}`, display: "flex", gap: 12 }}>
                <QuickChip label="Total Students" value={students.length} color={T.blue} />
                <QuickChip label="Active Rate" value={`${activeRate}%`} color={T.violet} />
                <QuickChip label="Total Due" value={`৳${totalDueThisMonth.toLocaleString()}`} color={T.rose} />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
