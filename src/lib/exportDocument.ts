import { File, Paths } from 'expo-file-system';
import * as Legacy from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';

export type Format = 'pdf' | 'word' | 'text';

export const formats: { key: Format; label: string; hint: string }[] = [
  { key: 'pdf', label: 'PDF', hint: 'Best for printing and sending' },
  { key: 'word', label: 'Word', hint: 'Opens in Word and Google Docs, and you can edit it' },
  { key: 'text', label: 'Text', hint: 'Plain text that pastes into any chat' },
];

const info: Record<Format, { mime: string; uti: string; ext: string }> = {
  pdf: { mime: 'application/pdf', uti: 'com.adobe.pdf', ext: 'pdf' },
  word: { mime: 'application/msword', uti: 'com.microsoft.word.doc', ext: 'doc' },
  text: { mime: 'text/plain', uti: 'public.plain-text', ext: 'txt' },
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildHtml(title: string, text: string) {
  const body = text
    .split('\n\n')
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
  return (
    `<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>` +
    `<style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.5;margin:40px;color:#000}` +
    `p{margin:0 0 12px}</style></head><body>${body}</body></html>`
  );
}

const safeName = (title: string) =>
  title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'Document';

// turns the PDF data (base64 text) into bytes that can be saved as a file
function base64ToBytes(b64: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = b64.replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let p = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const a = chars.indexOf(clean[i]);
    const b = chars.indexOf(clean[i + 1]);
    const c = i + 2 < clean.length ? chars.indexOf(clean[i + 2]) : -1;
    const d = i + 3 < clean.length ? chars.indexOf(clean[i + 3]) : -1;
    out[p++] = (a << 2) | (b >> 4);
    if (c !== -1) out[p++] = ((b & 15) << 4) | (c >> 2);
    if (d !== -1) out[p++] = ((c & 3) << 6) | d;
  }
  return out.slice(0, p);
}

async function shareUri(uri: string, format: Format) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this phone');
  }
  await Sharing.shareAsync(uri, { mimeType: info[format].mime, UTI: info[format].uti });
}

// Opens the share sheet: WhatsApp, email, Telegram and more.
// Returns a note to show the student when a fallback was used.
export async function shareDocument(format: Format, title: string, text: string): Promise<string | undefined> {
  if (format === 'text') {
    await Share.share({ message: text });
    return;
  }

  if (format === 'pdf') {
    try {
      const printed = await Print.printToFileAsync({ html: buildHtml(title, text), base64: true });
      const file = new File(Paths.cache, `${safeName(title)}.pdf`);
      if (file.exists) file.delete();
      file.create();
      file.write(base64ToBytes(printed.base64 ?? ''));
      await shareUri(file.uri, 'pdf');
      return;
    } catch {
      // sharing is blocked here, so open the phone's print screen instead
      await Print.printAsync({ html: buildHtml(title, text) });
      return 'On the print screen, tap the PDF button at the top to save the file, then send it from your Files app.';
    }
  }

  // Word
  try {
    const file = new File(Paths.cache, `${safeName(title)}.doc`);
    if (file.exists) file.delete();
    file.create();
    file.write(buildHtml(title, text));
    await shareUri(file.uri, 'word');
  } catch {
    await Share.share({ message: text });
    return 'Word sharing needs the full app, so the text was shared instead.';
  }
}

// Saves the file on the phone. Returns a short message to show the student.
export async function downloadDocument(format: Format, title: string, text: string): Promise<string> {
  const base = safeName(title);

  if (Platform.OS === 'android') {
    const saf = Legacy.StorageAccessFramework;
    const folder = await saf.requestDirectoryPermissionsAsync();
    if (!folder.granted) return 'Download cancelled';

    const dest = await saf.createFileAsync(folder.directoryUri, base, info[format].mime);

    if (format === 'pdf') {
      // ask for the PDF as base64, so no file needs to be read back
      const printed = await Print.printToFileAsync({ html: buildHtml(title, text), base64: true });
      await Legacy.writeAsStringAsync(dest, printed.base64 ?? '', { encoding: Legacy.EncodingType.Base64 });
    } else if (format === 'word') {
      await Legacy.writeAsStringAsync(dest, buildHtml(title, text));
    } else {
      await Legacy.writeAsStringAsync(dest, text);
    }
    return 'Saved to the folder you chose';
  }

  // iPhone: use the share sheet, which has "Save to Files"
  await shareDocument(format, title, text);
  return 'Choose "Save to Files" to keep it';
}