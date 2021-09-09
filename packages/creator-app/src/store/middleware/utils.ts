import * as Redux from 'redux';
import shallowequal from 'shallowequal';
import { debounce } from 'throttle-debounce';

import { FeatureFlag } from '@/config/features';
import { DiagramState } from '@/constants';
import type { State } from '@/ducks';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Feature from '@/ducks/feature';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { unique } from '@/utils/array';

import { AnyAction, Dispatch, Dispatchable, Middleware, MiddlewareAPI, Selector, Store } from '../types';
import { wrapDispatch } from '../utils';

const AUTOSAVE_DEBOUNCE_TIMEOUT = 200;
const AUTOSAVE_IGNORED_ACTIONS: string[] = [Account.AccountAction.RESET_ACCOUNT, Creator.DiagramAction.SET_DIAGRAM_STATE];

type ActionIgnore = (string | ((action: AnyAction) => boolean))[];

const isIgnored = (action: AnyAction, ignore: ActionIgnore) =>
  ignore.some((item) => (typeof item === 'function' ? item(action) : item === action.type));

const getDiffKeys = (lhs: Record<string, any>, rhs: Record<string, any>) =>
  unique([...Object.keys(lhs), ...Object.keys(rhs)]).filter((key) => lhs[key] !== rhs[key]);

export const createAutosaveMiddleware = <T>(
  selector: Selector<T>,
  createSaveAction: (changedKeys: string[] | null) => Dispatchable,
  { ignore = [], partial = false }: { ignore?: ActionIgnore; partial?: boolean } = {}
): Middleware => {
  let prevState: T | null = null;
  const debouncedSave = debounce(AUTOSAVE_DEBOUNCE_TIMEOUT, (store: MiddlewareAPI, changedKeys: string[] | null) =>
    store.dispatch(Creator.performSave(createSaveAction(changedKeys)))
  );

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = selector(state);
    const creatorID = Account.userIDSelector(state);
    const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    const activeDiagramID = Session.activeDiagramIDSelector(state); // do not apply creator middleware if no active diagram

    const isLibraryRole =
      atomicActionsEnabled && creatorID
        ? WorkspaceV2.workspaceIsLibraryRoleByIDAndCreatorIDSelector(state, { id: activeDiagramID, creatorID })
        : Workspace.isLibraryRoleSelector(state);

    try {
      if (isLibraryRole) return;

      // do not autosave on realtime updates
      if (action.meta?.receivedAction) return;

      if (isIgnored(action, [...AUTOSAVE_IGNORED_ACTIONS, ...ignore])) return;

      if (prevState !== null && !shallowequal(prevState, currentState)) {
        store.dispatch(Creator.setDiagramState(DiagramState.CHANGED));

        debouncedSave(store, partial ? getDiffKeys(prevState, currentState) : null);
      }
    } finally {
      prevState = currentState;
    }
  };
};

export const createRealtimeResourceUpdateMiddleware = <T>(
  resourceID: Realtime.ResourceType,
  selector: Selector<T>,
  { ignore = [] }: { ignore?: ActionIgnore } = {}
): Middleware => {
  let prevState: T | null = null;

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = selector(state);
    const isRealtimeConnected = Realtime.isRealtimeConnectedSelector(state);

    try {
      if (!isRealtimeConnected) return;

      // do not autosave on realtime updates
      if (action.meta?.receivedAction) return;

      if (isIgnored(action, ignore)) return;

      if (prevState !== null && !shallowequal(prevState, currentState)) {
        const realtimeAction = Realtime.updateResource(resourceID, currentState);
        store.dispatch(Realtime.sendRealtimeProjectUpdate(realtimeAction));
      }
    } finally {
      prevState = currentState;
    }
  };
};

export const createIgnoreMiddleware =
  (shouldIgnore: (api: MiddlewareAPI, action: AnyAction) => boolean): Middleware =>
  (api) =>
  (next) =>
  (action) => {
    if (shouldIgnore(api, action)) {
      return;
    }

    next(action);
  };

export const mapMiddleware = (middleware: Middleware[], getStore: () => Store) =>
  middleware.map(
    (callback): Redux.Middleware<{}, State, Dispatch> =>
      (api) =>
        callback({
          getState: api.getState,
          dispatch: wrapDispatch(getStore),
        })
  );
