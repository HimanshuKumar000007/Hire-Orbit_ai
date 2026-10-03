"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  initMixpanel,
  identifyUser,
  resetMixpanel,
  captureAndRegisterUTMs,
} from "@/lib/mixpanel";
import { getSupabaseClient } from "@/lib/supabase";

export function MixpanelInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initialize Mixpanel
    initMixpanel();

    // 2. Capture and register UTM parameters & first-touch attribution
    captureAndRegisterUTMs();

    // 3. Sync with Supabase Auth session
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        identifyUser(session.user.id, {
          $email: session.user.email,
          email: session.user.email,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        identifyUser(session.user.id, {
          $email: session.user.email,
          email: session.user.email,
        });
      } else if (event === "SIGNED_OUT") {
        resetMixpanel();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  return null;
}
