import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPublicSubscriptionDetails,
  generatePublicCardCheckout,
  provisionPublicBankTransfer,
  simulatePublicBankTransfer,
  verifyPublicSubscription,
  type PublicSubscriptionDetails
} from "../lib/api/subscriptions";
import BackgroundShader from "../components/ui/BackgroundShader";

export default function CheckoutPage() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sub, setSub] = useState<PublicSubscriptionDetails | null>(null);
  
  // Selection states
  const [selectedMethod, setSelectedMethod] = useState<"CARD" | "BANK_TRANSFER" | null>(null);
  const [processingMethod, setProcessingMethod] = useState<boolean>(false);
  
  // Bank transfer info
  const [bankDetails, setBankDetails] = useState<{
    bankAccountNumber: string;
    bankName: string;
    bankAccountName: string;
  } | null>(null);

  // Copy status
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simSuccess, setSimSuccess] = useState<string | null>(null);

  // Polling ref
  const pollingIntervalRef = useRef<number | null>(null);

  // Fetch initial details
  const fetchDetails = async () => {
    if (!subscriptionId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicSubscriptionDetails(subscriptionId);
      setSub(data);
      if (data.status === "ACTIVE") {
        // If already active, redirect to callback to show receipt / developer redirect
        navigate(`/checkout/callback?orderReference=${subscriptionId}`);
        return;
      }
      if (data.virtualAccountNumber) {
        setBankDetails({
          bankAccountNumber: data.virtualAccountNumber,
          bankName: "Nomba Bank",
          bankAccountName: `ARAFI * ${data.customerEmail}`
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch checkout details. Please check the checkout link.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [subscriptionId]);

  // Handle Poll Verifications for Bank Transfer
  const startPolling = () => {
    if (pollingIntervalRef.current) return;
    pollingIntervalRef.current = window.setInterval(async () => {
      if (!subscriptionId) return;
      try {
        const check = await verifyPublicSubscription(subscriptionId);
        if (check.success && check.status === "ACTIVE") {
          // Clean up and go to callback to handle receipt / redirect
          stopPolling();
          navigate(`/checkout/callback?orderReference=${subscriptionId}`);
        }
      } catch (err) {
        // Silent fail during background poll
      }
    }, 4000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (selectedMethod === "BANK_TRANSFER") {
      startPolling();
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [selectedMethod]);

  // Handle Card Checkout Redirect
  const handleCardSelection = async () => {
    if (!subscriptionId || !sub) return;
    try {
      setProcessingMethod(true);
      setError(null);
      const res = await generatePublicCardCheckout(subscriptionId);
      if (res.checkoutLink) {
        window.location.href = res.checkoutLink;
      } else {
        throw new Error("Nomba checkout link not returned.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to generate card checkout session.");
      setProcessingMethod(false);
    }
  };

  // Handle Bank Transfer Selection
  const handleBankSelection = async () => {
    if (!subscriptionId || !sub) return;
    setSelectedMethod("BANK_TRANSFER");
    if (bankDetails) return; // already loaded

    try {
      setProcessingMethod(true);
      setError(null);
      const res = await provisionPublicBankTransfer(subscriptionId);
      setBankDetails(res);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to provision virtual bank account.");
      setSelectedMethod(null);
    } finally {
      setProcessingMethod(false);
    }
  };

  // Simulate transfer for sandbox
  const handleSimulateTransfer = async () => {
    if (!bankDetails || !sub) return;
    try {
      setSimulating(true);
      setError(null);
      await simulatePublicBankTransfer(bankDetails.bankAccountNumber, sub.finalAmount);
      setSimSuccess("Bank transfer simulated! Verifying payment...");
      // Poll instantly
      setTimeout(async () => {
        if (subscriptionId) {
          stopPolling();
          navigate(`/checkout/callback?orderReference=${subscriptionId}`);
        }
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Simulation request failed.");
      setSimulating(false);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="text-on-surface antialiased min-h-screen w-full flex flex-col justify-center items-center font-body-md selection:bg-primary/30 selection:text-primary-fixed overflow-y-auto py-12 px-4 relative bg-glow">
      <BackgroundShader />

      <div className="absolute top-0 right-1/4 w-120 h-120 bg-primary/10 blur-[130px] -z-10 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-100 h-100 bg-tertiary/5 blur-[110px] -z-10 rounded-full pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        
        {/* Loading details state */}
        {loading && (
          <div className="glass-card rounded-2xl p-8 border border-on-surface/10 text-center shadow-2xl flex flex-col items-center">
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent animate-spin-custom"></div>
            </div>
            <h2 className="font-headline-md text-lg font-bold">Securing Subscription Checkout</h2>
            <p className="text-on-surface/50 text-xs mt-1 animate-pulse">Loading billing details...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="glass-card rounded-2xl p-8 border border-error/20 text-center shadow-2xl flex flex-col items-center mb-4">
            <span className="material-symbols-outlined text-error text-4xl mb-4">warning</span>
            <h2 className="font-headline-md text-lg font-bold">Checkout Lookup Failed</h2>
            <p className="text-on-surface/60 text-xs mt-2 max-w-xs">{error}</p>
            <button
              onClick={fetchDetails}
              className="mt-6 border border-on-surface/10 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface rounded-xl px-6 py-2.5 text-xs font-semibold transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loaded Checkout Selection screen */}
        {!loading && !error && sub && (
          <div className="space-y-4 animate-fade-scale">
            
            {/* Top Checkout Summary Header */}
            <div className="glass-card rounded-2xl border border-on-surface/10 overflow-hidden shadow-2xl">
              <div className="bg-primary/10 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="logo" className="w-5 h-5" />
                  <span className="font-semibold text-xs tracking-wider uppercase opacity-85">Arafi Subscription Checkout</span>
                </div>
                <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary px-2.5 py-0.5 rounded-full font-label-mono uppercase tracking-wider">
                  {sub.mode}
                </span>
              </div>

              {/* Order Info */}
              <div className="p-6 border-b border-on-surface/10">
                <h4 className="text-[10px] uppercase tracking-widest text-on-surface/40 font-semibold mb-1">
                  Merchant App: {sub.appName}
                </h4>
                <h3 className="text-lg font-bold mb-1 text-on-surface">{sub.planName}</h3>
                <p className="text-xs text-on-surface/60">Subscribed as <span className="text-primary font-medium">{sub.customerEmail}</span></p>
                
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">₦</span>
                    <span className="text-3xl font-extrabold">{sub.finalAmount}</span>
                    <span className="text-xs text-on-surface/50 ml-1">/ {sub.interval}</span>
                  </div>
                  {parseFloat(sub.discountAmount) > 0 && (
                    <div className="text-right">
                      <span className="text-xs line-through text-on-surface/40 mr-1.5">₦{sub.baseAmount}</span>
                      <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                        -{sub.appliedCouponCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Method choice / selection */}
              {selectedMethod === null ? (
                <div className="p-6 space-y-4">
                  <h4 className="text-xs font-semibold text-on-surface/70 uppercase tracking-wider">
                    Select payment method to subscribe
                  </h4>

                  {/* Card Option */}
                  <button
                    onClick={handleCardSelection}
                    disabled={processingMethod}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-on-surface/10 hover:border-primary/50 bg-on-surface/5 hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">credit_card</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                          Debit / Credit Card
                          <span className="text-[9px] bg-primary/20 border border-primary/30 text-primary px-1.5 py-0.2 rounded-full uppercase font-medium">
                            Auto Renew
                          </span>
                        </div>
                        <p className="text-[11px] text-on-surface/55 mt-0.5">Pay once, setup automatic recurrences.</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface/30 group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </button>

                  {/* Bank Transfer Option */}
                  <button
                    onClick={handleBankSelection}
                    disabled={processingMethod}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-on-surface/10 hover:border-primary/50 bg-on-surface/5 hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">account_balance</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                          Bank Transfer
                        </div>
                        <p className="text-[11px] text-on-surface/55 mt-0.5">Static virtual account for manual renewals.</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface/30 group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </button>
                </div>
              ) : selectedMethod === "BANK_TRANSFER" ? (
                /* Bank details render */
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedMethod(null)}
                      className="flex items-center gap-1 text-xs text-on-surface/50 hover:text-on-surface transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Change Payment Method
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
                      Awaiting Transfer
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                    <strong>Instructions</strong>: Please transfer the exact amount of <strong>₦{sub.finalAmount}</strong> to the virtual account below. You can also save this account number in your bank app to make easy manual renewals every billing interval.
                  </div>

                  {processingMethod ? (
                    <div className="text-center py-6 flex flex-col items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-3"></div>
                      <p className="text-xs text-on-surface/60">Generating virtual account details...</p>
                    </div>
                  ) : bankDetails ? (
                    <div className="space-y-4">
                      {/* Virtual Account Box */}
                      <div className="glass-card rounded-xl p-4 border border-on-surface/10 bg-on-surface/5 relative group">
                        
                        <div className="grid grid-cols-3 gap-y-4 text-xs">
                          <div className="text-on-surface/50 font-medium">Bank Name</div>
                          <div className="col-span-2 text-on-surface font-bold text-right">{bankDetails.bankName}</div>

                          <div className="text-on-surface/50 font-medium flex items-center">
                            Account Number
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <span className="font-code-lg text-sm font-bold tracking-wider">{bankDetails.bankAccountNumber}</span>
                            <button
                              onClick={() => handleCopy(bankDetails.bankAccountNumber, "account")}
                              className="w-7 h-7 flex items-center justify-center rounded bg-on-surface/5 hover:bg-on-surface/10 border border-on-surface/10 transition-all text-on-surface/75"
                              title="Copy account number"
                            >
                              <span className="material-symbols-outlined text-sm">
                                {copiedText === "account" ? "check" : "content_copy"}
                              </span>
                            </button>
                          </div>

                          <div className="text-on-surface/50 font-medium">Account Name</div>
                          <div className="col-span-2 text-on-surface/85 font-semibold text-right truncate">{bankDetails.bankAccountName}</div>
                        </div>

                      </div>

                      {/* Mock transfer simulator for sandbox environment */}
                      {sub.mode === "test" && (
                        <div className="border border-primary/20 bg-primary/5 rounded-xl p-4 text-center">
                          <p className="text-[10px] text-primary/80 uppercase tracking-widest font-semibold mb-2">
                            Sandbox Test Simulator
                          </p>
                          {simSuccess ? (
                            <p className="text-xs text-emerald-400 animate-pulse font-medium">{simSuccess}</p>
                          ) : (
                            <button
                              onClick={handleSimulateTransfer}
                              disabled={simulating}
                              className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-lg py-2.5 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {simulating ? (
                                <div className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <span className="material-symbols-outlined text-sm">bolt</span>
                              )}
                              Simulate Bank Credit
                            </button>
                          )}
                        </div>
                      )}

                      <div className="text-center py-2">
                        <div className="inline-flex items-center gap-2 text-xs text-on-surface/40">
                          <div className="w-1.5 h-1.5 rounded-full border border-on-surface/30 border-t-on-surface/90 animate-spin"></div>
                          Checking transfer receipt status automatically...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-on-surface/50">
                      No virtual account details available. Please retry selection.
                    </div>
                  )}
                </div>
              ) : null}

              {/* Branded footer */}
              <div className="bg-on-surface/5 border-t border-on-surface/10 py-3.5 text-center">
                <span className="text-[10px] uppercase tracking-widest text-on-surface/30">
                  Infrastructure by <strong className="text-on-surface/50 font-bold">Arafi</strong>
                </span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
