import { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import EnvironmentBadge from "../components/ui/EnvironmentBadge";
import ApiKeyDisplay from "../components/dashboard/ApiKeyDisplay";
import StatCard from "../components/ui/StatCard";
import { useWorkspace } from "../store/useWorkspace";
import { useBalance } from "../store/useBalance";
import { useSubscriptions } from "../store/useSubscriptions";
import { useCustomers } from "../store/useCustomers";
import { useVirtualAccounts } from "../store/useVirtualAccounts";
import { usePlans } from "../store/usePlans";
import GuidedTour from "../components/ui/GuidedTour";
import TableSkeleton from "../components/ui/TableSkeleton";

export default function Dashboard() {
  const { activeWorkspace } = useWorkspace();
  const { balance, fetch: fetchBalance, isLoading: isLoadingBalance } = useBalance();
  const { subscriptions, fetch: fetchSubscriptions, isLoading: isLoadingSubs } = useSubscriptions();
  const { customers, fetch: fetchCustomers, isLoading: isLoadingCustomers } = useCustomers();
  const { accounts: virtualAccounts, fetch: fetchAccounts, isLoading: isLoadingAccounts } = useVirtualAccounts();
  const { plans, fetch: fetchPlans } = usePlans();

  useEffect(() => {
    if (activeWorkspace) {
      fetchBalance();
      fetchSubscriptions();
      fetchCustomers();
      fetchAccounts();
      fetchPlans();
    }
  }, [activeWorkspace?.app_id]);

  const apiKey = activeWorkspace?.sandbox_key || "sk_test_pending...";
  const maskedKey = apiKey.slice(0, 12) + "••••••" + apiKey.slice(-4);

  // Derived metrics
  const activeSubs = subscriptions.filter(s => s.status.toUpperCase() === 'ACTIVE');
  
  // Quick hack to calculate MRR based on plans (assumes all active subs belong to available plans and amounts are in kobo)
  const mrrKobo = activeSubs.reduce((acc, sub) => {
      const plan = plans.find(p => p.id === sub.plan_id);
      return acc + (plan?.amount_kobo || 0);
  }, 0);

  const formatCurrency = (amountKobo: number, currency = 'NGN') => {
      return (amountKobo / 100).toLocaleString('en-NG', { style: 'currency', currency });
  };

  const formatSplitCurrency = (amountKobo: number, currency = 'NGN') => {
      const amount = formatCurrency(amountKobo, currency);
      const parts = amount.split('.');
      return (
          <>
            {parts[0]}<span className="text-outline">.{parts[1] || '00'}</span>
          </>
      );
  };

  return (
    <DashboardLayout>
      {/* Header Row */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up delay-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Platform Overview
            </h2>
            <EnvironmentBadge />
          </div>
          <p className="text-on-surface-variant">
            A real-time snapshot of your workspace metrics and activity.
          </p>
        </div>

        <ApiKeyDisplay
          apiKey={apiKey}
          maskedKey={maskedKey}
        />
        <div id="tour-api-keys" className="absolute top-0 right-0 w-64 h-16 pointer-events-none" />
      </header>

      {/* Top Metrics Row */}
      <div id="tour-metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter animate-fade-up delay-60 mt-6 relative">
          <StatCard
            title="Available Balance"
            value={
              isLoadingBalance ? (
                <span className="text-on-surface-variant text-lg animate-pulse">Loading...</span>
              ) : (
                balance ? formatSplitCurrency(balance.available_balance, balance.currency || 'NGN') : formatSplitCurrency(0)
              )
            }
            trendText="Ready for payout"
            trendIcon="account_balance_wallet"
          />
          <StatCard
            title="Total Active Subscribers"
            value={
              isLoadingSubs ? (
                <span className="text-on-surface-variant text-lg animate-pulse">...</span>
              ) : (
                <>{activeSubs.length} <span className="text-outline text-lg">subs</span></>
              )
            }
            trendText={`Est MRR: ${formatCurrency(mrrKobo)}`}
            trendColorClass="text-[#10b981]"
            statusDotClass="bg-[#10b981] pulse-status"
          />
          <StatCard
            title="Total Customers"
            value={
              isLoadingCustomers ? (
                <span className="text-on-surface-variant text-lg animate-pulse">...</span>
              ) : (
                <>{customers.length} <span className="text-outline text-lg">customers</span></>
              )
            }
            trendText="Across all plans"
            trendColorClass="text-primary"
            trendIcon="groups"
          />
          <StatCard
            title="Active Virtual Accounts"
            value={
              isLoadingAccounts ? (
                <span className="text-on-surface-variant text-lg animate-pulse">...</span>
              ) : (
                <>{virtualAccounts.length} <span className="text-outline text-lg">accounts</span></>
              )
            }
            trendText="Provisioned for customers"
            trendColorClass="text-tertiary"
            trendIcon="account_balance"
          />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter mt-6 animate-fade-up delay-120">
        
        {/* Quick Actions Panel */}
        <div id="tour-quick-actions" className="surface-panel rounded-xl border border-outline-variant p-6 flex flex-col gap-4 bg-surface-container-low">
            <h3 className="font-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bolt</span> Quick Actions
            </h3>
            <div className="flex flex-col gap-3 mt-2">
                <Link to="/plans" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-colors group">
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">list_alt</span>
                    <div>
                        <p className="font-bold text-on-surface text-sm">Create Plan</p>
                        <p className="text-xs text-on-surface-variant">Setup a new subscription tier</p>
                    </div>
                </Link>
                <Link to="/subscribers" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-colors group">
                    <span className="material-symbols-outlined text-emerald-400 group-hover:scale-110 transition-transform">person_add</span>
                    <div>
                        <p className="font-bold text-on-surface text-sm">Register Subscriber</p>
                        <p className="text-xs text-on-surface-variant">Manually subscribe a customer</p>
                    </div>
                </Link>
                <Link to="/customers" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-colors group">
                    <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">credit_card</span>
                    <div>
                        <p className="font-bold text-on-surface text-sm">Tokenize Card</p>
                        <p className="text-xs text-on-surface-variant">Save a card on file for billing</p>
                    </div>
                </Link>
                <Link to="/payouts/history" className="flex items-center gap-3 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant transition-colors group">
                    <span className="material-symbols-outlined text-yellow-400 group-hover:scale-110 transition-transform">payments</span>
                    <div>
                        <p className="font-bold text-on-surface text-sm">Request Payout</p>
                        <p className="text-xs text-on-surface-variant">Withdraw funds to your bank</p>
                    </div>
                </Link>
            </div>
        </div>

        {/* Recent Activity Tables */}
        <div id="tour-recent-activity" className="xl:col-span-2 flex flex-col gap-6">
            
            {/* Recent Subscribers */}
            <div className="surface-panel rounded-xl overflow-hidden border border-outline-variant flex flex-col bg-surface-container-low min-h-[200px]">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-headline-md text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant">history</span> Recent Subscribers
                    </h3>
                    <Link to="/subscribers" className="text-primary text-xs font-label-mono hover:underline">View All</Link>
                </div>
                <div className="p-0 overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse h-full">
                        <thead className="bg-surface-container">
                            <tr className="border-b border-outline-variant text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-3">Customer ID</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-code-sm">
                            {isLoadingSubs ? (
                                <TableSkeleton cols={3} colWidths={['w-1/4', 'w-1/3', 'w-1/6']} rows={3} />
                            ) : subscriptions.length === 0 ? (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">No subscribers yet.</td></tr>
                            ) : (
                                subscriptions.slice(0, 3).map(sub => {
                                    const p = plans.find(p => p.id === sub.plan_id);
                                    return (
                                        <tr key={sub.id} className="border-b border-outline-variant hover:bg-surface-container transition-colors">
                                            <td className="px-6 py-4 text-on-surface">{sub.customer_id.substring(0,8)}...</td>
                                            <td className="px-6 py-4 text-on-surface-variant">{p?.name || sub.plan_id.substring(0,8)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${
                                                    sub.status === 'active' || sub.status === 'ACTIVE'
                                                        ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                                                        : 'bg-outline-variant/20 text-on-surface-variant border-outline-variant/30'
                                                }`}>
                                                    {sub.status || "UNKNOWN"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Virtual Accounts */}
            <div className="surface-panel rounded-xl overflow-hidden border border-outline-variant flex flex-col bg-surface-container-low min-h-[200px]">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-headline-md text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant">account_balance</span> Recent Virtual Accounts
                    </h3>
                    <Link to="/virtual-accounts" className="text-primary text-xs font-label-mono hover:underline">View All</Link>
                </div>
                <div className="p-0 overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse h-full">
                        <thead className="bg-surface-container">
                            <tr className="border-b border-outline-variant text-on-surface-variant font-label-mono text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-3">Account No</th>
                                <th className="px-6 py-3">Bank Name</th>
                                <th className="px-6 py-3">Customer Ref</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-code-sm">
                            {isLoadingAccounts ? (
                                <TableSkeleton cols={3} colWidths={['w-1/4', 'w-1/3', 'w-1/4']} rows={3} />
                            ) : virtualAccounts.length === 0 ? (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">No virtual accounts created.</td></tr>
                            ) : (
                                virtualAccounts.slice(0, 3).map(acc => (
                                    <tr key={acc.id} className="border-b border-outline-variant hover:bg-surface-container transition-colors">
                                        <td className="px-6 py-4 text-primary font-bold">{acc.bank_account_number}</td>
                                        <td className="px-6 py-4 text-on-surface-variant">{acc.bank_name}</td>
                                        <td className="px-6 py-4 text-on-surface">{acc.customer_ref}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>

      </div>

      <GuidedTour />
    </DashboardLayout>
  );
}
