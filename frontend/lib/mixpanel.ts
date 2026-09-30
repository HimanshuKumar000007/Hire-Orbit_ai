import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "9043ec1abb05dae685d047792675d53c";

let isInitialized = false;

export function initMixpanel() {
  if (typeof window === "undefined" || isInitialized) return;

  if (MIXPANEL_TOKEN) {
    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        autotrack: false,
        track_pageview: true,
        persistence: "localStorage",
        ignore_dnt: false,
      });
      isInitialized = true;
    } catch (err) {
      console.error("[Mixpanel] Initialization error:", err);
    }
  }
}

export function trackEvent(eventName: string, properties: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  if (!isInitialized) {
    initMixpanel();
  }

  try {
    mixpanel.track(eventName, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  } catch (err) {
    console.error(`[Mixpanel] Track error for ${eventName}:`, err);
  }
}

export function identifyUser(userId: string, traits: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  if (!isInitialized) {
    initMixpanel();
  }

  try {
    mixpanel.identify(userId);
    if (traits && Object.keys(traits).length > 0) {
      mixpanel.people.set(traits);
    }
  } catch (err) {
    console.error("[Mixpanel] Identify error:", err);
  }
}

export function resetMixpanel() {
  if (typeof window === "undefined") return;
  try {
    mixpanel.reset();
  } catch (err) {
    console.error("[Mixpanel] Reset error:", err);
  }
}

export { mixpanel };
