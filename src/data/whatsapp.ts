/** QA review number shared by every entry and QR. Confirm the live destination before release. */
export const whatsappNumber = '447746959359';
export const whatsappLink = (message = 'Hi Mina') => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
