 import React from 'react';
import { Truck, Phone, Mail, MapPin, Scale, ShieldCheck } from 'lucide-react';
import CompanyLogo from './CompanyLogo';
import { numberToWords, formatINR } from '../utils/numberToWords';

export default function InvoicePrint({ bill, company }) {
  if (!bill) return null;

  const trips =
    Array.isArray(bill.trips) && bill.trips.length > 0
      ? bill.trips
      : [
          {
            id: 'TRIP-1',
            date: bill.date || new Date().toISOString().split('T')[0],
            vehicleNo: bill.vehicleNo || 'N/A',
            routeFrom: bill.routeFrom || 'Narmadapuram',
            routeTo: bill.routeTo || 'Destination',
            material: bill.material || 'Agro Cargo',
            loadedWeightKg: Number(bill.loadedWeightKg) || 10000,
            emptyWeightKg: Number(bill.emptyWeightKg) || 3000,
            netWeightKg: Number(bill.netWeightKg) || 7000,
            weightQuintals: Number(bill.weightQuintals) || 70,
            perkuntaRate: Number(bill.perkuntaRate) || 20,
            freightAmount: Number(bill.freightAmount) || 1400,
          },
        ];

  const totalLoadedKg = trips.reduce(
    (sum, t) => sum + (Number(t.loadedWeightKg) || 0),
    0
  );

  const totalEmptyKg = trips.reduce(
    (sum, t) => sum + (Number(t.emptyWeightKg) || 0),
    0
  );

  const totalNetKg = trips.reduce(
    (sum, t) =>
      sum +
      (Number(t.netWeightKg) ||
        (Number(t.loadedWeightKg) - Number(t.emptyWeightKg))),
    0
  );

  const totalNetQuintals = trips.reduce(
    (sum, t) =>
      sum +
      (Number(t.weightQuintals) ||
        Number(t.netWeightKg) / 100),
    0
  );

  const totalTripsFreight = trips.reduce(
    (sum, t) =>
      sum +
      (Number(t.freightAmount) ||
        Number(t.weightQuintals) * Number(t.perkuntaRate)),
    0
  );

  const netAmount =
    bill.netPayable !== undefined
      ? bill.netPayable
      : Math.max(0, bill.grossTotal - bill.advancePaid);

  const words = numberToWords(
    netAmount > 0 ? netAmount : bill.grossTotal
  );

  return (
    <div
      id="bilty-invoice-print"
      className="print-container bg-white text-slate-900 p-3 sm:p-8 max-w-4xl mx-auto border border-slate-300 rounded-lg shadow-sm font-sans text-xs sm:text-sm"
    >
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="border-b-2 border-cyan-600 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Company Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            
            {/* Logo */}
            <div className="bg-slate-950 p-2.5 rounded-xl shadow-md border border-cyan-500/40 shrink-0">
              <CompanyLogo
                className="h-10 sm:h-14"
                showTagline={false}
              />
            </div>

            {/* Company Details */}
            <div>
              <p className="text-[10px] sm:text-xs font-extrabold text-cyan-600 tracking-wider">
                YOUR GOODS, OUR RESPONSIBILITY • FLEET OPERATORS & HEAVY LOGISTICS
              </p>

              <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5">
                Head Office: Uday Chowk, Kosta Mohalla, Mandla (M.P.) - 481661
              </p>

              {/* Phone */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[10px] sm:text-[11px] text-slate-600 mt-0.5">
                <span className="flex items-center font-semibold">
                  <Phone className="w-3 h-3 mr-1 text-cyan-600" />
                  +91 86022 55077, +91 88789 70847
                </span>
              </div>
{/* Proprietors */}
<div className="mt-1.5 flex items-center gap-2">
  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
    Proprietors
  </span>

  <span className="h-3 border-l border-slate-300"></span>

  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800">
    Ramesh Sahu
  </span>

  <span className="text-cyan-600 font-bold">&</span>

  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800">
    Sandesh Sahu
  </span>
</div>
              {/* Owners */}
              {/* <div className="text-[10px] sm:text-[11px] text-slate-700 mt-1">
                <span className="font-bold text-slate-800">
                  Proprietors:
                </span>{' '}
                Ramesh Sahu &nbsp; | &nbsp; Sandesh Sahu
              </div> */}
            </div>
          </div>

          {/* Bilty Information */}
          <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-200">
            
            <div className="inline-block bg-cyan-50 text-cyan-900 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded border border-cyan-300 uppercase tracking-widest">
              GOODS TRANSPORT BILTY
            </div>

            <div className="text-right sm:text-right sm:mt-1">
              <div className="text-[11px] sm:text-xs font-bold text-slate-800">
                Bilty No:{' '}
                <span className="text-cyan-700 text-xs sm:text-sm font-black">
                  {bill.biltyNo || bill.id}
                </span>
              </div>

              <div className="text-[10px] sm:text-xs text-slate-600">
                Date:{' '}
                <span className="font-semibold text-slate-900">
                  {bill.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CUSTOMER + WEIGHT SUMMARY
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 border border-slate-200 rounded-lg p-3 sm:p-3.5 bg-slate-50/50">
        
        {/* Customer / Party Details */}
        <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-3">
          
          <div className="text-[10px] sm:text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1">
            Consignor / Bill To (Customer Party):
          </div>

          <div className="text-xs sm:text-sm font-black text-slate-900">
            {bill.clientName}
          </div>

          {bill.clientPhone && (
            <div className="text-[11px] sm:text-xs text-slate-700">
              Phone: {bill.clientPhone}
            </div>
          )}

          {bill.clientAddress && (
            <div className="text-[11px] sm:text-xs text-slate-700">
              Address: {bill.clientAddress}
            </div>
          )}

          {bill.clientGstin && (
            <div className="text-[11px] sm:text-xs text-slate-700">
              GSTIN:{' '}
              <span className="font-mono font-semibold">
                {bill.clientGstin}
              </span>
            </div>
          )}
        </div>

        {/* Dharamkanta Multi-Trip Overview */}
        <div className="pt-1 md:pt-0 md:pl-1">
          
          <div className="text-[10px] sm:text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1">
            Dharamkanta Weight & Trip Overview:
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs">
            
            <div>
              <span className="text-slate-500">
                Total Trips:
              </span>{' '}
              <b className="text-cyan-800 text-xs sm:text-sm">
                {trips.length}{' '}
                {trips.length === 1 ? 'Trip' : 'Trips'}
              </b>
            </div>

            <div>
              <span className="text-slate-500">
                Total Cargo Wt:
              </span>{' '}
              <b className="text-slate-900">
                {totalNetQuintals} Qtl (
                {totalNetKg.toLocaleString('en-IN')} kg)
              </b>
            </div>

            <div>
              <span className="text-slate-500">
                Total Load Wt:
              </span>{' '}
              <span className="text-slate-900">
                {totalLoadedKg > 0
                  ? `${totalLoadedKg.toLocaleString('en-IN')} kg`
                  : '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-500">
                Total Khali Wt:
              </span>{' '}
              <span className="text-slate-900">
                {totalEmptyKg > 0
                  ? `${totalEmptyKg.toLocaleString('en-IN')} kg`
                  : '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-500">
                Payment Status:
              </span>{' '}
              <b className="text-slate-900">
                {bill.paymentStatus}
              </b>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          TRIP / FREIGHT TABLE
      ========================================================= */}
      <div className="overflow-x-auto w-full border border-slate-300 rounded-lg mb-4">
        <table className="w-full text-left border-collapse min-w-[620px] sm:min-w-0 text-[11px] sm:text-xs">
          
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              
              <th className="py-2 px-2 border-r border-slate-300 text-center">
                S.No
              </th>

              <th className="py-2 px-2 border-r border-slate-300">
                Trip Date & Truck
              </th>

              <th className="py-2 px-2.5 border-r border-slate-300">
                Route & Goods
              </th>

              <th className="py-2 px-2 border-r border-slate-300 text-center">
                Load Wt (Kg)
              </th>

              <th className="py-2 px-2 border-r border-slate-300 text-center">
                Khali Wt (Kg)
              </th>

              <th className="py-2 px-2 border-r border-slate-300 text-center">
                Net Wt (Kg)
              </th>

              <th className="py-2 px-2 border-r border-slate-300 text-center bg-cyan-100/70 text-cyan-950 font-extrabold">
                Net Qtl
              </th>

              <th className="py-2 px-2 border-r border-slate-300 text-right">
                Perkunta Rate
              </th>

              <th className="py-2 px-3 text-right">
                Trip Freight (₹)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            
            {trips.map((t, idx) => {
              const loaded =
                Number(t.loadedWeightKg) || 0;

              const empty =
                Number(t.emptyWeightKg) || 0;

              const netKg =
                Number(t.netWeightKg) ||
                (loaded >= empty
                  ? loaded - empty
                  : 0);

              const netQtl =
                Number(t.weightQuintals) ||
                (netKg > 0 ? netKg / 100 : 0);

              const rate =
                Number(t.perkuntaRate) || 0;

              const freight =
                Number(t.freightAmount) ||
                (netQtl * rate);

              return (
                <tr
                  key={t.id || idx}
                  className="hover:bg-slate-50"
                >
                  
                  <td className="py-2.5 px-2 border-r border-slate-300 text-center font-bold">
                    {idx + 1}
                  </td>

                  <td className="py-2.5 px-2 border-r border-slate-300 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">
                      {t.vehicleNo}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      {t.date || bill.date}
                    </div>
                  </td>

                  <td className="py-2.5 px-2.5 border-r border-slate-300">
                    <div className="font-bold text-slate-900">
                      {t.routeFrom || 'Origin'} →{' '}
                      {t.routeTo || 'Destination'}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      {t.material || 'Agro Cargo'}
                    </div>
                  </td>

                  <td className="py-2.5 px-2 border-r border-slate-300 text-center text-slate-700">
                    {loaded > 0
                      ? `${loaded.toLocaleString('en-IN')} kg`
                      : '-'}
                  </td>

                  <td className="py-2.5 px-2 border-r border-slate-300 text-center text-slate-700">
                    {empty > 0
                      ? `${empty.toLocaleString('en-IN')} kg`
                      : '-'}
                  </td>

                  <td className="py-2.5 px-2 border-r border-slate-300 text-center font-semibold text-slate-800">
                    {netKg > 0
                      ? `${netKg.toLocaleString('en-IN')} kg`
                      : '-'}
                  </td>

                  <td className="py-2.5 px-2 border-r border-slate-300 text-center font-black bg-cyan-50 text-cyan-900 text-xs">
                    {netQtl} Qtl
                  </td>

                  <td className="py-2.5 px-2 border-r border-slate-300 text-right font-bold text-cyan-700">
                    ₹{rate} /Qtl
                  </td>

                  <td className="py-2.5 px-3 text-right font-bold text-xs">
                    {formatINR(freight)}
                  </td>
                </tr>
              );
            })}

            {/* =====================================================
                TOTAL COMBINED
            ===================================================== */}
            <tr className="bg-slate-100 font-bold border-t border-slate-300">
              
              <td
                colSpan="3"
                className="py-2 px-3 text-right border-r border-slate-300"
              >
                Total Combined ({trips.length}{' '}
                {trips.length === 1 ? 'Trip' : 'Trips'}):
              </td>

              <td className="py-2 px-2 text-center border-r border-slate-300 text-slate-800">
                {totalLoadedKg > 0
                  ? `${totalLoadedKg.toLocaleString('en-IN')} kg`
                  : '-'}
              </td>

              <td className="py-2 px-2 text-center border-r border-slate-300 text-slate-800">
                {totalEmptyKg > 0
                  ? `${totalEmptyKg.toLocaleString('en-IN')} kg`
                  : '-'}
              </td>

              <td className="py-2 px-2 text-center border-r border-slate-300 text-slate-900 font-extrabold">
                {totalNetKg > 0
                  ? `${totalNetKg.toLocaleString('en-IN')} kg`
                  : '-'}
              </td>

              <td className="py-2 px-2 text-center border-r border-slate-300 text-cyan-950 font-black">
                {totalNetQuintals} Qtl
              </td>

              <td className="py-2 px-2 text-right border-r border-slate-300 text-slate-500">
                -
              </td>

              <td className="py-2 px-3 text-right font-black text-cyan-800">
                {formatINR(totalTripsFreight)}
              </td>
            </tr>

            {/* Loading Charges */}
            {bill.loadingCharges > 0 && (
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">
                  +
                </td>

                <td
                  colSpan="7"
                  className="py-1.5 px-3 border-r border-slate-300 text-slate-700"
                >
                  Loading Charges (हम्माली)
                </td>

                <td className="py-1.5 px-3 text-right font-medium">
                  {formatINR(bill.loadingCharges)}
                </td>
              </tr>
            )}

            {/* Unloading Charges */}
            {bill.unloadingCharges > 0 && (
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">
                  +
                </td>

                <td
                  colSpan="7"
                  className="py-1.5 px-3 border-r border-slate-300 text-slate-700"
                >
                  Unloading Charges (उतराई)
                </td>

                <td className="py-1.5 px-3 text-right font-medium">
                  {formatINR(bill.unloadingCharges)}
                </td>
              </tr>
            )}

            {/* Halting Charges */}
            {bill.haltingCharges > 0 && (
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">
                  +
                </td>

                <td
                  colSpan="7"
                  className="py-1.5 px-3 border-r border-slate-300 text-slate-700"
                >
                  Halting / Demurrage Charges
                </td>

                <td className="py-1.5 px-3 text-right font-medium">
                  {formatINR(bill.haltingCharges)}
                </td>
              </tr>
            )}

            {/* Toll Taxes */}
            {bill.tollTaxes > 0 && (
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">
                  +
                </td>

                <td
                  colSpan="7"
                  className="py-1.5 px-3 border-r border-slate-300 text-slate-700"
                >
                  Toll & Highway Taxes
                </td>

                <td className="py-1.5 px-3 text-right font-medium">
                  {formatINR(bill.tollTaxes)}
                </td>
              </tr>
            )}
          </tbody>

          {/* =======================================================
              TOTALS
          ======================================================= */}
          <tfoot>
            
            <tr className="bg-slate-50 border-t border-slate-300">
              <td
                colSpan="8"
                className="py-2 px-3 text-right font-bold text-slate-800 border-r border-slate-300"
              >
                Gross Total Billed Amount:
              </td>

              <td className="py-2 px-3 text-right font-black text-sm text-slate-900">
                {formatINR(bill.grossTotal)}
              </td>
            </tr>

            {/* Advance */}
            {bill.advancePaid > 0 && (
              <tr className="bg-slate-50">
                <td
                  colSpan="8"
                  className="py-1.5 px-3 text-right font-bold text-slate-600 border-r border-slate-300"
                >
                  Less: Advance Paid (अग्रिम):
                </td>

                <td className="py-1.5 px-3 text-right font-bold text-rose-700">
                  - {formatINR(bill.advancePaid)}
                </td>
              </tr>
            )}

            {/* Net Payable */}
            <tr className="bg-cyan-50 border-t-2 border-cyan-400">
              
              <td
                colSpan="8"
                className="py-2 px-3 text-right font-black text-cyan-950 border-r border-slate-300"
              >
                NET BALANCE PAYABLE:
              </td>

              <td className="py-2 px-3 text-right font-black text-base text-cyan-700">
                {formatINR(netAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* =========================================================
          AMOUNT IN WORDS
      ========================================================= */}
      <div className="bg-slate-100 p-2.5 rounded border border-slate-300 mb-4 text-[11px] sm:text-xs">
        <span className="font-bold text-slate-700">
          Amount in Words:{' '}
        </span>

        <span className="font-bold text-slate-900 capitalize italic">
          {words}
        </span>
      </div>

      {/* =========================================================
          BANK DETAILS + SIGNATURE
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
        
        {/* Bank Details */}
        <div className="text-[10px] sm:text-[11px] text-slate-600 space-y-1">
          
          <div className="font-bold text-slate-800 uppercase">
            Bank Payment Details:
          </div>

          {/*
          <div>
            Bank: <b>State Bank of India</b>
          </div>

          <div>
            Account Name: <b>MAA NARMADA TRANSPORT</b>
          </div>

          <div>
            A/C No: <b>389201004592</b> • IFSC: <b>SBIN0001245</b>
          </div>

          <div className="text-[9px] sm:text-[10px] text-slate-500 pt-1">
            * Goods carried at owner's risk subject to Narmadapuram jurisdiction.
          </div>
          */}
        </div>

        {/* Signature */}
        <div className="text-left sm:text-right flex flex-col justify-between items-start sm:items-end pt-2 sm:pt-0">
          
          <div className="text-xs font-bold text-slate-900">
            For <b>MAA NARMADA TRANSPORT</b>
          </div>

          <div className="pt-6 sm:pt-8">
            
            <div className="w-36 border-b border-slate-400 mb-1"></div>

            <div className="text-[10px] sm:text-[11px] font-bold text-slate-700">
              Authorized Signature
            </div>

            {/* Owner Names */}
            <div className="text-[10px] sm:text-[11px] text-slate-600 mt-2">
              Ramesh Sahu & Sandesh Sahu
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}