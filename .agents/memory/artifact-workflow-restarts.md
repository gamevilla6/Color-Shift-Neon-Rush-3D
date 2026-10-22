---
name: Artifact workflow restarts
description: Handling a Vite port conflict after a managed artifact workflow restart.
---

When the managed game workflow fails with an address-in-use error, an earlier Vite process may still be serving the app on the assigned port even though the workflow reports failure. Verify the listener and response before retrying; stop only the confirmed orphaned process, then restart the managed artifact workflow.

**Why:** A restart attempt in this workspace left the existing Vite child listening while the new workflow invocation failed to bind the same port.

**How to apply:** Check the workflow log, port listener, and HTTP response before retrying a failed artifact workflow restart.
