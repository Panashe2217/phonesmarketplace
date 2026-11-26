import { createBrowserRouter, redirect } from "react-router";
import RootLayout from "./layouts/RootLayout";
import ListingsPage from "./pages/ListingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import TermsPage from "./pages/TermsPage";
import ServicesPage from "./pages/ServicesPage";
import AdminLoginPage from "./pages/AdminLoginPage";

// A simple loading screen for hydration
function HydrateFallback() {
  return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    hydrateFallbackElement: <HydrateFallback />, // ADD THIS LINE
    children: [
      { index: true, element: <ListingsPage /> },
      {
        path: "listings/:id",
        lazy: async () => {
          const m = await import("./pages/ListingDetailPage");
          return { Component: m.default };
        },
      },
      { path: "login", element: <AdminLoginPage /> },
      {
        path: "new",
        loader: () => {
          const isAdmin = localStorage.getItem("admin_token") === "logged_in";
          if (!isAdmin) {
            return redirect("/login");
          }
          return null;
        },
        lazy: async () => {
          const m = await import("./pages/NewListingPage");
          return { Component: m.default };
        },
      },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);