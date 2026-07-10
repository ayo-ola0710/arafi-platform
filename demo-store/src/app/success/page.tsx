"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessReceiptContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkoutId") || searchParams.get("orderReference") || "N/A";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090a] px-4 py-12 relative overflow-hidden select-none">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-[#0d0f12]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl shadow-black/60 text-center animate-fade-in">
        
        {/* Animated Green Check Ring */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 relative">
          <span className="material-symbols-outlined text-3xl animate-pulse">check_circle</span>
          <span className="absolute inset-0 rounded-full border border-emerald-400/35 animate-ping opacity-25"></span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Payment Successful</h2>
          <p className="text-zinc-400 text-xs px-2 leading-relaxed">
            Your transaction has been processed securely. Arafi has verified the entries and updated the ledger state.
          </p>
        </div>

        {/* Transaction Meta Card */}
        <div className="bg-[#050608] border border-white/5 rounded-2xl p-5 flex flex-col gap-3.5 text-left font-mono">
          <div className="flex flex-col gap-1.5 pb-3 border-b border-white/5">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500">Transaction Status</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              RESOLVED (CREDITED)
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500">Arafi Order Reference</span>
            <span className="text-[10px] text-zinc-300 select-all truncate">{checkoutId}</span>
          </div>
        </div>

        <div className="bg-[#0b0c0f] border border-white/5 rounded-2xl p-4 flex items-start gap-2.5 text-left text-[11px] text-zinc-400 leading-normal">
          <span className="material-symbols-outlined text-purple-400 text-base mt-0.5">rss_feed</span>
          <p>
            An outbound webhook payload containing this signature has been logged and queued for retry verification to your dashboard callback URL.
          </p>
        </div>

        <Link
          href="/"
          className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Return to Demo Store
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>

      </div>
    </div>
  );
}

export default function SuccessReceipt() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#08090a] text-zinc-400 font-mono text-xs">
        Loading receipt...
      </div>
    }>
      <SuccessReceiptContent />
    </Suspense>
  );
}
