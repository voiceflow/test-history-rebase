import { LOCATION_CHANGE, routerMiddleware } from 'connected-react-router';
import LogRocket from 'logrocket';
import thunk from 'redux-thunk';
import { createStructuredSelector } from 'reselect';
import shallowequal from 'shallowequal';
import { debounce } from 'throttle-debounce';

import { LOGROCKET_ENABLED } from '@/config';
import { NEW_PRODUCT_ID } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Display from '@/ducks/display';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as User from '@/ducks/user';
import { CRUD_ADD, CRUD_REMOVE, CRUD_UPDATE } from '@/ducks/utils/crud';
import * as VariableSet from '@/ducks/variableSet';
import { RootRoutes } from '@/utils/routes';

import { activeDiagramViewersSelector } from './selectors';
import { savePlatformAndActiveDiagram } from './sideEffects';

const AUTOSAVE_DEBOUNCE_TIMEOUT = 200;
const CREATOR_HISTORY_ACTIONS = [Creator.UNDO_HISTORY, Creator.REDO_HISTORY];

const createAutosaveMiddleware = (selector, createSaveAction, blacklist = []) => {
  let prevState = null;
  const debouncedSave = debounce(AUTOSAVE_DEBOUNCE_TIMEOUT, (store) => store.dispatch(createSaveAction()));

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = selector(state);
    const activeSkill = Skill.activeSkillSelector(state);

    if (activeSkill && !blacklist.includes(action.type) && !shallowequal(prevState, currentState) && prevState !== null) {
      debouncedSave(store);
    }

    prevState = currentState;
  };
};

const createRealtimeResourceUpdateMiddleware = (resourceId, selectors, blacklist = []) => {
  let prevState = null;

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = selectors(state);
    const isRealtimeConnected = Realtime.isRealtimeConnectedSelector(state);

    if (
      isRealtimeConnected &&
      !action.meta?.receivedAction &&
      // eslint-disable-next-line lodash/prefer-lodash-typecheck
      !blacklist.some((item) => (typeof item === 'function' ? item(action) : item === action.type)) &&
      prevState !== null &&
      !shallowequal(prevState, currentState)
    ) {
      const realtimeAction = Realtime.updateResource(resourceId, currentState);
      store.dispatch(Realtime.sendRealtimeProjectUpdate(realtimeAction));
    }

    prevState = currentState;
  };
};

const creatorHistoryMiddleware = (store) => (next) => (action) => {
  const viewers = activeDiagramViewersSelector(store.getState());
  const hasViewers = viewers.length > 1;

  if (action.type === Creator.SAVE_HISTORY) {
    // eslint-disable-next-line no-console
    store.dispatch(Diagram.saveActiveDiagram()).catch(() => console.warn('failed to save diagram'));

    if (hasViewers && !action?.meta?.force) {
      return;
    }
  }

  if (hasViewers && CREATOR_HISTORY_ACTIONS.includes(action.type)) {
    store.dispatch(User.setCanvasError('Undo and Redo actions unavailable while other active users are viewing this flow'));

    return;
  }

  next(action);
};

// reset the creator state when navigating to the canvas from elsewhere in the app
const creatorResetMiddleware = (store) => (next) => (action) => {
  if (action.type === LOCATION_CHANGE) {
    const state = store.getState();
    const isRealtimeConnected = Realtime.isRealtimeConnectedSelector(state);
    const creatorDiagramID = Creator.creatorDiagramIDSelector(state);

    if (
      !isRealtimeConnected &&
      creatorDiagramID &&
      new RegExp(`\\/${RootRoutes.PROJECT}\\/[^\\/]+\\/canvas\\/[^\\/]+`).test(action.payload.location.pathname)
    ) {
      store.dispatch(Creator.resetCreator());
    }
  }

  next(action);
};

const createMiddleware = (history) => {
  const middleware = [
    routerMiddleware(history),
    thunk,
    creatorHistoryMiddleware,
    creatorResetMiddleware,
    createAutosaveMiddleware(createStructuredSelector({ intent: Intent.allIntentsSelector, slot: Slot.allSlotsSelector }), Skill.saveIntents),
    createAutosaveMiddleware(createStructuredSelector({ platform: Skill.activePlatformSelector }), savePlatformAndActiveDiagram, [
      Skill.SET_ACTIVE_SKILL,
    ]),
    createAutosaveMiddleware(createStructuredSelector({ variables: Skill.globalVariablesSelector }), Skill.saveVariables, [Skill.SET_ACTIVE_SKILL]),
    createAutosaveMiddleware(
      createStructuredSelector({ diagramVariables: VariableSet.activeDiagramVariables }),
      VariableSet.saveActiveDiagramVariables,
      [VariableSet.REPLACE_VARIABLE_SET_DIAGRAM, Creator.INITIALIZE_CREATOR]
    ),
    createRealtimeResourceUpdateMiddleware(
      Realtime.ResourceType.SETTINGS,
      createStructuredSelector({
        meta: Skill.skillMetaSelector,
        skillName: Skill.activeNameSelector,
      }),
      [Skill.SET_ACTIVE_SKILL]
    ),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.PUBLISH, Skill.publishInfoSelector, [Skill.SET_ACTIVE_SKILL]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.FLOWS, Diagram.allDiagramsSelector, [Skill.SET_ACTIVE_SKILL]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.DISPLAYS, Display.allDisplaysSelector, [Skill.SET_ACTIVE_SKILL]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.PRODUCTS, Product.allProductsSelector, [
      CRUD_UPDATE,
      (action) => action.type === CRUD_ADD && action.payload?.key === NEW_PRODUCT_ID,
      (action) => action.type === CRUD_REMOVE && action.payload === NEW_PRODUCT_ID,
    ]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.INTENTS, Intent.allIntentsSelector),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.SLOTS, Slot.allSlotsSelector),
    createRealtimeResourceUpdateMiddleware(
      Realtime.ResourceType.VARIABLES,
      createStructuredSelector({
        variableSet: VariableSet.variableSetSelector,
        globalSet: Skill.globalVariablesSelector,
      }),
      [Skill.SET_ACTIVE_SKILL, VariableSet.REPLACE_VARIABLE_SET_DIAGRAM, Creator.INITIALIZE_CREATOR, Creator.RESET_CREATOR]
    ),
  ];

  if (LOGROCKET_ENABLED) {
    middleware.push(LogRocket.reduxMiddleware());
  }

  return middleware;
};

export default createMiddleware;
