package com.colorshift.neonrush;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Build;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.widget.FrameLayout;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

import org.json.JSONObject;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Capacitor bridge for development-only Google Mobile Ads test inventory.
 * All ad unit IDs are Google's public demo IDs; rewards are resolved only from
 * the native earned-reward callback.
 */
@CapacitorPlugin(name = "AdMob")
public class AdMobPlugin extends Plugin {
    private static final String TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
    private static final String TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";
    private static final String TEST_REWARDED_ID = "ca-app-pub-3940256099942544/5224354917";

    private volatile boolean initialized = false;
    private volatile boolean initializationStarted = false;
    private volatile boolean bannerRequested = false;
    private volatile boolean bannerLoaded = false;
    private volatile boolean bannerLoadStarted = false;
    private volatile boolean interstitialLoading = false;
    private AdView bannerView;
    private InterstitialAd interstitialAd;

    @PluginMethod
    public void initialize(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            resolveState(call, "initialized", false, "Android activity is unavailable.");
            return;
        }
        activity.runOnUiThread(() -> {
            if (initialized) {
                resolveState(call, "initialized", true, "Google Mobile Ads test mode is ready.");
                if (bannerRequested) showBannerOnUiThread();
                return;
            }
            if (initializationStarted) {
                resolveState(call, "initialized", false, "Google Mobile Ads initialization is already running.");
                return;
            }
            initializationStarted = true;
            try {
                MobileAds.initialize(activity, status -> {
                    initialized = true;
                    resolveState(call, "initialized", true, "Google Mobile Ads initialized with test units.");
                    preloadInterstitial();
                    if (bannerRequested) showBannerOnUiThread();
                });
            } catch (Exception error) {
                initializationStarted = false;
                resolveState(call, "initialized", false, "Ad SDK initialization failed.");
                emitBannerState("banner-failed", "Ad SDK unavailable; the game remains playable.");
            }
        });
    }

    @PluginMethod
    public void setBannerAd(PluginCall call) {
        String placement = call.getData().optString("placement", "hidden");
        boolean visible = call.getData().optBoolean("visible", "showBanner".equals(call.getString("action")));
        boolean allowedPlacement = "menu".equals(placement) || "shop".equals(placement);
        bannerRequested = visible && allowedPlacement && hasNetwork();
        Activity activity = getActivity();
        if (activity == null) {
            bannerRequested = false;
            hideBannerOnUiThread();
            resolveState(call, "displayed", false, "Banner unavailable.");
            return;
        }
        activity.runOnUiThread(() -> {
            if (!bannerRequested) {
                hideBannerOnUiThread();
                resolveState(call, "displayed", false, "Banner hidden or offline.");
            } else if (initialized) {
                showBannerOnUiThread();
                resolveState(call, "displayed", true, "Test banner request sent.");
            } else {
                resolveState(call, "displayed", false, "Waiting for ad SDK initialization.");
            }
        });
    }

    @PluginMethod
    public void showRewardedAd(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null || !initialized || !hasNetwork()) {
            resolveReward(call, false, "Rewarded test ad unavailable. No crystals were added.");
            return;
        }
        call.setKeepAlive(true);
        AtomicBoolean completed = new AtomicBoolean(false);
        activity.runOnUiThread(() -> {
            try {
                RewardedAd.load(activity, TEST_REWARDED_ID, new AdRequest.Builder().build(), new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(RewardedAd ad) {
                        ad.setFullScreenContentCallback(new FullScreenContentCallback() {
                            @Override
                            public void onAdDismissedFullScreenContent() {
                                finishReward(call, completed, false, "Video closed before a reward was earned.");
                            }

                            @Override
                            public void onAdFailedToShowFullScreenContent(AdError error) {
                                finishReward(call, completed, false, "Video could not be shown. No crystals were added.");
                            }
                        });
                        try {
                            ad.show(activity, rewardItem ->
                                finishReward(call, completed, true, "Reward confirmed by Google Mobile Ads.")
                            );
                        } catch (Exception error) {
                            finishReward(call, completed, false, "Video could not be shown. No crystals were added.");
                        }
                    }

                    @Override
                    public void onAdFailedToLoad(LoadAdError error) {
                        finishReward(call, completed, false, "No test video is available right now.");
                    }
                });
            } catch (Exception error) {
                finishReward(call, completed, false, "Rewarded ad unavailable. No crystals were added.");
            }
        });
    }

    @PluginMethod
    public void showInterstitialAd(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null || !initialized || !hasNetwork()) {
            resolveState(call, "shown", false, "Interstitial test ad unavailable.");
            return;
        }
        call.setKeepAlive(true);
        activity.runOnUiThread(() -> {
            if (interstitialAd == null) {
                preloadInterstitial();
                call.setKeepAlive(false);
                resolveState(call, "shown", false, "Interstitial is not ready; continue playing.");
                return;
            }
            InterstitialAd ad = interstitialAd;
            interstitialAd = null;
            AtomicBoolean completed = new AtomicBoolean(false);
            ad.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdDismissedFullScreenContent() {
                    finishInterstitial(call, completed, true, "Interstitial closed.");
                    preloadInterstitial();
                }

                @Override
                public void onAdFailedToShowFullScreenContent(AdError error) {
                    finishInterstitial(call, completed, false, "Interstitial could not be shown.");
                    preloadInterstitial();
                }
            });
            try {
                ad.show(activity);
            } catch (Exception error) {
                finishInterstitial(call, completed, false, "Interstitial could not be shown.");
                preloadInterstitial();
            }
        });
    }

    private void showBannerOnUiThread() {
        Activity activity = getActivity();
        if (activity == null || !initialized || !bannerRequested || !hasNetwork()) return;
        View content = activity.findViewById(android.R.id.content);
        if (!(content instanceof FrameLayout)) {
            emitBannerState("banner-failed", "Native banner container is unavailable.");
            return;
        }
        FrameLayout root = (FrameLayout) content;
        int widthDp = Math.max(1, Math.round(root.getResources().getDisplayMetrics().widthPixels /
            root.getResources().getDisplayMetrics().density));
        AdSize adaptiveSize = AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, widthDp);

        if (bannerView == null) {
            bannerView = new AdView(activity);
            bannerView.setAdUnitId(TEST_BANNER_ID);
            bannerView.setAdListener(new AdListener() {
                @Override
                public void onAdLoaded() {
                    bannerLoaded = true;
                    emitBannerState("banner-loaded", "Official Google test banner · " + activePlacementDescription());
                }

                @Override
                public void onAdFailedToLoad(LoadAdError error) {
                    bannerLoaded = false;
                    bannerLoadStarted = false;
                    bannerRequested = false;
                    hideBannerOnUiThread();
                    emitBannerState("banner-failed", "Test banner unavailable; gameplay is unaffected.");
                }
            });
        }
        bannerView.setAdSize(adaptiveSize);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            adaptiveSize.getHeightInPixels(activity),
            Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
        );
        params.bottomMargin = getNavigationBarInset(root);
        if (bannerView.getParent() != root) {
            if (bannerView.getParent() instanceof ViewGroup) {
                ((ViewGroup) bannerView.getParent()).removeView(bannerView);
            }
            root.addView(bannerView, params);
        } else {
            bannerView.setLayoutParams(params);
        }
        bannerView.setElevation(20f);
        bannerView.setVisibility(View.VISIBLE);
        root.bringChildToFront(bannerView);
        if (!bannerLoadStarted) {
            bannerLoadStarted = true;
            bannerView.loadAd(new AdRequest.Builder().build());
        } else if (bannerLoaded) {
            bannerView.resume();
        }
    }

    private String activePlacementDescription() {
        return bannerRequested ? "menu/shop placement" : "ready";
    }

    private void hideBannerOnUiThread() {
        Activity activity = getActivity();
        if (activity == null) return;
        activity.runOnUiThread(() -> {
            if (bannerView != null) {
                bannerView.setVisibility(View.GONE);
                bannerView.pause();
            }
        });
    }

    private void preloadInterstitial() {
        Activity activity = getActivity();
        if (activity == null || !initialized || interstitialLoading || interstitialAd != null || !hasNetwork()) return;
        activity.runOnUiThread(() -> {
            if (interstitialLoading || interstitialAd != null || !hasNetwork()) return;
            interstitialLoading = true;
            try {
                InterstitialAd.load(activity, TEST_INTERSTITIAL_ID, new AdRequest.Builder().build(), new InterstitialAdLoadCallback() {
                    @Override
                    public void onAdLoaded(InterstitialAd ad) {
                        interstitialLoading = false;
                        interstitialAd = ad;
                    }

                    @Override
                    public void onAdFailedToLoad(LoadAdError error) {
                        interstitialLoading = false;
                        interstitialAd = null;
                    }
                });
            } catch (Exception error) {
                interstitialLoading = false;
                interstitialAd = null;
            }
        });
    }

    private boolean hasNetwork() {
        try {
            ConnectivityManager manager = (ConnectivityManager) getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
            if (manager == null) return false;
            Network network = manager.getActiveNetwork();
            if (network == null) return false;
            NetworkCapabilities capabilities = manager.getNetworkCapabilities(network);
            return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception error) {
            return false;
        }
    }

    private int getNavigationBarInset(View root) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsets insets = root.getRootWindowInsets();
            if (insets != null) return insets.getInsets(WindowInsets.Type.navigationBars()).bottom;
        }
        int resource = root.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        return resource > 0 ? root.getResources().getDimensionPixelSize(resource) : 0;
    }

    private void emitBannerState(String event, String message) {
        try {
            if (getBridge() == null || getBridge().getWebView() == null) return;
            String script = "window.ColorShiftAdMobEvent && window.ColorShiftAdMobEvent(" +
                JSONObject.quote(event) + "," + JSONObject.quote(message) + ");";
            getBridge().getWebView().post(() -> getBridge().getWebView().evaluateJavascript(script, null));
        } catch (Exception ignored) {}
    }

    private void resolveReward(PluginCall call, boolean earned, String message) {
        JSObject result = new JSObject();
        result.put("earned", earned);
        result.put("message", message);
        result.put("testMode", true);
        call.resolve(result);
    }

    private void finishReward(PluginCall call, AtomicBoolean completed, boolean earned, String message) {
        if (!completed.compareAndSet(false, true)) return;
        call.setKeepAlive(false);
        resolveReward(call, earned, message);
    }

    private void finishInterstitial(PluginCall call, AtomicBoolean completed, boolean shown, String message) {
        if (!completed.compareAndSet(false, true)) return;
        call.setKeepAlive(false);
        resolveState(call, "shown", shown, message);
    }

    private void resolveState(PluginCall call, String key, boolean value, String message) {
        JSObject result = new JSObject();
        result.put(key, value);
        result.put("message", message);
        result.put("testMode", true);
        call.resolve(result);
    }
}
