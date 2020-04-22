import { LOCATION_CHANGE, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import { createStructuredSelector } from 'reselect';
import shallowequal from 'shallowequal';
import { debounce } from 'throttle-debounce';

import { LOGROCKET_ENABLED } from '@/config';
import { BlockType, NEW_PRODUCT_ID } from '@/constants';
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
import { VERSIONS as DISPLAY_VERSIONS } from '@/pages/Canvas/managers/Display/constants';
import { isLinkedeDisplayNode } from '@/utils/node';
import { RootRoutes } from '@/utils/routes';

import { activeDiagramViewersSelector } from './selectors';
import { savePlatformAndActiveDiagram } from './sideEffects';
import { AnyAction, Dispatchable, Selector, StoreMiddleware } from './types';

const AUTOSAVE_DEBOUNCE_TIMEOUT = 200;
const CREATOR_HISTORY_ACTIONS: string[] = [Creator.DiagramAction.UNDO_HISTORY, Creator.DiagramAction.REDO_HISTORY];

type ActionBlacklist = (string | ((action: AnyAction) => boolean))[];

const createAutosaveMiddleware = <T>(
  selector: Selector<T>,
  createSaveAction: () => Dispatchable,
  blacklist: ActionBlacklist = []
): StoreMiddleware => {
  let prevState: T | null = null;
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

const createRealtimeResourceUpdateMiddleware = <T>(
  resourceId: Realtime.ResourceType,
  selector: Selector<T>,
  blacklist: ActionBlacklist = []
): StoreMiddleware => {
  let prevState: T | null = null;

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = selector(state);
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

const creatorHistoryMiddleware: StoreMiddleware = (store) => (next) => (action) => {
  const viewers = activeDiagramViewersSelector(store.getState());
  const hasViewers = viewers.length > 1;
  const isHistoryAction = CREATOR_HISTORY_ACTIONS.includes(action.type);
  // eslint-disable-next-line no-console
  const saveDiagram = () => store.dispatch(Diagram.saveActiveDiagram()).catch((e) => console.warn('failed to save diagram', e));

  if (action.type === Creator.DiagramAction.SAVE_HISTORY && !action?.meta?.preventUpdate) {
    saveDiagram();

    if (hasViewers && !action?.meta?.force) {
      return;
    }
  }

  if (hasViewers && isHistoryAction) {
    store.dispatch(User.setCanvasError('Undo and Redo actions unavailable while other active users are viewing this flow'));

    return;
  }

  // eslint-disable-next-line callback-return
  next(action);

  if (isHistoryAction) {
    saveDiagram();
  }
};

const cleanupDisplayMiddleware: StoreMiddleware = (store) => (next) => (action) => {
  if (action.type === Creator.DiagramAction.REMOVE_MANY_NODES || action.type === Creator.DiagramAction.REMOVE_NODE) {
    const state = store.getState();
    const nodeIDs = action.type === Creator.DiagramAction.REMOVE_NODE ? [action.payload] : action.payload;

    const cleanupDisplayData = (nodeIDArray: string[]) => {
      nodeIDArray.forEach((nodeID) => {
        const nodeData = Creator.dataByNodeIDSelector(state)(nodeID);
        if (nodeData.type === BlockType.COMBINED) {
          const { combinedNodes } = Creator.nodeByIDSelector(state)(nodeID);
          return cleanupDisplayData(combinedNodes);
        }
        if (isLinkedeDisplayNode(nodeData) && nodeData.version === DISPLAY_VERSIONS.EDITORS_REDESIGN) {
          store.dispatch(Display.deleteDisplay(nodeData.displayID));
        }
      });
    };

    cleanupDisplayData(nodeIDs);
  }
  next(action);
};

// reset the creator state when navigating to the canvas from elsewhere in the app
const creatorResetMiddleware: StoreMiddleware = (store) => (next) => (action) => {
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

const createMiddleware = (history: History) => {
  const middleware = [
    routerMiddleware(history),
    thunk,
    creatorHistoryMiddleware,
    creatorResetMiddleware,
    cleanupDisplayMiddleware,
    createAutosaveMiddleware(createStructuredSelector({ intent: Intent.allIntentsSelector, slot: Slot.allSlotsSelector }), Skill.saveIntents),
    createAutosaveMiddleware(createStructuredSelector({ platform: Skill.activePlatformSelector }), savePlatformAndActiveDiagram, [
      Skill.SET_ACTIVE_SKILL,
    ]),
    createAutosaveMiddleware(createStructuredSelector({ variables: Skill.globalVariablesSelector }), Skill.saveVariables, [Skill.SET_ACTIVE_SKILL]),
    createAutosaveMiddleware(
      createStructuredSelector({ diagramVariables: VariableSet.activeDiagramVariables }),
      VariableSet.saveActiveDiagramVariables,
      [VariableSet.REPLACE_VARIABLE_SET_DIAGRAM, Creator.CreatorAction.INITIALIZE_CREATOR]
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
      [
        Skill.SET_ACTIVE_SKILL,
        VariableSet.REPLACE_VARIABLE_SET_DIAGRAM,
        Creator.CreatorAction.INITIALIZE_CREATOR,
        Creator.CreatorAction.RESET_CREATOR,
      ]
    ),
  ];

  if (LOGROCKET_ENABLED) {
    middleware.push(LogRocket.reduxMiddleware());
  }

  return middleware as Redux.Middleware[];
};

export default createMiddleware;
