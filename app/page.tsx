export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dealer Tip Tracker</h1>
      <p style={{ marginTop: 8 }}>
        Track shifts, hours, and tips. (Phase 1: local UI; Phase 2: database)
      </p>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Shifts</h2>
        <p style={{ marginTop: 8, color: "#555" }}>
          Next: add a form to record date, hours, tips, notes.
        </p>
      </section>
    </main>
  );
}
