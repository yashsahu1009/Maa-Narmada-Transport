import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, FileText, PlusCircle, Scale, MessageCircle } from 'lucide-react';
import { formatINR } from '../utils/numberToWords';
import { shareToWhatsApp } from '../utils/whatsapp';

export default function BillList({ bills, onNewBill, onViewBill, onEditBill, onDeleteBill, initialClientSearch }) {
  const [search, setSearch] = useState(initialClientSearch || '');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBills = bills.filter(bill => {
    const matchesSearch =
      (bill.clientName && bill.clientName.toLowerCase().includes(search.toLowerCase())) ||
      (bill.biltyNo && bill.biltyNo.toLowerCase().includes(search.toLowerCase())) ||
      (bill.vehicleNo && bill.vehicleNo.toLowerCase().includes(search.toLowerCase())) ||
      (bill.routeFrom && bill.routeFrom.toLowerCase().includes(search.toLowerCase())) ||
      (bill.routeTo && bill.routeTo.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || bill.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalFilteredFreight = filteredBills.reduce((sum, b) => sum + (Number(b.grossTotal) || 0), 0);
  const totalFilteredPending = filteredBills.reduce((sum, b) => sum + (Number(b.netPayable) || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Filter Controls */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <FileText className="w-6 h-6 text-cyan-400 mr-2" />
            Transport Bilty Bills Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search by party name, vehicle number, or bilty ID
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['All', 'Paid', 'Partial', 'Pending'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={onNewBill}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 shadow-md flex items-center transition-all"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Bill
          </button>

        </div>
      </div>

      {/* Filtered Summary Bar */}
      <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <div className="text-cyan-300">
          Showing <span className="font-extrabold text-white">{filteredBills.length}</span> bills matching criteria
        </div>
        <div className="flex items-center space-x-6">
          <div>Total Freight: <span className="font-bold text-white">{formatINR(totalFilteredFreight)}</span></div>
          <div>Outstanding Balance: <span className="font-bold text-rose-400">{formatINR(totalFilteredPending)}</span></div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="glass-card overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="font-medium text-slate-600 dark:text-slate-300">No transport bills found</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing search query or click "Create Bill"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 uppercase font-bold">
                  <th className="py-3.5 px-4">Bilty No</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client / Party Name</th>
                  <th className="py-3.5 px-4">Vehicle & Route</th>
                  <th className="py-3.5 px-4">Load Wt</th>
                  <th className="py-3.5 px-4">Khali Wt</th>
                  <th className="py-3.5 px-4">Real Cargo Wt</th>
                  <th className="py-3.5 px-4">Perkunta Freight</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBills.map(bill => {
                  const loadedWt = Number(bill.loadedWeight) || 0;
                  const emptyWt = Number(bill.emptyWeight) || 0;
                  const realWt = Number(bill.weightQuintals) || (loadedWt >= emptyWt ? loadedWt - emptyWt : 0);

                  return (
                    <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                        {bill.biltyNo || bill.id}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-300">
                        {bill.date}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-cyan-400">{bill.clientName}</div>
                        {bill.clientPhone && <div className="text-xs text-slate-400">{bill.clientPhone}</div>}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{bill.vehicleNo}</div>
                        <div className="text-slate-500">{bill.routeFrom} → {bill.routeTo}</div>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {loadedWt > 0 ? `${loadedWt} Qtl` : '-'}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {emptyWt > 0 ? `${emptyWt} Qtl` : '-'}
                      </td>
                      <td className="py-4 px-4 text-xs font-black text-cyan-500 dark:text-cyan-300">
                        {realWt} Qtl
                      </td>
                      <td className="py-4 px-4 text-xs font-extrabold text-slate-900 dark:text-white">
                        <div>{formatINR(bill.grossTotal)}</div>
                        <div className="text-[11px] text-cyan-400 font-semibold">₹{bill.perkuntaRate}/Qtl</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          bill.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : bill.paymentStatus === 'Partial'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                        }`}>
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => shareToWhatsApp(bill)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-500 hover:text-white transition-colors"
                            title="Share Bilty via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewBill(bill)}
                            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white transition-colors"
                            title="View & Download PDF Bilty"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditBill(bill)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Edit Bill"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBill(bill.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors"
                            title="Delete Bill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
