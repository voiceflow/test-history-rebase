import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionCreator, isType } from 'typescript-fsa';

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

export const createOwnIgnoreMiddlewareCreator = <Payload extends { creatorID: number }>(ignoreActionCreator: ActionCreator<Payload>): Middleware =>
  createIgnoreMiddleware((api, action) => {
    if (!isType(action, ignoreActionCreator)) return false;

    const creatorID = Account.userIDSelector(api.getState());

    return action.payload.creatorID === creatorID;
  });

export const createCaptureAndIgnoreOwnMiddleware = <Payload extends { creatorID: number }>(
  ignoreActionCreator: ActionCreator<Payload>,
  handler: (payload: Payload) => void
): Middleware =>
  createIgnoreMiddleware((api, action) => {
    if (!isType(action, ignoreActionCreator)) return false;

    const creatorID = Account.userIDSelector(api.getState());

    if (action.payload.creatorID === creatorID) return true;

    handler(action.payload);

    return true;
  });

export const ownCursorIgnoreMiddleware = createOwnIgnoreMiddlewareCreator(Realtime.diagram.awareness.moveCursor);

export const moveCursorMiddleware = createCaptureAndIgnoreOwnMiddleware(Realtime.diagram.awareness.moveCursor, setCursorCoords);
export const hideCursorMiddleware = createCaptureAndIgnoreOwnMiddleware(Realtime.diagram.awareness.hideCursor, hideCursorCoords);

// export default [ownCursorIgnoreMiddleware, moveCursorMiddleware, hideCursorMiddleware];
export default [moveCursorMiddleware, hideCursorMiddleware];
