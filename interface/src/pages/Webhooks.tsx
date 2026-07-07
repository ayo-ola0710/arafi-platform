import DashboardLayout from "../components/dashboard/DashboardLayout";
import WebhookTable from "../components/ui/WebhookTable";
import EnvironmentBadge from "../components/ui/EnvironmentBadge";

export default function Webhooks() {
  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up delay-0 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Webhooks
            </h2>
            <EnvironmentBadge />
          </div>
          <p className="text-on-surface-variant">
            Manage your webhook endpoints and monitor delivery logs.
          </p>
        </div>
      </header>
      
      <div className="flex flex-col gap-gutter animate-fade-up delay-60">
        <WebhookTable />
      </div>
    </DashboardLayout>
  );
}
