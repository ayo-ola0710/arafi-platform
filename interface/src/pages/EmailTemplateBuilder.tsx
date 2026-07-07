import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import EnvironmentBadge from "../components/ui/EnvironmentBadge";

import { Link, useNavigate } from "react-router-dom";

export default function EmailTemplateBuilder() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState("Escrow Hold Notification");
  const [preset, setPreset] = useState("escrow_hold");
  const [subject, setSubject] = useState("Funds Secured for your transaction");
  const [title, setTitle] = useState("Funds Secured.");
  const [logoUrl, setLogoUrl] = useState("");
  const [companyName, setCompanyName] = useState("Arafi Network");
  const [body, setBody] = useState("Hi {{customer_name}},\n\nYour payment of NGN {{amount}} is safely locked in Arafi escrow.\n\nThe funds will only be released to the seller once you approve the delivery of the goods.");
  const [ctaText, setCtaText] = useState("View Escrow Transaction");

  // Mock variables for preview
  const previewBody = body
    .replace(/\{\{customer_name\}\}/g, "Alice")
    .replace(/\{\{amount\}\}/g, "45,000.00");

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up delay-0 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button 
                onClick={() => navigate('/email')}
                className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
            >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Template Builder
            </h2>
            <EnvironmentBadge />
          </div>
          <p className="text-on-surface-variant">
            Design and configure transactional emails using dynamic variables.
          </p>
        </div>
        <button className="bg-primary text-on-primary font-bold px-4 py-2 rounded-lg font-label-mono text-label-mono hover:brightness-110 transition-all active:scale-95 flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[16px]">save</span>
          Save Template
        </button>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-gutter h-[calc(100vh-220px)] min-h-[600px] animate-fade-up delay-60">
        {/* Left Column: Config Form */}
        <div className="w-full lg:w-1/2 flex flex-col surface-panel rounded-xl overflow-y-auto border border-outline-variant/50">
          <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              Configuration
            </h3>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Blueprint Preset
                </label>
                <select
                    value={preset}
                    onChange={(e) => setPreset(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                    <option value="escrow_hold">Escrow Hold Notification</option>
                    <option value="sub_invoice">Subscription Invoice Receipt</option>
                    <option value="payment_cleared">One-off Payment Cleared</option>
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Template Name
                </label>
                <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Company Name
                </label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Subject Line
                </label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Brand Logo
                </label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="Paste URL or upload image..."
                        className="flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/30"
                    />
                    <label className="bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-3 font-label-mono text-label-mono text-on-surface hover:bg-surface-variant cursor-pointer transition-colors flex items-center justify-center gap-2 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        Upload
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const objectUrl = URL.createObjectURL(file);
                                    setLogoUrl(objectUrl);
                                }
                            }}
                        />
                    </label>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Email Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider flex justify-between">
                    <span>Body Paragraph</span>
                    <span className="text-primary normal-case">{'{{customer_name}}, {{amount}}'}</span>
                </label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-code-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <label className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider block">
                    Call-to-Action Text
                </label>
                <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview Terminal */}
        <div className="w-full lg:w-1/2 flex flex-col surface-panel rounded-xl overflow-hidden border border-outline-variant/50 relative bg-[#0A0A0C]">
            <div className="absolute top-0 left-0 w-full h-8 bg-surface-container border-b border-outline-variant/30 flex items-center justify-between px-4 z-20 shrink-0">
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-error/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="font-label-mono text-[9px] text-on-surface-variant/50 uppercase tracking-widest flex items-center gap-2">
                    <span>PREVIEW_RENDER.html</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
            </div>
            
            {/* Scanlines over the terminal area */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.15]" style={{
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%'
            }}></div>

            <div className="flex-1 overflow-y-auto pt-14 pb-8 px-4 sm:px-8 relative z-0 flex items-center justify-center custom-scrollbar">
                {/* The Mock Email Canvas (Light Mode for realistic view) */}
                <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden text-[#1e293b] font-sans border border-gray-200">
                    <div className="p-8 pb-10">
                        {/* Fake Email Header */}
                        <div className="flex items-center gap-2 mb-10">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Brand Logo" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {companyName ? companyName[0].toUpperCase() : "A"}
                                </div>
                            )}
                            <span className="font-bold text-gray-900 tracking-tight">{companyName || "No Company Name"}</span>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title || "No Title"}</h1>
                        
                        <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
                            {previewBody || "No body content provided."}
                        </p>

                        {ctaText && (
                            <button className="bg-[#4f46e5] text-white font-medium px-6 py-3 rounded-lg w-full hover:bg-[#4338ca] transition-colors cursor-pointer">
                                {ctaText}
                            </button>
                        )}
                        
                        <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
                            <p>Powered by Arafi Escrow Protocol.</p>
                            <p className="mt-1">© 2026 Arafi Inc. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
