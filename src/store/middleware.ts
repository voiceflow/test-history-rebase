import { LOCATION_CHANGE, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import LogRocket from 'logrocket';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import { createStructuredSelector } from 'reselect';
import shallowequal from 'shallowequal';
import { debounce } from 'throttle-debounce';

import { LOGROCKET_ENABLED } from '@/config';
import { FeatureFlag } from '@/config/features';
import { RootRoute } from '@/config/routes';
import { BlockType, DiagramState, NEW_PRODUCT_ID } from '@/constants';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Display from '@/ducks/display';
import * as Feature from '@/ducks/feature';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as ProjectList from '@/ducks/projectList';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as SkillV2 from '@/ducks/skill/sideEffectsV2';
import * as Slot from '@/ducks/slot';
import * as User from '@/ducks/user';
import { CRUDAction } from '@/ducks/utils/crud';
import * as Workspace from '@/ducks/workspace';
import { VERSIONS as DISPLAY_VERSIONS } from '@/pages/Canvas/managers/Display/constants';
import { isLinkedeDisplayNode } from '@/utils/node';

import { activeDiagramViewersSelector } from './selectors';
import { savePlatformAndActiveDiagram } from './sideEffects';
import { AnyAction, Dispatchable, Selector, StoreMiddleware, StoreMiddlewareAPI } from './types';
import { storeLogger } from './utils';

const AUTOSAVE_DEBOUNCE_TIMEOUT = 200;
const CREATOR_HISTORY_ACTIONS: string[] = [Creator.DiagramAction.UNDO_HISTORY, Creator.DiagramAction.REDO_HISTORY];
const AUTOSAVE_IGNORED_ACTIONS: string[] = [Account.AccountAction.RESET_ACCOUNT, Creator.DiagramAction.SET_DIAGRAM_STATE];

const log = storeLogger.child('middleware');

type ActionBlacklist = (string | ((action: AnyAction) => boolean))[];

const createAutosaveMiddleware = (
  selector: Selector<any> | Record<string, Selector<any>>,
  createSaveAction: () => Dispatchable,
  blacklist: ActionBlacklist = []
): StoreMiddleware => {
  let prevState: unknown | null = null;
  const debouncedSave = debounce(AUTOSAVE_DEBOUNCE_TIMEOUT, async (store: StoreMiddlewareAPI) => {
    try {
      store.dispatch(Creator.setDiagramState(DiagramState.SAVING));

      await store.dispatch(createSaveAction());

      store.dispatch(Creator.setDiagramState(DiagramState.SAVED));
    } catch {
      store.dispatch(Creator.setDiagramState(DiagramState.CHANGED));
    }
  });

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = (typeof selector === 'function' ? selector : createStructuredSelector<any, any>(selector))(state);
    const activeSkill = Skill.activeSkillSelector(state);
    const isLibraryRole = Workspace.isLibraryRoleSelector(state);

    if (isLibraryRole) return;

    if (
      activeSkill &&
      !action.meta?.receivedAction && // do not autosave on realtime updates
      !AUTOSAVE_IGNORED_ACTIONS.includes(action.type) &&
      !blacklist.includes(action.type) &&
      !shallowequal(prevState, currentState) &&
      prevState !== null
    ) {
      store.dispatch(Creator.setDiagramState(DiagramState.CHANGED));

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

const createFeatureFlaggedMiddleware = (
  feature: FeatureFlag,
  featureFlaggedMiddleware: StoreMiddleware,
  fallbackMiddleware?: StoreMiddleware
): StoreMiddleware => (store) => (next) => (action) => {
  const state = store.getState();

  const isFeatureEnabled = Feature.isFeatureEnabledSelector(state)(feature);

  if (isFeatureEnabled) {
    return featureFlaggedMiddleware(store)(next)(action);
  }

  return fallbackMiddleware ? fallbackMiddleware(store)(next)(action) : next(action);
};

const creatorHistoryMiddleware: StoreMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  const viewers = activeDiagramViewersSelector(state);
  const isDataRefactorEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.DATA_REFACTOR);
  const isLibraryRole = Workspace.isLibraryRoleSelector(state);
  const hasViewers = viewers.length > 1;
  const isHistoryAction = CREATOR_HISTORY_ACTIONS.includes(action.type);

  if (isLibraryRole) {
    next(action);
    return;
  }

  const saveDiagram = async () => {
    try {
      store.dispatch(Creator.setDiagramState(DiagramState.SAVING));

      if (isDataRefactorEnabled) {
        await store.dispatch(DiagramV2.saveActiveDiagram());
      } else {
        await store.dispatch(Diagram.saveActiveDiagram());
      }

      store.dispatch(Creator.setDiagramState(DiagramState.SAVED));
    } catch (err) {
      store.dispatch(Creator.setDiagramState(DiagramState.CHANGED));
      log.warn('failed to save diagram', err);
    }
  };

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
    const pathnameRegexp = new RegExp(`\\/${RootRoute.PROJECT}\\/[^\\/]+\\/canvas\\/[^\\/]+`);

    if (!isRealtimeConnected && creatorDiagramID && action.payload.location.pathname.match(pathnameRegexp)) {
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
    createFeatureFlaggedMiddleware(
      FeatureFlag.DATA_REFACTOR,
      createAutosaveMiddleware(
        createStructuredSelector({ intent: Intent.allIntentsSelector, slot: Slot.allSlotsSelector }),
        SkillV2.saveIntentsAndSlots
      ),
      createAutosaveMiddleware(createStructuredSelector({ intent: Intent.allIntentsSelector, slot: Slot.allSlotsSelector }), Skill.saveIntents)
    ),
    createAutosaveMiddleware(Skill.activePlatformSelector, savePlatformAndActiveDiagram, [Skill.SkillAction.SET_ACTIVE_SKILL]),
    createFeatureFlaggedMiddleware(
      FeatureFlag.DATA_REFACTOR,
      createAutosaveMiddleware(Skill.globalVariablesSelector, SkillV2.saveVariables, [Skill.SkillAction.SET_ACTIVE_SKILL]),
      createAutosaveMiddleware(Skill.globalVariablesSelector, Skill.saveVariables, [Skill.SkillAction.SET_ACTIVE_SKILL])
    ),
    createAutosaveMiddleware(Diagram.activeDiagramVariables, Diagram.saveActiveDiagramVariables, [
      Creator.CreatorAction.INITIALIZE_CREATOR,
      Creator.CreatorAction.RESET_CREATOR,
    ]),
    createAutosaveMiddleware(ProjectList.allProjectListsSelector, Workspace.saveActiveWorkspaceProjectLists),
    createRealtimeResourceUpdateMiddleware(
      Realtime.ResourceType.SETTINGS,
      createStructuredSelector({
        meta: Skill.skillMetaSelector,
        skillName: Skill.activeNameSelector,
      }),
      [Skill.SkillAction.SET_ACTIVE_SKILL]
    ),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.PUBLISH, Skill.publishInfoSelector, [Skill.SkillAction.SET_ACTIVE_SKILL]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.FLOWS, Diagram.allDiagramsSelector, [Skill.SkillAction.SET_ACTIVE_SKILL]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.DISPLAYS, Display.allDisplaysSelector, [Skill.SkillAction.SET_ACTIVE_SKILL]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.PRODUCTS, Product.allProductsSelector, [
      CRUDAction.CRUD_UPDATE,
      (action) => action.type === CRUDAction.CRUD_ADD && action.payload?.key === NEW_PRODUCT_ID,
      (action) => action.type === CRUDAction.CRUD_REMOVE && action.payload === NEW_PRODUCT_ID,
    ]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.INTENTS, Intent.allIntentsSelector),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.SLOTS, Slot.allSlotsSelector),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.VARIABLES, Skill.globalVariablesSelector, [
      Skill.SkillAction.SET_ACTIVE_SKILL,
      Creator.CreatorAction.INITIALIZE_CREATOR,
      Creator.CreatorAction.RESET_CREATOR,
    ]),
    createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.DIAGRAM, Diagram.activeDiagramSelector, [
      Creator.CreatorAction.INITIALIZE_CREATOR,
      Creator.CreatorAction.RESET_CREATOR,
    ]),
  ];

  if (LOGROCKET_ENABLED) {
    middleware.push(LogRocket.reduxMiddleware());
  }

  return middleware as Redux.Middleware[];
};

export default createMiddleware;
