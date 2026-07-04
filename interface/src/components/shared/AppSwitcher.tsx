import { useState, useRef, useEffect } from "react";
import { useWorkspace } from "../../store/useWorkspace";
import CreateAppModal from "../ui/CreateAppModal";

export default function AppSwitcher() {
    const { workspaces: apps, activeWorkspace: activeApp, setActiveWorkspace: setActiveApp, fetch } = useWorkspace();
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

    // Fetch workspaces if we don't have any loaded yet
    useEffect(() => {
        if (apps.length === 0) {
            fetch();
        }
    }, [apps.length, fetch]);

    // Removed envColor since Workspace handles both live/test internally
    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    id="app-switcher-btn"
                    onClick={() => setIsOpen((v) => !v)}
                    className="w-full flex items-center justify-between gap-2 px-2 py-1 rounded-xl border border-outline-variant hover:border-outline bg-surface-container-lowest/50 transition-all group"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary text-[14px]">apps</span>
                        </div>
                        <div className="overflow-hidden text-left">
                            <p className="font-label-mono text-label-mono text-on-surface text-xs truncate">
                                {activeApp?.app_name ?? "No workspace selected"}
                            </p>
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
                                        key={app.app_id}
                                        role="option"
                                        aria-selected={activeApp?.app_id === app.app_id}
                                        onClick={() => {
                                            setActiveApp(app);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors text-left ${
                                            activeApp?.app_id === app.app_id
                                                ? "bg-primary/10 text-on-surface"
                                                : "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                                        }`}
                                    >
                                        <span className="font-label-mono text-xs truncate">{app.app_name}</span>
                                        {activeApp?.app_id === app.app_id && (
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
                                <span className="font-label-mono text-xs">Create new workspace</span>
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
