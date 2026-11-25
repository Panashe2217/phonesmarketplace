import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          setError("Listing not found");
        } else {
          setError(fetchError.message);
        }
      } else {
        setListing(data);
      }
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!listing) return null;

  const photoUrls = listing.photos.map(
    (path) => `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/listing-photos/${path}`
  );

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to listings</Link>
      
      <div className="detail-content">
        <div className="detail-images">
          {photoUrls.length > 0 ? (
            photoUrls.map((url, i) => (
              <img key={i} src={url} alt={`${listing.title} - photo ${i + 1}`} className="detail-img" />
            ))
          ) : (
            <div className="detail-img-placeholder">No photos</div>
          )}
        </div>

        <div className="detail-info">
          <h1>{listing.title}</h1>
          <p className="detail-price">${listing.price}</p>
          
          <div className="detail-specs">
            <p><strong>Condition:</strong> {listing.condition}</p>
            <p><strong>Brand:</strong> {listing.brand}</p>
            <p><strong>Location:</strong> {listing.location}</p>
          </div>

          <div className="detail-contact">
            <h3>Contact</h3>
            <p>{listing.contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}