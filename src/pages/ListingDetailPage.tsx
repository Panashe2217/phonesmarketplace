import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";
import { requestNotificationPermission, showEcoCashNotification } from "../lib/notifications"; 

type Listing = Database["public"]["Tables"]["listings"]["Row"];

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "loading" | "pin" | "success">("form");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (fetchError.code === "PGRST116") setError("Listing not found");
        else setError(fetchError.message);
      } else {
        setListing(data);
      }
      setLoading(false);
    }
    fetchListing();
  }, [id]);

  // Step 1: User enters their phone number
  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (phoneNumber.length < 9) {
      alert("Please enter a valid EcoCash number.");
      return;
    }
    
    // Request notification permission first
    await requestNotificationPermission();
    
    setCheckoutStep("loading");
    
    // Simulate network request to EcoCash
    setTimeout(() => {
      // Show the notification just before we ask for the PIN
      if (listing) {
        showEcoCashNotification(listing.price);
      }
      setCheckoutStep("pin");
    }, 2000);
  }

  // Step 2: User enters PIN and we save the order
  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length < 4) {
      alert("Please enter a 4-digit PIN.");
      return;
    }

    setIsSubmitting(true);

    // Save the "order" to the database
    const { error: orderError } = await supabase.from("orders").insert({
      listing_id: listing?.id,
      buyer_contact: phoneNumber,
      buyer_phone: phoneNumber,
      receipt_code: "SIMULATED-" + Math.random().toString(36).substring(7).toUpperCase(),
      status: "paid",
    });

    setIsSubmitting(false);

    if (orderError) {
      alert("Error placing order: " + orderError.message);
    } else {
      setCheckoutStep("success");
    }
  }

  function closeModal() {
    setIsCheckoutOpen(false);
    // Reset state after closing
    setTimeout(() => {
      setCheckoutStep("form");
      setPhoneNumber("");
      setPin("");
    }, 300);
  }

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

          <button className="buy-btn" onClick={() => setIsCheckoutOpen(true)}>
            Buy with EcoCash
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {/* STEP 1: Enter Phone Number */}
            {checkoutStep === "form" && (
              <>
                <h2>Pay with EcoCash</h2>
                <p>Enter your EcoCash number to receive a payment prompt.</p>
                <form onSubmit={handlePhoneSubmit}>
                  <div className="form-group">
                    <label>EcoCash Number</label>
                    <input 
                      type="tel" 
                      placeholder="077 123 4567" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="receipt-input"
                      autoFocus
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-confirm">Send Prompt</button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 2: Loading Simulation */}
            {checkoutStep === "loading" && (
              <div className="payment-loading">
                <div className="spinner"></div>
                <h3>Processing...</h3>
                <p>Please check your phone for the USSD prompt.</p>
              </div>
            )}

            {/* STEP 3: Enter PIN */}
            {checkoutStep === "pin" && (
              <>
                <h2>EcoCash Prompt</h2>
                <div className="ussd-box">
                  <p>📱 Check your notifications or phone screen!</p> 
                  <p>Pay <strong>${listing.price}</strong> to <strong>Marketplace Zim</strong>?</p>
                  <p>Enter PIN:</p>
                  <input 
                    type="password" 
                    maxLength={4} 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="pin-input"
                    placeholder="••••"
                    autoFocus
                  />
                </div>
                <form onSubmit={handlePinSubmit}>
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-confirm" disabled={isSubmitting}>
                      {isSubmitting ? "Authorizing..." : "Pay Now"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 4: Success */}
            {checkoutStep === "success" && (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h2>Payment Successful</h2>
                <p>Your payment of <strong>${listing.price}</strong> was authorized.</p>
                <p>The seller has been notified.</p>
                <button className="btn-confirm" onClick={closeModal} style={{ width: "100%" }}>Done</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}