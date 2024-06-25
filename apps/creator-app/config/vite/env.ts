import { defineEnv } from '@voiceflow/vite-config';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const loadEnv = defineEnv((extracted) => {
  const {
    DEBUG,
    API_HOST,
    CLOUD_ENV,
    LOG_LEVEL,
    LOG_FILTER,
    GA_ENABLED,
    DEBUG_FETCH,
    DEBUG_CANVAS,
    DEBUG_NETWORK,
    DEBUG_REALTIME,
    CANVAS_CROSSHAIR,
  } = process.env;

  return {
    defaults: {
      CANVAS_CROSSHAIR: CANVAS_CROSSHAIR || '',

      // logging
      // eslint-disable-next-line no-nested-ternary
      LOG_LEVEL: DEBUG ? (LOG_LEVEL === 'trace' ? LOG_LEVEL : 'debug') : LOG_LEVEL || '',
      LOG_FILTER: LOG_FILTER || '',

      // analytics
      GA_ENABLED: (GA_ENABLED && 'true') || '',
      GOOGLE_TAG_MANAGER_ID: '',

      CLOUD_ENV: CLOUD_ENV || '',

      API_HOST: API_HOST || 'localhost',
      ROOT_DOMAIN: '',
      MAINTENANCE_STATUS_SOURCE: '',
    },

    overrides: {
      VF_OVERRIDE_API_HOST: extracted.VF_OVERRIDE_API_HOST || '',
      VF_OVERRIDE_AUTH_API_ENDPOINT: extracted.VF_OVERRIDE_AUTH_API_ENDPOINT || '',
      VF_OVERRIDE_IDENTITY_API_ENDPOINT: extracted.VF_OVERRIDE_IDENTITY_API_ENDPOINT || '',
      VF_OVERRIDE_REALTIME_API_ENDPOINT: extracted.VF_OVERRIDE_REALTIME_API_ENDPOINT || '',
      VF_OVERRIDE_ANALYTICS_API_ENDPOINT: extracted.VF_OVERRIDE_ANALYTICS_API_ENDPOINT || '',
      VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT: extracted.VF_OVERRIDE_CANVAS_EXPORT_ENDPOINT || '',
      VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT: extracted.VF_OVERRIDE_ALEXA_SERVICE_ENDPOINT || '',
      VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT: extracted.VF_OVERRIDE_GENERAL_SERVICE_ENDPOINT || '',
      VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT: extracted.VF_OVERRIDE_GENERAL_RUNTIME_ENDPOINT || '',

      ...(DEBUG
        ? {
            DEBUG_FETCH: 'true',
            DEBUG_CANVAS: 'true',
            DEBUG_NETWORK: 'true',
            DEBUG_REALTIME: 'true',
          }
        : {
            DEBUG_FETCH: DEBUG_FETCH ? 'true' : '',
            DEBUG_CANVAS: DEBUG_CANVAS ? 'true' : '',
            DEBUG_NETWORK: DEBUG_NETWORK ? 'true' : '',
            DEBUG_REALTIME: DEBUG_REALTIME ? 'true' : '',
          }),
    },
  };
});
