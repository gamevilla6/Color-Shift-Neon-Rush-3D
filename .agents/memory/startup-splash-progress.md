---
name: Startup splash progress
description: Loading-screen progress and fade behavior for the procedural Three.js arcade game.
---

Show loading progress for concrete initialization milestones rather than pretending the game is downloading asset files. This game builds its world and collectibles procedurally, so progress should reflect renderer setup, scene/player creation, saved progression setup, and the first rendered frame.

**Why:** the game has no external 3D asset bundle to report download progress for; inaccurate loading percentages would be misleading, and fading before the first frame can reveal a blank canvas.

**How to apply:** connect progress updates to actual startup phases, wait for the first successful render and give external fonts a bounded readiness window, then animate to 100% and fade out. Keep a timeout so unavailable remote fonts do not block play.
