/** Approved RC4 destination: the existing QA WhatsApp chat. Mike owns release routing. */
export const whatsappNumber = '447746959359';
export const whatsappLink = (message = 'Hi Mina') => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
