import { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import EnvironmentBadge from "../components/ui/EnvironmentBadge";
import { useWorkspace } from "../store/useWorkspace";
import { getProducts, createProduct, deleteProduct, createProductCheckout } from "../lib/api/products";
import type { Product } from "../types";

export default function Products() {
  const { activeWorkspace } = useWorkspace();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeProductForCheckout, setActiveProductForCheckout] = useState<Product | null>(null);

  // Create Form State
  const [prodName, setProdName] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodPriceNGN, setProdPriceNGN] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Checkout Link Generator State
  const [custEmail, setCustEmail] = useState("");
  const [custName, setCustName] = useState("");
  const [payMethod, setPayMethod] = useState("CARD");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchProductsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeWorkspace) {
      fetchProductsList();
    }
  }, [activeWorkspace?.app_id]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodPriceNGN) return;
    setCreating(true);
    setError(null);
    try {
      const priceKobo = Math.round(parseFloat(prodPriceNGN) * 100);
      await createProduct({
        name: prodName,
        sku: prodSku,
        priceKobo,
        description: prodDescription
      });
      // Reset form
      setProdName("");
      setProdSku("");
      setProdPriceNGN("");
      setProdDescription("");
      setShowCreateModal(false);
      fetchProductsList();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create product.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;
    try {
      await deleteProduct(productId);
      fetchProductsList();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete product.");
    }
  };

  const handleGenerateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProductForCheckout || !custEmail) return;
    setGenerating(true);
    setGeneratedLink("");
    setCopied(false);
    try {
      const res = await createProductCheckout(activeProductForCheckout.id, {
        customerEmail: custEmail,
        customerName: custName,
        paymentMethod: payMethod,
        redirectUrl: redirectUrl || window.location.origin + "/dashboard"
      });
      setGeneratedLink(res.checkoutUrl);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to generate checkout link.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Products Overview
            </h2>
            <EnvironmentBadge />
          </div>
          <p className="text-on-surface-variant">
            Create products for one-off checkouts and generate payment links for your customers.
          </p>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Product Inventory Panel */}
      <div className="surface-panel rounded-xl overflow-hidden animate-fade-up">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Product Inventory
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="border border-outline-variant text-on-surface font-label-mono text-label-mono px-3 py-1.5 rounded hover:bg-surface-variant transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span> Add Product
          </button>
        </div>

        <div className="overflow-x-auto min-h-[150px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-high/30">
                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider pl-6">
                  Product Name
                </th>
                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider text-right">
                  Price
                </th>
                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider pl-12">
                  Description
                </th>
                <th className="px-6 py-3 font-label-mono text-[11px] text-on-surface-variant uppercase tracking-wider text-right pr-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="font-code-sm text-code-sm divide-y divide-outline-variant">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant animate-pulse">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No products created yet. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-highest/30 transition-colors">
                    <td className="px-6 py-4 text-on-surface font-body-md font-medium pl-6">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-on-surface font-mono">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-right text-on-surface font-mono">
                      {(product.priceKobo / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant pl-12 max-w-xs truncate">
                      {product.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right pr-6 flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setActiveProductForCheckout(product);
                          setCustEmail("");
                          setCustName("");
                          setRedirectUrl("");
                          setGeneratedLink("");
                          setShowCheckoutModal(true);
                        }}
                        className="border border-primary/30 text-primary font-label-mono text-[11px] px-2.5 py-1 rounded hover:bg-primary/10 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">link</span> Pay Link
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 font-label-mono text-[11px] hover:underline"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Product */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl border border-on-surface/10 p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-lg text-white font-bold">Add Product</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface/50 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Leather Jacket"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface/60 font-label-mono uppercase">SKU Reference</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JKT-PREM-001"
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Price (NGN)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 25000"
                  value={prodPriceNGN}
                  onChange={(e) => setProdPriceNGN(e.target.value)}
                  className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface/60 font-label-mono uppercase">Description</label>
                <textarea
                  placeholder="e.g. High-quality black leather jacket with custom lining"
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  rows={3}
                  className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="font-label-mono bg-inverse-primary text-on-primary py-3 rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50 mt-2"
              >
                {creating ? "Adding product..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate Checkout Link */}
      {showCheckoutModal && activeProductForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-2xl border border-on-surface/10 p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-headline-md text-lg text-white font-bold">Generate Link</h3>
                <p className="text-xs text-on-surface/55 mt-0.5">Product: {activeProductForCheckout.name} ({(activeProductForCheckout.priceKobo/100).toLocaleString('en-NG', {style:'currency',currency:'NGN'})})</p>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-on-surface/50 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {!generatedLink ? (
              <form onSubmit={handleGenerateCheckout} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface/60 font-label-mono uppercase">Customer Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface/60 font-label-mono uppercase">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Adedayo Olamide"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-on-surface/60 font-label-mono uppercase">Payment Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="bg-surface/90 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="CARD">Card Gateway</option>
                      <option value="BANK_TRANSFER">Bank Transfer (VBAN)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-on-surface/60 font-label-mono uppercase">Redirect Success URL</label>
                    <input
                      type="text"
                      placeholder="e.g. https://my-store.com/receipt"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="font-label-mono bg-inverse-primary text-on-primary py-3 rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-50 mt-2"
                >
                  {generating ? "Initializing checkout link..." : "Generate Payment Link"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-5 py-2 animate-fade-in">
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-start gap-2.5">
                  <span className="material-symbols-outlined">check_circle</span>
                  <div>
                    <span className="font-semibold block text-white">Payment Link Ready!</span>
                    Customer can pay with {payMethod === "CARD" ? "Card" : "Bank Transfer"}.
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface/60 font-label-mono uppercase">Generated URL Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="bg-surface/50 border border-on-surface/10 rounded-xl px-4 py-3 text-xs text-white grow focus:outline-none font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-inverse-primary text-on-primary px-4 rounded-xl flex items-center justify-center hover:scale-[1.02] transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copied ? "done" : "content_copy"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-between gap-4">
                  <button
                    onClick={() => {
                      // Open link in new tab to let them simulate it immediately!
                      window.open(generatedLink, "_blank");
                    }}
                    className="border border-outline text-white px-5 py-2.5 rounded-xl text-sm hover:bg-on-surface/5"
                  >
                    Open Checkout Page ↗
                  </button>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="bg-on-surface/10 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-on-surface/20"
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
