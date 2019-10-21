import { VERSION } from '@/config';

export const CLIPBOARD_TYPE = 'voiceflow.com:project.clipboard';

export function copy(text) {
  const clipboardEl = document.createElement('textarea');
  clipboardEl.value = text;

  document.body.appendChild(clipboardEl);
  clipboardEl.select();
  document.execCommand('copy');

  clipboardEl.remove();
}

export function serialize(data) {
  return JSON.stringify({
    $type: CLIPBOARD_TYPE,
    $version: VERSION,
    data,
  });
}

export function deserialize(text) {
  try {
    const buffer = JSON.parse(text);

    if (buffer.$type === CLIPBOARD_TYPE && 'data' in buffer) {
      return buffer.data;
    }
  } catch (e) {
    // do nothing if invalid clipboard buffer
  }

  return null;
}
