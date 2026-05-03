// components/Students.jsx
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Eye } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent, getStudentStats, classes, payments } = useApp();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", fee: "", status: "Active", joinedDate: "" });
  const [editId, setEditId] = useState(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const openAdd = () => { setForm({ name: "", phone: "", email: "", subject: "", fee: "", status: "Active", joinedDate: new Date().toISOString().split("T")[0] }); setEditId(null); setModal(true); };
  const openEdit = (s) => { setForm({ ...s }); setEditId(s.id); setModal(true); };
  const openView = (s) => { setViewModal(s); };
  const closeModal = () => { setModal(false); setForm({ name: "", phone: "", email: "", subject: "", fee: "", status: "Active", joinedDate: "" }); setEditId(null); };
  const closeView = () => setViewModal(null);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const data = { ...form, fee: Number(form.fee) };
    if (editId) {
      updateStudent(editId, data);
    } else {
      addStudent(data);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Delete this student? All associated classes and payments will also be deleted.")) {
      deleteStudent(id);
    }
  };

  const input = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: "1px solid #e2e8f0", fontSize: 14, color: "#1e293b",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Students</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Manage your roster of learners.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." style={{ ...input, paddingLeft: 32, width: 240 }} />
          </div>
          <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={15} /> Add student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
              {["NAME", "CONTACT", "SUBJECT", "FEE/MONTH", "STATUS", "CLASSES", "PAYMENT", "ACTIONS"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const stats = getStudentStats(s.id);
              const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
              const hasPaidThisMonth = payments.some(p => p.studentId === s.id && p.month === currentMonth);
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px", fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{s.name}</td>
                  <td style={{ padding: "16px", color: "#64748b", fontSize: 13 }}>{s.phone}<br /><span style={{ fontSize: 11 }}>{s.email}</span></td>
                  <td style={{ padding: "16px", color: "#475569", fontSize: 13 }}>{s.subject}</td>
                  <td style={{ padding: "16px", fontWeight: 600, color: "#0f172a", fontSize: 14 }}>₹{s.fee.toLocaleString()}</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ background: s.status === "Active" ? "#ecfdf5" : "#f1f5f9", color: s.status === "Active" ? "#059669" : "#64748b", fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20 }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px", fontSize: 13, color: "#475569" }}>{stats.totalClasses} ({stats.attendedClasses} attended)</td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ color: hasPaidThisMonth ? "#059669" : "#d97706", fontWeight: 600, fontSize: 13 }}>
                      {hasPaidThisMonth ? "Paid" : `₹${stats.pendingFee} due`}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openView(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1" }}><Eye size={15} /></button>
                      <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1" }}><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>No students found.</div>}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 480, maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18 }}>{editId ? "Edit Student" : "Add Student"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ ...input, marginBottom: 14 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={input} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={input} /></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Subject</label><input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} style={input} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Monthly Fee (₹)</label><input type="number" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: e.target.value }))} style={input} /></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={input}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Joined Date</label>
                <input type="date" value={form.joinedDate} onChange={e => setForm(f => ({ ...f, joinedDate: e.target.value }))} style={input} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={closeModal} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSubmit} style={{ padding: "9px 18px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>{editId ? "Save Changes" : "Add Student"}</button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 500, maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18 }}>Student Details</h2>
              <button onClick={closeView} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom: 20, padding: 16, background: "#f8fafc", borderRadius: 12 }}>
              <h3 style={{ fontWeight: 600, marginBottom: 12 }}>{viewModal.name}</h3>
              <p style={{ fontSize: 13, marginBottom: 4 }}>📞 {viewModal.phone}</p>
              <p style={{ fontSize: 13, marginBottom: 4 }}>✉️ {viewModal.email}</p>
              <p style={{ fontSize: 13 }}>📚 {viewModal.subject} · ₹{viewModal.fee}/month</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Class History</h4>
              {classes.filter(c => c.studentId === viewModal.id).map(c => (
                <div key={c.id} style={{ padding: 8, borderBottom: "1px solid #e2e8f0", fontSize: 13 }}>{c.topic} - {new Date(c.date).toLocaleDateString()} ({c.status})</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Payment History</h4>
              {payments.filter(p => p.studentId === viewModal.id).map(p => (
                <div key={p.id} style={{ padding: 8, borderBottom: "1px solid #e2e8f0", fontSize: 13 }}>₹{p.amount} - {p.month} ({new Date(p.date).toLocaleDateString()})</div>
              ))}
            </div>
            <button onClick={closeView} style={{ marginTop: 20, width: "100%", padding: 10, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}