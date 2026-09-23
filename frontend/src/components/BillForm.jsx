import React, { useState, useEffect } from 'react';
import { Save, Calculator, Truck, User, MapPin, Scale, Plus, Trash2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { numberToWords, formatINR } from '../utils/numberToWords';

export default function BillForm({ clients, onSaveBill, onCancel, editingBill }) {
  const defaultTrip = () => ({
    id: `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: new Date().toISOString().split('T')[0],
    vehicleNo: '',
    driverName: '',
    routeFrom: '',
    routeTo: '',
    material: '',
    loadedWeightKg: '',
    emptyWeightKg: '',
    netWeightKg: '',
    weightQuintals: '',
    perkuntaRate: 20
  });

  const [formData, setFormData] = useState({
    biltyNo: '',
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    clientGstin: '',
    trips: [defaultTrip()],
    loadingCharges: 0,
    unloadingCharges: 0,
    haltingCharges: 0,
    tollTaxes: 0,
    advancePaid: 0,
    paymentStatus: 'Pending',
    notes: ''
  });

  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    if (editingBill) {
      const tripsList = Array.isArray(editingBill.trips) && editingBill.trips.length > 0
        ? editingBill.trips.map(t => ({
            ...t,
            loadedWeightKg: t.loadedWeightKg !== undefined ? t.loadedWeightKg : (t.loadedWeight ? t.loadedWeight * 100 : ''),
            emptyWeightKg: t.emptyWeightKg !== undefined ? t.emptyWeightKg : (t.emptyWeight ? t.emptyWeight * 100 : ''),
            netWeightKg: t.netWeightKg !== undefined ? t.netWeightKg : (t.weightQuintals ? t.weightQuintals * 100 : ''),
            weightQuintals: t.weightQuintals || ''
          }))
        : [{
            id: 'TRIP-1',
            date: editingBill.date || new Date().toISOString().split('T')[0],
            vehicleNo: editingBill.vehicleNo || '',
            driverName: editingBill.driverName || '',
            routeFrom: editingBill.routeFrom || '',
            routeTo: editingBill.routeTo || '',
            material: editingBill.material || '',
            loadedWeightKg: editingBill.loadedWeightKg || 10000,
            emptyWeightKg: editingBill.emptyWeightKg || 3000,
            netWeightKg: editingBill.netWeightKg || 7000,
            weightQuintals: editingBill.weightQuintals || 70,
            perkuntaRate: editingBill.perkuntaRate || 20
          }];

      setFormData({
        ...editingBill,
        trips: tripsList
      });
      setClientSearchQuery(editingBill.clientName || '');
    } else {
      const randomBilty = `MNT/${new Date().getFullYear().toString().slice(-2)}/${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData(prev => ({ ...prev, biltyNo: randomBilty, trips: [defaultTrip()] }));
    }
  }, [editingBill]);

  // Add Trip
  const handleAddTrip = () => {
    setFormData(prev => ({
      ...prev,
      trips: [...prev.trips, defaultTrip()]
    }));
  };

  // Remove Trip
  const handleRemoveTrip = (index) => {
    if (formData.trips.length <= 1) {
      alert('A bill must contain at least 1 trip entry');
      return;
    }
    setFormData(prev => ({
      ...prev,
      trips: prev.trips.filter((_, i) => i !== index)
    }));
  };

  // Handle Trip Inputs & Dharamkanta Auto Math (10000 - 3000 = 7000 Kg = 70 Quintals)
  const handleTripChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTrips = [...prev.trips];
      const trip = { ...updatedTrips[index], [field]: value };

      if (field === 'loadedWeightKg' || field === 'emptyWeightKg') {
        const loaded = field === 'loadedWeightKg' ? Number(value) || 0 : Number(trip.loadedWeightKg) || 0;
        const empty = field === 'emptyWeightKg' ? Number(value) || 0 : Number(trip.emptyWeightKg) || 0;
        
        if (loaded > 0 && empty >= 0 && loaded >= empty) {
          const netKg = loaded - empty;
          trip.netWeightKg = netKg;
          trip.weightQuintals = netKg / 100;
        }
      }

      if (field === 'weightQuintals') {
        const qtl = Number(value) || 0;
        trip.netWeightKg = qtl * 100;
      }

      updatedTrips[index] = trip;
      return { ...prev, trips: updatedTrips };
    });
  };

  // Calculations
  const calculatedTrips = formData.trips.map(t => {
    const loadedKg = Number(t.loadedWeightKg) || 0;
    const emptyKg = Number(t.emptyWeightKg) || 0;
    const netKg = Number(t.netWeightKg) || (loadedKg >= emptyKg ? loadedKg - emptyKg : 0);
    const realQuintals = Number(t.weightQuintals) || (netKg > 0 ? netKg / 100 : 0);
    const rate = Number(t.perkuntaRate) || 0;
    const freight = realQuintals * rate;

    return {
      ...t,
      loadedWeightKg: loadedKg,
      emptyWeightKg: emptyKg,
      netWeightKg: netKg,
      weightQuintals: realQuintals,
      rate,
      freight
    };
  });

  const totalLoadedKg = calculatedTrips.reduce((sum, t) => sum + t.loadedWeightKg, 0);
  const totalEmptyKg = calculatedTrips.reduce((sum, t) => sum + t.emptyWeightKg, 0);
  const totalNetKg = calculatedTrips.reduce((sum, t) => sum + t.netWeightKg, 0);
  const totalNetQuintals = calculatedTrips.reduce((sum, t) => sum + t.weightQuintals, 0);
  const totalFreightAmount = calculatedTrips.reduce((sum, t) => sum + t.freight, 0);

  const loading = Number(formData.loadingCharges) || 0;
  const unloading = Number(formData.unloadingCharges) || 0;
  const halting = Number(formData.haltingCharges) || 0;
  const toll = Number(formData.tollTaxes) || 0;

  const grossTotal = totalFreightAmount + loading + unloading + halting + toll;
  const advance = Number(formData.advancePaid) || 0;
  const netPayable = Math.max(0, grossTotal - advance);

  const amountInWords = numberToWords(netPayable > 0 ? netPayable : grossTotal);

  const handleClientSelect = (client) => {
    setFormData(prev => ({
      ...prev,
      clientName: client.name,
      clientPhone: client.phone || '',
      clientAddress: client.address || '',
      clientGstin: client.gstin || ''
    }));
    setClientSearchQuery(client.name);
    setShowClientDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName) {
      alert('Please enter or select a Client / Party Name');
      return;
    }

    for (let i = 0; i < calculatedTrips.length; i++) {
      const t = calculatedTrips[i];
     
      if (!t.weightQuintals || !t.rate) {
        alert(`Please enter Weight & Rate for Trip #${i + 1} (${t.vehicleNo})`);
        return;
      }
    }

    let calculatedStatus = formData.paymentStatus;
    if (netPayable === 0 && grossTotal > 0) {
      calculatedStatus = 'Paid';
    } else if (advance > 0 && netPayable > 0) {
      calculatedStatus = 'Partial';
    }

    onSaveBill({
      ...formData,
      trips: calculatedTrips,
      loadedWeightKg: totalLoadedKg,
      emptyWeightKg: totalEmptyKg,
      netWeightKg: totalNetKg,
      weightQuintals: totalNetQuintals,
      freightAmount: totalFreightAmount,
      loadingCharges: loading,
      unloadingCharges: unloading,
      haltingCharges: halting,
      tollTaxes: toll,
      grossTotal,
      advancePaid: advance,
      netPayable,
      paymentStatus: calculatedStatus
    });
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Form Header */}
        <div className="glass-card p-6 border-l-4 border-cyan-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
              <Truck className="w-6 h-6 text-cyan-400 mr-2" />
              {editingBill ? 'Edit Transport Bill' : 'Create Customer Bilty Bill'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              MAA NARMADA TRANSPORT • Dharamkanta Weight Conversion 
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Bilty No:</span>
            <input
              type="text"
              name="biltyNo"
              value={formData.biltyNo}
              onChange={handleChange}
              className="px-3 py-1.5 rounded-lg text-sm font-black bg-slate-800 text-cyan-400 border border-cyan-900/60 w-36 text-center"
              required
            />
          </div>
        </div>

        {/* Section 1: Client Details */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center">
            <User className="w-4 h-4 mr-2" />
            1. Client / Customer Party Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Client Name with Autocomplete */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Client / Party Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={clientSearchQuery}
                onChange={(e) => {
                  setClientSearchQuery(e.target.value);
                  setFormData(prev => ({ ...prev, clientName: e.target.value }));
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
                placeholder="Type customer name (e.g., Shree Ram Agro)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />

              {showClientDropdown && filteredClients.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  <div className="p-2 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    Saved Clients (Select to auto-fill)
                  </div>
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      onClick={() => handleClientSelect(client)}
                      className="p-2.5 hover:bg-cyan-50 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b last:border-0 border-slate-100 dark:border-slate-700/50"
                    >
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">{client.name}</div>
                      <div className="text-xs text-slate-500 flex justify-between">
                        <span>{client.phone}</span>
                        <span>{client.gstin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+91 98260 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            {/* Client Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Address / Station
              </label>
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="Market Road, Narmadapuram M.P."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            {/* Client GSTIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Client GSTIN / License No.
              </label>
              <input
                type="text"
                name="clientGstin"
                value={formData.clientGstin}
                onChange={handleChange}
                placeholder="23AAAAA0000A1Z5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Section 2: Trips & Dharamkanta Weight Calculation Engine */}
        <div className="glass-card p-6 bg-gradient-to-br from-cyan-950/20 via-transparent to-blue-950/20 border-cyan-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center">
                <Scale className="w-4 h-4 mr-2" />
                2. Dharamkanta Weight Entry & Trip Freight ({formData.trips.length} {formData.trips.length === 1 ? 'Trip' : 'Trips'})
              </h3>
              <p className="text-xs text-slate-400">
                Formula: <span className="text-cyan-300 font-bold">Load Gadi Kg - Khali Gadi Kg = Net Kg ÷ 100 = Quintals × Rate = Freight Amount</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTrip}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              + Add Another Trip / Truck
            </button>
          </div>

          {/* List of Trip Cards */}
          <div className="space-y-4">
            {calculatedTrips.map((trip, idx) => (
              <div
                key={trip.id || idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Trip Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-extrabold text-xs">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                      Trip / Truck Entry #{idx + 1}
                    </span>
                  </div>

                  {formData.trips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTrip(idx)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs font-bold flex items-center"
                      title="Remove Trip"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  )}
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={trip.date}
                      onChange={(e) => handleTripChange(idx, 'date', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Truck Vehicle No *</label>
                    <input
  type="text"
  value="MP 50 G 0874"
  onChange={() => {}}
  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase"
  
/>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">From Station</label>
                    <input
                      type="text"
                      value={trip.routeFrom}
                      onChange={(e) => handleTripChange(idx, 'routeFrom', e.target.value)}
                      placeholder="Narmadapuram"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">To Station</label>
                    <input
                      type="text"
                      value={trip.routeTo}
                      onChange={(e) => handleTripChange(idx, 'routeTo', e.target.value)}
                      placeholder="Indore "
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Material Description</label>
                    <input
                      type="text"
                      value={trip.material}
                      onChange={(e) => handleTripChange(idx, 'material', e.target.value)}
                      placeholder="Sharbati Wheat / Soyabean"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Owner Name</label>
                     <input
  type="text"
  value="Sandesh Sahu"
  readOnly
  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
/>
                  </div>
                </div>

                {/* Dharamkanta Weight Inputs (Kg) -> Converted Quintals -> Rate = Freight */}
                <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Dharamkanta Slip Calculator (Kg → Quintals)</span>
                    <span className="text-[10px] text-slate-400 font-normal">e.g. 10000kg - 3000kg = 7000kg = 70 Qtl</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-center text-xs">
                    
                    {/* Load Gadi Kg */}
                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">Load Gadi (भरी Kg)</label>
                      <input
                        type="number"
                        value={trip.loadedWeightKg}
                        onChange={(e) => handleTripChange(idx, 'loadedWeightKg', e.target.value)}
                        placeholder="10000"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-sm"
                      />
                    </div>

                    {/* Khali Gadi Kg */}
                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">Khali Gadi (खाली Kg)</label>
                      <input
                        type="number"
                        value={trip.emptyWeightKg}
                        onChange={(e) => handleTripChange(idx, 'emptyWeightKg', e.target.value)}
                        placeholder="3000"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-sm"
                      />
                    </div>

                    {/* Net Real Kg */}
                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 mb-1">Net Real Kg</label>
                      <div className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white text-sm">
                        {trip.netWeightKg ? `${trip.netWeightKg} kg` : '-'}
                      </div>
                    </div>

                    {/* Net Quintals */}
                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold text-cyan-400 mb-1">Net Quintals (कुंतल)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={trip.weightQuintals}
                        onChange={(e) => handleTripChange(idx, 'weightQuintals', e.target.value)}
                        placeholder="70 Qtl"
                        className="w-full px-3 py-2 rounded-lg border border-cyan-600 bg-cyan-950 text-cyan-300 font-black text-sm"
                        required
                      />
                    </div>

                    {/* Perkunta Rate */}
                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">Perkunta Rate (₹/Qtl)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={trip.perkuntaRate}
                        onChange={(e) => handleTripChange(idx, 'perkuntaRate', e.target.value)}
                        placeholder="20"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-sm"
                        required
                      />
                    </div>

                    {/* Trip Freight Result */}
                    <div className="col-span-2 sm:col-span-1 text-right bg-gradient-to-r from-cyan-950 to-blue-950 p-2.5 rounded-lg border border-cyan-500/40">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase block">Freight Amount</span>
                      <span className="text-base font-black text-cyan-300">{formatINR(trip.freight)}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">({trip.weightQuintals} Qtl × ₹{trip.rate})</span>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Combined Multi-Trip Totals Summary Banner */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                Total Combined Trips Summary ({calculatedTrips.length} {calculatedTrips.length === 1 ? 'Trip' : 'Trips'})
              </span>
              <div className="text-xs text-slate-300">
                Total Net Real Weight: <b className="text-cyan-300 font-mono">{totalNetKg.toLocaleString('en-IN')} Kg</b> = <b className="text-white font-extrabold">{totalNetQuintals} Quintals</b> (Load {totalLoadedKg}kg - Khali {totalEmptyKg}kg)
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Combined Trips Freight Total</span>
              <div className="text-2xl font-black text-cyan-300">{formatINR(totalFreightAmount)}</div>
            </div>
          </div>

          {/* Additional Freight Charges */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-5">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-3">
              Additional Bill Expenses & Charges
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Loading (हम्माली)</label>
                <input
                  type="number"
                  name="loadingCharges"
                  value={formData.loadingCharges}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Unloading (उतराई)</label>
                <input
                  type="number"
                  name="unloadingCharges"
                  value={formData.unloadingCharges}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Halting / Demurrage</label>
                <input
                  type="number"
                  name="haltingCharges"
                  value={formData.haltingCharges}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Toll / Taxes</label>
                <input
                  type="number"
                  name="tollTaxes"
                  value={formData.tollTaxes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Section 3: Payment Summary & Net Payable */}
        <div className="glass-card p-6 bg-slate-950 text-white border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">Gross Total Amount</span>
                <div className="text-xl font-bold text-slate-200">{formatINR(grossTotal)}</div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-cyan-400 mb-1">Advance Paid (अग्रिम)</label>
                  <input
                    type="number"
                    name="advancePaid"
                    value={formData.advancePaid}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-bold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial Advance</option>
                    <option value="Paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">Amount in Words:</span>
                <span className="text-xs font-semibold text-cyan-300 italic">{amountInWords}</span>
              </div>
            </div>

            {/* Net Payable Highlights */}
            <div className="bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold tracking-widest uppercase text-cyan-100">
                  Net Customer Balance Payable
                </span>
                <div className="text-3xl md:text-4xl font-black tracking-tight mt-1">
                  {formatINR(netPayable)}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-cyan-300/30 pt-3 text-xs font-bold text-white">
                <span>Total Bill Balance</span>
                <span>{netPayable === 0 ? '✓ SETTLED' : 'DUE ON UNLOADING'}</span>
              </div>
            </div>

          </div>

          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bill Notes / Terms</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions or notes for the customer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/30 flex items-center transition-all transform active:scale-95 text-base"
          >
            <Save className="w-5 h-5 mr-2" />
            Save & Generate Customer Bilty Bill
          </button>
        </div>

      </form>
    </div>
  );
}
