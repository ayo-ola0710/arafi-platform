import { useState, useEffect } from "react";
import { useSubscriptions } from "../../store/useSubscriptions";
import { useWorkspace } from "../../store/useWorkspace";

export default function SubscriberTable() {
    const { subscriptions, fetch, isLoading } = useSubscriptions();
    const { activeWorkspace } = useWorkspace();

    useEffect(() => {
        if (activeWorkspace) {
            fetch();
        }
    }, [activeWorkspace?.app_id, fetch]);

    return (
        <div className="surface-panel rounded-xl overflow-hidden animate-fade-up delay-120">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                    Active Subscribers
                </h3>
            </div>
            
            <div className="overflow-x-auto min-h-[150px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant bg-surface-container-high/30">
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Sub ID
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Customer ID
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Plan ID
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="font-code-sm text-code-sm divide-y divide-outline-variant">
                        {isLoading && subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant animate-pulse">
                                    Loading subscribers...
                                </td>
                            </tr>
                        ) : subscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                                    No active subscribers found.
                                </td>
                            </tr>
                        ) : (
                            subscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-surface-container-highest/30 transition-colors">
                                    <td className="px-6 py-4 text-on-surface font-label-mono text-[12px]">
                                        {sub.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-on-surface font-label-mono text-[12px]">
                                        {sub.customer_id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-on-surface font-label-mono text-[12px]">
                                        {sub.plan_id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                                            sub.status === 'active' || sub.status === 'ACTIVE'
                                                ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                                                : 'bg-outline-variant/20 text-on-surface-variant border-outline-variant/30'
                                        }`}>
                                            {sub.status || "UNKNOWN"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-outline">
                                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "Just now"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
