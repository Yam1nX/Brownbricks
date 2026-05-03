// components/Sidebar.jsx
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  LogOut,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: Users },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "payments", label: "Payments", icon: CreditCard },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        height: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
      }}
    >
      {/* BRAND */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* LOGO ICON */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 14,
              boxShadow: "0 10px 25px rgba(79,70,229,0.25)",
              flexShrink: 0,
            }}
          >
            BB
          </div>

          {/* BRAND TEXT */}
          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: "0.8px",
                color: "#0f172a",
              }}
            >
              BrownBricks
            </div>

            <div
              style={{
                fontSize: 11,
                letterSpacing: "1.5px",
                color: "#6366f1",
                marginTop: 3,
                textTransform: "uppercase",
              }}
            >
              Management System
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={{ flex: 1, padding: "18px 10px" }}>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;

          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "11px 14px",
                marginBottom: 6,
                background: isActive ? "#eef2ff" : "transparent",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                color: isActive ? "#4f46e5" : "#475569",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                position: "relative",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#f1f5f9";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {/* ACTIVE BAR */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 4,
                    borderRadius: 4,
                    background: "#4f46e5",
                  }}
                />
              )}

              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div
        style={{
          padding: "18px 20px",
          borderTop: "1px solid #e2e8f0",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#475569",
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          tutor@example.com
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            fontSize: 13,
            padding: "6px 8px",
            borderRadius: 8,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.color = "#0f172a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}