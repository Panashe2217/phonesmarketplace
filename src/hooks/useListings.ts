import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

// Accept a search query as an argument
export function useListings(searchQuery: string = "") {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      // If there's a search query, filter by title using ILIKE (case-insensitive)
      if (searchQuery.trim()) {
        query = query.ilike("title", `%${searchQuery.trim()}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setListings(data ?? []);
      }
      setLoading(false);
    }

    fetchListings();
  }, [searchQuery]); // Re-run whenever the search query changes

  return { listings, loading, error };
}