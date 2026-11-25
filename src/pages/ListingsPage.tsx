import { useSearchParams } from "react-router";
import { useListings } from "../hooks/useListings";
import { ListingCard } from "../components/ListingCard";

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { listings, loading, error } = useListings(query);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // Update the URL. If it's empty, remove the 'q' param entirely.
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  }

  return (
    <div>
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search by title..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {loading && <p>Loading listings...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      
      {!loading && !error && listings.length === 0 && (
        <p>No listings found {query ? `for "${query}"` : ""}. Try a different search.</p>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}