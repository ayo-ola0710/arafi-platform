import { useState, useEffect } from "react";
import { useVirtualAccounts } from "../../store/useVirtualAccounts";
import { useWorkspace } from "../../store/useWorkspace";
import CreateVirtualAccountModal from "../ui/CreateVirtualAccountModal";
import TableSkeleton from "../ui/TableSkeleton";
import EmptyState from "../ui/EmptyState";

export default function VirtualAccountTable() {
    const { accounts, fetch, isLoading } = useVirtualAccounts();
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
                    Virtual Accounts
                </h3>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="border border-outline-variant text-on-surface font-label-mono text-label-mono px-3 py-1 rounded hover:bg-surface-variant transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-[16px]">add</span> Provision
                </button>
            </div>
            
            <div className="overflow-x-auto min-h-[150px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant bg-surface-container-high/30">
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Customer & Bank
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Account Number
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Customer Ref
                            </th>
                            <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="font-code-sm text-code-sm divide-y divide-outline-variant">
                        {isLoading && accounts.length === 0 ? (
                            <TableSkeleton cols={4} colWidths={['w-1/4', 'w-1/5', 'w-1/4', 'w-1/6']} />
                        ) : accounts.length === 0 ? (
                            <EmptyState
                                icon="account_balance"
                                title="No virtual accounts provisioned"
                                description="Provision a dedicated bank account number for a customer to enable direct bank transfers and deposits."
                                ctaLabel="Provision Account"
                                onCtaClick={() => setShowCreateModal(true)}
                            />
                        ) : (
                            accounts.map((account) => (
                                <tr key={account.id} className="hover:bg-surface-container-highest/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-on-surface font-body-md font-medium">{account.account_name || "N/A"}</span>
                                            <span className="text-outline text-xs mt-0.5">{account.bank_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-surface-container-high px-2 py-1 rounded text-primary font-medium tracking-widest">
                                            {account.bank_account_number}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-outline">
                                        {account.customer_ref}
                                    </td>
                                    <td className="px-6 py-4 text-outline">
                                        {account.created_at ? new Date(account.created_at).toLocaleDateString() : "Just now"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {showCreateModal && (
            <CreateVirtualAccountModal
                onDismiss={() => setShowCreateModal(false)}
                onSuccess={() => setShowCreateModal(false)}
            />
        )}
        </>
    );
}
