// Turns the email addresses and the ICO's site in legal copy into links,
// escaping everything else, so the copy in src/data stays plain text.
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function linkify(text: string): string {
  return escape(text)
    .replace(/\b([a-z]+@getmine\.ai)\b/g, '<a href="mailto:$1">$1</a>')
    .replace(/\bico\.org\.uk\b/g, '<a href="https://ico.org.uk">ico.org.uk</a>');
}
