import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import ListingsPage from "./pages/ListingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import TermsPage from "./pages/TermsPage";
import ServicesPage from "./pages/ServicesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <ListingsPage /> },
      {
        path: "listings/:id",
        lazy: async () => {
          const m = await import("./pages/ListingDetailPage");
          return { Component: m.default };
        },
      },
      {
        path: "new",
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