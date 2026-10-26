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

## AdMob development testing

The Android project includes the Google Mobile Ads SDK and a Capacitor `AdMob`
bridge. It is intentionally pinned to Google's sample app ID and demo banner,
interstitial, and rewarded ad units. Browser preview has no AdMob JavaScript
SDK and stays ad-free; ad requests are made by the native Android SDK only.

Reward currency is granted in the game only after the native rewarded callback
confirms that the video earned its reward. Interstitials are requested after
every third completed solo run, with a two-minute cooldown and a short delay.
Menu and shop banners use an adaptive native banner dock above the Android
navigation inset.

Before a production release, replace all sample IDs with the app's own AdMob
IDs, add a Google UMP consent flow appropriate for the audience and region,
complete Play Console data-safety disclosures, and review the placements and
frequency limits. Google's demo ads are for development and do not generate
revenue.
