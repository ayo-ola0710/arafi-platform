import { Link } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";

interface ComingSoonProps {
    moduleName: string;
    description?: string;
    backTo?: string;
}

export default function ComingSoon({
    moduleName,
    description = "We're currently building advanced modules and granular systems for the Arafi developer ecosystem. This section will be available soon.",
    backTo = "/dashboard",
}: ComingSoonProps) {
    return (
        <DashboardLayout fullHeight>
            <div className="relative flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden tech-grid w-full">
                <style>{`
                    .tech-grid {
                        background-image: radial-gradient(circle at 1px 1px, #1f1f27 1px, transparent 0);
                        background-size: 32px 32px;
                    }
                    .glass-panel {
                        background: rgba(31, 31, 39, 0.4);
                        backdrop-filter: blur(12px);
                        border: 1px solid rgba(70, 69, 84, 0.5);
                    }
                    .glow-effect {
                        box-shadow: 0 0 40px rgba(192, 193, 255, 0.05);
                    }
                `}</style>

                {/* <!-- Atmospheric Glows --> */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-primary-container opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>

                {/* Header */}
                <header className="flex justify-between items-center px-10 h-20 border-b border-outline-variant/30 relative z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="font-label-mono text-label-mono text-primary/50">ARAFI_SYSTEM /</span>
                        <span className="font-headline-md text-headline-md text-on-surface">{moduleName}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="font-label-mono text-[11px] text-on-surface-variant tracking-widest uppercase">System Status: Operational</span>
                    </div>
                </header>

                {/* Centered Coming Soon Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative z-10 w-full max-w-5xl mx-auto">
                    {/* Terminal Boot Sequence Visual */}
                    <div className="relative w-full max-w-4xl mb-12 aspect-[21/9] bg-[#0A0A0C] border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
                        {/* Fake Window Controls */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-surface-container border-b border-outline-variant/30 flex items-center px-4 gap-2 z-20">
                            <div className="w-2.5 h-2.5 rounded-full bg-error/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-tertiary/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                            <div className="ml-4 font-label-mono text-[9px] text-on-surface-variant/50 uppercase tracking-widest">
                                tty1 - root@arafi-core - ~/{moduleName.toLowerCase().replace(/\s/g, '-')}
                            </div>
                        </div>
                        
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none z-10" style={{
                            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                            backgroundSize: '100% 4px, 3px 100%'
                        }}></div>

                        {/* Terminal Logs */}
                        <div className="absolute bottom-0 left-0 w-full p-6 pt-12 flex flex-col justify-end space-y-2 font-label-mono text-[11px] text-primary/70 z-0">
                            <p className="opacity-40">&gt; [SYS] Connecting to primary cluster...</p>
                            <p className="opacity-50">&gt; [OK] Connection established. Latency: 14ms</p>
                            <p className="opacity-60">&gt; [SYS] Fetching binary for module: {moduleName.toUpperCase()}</p>
                            <p className="opacity-70">&gt; [WARN] Module currently locked in staging environment.</p>
                            <p className="opacity-80">&gt; [SYS] Compiling dependency graph...</p>
                            <p className="opacity-90">&gt; [OK] Graph compiled. 1,420 nodes mapped.</p>
                            <p className="opacity-100 flex items-center gap-2">
                                <span>&gt; [AWAITING_DEPLOYMENT]</span>
                                <span className="w-2 h-3 bg-primary animate-pulse"></span>
                            </p>
                        </div>
                        
                        {/* Center Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/90 via-background/40 to-transparent z-20">
                            <div className="px-6 py-2 border border-primary/40 bg-surface-container/60 backdrop-blur-md rounded-full flex items-center gap-3">
                                <span className="material-symbols-outlined text-[14px] text-primary animate-spin" style={{ animationDuration: '3s' }}>
                                    sync
                                </span>
                                <span className="font-label-mono text-[10px] text-primary tracking-widest uppercase">
                                    {moduleName.replace(/\s/g, '_')}_ENGINE_STANDBY
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Glassmorphic Card */}
                    <div className="glass-panel glow-effect w-full max-w-2xl p-8 md:p-10 rounded-xl text-center relative border-outline-variant/40">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-surface-container-low border border-outline-variant rounded-xl flex items-center justify-center transform rotate-45 shadow-2xl">
                            <span className="material-symbols-outlined text-primary text-4xl -rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>
                                construction
                            </span>
                        </div>
                        <div className="mt-8 space-y-6">
                            <h2 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface">Feature Under Development</h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                                {description}
                            </p>
                            
                            <div className="mt-4">
                                <Link to={backTo} className="text-primary hover:text-primary-container transition-colors font-label-mono text-label-mono flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Dashboard
                                </Link>
                            </div>

                            <div className="pt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 opacity-40">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">security</span>
                                    <span className="font-label-mono text-[11px] uppercase tracking-tighter">Security Audits</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">bolt</span>
                                    <span className="font-label-mono text-[11px] uppercase tracking-tighter">Edge Performance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">api</span>
                                    <span className="font-label-mono text-[11px] uppercase tracking-tighter">API V2 Registry</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
