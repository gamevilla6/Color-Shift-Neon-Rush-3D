---
name: Overlay hit testing
description: Keep menus clickable above the fixed Three.js canvas and keep return actions reachable in long submenus.
---

The Three.js canvas is decorative; keep pointer input available to the game container and place active DOM overlays above it with pointer events enabled. For long responsive panels, keep content in its own scroll region and place navigation in a separate persistent footer. Mobile modal scrolling also needs `pan-y` allowed on the document/game shell and global game swipe handlers must ignore modal scroll targets.

**Why:** real pointer/touch testing found a visible Game Over button hitting the canvas, a long Rewards panel whose return action could be pushed out of view, and global `touchmove.preventDefault()` blocking the panel's native scroll.

**How to apply:** validate overlays with actual pointer/touch input and `elementFromPoint`, not only programmatic `.click()`. Check portrait and landscape separately; use a dedicated scroll region plus a fixed footer for long panels, allow vertical native scrolling, ignore modal targets in global gesture handlers, and verify the entry action beneath is reachable in short landscape viewports.
