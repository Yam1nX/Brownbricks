import { useState, useMemo } from "react";
import {
  Plus,
  X,
  Calendar,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Classes() {
  const { classes, students, addClass, updateClass, deleteClass } = useApp();
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    topic: "",
    studentId: "",
    subject: "",
    date: "",
    duration: 60,
    status: "Scheduled",
    notes: "",
  });
  const [editId, setEditId] = useState(null);

  const studentOptions = students.filter((s) => s.status === "Active");

  // Filtered classes based on search and status
  const filteredClasses = useMemo(() => {
    let filtered = [...classes];
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.topic.toLowerCase().includes(searchLower) ||
          c.studentName?.toLowerCase().includes(searchLower) ||
          c.subject?.toLowerCase().includes(searchLower)
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [classes, search, statusFilter]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = classes.length;
    const attended = classes.filter((c) => c.status === "Attended").length;
    const scheduled = classes.filter((c) => c.status === "Scheduled").length;
    const missed = classes.filter((c) => c.status === "Missed").length;
    const attendanceRate = total > 0 ? ((attended / total) * 100).toFixed(0) : 0;
    return { total, attended, scheduled, missed, attendanceRate };
  }, [classes]);

  const openAdd = () => {
    setForm({
      topic: "",
      studentId: "",
      subject: "",
      date: new Date().toISOString().split("T")[0],
      duration: 60,
      status: "Scheduled",
      notes: "",
    });
    setEditId(null);
    setModal(true);
  };

  const openEdit = (c) => {
    setForm({
      topic: c.topic,
      studentId: c.studentId,
      subject: c.subject,
      date: c.date,
      duration: c.duration,
      status: c.status,
      notes: c.notes || "",
    });
    setEditId(c.id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm({
      topic: "",
      studentId: "",
      subject: "",
      date: "",
      duration: 60,
      status: "Scheduled",
      notes: "",
    });
    setEditId(null);
  };

  const handleSubmit = () => {
    if (!form.topic.trim() || !form.studentId) return;
    const selectedStudent = students.find((s) => s.id === parseInt(form.studentId));
    const data = {
      ...form,
      studentId: parseInt(form.studentId),
      studentName: selectedStudent?.name || "",
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

  const getStatusConfig = (status) => {
    const configs = {
      Attended: { bg: "#ecfdf5", text: "#059669", icon: CheckCircle, label: "Attended" },
      Missed: { bg: "#fef2f2", text: "#dc2626", icon: XCircle, label: "Missed" },
      Cancelled: { bg: "#fffbeb", text: "#d97706", icon: AlertCircle, label: "Cancelled" },
      Scheduled: { bg: "#eef2ff", text: "#4f46e5", icon: Calendar, label: "Scheduled" },
    };
    return configs[status] || configs.Scheduled;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="classes-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes</h1>
          <p className="page-subtitle">Schedule and track tutoring sessions.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Schedule Class
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.attended}</div>
            <div className="stat-label">Attended</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.scheduled}</div>
            <div className="stat-label">Upcoming</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.attendanceRate}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, student, or subject..."
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Attended">Attended</option>
            <option value="Missed">Missed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Classes List - Desktop Table */}
      <div className="classes-table-container">
        <div className="desktop-table">
          <table className="classes-table">
            <thead>
              <tr>
                <th>TOPIC</th>
                <th>STUDENT</th>
                <th>SUBJECT</th>
                <th>DATE & TIME</th>
                <th>DURATION</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((c) => {
                const statusConfig = getStatusConfig(c.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={c.id}>
                    <td className="topic-cell">
                      <div className="topic-info">
                        <span className="topic-name">{c.topic}</span>
                        {c.notes && <span className="topic-notes">📝 {c.notes.substring(0, 50)}</span>}
                      </div>
                    </td>
                    <td className="student-name">{c.studentName || `Student #${c.studentId}`}</td>
                    <td className="subject">{c.subject}</td>
                    <td>
                      <div className="date-info">
                        <span className="date">{formatDate(c.date)}</span>
                        <span className="time">
                          {new Date(c.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="duration-badge">
                        <Clock size={12} />
                        <span>{c.duration} min</span>
                      </div>
                    </td>
                    <td>
                      <select
                        value={c.status}
                        onChange={(e) => updateClass(c.id, { ...c, status: e.target.value })}
                        className="status-select"
                        style={{ background: statusConfig.bg, color: statusConfig.text }}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Attended">Attended</option>
                        <option value="Missed">Missed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => openEdit(c)} className="action-btn edit" title="Edit">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="action-btn delete" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredClasses.length === 0 && (
            <div className="empty-state">
              <Calendar size={48} strokeWidth={1} />
              <p>No classes found.</p>
            </div>
          )}
        </div>

        {/* Mobile Cards View */}
        <div className="mobile-cards">
          {filteredClasses.map((c) => {
            const statusConfig = getStatusConfig(c.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={c.id} className="class-card">
                <div className="card-header">
                  <div className="class-topic">
                    <h3>{c.topic}</h3>
                    {c.notes && <p className="notes-preview">{c.notes.substring(0, 60)}</p>}
                  </div>
                  <div className="card-actions">
                    <button onClick={() => openEdit(c)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="class-details">
                  <div className="detail-row">
                    <Users size={14} />
                    <span>{c.studentName || `Student #${c.studentId}`}</span>
                  </div>
                  <div className="detail-row">
                    <BookOpen size={14} />
                    <span>{c.subject}</span>
                  </div>
                  <div className="detail-row">
                    <Calendar size={14} />
                    <span>{formatDate(c.date)}</span>
                  </div>
                  <div className="detail-row">
                    <Clock size={14} />
                    <span>{c.duration} minutes</span>
                  </div>
                </div>
                <div className="card-footer">
                  <select
                    value={c.status}
                    onChange={(e) => updateClass(c.id, { ...c, status: e.target.value })}
                    className="status-select-mobile"
                    style={{ background: statusConfig.bg, color: statusConfig.text }}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Attended">Attended</option>
                    <option value="Missed">Missed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
          {filteredClasses.length === 0 && (
            <div className="empty-state">
              <Calendar size={48} strokeWidth={1} />
              <p>No classes found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Edit Class" : "Schedule Class"}</h2>
              <button onClick={closeModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Topic *</label>
                <input
                  value={form.topic}
                  onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  placeholder="e.g., Algebra Basics, Essay Writing, etc."
                />
              </div>

              <div className="form-group">
                <label>Student *</label>
                <select
                  value={form.studentId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      studentId: e.target.value,
                      subject: students.find((s) => s.id === parseInt(e.target.value))?.subject || "",
                    }))
                  }
                >
                  <option value="">Select a student</option>
                  {studentOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Attended">Attended</option>
                  <option value="Missed">Missed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  placeholder="Add any additional notes about the class..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editId ? "Save Changes" : "Schedule Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .classes-container {
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }
        .page-subtitle {
          color: #64748b;
          font-size: 0.875rem;
        }

        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        /* Search Bar */
        .search-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 360px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-input {
          width: 100%;
          padding: 0.625rem 0.875rem 0.625rem 2.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          transition: all 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .filter-icon {
          color: #94a3b8;
        }
        .filter-select {
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        /* Desktop Table */
        .classes-table-container {
          background: white;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .classes-table {
          width: 100%;
          border-collapse: collapse;
        }
        .classes-table th {
          text-align: left;
          padding: 1rem 1.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.06em;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .classes-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          vertical-align: middle;
        }
        .topic-cell {
          min-width: 180px;
        }
        .topic-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .topic-name {
          font-weight: 600;
          color: #0f172a;
        }
        .topic-notes {
          font-size: 0.688rem;
          color: #94a3b8;
        }
        .student-name {
          font-weight: 500;
          color: #1e293b;
        }
        .subject {
          color: #64748b;
        }
        .date-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        .date {
          font-weight: 500;
          color: #0f172a;
        }
        .time {
          font-size: 0.688rem;
          color: #94a3b8;
        }
        .duration-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: #f1f5f9;
          padding: 0.25rem 0.625rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          color: #475569;
        }
        .status-select {
          padding: 0.375rem 0.75rem;
          border: none;
          border-radius: 2rem;
          font-size: 0.688rem;
          font-weight: 600;
          cursor: pointer;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.375rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        .action-btn.edit {
          color: #f59e0b;
        }
        .action-btn.delete {
          color: #ef4444;
        }
        .action-btn:hover {
          background: #f1f5f9;
        }

        /* Mobile Cards */
        .mobile-cards {
          display: none;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }
        .class-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1rem;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .class-topic h3 {
          font-weight: 600;
          color: #0f172a;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        .notes-preview {
          font-size: 0.688rem;
          color: #94a3b8;
        }
        .card-actions {
          display: flex;
          gap: 0.5rem;
        }
        .card-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          color: #94a3b8;
        }
        .class-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.813rem;
          color: #475569;
        }
        .card-footer {
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
        }
        .status-select-mobile {
          width: 100%;
          padding: 0.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }
        .modal-content {
          background: white;
          border-radius: 1.25rem;
          width: 90%;
          max-width: 520px;
          max-height: 90vh;
          overflow: auto;
          animation: modalFadeIn 0.2s ease;
        }
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .modal-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.375rem;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: #4f46e5;
          transform: translateY(-1px);
        }
        .btn-secondary {
          padding: 0.625rem 1.25rem;
          background: white;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
        }
        .empty-state {
          padding: 3rem;
          text-align: center;
          color: #94a3b8;
        }
        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .classes-container {
            padding: 1rem;
          }
          .desktop-table {
            display: none;
          }
          .mobile-cards {
            display: flex;
          }
          .search-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-wrapper {
            max-width: none;
          }
          .filter-group {
            justify-content: space-between;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .page-header {
            flex-direction: column;
            align-items: stretch;
          }
          .page-header .btn-primary {
            justify-content: center;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .modal-content {
            width: 95%;
            margin: 1rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .stat-card {
            padding: 0.875rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
