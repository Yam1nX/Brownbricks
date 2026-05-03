import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, UserPlus, User, BookOpen, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignUp({ onSwitchToSignIn }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register, error } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
      {/* Animated background */}
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

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
        {/* Back Button */}
        <button
          onClick={onSwitchToSignIn}
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

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
            <UserPlus size={32} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
          }}>
            Create Account
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Join TutorHub to manage your students</p>
        </div>

        {/* Error Message */}
        {(error || passwordError) && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ color: "#dc2626", fontSize: 13, fontWeight: 500 }}>{error || passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              marginBottom: 8,
            }}>
              Full Name
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              transition: "all 0.2s",
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8" }}>
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8" }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tutor@example.com"
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
          <div style={{ marginBottom: 20 }}>
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
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8" }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password Field */}
          <div style={{ marginBottom: 28 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              marginBottom: 8,
            }}>
              Confirm Password
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}>
              <div style={{ padding: "0 12px", color: "#94a3b8" }}>
                <Lock size={18} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  padding: "0 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
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
                <UserPlus size={16} /> Create Account
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <span style={{ color: "#64748b", fontSize: 13 }}>Already have an account? </span>
          <button
            onClick={onSwitchToSignIn}
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
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
