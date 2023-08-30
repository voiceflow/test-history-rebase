import CONFIG from './old_config';

export const IS_PRODUCTION = CONFIG.NODE_ENV === 'production';

export const HEARTBEAT_EXPIRE_TIMEOUT = 30;
