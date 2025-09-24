import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import { MusicPage } from "./pages/MusicPage";
import ImagePage from "./pages/ImagePage";
import VideoPage from "./pages/VideoPage";

const root = createRoot(document.getElementById("root")!);
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <MusicPage /> },
      { path: "/music", element: <MusicPage /> },
      { path: "/image", element: <ImagePage /> },
      { path: "/video", element: <VideoPage /> },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
