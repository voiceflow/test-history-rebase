import { LOGROCKET_ENABLED, Vendors } from '@voiceflow/ui';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';
import { createStructuredSelector } from 'reselect';

import * as Account from '@/ducks/account';
import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as ProjectList from '@/ducks/projectList';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { CRUDAction } from '@/ducks/utils/crud';
import * as Version from '@/ducks/version';
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

const createMiddleware = (history: History, getStore: () => Store) => {
  const middleware = [
    routerMiddleware(history),
    ...mapMiddleware(
      [
        ...creatorMiddleware,

        ...[
          createAutosaveMiddleware(
            createStructuredSelector({ intent: Intent.allIntentsSelector, slot: Slot.allSlotsSelector }),
            Version.saveIntentsAndSlots,
            { ignore: [CRUDAction.CRUD_REPLACE] }
          ),
          createAutosaveMiddleware(Version.activeGlobalVariablesSelector, Version.saveGlobalVariables, {
            ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_VERSION_ID],
          }),
          createAutosaveMiddleware(Diagram.activeDiagramLocalVariablesSelector, Diagram.saveActiveDiagramVariables, {
            ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_DIAGRAM_ID],
          }),
          createAutosaveMiddleware(ProjectList.allProjectListsSelector, Workspace.saveActiveWorkspaceProjectLists, {
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
