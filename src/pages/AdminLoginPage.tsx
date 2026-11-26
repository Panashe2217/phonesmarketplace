import { useState } from "react";
import { useNavigate } from "react-router";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Set your secret PIN here (e.g., 1234)
    const SECRET_PIN = "1234"; 

    if (pin === SECRET_PIN) {
      // Save to localStorage so they stay logged in
      localStorage.setItem("admin_token", "logged_in");
      navigate("/new");
    } else {
      setError("Incorrect PIN. Try again.");
    }
  }

  return (
    <div className="form-page" style={{ maxWidth: "400px", marginTop: "50px" }}>
      <h1>Admin Login</h1>
      <p>Enter your PIN to post a listing.</p>
      
      <form onSubmit={handleSubmit} className="listing-form">
        <div className="form-group">
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            autoFocus
          />
          {error && <span className="error-text">{error}</span>}
        </div>
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
}