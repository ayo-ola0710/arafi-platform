import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyPublicSubscription, type PublicVerificationResponse } from "../lib/api/subscriptions";
import { verifyPublicProductPayment } from "../lib/api/products";
import BackgroundShader from "../components/ui/BackgroundShader";

const VERIFICATION_STEPS = [
  "Contacting payment gateways...",
  "Retrieving checkout status...",
  "Authenticating transaction reference...",
  "Updating secure ledger records...",
  "Authorizing merchant callback webhook...",
  "Completing workspace registration..."
];

export default function CheckoutCallback() {
  const [searchParams] = useSearchParams();
  const orderReference = searchParams.get("orderReference") || searchParams.get("reference");
  
  const [loading, setLoading] = useState(true);
  const [stepText, setStepText] = useState(VERIFICATION_STEPS[0]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicVerificationResponse | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  
  const verificationAttempted = useRef(false);
  const stepIntervalRef = useRef<number | null>(null);

  // Cycling steps text
  useEffect(() => {
    if (!loading) return;
    let stepIdx = 0;
    stepIntervalRef.current = window.setInterval(() => {
      stepIdx = (stepIdx + 1) % VERIFICATION_STEPS.length;
      setStepText(VERIFICATION_STEPS[stepIdx]);
    }, 1800);

    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [loading]);

  // Main verification logic
  const performVerification = async (ref: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const isProduct = searchParams.get("type") === "product";
      if (isProduct) {
        const response = await verifyPublicProductPayment(ref);
        if (response.status === "SUCCESS") {
          setResult({
            success: true,
            status: "ACTIVE",
            appName: "Arafi Product Store",
            planName: "Product Purchase",
            amount: "0.00",
            orderReference: ref,
            redirectUrl: response.redirectUrl || "",
            message: "Payment successfully verified."
          });
          setLoading(false);
          if (response.redirectUrl) {
            setRedirectCountdown(3);
          }
        } else {
          setError("Your payment is still pending. If you just paid, please wait a moment and click retry.");
          setLoading(false);
        }
      } else {
        const response = await verifyPublicSubscription(ref);
        if (response.success && response.status === "ACTIVE") {
          setResult(response);
          setLoading(false);
          if (response.redirectUrl) {
            setRedirectCountdown(3);
          }
        } else {
          setError(response.message || "Your payment is still pending. If you just paid, please wait a moment and click retry.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to communicate with verification servers. Please check your network and try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderReference) {
      setError("No payment reference was found in the URL. Please verify your payment link.");
      setLoading(false);
      return;
    }

    if (!verificationAttempted.current) {
      verificationAttempted.current = true;
      // Introduce a slight cosmetic delay so the user sees the professional transitions
      setTimeout(() => {
        performVerification(orderReference);
      }, 1000);
    }
  }, [orderReference]);

  // Handle redirect countdown
  useEffect(() => {
    if (redirectCountdown === null) return;
    
    if (redirectCountdown <= 0) {
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
      return;
    }

    const timer = setTimeout(() => {
      setRedirectCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, result]);

  return (
    <div className="text-on-surface antialiased min-h-screen w-full flex flex-col justify-center items-center font-body-md selection:bg-primary/30 selection:text-primary-fixed overflow-y-auto py-12 px-4 relative bg-glow">
      <BackgroundShader />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-1/4 w-120 h-120 bg-primary/10 blur-[130px] -z-10 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-100 h-100 bg-tertiary/5 blur-[110px] -z-10 rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        
        {/* Verification Loading State */}
        {loading && (
          <div className="glass-card rounded-2xl p-8 border border-on-surface/10 text-center animate-fade-scale shadow-2xl flex flex-col items-center">
            {/* Spinning Aura */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent animate-spin-custom"></div>
              <span className="material-symbols-outlined text-primary text-3xl animate-float">lock</span>
            </div>

            <h2 className="font-headline-md text-xl font-bold tracking-tight mb-2">
              Verifying Payment
            </h2>
            <p className="text-on-surface/60 text-sm h-6 transition-all duration-300 font-code-sm">
              {stepText}
            </p>
          </div>
        )}

        {/* Verification Success (Redirect or Receipt) */}
        {!loading && !error && result && (
          <div className="animate-fade-scale">
            {redirectCountdown !== null ? (
              /* Success Loading Spinner Transition to External Merchant */
              <div className="glass-card rounded-2xl p-8 border border-on-surface/10 text-center shadow-2xl flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce-check">
                  <span className="material-symbols-outlined text-emerald-500 text-4xl">check_circle</span>
                </div>
                
                <h2 className="font-headline-md text-xl font-bold text-on-surface mb-2">
                  Payment Confirmed!
                </h2>
                <p className="text-on-surface/60 text-sm mb-6">
                  Successfully subscribed to <span className="font-semibold text-on-surface">{result.planName}</span>.
                </p>

                <div className="w-full bg-on-surface/5 h-1.5 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${((3 - redirectCountdown) / 3) * 100}%` }}
                  ></div>
                </div>

                <p className="font-code-sm text-xs text-on-surface/40">
                  Redirecting back to <span className="text-primary font-medium">{result.appName}</span> in {redirectCountdown}s...
                </p>
              </div>
            ) : (
              /* Standard Fallback Receipt Card when redirectUrl is absent */
              <div className="glass-card rounded-2xl border border-on-surface/10 overflow-hidden shadow-2xl relative">
                {/* Visual Watermark */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Header banner */}
                <div className="bg-primary/10 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="logo" className="w-5 h-5" />
                    <span className="font-semibold text-xs tracking-wider uppercase opacity-85">Arafi Checkout</span>
                  </div>
                  <span className="text-emerald-500 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                    ACTIVE
                  </span>
                </div>

                {/* Main Receipt Content */}
                <div className="p-6 flex flex-col items-center">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 animate-bounce-check">
                    <span className="material-symbols-outlined text-emerald-500 text-3xl">check</span>
                  </div>

                  <h3 className="text-xs uppercase text-on-surface/40 tracking-widest font-semibold mb-1">
                    Receipt from {result.appName}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold tracking-tight">₦</span>
                    <span className="text-4xl font-extrabold tracking-tight">{result.amount}</span>
                  </div>

                  <div className="w-full border-t border-on-surface/10 pt-4 space-y-3.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface/50">Plan Details</span>
                      <span className="font-medium text-on-surface">{result.planName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface/50">Order Reference</span>
                      <span className="font-code-sm text-xs truncate max-w-[180px] text-on-surface/80">
                        {result.orderReference}
                      </span>
                    </div>
                    {result.transactionId && (
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface/50">Gateway Transaction ID</span>
                        <span className="font-code-sm text-xs truncate max-w-[180px] text-on-surface/80">
                          {result.transactionId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface/50">Verified At</span>
                      <span className="text-on-surface/80">{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => window.print()}
                    className="mt-8 w-full border border-on-surface/10 bg-on-surface/5 hover:bg-on-surface/10 hover:border-on-surface/20 text-on-surface rounded-xl py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">print</span>
                    Print Receipt
                  </button>
                </div>

                <div className="bg-on-surface/5 border-t border-on-surface/10 py-3.5 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface/30">
                    Infrastructure by <strong className="text-on-surface/50 font-bold">Arafi</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification Fail / Pending Error State */}
        {!loading && error && (
          <div className="glass-card rounded-2xl p-8 border border-error/20 text-center animate-fade-scale shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-3xl">warning</span>
            </div>

            <h2 className="font-headline-md text-xl font-bold tracking-tight mb-3">
              Payment Pending Check
            </h2>
            <p className="text-on-surface/60 text-sm leading-relaxed mb-8 max-w-xs">
              {error}
            </p>

            <div className="flex flex-col w-full gap-3">
              {orderReference && (
                <button
                  onClick={() => performVerification(orderReference)}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary rounded-xl py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 glow-button"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Check Payment Status
                </button>
              )}
              <a
                href="/"
                className="w-full border border-on-surface/10 hover:bg-on-surface/5 text-on-surface/80 rounded-xl py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
