export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const LOGROCKET_ENABLED = IS_PRODUCTION || process.env.REACT_APP_LOGROCKET_ENABLED === 'true';
export const LOGROCKET_PROJECT = process.env.REACT_APP_LOGROCKET_PROJECT;
