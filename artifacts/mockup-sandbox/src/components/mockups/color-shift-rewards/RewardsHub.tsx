import { useState, type CSSProperties } from "react";
import "./_group.css";
import "./RewardsHub.css";

type Tier = "Bronze" | "Silver" | "Gold" | "Diamond";

const tierOrder: Tier[] = ["Bronze", "Silver", "Gold", "Diamond"];
const achievements = [
  { name: "Distance Runner", icon: "01", unit: "METERS RUN", value: 684, tiers: [250, 1000, 3000, 7500] },
  { name: "Crystal Collector", icon: "02", unit: "CRYSTALS BANKED", value: 128, tiers: [25, 100, 300, 800] },
  { name: "Color Master", icon: "03", unit: "COLOR GATES CLEARED", value: 42, tiers: [10, 50, 150, 400] },
  { name: "Laser Survivor", icon: "04", unit: "LASERS DODGED", value: 19, tiers: [5, 25, 75, 200] },
];

const skins = [
  { name: "Plasma Orb", kind: "orb", color: "#55f4e2", detail: "A bright core, built for the spotlight.", price: 0, owned: true },
  { name: "Cyber Shard", kind: "shard", color: "#74a7ff", detail: "Cut through the tunnel in cool blue.", price: 90, owned: true },
  { name: "Golden Sphere", kind: "gold", color: "#ffd36b", detail: "A rare gleam with a golden wake.", price: 180, owned: false },
  { name: "Void Blackhole", kind: "void", color: "#d291ff", detail: "Light bends around this dark matter.", price: 320, owned: false },
];
const trails = [
  { name: "Ion Ribbon", color: "#5af4df", price: 0, owned: true },
  { name: "Afterglow", color: "#ff62d2", price: 75, owned: false },
  { name: "Solar Flare", color: "#ffc95e", price: 140, owned: false },
];

export function RewardsHub() {
  const [balance, setBalance] = useState(246);
  const [claimed, setClaimed] = useState<string[]>(["Distance Runner-Bronze", "Crystal Collector-Bronze", "Color Master-Bronze", "Laser Survivor-Bronze"]);
  const [owned, setOwned] = useState<string[]>(["Plasma Orb", "Cyber Shard", "Ion Ribbon"]);
  const [equippedSkin, setEquippedSkin] = useState("Plasma Orb");
  const [equippedTrail, setEquippedTrail] = useState("Ion Ribbon");
  const [notice, setNotice] = useState("Your next milestone is closer than it looks.");

  const claimTier = (key: string, reward: number) => {
    if (claimed.includes(key)) return;
    setClaimed((current) => [...current, key]);
    setBalance((current) => current + reward);
    setNotice(`${reward} crystals added to your balance.`);
  };
  const buyOrEquip = (name: string, price: number) => {
    if (owned.includes(name)) {
      if (skins.some((item) => item.name === name)) setEquippedSkin(name);
      else setEquippedTrail(name);
      setNotice(`${name} equipped. Make your next run count.`);
      return;
    }
    if (balance < price) {
      setNotice(`You need ${price - balance} more crystals to unlock ${name}.`);
      return;
    }
    setBalance((current) => current - price);
    setOwned((current) => [...current, name]);
    setNotice(`${name} unlocked. Ready when you are.`);
  };

  return (
    <main className="color-shift-rewards-preview rewards-hub">
      <div className="rh-shell">
        <header className="rh-topbar">
          <a className="rh-brand" href="#rewards" aria-label="Color Shift rewards home">
            <span className="rh-brand-mark"><i /></span>
            <span>COLOR<span className="rh-brand-light">SHIFT</span></span>
          </a>
          <div className="rh-top-meta">
            <span className="rh-season"><span className="rh-live-dot" /> SEASON 04 <b>·</b> NEON FRONTIER</span>
            <div className="rh-balance" aria-live="polite"><span className="rh-crystal" /> <span>{balance.toLocaleString()}</span><small>CRYSTALS</small></div>
          </div>
        </header>

        <section className="rh-hero" id="rewards">
          <div className="rh-hero-copy">
            <div className="rh-kicker"><span /> PLAYER PROGRESSION</div>
            <h1>Make every<br /><em>run count.</em></h1>
            <p>Stack your streak. Chase the next tier. Bring your own light to the tunnel.</p>
            <div className="rh-overall">
              <div className="rh-overall-label"><span>RUNNER RANK <b>·</b> 08</span><span>1,420 / 2,000 XP</span></div>
              <div className="rh-progress"><span style={{ width: "71%" }} /></div>
              <div className="rh-next-rank">580 XP TO RANK 09 <span>+ 1 SKIN SLOT</span></div>
            </div>
          </div>
          <div className="rh-orbit-scene" aria-hidden="true">
            <div className="rh-orbit orbit-a" /><div className="rh-orbit orbit-b" /><div className="rh-orbit orbit-c" />
            <div className="rh-orb"><span /></div><div className="rh-scene-spark spark-a" /><div className="rh-scene-spark spark-b" />
            <div className="rh-run-stat"><small>BEST STREAK</small><strong>12<span>×</span></strong><i>PERSONAL BEST</i></div>
          </div>
          <div className="rh-hero-index">CS / 04 <span>REWARDS HUB</span></div>
        </section>

        <div className="rh-notice" role="status" aria-live="polite"><span className="rh-notice-mark">+</span>{notice}<span className="rh-notice-tail">LIVE UPDATE</span></div>

        <div className="rh-content-grid">
          <section className="rh-section rh-achievements">
            <div className="rh-section-heading">
              <div><div className="rh-kicker">THE LONG GAME</div><h2>Achievement track</h2></div>
              <span className="rh-section-count">04 <i>TRACKS</i></span>
            </div>
            <p className="rh-section-intro">Every milestone pays out. Keep pushing to turn a good run into a legendary one.</p>
            <div className="rh-track-list">
              {achievements.map((achievement) => {
                const currentTier = achievement.tiers.findIndex((target) => achievement.value < target);
                const activeIndex = currentTier < 0 ? 3 : currentTier;
                const activeStart = activeIndex === 0 ? 0 : achievement.tiers[activeIndex - 1];
                const target = achievement.tiers[activeIndex];
                const progress = Math.min(100, ((achievement.value - activeStart) / (target - activeStart)) * 100);
                return (
                  <article className="rh-track-card" key={achievement.name}>
                    <div className="rh-track-head">
                      <span className="rh-track-icon">{achievement.icon}</span>
                      <div className="rh-track-title"><h3>{achievement.name}</h3><small>{achievement.unit}</small></div>
                      <span className="rh-current-value">{achievement.value.toLocaleString()} <small>/ {target.toLocaleString()}</small></span>
                    </div>
                    <div className="rh-tier-line">
                      {tierOrder.map((tier, index) => {
                        const key = `${achievement.name}-${tier}`;
                        const reward = [20, 35, 60, 100][index];
                        const complete = achievement.value >= achievement.tiers[index];
                        const isClaimed = claimed.includes(key);
                        const isActive = index === activeIndex;
                        const state = isClaimed ? "Claimed" : complete ? "Claim" : "Locked";
                        return (
                          <div className={`rh-tier ${isActive ? "is-active" : ""} ${complete ? "is-complete" : ""}`} key={tier}>
                            <div className="rh-tier-top"><span className="rh-tier-dot">{complete ? <i /> : String(index + 1).padStart(2, "0")}</span><span className="rh-tier-name">{tier}</span></div>
                            <div className="rh-tier-progress"><span style={{ width: complete ? "100%" : isActive ? `${progress}%` : "0%" }} /></div>
                            <div className="rh-tier-bottom">
                              <span className="rh-tier-reward"><span className="rh-mini-crystal" />{reward}</span>
                              {complete ? (
                                <button type="button" className={`rh-claim-btn ${isClaimed ? "is-claimed" : ""}`} disabled={isClaimed} onClick={() => claimTier(key, reward)}>{state}</button>
                              ) : <span className="rh-locked">{state}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="rh-cosmetics">
            <section className="rh-section rh-skins">
              <div className="rh-section-heading">
                <div><div className="rh-kicker">YOUR SIGNATURE</div><h2>Runner skins</h2></div>
                <span className="rh-section-count">{owned.filter((item) => skins.some((skin) => skin.name === item)).length}<i> / 04</i></span>
              </div>
              <p className="rh-section-intro">Pick a form. Own the tunnel.</p>
              <div className="rh-skin-grid">
                {skins.map((skin) => {
                  const hasSkin = owned.includes(skin.name);
                  const active = equippedSkin === skin.name;
                  const affordable = balance >= skin.price;
                  const status = active ? "Equipped" : hasSkin ? "Equip" : affordable ? "Unlock" : "Locked";
                  return (
                    <article className={`rh-skin-card ${active ? "is-equipped" : ""}`} key={skin.name}>
                      <div className={`rh-skin-art art-${skin.kind}`} style={{ "--skin": skin.color } as CSSProperties}><span /></div>
                      <div className="rh-skin-meta"><h3>{skin.name}</h3><p>{skin.detail}</p></div>
                      <div className="rh-skin-foot"><span>{hasSkin ? "OWNED" : <><span className="rh-mini-crystal" />{skin.price}</>}</span>
                        <button type="button" className={`rh-equip-btn ${active ? "is-active" : ""}`} disabled={active || (!hasSkin && !affordable)} onClick={() => buyOrEquip(skin.name, skin.price)}>{status}</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rh-section rh-trails">
              <div className="rh-section-heading">
                <div><div className="rh-kicker">LEAVE A TRACE</div><h2>Glow trails</h2></div>
                <span className="rh-trail-symbol">↗</span>
              </div>
              <div className="rh-trail-list">
                {trails.map((trail) => {
                  const hasTrail = owned.includes(trail.name);
                  const active = equippedTrail === trail.name;
                  const affordable = balance >= trail.price;
                  const status = active ? "Equipped" : hasTrail ? "Equip" : affordable ? "Unlock" : "Locked";
                  return <div className={`rh-trail-row ${active ? "is-active" : ""}`} key={trail.name}>
                    <span className="rh-trail-swatch" style={{ "--trail": trail.color } as CSSProperties}><i /></span>
                    <div className="rh-trail-label"><strong>{trail.name}</strong><small>{hasTrail ? "OWNED" : `${trail.price} CRYSTALS`}</small></div>
                    <button type="button" className="rh-trail-action" disabled={active || (!hasTrail && !affordable)} onClick={() => buyOrEquip(trail.name, trail.price)}>{status}</button>
                  </div>;
                })}
              </div>
            </section>
          </aside>
        </div>
        <footer className="rh-footer"><span>COLOR SHIFT <i>•</i> PLAYER RECORD</span><span>THE NEXT RUN IS YOURS <b>↗</b></span></footer>
      </div>
    </main>
  );
}
