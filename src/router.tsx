import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import ListingsPage from "./pages/ListingsPage";
import NotFoundPage from "./pages/NotFoundPage";

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
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);