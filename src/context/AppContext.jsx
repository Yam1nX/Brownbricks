// context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

// Load from localStorage
const loadData = (key, defaults) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaults;
};

export function AppProvider({ children }) {
  const [students, setStudents] = useState(() => 
    loadData("students", [
      { id: 1, name: "Aarav Sharma", phone: "+91 98765 43210", email: "aarav@example.com", subject: "Mathematics", fee: 3500, status: "Active", joinedDate: "2026-01-15" },
      { id: 2, name: "Diya Patel", phone: "+91 91234 56789", email: "diya@example.com", subject: "Physics", fee: 4000, status: "Active", joinedDate: "2026-02-10" },
      { id: 3, name: "Rohan Mehta", phone: "+91 99887 76655", email: "rohan@example.com", subject: "Chemistry", fee: 3000, status: "Inactive", joinedDate: "2026-01-20" },
    ])
  );

  const [classes, setClasses] = useState(() =>
    loadData("classes", [
      { id: 1, topic: "Quadratic Equations", studentId: 1, studentName: "Aarav Sharma", subject: "Mathematics", date: "2026-05-03", status: "Attended", duration: 60, notes: "Covered quadratic formula" },
      { id: 2, topic: "Newton's Laws", studentId: 2, studentName: "Diya Patel", subject: "Physics", date: "2026-05-03", status: "Attended", duration: 90, notes: "Discussed Newton's three laws" },
    ])
  );

  const [payments, setPayments] = useState(() =>
    loadData("payments", [
      { id: 1, studentId: 1, studentName: "Aarav Sharma", subject: "Mathematics", amount: 3500, date: "2026-05-03", month: "May 2026", status: "Completed", method: "UPI" },
    ])
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("payments", JSON.stringify(payments));
  }, [payments]);

  // Helper functions
  const addStudent = (student) => {
    const newStudent = { ...student, id: Date.now() };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
    // Update references in classes and payments
    const student = students.find(s => s.id === id);
    if (student) {
      setClasses(prev => prev.map(c => 
        c.studentId === id ? { ...c, studentName: updatedData.name || student.name, subject: updatedData.subject || student.subject } : c
      ));
      setPayments(prev => prev.map(p => 
        p.studentId === id ? { ...p, studentName: updatedData.name || student.name, subject: updatedData.subject || student.subject } : p
      ));
    }
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setClasses(prev => prev.filter(c => c.studentId !== id));
    setPayments(prev => prev.filter(p => p.studentId !== id));
  };

  const addClass = (classData) => {
    const student = students.find(s => s.id === classData.studentId);
    const newClass = {
      ...classData,
      id: Date.now(),
      studentName: student?.name || "",
      subject: student?.subject || classData.subject,
    };
    setClasses(prev => [...prev, newClass]);
    return newClass;
  };

  const updateClass = (id, updatedData) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const addPayment = (paymentData) => {
    const student = students.find(s => s.id === paymentData.studentId);
    const newPayment = {
      ...paymentData,
      id: Date.now(),
      studentName: student?.name || "",
      subject: student?.subject || paymentData.subject,
      status: "Completed",
    };
    setPayments(prev => [...prev, newPayment]);
    return newPayment;
  };

  const deletePayment = (id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // Calculated data for dashboard
  const getStats = () => {
    const activeStudents = students.filter(s => s.status === "Active").length;
    const totalStudents = students.length;
    const totalClasses = classes.length;
    const attendedClasses = classes.filter(c => c.status === "Attended").length;
    const attendanceRate = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    
    const totalFee = students.reduce((sum, s) => sum + s.fee, 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingDues = totalFee - totalCollected;
    const collectionRate = totalFee > 0 ? (totalCollected / totalFee) * 100 : 0;
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const monthlyEarnings = payments
      .filter(p => p.month === currentMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalStudents,
      activeStudents,
      totalClasses,
      attendanceRate,
      totalFee,
      totalCollected,
      pendingDues,
      collectionRate,
      monthlyEarnings,
    };
  };

  const getStudentStats = (studentId) => {
    const studentClasses = classes.filter(c => c.studentId === studentId);
    const studentPayments = payments.filter(p => p.studentId === studentId);
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const student = students.find(s => s.id === studentId);
    
    return {
      totalClasses: studentClasses.length,
      attendedClasses: studentClasses.filter(c => c.status === "Attended").length,
      totalPaid,
      pendingFee: (student?.fee || 0) - totalPaid,
    };
  };

  const getStudentOptions = () => {
    return students.map(s => ({ id: s.id, name: s.name, subject: s.subject }));
  };

  return (
    <AppContext.Provider value={{
      students,
      classes,
      payments,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      updateClass,
      deleteClass,
      addPayment,
      deletePayment,
      getStats,
      getStudentStats,
      getStudentOptions,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);