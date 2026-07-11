import { useState, useEffect } from "react";
import { useSubscriptions } from "../../store/useSubscriptions";
import { useWorkspace } from "../../store/useWorkspace";
import { cancelSubscription, pauseSubscription, resumeSubscription, createSubscription, changeSubscriptionPlan, verifySubscriptionPayment } from "../../lib/api/subscriptions";
import { usePlans } from "../../store/usePlans";
import { useCustomers } from "../../store/useCustomers";
import ConfirmationModal from "../ui/ConfirmationModal";
import TableSkeleton from "../ui/TableSkeleton";
import EmptyState from "../ui/EmptyState";

export default function SubscriberTable() {
    const { subscriptions, fetch, isLoading } = useSubscriptions();
    const { plans, fetch: fetchPlans } = usePlans();
    const { customers, fetch: fetchCustomers } = useCustomers();
    const { activeWorkspace } = useWorkspace();

    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<any>(null);
    
    // Change Plan Modal State
    const [showChangePlanModal, setShowChangePlanModal] = useState<string | null>(null);
    const [newPlanId, setNewPlanId] = useState("");

    useEffect(() => {
        if (activeWorkspace) {
            fetch();
        }
    }, [activeWorkspace?.app_id, fetch]);

    useEffect(() => {
        if (activeWorkspace && (showCreateModal || showChangePlanModal)) {
            fetchPlans();
            if (showCreateModal) fetchCustomers();
        }
    }, [activeWorkspace?.app_id, showCreateModal, showChangePlanModal, fetchPlans, fetchCustomers]);

    const handleAction = async (actionFn: (id: string) => Promise<any>, subId: string, actionName: string) => {
        setConfirmConfig({
            isOpen: true,
            title: `Confirm ${actionName}`,
            message: `Are you sure you want to ${actionName} this subscription?`,
            type: actionName === 'cancel' || actionName === 'pause' ? 'danger' : 'info',
            confirmText: "Yes",
            onCancel: () => setConfirmConfig(null),
            onConfirm: async () => {
                setConfirmConfig((prev: any) => ({ ...prev, isProcessing: true }));
                setActionLoadingId(subId);
                try {
                    await actionFn(subId);
                    fetch(); // Refresh data
                    setConfirmConfig(null);
                } catch (err: any) {
                    setConfirmConfig({
                        isOpen: true,
                        isAlert: true,
                        title: "Error",
                        message: err?.response?.data?.message || `Failed to ${actionName} subscription.`,
                        type: "danger",
                        confirmText: "OK",
                        onConfirm: () => setConfirmConfig(null)
                    });
                } finally {
                    setActionLoadingId(null);
                }
            }
        });
    };

    const handleCreateSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerId || !selectedPlanId) return;
        setSubmitting(true);
        try {
            await createSubscription({
                customer_id: selectedCustomerId,
                plan_id: selectedPlanId,
            });
            setShowCreateModal(false);
            setSelectedCustomerId("");
            setSelectedPlanId("");
            fetch(); // refresh subscriptions table
        } catch (err: any) {
            setConfirmConfig({
                isOpen: true,
                isAlert: true,
                title: "Error",
                message: err?.response?.data?.message || "Failed to manually register subscriber.",
                type: "danger",
                confirmText: "OK",
                onConfirm: () => setConfirmConfig(null)
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showChangePlanModal || !newPlanId) return;
        setSubmitting(true);
        try {
            await changeSubscriptionPlan(showChangePlanModal, newPlanId);
            setShowChangePlanModal(null);
            setNewPlanId("");
            fetch();
        } catch (err: any) {
            setConfirmConfig({
                isOpen: true,
                isAlert: true,
                title: "Error",
                message: err?.response?.data?.message || "Failed to change subscription plan.",
                type: "danger",
                confirmText: "OK",
                onConfirm: () => setConfirmConfig(null)
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="surface-panel rounded-xl overflow-hidden animate-fade-up delay-120">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                        Active Subscribers
                    </h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-on-primary font-label-mono text-label-mono px-3 py-1.5 rounded hover:brightness-110 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[16px]">person_add</span> Register Subscriber
                    </button>
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
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider text-right pr-6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="font-code-sm text-code-sm divide-y divide-outline-variant">
                        {isLoading && subscriptions.length === 0 ? (
                            <TableSkeleton cols={6} colWidths={['w-1/5', 'w-1/6', 'w-1/5', 'w-1/8', 'w-1/6', 'w-1/8']} />
                        ) : subscriptions.length === 0 ? (
                            <EmptyState
                                icon="people"
                                title="No subscribers yet"
                                description="Manually register a customer on a plan, or share a checkout link so they can self-subscribe."
                                ctaLabel="Register Subscriber"
                                onCtaClick={() => setShowCreateModal(true)}
                            />
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
                                    <td className="px-6 py-4 text-right pr-6 flex items-center justify-end gap-2">
                                        {actionLoadingId === sub.id ? (
                                            <span className="text-on-surface-variant font-label-mono text-[10px] animate-pulse">Processing...</span>
                                        ) : (
                                            <>
                                                {sub.status?.toUpperCase() !== 'CANCELED' && (
                                                    sub.status?.toUpperCase() === 'PAUSED' ? (
                                                        <button 
                                                            onClick={() => handleAction(resumeSubscription, sub.id, 'resume')}
                                                            className="border border-emerald-500/30 text-emerald-400 font-label-mono text-[10px] px-2 py-1 rounded hover:bg-emerald-500/10 transition-colors"
                                                        >
                                                            Resume
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleAction(pauseSubscription, sub.id, 'pause')}
                                                            className="border border-yellow-500/30 text-yellow-400 font-label-mono text-[10px] px-2 py-1 rounded hover:bg-yellow-500/10 transition-colors"
                                                        >
                                                            Pause
                                                        </button>
                                                    )
                                                )}
                                                <button 
                                                    onClick={() => setShowChangePlanModal(sub.id)}
                                                    className="border border-primary/30 text-primary font-label-mono text-[10px] px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                                                >
                                                    Change Plan
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(verifySubscriptionPayment, sub.id, 'verify payment for')}
                                                    className="border border-outline-variant text-on-surface-variant font-label-mono text-[10px] px-2 py-1 rounded hover:bg-surface-container-highest transition-colors"
                                                >
                                                    Verify
                                                </button>
                                                {sub.status?.toUpperCase() !== 'CANCELED' && (
                                                    <button 
                                                        onClick={() => handleAction(cancelSubscription, sub.id, 'cancel')}
                                                        className="text-error hover:text-error/80 font-label-mono text-[10px] hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {sub.status?.toUpperCase() === 'CANCELED' && (
                                                    <span className="text-on-surface-variant font-label-mono text-[10px]">No actions available</span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
            
        {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-md rounded-2xl border border-on-surface/10 p-6 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-md text-lg text-white font-bold">Register Subscriber</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-on-surface/50 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubscription} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Select Customer</label>
                                <select
                                    required
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    className="bg-surface/90 border border-on-surface/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choose a customer...</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>{c.email} ({c.id.substring(0,8)})</option>
                                    ))}
                                </select>
                                {customers.length === 0 && (
                                    <p className="text-[10px] text-yellow-400 mt-1">No customers found. You need to create a customer first.</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Select Plan</label>
                                <select
                                    required
                                    value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                    className="bg-surface/90 border border-on-surface/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choose a billing plan...</option>
                                    {plans.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name} - {(p.amount_kobo/100).toLocaleString('en-NG', {style:'currency',currency:'NGN'})}/{p.interval}</option>
                                    ))}
                                </select>
                                {plans.length === 0 && (
                                    <p className="text-[10px] text-yellow-400 mt-1">No plans found. You need to create a plan first.</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || customers.length === 0 || plans.length === 0}
                                className="font-label-mono bg-inverse-primary text-on-primary py-3 rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin-custom text-[16px]">sync</span>
                                        Registering...
                                    </>
                                ) : (
                                    "Register Subscriber"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Plan Modal */}
            {showChangePlanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-md rounded-2xl border border-on-surface/10 p-6 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-md text-lg text-white font-bold">Change Subscription Plan</h3>
                            <button onClick={() => { setShowChangePlanModal(null); setNewPlanId(""); }} className="text-on-surface/50 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleChangePlan} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Select New Plan</label>
                                <select
                                    required
                                    value={newPlanId}
                                    onChange={(e) => setNewPlanId(e.target.value)}
                                    className="bg-surface/90 border border-on-surface/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none"
                                >
                                    <option value="" disabled>Choose a plan...</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({(p.amount_kobo / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })})</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !newPlanId}
                                className="font-label-mono bg-inverse-primary text-on-primary py-3 rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin-custom text-[16px]">sync</span>
                                        Changing Plan...
                                    </>
                                ) : (
                                    "Change Plan"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {confirmConfig && (
                <ConfirmationModal {...confirmConfig} />
            )}
        </>
    );
}
