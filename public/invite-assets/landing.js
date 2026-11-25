// Text Mina: on a phone, the link opens WhatsApp with the message ready to send.
// On a computer, show the QR code and the option to open WhatsApp here.
// Opening a link sends nothing: the person sends the message themselves.
const dialog = document.getElementById('entry-dialog');
const cta = document.getElementById('text-mina');
const phoneLike = matchMedia('(max-width: 700px), (pointer: coarse) and (hover: none)');
let opener = null;

cta.addEventListener('click', event => {
  if (phoneLike.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = document.activeElement;
  dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
// Escape closes natively; always hand focus back to the button that opened it.
dialog.addEventListener('close', () => { (opener || cta).focus(); opener = null; });

// Mina listens: her halo brightens while Text Mina is hovered or focused.
const mark = document.querySelector('main .mina-mark');
['mouseenter', 'focus'].forEach(e => cta.addEventListener(e, () => mark.classList.add('is-listening')));
['mouseleave', 'blur'].forEach(e => cta.addEventListener(e, () => mark.classList.remove('is-listening')));

// One source of truth: the QR encodes exactly the CTA's link (number + message).
const qr = qrcode(0, 'M');
qr.addData(cta.href);
qr.make();
document.querySelector('.qr-frame').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
