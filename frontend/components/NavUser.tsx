// frontend/app/recipes/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) router.replace("/auth/login");
      else setChecking(false);
    };
    check();
    return () => { mounted = false; };
  }, [router]);

  if (checking) return <div className="p-6">Checking auth...</div>;
  return <>{children}</>;
}
