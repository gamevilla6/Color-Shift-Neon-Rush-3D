import { useEffect, useState } from "react";
import "./SessionSummary.css";

type RunSample = {
  score: number;
  crystals: number;
  wallet: number;
  distance: number;
  gates: number;
  streak: number;
  rank: string;
  record: boolean;
};

const recordRun: RunSample = {
  score: 2840,
  crystals: 23,
  wallet: 418,
  distance: 1260,
  gates: 31,
  streak: 9,
  rank: "VOLT PILOT",
  record: true,
};

const regularRun: RunSample = {
  score: 1735,
  crystals: 12,
  wallet: 395,
  distance: 810,
  gates: 19,
  streak: 6,
  rank: "SPARK RUNNER",
  record: false,
};

function useCountUp(target: number, key: string) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let frame = 0;
    let start = 0;
    const duration = 1050;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, key]);
  return value.toLocaleString("en-US");
}

export function SessionSummary() {
  const [record, setRecord] = useState(true);
  const [actionState, setActionState] = useState<"idle" | "retry" | "home">("idle");
  const run = record ? recordRun : regularRun;
  const score = useCountUp(run.score, record ? "record" : "regular");

  const switchSample = (isRecord: boolean) => {
    setActionState("idle");
    setRecord(isRecord);
  };

  return (
    <main className="summary-stage">
      <div className="tunnel tunnel-back" aria-hidden="true" />
      <div className="tunnel tunnel-mid" aria-hidden="true" />
      <div className="tunnel tunnel-front" aria-hidden="true" />
      <div className="tunnel-floor" aria-hidden="true" />
      <div className="stage-topline">
        <div className="game-mark"><span className="mark-icon">CS</span><span>COLOR SHIFT <b>NEON RUSH 3D</b></span></div>
        <div className="run-label"><i /> ENDLESS RUN <span>·</span> SESSION 084</div>
      </div>

      <section className={`summary-panel ${run.record ? "is-record" : "is-standard"}`} aria-live="polite">
        <div className="panel-kicker"><span className="kicker-line" /> RUN TERMINATED <span className="kicker-line" /></div>
        <h1><span>GAME</span><em>OVER</em></h1>
        <p className="subline">{run.record ? "A new signal cuts through the dark." : "The tunnel can wait. Your next run starts here."}</p>

        <div className="score-block">
          {run.record && <div className="record-ribbon"><span>✦</span> NEW PERSONAL RECORD <span>✦</span></div>}
          <div className="score-label">FINAL SCORE</div>
          <div className="score-number" aria-label={`Final score ${run.score}`}>{score}<span>PTS</span></div>
          <div className="score-rule"><i /></div>
          <div className="best-line"><span>PREVIOUS BEST</span><b>{run.record ? "2,610" : "2,840"}</b><span className="delta">{run.record ? "+230" : "BEST"}</span></div>
        </div>

        <div className="metric-grid">
          <div className="metric crystal-metric"><span className="metric-glyph">◇</span><div><strong>+{run.crystals}</strong><small>RUN CRYSTALS</small></div></div>
          <div className="metric wallet-metric"><span className="metric-glyph">◈</span><div><strong>{run.wallet}</strong><small>TOTAL WALLET</small></div></div>
          <div className="metric"><span className="metric-glyph">↗</span><div><strong>{run.distance.toLocaleString()}<small className="unit">M</small></strong><small>DISTANCE</small></div></div>
          <div className="metric"><span className="metric-glyph">▱</span><div><strong>{run.gates}<small className="unit"> / ∞</small></strong><small>GATES CLEARED</small></div></div>
        </div>

        <div className="run-foot">
          <div><span className="foot-symbol">✳</span><span><small>MAX STREAK</small><b>×{run.streak}</b></span></div>
          <div className="foot-divider" />
          <div><span className="foot-symbol rank-symbol">⬡</span><span><small>RUN RANK</small><b>{run.rank}</b></span></div>
          <span className="rank-medal">{run.record ? "A+" : "A"}</span>
        </div>

        <div className="summary-actions">
          <button className="play-button" onClick={() => setActionState("retry")} type="button">
            <span>{actionState === "retry" ? "RUN READY" : "PLAY AGAIN"}</span><b aria-hidden="true">↗</b>
          </button>
          <button className="home-button" onClick={() => setActionState("home")} type="button">
            <span className="home-icon">⌂</span>{actionState === "home" ? "RETURNING HOME" : "HOME / BACK"}
          </button>
        </div>
        <div className="action-feedback" aria-live="polite">
          {actionState === "retry" ? "NEXT RUN · TAP TO LAUNCH" : actionState === "home" ? "HOME SCREEN READY" : "TAP TO CONTINUE"}
        </div>
      </section>

      <div className="sample-switch" aria-label="Preview run result">
        <span>PREVIEW STATE</span>
        <button type="button" className={record ? "selected" : ""} onClick={() => switchSample(true)}>RECORD</button>
        <button type="button" className={!record ? "selected" : ""} onClick={() => switchSample(false)}>STANDARD</button>
      </div>
      <div className="tunnel-status"><span>NEON RUSH</span><i /> SYSTEM COOLING <span>00:04</span></div>
    </main>
  );
}
