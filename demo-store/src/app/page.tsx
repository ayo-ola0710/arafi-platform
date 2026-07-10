"use client";

import { useState } from "react";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  sku: string;
  image: string;
  description: string;
}

interface PlanItem {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
}

const DEMO_PRODUCTS: ProductItem[] = [
  {
    id: "ec7d6602-9e50-4448-953b-7deb474d0b50",
    name: "Arafi Tactile Mechanical Keyboard",
    price: 45000,
    sku: "SHIRT-CTN-BLU-M",
    image: "⌨️",
    description: "Compact form factor with custom tuned brown switches and premium doubleshot PBT keycaps."
  },
  {
    id: "882cfa57-b036-41dc-8f83-3f978e912f55",
    name: "Arafi Studio Noise-Cancelling Headphones",
    price: 68000,
    sku: "HEAD-WRLS-BLK ",
    image: "🎧",
    description: "High-fidelity drivers with active ANC, plush memory foam pads, and 40-hour battery life."
  }
];

const DEMO_PLANS: PlanItem[] = [
  {
    id: "7180d3bb-ca23-4dc3-8214-d1562836bfe8",
    name: "Arafi Developer Lite",
    price: 5000,
    period: "monthly",
    description: "Ideal for individual developers building side products. Up to 100 checkout sessions monthly."
  },
  {
    id: "ab3eabc5-7d54-439b-8f10-38b25e7046f3",
    name: "Arafi Scale Premium",
    price: 15000,
    period: "monthly",
    description: "Perfect for scaling SaaS platforms. Vaults up to 5,000 active customer card tokens."
  }
];

export default function DemoStore() {
  const [email, setEmail] = useState("buyer@example.com");
  const [name, setName] = useState("Jane Doe");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "BANK_TRANSFER">("BANK_TRANSFER");
  
  // Interactive Console Logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "// Welcome to Arafi Sandbox Console",
    "// Trigger a checkout above to inspect the API request and response sequence."
  ]);
  
  // Simulated Checkout Link
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const logConsole = (text: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const handleProductCheckout = async (product: ProductItem) => {
    setLoading(true);
    setGeneratedLink(null);
    logConsole(`Initializing one-off product checkout for: ${product.name}`);
    
    const requestPayload = {
      customerEmail: email,
      customerName: name,
      paymentMethod: paymentMethod,
      redirectUrl: "https://arafi-platform.vercel.app/checkout-callback"
    };

    const apiUrl = process.env.NEXT_PUBLIC_ARAFI_API_URL || "https://arafi-api.onrender.com";
    const apiKey = process.env.NEXT_PUBLIC_ARAFI_PUBLISHABLE_KEY || "";

    logConsole(`POST ${apiUrl}/v1/products/${product.id}/checkout\nPayload: ${JSON.stringify(requestPayload, null, 2)}`);

    try {
      const res = await fetch(`${apiUrl}/v1/products/${product.id}/checkout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${res.status}`);
      }

      const responseData = await res.json();
      logConsole(`Response 200 OK:\n${JSON.stringify(responseData, null, 2)}`);
      
      setGeneratedLink(responseData.checkoutUrl);
    } catch (err: any) {
      logConsole(`Error generating product checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSubscription = async (plan: PlanItem) => {
    setLoading(true);
    setGeneratedLink(null);
    logConsole(`Executing subscription pipeline for plan: ${plan.name}`);

    const apiUrl = process.env.NEXT_PUBLIC_ARAFI_API_URL || "https://arafi-api.onrender.com";
    const apiKey = process.env.NEXT_PUBLIC_ARAFI_PUBLISHABLE_KEY || "";

    // Step 1: Register/Check customer profile
    logConsole(`Step 1: Check Customer Identity`);
    const customerPayload = {
      email: email,
      name: name,
      external_ref: `cus_ref_${Math.random().toString(36).substring(2, 8)}`
    };
    logConsole(`POST ${apiUrl}/v1/customers\nPayload: ${JSON.stringify(customerPayload, null, 2)}`);

    try {
      const customerRes = await fetch(`${apiUrl}/v1/customers`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(customerPayload)
      });

      if (!customerRes.ok) {
        const errorData = await customerRes.json().catch(() => ({}));
        throw new Error(`Customer Error: ${errorData.error || errorData.message || customerRes.status}`);
      }

      const customerData = await customerRes.json();
      logConsole(`Response 200 OK (Customer Resolved):\n${JSON.stringify(customerData, null, 2)}`);

      const customerId = customerData.id;

      // Step 2: Initialize subscription checkout
      logConsole(`Step 2: Initialize Billing Subscription`);
      const subPayload = {
        customer_id: customerId,
        plan_id: plan.id,
        payment_method: paymentMethod,
        redirect_url: "https://arafi-platform.vercel.app/checkout-callback"
      };
      logConsole(`POST ${apiUrl}/v1/subscriptions\nPayload: ${JSON.stringify(subPayload, null, 2)}`);

      const subRes = await fetch(`${apiUrl}/v1/subscriptions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(subPayload)
      });

      if (!subRes.ok) {
        const errorData = await subRes.json().catch(() => ({}));
        throw new Error(`Subscription Error: ${errorData.error || errorData.message || subRes.status}`);
      }

      const subData = await subRes.json();
      logConsole(`Response 200 OK (Subscription Created):\n${JSON.stringify(subData, null, 2)}`);
      
      setGeneratedLink(subData.checkoutUrl);
    } catch (err: any) {
      logConsole(`Error generating subscription checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearConsole = () => {
    setConsoleLogs(["// Console cleared"]);
    setGeneratedLink(null);
  };

  return (
    <div className="flex-1 w-full max-w-[1500px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-glow relative z-10">
      
      {/* LEFT AREA: E-Commerce Store and SaaS Tiers */}
      <div className="lg:col-span-7 flex flex-col gap-10">
        
        {/* Brand Header */}
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-mono uppercase tracking-wider">
              Integration Sandbox Playground
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Arafi Store & Billing Demo
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Simulate a client-facing web checkout. Custom input details below to update client profiles dynamically and watch Arafi's APIs react in real-time.
          </p>
        </header>

        {/* Global checkout parameters config */}
        <section className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-lg">tune</span>
            Checkout Configuration Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500">Customer Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500">Customer Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0f12] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="buyer@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500">Payment Route Selection</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "bg-purple-500/10 border-purple-500/35 text-white"
                    : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-base">account_balance</span>
                Virtual Bank Transfer
              </button>
              <button
                onClick={() => setPaymentMethod("CARD")}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-all ${
                  paymentMethod === "CARD"
                    ? "bg-purple-500/10 border-purple-500/35 text-white"
                    : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-base">credit_card</span>
                Credit / Debit Card
              </button>
            </div>
          </div>
        </section>

        {/* Section: E-Commerce Products */}
        <section className="flex flex-col gap-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">shopping_bag</span>
            Arafi Physical Store Inventory (One-off)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_PRODUCTS.map((prod) => (
              <div key={prod.id} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4 bg-surface/30">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{prod.image}</span>
                  <span className="text-[9px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded font-mono uppercase">
                    {prod.sku}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-white text-sm truncate">{prod.name}</h4>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{prod.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <span className="text-sm font-bold font-mono text-purple-300">
                    {(prod.price).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}
                  </span>
                  <button
                    onClick={() => handleProductCheckout(prod)}
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: SaaS Plans */}
        <section className="flex flex-col gap-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">autorenew</span>
            Arafi SaaS Subscription Plans (Recurring)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_PLANS.map((plan) => (
              <div key={plan.id} className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4 bg-surface/30">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white text-sm">{plan.name}</h4>
                    <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-semibold uppercase">
                      Recurring
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs leading-relaxed">{plan.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div className="flex items-baseline gap-0.5 font-mono">
                    <span className="text-sm font-bold text-purple-300">
                      {(plan.price).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[10px] text-zinc-500">/{plan.period}</span>
                  </div>
                  <button
                    onClick={() => handlePlanSubscription(plan)}
                    className="border border-white/10 hover:bg-white/5 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* RIGHT AREA: Interactive Sandbox Console Output */}
      <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-8 max-h-[calc(100vh-80px)]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">terminal</span>
            Arafi SDK API Console
          </h3>
          <button
            onClick={clearConsole}
            className="text-xs text-zinc-500 hover:text-white transition-colors"
          >
            Clear Console
          </button>
        </div>

        {/* Console Box */}
        <div className="flex-1 rounded-2xl border border-white/5 bg-[#090b0d] p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto flex flex-col gap-3 custom-scrollbar min-h-[300px]">
          {consoleLogs.map((log, index) => (
            <pre key={index} className="whitespace-pre-wrap leading-relaxed select-text font-mono">
              {log}
            </pre>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-purple-400 font-mono text-[10px] animate-pulse">
              <span>&gt; Connecting to Arafi Secure Ledger Billing Router...</span>
            </div>
          )}
        </div>

        {/* Redirect checkout container */}
        {generatedLink && (
          <div className="glass-card rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5 animate-fade-in flex flex-col gap-3">
            <div className="flex items-center gap-2 text-purple-300">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span className="text-xs font-semibold">Checkout Link Generated!</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal">
              Arafi successfully generated the customer invoice token. Click below to route to Arafi's Hosted Checkout Selection Portal to complete the transaction context.
            </p>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              Proceed to Checkout Portal
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        )}

      </div>

    </div>
  );
}
