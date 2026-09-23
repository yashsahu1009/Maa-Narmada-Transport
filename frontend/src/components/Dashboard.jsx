import React, { useState } from 'react';
import { TrendingUp, FileText, Scale, Clock, CheckCircle2, AlertCircle, PlusCircle, ArrowUpRight, ShieldCheck, Sparkles, Truck, Calculator } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import { formatINR } from '../utils/numberToWords';

export default function Dashboard({ stats, bills, onNewBill, onViewBill, onSelectClient }) {
  const recentBills = bills.slice(0, 5);

  // Live Interactive Dharamkanta Calculator State
  const [demoLoadKg, setDemoLoadKg] = useState(0);
  const [demoEmptyKg, setDemoEmptyKg] = useState(0);
  const [demoRate, setDemoRate] = useState(0);

  const demoNetKg = Math.max(0, demoLoadKg - demoEmptyKg);
  const demoQuintals = demoNetKg / 100;
  const demoFreight = demoQuintals * demoRate;

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* High Quality Cinematic Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200 dark:border-cyan-500/40 shadow-xl group">
        
        {/* High-Resolution Truck Hero Image with Light & Dark Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/truck_hero.jpg"
            alt="Maa Narmada Transport Heavy Fleet"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-wider uppercase animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Verified Transport & Bilty Management</span>
            </div>

            <div className="space-y-3">
              <CompanyLogo className="h-16" showTagline={true} />
              <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl">
                Heavy transport bilty generation, multi-trip loading entry, automated Dharamkanta weighbridge math, and instant 1-click PDF receipt downloads.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onNewBill}
                className="px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center transition-all transform active:scale-95"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create Bilty Bill
              </button>

              <button
                onClick={() => onSelectClient('')}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 shadow-lg flex items-center transition-all"
              >
                <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                All Customer Bills ({stats?.totalBills || 0})
              </button>
            </div>
          </div>

          {/* Right Live Interactive Dharamkanta Calculator Widget */}
          <div className="lg:col-span-5 bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-float text-white">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <div className="flex items-center space-x-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Live Dharamkanta Calculator</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                TRY IT HERE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Load Gadi (भरी Kg)</label>
                  <input
                    type="number"
                    value={demoLoadKg}
                    onChange={(e) => setDemoLoadKg(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Khali Gadi (खाली Kg)</label>
                  <input
                    type="number"
                    value={demoEmptyKg}
                    onChange={(e) => setDemoEmptyKg(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-between p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/60 font-mono text-cyan-300 font-bold">
                <span>Net Weight:</span>
                <span>{demoNetKg.toLocaleString('en-IN')} kg ({demoQuintals} Quintals)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-300">Perkunta Rate (₹/Qtl):</span>
                <input
                  type="number"
                  value={demoRate}
                  onChange={(e) => setDemoRate(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1 rounded bg-slate-950 border border-amber-500/40 text-amber-400 font-black text-right"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/20 border border-cyan-400/50 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-200">Freight Amount</span>
              <span className="text-2xl font-black text-cyan-300">{formatINR(demoFreight)}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Light & Dark Analytics KPI Glassmorphism Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Billed Freight */}
        <div className="glass-card-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Billed Freight</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatINR(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1">↑ Total</span> from {stats?.totalBills || 0} bilties
            </p>
          </div>
        </div>

        {/* Collected Advance */}
        <div className="glass-card-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Advance / Collected</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatINR(stats?.totalCollected || 0)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Received in bank / cash
            </p>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="glass-card-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Outstanding Balance</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {formatINR(stats?.totalPending || 0)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stats?.pendingBillsCount || 0} pending payment bills
            </p>
          </div>
        </div>

        {/* Total Cargo Quintals */}
        <div className="glass-card-interactive p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Cargo Moved</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {(stats?.totalQuintals || 0).toLocaleString('en-IN')} <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">Qtl</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Net real cargo weight
            </p>
          </div>
        </div>

      </div>

      {/* Logistics Fleet Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200 dark:border-cyan-900/50 shadow-lg group">
        <img
          src="/fleet_hub.jpg"
          alt="Maa Narmada Logistics Terminal"
          className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent flex items-center p-8">
          <div className="space-y-2 max-w-lg">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 block">Fleet Management Hub</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Heavy Transport & Bilty Operations</h3>
            <p className="text-xs text-slate-200">Fast customer bill lookups, Dharamkanta weight slip verification, and multi-truck bilty management.</p>
          </div>
        </div>
      </div>

      {/* Recent Transport Bills Showcase Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2" />
              Recent Transport Bilty Bills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest customer bilties, multi-trips, and freight status</p>
          </div>
          <button
            onClick={() => onSelectClient('')}
            className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center transition-colors"
          >
            View All Bills <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {recentBills.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No transport bills found</p>
            <p className="text-xs text-slate-500 mt-1">Click "Create Bilty Bill" to add your first bill.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
                  <th className="py-3 px-3">Bilty / Bill No</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer Party</th>
                  <th className="py-3 px-3">Trips & Truck</th>
                  <th className="py-3 px-3">Dharamkanta Wt (Net Qtl)</th>
                  <th className="py-3 px-3">Total Freight</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentBills.map(bill => {
                  const tripsCount = Array.isArray(bill.trips) ? bill.trips.length : 1;
                  return (
                    <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-3 font-extrabold text-slate-900 dark:text-white">
                        {bill.biltyNo || bill.id}
                      </td>
                      <td className="py-4 px-3 text-xs text-slate-600 dark:text-slate-300">
                        {bill.date}
                      </td>
                      <td className="py-4 px-3 font-bold text-cyan-700 dark:text-cyan-300">
                        {bill.clientName}
                      </td>
                      <td className="py-4 px-3 text-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{bill.vehicleNo}</div>
                        <div className="text-slate-500 dark:text-slate-400">{tripsCount} {tripsCount === 1 ? 'Trip' : 'Trips'} ({bill.routeFrom} → {bill.routeTo})</div>
                      </td>
                      <td className="py-4 px-3 text-xs">
                        <div className="font-black text-slate-900 dark:text-white">{bill.weightQuintals} Qtl</div>
                        {bill.netWeightKg && <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">({bill.netWeightKg} kg)</div>}
                      </td>
                      <td className="py-4 px-3 font-black text-slate-900 dark:text-white">
                        <div>{formatINR(bill.grossTotal)}</div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">₹{bill.perkuntaRate}/Qtl</div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          bill.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                            : bill.paymentStatus === 'Partial'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => onViewBill(bill)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md transition-all"
                        >
                          View & Download PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
