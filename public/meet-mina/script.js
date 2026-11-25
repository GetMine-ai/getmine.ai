const entryUrl = document.getElementById('text-mina').href;
// Text Mina: on a phone, the link opens WhatsApp with "Hi Mina" ready to send.
// On a computer, show the QR code and the option to open WhatsApp here.
// Opening a link sends nothing: the person sends "Hi Mina" themselves.
const dialog = document.getElementById('entry-dialog');
const phoneLike = document.documentElement.dataset.deviceClass === 'mobile';
document.getElementById('text-mina').addEventListener('click', event => {
  if (phoneLike || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});

// Mina listens: her halo brightens while Text Mina is hovered or focused.
const mark = document.querySelector('main .mina-mark');
const cta = document.getElementById('text-mina');
['mouseenter', 'focus'].forEach(e => cta.addEventListener(e, () => mark.classList.add('is-listening')));
['mouseleave', 'blur'].forEach(e => cta.addEventListener(e, () => mark.classList.remove('is-listening')));

const qr=qrcode(0,'M');qr.addData(entryUrl);qr.make();document.querySelector('.qr-frame').innerHTML=qr.createSvgTag({cellSize:4,margin:4,scalable:true});

dialog.addEventListener('close', () => cta.focus());
