---
name: Share reward verification
description: Limits on verifying Web Share API results and external-app share intents for client-side rewards.
---

For share-gated rewards, grant after the native share API resolves or after the fallback successfully copies the share text and launches the selected share intent. Do not claim that an external message was actually sent.

**Why:** Browsers do not report whether a user completes sending content after switching to WhatsApp or another external app.

**How to apply:** Keep rewards user-initiated and one-time, persist the claim locally, and phrase fallback success as share setup/intent launch rather than verified delivery.
