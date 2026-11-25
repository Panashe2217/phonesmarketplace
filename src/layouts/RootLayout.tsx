import { NavLink, Link, Outlet } from "react-router";
import { InstallBanner } from "../components/InstallBanner";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

export default function RootLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">Marketplace</span>
        <nav className="nav">
          <NavLink to="/" end className={linkClass}>Listings</NavLink>
          <NavLink to="/new" className={linkClass}>Post</NavLink>
        </nav>
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-links">
          <Link to="/how-it-works">How it Works</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/services">Our Services</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Marketplace Zim. All rights reserved.</p>
      </footer>
      
      <InstallBanner />
    </div>
  );
}