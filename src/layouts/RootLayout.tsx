import { NavLink, Outlet } from "react-router";
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
      
      {/* ADD THIS */}
      <InstallBanner />
    </div>
  );
}