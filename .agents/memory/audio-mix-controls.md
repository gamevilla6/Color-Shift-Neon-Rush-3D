---
name: Audio mix controls
description: Keep the global audio mute independent from sound-effect and ambient-synth preferences.
---

The menu and gameplay audio toggle is a master mute. It must not overwrite the user's separate SFX and ambient-synth choices; unmuting should restore those channel settings.

**Why:** players need one quick mute-all control while retaining the more detailed audio mix they configured in Settings.

**How to apply:** route generated sounds through the master output control, persist master mute separately, and keep SFX and ambient preferences independently editable.
