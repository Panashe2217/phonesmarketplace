import { Link } from "react-router";
import type { Database } from "../lib/database.types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];

export function ListingCard({ listing }: { listing: Listing }) {
  // If there's a photo, get its public URL from Supabase. Otherwise show a placeholder.
  const photoUrl = listing.photos[0]
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/listing-photos/${listing.photos[0]}`
    : null;

  return (
    <Link to={`/listings/${listing.id}`} className="card">
      <div className="card-image">
        {photoUrl ? (
          <img src={photoUrl} alt={listing.title} />
        ) : (
          <span className="card-placeholder">No photo</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{listing.title}</h3>
        <p className="card-price">${listing.price}</p>
        <p className="card-meta">{listing.condition} · {listing.brand}</p>
        <p className="card-location">{listing.location}</p>
      </div>
    </Link>
  );
}