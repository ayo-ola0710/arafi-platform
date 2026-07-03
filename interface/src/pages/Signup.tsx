import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundShader from "../components/ui/BackgroundShader";
import { useAuth } from "../store/useAuth";

export default function Signup() {
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-on-surface antialiased h-screen w-full flex font-body-md selection:bg-primary/30 selection:text-primary-fixed overflow-hidden">
      <BackgroundShader />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-primary/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-tertiary/5 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full h-full flex flex-col lg:flex-row relative">
        {/* Left: Value Prop */}
        <div className="hidden lg:flex flex-1 flex-col justify-center gap-8 animate-fade-scale p-12 lg:p-24 max-w-4xl">
          <a
            className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2 mb-4"
            href="/"
          >
            <span className="flex items-center gap-2">
              <img src="/logo.svg" alt="logo" />
              <p> Arafi</p>
            </span>
          </a>
          <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">
            Abstracting the complexity of modern payments.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface/60 leading-relaxed max-w-2xl">
            Join the platform to access your dashboard and generate environment-specific API keys for your applications.
          </p>
          <div className="relative group mt-4 max-w-2xl">
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative rounded-2xl overflow-hidden border border-on-surface/10 backdrop-blur-3xl bg-on-surface/5 shadow-2xl">
              <div className="flex items-center px-4 py-2.5 bg-on-surface/5 border-b border-on-surface/10 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-on-surface/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-on-surface/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-on-surface/10"></div>
                </div>
                <span className="ml-2 font-code-sm text-[11px] text-on-surface/40 uppercase tracking-widest">
                  auth_flow.sh
                </span>
              </div>
              <div className="p-5 font-code-sm text-[13px] leading-relaxed text-secondary-fixed/80 overflow-x-auto">
                <pre>
                  <code>
                    {`curl https://api.arafi.com/v1/auth/signup \\\n  -H `}
                    <span className="text-tertiary">
                      "Content-Type: application/json"
                    </span>
                    {` \\\n  -d `}
                    <span className="text-tertiary">
                      {`'{ "email": "dev@company.com", "password": "***" }'`}
                    </span>
                    <span className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle cursor-blink"></span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Auth Drawer */}
        <div
          className="w-full lg:w-175 lg:ml-20 h-full flex shrink-0 animate-fade-scale"
          style={{ animationDelay: "100ms" }}
        >
          <main
            className="glass-card w-full h-full p-8 md:p-12 flex flex-col justify-center gap-8 shadow-2xl relative"
            id="app-card"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>

            <div
              className="flex flex-col gap-8 w-full relative z-10 transition-opacity duration-200 opacity-100"
              id="view-signup"
            >
              <header className="flex flex-col gap-3">
                <h2 className="font-headline-lg text-3xl tracking-tight text-on-surface">
                  Create your account
                </h2>
                <p className="font-body-md text-on-surface/50">
                  Join Arafi to get your API keys and build modern payments.
                </p>
              </header>

              <form
                className="flex flex-col gap-6"
                id="form-signup"
                onSubmit={handleSignup}
              >
                <div className="flex flex-col gap-2.5">
                  <label
                    className="font-label-mono text-label-mono text-on-surface/80"
                    htmlFor="app-email"
                  >
                    Email Address
                  </label>
                  <input
                    className="bg-surface-container-lowest/50 border border-on-surface/10 rounded-lg p-3.5 font-body-md text-body-md text-on-surface custom-input placeholder:text-on-surface-variant/40"
                    id="app-email"
                    placeholder="dev@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label
                    className="font-label-mono text-label-mono text-on-surface/80"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="bg-surface-container-lowest/50 border border-on-surface/10 rounded-lg p-3.5 font-body-md text-body-md text-on-surface custom-input placeholder:text-on-surface-variant/40"
                    id="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                {error && (
                  <div className="text-error font-body-md text-[13px] bg-error-container/20 border border-error/30 rounded-lg p-3">
                    {error}
                  </div>
                )}
                
                <button
                  className="mt-4 w-full glow-button bg-inverse-primary text-on-primary font-label-mono text-label-mono py-4 px-4 rounded-lg transition-all duration-300 border-t border-on-surface/20 shadow-xl shadow-indigo-500/20 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Sign Up"}
                </button>
              </form>

              <div className="flex justify-center pt-2 border-t border-on-surface/10">
                <a
                  className="font-body-md text-body-md text-on-surface/60 hover:text-on-surface transition-colors"
                  href="/login"
                >
                  Already have an account? Log in
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
