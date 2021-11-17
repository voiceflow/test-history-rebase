import CONFIG from './config';

// eslint-disable-next-line import/prefer-default-export
export const IS_PRODUCTION = CONFIG.NODE_ENV === 'production';
