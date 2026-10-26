/** Reviewed business-number configuration shared by every entry and QR. */
export const whatsappNumber = '15556618993';
export const whatsappLink = (message = 'Hi Mina') => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
