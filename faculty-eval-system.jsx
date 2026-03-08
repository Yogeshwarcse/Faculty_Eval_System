import { useState, useContext, createContext, useEffect } from "react";

// ─── CONTEXT ────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const INITIAL_FACULTY = [
  { id: "f1", name: "Dr. Anitha Rajan", department: "CSE", subjects: ["Data Structures", "Algorithms"], avatar: "AR" },
  { id: "f2", name: "Prof. Karthik Selvam", department: "CSE", subjects: ["DBMS", "Cloud Computing"], avatar: "KS" },
  { id: "f3", name: "Dr. Priya Mohan", department: "ECE", subjects: ["Digital Circuits", "VLSI Design"], avatar: "PM" },
  { id: "f4", name: "Prof. Suresh Kumar", department: "MECH", subjects: ["Thermodynamics", "Fluid Mechanics"], avatar: "SK" },
  { id: "f5", name: "Dr. Lakshmi Devi", department: "IT", subjects: ["Web Technology", "Machine Learning"], avatar: "LD" },
];

const INITIAL_STUDENTS = [
  { id: "s1", name: "Arjun Krishnan", email: "arjun@college.edu", regNo: "21CSE001", department: "CSE", year: 3, blocked: false },
  { id: "s2", name: "Divya Sharma", email: "divya@college.edu", regNo: "21CSE002", department: "CSE", year: 3, blocked: false },
  { id: "s3", name: "Ravi Shankar", email: "ravi@college.edu", regNo: "21ECE001", department: "ECE", year: 2, blocked: false },
];

const INITIAL_FEEDBACK = [
  { id: "fb1", studentId: "s1", facultyId: "f1", ratings: { teaching: 4, knowledge: 5, communication: 4, punctuality: 3 }, comment: "Very clear explanations!", submittedAt: "2024-11-15T10:00:00Z" },
  { id: "fb2", studentId: "s2", facultyId: "f1", ratings: { teaching: 5, knowledge: 5, communication: 5, punctuality: 4 }, comment: "Best professor!", submittedAt: "2024-11-15T11:00:00Z" },
  { id: "fb3", studentId: "s1", facultyId: "f2", ratings: { teaching: 3, knowledge: 4, communication: 3, punctuality: 5 }, comment: "Good but pace is fast", submittedAt: "2024-11-16T09:00:00Z" },
  { id: "fb4", studentId: "s3", facultyId: "f3", ratings: { teaching: 4, knowledge: 4, communication: 5, punctuality: 4 }, comment: "", submittedAt: "2024-11-17T08:00:00Z" },
  { id: "fb5", studentId: "s2", facultyId: "f5", ratings: { teaching: 5, knowledge: 5, communication: 4, punctuality: 5 }, comment: "Absolutely outstanding!", submittedAt: "2024-11-18T14:00:00Z" },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const avg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
const ratingAvg = (feedbacks, key) => avg(feedbacks.map(f => f.ratings[key]));
const overallAvg = (feedbacks) => {
  if (!feedbacks.length) return 0;
  const totals = feedbacks.map(f => (f.ratings.teaching + f.ratings.knowledge + f.ratings.communication + f.ratings.punctuality) / 4);
  return avg(totals);
};

// ─── MINI CHART COMPONENTS ────────────────────────────────────────────────────
const BarChart = ({ data, colors }) => {
  const max = Math.max(...data.map(d => d.value), 5);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px", padding: "0 8px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: colors[i % colors.length] }}>{d.value}</span>
          <div style={{
            width: "100%", background: colors[i % colors.length] + "22",
            borderRadius: "6px 6px 0 0", height: "90px", display: "flex", alignItems: "flex-end",
            overflow: "hidden", position: "relative"
          }}>
            <div style={{
              width: "100%", height: `${(d.value / max) * 90}px`,
              background: `linear-gradient(180deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}99)`,
              borderRadius: "6px 6px 0 0", transition: "height 0.8s cubic-bezier(0.34,1.56,0.64,1)"
            }} />
          </div>
          <span style={{ fontSize: "10px", color: "#888", textAlign: "center", lineHeight: 1.2, fontFamily: "monospace" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const StarRating = ({ value, onChange, size = 24 }) => (
  <div style={{ display: "flex", gap: "4px" }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} onClick={() => onChange && onChange(s)}
        style={{ fontSize: size, cursor: onChange ? "pointer" : "default", color: s <= value ? "#f59e0b" : "#e2e8f0", transition: "transform 0.15s", display: "inline-block" }}
        onMouseEnter={e => onChange && (e.target.style.transform = "scale(1.2)")}
        onMouseLeave={e => onChange && (e.target.style.transform = "scale(1)")}>★</span>
    ))}
  </div>
);

const Badge = ({ label, color = "#6366f1" }) => (
  <span style={{
    background: color + "18", color, border: `1px solid ${color}33`,
    borderRadius: "20px", padding: "2px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em"
  }}>{label}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: "16px",
    border: "1px solid #f0f0f5", boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
    padding: "24px", ...style
  }}>{children}</div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, required, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
    {label && <label style={{ fontSize: "12px", fontWeight: 700, color: "#555", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
      style={{
        padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
        fontSize: "14px", outline: "none", transition: "border-color 0.2s", background: "#fafafa",
        fontFamily: "inherit"
      }}
      onFocus={e => e.target.style.borderColor = "#6366f1"}
      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
    {label && <label style={{ fontSize: "12px", fontWeight: 700, color: "#555", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
        fontSize: "14px", outline: "none", background: "#fafafa", fontFamily: "inherit", cursor: "pointer"
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none" },
    secondary: { background: "#f8f7ff", color: "#6366f1", border: "1.5px solid #e2e0ff" },
    danger: { background: "#fff0f0", color: "#ef4444", border: "1.5px solid #fecaca" },
    success: { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        ...variants[variant], padding: "10px 20px", borderRadius: "10px",
        fontSize: "13px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "all 0.2s", fontFamily: "inherit",
        letterSpacing: "0.03em", ...style
      }}
      onMouseEnter={e => !disabled && (e.target.style.transform = "translateY(-1px)", e.target.style.boxShadow = "0 6px 20px rgba(99,102,241,0.3)")}
      onMouseLeave={e => !disabled && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "none")}
    >{children}</button>
  );
};

// ─── PAGES ────────────────────────────────────────────────────────────────────

// LOGIN / SIGNUP
const AuthPage = () => {
  const { login, register } = useApp();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", regNo: "", department: "CSE", year: 2 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (mode === "login") {
      const ok = login(form.email, form.password);
      if (!ok) setError("Invalid email or password.");
    } else {
      if (form.password !== form.confirm) { setError("Passwords don't match."); setLoading(false); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
      const ok = register({ ...form, role });
      if (!ok) setError("Email already registered.");
    }
    setLoading(false);
  };

  const demos = [
    { label: "Student Demo", email: "arjun@college.edu", pass: "pass123" },
    { label: "Admin Demo", email: "admin@college.edu", pass: "admin123" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', 'Helvetica Neue', sans-serif",
      padding: "20px", position: "relative", overflow: "hidden"
    }}>
      {/* bg decoration */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: `${80 + i * 60}px`, height: `${80 + i * 60}px`,
          border: `1px solid rgba(139,92,246,${0.08 + i * 0.02})`,
          top: `${10 + i * 8}%`, left: `${5 + i * 7}%`,
          animation: `spin ${20 + i * 5}s linear infinite`,
          pointerEvents: "none"
        }} />
      ))}

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "28px",
            boxShadow: "0 0 40px rgba(99,102,241,0.5)"
          }}>🎓</div>
          <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>EduRate</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>Faculty Evaluation System</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px"
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "4px", marginBottom: "24px" }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex: 1, padding: "8px", borderRadius: "9px", border: "none", cursor: "pointer",
                  background: mode === m ? "rgba(99,102,241,0.8)" : "transparent",
                  color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
                  fontWeight: 700, fontSize: "13px", transition: "all 0.2s", fontFamily: "inherit",
                  textTransform: "uppercase", letterSpacing: "0.05em"
                }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mode === "signup" && (
              <>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["student", "admin"].map(r => (
                    <button key={r} onClick={() => setRole(r)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: "9px",
                        border: `1.5px solid ${role === r ? "#6366f1" : "rgba(255,255,255,0.15)"}`,
                        background: role === r ? "rgba(99,102,241,0.2)" : "transparent",
                        color: role === r ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                        fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                        fontFamily: "inherit", textTransform: "capitalize"
                      }}>{r}</button>
                  ))}
                </div>
                <DarkInput label="Full Name" value={form.name} onChange={set("name")} placeholder="Your name" />
                {role === "student" && (
                  <>
                    <DarkInput label="Register Number" value={form.regNo} onChange={set("regNo")} placeholder="21CSE001" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <DarkSelect label="Department" value={form.department} onChange={set("department")}
                        options={["CSE", "ECE", "IT", "MECH", "CIVIL"].map(d => ({ value: d, label: d }))} />
                      <DarkSelect label="Year" value={form.year} onChange={set("year")}
                        options={[1, 2, 3, 4].map(y => ({ value: y, label: `Year ${y}` }))} />
                    </div>
                  </>
                )}
              </>
            )}
            <DarkInput label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@college.edu" />
            <DarkInput label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
            {mode === "signup" && (
              <DarkInput label="Confirm Password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />
            )}

            {error && <p style={{ color: "#f87171", fontSize: "12px", margin: 0, textAlign: "center", fontWeight: 600 }}>⚠ {error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              style={{
                padding: "12px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontWeight: 800, fontSize: "14px", cursor: "pointer",
                fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
                opacity: loading ? 0.7 : 1, boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                marginTop: "4px"
              }}>{loading ? "Please wait..." : (mode === "login" ? "Sign In →" : "Create Account →")}</button>
          </div>

          {mode === "login" && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", textAlign: "center", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Demo Access</p>
              <div style={{ display: "flex", gap: "8px" }}>
                {demos.map(d => (
                  <button key={d.label} onClick={() => { setForm(p => ({ ...p, email: d.email, password: d.pass })); }}
                    style={{
                      flex: 1, padding: "8px", borderRadius: "9px",
                      border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.6)", fontSize: "11px", cursor: "pointer",
                      fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s"
                    }}>{d.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DarkInput = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    {label && <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        padding: "10px 14px", borderRadius: "10px",
        border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)",
        color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit",
        transition: "border-color 0.2s"
      }}
      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.8)"}
      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
    />
  </div>
);

const DarkSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    {label && <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        padding: "10px 14px", borderRadius: "10px",
        border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(30,30,50,0.8)",
        color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit", cursor: "pointer"
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// SHELL (nav + layout)
const Shell = ({ children }) => {
  const { user, logout, page, setPage } = useApp();
  const isAdmin = user?.role === "admin";
  const studentLinks = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "feedback", label: "Submit Feedback", icon: "✍" },
    { id: "history", label: "My Submissions", icon: "📋" },
  ];
  const adminLinks = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "faculty", label: "Faculty", icon: "👨‍🏫" },
    { id: "students", label: "Students", icon: "👨‍🎓" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "feedback-admin", label: "Feedback", icon: "💬" },
  ];
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f4ff", fontFamily: "'Syne', 'Helvetica Neue', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: "220px", background: "linear-gradient(180deg, #1a1735 0%, #0f0e28 100%)",
        display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh"
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
            }}>🎓</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px", letterSpacing: "-0.01em" }}>EduRate</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{isAdmin ? "Admin Panel" : "Student Portal"}</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
                background: page === l.id ? "rgba(99,102,241,0.2)" : "transparent",
                color: page === l.id ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                fontWeight: page === l.id ? 700 : 500, fontSize: "13px",
                fontFamily: "inherit", marginBottom: "2px", transition: "all 0.2s",
                textAlign: "left", borderLeft: page === l.id ? "3px solid #6366f1" : "3px solid transparent"
              }}
              onMouseEnter={e => page !== l.id && (e.currentTarget.style.background = "rgba(255,255,255,0.05)", e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => page !== l.id && (e.currentTarget.style.background = "transparent", e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", padding: "8px 12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 800, color: "#fff"
            }}>{user?.name?.[0] || "U"}</div>
            <div>
              <div style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>{user?.name?.split(" ")[0]}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={logout} style={{
            width: "100%", padding: "8px", borderRadius: "9px",
            border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)",
            color: "#f87171", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
          }}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
};

// STUDENT DASHBOARD
const StudentDashboard = () => {
  const { user, faculty, feedback, setPage } = useApp();
  const myFeedback = feedback.filter(f => f.studentId === user.id);
  const deptFaculty = faculty.filter(f => f.department === user.department);
  const submitted = new Set(myFeedback.map(f => f.facultyId));

  const stats = [
    { label: "Faculty in Dept", value: deptFaculty.length, icon: "👨‍🏫", color: "#6366f1" },
    { label: "Feedbacks Given", value: myFeedback.length, icon: "✍", color: "#10b981" },
    { label: "Pending", value: deptFaculty.length - myFeedback.length, icon: "⏳", color: "#f59e0b" },
    { label: "Your Year", value: `Year ${user.year}`, icon: "📚", color: "#8b5cf6" },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0, letterSpacing: "-0.02em" }}>
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>{user.department} • {user.regNo}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, marginTop: "4px" }}>{s.value}</div>
              </div>
              <div style={{ fontSize: "28px", opacity: 0.7 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#1a1735", margin: 0 }}>Your Department Faculty</h2>
          <Btn onClick={() => setPage("feedback")} variant="primary" style={{ padding: "8px 16px", fontSize: "12px" }}>Submit Feedback</Btn>
        </div>
        <div style={{ display: "grid", gap: "12px" }}>
          {deptFaculty.map(f => {
            const done = submitted.has(f.id);
            return (
              <div key={f.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: "12px",
                background: done ? "#f0fdf4" : "#faf9ff",
                border: `1.5px solid ${done ? "#bbf7d0" : "#e8e5ff"}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px",
                    background: `linear-gradient(135deg, ${done ? "#10b981" : "#6366f1"}, ${done ? "#059669" : "#8b5cf6"})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: "13px"
                  }}>{f.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1a1735", fontSize: "14px" }}>{f.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{f.subjects.join(", ")}</div>
                  </div>
                </div>
                {done
                  ? <Badge label="✓ Submitted" color="#10b981" />
                  : <Badge label="Pending" color="#f59e0b" />}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// FEEDBACK FORM
const FeedbackForm = () => {
  const { user, faculty, feedback, addFeedback } = useApp();
  const deptFaculty = faculty.filter(f => f.department === user.department);
  const submitted = new Set(feedback.filter(f => f.studentId === user.id).map(f => f.facultyId));
  const available = deptFaculty.filter(f => !submitted.has(f.id));

  const [selectedFaculty, setSelectedFaculty] = useState(available[0]?.id || "");
  const [ratings, setRatings] = useState({ teaching: 0, knowledge: 0, communication: 0, punctuality: 0 });
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const criteria = [
    { key: "teaching", label: "Teaching Quality", icon: "📖" },
    { key: "knowledge", label: "Subject Knowledge", icon: "🧠" },
    { key: "communication", label: "Communication Skills", icon: "💬" },
    { key: "punctuality", label: "Punctuality", icon: "⏰" },
  ];

  const handleSubmit = () => {
    if (!selectedFaculty) { setError("Please select a faculty."); return; }
    if (Object.values(ratings).some(r => r === 0)) { setError("Please rate all criteria."); return; }
    addFeedback({ studentId: user.id, facultyId: selectedFaculty, ratings, comment, submittedAt: new Date().toISOString() });
    setSuccess(true);
  };

  if (success) return (
    <div style={{ padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <Card style={{ textAlign: "center", padding: "48px", maxWidth: "400px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a1735", marginBottom: "8px" }}>Feedback Submitted!</h2>
        <p style={{ color: "#888", marginBottom: "24px" }}>Your anonymous feedback has been recorded. Thank you for helping improve education quality!</p>
        <Btn onClick={() => { setSuccess(false); setRatings({ teaching: 0, knowledge: 0, communication: 0, punctuality: 0 }); setComment(""); }}>
          Submit Another
        </Btn>
      </Card>
    </div>
  );

  if (available.length === 0) return (
    <div style={{ padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <Card style={{ textAlign: "center", padding: "48px", maxWidth: "400px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1a1735" }}>All Done!</h2>
        <p style={{ color: "#888" }}>You've submitted feedback for all your department's faculty. Great job!</p>
      </Card>
    </div>
  );

  return (
    <div style={{ padding: "32px", maxWidth: "680px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>Submit Feedback</h1>
        <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>Your feedback is completely anonymous 🔒</p>
      </div>

      <Card style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" }}>Select Faculty</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          {available.map(f => (
            <div key={f.id} onClick={() => setSelectedFaculty(f.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderRadius: "12px", cursor: "pointer",
                background: selectedFaculty === f.id ? "#f0eeff" : "#fafafa",
                border: `2px solid ${selectedFaculty === f.id ? "#6366f1" : "#f0f0f5"}`,
                transition: "all 0.2s"
              }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: "12px", flexShrink: 0
              }}>{f.avatar}</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1a1735", fontSize: "14px" }}>{f.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{f.subjects.join(", ")}</div>
              </div>
              {selectedFaculty === f.id && <span style={{ marginLeft: "auto", color: "#6366f1", fontSize: "18px" }}>●</span>}
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>Rate Performance</h3>
        <div style={{ display: "grid", gap: "20px" }}>
          {criteria.map(c => (
            <div key={c.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{c.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>{c.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <StarRating value={ratings[c.key]} onChange={v => setRatings(p => ({ ...p, [c.key]: v }))} />
                {ratings[c.key] > 0 && <span style={{ fontSize: "12px", fontWeight: 700, color: "#6366f1", minWidth: "16px" }}>{ratings[c.key]}</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Additional Comments (Optional)</h3>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Share your thoughts anonymously..."
          rows={4}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: "10px",
            border: "1.5px solid #e2e8f0", fontSize: "14px", fontFamily: "inherit",
            resize: "vertical", outline: "none", boxSizing: "border-box", background: "#fafafa"
          }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        />
      </Card>

      {error && <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>⚠ {error}</p>}
      <Btn onClick={handleSubmit} variant="success" style={{ width: "100%", padding: "14px", fontSize: "14px" }}>
        Submit Anonymous Feedback →
      </Btn>
    </div>
  );
};

// MY SUBMISSIONS
const MySubmissions = () => {
  const { user, feedback, faculty } = useApp();
  const myFeedback = feedback.filter(f => f.studentId === user.id);

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>My Submissions</h1>
        <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>{myFeedback.length} feedback(s) submitted</p>
      </div>
      {myFeedback.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "#888" }}>No submissions yet. Start by giving feedback to your faculty!</p>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {myFeedback.map(fb => {
            const f = faculty.find(x => x.id === fb.facultyId);
            const overall = ((fb.ratings.teaching + fb.ratings.knowledge + fb.ratings.communication + fb.ratings.punctuality) / 4).toFixed(1);
            return (
              <Card key={fb.id}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: "14px"
                    }}>{f?.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: "#1a1735" }}>{f?.name}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{new Date(fb.submittedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#6366f1" }}>{overall}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>Overall</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {[["Teaching", "📖", fb.ratings.teaching], ["Knowledge", "🧠", fb.ratings.knowledge], ["Communication", "💬", fb.ratings.communication], ["Punctuality", "⏰", fb.ratings.punctuality]].map(([label, icon, val]) => (
                    <div key={label} style={{ textAlign: "center", padding: "10px", borderRadius: "10px", background: "#faf9ff" }}>
                      <div style={{ fontSize: "16px" }}>{icon}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#6366f1" }}>{val}</div>
                      <div style={{ fontSize: "10px", color: "#888" }}>{label}</div>
                    </div>
                  ))}
                </div>
                {fb.comment && <p style={{ marginTop: "12px", padding: "10px 14px", background: "#f8f7ff", borderRadius: "10px", fontSize: "13px", color: "#555", fontStyle: "italic", borderLeft: "3px solid #6366f1" }}>"{fb.comment}"</p>}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ADMIN OVERVIEW
const AdminOverview = () => {
  const { faculty, feedback, students } = useApp();
  const totalFeedback = feedback.length;
  const avgRating = overallAvg(feedback);
  const topFaculty = [...faculty].map(f => {
    const fbs = feedback.filter(fb => fb.facultyId === f.id);
    return { ...f, avg: parseFloat(overallAvg(fbs)), count: fbs.length };
  }).sort((a, b) => b.avg - a.avg).slice(0, 3);

  const stats = [
    { label: "Total Faculty", value: faculty.length, icon: "👨‍🏫", color: "#6366f1" },
    { label: "Total Students", value: students.length, icon: "👨‍🎓", color: "#8b5cf6" },
    { label: "Feedbacks", value: totalFeedback, icon: "💬", color: "#10b981" },
    { label: "Avg Rating", value: `${avgRating}/5`, icon: "⭐", color: "#f59e0b" },
  ];

  const deptData = ["CSE", "ECE", "IT", "MECH"].map(dept => ({
    label: dept, value: parseFloat(overallAvg(feedback.filter(fb => faculty.find(f => f.id === fb.facultyId)?.department === dept))) || 0
  }));

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>Admin Overview</h1>
        <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>System-wide performance at a glance</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: s.color, marginTop: "4px" }}>{s.value}</div>
              </div>
              <div style={{ fontSize: "30px", opacity: 0.7 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <Card>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1735", marginBottom: "20px" }}>Avg Rating by Department</h3>
          <BarChart data={deptData} colors={["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"]} />
        </Card>

        <Card>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1735", marginBottom: "16px" }}>Top Rated Faculty</h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {topFaculty.map((f, i) => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: ["#f59e0b", "#9ca3af", "#b45309"][i] + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: ["#f59e0b", "#9ca3af", "#b45309"][i] }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#1a1735" }}>{f.name}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{f.count} reviews</div>
                </div>
                <div style={{ fontWeight: 800, color: "#6366f1", fontSize: "16px" }}>{f.avg > 0 ? f.avg : "—"}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1735", marginBottom: "16px" }}>Recent Feedback</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          {feedback.slice(-4).reverse().map(fb => {
            const f = faculty.find(x => x.id === fb.facultyId);
            const ov = ((fb.ratings.teaching + fb.ratings.knowledge + fb.ratings.communication + fb.ratings.punctuality) / 4).toFixed(1);
            return (
              <div key={fb.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", background: "#faf9ff", border: "1.5px solid #ede9ff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "11px" }}>{f?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "#1a1735" }}>{f?.name}</div>
                    {fb.comment && <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>"{fb.comment.slice(0, 40)}..."</div>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <StarRating value={Math.round(ov)} size={14} />
                  <span style={{ fontWeight: 800, color: "#6366f1" }}>{ov}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// FACULTY MANAGEMENT
const FacultyManagement = () => {
  const { faculty, addFaculty, updateFaculty, deleteFaculty } = useApp();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", department: "CSE", subjects: "" });
  const set = k => v => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setForm({ name: "", department: "CSE", subjects: "" }); setModal("add"); };
  const openEdit = (f) => { setForm({ ...f, subjects: f.subjects.join(", ") }); setModal("edit"); };

  const handleSave = () => {
    const data = { ...form, subjects: form.subjects.split(",").map(s => s.trim()).filter(Boolean) };
    if (modal === "add") addFaculty(data);
    else updateFaculty(data);
    setModal(null);
  };

  const depts = ["CSE", "ECE", "IT", "MECH", "CIVIL"];

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>Faculty Management</h1>
          <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>{faculty.length} faculty members</p>
        </div>
        <Btn onClick={openAdd}>+ Add Faculty</Btn>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {faculty.map(f => (
          <Card key={f.id} style={{ padding: "18px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: "15px"
                }}>{f.avatar}</div>
                <div>
                  <div style={{ fontWeight: 800, color: "#1a1735", fontSize: "15px" }}>{f.name}</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                    <Badge label={f.department} color="#6366f1" />
                    {f.subjects.map(s => <Badge key={s} label={s} color="#8b5cf6" />)}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn onClick={() => openEdit(f)} variant="secondary" style={{ padding: "7px 14px", fontSize: "12px" }}>Edit</Btn>
                <Btn onClick={() => deleteFaculty(f.id)} variant="danger" style={{ padding: "7px 14px", fontSize: "12px" }}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", width: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#1a1735", marginBottom: "24px" }}>{modal === "add" ? "Add New Faculty" : "Edit Faculty"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Input label="Full Name" value={form.name} onChange={set("name")} placeholder="Dr. Name Here" />
              <Select label="Department" value={form.department} onChange={set("department")}
                options={depts.map(d => ({ value: d, label: d }))} />
              <Input label="Subjects (comma separated)" value={form.subjects} onChange={set("subjects")} placeholder="DBMS, Networks" />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <Btn onClick={handleSave} style={{ flex: 1 }}>Save</Btn>
              <Btn onClick={() => setModal(null)} variant="secondary" style={{ flex: 1 }}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// STUDENT MANAGEMENT
const StudentManagement = () => {
  const { students, toggleBlock } = useApp();
  const [search, setSearch] = useState("");
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.includes(search));

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>Student Management</h1>
        <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>{students.length} registered students</p>
      </div>

      <Card style={{ marginBottom: "20px", padding: "16px 20px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search by name or register number..."
          style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", fontFamily: "inherit", background: "transparent" }} />
      </Card>

      <div style={{ display: "grid", gap: "12px" }}>
        {filtered.map(s => (
          <Card key={s.id} style={{ padding: "16px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: s.blocked ? "#fee2e2" : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.blocked ? "#ef4444" : "#fff", fontWeight: 800, fontSize: "14px"
                }}>{s.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 800, color: "#1a1735" }}>{s.name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{s.regNo} • {s.department} • Year {s.year}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {s.blocked && <Badge label="Blocked" color="#ef4444" />}
                <Btn onClick={() => toggleBlock(s.id)} variant={s.blocked ? "success" : "danger"} style={{ padding: "7px 14px", fontSize: "12px" }}>
                  {s.blocked ? "Unblock" : "Block"}
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ANALYTICS
const Analytics = () => {
  const { faculty, feedback } = useApp();
  const [filterDept, setFilterDept] = useState("All");
  const depts = ["All", "CSE", "ECE", "IT", "MECH"];

  const filtered = filterDept === "All" ? faculty : faculty.filter(f => f.department === filterDept);

  const facultyData = filtered.map(f => {
    const fbs = feedback.filter(fb => fb.facultyId === f.id);
    return {
      ...f,
      teaching: parseFloat(ratingAvg(fbs, "teaching")) || 0,
      knowledge: parseFloat(ratingAvg(fbs, "knowledge")) || 0,
      communication: parseFloat(ratingAvg(fbs, "communication")) || 0,
      punctuality: parseFloat(ratingAvg(fbs, "punctuality")) || 0,
      overall: parseFloat(overallAvg(fbs)) || 0,
      count: fbs.length,
    };
  });

  const criteriaOverall = [
    { label: "Teaching", value: parseFloat(avg(feedback.map(f => f.ratings.teaching))) },
    { label: "Knowledge", value: parseFloat(avg(feedback.map(f => f.ratings.knowledge))) },
    { label: "Communication", value: parseFloat(avg(feedback.map(f => f.ratings.communication))) },
    { label: "Punctuality", value: parseFloat(avg(feedback.map(f => f.ratings.punctuality))) },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>Analytics</h1>
          <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>Performance insights across all faculty</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {depts.map(d => (
            <button key={d} onClick={() => setFilterDept(d)}
              style={{
                padding: "7px 14px", borderRadius: "9px", border: "1.5px solid",
                borderColor: filterDept === d ? "#6366f1" : "#e2e8f0",
                background: filterDept === d ? "#f0eeff" : "#fff",
                color: filterDept === d ? "#6366f1" : "#888",
                fontWeight: 700, fontSize: "12px", cursor: "pointer", fontFamily: "inherit"
              }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <Card>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1735", marginBottom: "20px" }}>Overall Criteria Averages</h3>
          <BarChart data={criteriaOverall} colors={["#6366f1", "#8b5cf6", "#10b981", "#f59e0b"]} />
        </Card>

        <Card>
          <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1735", marginBottom: "16px" }}>Faculty Performance Heatmap</h3>
          <div style={{ display: "grid", gap: "8px" }}>
            {facultyData.map(f => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#555", width: "80px", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name.split(" ").slice(-1)[0]}</span>
                {[f.teaching, f.knowledge, f.communication, f.punctuality].map((v, i) => {
                  const intensity = v / 5;
                  return <div key={i} style={{
                    flex: 1, height: "24px", borderRadius: "5px",
                    background: v === 0 ? "#f0f0f5" : `rgba(99,102,241,${0.1 + intensity * 0.9})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: intensity > 0.5 ? "#fff" : "#6366f1"
                  }}>{v > 0 ? v : "—"}</div>;
                })}
              </div>
            ))}
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "80px" }} />
              {["Teach", "Know", "Comm", "Punct"].map(l => (
                <div key={l} style={{ flex: 1, fontSize: "9px", textAlign: "center", color: "#aaa", fontWeight: 700 }}>{l}</div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1a1735", marginBottom: "16px" }}>Detailed Faculty Ratings</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f5" }}>
                {["Faculty", "Dept", "Reviews", "Teaching", "Knowledge", "Communication", "Punctuality", "Overall"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#888", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facultyData.map(f => (
                <tr key={f.id} style={{ borderBottom: "1px solid #f8f7ff" }}>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#1a1735" }}>{f.name}</td>
                  <td style={{ padding: "12px" }}><Badge label={f.department} color="#6366f1" /></td>
                  <td style={{ padding: "12px", color: "#888" }}>{f.count}</td>
                  {[f.teaching, f.knowledge, f.communication, f.punctuality].map((v, i) => (
                    <td key={i} style={{ padding: "12px" }}>
                      <span style={{ fontWeight: 700, color: v >= 4 ? "#10b981" : v >= 3 ? "#f59e0b" : v > 0 ? "#ef4444" : "#ccc" }}>
                        {v > 0 ? `${v} ★` : "—"}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontWeight: 800, fontSize: "15px", color: "#6366f1" }}>{f.overall > 0 ? f.overall : "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// FEEDBACK ADMIN
const FeedbackAdmin = () => {
  const { feedback, faculty, students } = useApp();
  const [filterFaculty, setFilterFaculty] = useState("All");

  const filtered = filterFaculty === "All" ? feedback : feedback.filter(f => f.facultyId === filterFaculty);

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a1735", margin: 0 }}>All Feedback</h1>
          <p style={{ color: "#888", marginTop: "4px", fontSize: "14px" }}>{filtered.length} submissions</p>
        </div>
        <Select value={filterFaculty} onChange={setFilterFaculty}
          options={[{ value: "All", label: "All Faculty" }, ...faculty.map(f => ({ value: f.id, label: f.name }))]} />
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {filtered.map(fb => {
          const f = faculty.find(x => x.id === fb.facultyId);
          const ov = ((fb.ratings.teaching + fb.ratings.knowledge + fb.ratings.communication + fb.ratings.punctuality) / 4).toFixed(1);
          return (
            <Card key={fb.id}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #6366f1,#8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: "13px"
                  }}>{f?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#1a1735" }}>{f?.name}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      Anonymous Student • {new Date(fb.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: parseFloat(ov) >= 4 ? "#10b981" : parseFloat(ov) >= 3 ? "#f59e0b" : "#ef4444" }}>{ov}</div>
                  <StarRating value={Math.round(ov)} size={14} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
                {[["📖", "Teaching", fb.ratings.teaching], ["🧠", "Knowledge", fb.ratings.knowledge], ["💬", "Comm.", fb.ratings.communication], ["⏰", "Punct.", fb.ratings.punctuality]].map(([icon, label, v]) => (
                  <div key={label} style={{ padding: "8px", borderRadius: "8px", background: "#faf9ff", textAlign: "center" }}>
                    <div style={{ fontSize: "14px" }}>{icon}</div>
                    <div style={{ fontWeight: 800, color: "#6366f1", fontSize: "16px" }}>{v}</div>
                    <div style={{ fontSize: "10px", color: "#888" }}>{label}</div>
                  </div>
                ))}
              </div>
              {fb.comment && <p style={{ marginTop: "12px", padding: "10px 14px", background: "#f8f7ff", borderRadius: "10px", fontSize: "13px", color: "#555", fontStyle: "italic", borderLeft: "3px solid #6366f1", margin: "12px 0 0" }}>💬 "{fb.comment}"</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── APP PROVIDER ─────────────────────────────────────────────────────────────
const USERS = [
  { id: "s1", name: "Arjun Krishnan", email: "arjun@college.edu", password: "pass123", role: "student", department: "CSE", regNo: "21CSE001", year: 3 },
  { id: "s2", name: "Divya Sharma", email: "divya@college.edu", password: "pass123", role: "student", department: "CSE", regNo: "21CSE002", year: 3 },
  { id: "admin1", name: "Admin User", email: "admin@college.edu", password: "admin123", role: "admin" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [users, setUsers] = useState(USERS);

  const login = (email, password) => {
    const u = users.find(u => u.email === email && u.password === password);
    if (!u) return false;
    setUser(u);
    setPage(u.role === "admin" ? "overview" : "dashboard");
    return true;
  };

  const register = (data) => {
    if (users.find(u => u.email === data.email)) return false;
    const newUser = { ...data, id: `u${Date.now()}`, blocked: false };
    setUsers(p => [...p, newUser]);
    if (data.role === "student") setStudents(p => [...p, newUser]);
    setUser(newUser);
    setPage("dashboard");
    return true;
  };

  const logout = () => { setUser(null); setPage("dashboard"); };

  const addFaculty = (data) => {
    const f = { ...data, id: `f${Date.now()}`, avatar: data.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() };
    setFaculty(p => [...p, f]);
  };
  const updateFaculty = (data) => setFaculty(p => p.map(f => f.id === data.id ? { ...f, ...data } : f));
  const deleteFaculty = (id) => setFaculty(p => p.filter(f => f.id !== id));
  const addFeedback = (data) => setFeedback(p => [...p, { ...data, id: `fb${Date.now()}` }]);
  const toggleBlock = (id) => setStudents(p => p.map(s => s.id === id ? { ...s, blocked: !s.blocked } : s));

  const ctx = { user, login, logout, register, page, setPage, faculty, feedback, students, addFaculty, updateFaculty, deleteFaculty, addFeedback, toggleBlock };

  const renderPage = () => {
    if (!user) return <AuthPage />;
    const isAdmin = user.role === "admin";
    const pages = {
      dashboard: <StudentDashboard />,
      feedback: <FeedbackForm />,
      history: <MySubmissions />,
      overview: <AdminOverview />,
      faculty: <FacultyManagement />,
      students: <StudentManagement />,
      analytics: <Analytics />,
      "feedback-admin": <FeedbackAdmin />,
    };
    return <Shell>{pages[page] || (isAdmin ? <AdminOverview /> : <StudentDashboard />)}</Shell>;
  };

  return (
    <AppContext.Provider value={ctx}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f4ff; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(150,150,170,0.6); }
        textarea::placeholder { color: rgba(150,150,170,0.6); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 10px; }
      `}</style>
      {renderPage()}
    </AppContext.Provider>
  );
}