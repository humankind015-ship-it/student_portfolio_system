import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "head" | "coordinator" | "intern";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
} | null;

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const u = authData.user;
      if (!u) {
        if (!cancelled) { setUser(null); setLoading(false); }
        return;
      }
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", u.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.id),
      ]);
      if (cancelled) return;
      const role: AppRole = (roles?.[0]?.role as AppRole) || "intern";
      setUser({
        id: u.id,
        email: u.email || "",
        name: profile?.full_name || u.email || "User",
        role,
      });
      setLoading(false);
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return { user, loading };
}

export const canEdit = (role?: AppRole) => role === "head" || role === "coordinator";
export const canDelete = (role?: AppRole) => role === "head";
