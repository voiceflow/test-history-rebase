const WORKSPACE_FALLBACK_ERROR_MESSAGE = 'Error updating Workspace';

export const extractErrorMessages = (err?: {
  body?: { errors?: Record<string, { message: string } | string> } & Record<string, { message: string } | string>;
}) => {
  const errors = err?.body?.errors || err?.body || {};

  const errorMessage = Object.keys(errors).reduce<string>((str, key) => {
    const error = errors[key];

    return `${str}${(typeof error === 'object' && error.message) || error}\n`;
  }, '');

  return errorMessage || WORKSPACE_FALLBACK_ERROR_MESSAGE;
};

export const extractErrorFromResponseData = (err: Partial<Record<'response' | 'body', { data?: string }>> | undefined, defaultMessage: string) =>
  err?.response?.data || err?.body?.data || (err && JSON.stringify(err)) || defaultMessage;
