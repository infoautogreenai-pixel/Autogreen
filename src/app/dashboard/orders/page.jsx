'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  FileText,
  CheckCircle2,
  Printer,
  ArrowLeft,
  Loader2,
  LayoutDashboard,
  User as UserIcon,
  Coins,
  Sparkles,
  X
} from 'lucide-react';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/my-orders');
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 selection:bg-emerald-500 selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ============================================================== */}
        {/* DASHBOARD TOP NAVIGATION TABS                                  */}
        {/* ============================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-500" />
              <span>My Library</span>
            </Link>

            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>Order Invoices</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span>Account Settings</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
              <Coins className="h-4 w-4 text-amber-500" />
              <span>{user?.points || 0} pts</span>
            </div>

            <Link
              href="/#kits"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Order History & Tax Invoices
              </h1>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-extrabold">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">
              View your transaction receipts, download tax invoices, and track cashback points rewards.
            </p>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Discover our AI marketing kits and guides in the catalog.
            </p>
            <div className="pt-2">
              <Link
                href="/#kits"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                <span>Browse Kits</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Orders Table */
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Order ID</th>
                    <th className="py-3.5 px-4 font-bold">Course / Kit</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold">Amount Paid</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <span className="line-clamp-1">{ord.guideTitle}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        ${ord.amount}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{ord.status.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoice(ord)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl space-y-6 text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Tax Invoice Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="space-y-6 text-xs bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-slate-900">AutoGreen AI</h2>
                  <p className="text-slate-600">Digital Rights Managed AI Ecosystem & Kits</p>
                  <p className="text-slate-400 text-[11px] font-mono">Invoice #{selectedInvoice.orderNumber}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Billed To</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedInvoice.customerDetails?.name || user?.name}</p>
                  <p className="text-slate-600 font-mono">{selectedInvoice.customerDetails?.email || user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Payment Date</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-600">Gateway: {selectedInvoice.paymentGateway?.toUpperCase()}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>{selectedInvoice.guideTitle}</span>
                  <span className="font-mono">${selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Original Price</span>
                  <span className="font-mono">${selectedInvoice.originalPrice || selectedInvoice.amount}</span>
                </div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Applied</span>
                    <span className="font-mono">-${selectedInvoice.discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-base">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-emerald-600">${selectedInvoice.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
