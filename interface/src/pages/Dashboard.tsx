import DashboardLayout from "../components/dashboard/DashboardLayout";
import ApiKeyDisplay from "../components/dashboard/ApiKeyDisplay";
import StatCard from "../components/ui/StatCard";
import EscrowTable from "../components/dashboard/EscrowTable";
import WebhookTable from "../components/ui/WebhookTable";
import { useAuth } from "../store/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  // We use a fallback API key for UI purposes until the backend formally returns one
  const apiKey = "sk_live_xxxxxxxxxxxxxxxx";
  const maskedKey = apiKey.slice(0, 12) + "••••••" + apiKey.slice(-4);
  return (
    <DashboardLayout>
      {/* Header Row */}
      {/* Amber Banner */}
      <div className="bg-tertiary-container text-on-tertiary-container px-margin-desktop py-2 flex items-center justify-center text-sm font-medium z-50 fixed w-full md:w-[calc(100%-16rem)] top-0 left-0 md:left-64">
        <span className="material-symbols-outlined mr-2 text-[18px]">
          warning
        </span>
        Sandbox Mode — Test Data Only
      </div>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up delay-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Payment API
            </h2>
            <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-mono text-[10px] uppercase tracking-wider border border-tertiary/30">
              TEST
            </span>
          </div>
          <p className="text-on-surface-variant">
            Manage virtual accounts, escrows, and webhook events.
          </p>
        </div>

        <ApiKeyDisplay
          apiKey={apiKey}
          maskedKey={maskedKey}
        />
      </header>

      {/* Quick-start & Stats Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter animate-fade-up delay-60">
        {/* Quick-start Panel */}
        <div className="surface-panel rounded-xl lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <span className="font-label-mono text-label-mono text-on-surface">
              Initialize Escrow Checkout
            </span>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
            </div>
          </div>
          <div className="code-bg p-4 flex-1 overflow-x-auto">
            <pre className="font-code-sm text-code-sm text-on-surface-variant leading-relaxed">
              <span className="text-primary">curl</span> -X POST
              https://api.arafi.com/v1/escrow/init \
              <br />
              {"  "}-H{" "}
              <span className="text-secondary">
                "Authorization: Bearer arafi_test_••••••3f2a"
              </span>{" "}
              \
              <br />
              {"  "}-H{" "}
              <span className="text-secondary">
                "Content-Type: application/json"
              </span>{" "}
              \
              <br />
              {"  "}-d '{`{`}
              <br />
              {"    "}
              <span className="text-tertiary">"amount"</span>:{" "}
              <span className="text-inverse-primary">45000</span>,<br />
              {"    "}
              <span className="text-tertiary">"currency"</span>:{" "}
              <span className="text-secondary">"USD"</span>,<br />
              {"    "}
              <span className="text-tertiary">"beneficiary_id"</span>:{" "}
              <span className="text-secondary">"acc_9a8b7c6d"</span>,<br />
              {"    "}
              <span className="text-tertiary">"milestones"</span>: [
              <span className="text-secondary">"capture"</span>,{" "}
              <span className="text-secondary">"delivery"</span>,{" "}
              <span className="text-secondary">"settle"</span>]
              <br />
              {`  }`}'
            </pre>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-gutter">
          <StatCard
            title="Volume (Test)"
            value={
              <>
                $1,240,500.<span className="text-outline">00</span>
              </>
            }
            trendText="+12.5% this week"
            trendIcon="trending_up"
          />
          <StatCard
            title="Active Webhooks"
            value={
              <>
                4 <span className="text-outline text-lg">endpoints</span>
              </>
            }
            trendText="99.9% delivery rate"
            trendColorClass="text-on-surface-variant"
            statusDotClass="bg-[#10b981] pulse-status"
          />
        </div>
      </div>

      <EscrowTable />
      <WebhookTable />
    </DashboardLayout>
  );
}
