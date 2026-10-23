import "./_group.css";

export function Current() {
  return (
    <main className="color-shift-rewards-preview" style={{ display: "grid", placeItems: "center", padding: 20 }}>
      <section
        style={{
          width: "min(100%, 490px)",
          maxHeight: "78vh",
          overflow: "auto",
          padding: 15,
          border: "1px solid rgba(56,230,211,.28)",
          background: "rgba(7,11,19,.94)",
          boxShadow: "0 0 36px rgba(56,230,211,.1)",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ color: "#68f2df", fontSize: 9, letterSpacing: ".23em" }}>PLAYER LAB</div>
            <h1 style={{ margin: "3px 0 0", font: "850 22px/1 system-ui", letterSpacing: ".02em" }}>Choose your form</h1>
          </div>
          <div style={{ color: "#ffd36a", fontSize: 9, letterSpacing: ".1em", textAlign: "right" }}>
            CRYSTAL BALANCE<br /><strong style={{ fontSize: 15 }}>00024</strong>
          </div>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
          {[
            { name: "Sphere", shape: "50%", color: "#38e6d3", detail: "Classic neon orb · Free", action: "Equipped", active: true },
            { name: "Diamond", shape: "0", color: "#ffd25e", detail: "Cut-glass prism · 30 crystals", action: "Unlock · 30" },
            { name: "Star", shape: "0", color: "#ff58d6", detail: "Radiant 3D star · 60 crystals", action: "Unlock · 60" },
          ].map((skin) => (
            <article
              key={skin.name}
              style={{
                minWidth: 0,
                padding: "10px 8px 8px",
                border: `1px solid ${skin.active ? "rgba(56,230,211,.75)" : "rgba(233,241,246,.13)"}`,
                background: skin.active ? "rgba(22,39,43,.74)" : "rgba(14,19,29,.82)",
                textAlign: "center",
              }}
            >
              <div style={{ display: "grid", placeItems: "center", width: 45, height: 45, margin: "0 auto 8px", border: "1px solid rgba(255,255,255,.1)", borderRadius: "50%" }}>
                <div style={{ width: 24, height: 24, background: skin.color, borderRadius: skin.name === "Sphere" ? "50%" : 0, clipPath: skin.name === "Diamond" ? "polygon(50% 0,100% 50%,50% 100%,0 50%)" : skin.name === "Star" ? "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 94%,50% 73%,21% 94%,32% 57%,2% 35%,39% 35%)" : undefined, boxShadow: `0 0 15px ${skin.color}` }} />
              </div>
              <h2 style={{ margin: 0, color: "#f5f2e9", font: "800 11px system-ui", letterSpacing: ".08em", textTransform: "uppercase" }}>{skin.name}</h2>
              <p style={{ minHeight: 26, margin: "5px 0 8px", color: "#929ba8", fontSize: 7, lineHeight: 1.5 }}>{skin.detail}</p>
              <button type="button" style={{ width: "100%", minHeight: 38, border: "1px solid rgba(224,235,240,.25)", background: "rgba(8,13,20,.72)", color: "#e9f5fa", fontSize: 8, letterSpacing: ".1em" }}>{skin.action}</button>
            </article>
          ))}
        </div>
        <div style={{ margin: "17px 0 8px", color: "#a9b5c1", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase" }}>Achievements</div>
        {[
          ["Distance Master", "Reach 1,000 meters in one run. · 0 / 1,000 M THIS RUN", "IN PROGRESS"],
          ["Crystal Collector", "Collect 50 crystals across your runs. · 24 / 50 TOTAL", "IN PROGRESS"],
          ["Gate Runner", "Clear 20 gates in one run. · 0 / 20 THIS RUN", "IN PROGRESS"],
        ].map(([title, description, state]) => (
          <div key={title} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 9px", marginBottom: 6, border: "1px solid rgba(233,241,246,.1)", background: "rgba(11,15,23,.78)" }}>
            <div><strong style={{ display: "block", color: "#e9edf0", fontSize: 8, letterSpacing: ".09em" }}>{title}</strong><small style={{ display: "block", marginTop: 3, color: "#818995", fontSize: 7, lineHeight: 1.4 }}>{description}</small></div>
            <span style={{ color: "#87909b", fontSize: 7, letterSpacing: ".13em", whiteSpace: "nowrap" }}>{state}</span>
          </div>
        ))}
        <div style={{ margin: "17px 0 8px", color: "#a9b5c1", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase" }}>Daily Bounties</div>
        {[
          ["Daily Dash", "Reach 300m in one run.", "+12 ◆"],
          ["Crystal Run", "Collect 5 crystals today.", "+12 ◆"],
        ].map(([title, description, reward]) => (
          <div key={title} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 9px", marginBottom: 6, border: "1px solid rgba(233,241,246,.1)", background: "rgba(11,15,23,.78)" }}>
            <div><strong style={{ display: "block", color: "#e9edf0", fontSize: 8, letterSpacing: ".09em" }}>{title}</strong><small style={{ display: "block", marginTop: 3, color: "#818995", fontSize: 7 }}>{description}</small></div>
            <span style={{ color: "#87909b", fontSize: 7 }}>{reward}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
