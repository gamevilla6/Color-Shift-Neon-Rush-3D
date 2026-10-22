import { useState } from "react";
import "./ArcadeHome.css";

type Screen = "home" | "shop" | "settings" | "run";
type Mode = "Endless Runner" | "Time Attack · 60s" | "Anti-Gravity";

const modes: Mode[] = ["Endless Runner", "Time Attack · 60s", "Anti-Gravity"];

function CrystalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 8 7-8 13L4 9l8-7Z" />
      <path d="m4 9 8 2 8-2M12 2v9m0 0-5 7" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4Zm10 2h4v2a4 4 0 0 1-4 4M7 6H3v2a4 4 0 0 0 4 4" />
    </svg>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
      {muted ? <path d="m17 9 5 6m0-6-5 6" /> : <path d="M16 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" />}
    </svg>
  );
}

export function ArcadeHome() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<Mode>(modes[0]);
  const [soundOn, setSoundOn] = useState(true);
  const [skin, setSkin] = useState("PRISM");

  return (
    <main className="arcade-home">
      <div className="arcade-grid" aria-hidden="true" />
      <div className="arcade-orbit arcade-orbit-a" aria-hidden="true" />
      <div className="arcade-orbit arcade-orbit-b" aria-hidden="true" />
      <div className="arcade-dust" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>

      <header className="arcade-topbar">
        <div className="arcade-brand">
          <span className="arcade-brand-mark" aria-hidden="true"><i /></span>
          <span><strong>COLOR SHIFT</strong><small>NEON RUSH 3D</small></span>
        </div>
        <div className="arcade-records" aria-label="Saved game stats">
          <div className="arcade-stat">
            <span className="arcade-stat-icon"><TrophyIcon /></span>
            <span className="arcade-stat-copy"><small>BEST SCORE</small><strong>00000</strong></span>
          </div>
          <div className="arcade-stat arcade-crystals">
            <span className="arcade-stat-icon"><CrystalIcon /></span>
            <span className="arcade-stat-copy"><small>NEON CRYSTALS</small><strong>00000</strong></span>
          </div>
        </div>
      </header>

      <section className={`arcade-stage arcade-stage-${screen}`} key={screen}>
        {screen === "home" && (
          <>
            <div className="arcade-kicker"><span /> READY WHEN YOU ARE <span /></div>
            <h1 className="arcade-title" aria-label="Color Shift: Neon Rush 3D">
              <span className="arcade-title-main">COLOR SHIFT<span className="arcade-colon">:</span></span>
              <span className="arcade-title-sub">NEON RUSH 3D</span>
            </h1>
            <div className="arcade-subline"><span className="arcade-subline-dash" /> ONE MORE RUN <span className="arcade-subline-dash" /></div>

            <div className="arcade-crystal-ribbon" aria-label="Red, Cyan, Yellow">
              <span><i className="dot-red" />RED</span>
              <b />
              <span><i className="dot-cyan" />CYAN</span>
              <b />
              <span><i className="dot-yellow" />YELLOW</span>
            </div>

            <div className="arcade-mode-heading"><span>01</span><strong>CHOOSE YOUR RUN</strong><i /></div>
            <div className="arcade-modes" role="group" aria-label="Choose game mode">
              {modes.map((item, index) => (
                <button key={item} type="button" className={`arcade-mode ${mode === item ? "is-selected" : ""}`} aria-pressed={mode === item} onClick={() => setMode(item)}>
                  <span className="arcade-mode-index">0{index + 1}</span>
                  <span>{item}</span>
                  <span className="arcade-mode-check" aria-hidden="true">{mode === item ? "—" : "+"}</span>
                </button>
              ))}
            </div>

            <button className="arcade-play" type="button" onClick={() => setScreen("run")}>
              <span className="arcade-play-ring" aria-hidden="true"><i /></span>
              <span className="arcade-play-copy"><strong>TAP TO PLAY</strong><small>{mode.toUpperCase()}</small></span>
              <span className="arcade-play-arrow" aria-hidden="true">↗</span>
            </button>

            <div className="arcade-secondary-actions">
              <button type="button" onClick={() => setScreen("shop")}><svg className="arcade-action-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v16M2 10h16M4.3 4.3l11.4 11.4m0-11.4L4.3 15.7" /></svg> SHOP / SKINS <span className="arcade-action-arrow">↗</span></button>
              <button type="button" onClick={() => setScreen("settings")}><svg className="arcade-action-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M8 2h4l.6 2.1 1.6.9 2-.7 2 3.4-1.5 1.6v1.8l1.5 1.6-2 3.4-2-.7-1.6.9L12 18H8l-.6-2.1-1.6-.9-2 .7-2-3.4 1.5-1.6v-1.8L1.8 7.3l2-3.4 2 .7 1.6-.9L8 2Z" /><circle cx="10" cy="10" r="2.5" /></svg> SETTINGS <span className="arcade-action-arrow">↗</span></button>
            </div>
            <div className="arcade-controls"><span className="arcade-controls-key">A / ←</span> LANE LEFT <i /> <span className="arcade-controls-key">D / →</span> LANE RIGHT</div>
            <div className="arcade-cycle-note">COLOR AUTO-CYCLES EVERY <b>4.5s</b></div>
          </>
        )}

        {screen === "settings" && (
          <div className="arcade-panel">
            <div className="arcade-panel-kicker">PLAYER CONFIGURATION / 01</div>
            <h2>SETTINGS<span>.</span></h2>
            <p className="arcade-panel-intro">Tune the signal. Then get back in the flow.</p>
            <div className="arcade-setting-row">
              <div><small>AUDIO OUTPUT</small><strong>Game sound</strong></div>
              <button type="button" className={`arcade-switch ${soundOn ? "on" : ""}`} aria-label={soundOn ? "Turn sound off" : "Turn sound on"} aria-pressed={soundOn} onClick={() => setSoundOn(!soundOn)}><span /><b>{soundOn ? "ON" : "OFF"}</b></button>
            </div>
            <div className="arcade-help">
              <div className="arcade-help-title"><span>02</span><strong>CONTROLS</strong></div>
              <div className="arcade-help-row"><span className="arcade-keycap">A</span><span className="arcade-keycap">←</span><b>SHIFT LEFT</b></div>
              <div className="arcade-help-row"><span className="arcade-keycap">D</span><span className="arcade-keycap">→</span><b>SHIFT RIGHT</b></div>
              <p>On touch screens, swipe to change lanes. Your color cycles automatically every 4.5 seconds.</p>
            </div>
            <button className="arcade-back" type="button" onClick={() => setScreen("home")}>← <span>BACK TO HOME</span></button>
          </div>
        )}

        {screen === "shop" && (
          <div className="arcade-panel arcade-shop-panel">
            <div className="arcade-panel-kicker">NEON GARAGE / 02</div>
            <h2>SKIN LAB<span>.</span></h2>
            <p className="arcade-panel-intro">Your run. Your spectrum.</p>
            <div className="arcade-skin-preview"><div className={`arcade-skin-orb skin-${skin.toLowerCase()}`}><i /></div><div><small>ACTIVE COLORWAY</small><strong>{skin}</strong></div><span className="arcade-skin-count">01 / 03</span></div>
            <div className="arcade-skin-list">
              {["PRISM", "VOLT", "PULSE"].map((name, index) => <button key={name} type="button" onClick={() => setSkin(name)} className={`arcade-swatch ${skin === name ? "active" : ""}`} aria-label={`Select ${name} skin`} aria-pressed={skin === name}><i className={`skin-dot skin-dot-${index}`} /><span>{name}</span><small>{index === 0 ? "EQUIPPED" : `${240 + index * 120} CR`}</small></button>)}
            </div>
            <button className="arcade-back" type="button" onClick={() => setScreen("home")}>← <span>BACK TO HOME</span></button>
          </div>
        )}

        {screen === "run" && (
          <div className="arcade-panel arcade-run-panel">
            <div className="arcade-panel-kicker">RUN READY / {mode.toUpperCase()}</div>
            <div className="arcade-run-visual" aria-hidden="true"><span /><i /><b /></div>
            <h2>LIGHT IT UP<span>.</span></h2>
            <p className="arcade-panel-intro">Your {mode} is queued. Match the lane. Chase the glow.</p>
            <div className="arcade-run-status"><i /> READY TO LAUNCH</div>
            <button className="arcade-back" type="button" onClick={() => setScreen("home")}>← <span>BACK TO HOME</span></button>
          </div>
        )}
      </section>
      <footer className="arcade-footer"><span>CS<span className="arcade-footer-dot">/</span>NR3</span><span>NEON RUSH DIVISION <i /> BUILD 01.04</span><button type="button" onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? "Mute sound" : "Enable sound"} aria-pressed={soundOn}><SoundIcon muted={!soundOn} /></button></footer>
    </main>
  );
}
