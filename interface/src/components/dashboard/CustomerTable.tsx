import { useState, useEffect } from "react";
import { useCustomers } from "../../store/useCustomers";
import { useWorkspace } from "../../store/useWorkspace";
import { deleteCustomerCard, tokenizeCustomerCard } from "../../lib/api/customers";
import ConfirmationModal from "../ui/ConfirmationModal";
import TableSkeleton from "../ui/TableSkeleton";
import EmptyState from "../ui/EmptyState";

export default function CustomerTable() {
    const { customers, fetch, isLoading } = useCustomers();
    const { activeWorkspace } = useWorkspace();
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [confirmConfig, setConfirmConfig] = useState<any>(null);

    useEffect(() => {
        if (activeWorkspace) {
            fetch();
        }
    }, [activeWorkspace?.app_id, fetch]);

    const handleRemoveCard = async (customerId: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Remove Card",
            message: "Are you sure you want to remove the card from this customer?",
            type: "danger",
            confirmText: "Remove",
            onCancel: () => setConfirmConfig(null),
            onConfirm: async () => {
                setConfirmConfig((prev: any) => ({ ...prev, isProcessing: true }));
                setActionLoadingId(customerId);
                try {
                    await deleteCustomerCard(customerId);
                    fetch();
                    setConfirmConfig(null);
                } catch (err: any) {
                    setConfirmConfig({
                        isOpen: true,
                        isAlert: true,
                        title: "Error",
                        message: err?.response?.data?.message || "Failed to remove customer card.",
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

    const handleAddCard = async (customerId: string) => {
        setActionLoadingId(customerId);
        try {
            const currentUrl = window.location.href;
            const res = await tokenizeCustomerCard(customerId, currentUrl);
            window.location.href = res.checkout_url;
        } catch (err: any) {
            setConfirmConfig({
                isOpen: true,
                isAlert: true,
                title: "Error",
                message: err?.response?.data?.message || "Failed to initialize card tokenization.",
                type: "danger",
                confirmText: "OK",
                onConfirm: () => setConfirmConfig(null)
            });
            setActionLoadingId(null);
        }
    };

    return (
        <div className="surface-panel rounded-xl overflow-hidden animate-fade-up delay-120">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                    Customers
                </h3>
            </div>
            
            <div className="overflow-x-auto min-h-[150px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant bg-surface-container-high/30">
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Customer ID
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Card Status
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
                        {isLoading && customers.length === 0 ? (
                            <TableSkeleton cols={6} colWidths={['w-1/4', 'w-1/5', 'w-1/4', 'w-1/8', 'w-1/6', 'w-1/8']} />
                        ) : customers.length === 0 ? (
                            <EmptyState
                                icon="person"
                                title="No customers yet"
                                description="Customers are created automatically when someone completes a checkout. You can also tokenize a card to create one manually."
                            />
                        ) : (
                            customers.map((c) => (
                                <tr key={c.id} className="hover:bg-surface-container-highest/30 transition-colors">
                                    <td className="px-6 py-4 text-on-surface font-label-mono text-[12px]">
                                        {c.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-on-surface">
                                        {c.name || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-on-surface">
                                        {c.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.card_id ? (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                                Card Saved
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border bg-outline-variant/20 text-on-surface-variant border-outline-variant/30">
                                                No Card
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-outline">
                                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6 flex items-center justify-end gap-2">
                                        {actionLoadingId === c.id ? (
                                            <span className="text-on-surface-variant font-label-mono text-[10px] animate-pulse">Processing...</span>
                                        ) : (
                                            <>
                                                {c.card_id ? (
                                                    <button 
                                                        onClick={() => handleRemoveCard(c.id)}
                                                        className="border border-error/30 text-error font-label-mono text-[10px] px-2 py-1 rounded hover:bg-error/10 transition-colors"
                                                    >
                                                        Remove Card
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleAddCard(c.id)}
                                                        className="border border-primary/30 text-primary font-label-mono text-[10px] px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                                                    >
                                                        Add Card
                                                    </button>
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

            {confirmConfig && (
                <ConfirmationModal {...confirmConfig} />
            )}
        </div>
    );
}
