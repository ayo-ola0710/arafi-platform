import { useEnvironment } from "../../store/useEnvironment";

export default function EnvironmentToggle() {
    const { isLiveMode, toggleMode } = useEnvironment();

    return (
        <div className="px-1 mt-auto">
            <button
                onClick={toggleMode}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-highest transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${
                            isLiveMode ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-tertiary shadow-[0_0_8px_rgba(255,180,171,0.3)]"
                        }`}
                    ></span>
                    <span className="font-label-mono text-label-mono text-on-surface">
                        {isLiveMode ? "Live Mode" : "Test Mode"}
                    </span>
                </div>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                    swap_horiz
                </span>
            </button>
        </div>
    );
}
