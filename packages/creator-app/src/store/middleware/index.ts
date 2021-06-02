import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';
import * as Redux from 'redux';
import { createStructuredSelector } from 'reselect';

import { LOGROCKET_ENABLED } from '@/config';
import * as Account from '@/ducks/account';
import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as ProjectList from '@/ducks/projectList';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { CRUDAction } from '@/ducks/utils/crud';
import * as Version from '@/ducks/version';
import * as Workspace from '@/ducks/workspace';

import { StoreMiddleware } from '../types';
import creatorMiddleware from './creator';
import realtimeMiddleware from './realtime';
import thunkMiddleware from './thunk';
import { createAutosaveMiddleware } from './utils';

// only run middleware if logged in
const createLoggedInMiddleware =
  (childMiddleware: StoreMiddleware): StoreMiddleware =>
  (store) =>
  (next) =>
  (action) => {
    const isLoggedIn = Account.isLoggedInSelector(store.getState());
    if (isLoggedIn) {
      return childMiddleware(store)(next)(action);
    }
    return next(action);
  };

const createMiddleware = (history: History) => {
  const middleware = [
    routerMiddleware(history),
    ...thunkMiddleware,
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
  ];

  if (LOGROCKET_ENABLED) {
    middleware.push(LogRocket.reduxMiddleware());
  }

  return middleware as Redux.Middleware[];
};

export default createMiddleware;
