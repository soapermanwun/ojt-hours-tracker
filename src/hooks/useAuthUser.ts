import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function useAuthUser() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function getAuthUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setError(error);
        return;
      }

      setUser(user);
      setUserLoading(false);
    }

    getAuthUser();
  }, []);

  return { user, userLoading, error };
}
