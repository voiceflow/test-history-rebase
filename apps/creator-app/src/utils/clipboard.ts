import { Nullable } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';

import { VERSION } from '@/config';

export const CLIPBOARD_TYPE = 'voiceflow.com:project.clipboard';

export const copy = (text?: string | null): void => {
  const clipboardEl = document.createElement('textarea');
  clipboardEl.value = text ?? '';

  if (window.Cypress) {
    window.cypress_clipboard = text;
  }

  document.body.appendChild(clipboardEl);
  clipboardEl.select();
  document.execCommand('copy');

  clipboardEl.remove();
};

export const serialize = (data: unknown): string => JSON.stringify({ $type: CLIPBOARD_TYPE, $version: VERSION, data });

export const deserialize = <T>(text: string): Nullable<T> => {
  try {
    const buffer = JSON.parse(text);

    if (buffer.$type === CLIPBOARD_TYPE && 'data' in buffer) {
      return buffer.data;
    }
  } catch (e) {
    // do nothing if invalid clipboard buffer
  }

  return null;
};

export const copyWithToast =
  (text: string, toastMessage = 'Copied to clipboard') =>
  (): void => {
    copy(text);
    toast.success(toastMessage);
  };
