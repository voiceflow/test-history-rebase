import CONFIG from './config';

export const IS_PRODUCTION = CONFIG.NODE_ENV === 'production';
export const AI_GENERATION_QUOTA = 'OpenAI Tokens';
