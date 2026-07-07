import DashboardLayout from "../components/dashboard/DashboardLayout";
import ApiKeyCard from "../components/dashboard/ApiKeyCard";
import GenerateKeyModal from "../components/ui/GenerateKeyModal";
import { useState } from "react";

export default function ApiKeys() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  return (
    <DashboardLayout>
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-glow"></div>
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBswqQ0sByl-0hkg9vn3sD0kYOXgX6TAs-cEd0gbu1VHVv8YUDio5ua4dRBpLidLzt7Rwe67pGc47bKO8112cjrKYjJWt7lp5H85elyP8OkxqHPSktfKn1_t1B1IzWu676okcUMIr6CS-0CjESGDZ-W3vKPRVlKFTrBJBHuJ8heDNpHnN2E1bfgnn1E1YP1eF1J6wR54RnUWLCyy2g7j5gIMyt38FTYSah2eYIf094b1LfMCzMAuLNdt_W_7z7kr1-6fwWDjV5srSbX')",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-300 mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">
              API Keys
            </h2>
            <p className="text-on-surface-variant text-body-lg max-w-2xl">
              Manage your environment-specific credentials and access tokens.
            </p>
          </div>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="bg-primary text-on-primary font-bold px-4 py-2 rounded-lg font-label-mono text-label-mono hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Generate Key
          </button>
        </header>

        {/* Live Keys Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Keys
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApiKeyCard
              title="Production Default"
              createdAt="Oct 24, 2023"
              status="ACTIVE"
              keyPrefix="sk_live_"
            />
            <ApiKeyCard
              title="Mobile App Auth"
              createdAt="Nov 12, 2023"
              status="ACTIVE"
              keyPrefix="sk_live_"
            />
          </div>
        </section>

        {/* Test Keys Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
              Test Keys
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApiKeyCard
              title="Staging Env Default"
              createdAt="Oct 24, 2023"
              status="TESTING"
              keyPrefix="sk_test_"
            />
            <ApiKeyCard
              title="Local Dev (Alice)"
              createdAt="Jan 05, 2024"
              status="TESTING"
              keyPrefix="sk_test_"
            />
          </div>
        </section>
      </div>

      {showGenerateModal && (
        <GenerateKeyModal
          onDismiss={() => setShowGenerateModal(false)}
          onSuccess={() => setShowGenerateModal(false)}
        />
      )}
    </DashboardLayout>
  );
}
