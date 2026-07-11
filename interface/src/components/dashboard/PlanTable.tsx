import { useState, useEffect } from "react";
import { usePlans } from "../../store/usePlans";
import { useWorkspace } from "../../store/useWorkspace";
import CreatePlanModal from "../ui/CreatePlanModal";
import TableSkeleton from "../ui/TableSkeleton";
import EmptyState from "../ui/EmptyState";

export default function PlanTable() {
    const { plans, fetch, isLoading } = usePlans();
    const { activeWorkspace } = useWorkspace();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (activeWorkspace) {
            fetch();
        }
    }, [activeWorkspace?.app_id, fetch]);

    return (
        <>
            <div className="surface-panel rounded-xl overflow-hidden animate-fade-up delay-120">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                        Billing Plans
                    </h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="border border-outline-variant text-on-surface font-label-mono text-label-mono px-3 py-1 rounded hover:bg-surface-variant transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[16px]">add</span> Create Plan
                    </button>
                </div>
                
                <div className="overflow-x-auto min-h-[150px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-high/30">
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Plan Name
                                </th>
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Interval
                                </th>
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Grace Period
                                </th>
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody className="font-code-sm text-code-sm divide-y divide-outline-variant">
                            {isLoading && plans.length === 0 ? (
                                <TableSkeleton cols={5} colWidths={['w-1/4', 'w-1/5', 'w-1/6', 'w-1/6', 'w-1/5']} />
                            ) : plans.length === 0 ? (
                                <EmptyState
                                    icon="list_alt"
                                    title="No billing plans yet"
                                    description="Create your first subscription plan to start accepting recurring payments from your customers."
                                    ctaLabel="Create a Plan"
                                    onCtaClick={() => setShowCreateModal(true)}
                                />
                            ) : (
                                plans.map((plan) => (
                                    <tr key={plan.id} className="hover:bg-surface-container-highest/30 transition-colors">
                                        <td className="px-6 py-4 text-on-surface font-body-md font-medium">
                                            {plan.name}
                                        </td>
                                        <td className="px-6 py-4 text-on-surface">
                                            {/* Assuming Amount is in Kobo and formatting to primary unit */}
                                            {(() => {
                                                const amount = (plan.amount_kobo / 100).toLocaleString('en-US', { style: 'currency', currency: 'NGN' }); // Defaulting to NGN visually or generic
                                                const parts = amount.split('.');
                                                return (
                                                    <span className="font-label-mono">
                                                        {parts[0]}.<span className="text-outline">{parts[1]}</span>
                                                    </span>
                                                )
                                            })()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] uppercase tracking-wider border border-outline-variant/50">
                                                {plan.interval}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-on-surface">
                                            {plan.grace_period_days ? `${plan.grace_period_days} Days` : "Immediate"}
                                        </td>
                                        <td className="px-6 py-4 text-outline">
                                            {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : "Just now"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <CreatePlanModal
                    onDismiss={() => setShowCreateModal(false)}
                    onSuccess={() => setShowCreateModal(false)}
                />
            )}
        </>
    );
}
