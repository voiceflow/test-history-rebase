const WORKSPACE_FALLBACK_ERROR_MESSAGE = 'Error updating Workspace';

export const extractErrorMessages = (err) => {
  const errors = err?.body?.errors || err?.body || {};

  const errorMessage = Object.keys(errors).reduce((str, key) => {
    const error = errors[key];

    return `${str}${error.message || error}\n`;
  }, '');

  return errorMessage || WORKSPACE_FALLBACK_ERROR_MESSAGE;
};

export const extractErrorFromResponseData = (err, defaultMessage) =>
  err?.response?.data || err?.body?.data || (err && JSON.stringify(err)) || defaultMessage;
