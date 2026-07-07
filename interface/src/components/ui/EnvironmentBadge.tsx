import { useEnvironment } from "../../store/useEnvironment";

export default function EnvironmentBadge() {
    const { isLiveMode } = useEnvironment();

    if (isLiveMode) {
        return (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-label-mono text-[10px] uppercase tracking-wider border border-emerald-500/20">
                LIVE
            </span>
        );
    }

    return (
        <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-mono text-[10px] uppercase tracking-wider border border-tertiary/30">
            TEST
        </span>
    );
}
