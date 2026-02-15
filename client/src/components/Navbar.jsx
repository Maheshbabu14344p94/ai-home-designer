import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* Gradient border */}
      <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500" />

      {/* Navbar body */}
      <div className="backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-sm">
        <div className="container-custom flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 font-extrabold text-2xl tracking-tight"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg group-hover:scale-105 transition">
              🏠
            </span>
            <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              AI Home Designer
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink to="/">Home</NavLink>

            {user?.role && (
              <NavLink
                to={
                  user.role === "architect"
                    ? "/architect-dashboard"
                    : "/user-dashboard"
                }
              >
                Dashboard
              </NavLink>
            )}

            {!user ? (
              <Link
                to="/auth"
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition" />
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-red-600 hover:bg-red-50 hover:border-red-300 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-xl p-2 text-gray-700 hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="space-y-6 border-t bg-white/90 px-6 py-8 backdrop-blur">
            <MobileLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </MobileLink>

            {user && (
              <MobileLink
                to={
                  user.role === "architect"
                    ? "/architect-dashboard"
                    : "/user-dashboard"
                }
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </MobileLink>
            )}

            {!user ? (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-center font-semibold text-white shadow-lg"
              >
                Get Started
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-red-200 py-3 text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ===== Helpers ===== */

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group relative font-medium text-gray-700 transition hover:text-indigo-700"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:w-full" />
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-lg font-medium text-gray-700 hover:text-indigo-700 transition"
    >
      {children}
    </Link>
  );
}
