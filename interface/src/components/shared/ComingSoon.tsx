import { useState } from "react";
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
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState(false);

    const handleSubscribe = () => {
        if (email.includes("@")) {
            setSubscribed(true);
            setError(false);
            setTimeout(() => {
                setSubscribed(false);
                setEmail("");
            }, 3000);
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

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
                    {/* Abstract Visual */}
                    <div className="relative w-full max-w-4xl mb-12 aspect-[21/9] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                        <div className="w-full h-full relative border border-outline-variant/20 rounded-xl overflow-hidden">
                            <img 
                                className="w-full h-full object-cover opacity-60" 
                                alt="A sophisticated 3D visualization of a neural payment network" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCda8yPkGBKpymMlpiVPgfT1tBgXdjYDlVfgaQiteNu4GWvWDvwZW1_YAQaKr8GjFeLzUw2sa_33oT1OydSfv2XkobXORi61-V5g2SzVmjUXWBD_rL1Ybg74OvHh6P7bH_zlr7O_aJPy7rvx4CXCCwz-JsDqB1-NZZyik31vha8aRmxivJfmUJAbzFc-aA-JRM8D1seOb34y6ljSzG-a8SydzRAowWIIZ9pZtOaqndBSnOBZJLfCujqg_plnVSPNU9ISIUbh9QLmPNa"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="px-6 py-2 border border-primary/40 bg-background/80 backdrop-blur-md rounded-full">
                                    <span className="font-label-mono text-label-mono text-primary animate-pulse">ENCRYPTED_FLOW_STABILIZING...</span>
                                </div>
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
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 max-w-md mx-auto">
                                <div className="flex-1 relative">
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full bg-surface-container-lowest border ${error ? 'border-error' : 'border-outline-variant'} rounded-lg px-4 py-3 font-label-mono text-label-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/30`} 
                                        placeholder="dev_ops@example.com" 
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/40 text-sm">alternate_email</span>
                                </div>
                                <button 
                                    onClick={handleSubscribe}
                                    className={`${subscribed ? 'bg-emerald-500 text-white' : 'bg-primary text-on-primary'} font-bold px-8 py-3 rounded-lg font-label-mono text-label-mono hover:brightness-110 transition-all active:scale-95`}
                                >
                                    {subscribed ? 'Subscribed' : 'Notify Me'}
                                </button>
                            </div>
                            
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

                {/* System Background Noise */}
                <div className="hidden lg:flex fixed bottom-6 right-10 gap-10 z-20">
                    <div className="font-label-mono text-[10px] text-on-surface-variant/40 space-y-1">
                        <div>VERSION: 0.8.4-BETA</div>
                        <div>BUILD_HASH: 7F29X_AR_2024</div>
                    </div>
                    <div className="font-label-mono text-[10px] text-on-surface-variant/40 space-y-1">
                        <div>LATENCY: 12ms</div>
                        <div>SECURE_TUNNEL: ENABLED</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
