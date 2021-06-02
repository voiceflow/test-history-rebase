import * as Redux from 'redux';
import thunk from 'redux-thunk';

import * as Sentry from '@/vendors/sentry';

type ThunkError = Error & { thunkErrorLogged?: boolean };

const handleThunkError = (err: ThunkError) => {
  if (!err.thunkErrorLogged) {
    err.thunkErrorLogged = true;
    Sentry.error(err);
  }

  throw err;
};

export const thunkErrorLoggerMiddleware: Redux.Middleware = () => (next) => (action) => {
  const advance = () => next(action);

  if (typeof action === 'function') {
    try {
      const result = advance();

      if (result instanceof Promise) {
        return result.catch(handleThunkError);
      }

      return result;
    } catch (err) {
      handleThunkError(err);
    }
  } else {
    return advance();
  }
};

// const thunkMiddleware = [thunkErrorLoggerMiddleware, thunk];
const thunkMiddleware = [thunk];

export default thunkMiddleware;
