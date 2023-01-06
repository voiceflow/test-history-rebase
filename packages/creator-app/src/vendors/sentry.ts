import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { logger } from '@voiceflow/ui';

import { APP_ENV, CLOUD_ENV, IS_PRODUCTION, isDebug, SENTRY_DSN, SENTRY_ENABLED } from '@/config';

export const init = () => {
  if (!SENTRY_ENABLED) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: IS_PRODUCTION ? CLOUD_ENV : APP_ENV,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
};

export const breadcrumb = (category: string, message: string, data?: Record<string, any>) => {
  if (!SENTRY_ENABLED) return;

  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
};

export const error = (error: any | Error) => {
  if (isDebug()) {
    logger.error(error);
  }

  if (!SENTRY_ENABLED) return;

  Sentry.captureException(error);
};
