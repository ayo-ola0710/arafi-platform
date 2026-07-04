import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { useWorkspace } from "../../store/useWorkspace";

export default function TopNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { reset: resetWorkspaces } = useWorkspace();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    resetWorkspaces();
    navigate("/login");
  };

  return (
    <nav className="h-16 px-6 bg-background border-b border-outline-variant flex justify-between md:justify-end items-center sticky top-0 z-30">
      {/* Mobile Brand & Menu */}
      <div className="md:hidden flex items-center gap-3">
        <button className="text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="font-headline-md text-headline-md font-bold text-primary">
          Arafi
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 relative">
        <button className="relative p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-highest">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-background"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary text-sm hover:ring-2 hover:ring-primary/50 transition-all"
          >
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-fade-scale z-50">
              <div className="p-3 border-b border-outline-variant">
                <p className="font-label-mono text-sm font-bold text-on-surface truncate">
                  {user?.email ?? "User"}
                </p>
              </div>
              <div className="p-1.5">
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  <span className="font-label-mono text-xs">Settings</span>
                </Link>
                <Link
                  to="/docs"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span className="font-label-mono text-xs">Documentation</span>
                </Link>
                <Link
                  to="/support"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">help</span>
                  <span className="font-label-mono text-xs">Support</span>
                </Link>
              </div>
              <div className="p-1.5 border-t border-outline-variant">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-error hover:bg-error/10 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span className="font-label-mono text-xs">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
