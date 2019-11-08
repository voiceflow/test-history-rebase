import { routerMiddleware } from 'connected-react-router';
import LogRocket from 'logrocket';
import thunk from 'redux-thunk';
import shallowequal from 'shallowequal';
import { debounce } from 'throttle-debounce';

import { LOGROCKET_ENABLED } from '@/config';
import { INITIALIZE_CREATOR, RESET_CREATOR, creatorDiagramSelector } from '@/ducks/creator';
import { saveActiveDiagram } from '@/ducks/diagram';
import { allIntentsSelector } from '@/ducks/intent';
// import { sendRealtimeUpdate } from '@/ducks/realtime';
import { SET_ACTIVE_SKILL, activePlatformSelector, activeSkillSelector, globalVariablesSelector, saveIntents, saveVariables } from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';
import { REPLACE_VARIABLE_SET, activeDiagramVariables, saveActiveDiagramVariables } from '@/ducks/variableSet';

import { savePlatformAndActiveDiagram } from './sideEffects';

const CREATOR_AUTOSAVE_DEBOUNCE_TIMEOUT = 200;
const CREATOR_AUTOSAVE_IGNORED_ACTIONS = [INITIALIZE_CREATOR, RESET_CREATOR];

const createAutosaveMiddleware = (selector, createSaveAction, blacklist = []) => {
  let prevState = null;
  const debouncedSave = debounce(CREATOR_AUTOSAVE_DEBOUNCE_TIMEOUT, (store) => store.dispatch(createSaveAction()));

  return (store) => (next) => (action) => {
    // eslint-disable-next-line callback-return
    next(action);

    const state = store.getState();
    const currentState = selector(state);
    const activeSkill = activeSkillSelector(state);

    if (activeSkill && !blacklist.includes(action.type) && !shallowequal(prevState, currentState) && prevState !== null) {
      debouncedSave(store);
    }

    prevState = currentState;
  };
};

const realtimeMiddleware = () => (next) => (action) => {
  if (action.type.startsWith('REALTIME:SOCKET:')) {
    // store.dispatch(sendRealtimeUpdate(action));
    return;
  }

  next(action);
};

const createMiddleware = (history) => {
  const middleware = [
    routerMiddleware(history),
    thunk,
    createAutosaveMiddleware((state) => ({ creator: creatorDiagramSelector(state) }), saveActiveDiagram, CREATOR_AUTOSAVE_IGNORED_ACTIONS),
    createAutosaveMiddleware((state) => ({ intent: allIntentsSelector(state), slot: allSlotsSelector(state) }), saveIntents),
    createAutosaveMiddleware((state) => ({ platform: activePlatformSelector(state) }), savePlatformAndActiveDiagram, [SET_ACTIVE_SKILL]),
    createAutosaveMiddleware((state) => ({ variables: globalVariablesSelector(state) }), saveVariables, [SET_ACTIVE_SKILL]),
    createAutosaveMiddleware((state) => ({ diagramVariables: activeDiagramVariables(state) }), saveActiveDiagramVariables, [
      REPLACE_VARIABLE_SET,
      INITIALIZE_CREATOR,
    ]),
    realtimeMiddleware,
  ];

  if (LOGROCKET_ENABLED) {
    middleware.push(LogRocket.reduxMiddleware());
  }

  return middleware;
};

export default createMiddleware;
