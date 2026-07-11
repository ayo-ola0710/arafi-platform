import { useState, useEffect } from "react";
import { useCoupons } from "../../store/useCoupons";
import { useWorkspace } from "../../store/useWorkspace";
import TableSkeleton from "../ui/TableSkeleton";
import EmptyState from "../ui/EmptyState";

export default function CouponTable() {
    const { coupons, fetch, isLoading, create } = useCoupons();
    const { activeWorkspace } = useWorkspace();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [code, setCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (activeWorkspace) {
            fetch();
        }
    }, [activeWorkspace?.app_id, fetch]);

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        const amountKobo = parseInt(discountAmount) * 100;
        if (isNaN(amountKobo) || amountKobo <= 0) {
            setError("Please enter a valid discount amount.");
            return;
        }

        setSubmitting(true);
        try {
            await create({
                code: code.toUpperCase(),
                discount_amount_kobo: amountKobo,
            });
            setShowCreateModal(false);
            setCode("");
            setDiscountAmount("");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create coupon.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="surface-panel rounded-xl overflow-hidden animate-fade-up delay-120">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                        Discount Coupons
                    </h3>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-primary text-on-primary font-label-mono text-label-mono px-3 py-1.5 rounded hover:brightness-110 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[16px]">add</span> Create Coupon
                    </button>
                </div>
                
                <div className="overflow-x-auto min-h-[150px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-outline-variant bg-surface-container-high/30">
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Coupon Code
                                </th>
                                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                    Discount Amount
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
                            {isLoading && coupons.length === 0 ? (
                                <TableSkeleton cols={4} colWidths={['w-1/6', 'w-1/4', 'w-1/8', 'w-1/5']} />
                            ) : coupons.length === 0 ? (
                                <EmptyState
                                    icon="loyalty"
                                    title="No coupons created"
                                    description="Create discount codes to offer promotions and incentivize subscribers to upgrade or convert."
                                    ctaLabel="Create Coupon"
                                    onCtaClick={() => setShowCreateModal(true)}
                                />
                            ) : (
                                coupons.map((c) => (
                                    <tr key={c.id} className="hover:bg-surface-container-highest/30 transition-colors">
                                        <td className="px-6 py-4 text-on-surface font-label-mono text-[13px] font-bold tracking-wider text-primary">
                                            {c.code}
                                        </td>
                                        <td className="px-6 py-4 text-on-surface">
                                            {(c.discountAmountKobo / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.active ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border bg-outline-variant/20 text-on-surface-variant border-outline-variant/30">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-outline">
                                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
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
                            <h3 className="font-headline-md text-lg text-white font-bold">Create Coupon</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-on-surface/50 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="flex flex-col gap-4">
                            {error && (
                                <div className="text-error font-body-md text-sm bg-error-container/20 border border-error/30 rounded-lg p-3">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. SUMMER50"
                                    className="bg-surface/90 border border-on-surface/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Discount Amount (NGN)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={discountAmount}
                                    onChange={(e) => setDiscountAmount(e.target.value)}
                                    placeholder="e.g. 500"
                                    className="bg-surface/90 border border-on-surface/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !code.trim() || !discountAmount}
                                className="font-label-mono bg-inverse-primary text-on-primary py-3 rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin-custom text-[16px]">sync</span>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Coupon"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
