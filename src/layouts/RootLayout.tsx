import { NavLink, Outlet } from "react-router";
import { InstallBanner } from "../components/InstallBanner";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

export default function RootLayout() {
  // Check if the user is logged in
  const isAdmin = localStorage.getItem("admin_token") === "logged_in";

  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">Marketplace</span>
        <nav className="nav">
          <NavLink to="/" end className={linkClass}>Listings</NavLink>
          {isAdmin ? (
            <NavLink to="/new" className={linkClass}>Post</NavLink>
          ) : (
            <NavLink to="/login" className={linkClass}>Admin</NavLink>
          )}
        </nav>
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        {/* ... footer content ... */}
      </footer>
      
      <InstallBanner />
    </div>
  );
}