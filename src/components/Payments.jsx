// components/Payments.jsx
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Payments() {
  const { payments, students, addPayment, deletePayment } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    method: "UPI",
    note: ""
  });

  const studentOptions = students.filter(s => s.status === "Active");

  const openAdd = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
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
    addPayment({
      studentId: parseInt(form.studentId),
      amount: Number(form.amount),
      date: form.date,
      month: form.month,
      method: form.method,
      note: form.note,
    });
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Delete this payment record?")) deletePayment(id);
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthlyTotal = payments.filter(p => p.month === currentMonth).reduce((sum, p) => sum + p.amount, 0);

  // Responsive styles
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    background: "#fff",
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: window.innerWidth < 640 ? "column" : "row",
        justifyContent: "space-between",
        alignItems: window.innerWidth < 640 ? "flex-start" : "center",
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
            Payments
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Track and record student payments.
          </p>
        </div>

        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          <Plus size={18} /> Record Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
        marginBottom: 28
      }}>
        {/* Total Collected */}
        <div style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 16,
          padding: 24,
          color: "#fff"
        }}>
          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8 }}>Total Collected</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>₹{totalCollected.toLocaleString()}</div>
        </div>

        {/* This Month */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>This Month</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
            ₹{monthlyTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{currentMonth}</div>
        </div>

        {/* Transactions */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Transactions</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{payments.length}</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>Total records</div>
        </div>
      </div>

      {/* Payments Table */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                {["STUDENT", "SUBJECT", "AMOUNT", "MONTH", "DATE", "METHOD", "ACTIONS"].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px", fontWeight: 600, color: "#0f172a" }}>{p.studentName}</td>
                  <td style={{ padding: "16px", color: "#64748b" }}>{p.subject}</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#059669", fontSize: 15 }}>
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: "16px", color: "#475569" }}>{p.month}</td>
                  <td style={{ padding: "16px", color: "#64748b" }}>
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px", color: "#64748b" }}>{p.method}</td>
                  <td style={{ padding: "16px" }}>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                        fontWeight: 500
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 15
          }}>
            No payments recorded yet.
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {modal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "16px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 28,
            width: "100%",
            maxWidth: 440,
            maxHeight: "95vh",
            overflowY: "auto"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24
            }}>
              <h2 style={{ fontWeight: 700, fontSize: 20 }}>Record Payment</h2>
              <button
                onClick={closeModal}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                  Student *
                </label>
                <select
                  value={form.studentId}
                  onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="">Select a student</option>
                  {studentOptions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                    Month
                  </label>
                  <input
                    type="text"
                    value={form.month}
                    onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                    placeholder="e.g., May 2026"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                    Payment Method
                  </label>
                  <select
                    value={form.method}
                    onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                    style={inputStyle}
                  >
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                  Note (optional)
                </label>
                <input
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 32 }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "11px 20px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "11px 24px",
                  borderRadius: 8,
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600
                }}
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