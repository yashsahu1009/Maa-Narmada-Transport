import html2pdf from 'html2pdf.js';

export async function downloadPdf(bill, elementId = 'bilty-invoice-print') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Invoice element not ready. Please try again.');
    return;
  }

  const biltyName = `Maa_Narmada_Bilty_${bill.biltyNo ? bill.biltyNo.replace(/\//g, '_') : bill.id}.pdf`;

  const opt = {
    margin: [6, 6, 6, 6],
    filename: biltyName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    // Primary html2pdf chain
    if (typeof html2pdf === 'function') {
      await html2pdf().set(opt).from(element).save();
      return;
    } else if (html2pdf && typeof html2pdf.default === 'function') {
      await html2pdf.default().set(opt).from(element).save();
      return;
    }
  } catch (err) {
    console.warn('html2pdf primary method failed:', err);
  }

  // Secondary html2pdf direct call
  try {
    const pdfFunc = typeof html2pdf === 'function' ? html2pdf : html2pdf.default;
    if (pdfFunc) {
      await pdfFunc(element, opt);
      return;
    }
  } catch (err2) {
    console.warn('html2pdf direct call failed:', err2);
  }

  // Ultimate Browser Fallback: Open Print / Save as PDF Dialog
  window.print();
}

export async function getPdfBlob(bill, elementId = 'bilty-invoice-print') {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const biltyName = `Maa_Narmada_Bilty_${bill.biltyNo ? bill.biltyNo.replace(/\//g, '_') : bill.id}.pdf`;

  const opt = {
    margin: [6, 6, 6, 6],
    filename: biltyName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      allowTaint: true
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    const pdfFunc = typeof html2pdf === 'function' ? html2pdf : (html2pdf.default || html2pdf);
    const worker = pdfFunc().set(opt).from(element);
    const pdfBlob = await worker.output('blob');
    return { pdfBlob, biltyName };
  } catch (e) {
    console.warn('getPdfBlob error:', e);
    return null;
  }
}
