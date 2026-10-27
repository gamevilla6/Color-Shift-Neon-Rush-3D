---
name: Android build prerequisites
description: Android Gradle builds in this workspace require a configured Android SDK in addition to Java.
---

Capacitor web asset sync can complete successfully while the Android Gradle build remains blocked if the workspace has no Android SDK configured. Java availability alone is not enough.

**Why:** Android SDK absence is an environment prerequisite, not a source-code failure; distinguish it from Gradle compilation errors.

**How to apply:** Before diagnosing Android source changes, check `ANDROID_HOME` or `android/local.properties` and verify the SDK exists. Report a missing SDK plainly rather than claiming the native build passed.
