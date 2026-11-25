import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);

      // For now, fetch all. We'll add search filtering in Phase 7.
      const { data, error: fetchError } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setListings(data ?? []);
      }
      setLoading(false);
    }

    fetchListings();
  }, []);

  return { listings, loading, error };
}