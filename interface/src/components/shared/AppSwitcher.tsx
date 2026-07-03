import { useState, useRef, useEffect } from "react";
import { useApp } from "../../store/useApp";
import CreateAppModal from "../ui/CreateAppModal";

export default function AppSwitcher() {
    const { apps, activeApp, setActiveApp } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const envColor = (env: "live" | "test") =>
        env === "live" ? "text-emerald-400 bg-emerald-400/10" : "text-tertiary bg-tertiary/10";

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    id="app-switcher-btn"
                    onClick={() => setIsOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-outline-variant hover:border-outline bg-surface-container-lowest/50 transition-all group"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-[14px]">apps</span>
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="font-label-mono text-label-mono text-on-surface text-xs truncate">
                                {activeApp?.name ?? "No app selected"}
                            </p>
                            {activeApp && (
                                <span className={`font-label-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider ${envColor(activeApp.environment)}`}>
                                    {activeApp.environment}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className={`material-symbols-outlined text-on-surface-variant text-[16px] transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                        expand_more
                    </span>
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container border border-outline-variant rounded-xl shadow-2xl shadow-black/30 z-50 overflow-hidden animate-fade-scale"
                        role="listbox"
                    >
                        {apps.length > 0 && (
                            <div className="p-1.5">
                                <p className="font-label-mono text-[9px] uppercase tracking-widest text-on-surface-variant px-2 py-1.5">
                                    Your Apps
                                </p>
                                {apps.map((app) => (
                                    <button
                                        key={app.id}
                                        role="option"
                                        aria-selected={activeApp?.id === app.id}
                                        onClick={() => {
                                            setActiveApp(app);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors text-left ${
                                            activeApp?.id === app.id
                                                ? "bg-primary/10 text-on-surface"
                                                : "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                                        }`}
                                    >
                                        <span className={`font-label-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${envColor(app.environment)}`}>
                                            {app.environment}
                                        </span>
                                        <span className="font-label-mono text-xs truncate">{app.name}</span>
                                        {activeApp?.id === app.id && (
                                            <span className="material-symbols-outlined text-primary text-[14px] ml-auto">check</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-outline-variant p-1.5">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowCreateModal(true);
                                }}
                                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors text-left"
                            >
                                <span className="material-symbols-outlined text-[16px]">add</span>
                                <span className="font-label-mono text-xs">Create new app</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateAppModal
                    onSuccess={() => setShowCreateModal(false)}
                    onDismiss={() => setShowCreateModal(false)}
                />
            )}
        </>
    );
}
