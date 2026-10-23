---
name: Overlay hit testing
description: Keep menus clickable above the fixed Three.js canvas and keep return actions reachable in long submenus.
---

The Three.js canvas is decorative; keep pointer input available to the game container and place active DOM overlays above it with pointer events enabled. Return actions inside long, independently scrolling panels must stay within the visible scrollport.

**Why:** real pointer testing found a visible Game Over button hitting the canvas and the Rewards panel’s return button positioned far below the mobile viewport.

**How to apply:** validate overlays with actual pointer/touch input and `elementFromPoint`, not only programmatic `.click()`; keep long-panel navigation sticky within the panel’s visible area.
