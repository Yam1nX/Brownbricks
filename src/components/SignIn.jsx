import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignIn({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (!email.trim()) {
      setLocalError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setLocalError("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Login successful - App will redirect automatically
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setEmail("tutor@brownbrick.com");
    setPassword("password123");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>

      {/* Animated background circles */}
      <div style={{
        position: "absolute",
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        animation: "float 20s infinite ease-in-out",
      }} />
      <div style={{
        position: "absolute",
        bottom: -80,
        left: -80,
        width: 250,
        height: 250,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        animation: "float 15s infinite ease-in-out reverse",
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
      }} />

      <div style={{
        background: "#fff",
        borderRadius: 32,
        padding: "48px 40px",
        width: 460,
        maxWidth: "90%",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        animation: "fadeInUp 0.6s ease-out",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 10px 25px -5px rgba(99,102,241,0.4)",
          }}>
            <BookOpen size={32} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>
            BROWNBRICKS
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Welcome back! Please sign in to continue</p>
        </div>

        {/* Error Message */}
        {(localError || error) && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "shake 0.3s ease-out",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ color: "#dc2626", fontSize: 13, fontWeight: 500 }}>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              marginBottom: 8,
            }}>
              Email Address
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              transition: "all 0.2s",
              background: "#fff",
            }}>
              <div style={{
                padding: "0 12px",
                color: "#94a3b8",
              }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tutor@brownbrick.com"
                required
                style={{
                  flex: 1,
                  padding: "12px 12px 12px 0",
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  background: "transparent",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              marginBottom: 8,
            }}>
              Password
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              transition: "all 0.2s",
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8" }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  flex: 1,
                  padding: "12px 12px 12px 0",
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  background: "transparent",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: "0 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Demo Credentials Hint */}
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #dcfce7",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 20,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={fillDemoCredentials}
          onMouseEnter={(e) => e.currentTarget.style.background = "#dcfce7"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#f0fdf4"}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#059669", marginBottom: 4 }}>
              🔑 Demo Credentials (Click to auto-fill)
            </div>
            <div style={{ fontSize: 11, color: "#047857" }}>
              Email: tutor@brownbrick.com | Password: password123
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "transform 0.2s, box-shadow 0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(99,102,241,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {isLoading ? (
              <div style={{
                width: 18,
                height: 18,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
            ) : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ color: "#64748b", fontSize: 13 }}>Don't have an account? </span>
          <button
            onClick={onSwitchToRegister}
            style={{
              background: "none",
              border: "none",
              color: "#6366f1",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
