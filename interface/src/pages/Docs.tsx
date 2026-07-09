import { useState } from "react";
import BackgroundShader from "../components/ui/BackgroundShader";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

type DocTab = "docs" | "api-ref";

type GuideId = "welcome" | "keys" | "webhook" | "escrow" | "sdk";
type ApiId = "auth" | "customers" | "plans" | "subscriptions" | "products" | "coupons" | "payouts" | "ledger";

type CodeLang = "curl" | "javascript" | "java";

interface EndpointSpec {
  method: "POST" | "GET" | "PUT" | "DELETE";
  path: string;
  desc: string;
  headers: Record<string, string>;
  params?: { name: string; type: string; req: boolean; desc: string }[];
  requestPayload?: string;
  responses: {
    code: number;
    status: string;
    payload: string;
  }[];
  snippets: Record<CodeLang, string>;
}

export default function Docs() {
  const [activeTab, setActiveTab] = useState<DocTab>("docs");
  
  // Active Sidebar items
  const [activeGuide, setActiveGuide] = useState<GuideId>("welcome");
  const [activeApi, setActiveApi] = useState<ApiId>("customers");
  
  // Snippet language selection
  const [codeLang, setCodeLang] = useState<CodeLang>("curl");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const API_SPECS: Record<ApiId, EndpointSpec> = {
    auth: {
      method: "POST",
      path: "/v1/auth/token",
      desc: "Retrieve an authentication token for administrative workspace operations. Generates a temporary session token using client secrets.",
      headers: {
        "Content-Type": "application/json",
      },
      params: [
        { name: "clientId", type: "string", req: true, desc: "Workspace Client ID" },
        { name: "clientSecret", type: "string", req: true, desc: "Workspace Client Secret" }
      ],
      requestPayload: JSON.stringify({
        clientId: "ca1c9568-c875-4c76-a410-a68ae306fa30",
        clientSecret: "sc_9928abc..."
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            accessToken: "token_ey99281...",
            expiresIn: 3600,
            tokenType: "Bearer"
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/auth/token \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "clientId": "ca1c9568-c875-4c76-a410-a68ae306fa30",\n    "clientSecret": "sc_9928abc..."\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/auth/token", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    clientId: "ca1c9568-c875-4c76-a410-a68ae306fa30",\n    clientSecret: "sc_9928abc..."\n  })\n});\nconst data = await res.json();`,
        java: `HttpResponse<String> response = HttpClient.newHttpClient().send(\n    HttpRequest.newBuilder()\n        .uri(URI.create("https://api.arafi.com/v1/auth/token"))\n        .header("Content-Type", "application/json")\n        .POST(BodyPublishers.ofString("{\\"clientId\\": \\"...\\", \\"clientSecret\\": \\"...\\"}"))\n        .build(),\n    BodyHandlers.ofString()\n);`
      }
    },
    customers: {
      method: "POST",
      path: "/v1/customers",
      desc: "Creates a billing profile customer mapped to the authenticated app workspace. Requires API key authentication.",
      headers: {
        "Authorization": "Bearer arafi_test_...",
        "Content-Type": "application/json"
      },
      params: [
        { name: "email", type: "string", req: true, desc: "Unique email address for this billing context." },
        { name: "name", type: "string", req: true, desc: "Customer full name. Required to generate valid virtual bank accounts." },
        { name: "externalRef", type: "string", req: false, desc: "External system database reference key." }
      ],
      requestPayload: JSON.stringify({
        email: "customer@example.com",
        name: "Adedayo Olamide",
        externalRef: "db_ref_10092"
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            id: "b089e7d1-2258-427c-a929-a3feb8d941f4",
            appId: "ca1c9568-c875-4c76-a410-a68ae306fa30",
            email: "customer@example.com",
            name: "Adedayo Olamide",
            externalRef: "db_ref_10092",
            createdAt: "2026-07-09T20:13:42Z"
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/customers \\\n  -H "Authorization: Bearer arafi_test_..." \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "email": "customer@example.com",\n    "name": "Adedayo Olamide",\n    "externalRef": "db_ref_10092"\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/customers", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer arafi_test_...",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    email: "customer@example.com",\n    name: "Adedayo Olamide",\n    externalRef: "db_ref_10092"\n  })\n});\nconst customer = await res.json();`,
        java: `HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/customers"))\n    .header("Authorization", "Bearer arafi_test_...")\n    .header("Content-Type", "application/json")\n    .POST(BodyPublishers.ofString("{\\"email\\": \\"customer@example.com\\", \\"name\\": \\"Adedayo Olamide\\"}"))\n    .build();`
      }
    },
    plans: {
      method: "POST",
      path: "/v1/plans",
      desc: "Creates a billing pricing model. Plans define billing intervals (DAILY, WEEKLY, MONTHLY, YEARLY) and cost in Kobo.",
      headers: {
        "Authorization": "Bearer arafi_test_...",
        "Content-Type": "application/json"
      },
      params: [
        { name: "name", type: "string", req: true, desc: "Name of the subscription plan." },
        { name: "amountKobo", type: "number", req: true, desc: "Pricing cost in kobo (NGN). e.g., 500000 = 5,000 NGN." },
        { name: "billingPeriod", type: "string", req: true, desc: "One of: DAILY, WEEKLY, MONTHLY, YEARLY." },
        { name: "description", type: "string", req: false, desc: "Brief plan features overview." }
      ],
      requestPayload: JSON.stringify({
        name: "Pro Monthly",
        amountKobo: 500000,
        billingPeriod: "MONTHLY",
        description: "Unlimited access to dashboard stats"
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            id: "dfb4510c-a527-4da1-a137-fd683b9b3c57",
            name: "Pro Monthly",
            amountKobo: 500000,
            billingPeriod: "MONTHLY",
            description: "Unlimited access to dashboard stats"
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/plans \\\n  -H "Authorization: Bearer arafi_test_..." \\\n  -d '{\n    "name": "Pro Monthly",\n    "amountKobo": 500000,\n    "billingPeriod": "MONTHLY"\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/plans", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer arafi_test_...",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    name: "Pro Monthly",\n    amountKobo: 500000,\n    billingPeriod: "MONTHLY"\n  })\n});`,
        java: `// Register a standard subscription pricing plan\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/plans"))\n    .header("Authorization", "Bearer arafi_test_...")\n    .POST(BodyPublishers.ofString("{\\"name\\": \\"Pro\\", \\"amountKobo\\": 500000}"))\n    .build();`
      }
    },
    subscriptions: {
      method: "POST",
      path: "/v1/subscriptions",
      desc: "Subscribe a registered customer to a plan. Returns the checkout URL (hosted page) for payment routing.",
      headers: {
        "Authorization": "Bearer arafi_test_...",
        "Content-Type": "application/json"
      },
      params: [
        { name: "customerId", type: "string", req: true, desc: "UUID of the customer profile." },
        { name: "planId", type: "string", req: true, desc: "UUID of the target plan pricing model." },
        { name: "paymentMethod", type: "string", req: true, desc: "Preferred gateway: CARD or BANK_TRANSFER." }
      ],
      requestPayload: JSON.stringify({
        customerId: "b089e7d1-2258-427c-a929-a3feb8d941f4",
        planId: "dfb4510c-a527-4da1-a137-fd683b9b3c57",
        paymentMethod: "BANK_TRANSFER"
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            id: "sub_1092abc...",
            customerId: "b089e7d1-2258-427c-a929-a3feb8d941f4",
            planId: "dfb4510c-a527-4da1-a137-fd683b9b3c57",
            status: "PENDING",
            paymentMethod: "BANK_TRANSFER",
            checkoutUrl: "https://checkout.arafi.com/checkout/sub_1092abc..."
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/subscriptions \\\n  -H "Authorization: Bearer arafi_test_..." \\\n  -d '{\n    "customerId": "b089e7d1-2258-427c-a929-a3feb8d941f4",\n    "planId": "dfb4510c-a527-4da1-a137-fd683b9b3c57",\n    "paymentMethod": "BANK_TRANSFER"\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/subscriptions", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer arafi_test_...",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    customerId: "b089...",\n    planId: "dfb4...",\n    paymentMethod: "BANK_TRANSFER"\n  })\n});`,
        java: `// Initialize subscription checkout\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/subscriptions"))\n    .POST(BodyPublishers.ofString("{\\"customerId\\":\\"...\\", \\"planId\\":\\"...\\"}"))\n    .build();`
      }
    },
    products: {
      method: "POST",
      path: "/v1/products",
      desc: "Creates a single e-commerce product structure for one-off checkouts.",
      headers: {
        "Authorization": "Bearer arafi_test_...",
        "Content-Type": "application/json"
      },
      params: [
        { name: "name", type: "string", req: true, desc: "Product display name." },
        { name: "sku", type: "string", req: true, desc: "Stock keeping unit identifier code." },
        { name: "priceKobo", type: "number", req: true, desc: "Price in kobo currency. e.g. 150000 = 1,500 NGN." },
        { name: "description", type: "string", req: false, desc: "Product specifications details." }
      ],
      requestPayload: JSON.stringify({
        name: "Wireless Earbuds",
        sku: "EARBUD-V5",
        priceKobo: 2500000,
        description: "Noise cancelling wireless earbuds"
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            id: "prod_earbud_091",
            name: "Wireless Earbuds",
            sku: "EARBUD-V5",
            priceKobo: 2500000,
            description: "Noise cancelling wireless earbuds"
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/products \\\n  -H "Authorization: Bearer arafi_test_..." \\\n  -d '{\n    "name": "Wireless Earbuds",\n    "sku": "EARBUD-V5",\n    "priceKobo": 2500000\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/products", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer arafi_test_...",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    name: "Wireless Earbuds",\n    sku: "EARBUD-V5",\n    priceKobo: 2500000\n  })\n});`,
        java: `// Create a product record for e-commerce checkout\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/products"))\n    .POST(BodyPublishers.ofString("{\\"name\\": \\"Earbuds\\", \\"priceKobo\\": 2500000}"))\n    .build();`
      }
    },
    coupons: {
      method: "POST",
      path: "/v1/coupons",
      desc: "Registers discount codes for subscription checkout sessions. Percentages are dynamically deducted during payment.",
      headers: {
        "Authorization": "Bearer arafi_test_...",
        "Content-Type": "application/json"
      },
      params: [
        { name: "code", type: "string", req: true, desc: "Discount code trigger string. e.g. SUMMER50" },
        { name: "discountPercent", type: "number", req: true, desc: "Discount percentage from 1 to 100." },
        { name: "expiresAt", type: "string", req: true, desc: "ISO-8601 validity deadline timestamp." }
      ],
      requestPayload: JSON.stringify({
        code: "SUMMER50",
        discountPercent: 50,
        expiresAt: "2026-08-30T00:00:00Z"
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            id: "coupon_abc123",
            code: "SUMMER50",
            discountPercent: 50,
            expiresAt: "2026-08-30T00:00:00Z"
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/coupons \\\n  -H "Authorization: Bearer arafi_test_..." \\\n  -d '{\n    "code": "SUMMER50",\n    "discountPercent": 50,\n    "expiresAt": "2026-08-30T00:00:00Z"\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/coupons", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer arafi_test_...",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    code: "SUMMER50",\n    discountPercent: 50,\n    expiresAt: "2026-08-30T00:00:00Z"\n  })\n});`,
        java: `// Register discount coupon code\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/coupons"))\n    .POST(BodyPublishers.ofString("{\\"code\\": \\"SUMMER50\\", \\"discountPercent\\": 50}"))\n    .build();`
      }
    },
    payouts: {
      method: "POST",
      path: "/v1/payouts",
      desc: "Executes instant settlements from developer's isolated sub-account balances to standard commercial bank accounts.",
      headers: {
        "Authorization": "Bearer arafi_test_...",
        "Content-Type": "application/json"
      },
      params: [
        { name: "amountKobo", type: "number", req: true, desc: "Amount in Kobo to settle." },
        { name: "bankCode", type: "string", req: true, desc: "Target CBN bank clearing identifier code. e.g. 044 (Access Bank)" },
        { name: "accountNumber", type: "string", req: true, desc: "10-digit NUBAN destination account number." },
        { name: "accountName", type: "string", req: true, desc: "Target beneficiary verification name." }
      ],
      requestPayload: JSON.stringify({
        amountKobo: 1500000,
        bankCode: "044",
        accountNumber: "0123456789",
        accountName: "Arafi Merchant Settlement Account"
      }, null, 2),
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            id: "pay_1092abc...",
            amountKobo: 1500000,
            status: "SUCCESS",
            reference: "settle_ref_09112",
            beneficiaryName: "Arafi Merchant Settlement Account",
            createdAt: "2026-07-09T20:13:42Z"
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X POST https://api.arafi.com/v1/payouts \\\n  -H "Authorization: Bearer arafi_test_..." \\\n  -d '{\n    "amountKobo": 1500000,\n    "bankCode": "044",\n    "accountNumber": "0123456789",\n    "accountName": "Settlement Account"\n  }'`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/payouts", {\n  method: "POST",\n  headers: {\n    "Authorization": "Bearer arafi_test_...",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    amountKobo: 1500000,\n    bankCode: "044",\n    accountNumber: "0123456789",\n    accountName: "Settlement Account"\n  })\n});`,
        java: `// Disburse accumulated merchant payouts\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/payouts"))\n    .POST(BodyPublishers.ofString("{\\"amountKobo\\": 1500000, \\"accountNumber\\": \\"0123456789\\"}"))\n    .build();`
      }
    },
    ledger: {
      method: "GET",
      path: "/v1/balances",
      desc: "Fetches complete append-only ledger transaction histories, bookkeeping logs, and current balances for the workspace.",
      headers: {
        "Authorization": "Bearer arafi_test_..."
      },
      responses: [
        {
          code: 200,
          status: "OK",
          payload: JSON.stringify({
            balanceKobo: 4500000,
            history: [
              {
                id: "ledger_log_9921",
                amount: 5000.00,
                entryType: "CREDIT",
                bankAccountNumber: "1203928122 (Nomba Bank)",
                createdAt: "2026-07-09T20:13:42Z"
              }
            ]
          }, null, 2)
        }
      ],
      snippets: {
        curl: `curl -X GET https://api.arafi.com/v1/balances \\\n  -H "Authorization: Bearer arafi_test_..."`,
        javascript: `const res = await fetch("https://api.arafi.com/v1/balances", {\n  method: "GET",\n  headers: { "Authorization": "Bearer arafi_test_..." }\n});\nconst ledger = await res.json();`,
        java: `// Fetch workspace ledger status\nHttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("https://api.arafi.com/v1/balances"))\n    .header("Authorization", "Bearer arafi_test_...")\n    .GET()\n    .build();`
      }
    }
  };

  return (
    <div className="text-on-surface antialiased min-h-screen flex flex-col font-body-md selection:bg-primary/30 selection:text-primary-fixed bg-glow">
      <BackgroundShader />
      <Navbar />

      {/* Main Container */}
      <div className="grow pt-28 flex flex-col w-full">
        {/* Sub-Header Navbar Selection */}
        <div className="w-full border-b border-on-surface/10 bg-surface/50 backdrop-blur-md sticky top-[72px] z-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab("docs")}
                className={`text-sm font-semibold relative py-4 transition-colors ${
                  activeTab === "docs" ? "text-primary" : "text-on-surface/60 hover:text-white"
                }`}
              >
                Documentation
                {activeTab === "docs" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-fade-in"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("api-ref")}
                className={`text-sm font-semibold relative py-4 transition-colors ${
                  activeTab === "api-ref" ? "text-primary" : "text-on-surface/60 hover:text-white"
                }`}
              >
                API Reference
                {activeTab === "api-ref" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-fade-in"></span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full font-label-mono uppercase tracking-wider">
                API Version v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Dual Tab Views */}
        <div className="grow w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          
          {/* LEFT SIDEBAR SECTION */}
          <aside className="lg:col-span-3 flex flex-col gap-1.5 self-start lg:sticky lg:top-[144px] max-h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
            
            {activeTab === "docs" ? (
              <>
                <h3 className="font-label-mono text-[10px] text-on-surface/40 uppercase tracking-widest px-3 mb-2">Getting Started</h3>
                <button
                  onClick={() => setActiveGuide("welcome")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center gap-2.5 border ${
                    activeGuide === "welcome"
                      ? "bg-primary/10 border-primary/20 text-white font-semibold"
                      : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  Welcome to Arafi
                </button>
                <button
                  onClick={() => setActiveGuide("keys")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center gap-2.5 border ${
                    activeGuide === "keys"
                      ? "bg-primary/10 border-primary/20 text-white font-semibold"
                      : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  Obtain API Keys
                </button>

                <h3 className="font-label-mono text-[10px] text-on-surface/40 uppercase tracking-widest px-3 mt-6 mb-2">Platform Features</h3>
                <button
                  onClick={() => setActiveGuide("webhook")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center gap-2.5 border ${
                    activeGuide === "webhook"
                      ? "bg-primary/10 border-primary/20 text-white font-semibold"
                      : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">settings_ethernet</span>
                  Webhook Architecture
                </button>
                <button
                  onClick={() => setActiveGuide("escrow")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center gap-2.5 border ${
                    activeGuide === "escrow"
                      ? "bg-primary/10 border-primary/20 text-white font-semibold"
                      : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  Milestone Escrow hold
                </button>
                <button
                  onClick={() => setActiveGuide("sdk")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center gap-2.5 border ${
                    activeGuide === "sdk"
                      ? "bg-primary/10 border-primary/20 text-white font-semibold"
                      : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  SDK & Client Libraries
                </button>
              </>
            ) : (
              <>
                <h3 className="font-label-mono text-[10px] text-on-surface/40 uppercase tracking-widest px-3 mb-2">Core Access</h3>
                <button
                  onClick={() => setActiveApi("auth")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "auth" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Authenticate Token</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <h3 className="font-label-mono text-[10px] text-on-surface/40 uppercase tracking-widest px-3 mt-6 mb-2">API Operations</h3>
                
                <button
                  onClick={() => setActiveApi("customers")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "customers" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Register Customer</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <button
                  onClick={() => setActiveApi("plans")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "plans" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Configure Billing Plan</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <button
                  onClick={() => setActiveApi("subscriptions")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "subscriptions" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Create Subscription</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <button
                  onClick={() => setActiveApi("products")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "products" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Register Product</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <button
                  onClick={() => setActiveApi("coupons")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "coupons" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Create Coupon</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <button
                  onClick={() => setActiveApi("payouts")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "payouts" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Trigger Payout Settlement</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">POST</span>
                </button>

                <button
                  onClick={() => setActiveApi("ledger")}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-between border ${
                    activeApi === "ledger" ? "bg-primary/10 border-primary/20 text-white font-semibold" : "border-transparent text-on-surface/60 hover:bg-on-surface/5 hover:text-white"
                  }`}
                >
                  <span>Fetch Ledger Balance</span>
                  <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono">GET</span>
                </button>
              </>
            )}
          </aside>

          {/* MIDDLE & RIGHT RENDER PANELS */}
          <div className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            {/* VIEW TAB: DOCUMENTATION */}
            {activeTab === "docs" && (
              <div className="xl:col-span-12 glass-card rounded-2xl border border-on-surface/10 p-8 md:p-10 shadow-2xl relative bg-surface/30">
                
                {activeGuide === "welcome" && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <header className="border-b border-on-surface/10 pb-5">
                      <h1 className="font-headline-lg text-2xl font-bold text-white mb-2">Welcome to Arafi</h1>
                      <p className="text-on-surface/60 text-sm">Simplifying recurring payments and logic orchestrations on Nomba rails.</p>
                    </header>

                    {/* JUDGE CREDENTIALS AURA */}
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col gap-3">
                      <div className="flex items-center gap-2.5 text-primary">
                        <span className="material-symbols-outlined text-[22px]">gavel</span>
                        <h3 className="font-headline-sm font-bold text-white text-base">Hackathon Judge Credentials</h3>
                      </div>
                      <p className="text-on-surface/80 text-xs leading-relaxed">
                        Use these pre-configured credentials to login, navigate the multi-tenant ledger, trigger product checkouts, or mock billing renewals:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-surface/80 rounded-xl p-3 border border-on-surface/10 relative">
                          <span className="text-[10px] text-on-surface/50 uppercase block mb-1">Email Address</span>
                          <span className="text-xs font-mono text-white font-semibold select-all">judge@nomba.com</span>
                          <button
                            onClick={() => handleCopy("judge@nomba.com", "email")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/50 hover:text-white transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {copiedText === "email" ? "done" : "content_copy"}
                            </span>
                          </button>
                        </div>
                        <div className="bg-surface/80 rounded-xl p-3 border border-on-surface/10 relative">
                          <span className="text-[10px] text-on-surface/50 uppercase block mb-1">Password</span>
                          <span className="text-xs font-mono text-white font-semibold select-all">nomba2026</span>
                          <button
                            onClick={() => handleCopy("nomba2026", "pass")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/50 hover:text-white transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {copiedText === "pass" ? "done" : "content_copy"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <article className="flex flex-col gap-4 text-on-surface/80 text-sm leading-relaxed">
                      <h3 className="font-headline-sm font-bold text-white text-base mt-2">What is Arafi?</h3>
                      <p>
                        Building recurring billing systems or single-item checkouts on raw payment gateways requires building state machines, card tokenization vaults, retry schedulers, and ledgers. A single logic bug breaks customer trust.
                      </p>
                      <p>
                        Arafi encapsulates this complexity. By offering unified merchant dashboards and standard webhook routers, we bridge the gap between payment processing and app logic.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-5 rounded-2xl border border-on-surface/10 bg-on-surface/5">
                          <h4 className="font-semibold text-white text-sm mb-2">Sandbox environment</h4>
                          <p className="text-xs text-on-surface/60">Test card checkout routing and transfer credits instantly via UI simulators with zero financial exposure.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-on-surface/10 bg-on-surface/5">
                          <h4 className="font-semibold text-white text-sm mb-2">Live Production environment</h4>
                          <p className="text-xs text-on-surface/60">Connect your actual Nomba account configurations to deploy real-world cash checkouts safely.</p>
                        </div>
                      </div>
                    </article>
                  </div>
                )}

                {activeGuide === "keys" && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <header className="border-b border-on-surface/10 pb-5">
                      <h1 className="font-headline-lg text-2xl font-bold text-white mb-2">Obtain API Keys</h1>
                      <p className="text-on-surface/60 text-sm">Authorizing your application workspace credentials.</p>
                    </header>
                    <article className="flex flex-col gap-4 text-on-surface/80 text-sm leading-relaxed">
                      <p>
                        To begin routing checkouts, you need to sign calls using a Bearer token key linked to your workspace. 
                      </p>
                      <h3 className="font-semibold text-white text-sm mt-3">Step-by-step Setup:</h3>
                      <ol className="list-decimal pl-5 flex flex-col gap-3 text-xs">
                        <li>Log in to your Arafi Dashboard using your account credentials.</li>
                        <li>Navigate to the **Developers** settings page.</li>
                        <li>Click **Generate API Key** under the test or live mode toggles.</li>
                        <li>Save the key immediately. We prefix test keys with `arafi_test_` and production keys with `arafi_live_`.</li>
                      </ol>
                      
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4 flex gap-3 text-xs">
                        <span className="material-symbols-outlined text-yellow-500">warning</span>
                        <p className="text-on-surface/80 leading-normal">
                          <strong>Do not share client secrets:</strong> Keep your keys hidden in server-side environments. Never expose them inside static client-side web packages.
                        </p>
                      </div>
                    </article>
                  </div>
                )}

                {activeGuide === "webhook" && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <header className="border-b border-on-surface/10 pb-5">
                      <h1 className="font-headline-lg text-2xl font-bold text-white mb-2">Webhook Architecture</h1>
                      <p className="text-on-surface/60 text-sm">Asynchronous transactional event loops and retry states.</p>
                    </header>
                    <article className="flex flex-col gap-4 text-on-surface/80 text-sm leading-relaxed">
                      <p>
                        Arafi utilizes an event-driven framework to handle payment confirmations from payment gateways and notify your application server.
                      </p>
                      <h3 className="font-semibold text-white text-sm mt-3">Reliability Protocol</h3>
                      <ul className="list-disc pl-5 flex flex-col gap-2.5 text-xs">
                        <li><strong> Lightweight Ingestion:</strong> Gateway webhooks are saved instantly to a local raw outbox database rather than being executed synchronously, preventing gateway timeout loops.</li>
                        <li><strong>Signature Verification:</strong> All event payloads are digitally verified via payload hash validation before billing routines resume.</li>
                        <li><strong>Exponential Backoff Retries:</strong> If your server returns an error response, Arafi automatically retry webhook dispatches up to 5 times at increasing intervals.</li>
                      </ul>
                    </article>
                  </div>
                )}

                {activeGuide === "escrow" && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <header className="border-b border-on-surface/10 pb-5">
                      <h1 className="font-headline-lg text-2xl font-bold text-white mb-2">Milestone Escrow Hold</h1>
                      <p className="text-on-surface/60 text-sm">Securing transaction payouts for P2P and marketplace checkouts.</p>
                    </header>
                    <article className="flex flex-col gap-4 text-on-surface/80 text-sm leading-relaxed">
                      <p>
                        Arafi's roadmap includes a programmatic milestone-based escrow framework designed for peer-to-peer commerce and service agreements.
                      </p>
                      <h3 className="font-semibold text-white text-sm mt-3">Operational Loop:</h3>
                      <ol className="list-decimal pl-5 flex flex-col gap-2.5 text-xs">
                        <li><strong>Escrow Pocket:</strong> Customer funds are held programmatically inside isolated virtual account pockets.</li>
                        <li><strong>Confirmation:</strong> Funds remain locked until the buyer issues a delivery confirmation or an integrated courier API issues a success event.</li>
                        <li><strong>Payout Release:</strong> Arafi releases the ledger credits directly to the seller's verified sub-account.</li>
                      </ol>
                    </article>
                  </div>
                )}

                {activeGuide === "sdk" && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <header className="border-b border-on-surface/10 pb-5">
                      <h1 className="font-headline-lg text-2xl font-bold text-white mb-2">SDK & Client Libraries</h1>
                      <p className="text-on-surface/60 text-sm">Drop-in checkout buttons and payment widget overlays.</p>
                    </header>
                    <article className="flex flex-col gap-4 text-on-surface/80 text-sm leading-relaxed">
                      <p>
                        Arafi provides client libraries to quickly integrate checkout widgets into React, Vue, Next.js, and mobile applications.
                      </p>
                      <div className="bg-on-surface/5 border border-on-surface/10 rounded-2xl p-5 mt-3">
                        <span className="text-[10px] text-primary uppercase font-mono block mb-2 font-bold font-semibold">Example JS Integration</span>
                        <pre className="text-xs font-mono text-on-surface/80 overflow-x-auto whitespace-pre-wrap">
{`import { ArafiCheckout } from '@arafi/widget';

ArafiCheckout.init({
  publishableKey: 'arafi_test_xyz100...',
  onSuccess: (transaction) => {
    console.log('Payment complete!', transaction.id);
  }
});`}
                        </pre>
                      </div>
                    </article>
                  </div>
                )}
              </div>
            )}

            {/* VIEW TAB: API REFERENCE (3-COLUMN INTERACTIVE SWAGGER) */}
            {activeTab === "api-ref" && (
              <>
                {/* MIDDLE COLUMN: Endpoints Parameter details */}
                <div className="xl:col-span-6 flex flex-col gap-6 animate-fade-in glass-card rounded-2xl border border-on-surface/10 p-6 md:p-8 bg-surface/30">
                  <header className="border-b border-on-surface/10 pb-5">
                    <div className="flex items-center gap-3.5 mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded font-mono ${
                        API_SPECS[activeApi].method === "GET" ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                      }`}>
                        {API_SPECS[activeApi].method}
                      </span>
                      <h2 className="text-white font-mono text-sm select-all">{API_SPECS[activeApi].path}</h2>
                    </div>
                    <p className="text-on-surface/60 text-xs leading-relaxed">
                      {API_SPECS[activeApi].desc}
                    </p>
                  </header>

                  {/* Header Options */}
                  <div className="flex flex-col gap-3">
                    <h3 className="font-semibold text-white text-xs">Request Headers</h3>
                    <div className="border border-on-surface/10 rounded-xl overflow-hidden text-[11px] bg-surface/50">
                      <div className="grid grid-cols-3 bg-on-surface/5 px-4 py-2 font-semibold text-on-surface/50 border-b border-on-surface/10">
                        <span>Header</span>
                        <span>Type</span>
                        <span>Value</span>
                      </div>
                      {Object.entries(API_SPECS[activeApi].headers).map(([key, val]) => (
                        <div key={key} className="grid grid-cols-3 px-4 py-2.5 border-b border-on-surface/10 font-mono text-on-surface/85">
                          <span>{key}</span>
                          <span className="text-primary">String</span>
                          <span className="text-white truncate">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parameters Table */}
                  {API_SPECS[activeApi].params && (
                    <div className="flex flex-col gap-3 mt-2">
                      <h3 className="font-semibold text-white text-xs">Query / Body Parameters</h3>
                      <div className="border border-on-surface/10 rounded-xl overflow-hidden text-[11px] bg-surface/50">
                        <div className="grid grid-cols-4 bg-on-surface/5 px-4 py-2 font-semibold text-on-surface/50 border-b border-on-surface/10">
                          <span>Field</span>
                          <span>Type</span>
                          <span>Required</span>
                          <span>Description</span>
                        </div>
                        {API_SPECS[activeApi].params.map((param) => (
                          <div key={param.name} className="grid grid-cols-4 px-4 py-3 border-b border-on-surface/10 items-start">
                            <span className="font-mono text-white font-semibold truncate">{param.name}</span>
                            <span className="font-mono text-primary truncate">{param.type}</span>
                            <span>{param.req ? <span className="text-red-400 font-semibold font-mono">true</span> : <span className="text-on-surface/40 font-mono">false</span>}</span>
                            <span className="text-on-surface/60 leading-normal">{param.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Code Snippets & Mock Response Models */}
                <div className="xl:col-span-6 flex flex-col gap-6 xl:sticky xl:top-[144px]">
                  
                  {/* Snippets Container */}
                  <div className="rounded-2xl border border-on-surface/10 overflow-hidden shadow-xl bg-surface/90 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#090b0e] border-b border-on-surface/10">
                      <span className="text-[10px] uppercase font-bold text-on-surface/40 font-mono">Code Snippet</span>
                      
                      {/* Language Selection */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCodeLang("curl")}
                          className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            codeLang === "curl" ? "bg-primary/20 text-primary font-bold" : "text-on-surface/50 hover:text-white"
                          }`}
                        >
                          cURL
                        </button>
                        <button
                          onClick={() => setCodeLang("javascript")}
                          className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            codeLang === "javascript" ? "bg-primary/20 text-primary font-bold" : "text-on-surface/50 hover:text-white"
                          }`}
                        >
                          JS Fetch
                        </button>
                        <button
                          onClick={() => setCodeLang("java")}
                          className={`px-2 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                            codeLang === "java" ? "bg-primary/20 text-primary font-bold" : "text-on-surface/50 hover:text-white"
                          }`}
                        >
                          Java 21
                        </button>
                      </div>
                    </div>

                    <div className="relative p-4 font-mono text-[10px] text-white overflow-x-auto min-h-[120px] whitespace-pre bg-[#0d0f12]">
                      <button
                        onClick={() => handleCopy(API_SPECS[activeApi].snippets[codeLang], "snippet")}
                        className="absolute right-3 top-3 text-on-surface/40 hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {copiedText === "snippet" ? "done" : "content_copy"}
                        </span>
                      </button>
                      <code>{API_SPECS[activeApi].snippets[codeLang]}</code>
                    </div>
                  </div>

                  {/* Body Payload (if any) */}
                  {API_SPECS[activeApi].requestPayload && (
                    <div className="rounded-2xl border border-on-surface/10 overflow-hidden shadow-xl bg-surface/90 flex flex-col">
                      <div className="px-4 py-2 bg-[#090b0e] border-b border-on-surface/10 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-on-surface/40 font-mono">Request Payload (JSON)</span>
                        <button
                          onClick={() => handleCopy(API_SPECS[activeApi].requestPayload || "", "payload")}
                          className="text-on-surface/40 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {copiedText === "payload" ? "done" : "content_copy"}
                          </span>
                        </button>
                      </div>
                      <pre className="p-4 font-mono text-[10px] text-on-surface/80 overflow-x-auto bg-[#0d0f12]">
                        {API_SPECS[activeApi].requestPayload}
                      </pre>
                    </div>
                  )}

                  {/* Response Container */}
                  <div className="rounded-2xl border border-on-surface/10 overflow-hidden shadow-xl bg-surface/90 flex flex-col">
                    <div className="px-4 py-2 bg-[#090b0e] border-b border-on-surface/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                        Response - {API_SPECS[activeApi].responses[0].code} {API_SPECS[activeApi].responses[0].status}
                      </span>
                    </div>
                    <pre className="p-4 font-mono text-[10px] text-on-surface/80 overflow-x-auto bg-[#0d0f12]">
                      {API_SPECS[activeApi].responses[0].payload}
                    </pre>
                  </div>

                </div>
              </>
            )}

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
