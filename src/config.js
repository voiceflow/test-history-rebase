export const NODE_ENV = process.env.NODE_ENV;
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const BUILD_ENV = process.env.BUILD_ENV;

export const API_HOST = process.env.API_HOST;

export const LOGROCKET_ENABLED = IS_PRODUCTION || process.env.LOGROCKET_ENABLED === 'true';
export const LOGROCKET_PROJECT = process.env.LOGROCKET_PROJECT;
