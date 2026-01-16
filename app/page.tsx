"use client";

import { useMemo, useState } from "react";
import type { Shift } from "./lib/shifts";
import { calcTotals } from "./lib/shifts";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function Home() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [hours, setHours] = useState<string>("8");
  const [tips, setTips] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");

  const totals = useMemo(() => calcTotals(shifts), [shifts]);

  function addShift(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const h = Number(hours);
    const t = Number(tips);

    if (!date) return setError("Date is required.");
    if (!Number.isFinite(h) || h <= 0) return setError("Hours must be a number greater than 0.");
    if (!Number.isFinite(t) || t < 0) return setError("Tips must be a number 0 or greater.");

    const newShift: Shift = {
      id: crypto.randomUUID(),
      date,
      hours: h,
      tips: t,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    setShifts((prev) => [newShift, ...prev]);
    setTips("0");
    setNotes("");
  }

  function removeShift(id: string) {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 750 }}>Dealer Tip Tracker</h1>
      <p style={{ marginTop: 8, color: "#444" }}>
        Phase 1: local-only (no database). Next we’ll persist data.
      </p>

      <section style={{ marginTop: 18, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 650 }}>Add shift</h2>

        <form onSubmit={addShift} style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label>Date</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label>Hours</label>
              <input
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 7.5"
                style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label>Tips ($)</label>
              <input
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 320"
                style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Notes (optional)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. slow day / tournament / short shift"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>

          {error ? <p style={{ color: "crimson", margin: 0 }}>{error}</p> : null}

          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              fontWeight: 650,
              width: "fit-content",
            }}
          >
            Add shift
          </button>
        </form>
      </section>

      <section style={{ marginTop: 18, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 650 }}>Totals</h2>
        <div style={{ marginTop: 10, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div><strong>Total tips:</strong> {money(totals.totalTips)}</div>
          <div><strong>Total hours:</strong> {totals.totalHours.toFixed(2)}</div>
          <div><strong>Tips/hour:</strong> {money(totals.hourly)}</div>
        </div>
      </section>

      <section style={{ marginTop: 18, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 650 }}>Shifts</h2>

        {shifts.length === 0 ? (
          <p style={{ marginTop: 10, color: "#555" }}>No shifts yet. Add your first one above.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Date</th>
                  <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>Hours</th>
                  <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>Tips</th>
                  <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Notes</th>
                  <th style={{ padding: 8, borderBottom: "1px solid #eee" }} />
                </tr>
              </thead>
              <tbody>
                {shifts.map((s) => (
                  <tr key={s.id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{s.date}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3", textAlign: "right" }}>
                      {s.hours.toFixed(2)}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3", textAlign: "right" }}>
                      {money(s.tips)}
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>{s.notes ?? ""}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3", textAlign: "right" }}>
                      <button
                        onClick={() => removeShift(s.id)}
                        style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ccc" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
