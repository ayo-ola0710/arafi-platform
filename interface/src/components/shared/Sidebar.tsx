import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { useWorkspace } from "../../store/useWorkspace";
import AppSwitcher from "./AppSwitcher";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();
  const { reset: resetWorkspaces } = useWorkspace();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    resetWorkspaces();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: "dashboard",
      path: "/dashboard",
      isActive: currentPath === "/dashboard" || currentPath.startsWith("/dashboard/"),
    },
    {
      name: "API Keys",
      icon: "vpn_key",
      path: "/apikeys",
      isActive: currentPath === "/apikeys",
    },
    {
      name: "Logs",
      icon: "list_alt",
      path: "/logs",
      isActive: currentPath === "/logs",
    },
    {
      name: "Webhooks",
      icon: "webhook",
      path: "/webhooks",
      isActive: currentPath === "/webhooks",
    },
    {
      name: "Team",
      icon: "group",
      path: "/team",
      isActive: currentPath === "/team",
    },
    {
      name: "Settings",
      icon: "settings",
      path: "/settings",
      isActive: currentPath === "/settings",
    },
  ];

  return (
    <nav className="hidden md:flex flex-col h-full p-4 gap-2 bg-surface-container-low fixed left-0 top-0 w-64 border-r border-outline-variant z-40">
      {/* Brand */}
      <div className="mb-4 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-on-primary font-headline-md shrink-0">
          {user?.email?.[0]?.toUpperCase() ?? "A"}
        </div>
        <div className="overflow-hidden">
          <h1 className="font-headline-md text-headline-md font-bold text-primary leading-none">
            Arafi
          </h1>
          <p className="font-label-mono text-label-mono text-on-surface-variant text-[10px] truncate">
            {user?.email ?? "Developer Console"}
          </p>
        </div>
      </div>

      {/* App Switcher */}
      <div className="mb-2">
        <AppSwitcher />
      </div>

      {/* Nav Links */}
      <div className="flex-1 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg active:scale-95 transition-all ${
              item.isActive
                ? "bg-secondary-container text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={item.isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-mono text-label-mono">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Links */}
      <div className="pt-4 border-t border-outline-variant space-y-0.5">
        <Link
          to="/docs"
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg"
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          <span className="font-label-mono text-label-mono">Docs</span>
        </Link>
        <Link
          to="/support"
          className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest transition-colors rounded-lg"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span className="font-label-mono text-label-mono">Support</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 transition-colors rounded-lg mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-label-mono text-label-mono">Log out</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
