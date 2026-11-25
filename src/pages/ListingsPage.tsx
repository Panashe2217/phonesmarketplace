import { useListings } from "../hooks/useListings";
import { ListingCard } from "../components/ListingCard";

export default function ListingsPage() {
  const { listings, loading, error } = useListings();

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (listings.length === 0) return <p>No listings found. Be the first to post one!</p>;

  return (
    <div className="grid">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}