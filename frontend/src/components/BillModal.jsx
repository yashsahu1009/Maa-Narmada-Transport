import React, { useState } from 'react';
import { X, Download, Printer, Edit, Trash2, MessageCircle, Loader2 } from 'lucide-react';
import InvoicePrint from './InvoicePrint';
import { shareToWhatsApp, sharePdfToWhatsApp } from '../utils/whatsapp';
import { downloadPdf } from '../utils/pdfGenerator';

export default function BillModal({ bill, onClose, onEdit, onDelete }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharingPdf, setIsSharingPdf] = useState(false);

  if (!bill) return null;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadPdf(bill);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareWhatsAppPdf = async () => {
    setIsSharingPdf(true);
    try {
      await sharePdfToWhatsApp(bill, 'bilty-invoice-print');
    } catch (err) {
      console.error('WhatsApp Share PDF error:', err);
    } finally {
      setIsSharingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-center justify-between sm:block">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest">Transport Bilty Preview</span>
              <h3 className="text-sm sm:text-lg font-extrabold text-white truncate max-w-[200px] xs:max-w-xs sm:max-w-md">
                Bilty #{bill.biltyNo || bill.id} — {bill.clientName}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            
            {/* WhatsApp PDF Share Button */}
            <button
              onClick={handleShareWhatsAppPdf}
              disabled={isSharingPdf}
              className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-70 text-white flex items-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              title="Share PDF Bilty Document on WhatsApp"
            >
              {isSharingPdf ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4 mr-1.5" />
              )}
              {isSharingPdf ? 'Preparing PDF...' : 'WhatsApp Share PDF'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white flex items-center shadow-lg shadow-cyan-500/20 transition-all"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              )}
              {isDownloading ? 'Saving PDF...' : 'PDF Download'}
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none justify-center px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center border border-slate-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              Print
            </button>

            <button
              onClick={() => onEdit(bill)}
              className="p-1.5 sm:p-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Edit Bill"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(bill.id)}
              className="p-1.5 sm:p-2 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60"
              title="Delete Bill"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="hidden sm:block p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-2 sm:p-6 overflow-y-auto bg-slate-200 dark:bg-slate-950 flex-1">
          <InvoicePrint bill={bill} />
        </div>

      </div>
    </div>
  );
}
