import { LOGROCKET_ENABLED } from '@ui/config';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { DeepPartial } from 'utility-types';

export const REDACTED = '[redacted]';

const transformBody = <T extends { body?: string | undefined }, J extends object>(entity: T, transform: (json: J) => DeepPartial<J> | undefined) => {
  try {
    const body = entity.body ? transform(JSON.parse(entity.body)) : null;

    // eslint-disable-next-line no-param-reassign
    entity.body = body ? JSON.stringify(body) : undefined;
  } catch {
    // eslint-disable-next-line no-param-reassign
    entity.body = undefined;
  }

  return entity;
};

export interface InitializeOptions {
  project: string;
  callback: (sessionURL: string) => void;
  sessionRequestSanitizers: { matcher: { method: string; route: string | string[] }; transform: (json: any) => object | undefined }[];
}

export const initialize = ({ project, callback, sessionRequestSanitizers }: InitializeOptions) => {
  if (!LOGROCKET_ENABLED) return;

  const sessionRequestIDs = new Set<string>();

  LogRocket.init(project, {
    network: {
      requestSanitizer: (req) => {
        const method = req.method?.toUpperCase() ?? '';
        const url = req.url.toLowerCase();

        // eslint-disable-next-line no-restricted-syntax
        for (const { matcher, transform } of sessionRequestSanitizers) {
          if (
            method === matcher.method &&
            (Array.isArray(matcher.route) ? matcher.route.some((route) => url.endsWith(route)) : url.endsWith(matcher.route as string))
          ) {
            sessionRequestIDs.add(req.reqId);
            transformBody(req, transform);

            return req;
          }
        }

        return req;
      },
      responseSanitizer: (res) => {
        if (sessionRequestIDs.has(res.reqId)) {
          sessionRequestIDs.delete(res.reqId);

          transformBody(res, (body: { token: string }) => ({ ...body, token: REDACTED }));
        }

        return res;
      },
    },
  });

  setupLogRocketReact(LogRocket);

  LogRocket.getSessionURL(callback);
};

export const identify = (id: string, user: { email: string; name: string }) => {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.identify(id, {
    email: user.email,
    name: user.name,
  });
};

export const getSessionURL = (callback: (sessionURL: string) => void) => LogRocket.getSessionURL(callback);

export const error = (...props: any[]): void => {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.error(...props);
};

export const captureException = (
  error: Error,
  options: {
    extra: { [tagName: string]: string | number | boolean };
  }
): void => {
  if (!LOGROCKET_ENABLED) return;

  LogRocket.captureException(error, options);
};
