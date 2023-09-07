import { setupEnv } from '@voiceflow/backend-utils';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
setupEnv();

const CONFIG = {
  // Feature flags
  FEATURE_OVERRIDES: Object.fromEntries(
    Object.entries(process.env).flatMap(([key, value]) => (key.startsWith('FF_') ? [[key.substring(3).toLowerCase(), value === 'true']] : []))
  ),
};

export default CONFIG;
