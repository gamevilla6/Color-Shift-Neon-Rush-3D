---
name: Achievement notice lifecycle
description: Prevent transient achievement banners from resurfacing over results or the home screen after a state transition.
---

When leaving a run or entering Game Over, clear the queued achievement notices and invalidate pending animation-frame and timeout callbacks. Clearing timeouts alone does not cancel an animation-frame callback that is already queued.

**Why:** a run can unlock an achievement in the same frame as a collision; its delayed banner can appear over the result card even after the timer is cleared.

**How to apply:** bump a notice token on Game Over and return-to-menu, hide the banner, clear the queue, and guard both the queue entry point and delayed callbacks against stale tokens or terminal game state.
