# Android build

The Android app loads the game from its bundled WebView assets. It does not use
a hosted page or require a server URL at launch. The Three.js runtime and game
page are included in the web build and copied into the Android project by
Capacitor.

## Build

Install the workspace packages, then run:

```sh
pnpm --filter @workspace/3d-game run android:sync
pnpm --filter @workspace/3d-game run android:build
```

`android:sync` builds the browser game and copies its output into the native
project. `android:build` does the same and then invokes the Android Gradle
build. Building or installing the app requires a JDK and Android SDK; Android
Studio can provide both and can open the project with:

```sh
pnpm --filter @workspace/3d-game run android:open
```

Run `android:sync` before opening or building the native project, including
after changing the game page.

## Offline check

Install the generated debug app on an Android device, turn off Wi-Fi and mobile
data, open **Color Shift**, and start a run. The packaged game page and its
JavaScript are local Android assets; the browser preview continues to use
`index.html`.
