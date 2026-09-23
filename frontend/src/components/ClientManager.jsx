import React, { useState } from 'react';
import { Users, Plus, Phone, MapPin, Building, FileText, PlusCircle, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/numberToWords';

export default function ClientManager({ clients, bills, onCreateClient, onDeleteClient, onSelectClientForBill }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    address: '',
    gstin: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    onCreateClient(newClient);
    setNewClient({ name: '', phone: '', address: '', gstin: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <Users className="w-6 h-6 text-amber-500 mr-2" />
            Client & Customer Party Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage recurring transport clients and view party-wise billing summary
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md flex items-center transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Party Client
        </button>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map(client => {
          const clientBills = bills.filter(b => b.clientName && b.clientName.toLowerCase() === client.name.toLowerCase());
          const totalSpent = clientBills.reduce((sum, b) => sum + (Number(b.grossTotal) || 0), 0);
          const totalPending = clientBills.reduce((sum, b) => sum + (Number(b.netPayable) || 0), 0);

          return (
            <div key={client.id} className="glass-card p-5 relative flex flex-col justify-between hover:border-amber-500/50 transition-all">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                      {client.name.charAt(0)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {clientBills.length} Bills
                    </span>
                  </div>

                  {onDeleteClient && (
                    <button
                      onClick={() => onDeleteClient(client.id, client.name)}
                      title="Delete Party Client"
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                  {client.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone className="w-3.5 h-3.5 text-amber-500 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 mr-2" />
                      {client.address}
                    </div>
                  )}
                  {client.gstin && (
                    <div className="flex items-center">
                      <Building className="w-3.5 h-3.5 text-amber-500 mr-2" />
                      GSTIN: <span className="font-mono ml-1 font-semibold">{client.gstin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Stats Summary */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Total Billed</div>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">{formatINR(totalSpent)}</div>
                </div>

                <button
                  onClick={() => onSelectClientForBill(client.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-slate-950 transition-all flex items-center"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  New Bill
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Users className="w-5 h-5 text-amber-500 mr-2" />
              Add New Party / Client
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Party / Company Name *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Narmada Agro Industries"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+91 98260 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Address</label>
                <input
                  type="text"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Industrial Area, Narmadapuram"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={newClient.gstin}
                  onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value })}
                  placeholder="23AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md"
                >
                  Save Party Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
