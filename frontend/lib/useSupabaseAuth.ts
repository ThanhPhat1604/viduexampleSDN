// frontend/lib/useSupabaseAuth.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}
