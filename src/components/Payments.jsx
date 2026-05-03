import { useState, useMemo } from "react";
import { 
  Plus, X, Search, Filter, Download, 
  CreditCard, TrendingUp, Calendar, Wallet,
  CheckCircle, Clock, Banknote, Trash2,
  Eye, ChevronRight, Receipt, DollarSign,
  ArrowUpRight, ArrowDownRight, Printer, AlertCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Payments() {
  const { payments, students, addPayment, deletePayment } = useApp();
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    method: "UPI",
    note: ""
  });

  const studentOptions = students.filter(s => s.status === "Active");
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const getStudentDueAmount = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;
    
    const studentPaymentsThisMonth = payments.filter(p => 
      p.studentId === studentId && p.month === currentMonth
    );
    const totalPaidThisMonth = studentPaymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
    const dueAmount = student.fee - totalPaidThisMonth;
    return Math.max(0, dueAmount);
  };

  const getTotalPaidThisMonth = (studentId) => {
    const studentPaymentsThisMonth = payments.filter(p => 
      p.studentId === studentId && p.month === currentMonth
    );
    return studentPaymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
  };

  const getPaymentStatus = (studentId) => {
    const due = getStudentDueAmount(studentId);
    if (due === 0) return { text: "Fully Paid", color: "#059669", bg: "#ecfdf5", icon: <CheckCircle size={12} /> };
    const student = students.find(s => s.id === studentId);
    const paid = student ? student.fee - due : 0;
    if (paid > 0) return { text: `Partially Paid`, color: "#d97706", bg: "#fffbeb", icon: <AlertCircle size={12} /> };
    return { text: "Not Paid", color: "#dc2626", bg: "#fef2f2", icon: <AlertCircle size={12} /> };
  };

  const totalDueAmount = students.reduce((total, student) => {
    return total + getStudentDueAmount(student.id);
  }, 0);

  const totalPaidThisMonth = students.reduce((total, student) => {
    return total + getTotalPaidThisMonth(student.id);
  }, 0);

  const totalExpectedFees = students.reduce((sum, s) => sum + s.fee, 0);
  const pendingStudentsCount = students.filter(s => getStudentDueAmount(s.id) > 0).length;
  const fullyPaidStudentsCount = students.filter(s => getStudentDueAmount(s.id) === 0 && getTotalPaidThisMonth(s.id) > 0).length;
  const noPaymentStudentsCount = students.filter(s => getTotalPaidThisMonth(s.id) === 0).length;
  const partialPaymentCount = students.filter(s => getStudentDueAmount(s.id) > 0 && getTotalPaidThisMonth(s.id) > 0).length;

  const filteredPayments = useMemo(() => {
    let filtered = [...payments];
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        p => p.studentName?.toLowerCase().includes(searchLower) ||
             p.subject?.toLowerCase().includes(searchLower) ||
             p.method?.toLowerCase().includes(searchLower)
      );
    }
    if (methodFilter !== "all") {
      filtered = filtered.filter(p => p.method === methodFilter);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payments, search, methodFilter]);

  const totalLifetimeCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const monthlyTotal = payments.filter(p => p.month === currentMonth).reduce((sum, p) => sum + p.amount, 0);
  
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthName = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const lastMonthTotal = payments.filter(p => p.month === lastMonthName).reduce((sum, p) => sum + p.amount, 0);
  const growth = lastMonthTotal > 0 ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(0) : 0;
  const collectionRate = totalExpectedFees > 0 ? Math.min(Math.round((totalPaidThisMonth / totalExpectedFees) * 100), 100) : 0;

  const openAdd = () => {
    setForm({
      studentId: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      month: currentMonth,
      method: "UPI",
      note: ""
    });
    setModal(true);
  };

  const closeModal = () => setModal(false);

  const handleSubmit = () => {
    if (!form.studentId || !form.amount) return;
    const selectedStudent = students.find(s => s.id === parseInt(form.studentId));
    addPayment({
      studentId: parseInt(form.studentId),
      studentName: selectedStudent?.name || "",
      subject: selectedStudent?.subject || "",
      amount: Number(form.amount),
      date: form.date,
      month: form.month,
      method: form.method,
      note: form.note,
    });
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Delete this payment record? This action cannot be undone.")) deletePayment(id);
  };

  const exportToCSV = () => {
    const headers = ["Student Name", "Subject", "Amount (BDT)", "Month", "Date", "Method", "Note"];
    const rows = filteredPayments.map(p => [
      p.studentName,
      p.subject,
      p.amount,
      p.month,
      new Date(p.date).toLocaleDateString(),
      p.method,
      p.note || ""
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMethodColor = (method) => {
    const colors = {
      UPI: { bg: "#eef2ff", color: "#4f46e5", icon: <CreditCard size={12} /> },
      Cash: { bg: "#ecfdf5", color: "#059669", icon: <Banknote size={12} /> },
      "Bank Transfer": { bg: "#fef3c7", color: "#d97706", icon: <Wallet size={12} /> },
      Card: { bg: "#f3e8ff", color: "#9333ea", icon: <CreditCard size={12} /> }
    };
    return colors[method] || colors.UPI;
  };

  return (
    <div className="payments-container">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes numberPop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .payments-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8fafc;
          min-height: 100vh;
        }
        .stat-card {
          transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
        .row-hover {
          transition: all 0.2s ease;
        }
        .row-hover:hover {
          background: #f8f9ff !important;
        }
        .payment-row {
          animation: slideIn 0.3s ease forwards;
        }
        .value-animate {
          animation: numberPop 0.5s ease forwards;
        }
        @media (max-width: 768px) {
          .payments-container {
            padding: 12px;
          }
          .stat-card {
            padding: 16px !important;
          }
          .stat-value {
            font-size: 24px !important;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="header-section" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 28
      }}>
        <div>
          <h1 style={{ 
            fontSize: "clamp(24px, 5vw, 28px)", 
            fontWeight: 800, 
            color: "#0f172a", 
            marginBottom: 6,
            letterSpacing: "-0.5px"
          }}>
            Payments
          </h1>
          <p style={{ color: "#64748b", fontSize: "clamp(13px, 3vw, 14px)" }}>
            Track and manage all student fee transactions in BDT
          </p>
        </div>

        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Plus size={18} /> Record Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
        marginBottom: 28
      }}>
        {/* Total Collected Lifetime */}
        <div className="stat-card" style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 20,
          padding: "22px 24px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600
            }}>
              Lifetime Revenue
            </div>
            <DollarSign size={24} style={{ opacity: 0.6 }} />
          </div>
          
          <div className="stat-value" style={{ fontSize: "clamp(32px, 6vw, 42px)", fontWeight: 800, marginBottom: 6 }}>
            ৳{totalLifetimeCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Total collected from all students</div>
        </div>

        {/* This Month Collection */}
        <div className="stat-card" style={{
          background: "#fff",
          borderRadius: 20,
          padding: "22px 24px",
          border: "1px solid #e2e8f0",
          position: "relative",
          cursor: "pointer"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{
              background: "#eef2ff",
              borderRadius: 12,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: "#6366f1"
            }}>
              {currentMonth} Collection
            </div>
            <Calendar size={22} style={{ color: "#94a3b8" }} />
          </div>
          
          <div className="stat-value" style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            ৳{monthlyTotal.toLocaleString()}
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ 
              fontSize: 13, 
              color: growth >= 0 ? "#059669" : "#dc2626",
              background: growth >= 0 ? "#ecfdf5" : "#fef2f2",
              padding: "2px 10px",
              borderRadius: 20,
              fontWeight: 600
            }}>
              {growth >= 0 ? <ArrowUpRight size={12} style={{ display: "inline", marginRight: 2 }} /> : <ArrowDownRight size={12} style={{ display: "inline", marginRight: 2 }} />}
              {Math.abs(growth)}%
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>vs last month</span>
          </div>
        </div>

        {/* Total Due Amount */}
        <div className="stat-card" style={{
          background: "linear-gradient(135deg, #ef4444, #f97316)",
          borderRadius: 20,
          padding: "22px 24px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600
            }}>
              Outstanding Due
            </div>
            <AlertCircle size={24} style={{ opacity: 0.6 }} />
          </div>
          
          <div className="stat-value" style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, marginBottom: 6 }}>
            ৳{totalDueAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{pendingStudentsCount} student(s) have pending fees</div>
        </div>

        {/* Collection Rate */}
        <div className="stat-card" style={{
          background: "#fff",
          borderRadius: 20,
          padding: "22px 24px",
          border: "1px solid #e2e8f0",
          cursor: "pointer"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{
              background: "#ecfdf5",
              borderRadius: 12,
              padding: "8px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: "#059669"
            }}>
              Collection Rate
            </div>
            <TrendingUp size={22} style={{ color: "#94a3b8" }} />
          </div>
          
          <div className="stat-value" style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            {collectionRate}%
          </div>
          
          <div style={{ height: 6, background: "#e2e8f0", borderRadius: 10, overflow: "hidden", marginTop: 8 }}>
            <div style={{
              height: "100%",
              width: `${collectionRate}%`,
              background: "linear-gradient(90deg, #10b981, #059669)",
              borderRadius: 10,
              transition: "width 1s ease"
            }} />
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
            ৳{totalPaidThisMonth.toLocaleString()} / ৳{totalExpectedFees.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Payment Summary Chips */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
        flexWrap: "wrap"
      }}>
        <div style={{
          background: "#ecfdf5",
          padding: "8px 16px",
          borderRadius: 40,
          fontSize: 13,
          fontWeight: 600,
          color: "#059669"
        }}>
          ✅ Fully Paid: {fullyPaidStudentsCount} students
        </div>
        <div style={{
          background: "#fffbeb",
          padding: "8px 16px",
          borderRadius: 40,
          fontSize: 13,
          fontWeight: 600,
          color: "#d97706"
        }}>
          ⚠️ Partial Payment: {partialPaymentCount} students
        </div>
        <div style={{
          background: "#fef2f2",
          padding: "8px 16px",
          borderRadius: 40,
          fontSize: 13,
          fontWeight: 600,
          color: "#dc2626"
        }}>
          ❌ No Payment: {noPaymentStudentsCount} students
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 24,
        background: "#fff",
        padding: "12px 20px",
        borderRadius: 16,
        border: "1px solid #e2e8f0"
      }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, subject, or method..."
            style={{
              width: "100%",
              padding: "10px 16px 10px 38px",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              fontSize: 14,
              outline: "none",
              transition: "all 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#6366f1"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Filter size={16} style={{ color: "#94a3b8" }} />
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            style={{
              padding: "8px 32px 8px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              fontSize: 13,
              background: "#fff",
              cursor: "pointer"
            }}
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
          </select>
          
          <button
            onClick={exportToCSV}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Student Payment Status Table */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        marginBottom: 24
      }}>
        <div style={{
          padding: "16px 20px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <div style={{ fontWeight: 700, color: "#0f172a" }}>Student Payment Status - {currentMonth}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Monthly fee vs collected amount (BDT)</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "700px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b" }}>STUDENT</th>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b" }}>SUBJECT</th>
                <th style={{ padding: "14px 20px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#64748b" }}>MONTHLY FEE</th>
                <th style={{ padding: "14px 20px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#64748b" }}>PAID</th>
                <th style={{ padding: "14px 20px", textAlign: "right", fontSize: 11, fontWeight: 700, color: "#64748b" }}>DUE</th>
                <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const dueAmount = getStudentDueAmount(student.id);
                const paidAmount = getTotalPaidThisMonth(student.id);
                const status = getPaymentStatus(student.id);
                
                return (
                  <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "#0f172a" }}>{student.name}</td>
                    <td style={{ padding: "14px 20px", color: "#64748b" }}>{student.subject}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: "#0f172a" }}>৳{student.fee.toLocaleString()}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: "#059669" }}>৳{paidAmount.toLocaleString()}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: dueAmount > 0 ? "#dc2626" : "#059669" }}>
                      ৳{dueAmount.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: status.bg,
                        color: status.color,
                        padding: "4px 12px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600
                      }}>
                        {status.icon}
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments History Table */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 20px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <div style={{ fontWeight: 700, color: "#0f172a" }}>Payment History</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>All transaction records in BDT</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
                {["STUDENT", "SUBJECT", "AMOUNT (BDT)", "DATE", "MONTH", "METHOD", "ACTIONS"].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 20px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      letterSpacing: "0.06em"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p, idx) => {
                const methodColor = getMethodColor(p.method);
                return (
                  <tr 
                    key={p.id} 
                    className="payment-row row-hover"
                    style={{ 
                      borderBottom: "1px solid #f1f5f9",
                      animationDelay: `${idx * 0.03}s`
                    }}
                  >
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "#0f172a" }}>
                      {p.studentName || `Student #${p.studentId}`}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#64748b" }}>
                      <span style={{
                        background: "#f1f5f9",
                        padding: "2px 10px",
                        borderRadius: 20,
                        fontSize: 11
                      }}>
                        {p.subject || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "#059669", fontSize: 15 }}>
                      ৳{p.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 13 }}>
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "14px 20px", color: "#475569", fontSize: 13 }}>
                      {p.month}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: methodColor.bg,
                        color: methodColor.color,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600
                      }}>
                        {methodColor.icon}
                        {p.method}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 500,
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#94a3b8"
          }}>
            <CreditCard size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
            <div style={{ fontSize: 15, marginBottom: 4 }}>No payments recorded</div>
            <div style={{ fontSize: 13 }}>Click "Record Payment" to add your first transaction</div>
          </div>
        )}
      </div>

      {/* Due Students Detailed Section */}
      {pendingStudentsCount > 0 && (
        <div style={{
          marginTop: 24,
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #fee2e2",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "16px 20px",
            background: "#fef2f2",
            borderBottom: "1px solid #fee2e2",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <AlertCircle size={20} color="#dc2626" />
            <div>
              <div style={{ fontWeight: 700, color: "#991b1b" }}>Pending Fee Details - {currentMonth}</div>
              <div style={{ fontSize: 12, color: "#b91c1c" }}>
                {pendingStudentsCount} student(s) have pending payments
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "grid", gap: 12 }}>
              {students
                .filter(s => getStudentDueAmount(s.id) > 0)
                .map(s => {
                  const dueAmount = getStudentDueAmount(s.id);
                  const paidAmount = getTotalPaidThisMonth(s.id);
                  const percentage = ((paidAmount / s.fee) * 100).toFixed(0);
                  return (
                    <div key={s.id} style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 8
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, color: "#0f172a" }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>{s.subject}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, color: "#dc2626", fontSize: 18 }}>৳{dueAmount.toLocaleString()}</div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Due amount</div>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 12,
                        marginBottom: 6
                      }}>
                        <span style={{ color: "#059669" }}>Paid: ৳{paidAmount.toLocaleString()}</span>
                        <span style={{ color: "#0f172a" }}>Total: ৳{s.fee.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${percentage}%`,
                          background: "linear-gradient(90deg, #f59e0b, #f97316)",
                          borderRadius: 10
                        }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {modal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            width: "100%",
            maxWidth: 480,
            maxHeight: "90vh",
            overflowY: "auto",
            animation: "fadeUp 0.3s ease"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 28px",
              borderBottom: "1px solid #e2e8f0",
              background: "linear-gradient(135deg, #f8fafc, #fff)"
            }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 20, color: "#0f172a" }}>Record Payment</h2>
                <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Enter transaction details below (BDT)</p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  borderRadius: 12,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Student Selection */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "#334155" }}>
                    Select Student *
                  </label>
                  <select
                    value={form.studentId}
                    onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 14,
                      outline: "none",
                      background: "#fff",
                      transition: "all 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  >
                    <option value="">Choose a student</option>
                    {studentOptions.map(s => {
                      const due = getStudentDueAmount(s.id);
                      const paid = getTotalPaidThisMonth(s.id);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name} - {s.subject} (Fee: ৳{s.fee} | Paid: ৳{paid} | Due: ৳{due})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Amount and Month Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "#334155" }}>
                      Amount (BDT) *
                    </label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      placeholder="Enter amount in BDT"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                        outline: "none"
                      }}
                      onFocus={e => e.target.style.borderColor = "#6366f1"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "#334155" }}>
                      Payment Month
                    </label>
                    <input
                      type="text"
                      value={form.month}
                      onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                      placeholder="e.g., May 2026"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                {/* Date and Method Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "#334155" }}>
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                        outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "#334155" }}>
                      Payment Method
                    </label>
                    <select
                      value={form.method}
                      onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 14,
                        outline: "none",
                        background: "#fff"
                      }}
                    >
                      <option>UPI</option>
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Card</option>
                    </select>
                  </div>
                </div>

                {/* Note Field */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block", color: "#334155" }}>
                    Note (optional)
                  </label>
                  <input
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="Add a reference or note..."
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 14,
                      outline: "none"
                    }}
                  />
                </div>

                {/* Show due info for selected student */}
                {form.studentId && (() => {
                  const studentId = parseInt(form.studentId);
                  const due = getStudentDueAmount(studentId);
                  const paid = getTotalPaidThisMonth(studentId);
                  const student = students.find(s => s.id === studentId);
                  return due > 0 ? (
                    <div style={{
                      background: "#fef2f2",
                      padding: "12px",
                      borderRadius: 12,
                      border: "1px solid #fee2e2"
                    }}>
                      <div style={{ fontSize: 12, color: "#991b1b" }}>
                        ⚠️ This student has a pending due of <strong>৳{due.toLocaleString()}</strong> for {currentMonth}
                      </div>
                      <div style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>
                        Monthly fee: ৳{student?.fee.toLocaleString()} | Already paid: ৳{paid.toLocaleString()}
                      </div>
                    </div>
                  ) : paid > 0 ? (
                    <div style={{
                      background: "#ecfdf5",
                      padding: "12px",
                      borderRadius: 12,
                      border: "1px solid #d1fae5"
                    }}>
                      <div style={{ fontSize: 12, color: "#065f46" }}>
                        ✅ This student has fully paid ৳{paid.toLocaleString()} for {currentMonth}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              padding: "20px 28px",
              borderTop: "1px solid #e2e8f0",
              background: "#f8fafc"
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "all 0.2s"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 28px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
