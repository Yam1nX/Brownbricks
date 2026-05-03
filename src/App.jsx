// App.jsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Classes from "./components/Classes";
import Payments from "./components/Payments";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function MainApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <Students />;
      case "classes":
        return <Classes />;
      case "payments":
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: "#f5f6fa",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR - DESKTOP */}
      <div
        style={{
          display: window.innerWidth < 768 ? "none" : "block",
        }}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={logout}
        />
      </div>

      {/* SIDEBAR - MOBILE OVERLAY */}
      {sidebarOpen && window.innerWidth < 768 && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 40,
            }}
          />

          {/* drawer */}
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 50,
              background: "#fff",
            }}
          >
            <Sidebar
              activePage={activePage}
              setActivePage={(id) => {
                setActivePage(id);
                setSidebarOpen(false);
              }}
              onLogout={logout}
            />
          </div>
        </>
      )}

      {/* MAIN AREA */}
      <main
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* TOP BAR (MOBILE ONLY) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {/* hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: window.innerWidth < 768 ? "block" : "none",
              fontSize: 22,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ☰
          </button>

          <div style={{ fontWeight: 700, color: "#0f172a" }}>
            Learn. Teach. Grow.
          </div>

          <div />
        </div>

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            padding:
              window.innerWidth < 768
                ? "16px"
                : window.innerWidth < 1024
                ? "24px"
                : "32px",
            width: "100%",
            maxWidth: 1400,
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
          }}
        >
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function AuthRouter() {
  const [authMode, setAuthMode] = useState("signin");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (user) return <MainApp />;

  return authMode === "signin" ? (
    <SignIn onSwitchToRegister={() => setAuthMode("signup")} />
  ) : (
    <SignUp onSwitchToSignIn={() => setAuthMode("signin")} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AuthRouter />
      </AppProvider>
    </AuthProvider>
  );
}