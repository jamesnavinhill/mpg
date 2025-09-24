import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-1 rounded-md text-xs border ${
      isActive
        ? "bg-accent-600/20 border-accent-600 text-accent-200"
        : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-accent-600/40 hover:text-accent-200"
    }`;
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-sm font-semibold text-neutral-100">
            Prompt Generators
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/music" className={linkClass}>
              Music
            </NavLink>
            <NavLink to="/image" className={linkClass}>
              Image
            </NavLink>
            <NavLink to="/video" className={linkClass}>
              Video
            </NavLink>
          </nav>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
