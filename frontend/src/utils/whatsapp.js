import { formatINR } from './numberToWords';
import { getPdfBlob, downloadPdf } from './pdfGenerator';

export function formatWhatsAppMessage(bill) {
  const trips = Array.isArray(bill.trips) && bill.trips.length > 0 ? bill.trips : [];
  const primaryTrip = trips[0] || {};

  const vehicle = bill.vehicleNo || primaryTrip.vehicleNo || 'N/A';
  const routeFrom = primaryTrip.routeFrom || bill.routeFrom || 'Origin';
  const routeTo = primaryTrip.routeTo || bill.routeTo || 'Destination';
  const material = primaryTrip.material || bill.material || 'Agro Goods';
  const quintals = bill.weightQuintals || primaryTrip.weightQuintals || 0;
  const netKg = bill.netWeightKg || primaryTrip.netWeightKg || 0;

  const text = 
`🚛 *MAA NARMADA TRANSPORT* 🚛
*YOUR GOODS, OUR RESPONSIBILITY*
----------------------------------------
📄 *BILTY NO:* ${bill.biltyNo || bill.id}
📅 *DATE:* ${bill.date || 'N/A'}
👤 *PARTY NAME:* ${bill.clientName || 'Cash Client'}
----------------------------------------
📍 *ROUTE:* ${routeFrom} ➔ ${routeTo}
🚚 *TRUCK NO:* ${vehicle}
🌾 *MATERIAL:* ${material}
⚖️ *CARGO WT:* ${quintals} Qtl (${netKg.toLocaleString('en-IN')} kg)
💰 *PERKUNTA RATE:* ₹${bill.perkuntaRate || primaryTrip.perkuntaRate || 0} / Qtl
----------------------------------------
💵 *GROSS TOTAL:* ${formatINR(bill.grossTotal)}
💳 *ADVANCE PAID:* ${formatINR(bill.advancePaid)}
🔴 *NET BALANCE DUE:* ${formatINR(bill.netPayable)}
📌 *STATUS:* ${bill.paymentStatus || 'Pending'}
----------------------------------------
📎 *OFFICIAL PDF BILTY INVOICE ATTACHMENT*
📞 *Head Office Narmadapuram:* +91 98260 99887, +91 94250 11223`;

  return text;
}

export function shareToWhatsApp(bill, targetPhone = '') {
  const message = formatWhatsAppMessage(bill);
  const encodedText = encodeURIComponent(message);

  let cleanPhone = (targetPhone || bill.clientPhone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(whatsappUrl, '_blank');
}

export async function sharePdfToWhatsApp(bill, elementId = 'bilty-invoice-print') {
  const biltyName = `Maa_Narmada_Bilty_${bill.biltyNo ? bill.biltyNo.replace(/\//g, '_') : bill.id}.pdf`;
  const messageText = formatWhatsAppMessage(bill);

  try {
    const result = await getPdfBlob(bill, elementId);
    if (result && result.pdfBlob) {
      const pdfFile = new File([result.pdfBlob], biltyName, { type: 'application/pdf' });

      // Native Web Share API with PDF file attachment for mobile devices (Android/iOS)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `Bilty ${bill.biltyNo || bill.id} - Maa Narmada Transport`,
          text: messageText,
          files: [pdfFile]
        });
        return;
      }
    }
  } catch (err) {
    console.log('Native PDF Share Fallback:', err);
  }

  // Desktop / Standard Browser Fallback:
  // 1. Download PDF File to device
  await downloadPdf(bill, elementId);

  // 2. Open WhatsApp Web with prefilled message
  shareToWhatsApp(bill);

  // 3. Inform user with clear visual guidance
  setTimeout(() => {
    alert(
      `📥 PDF Bilty Document "${biltyName}" is saved in your Downloads folder!\n\n` +
      `👉 In WhatsApp, click the Attachment (📎/+) icon -> Document -> Select this PDF file!`
    );
  }, 400);
}
