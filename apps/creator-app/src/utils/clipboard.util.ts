import { notify } from '@voiceflow/ui-next';

export const clipboardCopy = (text?: string | null): void => {
  try {
    navigator.clipboard.writeText(text ?? '');
  } catch {
    const clipboardEl = document.createElement('textarea');
    clipboardEl.value = text ?? '';

    document.body.appendChild(clipboardEl);
    clipboardEl.select();
    document.execCommand('copy');

    clipboardEl.remove();
  }
};

export const clipboardCopyWithToast =
  (text: string, toastMessage = 'Copied') =>
  (): void => {
    clipboardCopy(text);
    notify.short.success(toastMessage);
  };
