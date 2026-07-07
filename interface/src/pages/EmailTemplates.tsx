import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import EnvironmentBadge from "../components/ui/EnvironmentBadge";

export default function EmailTemplates() {
  const mockTemplates = [
    { id: "tpl_89fa", name: "Escrow Funds Secured", preset: "escrow_hold", updated_at: "2024-03-12T14:30:00Z" },
    { id: "tpl_3bb2", name: "Invoice Receipt v2", preset: "sub_invoice", updated_at: "2024-02-28T09:15:00Z" },
    { id: "tpl_1cf9", name: "Payout Cleared Alert", preset: "payment_cleared", updated_at: "2024-01-15T11:45:00Z" },
  ];

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up delay-0 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Email Templates
            </h2>
            <EnvironmentBadge />
          </div>
          <p className="text-on-surface-variant">
            Manage your saved transactional email templates.
          </p>
        </div>
        <Link 
            to="/email/builder"
            className="bg-primary text-on-primary font-bold px-4 py-2 rounded-lg font-label-mono text-label-mono hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Create Template
        </Link>
      </header>
      
      <div className="surface-panel rounded-xl overflow-hidden animate-fade-up delay-60 border border-outline-variant/50">
        <div className="px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
            <h3 className="font-headline-md text-headline-md text-on-surface">
                Saved Templates
            </h3>
        </div>
        
        <div className="overflow-x-auto min-h-[150px]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-high/30">
                        <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                            Template ID
                        </th>
                        <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                            Blueprint Used
                        </th>
                        <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                            Last Updated
                        </th>
                        <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="font-code-sm text-code-sm divide-y divide-outline-variant">
                    {mockTemplates.map((tpl) => (
                        <tr key={tpl.id} className="hover:bg-surface-container-highest/30 transition-colors">
                            <td className="px-6 py-4 text-on-surface font-label-mono text-[12px]">
                                {tpl.id}
                            </td>
                            <td className="px-6 py-4 text-on-surface font-body-md font-medium">
                                {tpl.name}
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] uppercase tracking-wider border border-outline-variant/50">
                                    {tpl.preset}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-outline">
                                {new Date(tpl.updated_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link 
                                    to="/email/builder" 
                                    className="text-primary hover:text-primary-container transition-colors font-label-mono text-[11px] uppercase tracking-wider"
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
