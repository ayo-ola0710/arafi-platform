import DashboardLayout from "../components/dashboard/DashboardLayout";
import SubscriberTable from "../components/dashboard/SubscriberTable";
import EnvironmentBadge from "../components/ui/EnvironmentBadge";

export default function Subscribers() {
  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up delay-0 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Subscribers
            </h2>
            <EnvironmentBadge />
          </div>
          <p className="text-on-surface-variant">
            View and manage users registered to your billing plans.
          </p>
        </div>
      </header>
      
      <div className="flex flex-col gap-gutter animate-fade-up delay-60">
        <SubscriberTable />
      </div>
    </DashboardLayout>
  );
}
