import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import AppSwitcher from "./AppSwitcher";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const isDashboard = currentPath === "/dashboard" || currentPath.startsWith("/dashboard/");
  
  const sections = [
    {
      title: "DEVELOPERS",
      items: [
        { name: "API Keys", icon: "vpn_key", path: "/apikeys", isActive: currentPath === "/apikeys" },
        { name: "Webhooks", icon: "webhook", path: "/webhooks", isActive: currentPath === "/webhooks" },
        { name: "Logs", icon: "list_alt", path: "/logs", isActive: currentPath === "/logs" },
        { name: "Team", icon: "group", path: "/team", isActive: currentPath === "/team" },
      ],
    },
    {
      title: "PAYOUT",
      items: [
        { name: "Products", icon: "inventory_2", path: "/products", isActive: currentPath === "/products" || currentPath === "/payouts" },
        { name: "History", icon: "history", path: "/payouts/history", isActive: currentPath === "/payouts/history" },
      ],
    },
    {
      title: "ESCROW",
      items: [
        { name: "Create", icon: "add_circle", path: "/escrow/create", isActive: currentPath === "/escrow/create" || currentPath === "/escrow" },
        { name: "Transactions", icon: "receipt_long", path: "/escrow/transactions", isActive: currentPath === "/escrow/transactions" },
      ],
    },
    {
      title: "SUBSCRIPTION",
      items: [
        { name: "Plans", icon: "list_alt", path: "/plans", isActive: currentPath === "/plans" || currentPath === "/subscriptions" },
        { name: "Subscribers", icon: "people", path: "/subscribers", isActive: currentPath === "/subscribers" },
      ],
    },
    {
      title: "EMAIL",
      items: [
        { name: "Templates", icon: "mail", path: "/email", isActive: currentPath === "/email" },
      ],
    },
  ];

  return (
    <nav className="hidden md:flex flex-col h-full p-2 gap-1 bg-surface-container-low fixed left-0 top-0 w-56 border-r border-outline-variant z-40">
      {/* Brand */}
      <div className="mb-1 px-1 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center font-bold text-on-primary font-headline-md shrink-0 text-xs">
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
      <div className="mb-0.5">
        <AppSwitcher />
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto space-y-0.5 pb-0 custom-scrollbar">
        <div className="space-y-0.5">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-1.5 py-0.5 rounded-lg active:scale-95 transition-all ${
              isDashboard
                ? "bg-secondary-container text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={isDashboard ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              home
            </span>
            <span className="font-label-mono text-label-mono">Home</span>
          </Link>
          <Link
            to="/accounts"
            className={`flex items-center gap-2 px-1.5 py-0.5 rounded-lg active:scale-95 transition-all ${
              currentPath === "/accounts"
                ? "bg-secondary-container text-on-secondary-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
            }`}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={currentPath === "/accounts" ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              account_balance_wallet
            </span>
            <span className="font-label-mono text-label-mono">Accounts</span>
          </Link>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="mt-2">
            <p className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant px-1.5 mb-0.5 font-bold">
              {section.title}
            </p>
            <div className="space-y-0">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-1.5 py-0.5 rounded-lg active:scale-95 transition-all ${
                    item.isActive
                      ? "bg-secondary-container text-on-secondary-container font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={item.isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="font-label-mono text-label-mono">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
