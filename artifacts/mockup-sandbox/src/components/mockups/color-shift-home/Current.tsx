import "./_group.css";

export function Current() {
  return (
    <main className="color-shift-current">
      <header className="current-topbar">
        <div className="current-brand">
          <span className="current-mark" aria-hidden="true" />
          <div>
            <strong>Color Shift</strong>
            <small>Neon Rush 3D</small>
          </div>
        </div>
        <div className="current-record">
          <span>Best score</span>
          <strong>00000</strong>
          <small>◆ Crystals 00000</small>
        </div>
      </header>
      <section className="current-overlay" aria-label="Color Shift start screen">
        <div className="current-eyebrow">A color reaction test</div>
        <h1 aria-label="Color Shift: Neon Rush 3D">
          <span className="current-title-light">Color Shift:</span>
          <span className="current-title-accent">Neon Rush 3D</span>
        </h1>
        <p className="current-intro">
          The ball cycles Red, Cyan, and Yellow automatically every 4.5 seconds.
          Steer into the lane glowing with its current color.
        </p>
        <div className="current-color-key" aria-label="Gate colors">
          <span className="current-chip"><i style={{ color: "#ff3d5e", background: "#ff3d5e" }} />Red</span>
          <span className="current-chip"><i style={{ color: "#38eaff", background: "#38eaff" }} />Cyan</span>
          <span className="current-chip"><i style={{ color: "#ffd84a", background: "#ffd84a" }} />Yellow</span>
        </div>
        <div className="current-mode-row" aria-label="Game modes">
          <button type="button">Endless Runner</button>
          <button type="button">Time Attack · 60s</button>
          <button type="button">Anti-Gravity</button>
        </div>
        <div className="current-actions">
          <button className="current-play" type="button">Start Endless Runner ↗</button>
          <button className="current-shop" type="button">Shop / Skins</button>
        </div>
        <div className="current-note">A / ← lane left · D / → lane right · color auto-cycles every 4.5s</div>
      </section>
    </main>
  );
}
