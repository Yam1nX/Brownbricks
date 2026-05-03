// components/Classes.jsx
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Classes() {
  const { classes, students, addClass, updateClass, deleteClass } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ topic: "", studentId: "", subject: "", date: "", duration: 60, status: "Scheduled", notes: "" });
  const [editId, setEditId] = useState(null);

  const studentOptions = students.filter(s => s.status === "Active");

  const openAdd = () => {
    setForm({ topic: "", studentId: "", subject: "", date: new Date().toISOString().split("T")[0], duration: 60, status: "Scheduled", notes: "" });
    setEditId(null);
    setModal(true);
  };

  const openEdit = (c) => {
    setForm({ topic: c.topic, studentId: c.studentId, subject: c.subject, date: c.date, duration: c.duration, status: c.status, notes: c.notes || "" });
    setEditId(c.id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm({ topic: "", studentId: "", subject: "", date: "", duration: 60, status: "Scheduled", notes: "" });
    setEditId(null);
  };

  const handleSubmit = () => {
    if (!form.topic.trim() || !form.studentId) return;
    const selectedStudent = students.find(s => s.id === parseInt(form.studentId));
    const data = {
      ...form,
      studentId: parseInt(form.studentId),
      subject: selectedStudent?.subject || form.subject,
    };
    if (editId) {
      updateClass(editId, data);
    } else {
      addClass(data);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm("Delete this class?")) deleteClass(id);
  };

  const statusColor = (s) => {
    const colors = {
      Attended: { bg: "#ecfdf5", text: "#059669" },
      Missed: { bg: "#fee2e2", text: "#dc2626" },
      Cancelled: { bg: "#fef3c7", text: "#d97706" },
      Scheduled: { bg: "#e0e7ff", text: "#4f46e5" },
    };
    return colors[s] || colors.Scheduled;
  };

  const input = {
    width: "100%", padding: "8px 12px", borderRadius: 8,
    border: "1px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff",
  };

  const sortedClasses = [...classes].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Classes</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Schedule and track tutoring sessions.</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          <Plus size={15} /> Schedule Class
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{classes.length}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>Total Classes</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{classes.filter(c => c.status === "Attended").length}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>Attended</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{classes.filter(c => c.status === "Scheduled").length}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>Upcoming</div>
        </div>
      </div>

      {/* Classes Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
              {["TOPIC", "STUDENT", "SUBJECT", "DATE", "DURATION", "STATUS", "ACTIONS"].map(h => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedClasses.map((c) => {
              const col = statusColor(c.status);
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px", fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{c.topic}</td>
                  <td style={{ padding: "16px", color: "#475569", fontSize: 13 }}>{c.studentName}</td>
                  <td style={{ padding: "16px", color: "#64748b", fontSize: 13 }}>{c.subject}</td>
                  <td style={{ padding: "16px", color: "#64748b", fontSize: 13 }}>{new Date(c.date).toLocaleDateString()}</td>
                  <td style={{ padding: "16px", color: "#64748b", fontSize: 13 }}>{c.duration} min</td>
                  <td style={{ padding: "16px" }}>
                    <select value={c.status} onChange={e => updateClass(c.id, { ...c, status: e.target.value })} style={{ background: col.bg, color: col.text, border: "none", fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20, cursor: "pointer" }}>
                      <option>Scheduled</option><option>Attended</option><option>Missed</option><option>Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => openEdit(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1" }}>Edit</button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
         </table>
        {sortedClasses.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>No classes scheduled yet.</div>}
      </div>

      {/* Schedule Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 460 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18 }}>{editId ? "Edit Class" : "Schedule Class"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Topic *</label>
            <input value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} style={{ ...input, marginBottom: 14 }} />

            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Student *</label>
            <select value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value, subject: students.find(s => s.id === parseInt(e.target.value))?.subject || "" }))} style={{ ...input, marginBottom: 14 }}>
              <option value="">Select a student</option>
              {studentOptions.map(s => (<option key={s.id} value={s.id}>{s.name} - {s.subject}</option>))}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={input} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Duration (min)</label><input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={input} /></div>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={input} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button onClick={closeModal} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSubmit} style={{ padding: "9px 18px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>{editId ? "Save Changes" : "Schedule Class"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}