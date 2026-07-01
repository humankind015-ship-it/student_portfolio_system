import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser, canEdit, canDelete, type AppRole } from "@/hooks/use-current-user";
import {
  GRADES, LANGUAGES, getGL, getLevelColor, getLevelLabel, type Level,
} from "@/lib/grade-levels";
const LOGO_URL = "/favicon.png";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({ meta: [{ title: "Student Portfolios — Humankind" }] }),
  component: AppPage,
});

const F = { fontFamily: "'Segoe UI',system-ui,sans-serif" } as const;


type Student = {
  id: string;
  name: string;
  age: string | null;
  gender: string | null;
  grade: string | null;
  mother_tongue: string | null;
  school: string | null;
  community: string | null;
  first_gen_learner: string | null;
  special_needs: string | null;
  attendance: string | null;
  levels: Record<string, string>;
};

type Note = {
  id: string;
  student_id: string;
  author_id: string;
  author_name: string;
  author_role: AppRole;
  focus_areas: string | null;
  observation: string;
  created_at: string;
};

const ROLE_C: Record<AppRole, { bg: string; text: string; border: string }> = {
  head:        { bg:"#fdf2f8", text:"#9d174d", border:"#f9a8d4" },
  coordinator: { bg:"#eff6ff", text:"#1d4ed8", border:"#8cc63f" },
  intern:      { bg:"#f0fdf4", text:"#15803d", border:"#86efac" },
};
const RoleBadge = ({ role }: { role: AppRole }) => {
  const c = ROLE_C[role] || ROLE_C.intern;
  return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:c.bg, color:c.text, border:`1px solid ${c.border}`, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>{role}</span>;
};
const Toast = ({ toast }: { toast: { msg: string; type?: string } }) => (
  <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:9999, background:toast.type==="error"?"#dc2626":"#1e5a9c", color:"#fff", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, boxShadow:"0 4px 14px rgba(0,0,0,0.2)", whiteSpace:"nowrap" }}>
    {toast.msg}
  </div>
);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

type View = "home" | "detail" | "form" | "team";

type TeamMember = { id: string; full_name: string; role: AppRole };


const emptyForm = (): Partial<Student> => ({
  name: "", age: "", gender: "", grade: "", mother_tongue: "",
  school: "", community: "", first_gen_learner: "", special_needs: "",
  attendance: "", levels: {},
});

function AppPage() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();

  const [students, setStudents] = useState<Student[]>([]);
  const [notesByStudent, setNotesByStudent] = useState<Record<string, Note[]>>({});
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<View>("home");
  const [current, setCurrent] = useState<Student | null>(null);
  const [tab, setTab] = useState<"overview" | "academic" | "notes">("overview");
  const [editForm, setEditForm] = useState<Partial<Student> | null>(null);
  const [editIsNew, setEditIsNew] = useState(true);
  const [newNote, setNewNote] = useState({ focusAreas: "", observation: "" });
  const [localLevels, setLocalLevels] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

  const flash = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const refreshAll = async () => {
    setLoading(true);
    const [s, n] = await Promise.all([
      supabase.from("students").select("*").order("created_at", { ascending: false }),
      supabase.from("student_notes").select("*").order("created_at", { ascending: true }),
    ]);
    if (s.data) setStudents(s.data as any);
    if (n.data) {
      const grouped: Record<string, Note[]> = {};
      for (const note of n.data as any[]) {
        (grouped[note.student_id] ||= []).push(note as Note);
      }
      setNotesByStudent(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { refreshAll(); }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const openStudent = (s: Student) => {
    setCurrent(s);
    setLocalLevels({ ...(s.levels || {}) });
    setTab("overview");
    setNewNote({ focusAreas: "", observation: "" });
    setView("detail");
  };

  const startNew = () => {
    setEditForm(emptyForm());
    setEditIsNew(true);
    setView("form");
  };
  const startEdit = (s: Student) => {
    setEditForm({ ...s });
    setEditIsNew(false);
    setView("form");
  };

  const saveForm = async () => {
    if (!editForm?.name?.trim()) { flash("Student name is required.", "error"); return; }
    const payload: any = {
      name: editForm.name?.trim(),
      age: editForm.age || null,
      gender: editForm.gender || null,
      grade: editForm.grade || null,
      mother_tongue: editForm.mother_tongue || null,
      school: editForm.school || null,
      community: editForm.community || null,
      first_gen_learner: editForm.first_gen_learner || null,
      special_needs: editForm.special_needs || null,
      attendance: editForm.attendance || null,
      levels: editForm.levels || {},
    };
    let saved: Student | null = null;
    if (editIsNew) {
      payload.created_by = user?.id;
      const { data, error } = await supabase.from("students").insert(payload).select().single();
      if (error) { flash(error.message, "error"); return; }
      saved = data as any;
    } else {
      const { data, error } = await supabase.from("students").update(payload).eq("id", editForm.id!).select().single();
      if (error) { flash(error.message, "error"); return; }
      saved = data as any;
    }
    await refreshAll();
    if (saved) {
      setCurrent(saved);
      setLocalLevels({ ...(saved.levels || {}) });
      setView("detail");
    }
    flash("Portfolio saved.");
  };

  const submitNote = async (sid: string) => {
    if (!newNote.observation.trim()) { flash("Write an observation before saving.", "error"); return; }
    if (!user) return;
    const { error } = await supabase.from("student_notes").insert({
      student_id: sid,
      author_id: user.id,
      author_name: user.name,
      author_role: user.role,
      focus_areas: newNote.focusAreas || null,
      observation: newNote.observation,
    });
    if (error) { flash(error.message, "error"); return; }
    setNewNote({ focusAreas: "", observation: "" });
    await refreshAll();
    flash("Note saved permanently.");
  };

  const saveLevels = async (sid: string) => {
    const { data, error } = await supabase.from("students").update({ levels: localLevels }).eq("id", sid).select().single();
    if (error) { flash(error.message, "error"); return; }
    if (data) setCurrent(data as any);
    await refreshAll();
    flash("Academic levels updated.");
  };

  const deleteStudent = async (id: string) => {
    if (!window.confirm("Permanently delete this portfolio?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) { flash(error.message, "error"); return; }
    await refreshAll();
    setView("home");
    flash("Portfolio deleted.");
  };

  const filtered = useMemo(() => students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.grade || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.community || "").toLowerCase().includes(search.toLowerCase())
  ), [students, search]);

  if (userLoading || !user) {
    return <div style={{ padding: 40, textAlign: "center", color: "#64748b", ...F }}>Loading…</div>;
  }

  // ── HOME ──
  if (view === "home") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f8", ...F }}>
        {toast && <Toast toast={toast} />}
        <div style={{ background:"#1e5a9c", padding:"16px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, minWidth:0 }}>
              <img src={LOGO_URL} alt="Humankind" style={{ height:38, width:38, borderRadius:8, background:"#fff", padding:3, objectFit:"contain", flexShrink:0 }} />
              <div style={{ minWidth:0 }}>
                <div style={{ color:"#8cc63f", fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase" }}>Humankind</div>
                <div style={{ color:"#fff", fontSize:20, fontWeight:800, marginTop:2 }}>Student Portfolios</div>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:600 }}>{user.name}</div>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:4, justifyContent:"flex-end", flexWrap:"wrap" }}>
                <RoleBadge role={user.role} />
                {user.role === "head" && (
                  <button onClick={() => setView("team")} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", fontSize:11, cursor:"pointer", padding:"3px 9px", borderRadius:6, fontWeight:600 }}>Team</button>
                )}
                <button onClick={logout} style={{ background:"none", border:"none", color:"#8cc63f", fontSize:11, cursor:"pointer", padding:0 }}>Sign out</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding:"16px 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
            {[
              { label:"Students", value: students.length },
              { label:"Grades", value: [...new Set(students.map(s => s.grade).filter(Boolean))].length },
              { label:"First-Gen", value: students.filter(s => s.first_gen_learner === "Yes").length },
            ].map(stat => (
              <div key={stat.label} style={{ background:"#fff", borderRadius:10, padding:"12px 14px", border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"#1e5a9c" }}>{stat.value}</div>
                <div style={{ fontSize:11, color:"#64748b", marginTop:1 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
              style={{ flex:1, padding:"10px 13px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:14 }} />
            {canEdit(user.role) && (
              <button onClick={startNew} style={{ background:"#1e5a9c", color:"#fff", border:"none", borderRadius:8, padding:"10px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Add</button>
            )}
          </div>
          <div style={{ fontSize:11, color:"#64748b", background:"#fff", borderRadius:8, padding:"8px 12px", border:"1px solid #e2e8f0", marginBottom:14 }}>
            {user.role==="intern" && "You can update academic levels and add notes. Student details and past notes are read-only."}
            {user.role==="coordinator" && "You can edit student details, update levels, and add notes. Past notes are read-only."}
            {user.role==="head" && "You have full access to all portfolios."}
          </div>
          {loading ? (
            <div style={{ textAlign:"center", padding:30, color:"#64748b", fontSize:13 }}>Loading students…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:30, color:"#94a3b8", fontSize:13, background:"#fff", borderRadius:10, border:"1px solid #e2e8f0" }}>
              No students yet. {canEdit(user.role) && "Click + Add to create the first portfolio."}
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map(s => {
                const gl = getGL(s.grade);
                const subjects = gl ? gl.subjects : [];
                const notes = notesByStudent[s.id] || [];
                return (
                  <div key={s.id} onClick={() => openStudent(s)}
                    style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:42, height:42, borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:"#1e5a9c", flexShrink:0 }}>
                      {s.name ? s.name[0].toUpperCase() : "?"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, color:"#1e293b", fontSize:15 }}>{s.name}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>
                        {[s.grade, s.age ? `Age ${s.age}` : null, s.community].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                      {subjects.slice(0, 2).map(sub => {
                        const c = getLevelColor(s.levels?.[sub], gl, sub);
                        const lv = getLevelLabel(s.levels?.[sub], gl, sub);
                        return lv
                          ? <span key={sub} style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:c.badge, color:c.text, fontWeight:700 }}>{sub.split(" ")[0]} ✓</span>
                          : <span key={sub} style={{ fontSize:10, color:"#cbd5e1" }}>{sub.split(" ")[0]} —</span>;
                      })}
                      <span style={{ fontSize:10, color:"#94a3b8" }}>{notes.length} note{notes.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DETAIL ──
  if (view === "detail" && current) {
    const s = current;
    const gl = getGL(s.grade);
    const subjects = gl ? gl.subjects : [];
    const notes = notesByStudent[s.id] || [];
    return (
      <div style={{ minHeight:"100vh", background:"#f0f4f8", ...F }}>
        {toast && <Toast toast={toast} />}
        <div style={{ background:"#1e5a9c", padding:"14px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <button onClick={() => setView("home")} style={{ background:"none", border:"none", color:"#8cc63f", fontSize:22, cursor:"pointer", padding:0 }}>←</button>
            <div style={{ flex:1 }}>
              <div style={{ color:"#8cc63f", fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>Student Portfolio</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:19 }}>{s.name}</div>
            </div>
            {canEdit(user.role) && (
              <button onClick={() => startEdit(s)} style={{ background:"rgba(255,255,255,0.15)", color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontWeight:600, fontSize:12, cursor:"pointer" }}>Edit</button>
            )}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {[s.grade, s.age ? `Age ${s.age}` : null, s.gender, s.mother_tongue, s.first_gen_learner === "Yes" ? "First-Gen" : null].filter(Boolean).map(tag => (
              <span key={tag as string} style={{ background:"rgba(255,255,255,0.15)", color:"#e2e8f0", fontSize:11, padding:"3px 9px", borderRadius:20 }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", background:"#fff", borderBottom:"2px solid #e2e8f0" }}>
          {(["overview", "academic", "notes"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:"11px 4px", background:"none", border:"none", borderBottom: tab === t ? "2px solid #1e5a9c" : "2px solid transparent", marginBottom:-2, fontWeight: tab === t ? 700 : 400, color: tab === t ? "#1e5a9c" : "#64748b", fontSize:12, cursor:"pointer" }}>
              {t === "notes" ? `Notes (${notes.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ padding:"16px 20px 80px" }}>
          {tab === "overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:16 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#1e5a9c", marginBottom:4 }}>Academic Snapshot</div>
                {!gl ? (
                  <div style={{ fontSize:12, color:"#94a3b8", padding:"10px 0" }}>Grade not set yet.</div>
                ) : (
                  <>
                    <div style={{ fontSize:11, color:"#64748b", marginBottom:12 }}>vs. expected level for {s.grade}</div>
                    {subjects.map(sub => {
                      const levelId = s.levels?.[sub];
                      const levelInfo = getLevelLabel(levelId, gl, sub);
                      const c = getLevelColor(levelId, gl, sub);
                      const levels = (gl[sub] as Level[]) || [];
                      const curIdx = levels.findIndex(l => l.id === levelId);
                      const expIdx = levels.findIndex(l => l.expected);
                      const pct = levels.length && curIdx >= 0 ? (curIdx / (levels.length - 1)) * 100 : 0;
                      return (
                        <div key={sub} style={{ padding:"10px 0", borderBottom:"1px solid #f8fafc" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:"#334155" }}>{sub}</span>
                            {levelInfo
                              ? <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:c.badge, color:c.text, fontWeight:700, maxWidth:"56%", textAlign:"right" }}>{levelInfo.label}</span>
                              : <span style={{ fontSize:10, color:"#cbd5e1" }}>Not assessed</span>}
                          </div>
                          <div style={{ height:5, background:"#f1f5f9", borderRadius:4, overflow:"hidden" }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:c.bar, borderRadius:4 }} />
                          </div>
                          {expIdx >= 0 && <div style={{ fontSize:10, color:"#94a3b8", marginTop:2 }}>Expected: {levels[expIdx].label}</div>}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:16 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#1e5a9c", marginBottom:10 }}>Background</div>
                {([
                  ["School", s.school],
                  ["Community", s.community],
                  ["Mother Tongue", s.mother_tongue],
                  ["First-Gen", s.first_gen_learner],
                  ["Special Needs", s.special_needs],
                  ["Attendance", s.attendance],
                ] as [string, string | null][])
                  .filter(([, v]) => v)
                  .map(([l, v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f8fafc", fontSize:13 }}>
                      <span style={{ color:"#64748b" }}>{l}</span>
                      <span style={{ color:"#1e293b", fontWeight:500, textAlign:"right", maxWidth:"60%" }}>{v}</span>
                    </div>
                  ))}
              </div>

              {notes.length > 0 && (() => {
                const n = notes[notes.length - 1];
                return (
                  <div style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:16 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:"#1e5a9c", marginBottom:8 }}>Latest Note</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#334155" }}>{n.author_name}</span>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <RoleBadge role={n.author_role} />
                        <span style={{ fontSize:11, color:"#94a3b8" }}>{fmtDate(n.created_at)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:13, color:"#475569", lineHeight:1.6 }}>{n.observation}</div>
                    {notes.length > 1 && (
                      <button onClick={() => setTab("notes")} style={{ marginTop:10, background:"none", border:"none", color:"#3b82f6", fontSize:12, cursor:"pointer", padding:0 }}>
                        View all {notes.length} notes →
                      </button>
                    )}
                  </div>
                );
              })()}

              {canDelete(user.role) && (
                <button onClick={() => deleteStudent(s.id)} style={{ background:"#fff", color:"#dc2626", border:"1px solid #fecaca", borderRadius:8, padding:"11px 0", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                  Delete Portfolio
                </button>
              )}
            </div>
          )}

          {tab === "academic" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {!gl ? (
                <div style={{ background:"#fef9c3", borderRadius:8, padding:16, fontSize:13, color:"#92400e", borderLeft:"4px solid #f59e0b" }}>
                  No grade assigned yet. A coordinator needs to set the grade first.
                </div>
              ) : (
                <>
                  <div style={{ background:"#eff6ff", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#1e40af", borderLeft:"4px solid #3b82f6" }}>
                    Subjects shown are for <strong>{s.grade}</strong>. Select where the student <em>actually</em> is — not where they should be. The <span style={{ color:"#3b82f6", fontWeight:700 }}>← expected</span> marker shows the grade benchmark.
                  </div>
                  {subjects.map(sub => {
                    const levels = (gl[sub] as Level[]) || [];
                    const selected = localLevels[sub] || null;
                    return (
                      <div key={sub} style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:14 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:"#1e5a9c", marginBottom:10 }}>{sub}</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                          {levels.map(lvl => (
                            <button key={lvl.id} onClick={() => setLocalLevels({ ...localLevels, [sub]: lvl.id })}
                              style={{ padding:"9px 12px", borderRadius:8, border: selected === lvl.id ? "2px solid #1e5a9c" : "1px solid #e2e8f0", background: selected === lvl.id ? "#eff6ff" : "#fafafa", fontWeight: selected === lvl.id ? 700 : 400, color: selected === lvl.id ? "#1e5a9c" : "#475569", cursor:"pointer", fontSize:12, textAlign:"left", display:"flex", gap:8, alignItems:"center" }}>
                              <span style={{ width:20, height:20, borderRadius:"50%", background: selected === lvl.id ? "#1e5a9c" : "#e2e8f0", color: selected === lvl.id ? "#fff" : "#64748b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>
                                {selected === lvl.id ? "✓" : ""}
                              </span>
                              <span style={{ flex:1 }}>{lvl.label}</span>
                              {lvl.expected && <span style={{ fontSize:10, color:"#3b82f6", fontWeight:700, flexShrink:0 }}>← expected</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <button onClick={() => saveLevels(s.id)} style={{ background:"#1e5a9c", color:"#fff", border:"none", borderRadius:8, padding:13, fontWeight:700, fontSize:15, cursor:"pointer" }}>
                    Save Academic Levels
                  </button>
                </>
              )}
            </div>
          )}

          {tab === "notes" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {notes.length === 0 && (
                <div style={{ textAlign:"center", padding:"30px 20px", color:"#94a3b8", fontSize:13 }}>No notes yet.</div>
              )}
              {[...notes].reverse().map(note => (
                <div key={note.id} style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:16, position:"relative" }}>
                  <div style={{ position:"absolute", top:12, right:12, fontSize:10, color:"#94a3b8" }}>🔒 locked</div>
                  <div style={{ marginBottom:8, paddingRight:60 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{note.author_name}</span>
                    <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center" }}>
                      <RoleBadge role={note.author_role} />
                      <span style={{ fontSize:11, color:"#94a3b8" }}>{fmtDate(note.created_at)}</span>
                    </div>
                  </div>
                  {note.focus_areas && (
                    <div style={{ marginBottom:8 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>Focus Areas</div>
                      <div style={{ fontSize:12, color:"#334155" }}>{note.focus_areas}</div>
                    </div>
                  )}
                  <div style={{ fontSize:12, color:"#475569", lineHeight:1.65 }}>{note.observation}</div>
                </div>
              ))}
              <div style={{ background:"#fff", borderRadius:10, border:"2px solid #1e5a9c", padding:16 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#1e5a9c", marginBottom:10 }}>Add a Note — {user.name}</div>
                <div style={{ fontSize:11, color:"#64748b", background:"#fef9c3", padding:"7px 10px", borderRadius:6, marginBottom:12 }}>⚠️ Once saved, this note is permanent and cannot be edited or deleted.</div>
                <div style={{ marginBottom:10 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Focus Areas for Next Session</label>
                  <input value={newNote.focusAreas} onChange={e => setNewNote({ ...newNote, focusAreas: e.target.value })} placeholder="e.g. Gujarati reading fluency, multiplication tables"
                    style={{ width:"100%", padding:"9px 11px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:13, boxSizing:"border-box" }} />
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Observations *</label>
                  <textarea rows={4} value={newNote.observation} onChange={e => setNewNote({ ...newNote, observation: e.target.value })} placeholder="What did the student do well? What was difficult? Learning style, behaviour, home situation, what worked…"
                    style={{ width:"100%", padding:"9px 11px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:13, boxSizing:"border-box", resize:"none" }} />
                </div>
                <button onClick={() => submitNote(s.id)} style={{ width:"100%", background:"#1e5a9c", color:"#fff", border:"none", borderRadius:8, padding:12, fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  Save Note Permanently
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── FORM ──
  if (view === "form" && editForm) {
    const upd = (f: keyof Student, v: string) => setEditForm({ ...editForm, [f]: v });
    return (
      <div style={{ minHeight:"100vh", background:"#f0f4f8", ...F }}>
        {toast && <Toast toast={toast} />}
        <div style={{ background:"#1e5a9c", padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setView(editIsNew ? "home" : "detail")} style={{ background:"none", border:"none", color:"#8cc63f", fontSize:22, cursor:"pointer", padding:0 }}>←</button>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{editIsNew ? "New Student" : `Edit: ${editForm.name || ""}`}</div>
        </div>
        <div style={{ padding:"18px 20px 80px", display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { label:"Full Name *", field:"name" as const, placeholder:"Student's full name" },
            { label:"Age", field:"age" as const, placeholder:"e.g. 9", type:"number" },
            { label:"School / Centre", field:"school" as const, placeholder:"School or centre name" },
            { label:"Community / Locality", field:"community" as const, placeholder:"e.g. Bapunagar, Ahmedabad" },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>{label}</label>
              <input type={type || "text"} placeholder={placeholder} value={(editForm as any)[field] || ""}
                onChange={e => upd(field, e.target.value)}
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:14, boxSizing:"border-box" }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Gender</label>
            <div style={{ display:"flex", gap:8 }}>
              {["Male","Female","Other"].map(g => (
                <button key={g} onClick={() => upd("gender", g)}
                  style={{ flex:1, padding:"9px 0", borderRadius:8, border: editForm.gender === g ? "2px solid #1e5a9c" : "1px solid #cbd5e1", background: editForm.gender === g ? "#eff6ff" : "#fff", fontWeight: editForm.gender === g ? 700 : 400, color: editForm.gender === g ? "#1e5a9c" : "#475569", cursor:"pointer", fontSize:13 }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Current Grade (Enrolled) *</label>
            <select value={editForm.grade || ""} onChange={e => upd("grade", e.target.value)}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:14 }}>
              <option value="">Select grade</option>
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
            {editForm.grade && (
              <div style={{ marginTop:6, fontSize:11, color:"#3b82f6" }}>
                Subjects for {editForm.grade}: {(getGL(editForm.grade)?.subjects || []).join(", ")}
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Mother Tongue</label>
            <select value={editForm.mother_tongue || ""} onChange={e => upd("mother_tongue", e.target.value)}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:14 }}>
              <option value="">Select language</option>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>First-Generation Learner?</label>
            <div style={{ display:"flex", gap:8 }}>
              {["Yes","No","Unsure"].map(opt => (
                <button key={opt} onClick={() => upd("first_gen_learner", opt)}
                  style={{ flex:1, padding:"9px 0", borderRadius:8, border: editForm.first_gen_learner === opt ? "2px solid #1e5a9c" : "1px solid #cbd5e1", background: editForm.first_gen_learner === opt ? "#eff6ff" : "#fff", fontWeight: editForm.first_gen_learner === opt ? 700 : 400, color: editForm.first_gen_learner === opt ? "#1e5a9c" : "#475569", cursor:"pointer", fontSize:13 }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Attendance Pattern</label>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {["Regular (>80%)","Moderate (50–80%)","Irregular (<50%)"].map(opt => (
                <button key={opt} onClick={() => upd("attendance", opt)}
                  style={{ padding:"10px 14px", borderRadius:8, border: editForm.attendance === opt ? "2px solid #1e5a9c" : "1px solid #cbd5e1", background: editForm.attendance === opt ? "#eff6ff" : "#fff", fontWeight: editForm.attendance === opt ? 600 : 400, color: editForm.attendance === opt ? "#1e5a9c" : "#475569", cursor:"pointer", fontSize:13, textAlign:"left" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Special Needs / Learning Differences</label>
            <input placeholder="e.g. Dyslexia, none observed" value={editForm.special_needs || ""}
              onChange={e => upd("special_needs", e.target.value)}
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:14, boxSizing:"border-box" }} />
          </div>
          <button onClick={saveForm} style={{ marginTop:8, background:"#16a34a", color:"#fff", border:"none", borderRadius:8, padding:14, fontWeight:700, fontSize:15, cursor:"pointer" }}>
            ✓ Save Student
          </button>
        </div>
      </div>
    );
  }

  if (view === "team" && user.role === "head") {
    return <TeamScreen onBack={() => setView("home")} flash={flash} toast={toast} currentUserId={user.id} />;
  }

  return null;
}

function TeamScreen({ onBack, flash, toast, currentUserId }: {
  onBack: () => void;
  flash: (msg: string, type?: "success" | "error") => void;
  toast: { msg: string; type?: string } | null;
  currentUserId: string;
}) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap = new Map<string, AppRole>();
    (roles || []).forEach((r: any) => roleMap.set(r.user_id, r.role));
    const list: TeamMember[] = (profiles || []).map((p: any) => ({
      id: p.id, full_name: p.full_name || "(no name)", role: roleMap.get(p.id) || "intern",
    }));
    list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    setMembers(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (userId: string, newRole: AppRole) => {
    if (userId === currentUserId) { flash("You cannot change your own role.", "error"); return; }
    setSavingId(userId);
    // (user_id, role) is unique — safest path is delete then insert.
    const del = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (del.error) { flash(del.error.message, "error"); setSavingId(null); return; }
    const ins = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    if (ins.error) { flash(ins.error.message, "error"); setSavingId(null); return; }
    await load();
    setSavingId(null);
    flash("Role updated.");
  };

  const counts = useMemo(() => ({
    head: members.filter(m => m.role === "head").length,
    coordinator: members.filter(m => m.role === "coordinator").length,
    intern: members.filter(m => m.role === "intern").length,
  }), [members]);

  return (
    <div style={{ minHeight:"100vh", background:"#f0f4f8", ...F }}>
      {toast && <Toast toast={toast} />}
      <div style={{ background:"#1e5a9c", padding:"14px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#8cc63f", fontSize:22, cursor:"pointer", padding:0 }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ color:"#8cc63f", fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>Head Only</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:19 }}>Team & Roles</div>
        </div>
      </div>

      <div style={{ padding:"16px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
          {(["head","coordinator","intern"] as const).map(r => (
            <div key={r} style={{ background:"#fff", borderRadius:10, padding:"12px 14px", border:"1px solid #e2e8f0" }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#1e5a9c" }}>{counts[r]}</div>
              <div style={{ fontSize:11, color:"#64748b", marginTop:1, textTransform:"capitalize" }}>{r}s</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:11, color:"#64748b", background:"#fff", borderRadius:8, padding:"8px 12px", border:"1px solid #e2e8f0", marginBottom:14, borderLeft:"3px solid #8cc63f" }}>
          Change any member's role using the dropdown. You cannot change your own role — ask another Head to do it.
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:30, color:"#64748b", fontSize:13 }}>Loading team…</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {members.map(m => {
              const isSelf = m.id === currentUserId;
              return (
                <div key={m.id} style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e8f0", padding:"14px 16px", display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:"#1e5a9c", flexShrink:0 }}>
                    {m.full_name[0]?.toUpperCase() || "?"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:"#1e293b", fontSize:14 }}>
                      {m.full_name} {isSelf && <span style={{ color:"#8cc63f", fontSize:11, fontWeight:600 }}>(you)</span>}
                    </div>
                    <div style={{ marginTop:4 }}><RoleBadge role={m.role} /></div>
                  </div>
                  <select
                    value={m.role}
                    disabled={isSelf || savingId === m.id}
                    onChange={e => changeRole(m.id, e.target.value as AppRole)}
                    style={{ padding:"8px 10px", borderRadius:8, border:"1px solid #cbd5e1", fontSize:13, background: isSelf ? "#f1f5f9" : "#fff", cursor: isSelf ? "not-allowed" : "pointer", fontWeight:600, color:"#1e5a9c" }}>
                    <option value="head">Head</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              );
            })}
            {members.length === 0 && (
              <div style={{ textAlign:"center", padding:30, color:"#94a3b8", fontSize:13, background:"#fff", borderRadius:10, border:"1px solid #e2e8f0" }}>
                No members yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

