import { whatsappNumber } from '../data/whatsapp';
export function GET() {
  return new Response(`export const whatsappNumber = ${JSON.stringify(whatsappNumber)};
export const whatsappLink = (message = 'Hi Mina') => 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);`, { headers: { 'Content-Type': 'application/javascript; charset=utf-8' } });
}
