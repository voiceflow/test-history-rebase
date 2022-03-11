import * as Realtime from '@voiceflow/realtime-sdk';
import { isType } from 'typescript-fsa';

import * as Account from '@/ducks/account/selectors';
import { Middleware, MiddlewareAPI } from '@/store/types';

import { hideCursorCoords, setCursorCoords } from '../observables';

export const createIgnoreMiddleware =
  (shouldIgnore: (api: MiddlewareAPI, action: any) => boolean): Middleware =>
  (api) =>
  (next) =>
  (action) => {
    if (shouldIgnore(api, action)) {
      return;
    }

    next(action);
  };

/**
 * ignore actions from own cursor movements
 */
export const ownCursorIgnoreMiddleware: Middleware = createIgnoreMiddleware((api, action) => {
  if (!isType(action, Realtime.diagram.awareness.moveCursor)) return false;

  const creatorID = Account.userIDSelector(api.getState());

  return action.payload.creatorID === creatorID;
});

/**
 * capture volatile cursor movement events
 * ignores actions from own cursor movements
 */
export const moveCursorMiddleware = createIgnoreMiddleware((api, action) => {
  if (!isType(action, Realtime.diagram.awareness.moveCursor)) return false;

  const creatorID = Account.userIDSelector(api.getState());

  if (action.payload.creatorID === creatorID) return true;

  setCursorCoords(action.payload);

  return true;
});

/**
 * capture hide cursor events to pipe to observable
 * ignores actions from own cursor movements
 */
export const hideCursorMiddleware = createIgnoreMiddleware((api, action) => {
  if (!isType(action, Realtime.diagram.awareness.hideCursor)) return false;

  const creatorID = Account.userIDSelector(api.getState());

  if (action.payload.creatorID === creatorID) return true;

  hideCursorCoords(action.payload);

  return true;
});

// export default [ownCursorIgnoreMiddleware, moveCursorMiddleware, hideCursorMiddleware];
export default [moveCursorMiddleware, hideCursorMiddleware];
