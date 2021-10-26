import { LOGROCKET_ENABLED, Vendors } from '@voiceflow/ui';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';
import { createStructuredSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as Session from '@/ducks/session';
import * as SlotV2 from '@/ducks/slotV2';
import { CRUDAction } from '@/ducks/utils/crud';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import * as Workspace from '@/ducks/workspace';

import { Middleware, Store } from '../types';
import creatorMiddleware from './creator';
import realtimeMiddleware from './realtime';
import realtimeV2Middleware from './realtimeV2';
import { createAutosaveMiddleware, mapMiddleware } from './utils';

// only run middleware if logged in
const createLoggedInMiddleware =
  (childMiddleware: Middleware): Middleware =>
  (store) =>
  (next) =>
  (action) => {
    const isLoggedIn = Account.isLoggedInSelector(store.getState());
    if (isLoggedIn) {
      return childMiddleware(store)(next)(action);
    }
    return next(action);
  };

const createMiddleware = (history: History, rpcMiddleware: Middleware, getStore: () => Store) => {
  const middleware = [
    routerMiddleware(history),
    ...mapMiddleware(
      [
        rpcMiddleware,
        ...creatorMiddleware,

        ...[
          createAutosaveMiddleware(
            createStructuredSelector({ intent: IntentV2.allIntentsSelector, slot: SlotV2.allSlotsSelector }),
            Version.saveIntentsAndSlots,
            { ignore: [CRUDAction.CRUD_REPLACE] }
          ),
          createAutosaveMiddleware(VersionV2.active.globalVariablesSelector, Version.saveGlobalVariables, {
            ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_VERSION_ID],
          }),
          createAutosaveMiddleware(DiagramV2.active.localVariablesSelector, Diagram.saveActiveDiagramVariables, {
            ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_DIAGRAM_ID],
          }),
          createAutosaveMiddleware(ProjectListV2.allProjectListsSelector, Workspace.saveActiveWorkspaceProjectLists, {
            ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_WORKSPACE_ID],
          }),
        ].map(createLoggedInMiddleware),

        ...realtimeMiddleware,
        ...realtimeV2Middleware,
      ],
      getStore
    ),
  ];

  if (LOGROCKET_ENABLED) {
    middleware.push(
      LogRocket.reduxMiddleware({
        stateSanitizer: (state) => ({
          ...state,
          session: {
            ...state.session,
            token: { value: Vendors.LogRocket.REDACTED },
          },
        }),
        actionSanitizer: (action) =>
          action.type === Session.SessionAction.SET_AUTH_TOKEN
            ? {
                ...action,
                payload: Vendors.LogRocket.REDACTED,
              }
            : action,
      })
    );
  }

  return middleware as Middleware[];
};

export default createMiddleware;
