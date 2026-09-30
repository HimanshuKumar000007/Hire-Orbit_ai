"use client";

import { useEffect } from "react";
import { initMixpanel, identifyUser, resetMixpanel } from "@/lib/mixpanel";
import { getSupabaseClient } from "@/lib/supabase";

export function MixpanelInitializer() {
  useEffect(() => {
    // 1. Initialize Mixpanel on mount
    initMixpanel();

    // 2. Sync with Supabase Auth session
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
  }, []);

  return null;
}
