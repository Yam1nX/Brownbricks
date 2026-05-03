import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  IndianRupee,
  Users,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Students() {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentStats,
    classes,
    payments,
  } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    fee: "",
    status: "Active",
    joinedDate: "",
  });
  const [editId, setEditId] = useState(null);

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Function to calculate current month's due amount for a student
  const getCurrentMonthDue = (studentId, studentFee) => {
    // Get all payments for this student in the current month
    const studentPaymentsThisMonth = payments.filter(
      (p) => p.studentId === studentId && p.month === currentMonth
    );
    
    // Calculate total paid amount for this month
    const totalPaidThisMonth = studentPaymentsThisMonth.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    
    // Calculate due amount (monthly fee minus total paid)
    const dueAmount = studentFee - totalPaidThisMonth;
    
    // Return max(0, dueAmount) - can't be negative
    return Math.max(0, dueAmount);
  };

  // Function to check if student has paid fully for current month
  const hasPaidCurrentMonth = (studentId, studentFee) => {
    return getCurrentMonthDue(studentId, studentFee) === 0;
  };

  // Memoized filtered students based on search and status filter
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.subject.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search);
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Active").length;
    const totalMonthlyFee = students.reduce((sum, s) => sum + (s.fee || 0), 0);
    const totalPaidThisMonth = students.reduce((sum, s) => {
      const studentPayments = payments.filter(
        (p) => p.studentId === s.id && p.month === currentMonth
      );
      return sum + studentPayments.reduce((pSum, p) => pSum + p.amount, 0);
    }, 0);
    const totalDue = totalMonthlyFee - totalPaidThisMonth;
    return { total, active, totalMonthlyFee, totalPaidThisMonth, totalDue };
  }, [students, payments, currentMonth]);

  const openAdd = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      subject: "",
      fee: "",
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
    });
    setEditId(null);
    setModal(true);
  };
  const openEdit = (s) => {
    setForm({ ...s });
    setEditId(s.id);
    setModal(true);
  };
  const openView = (s) => {
    setViewModal(s);
  };
  const closeModal = () => {
    setModal(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      subject: "",
      fee: "",
      status: "Active",
      joinedDate: "",
    });
    setEditId(null);
  };
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
    if (
      confirm(
        "Delete this student? All associated classes and payments will also be deleted."
      )
    ) {
      deleteStudent(id);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Phone", "Email", "Subject", "Monthly Fee", "Status", "Joined Date"];
    const rows = filtered.map((s) => [
      s.name,
      s.phone,
      s.email,
      s.subject,
      s.fee,
      s.status,
      s.joinedDate,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="students-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage your roster of learners.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eef2ff", color: "#4f46e5" }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">৳{stats.totalMonthlyFee.toLocaleString()}</div>
            <div className="stat-label">Total Monthly Revenue</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="stat-value">৳{stats.totalDue.toLocaleString()}</div>
            <div className="stat-label">Total Due ({currentMonth})</div>
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
            placeholder="Search by name, subject, or phone..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button onClick={exportToCSV} className="btn-outline">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Students Table - Responsive Design */}
      <div className="students-table-container">
        {/* Desktop Table */}
        <div className="desktop-table">
          <table className="students-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>CONTACT</th>
                <th>SUBJECT</th>
                <th>FEE/MONTH</th>
                <th>STATUS</th>
                <th>CLASSES</th>
                <th>PAYMENT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const stats = getStudentStats(s.id);
                const dueAmount = getCurrentMonthDue(s.id, s.fee);
                const isPaid = dueAmount === 0;
                const paidAmount = s.fee - dueAmount;
                
                return (
                  <tr key={s.id}>
                    <td className="student-name">{s.name}</td>
                    <td className="contact-info">
                      <div className="phone">{s.phone || "—"}</div>
                      <div className="email">{s.email || "—"}</div>
                    </td>
                    <td>{s.subject}</td>
                    <td className="fee-amount">৳{s.fee.toLocaleString()}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          s.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="classes-stats">
                      {stats.totalClasses} ({stats.attendedClasses} attended)
                    </td>
                    <td>
                      {isPaid ? (
                        <span className="payment-status paid">
                          <CheckCircle size={12} /> Paid (৳{paidAmount})
                        </span>
                      ) : (
                        <span className="payment-status pending">
                          <AlertCircle size={12} /> ৳{dueAmount} due / ৳{paidAmount} paid
                        </span>
                      )}
                    </td>
                    <td className="action-buttons">
                      <button
                        onClick={() => openView(s)}
                        className="action-btn view"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => openEdit(s)}
                        className="action-btn edit"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <BookOpen size={48} strokeWidth={1} />
              <p>No students found.</p>
            </div>
          )}
        </div>

        {/* Mobile Cards View */}
        <div className="mobile-cards">
          {filtered.map((s) => {
            const stats = getStudentStats(s.id);
            const dueAmount = getCurrentMonthDue(s.id, s.fee);
            const isPaid = dueAmount === 0;
            const paidAmount = s.fee - dueAmount;
            
            return (
              <div key={s.id} className="student-card">
                <div className="card-header">
                  <div>
                    <h3 className="card-name">{s.name}</h3>
                    <span
                      className={`status-badge ${
                        s.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => openView(s)}> <Eye size={16} /></button>
                    <button onClick={() => openEdit(s)}> <Pencil size={16} /></button>
                    <button onClick={() => handleDelete(s.id)}> <Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="card-details">
                  <div className="detail-row">
                    <Phone size={14} /> <span>{s.phone || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <Mail size={14} /> <span>{s.email || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <BookOpen size={14} /> <span>{s.subject}</span>
                  </div>
                  <div className="detail-row">
                    <IndianRupee size={14} /> <span className="fee">৳{s.fee.toLocaleString()}/month</span>
                  </div>
                  <div className="detail-row">
                    <Calendar size={14} /> <span>{stats.totalClasses} classes ({stats.attendedClasses} attended)</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className={`payment-status ${isPaid ? "paid" : "pending"}`}>
                    {isPaid ? (
                      `✓ Paid ৳${paidAmount}`
                    ) : (
                      `৳${dueAmount} due (৳${paidAmount} paid)`
                    )}
                  </span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="empty-state">
              <BookOpen size={48} strokeWidth={1} />
              <p>No students found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "Edit Student" : "Add Student"}</h2>
              <button onClick={closeModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Subject"
                  />
                </div>
                <div className="form-group">
                  <label>Monthly Fee (৳)</label>
                  <input
                    type="number"
                    value={form.fee}
                    onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
                    placeholder="Fee amount"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Joined Date</label>
                  <input
                    type="date"
                    value={form.joinedDate}
                    onChange={(e) => setForm((f) => ({ ...f, joinedDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                {editId ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewModal && (
        <div className="modal-overlay" onClick={closeView}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button onClick={closeView} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="student-profile">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {viewModal.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{viewModal.name}</h3>
                    <span className={`status-badge ${viewModal.status === "Active" ? "active" : "inactive"}`}>
                      {viewModal.status}
                    </span>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{viewModal.phone || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <Mail size={16} />
                    <span>{viewModal.email || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <BookOpen size={16} />
                    <span>{viewModal.subject}</span>
                  </div>
                  <div className="detail-item">
                    <IndianRupee size={16} />
                    <span>৳{viewModal.fee.toLocaleString()}/month</span>
                  </div>
                </div>
              </div>

              <div className="history-section">
                <h4>Class History</h4>
                {classes.filter((c) => c.studentId === viewModal.id).length === 0 ? (
                  <p className="empty-history">No classes recorded.</p>
                ) : (
                  classes
                    .filter((c) => c.studentId === viewModal.id)
                    .map((c) => (
                      <div key={c.id} className="history-item">
                        <div className="history-title">{c.topic}</div>
                        <div className="history-meta">
                          {new Date(c.date).toLocaleDateString()} • {c.status}
                        </div>
                      </div>
                    ))
                )}
              </div>

              <div className="history-section">
                <h4>Payment History</h4>
                {payments.filter((p) => p.studentId === viewModal.id).length === 0 ? (
                  <p className="empty-history">No payments recorded.</p>
                ) : (
                  payments
                    .filter((p) => p.studentId === viewModal.id)
                    .map((p) => (
                      <div key={p.id} className="history-item">
                        <div className="history-title">৳{p.amount.toLocaleString()}</div>
                        <div className="history-meta">
                          {p.month} • {new Date(p.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeView} className="btn-primary full-width">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .students-container {
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
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
          max-width: 320px;
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
        .btn-outline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .btn-outline:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Table Styles */
        .students-table-container {
          background: white;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .students-table {
          width: 100%;
          border-collapse: collapse;
        }
        .students-table th {
          text-align: left;
          padding: 1rem 1.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.06em;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .students-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          color: #475569;
        }
        .student-name {
          font-weight: 600;
          color: #0f172a;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        .phone {
          font-size: 0.875rem;
        }
        .email {
          font-size: 0.7rem;
          color: #94a3b8;
        }
        .fee-amount {
          font-weight: 600;
          color: #0f172a;
        }
        .classes-stats {
          font-size: 0.813rem;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.688rem;
          font-weight: 600;
        }
        .status-badge.active {
          background: #ecfdf5;
          color: #059669;
        }
        .status-badge.inactive {
          background: #f1f5f9;
          color: #64748b;
        }
        .payment-status {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
        }
        .payment-status.paid {
          background: #ecfdf5;
          color: #059669;
        }
        .payment-status.pending {
          background: #fffbeb;
          color: #d97706;
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
        .action-btn.view {
          color: #6366f1;
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
        .student-card {
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
        .card-name {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
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
        .card-details {
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
        .detail-row .fee {
          font-weight: 600;
          color: #0f172a;
        }
        .card-footer {
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
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
        .view-modal {
          max-width: 560px;
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
          transition: color 0.2s;
        }
        .modal-close:hover {
          color: #475569;
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
        .form-group select {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus {
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
        .full-width {
          width: 100%;
          justify-content: center;
        }
        .empty-state {
          padding: 3rem;
          text-align: center;
          color: #94a3b8;
        }
        .student-profile {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .profile-avatar {
          width: 48px;
          height: 48px;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #475569;
        }
        .history-section {
          margin-bottom: 1.5rem;
        }
        .history-section h4 {
          font-weight: 600;
          font-size: 0.875rem;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .history-item {
          padding: 0.625rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .history-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }
        .history-meta {
          font-size: 0.688rem;
          color: #94a3b8;
          margin-top: 0.125rem;
        }
        .empty-history {
          font-size: 0.813rem;
          color: #94a3b8;
          text-align: center;
          padding: 1rem;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .students-container {
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
            grid-template-columns: 1fr;
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

        @media (min-width: 769px) and (max-width: 1024px) {
          .students-table th,
          .students-table td {
            padding: 0.875rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
