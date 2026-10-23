import './_group.css';

export function Current() {
  return (
    <main className="game-over-current-preview">
      <section className="current-summary-card">
        <div className="current-eyebrow">Run complete</div>
        <h1 aria-label="Gate missed">
          <span>Gate</span>
          <span>missed</span>
        </h1>
        <p className="current-intro">
          The tunnel keeps moving. Find your rhythm and take another run.
        </p>
        <div id="results">
          <div className="game-over-brand">
            Color Shift:
            <span>Neon Rush 3D</span>
          </div>
          <div className="result-line">Endless · Run summary</div>
          <div className="result-grid">
            <div className="result-cell"><strong>1,560</strong><span>Current score</span></div>
            <div className="result-cell"><strong>1,560</strong><span>Best score</span></div>
            <div className="result-cell"><strong>18</strong><span>Gates cleared</span></div>
            <div className="result-cell"><strong>720m</strong><span>Distance</span></div>
            <div className="result-cell"><strong>×6</strong><span>Max streak</span></div>
            <div className="result-cell"><strong>15</strong><span>Crystals gathered</span></div>
            <div className="result-cell rank-cell"><strong>Spark Runner</strong><span>Player rank</span></div>
          </div>
          <div className="best-callout">New personal best</div>
          <div className="mystery-reward">
            <span className="crate-icon" aria-hidden="true">?</span>
            <span><strong>Mystery crate opened</strong><span>+25 crystals</span></span>
          </div>
        </div>
        <div className="current-actions">
          <button className="current-primary" type="button">Run again ↗</button>
        </div>
      </section>
    </main>
  );
}
