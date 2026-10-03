import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "9043ec1abb05dae685d047792675d53c";

let isInitialized = false;

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  [key: string]: string | undefined;
}

export function initMixpanel() {
  if (typeof window === "undefined" || isInitialized) return;

  if (MIXPANEL_TOKEN) {
    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        autotrack: false,
        track_pageview: true,
        persistence: "localStorage",
        ignore_dnt: false,
        stop_utm_persistence: true, // Recommended by Mixpanel for custom attribution control
      });
      isInitialized = true;
    } catch (err) {
      console.error("[Mixpanel] Initialization error:", err);
    }
  }
}

/**
 * Extracts UTM parameters from the current URL query string.
 */
export function getUTMParameters(): UTMParams {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const utms: UTMParams = {};

  const UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const;

  UTM_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      utms[key] = value;
    }
  });

  return utms;
}

/**
 * Captures UTM parameters from current URL:
 * 1. Registers them as Mixpanel Super Properties (included in all subsequent events).
 * 2. Saves first-touch attribution to localStorage for user profile synchronization.
 */
export function captureAndRegisterUTMs() {
  if (typeof window === "undefined") return;

  if (!isInitialized) {
    initMixpanel();
  }

  const currentUTMs = getUTMParameters();
  const hasUTMs = Object.keys(currentUTMs).length > 0;

  // 1. Register as Super Properties for event tracking in this session
  if (hasUTMs) {
    try {
      mixpanel.register(currentUTMs);
    } catch (err) {
      console.error("[Mixpanel] Register UTMs error:", err);
    }
  }

  // 2. Persist First-Touch Attribution in localStorage if not already recorded
  try {
    const existingInitial = localStorage.getItem("hireorbit_initial_utms");
    if (!existingInitial) {
      const initialData: Record<string, any> = {
        initial_referrer: document.referrer || "$direct",
        initial_landing_page: window.location.pathname,
        initial_timestamp: new Date().toISOString(),
      };

      if (document.referrer) {
        try {
          initialData["initial_referring_domain"] = new URL(document.referrer).hostname;
        } catch {
          // invalid referrer URL fallback
        }
      }

      if (hasUTMs) {
        Object.entries(currentUTMs).forEach(([key, value]) => {
          if (value) {
            initialData[`initial_${key}`] = value;
          }
        });
      }

      localStorage.setItem("hireorbit_initial_utms", JSON.stringify(initialData));
    }
  } catch (err) {
    console.error("[Mixpanel] First-touch storage error:", err);
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

/**
 * Identifies a user in Mixpanel and binds:
 * - Provided profile traits
 * - First-touch attribution properties via people.set_once()
 * - Last-touch UTM properties via people.set() if present in current session
 */
export function identifyUser(userId: string, traits: Record<string, any> = {}) {
  if (typeof window === "undefined") return;
  if (!isInitialized) {
    initMixpanel();
  }

  try {
    mixpanel.identify(userId);

    // 1. Set First-Touch attribution properties (set_once never overwrites original source)
    try {
      const storedInitial = localStorage.getItem("hireorbit_initial_utms");
      if (storedInitial) {
        const parsedInitial = JSON.parse(storedInitial);
        mixpanel.people.set_once(parsedInitial);
      }
    } catch (e) {
      console.error("[Mixpanel] Error applying set_once initial UTMs:", e);
    }

    // 2. Set Last-Touch attribution properties for current session
    const currentUTMs = getUTMParameters();
    if (Object.keys(currentUTMs).length > 0) {
      const lastTouchData: Record<string, any> = {
        last_touch_timestamp: new Date().toISOString(),
      };
      Object.entries(currentUTMs).forEach(([k, v]) => {
        if (v) {
          lastTouchData[`last_${k}`] = v;
        }
      });
      mixpanel.people.set(lastTouchData);
    }

    // 3. Set standard profile traits
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
