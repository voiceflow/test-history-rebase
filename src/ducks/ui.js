import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { BlockCategoryType, FlowTab } from '@/constants';
import { withoutValue } from '@/utils/array';

import { createAction, createRootSelector } from './utils';

export const STATE_KEY = 'ui';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

const DEFAULT_STATE = {
  creatorMenu: {
    activeMenu: null,
    isHidden: false,
  },
  blockMenu: {
    openSections: [BlockCategoryType.BASIC],
  },
  flowMenu: {
    activeTab: FlowTab.STRUCTURE,
  },
  local: {},
};

// actions

export const TOGGLE_BLOCK_MENU_SECTION = 'UI:BLOCK_MENU:TOGGLE_SECTION';
export const SET_ACTIVE_CREATOR_MENU = 'UI:CREATOR_MENU:SET_ACTIVE_MENU';
export const SET_ACTIVE_FLOW_MENU_TAB = 'UI:FLOW_MENU:SET_ACTIVE_TAB';
export const TOGGLE_CREATOR_MENU_HIDDEN = 'UI:CREATOR_MENU:TOGGLE_HIDDEN';
export const SET_ONLY_ACTIVE_CREATOR_MENU = 'UI:CREATOR_MENU:SET_ONLY_ACTIVE_MENU';

// reducers

export const toggleBlockMenuSectionReducer = (state, { payload: section }) => {
  const { openSections } = state.blockMenu;

  return {
    ...state,
    blockMenu: {
      ...state.blockMenu,
      openSections: openSections.includes(section) ? withoutValue(openSections, section) : [...openSections, section],
    },
  };
};

export const setActiveCreatorMenuReducer = (state, { payload: activeMenu }) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    activeMenu,
    isHidden: false,
  },
});

export const setOnlyActiveCreatorMenuReducer = (state, { payload: activeMenu }) => ({
  ...state,
  creatorMenu: { ...state.creatorMenu, activeMenu },
});

export const setActiveFlowMenuTabReducer = (state, { payload: activeTab }) => ({
  ...state,
  flowMenu: {
    ...state.flowMenu,
    activeTab,
  },
});

export const toggleCreatorMenuHiddenReducer = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: !state.creatorMenu.isHidden,
  },
});

const uiReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case TOGGLE_BLOCK_MENU_SECTION:
      return toggleBlockMenuSectionReducer(state, action);
    case SET_ACTIVE_CREATOR_MENU:
      return setActiveCreatorMenuReducer(state, action);
    case SET_ONLY_ACTIVE_CREATOR_MENU:
      return setOnlyActiveCreatorMenuReducer(state, action);
    case SET_ACTIVE_FLOW_MENU_TAB:
      return setActiveFlowMenuTabReducer(state, action);
    case TOGGLE_CREATOR_MENU_HIDDEN:
      return toggleCreatorMenuHiddenReducer(state);
    default:
      return state;
  }
};

export default persistReducer(PERSIST_CONFIG, uiReducer);

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const openBlockMenuSectionsSelector = createSelector(rootSelector, ({ blockMenu: { openSections } }) => openSections);

export const activeCreatorMenuSelector = createSelector(rootSelector, ({ creatorMenu: { activeMenu } }) => activeMenu);

export const isCreatorMenuHiddenSelector = createSelector(rootSelector, ({ creatorMenu: { isHidden } }) => isHidden);

export const activeFlowMenuTabSelector = createSelector(rootSelector, ({ flowMenu: { activeTab } }) => activeTab);

//  action creators

export const toggleBlockMenuSection = (section) => createAction(TOGGLE_BLOCK_MENU_SECTION, section);

export const setActiveCreatorMenu = (menu) => createAction(SET_ACTIVE_CREATOR_MENU, menu);

export const setOnlyActiveCreatorMenu = (menu) => createAction(SET_ONLY_ACTIVE_CREATOR_MENU, menu);

export const setActiveFlowMenuTab = (tab) => createAction(SET_ACTIVE_FLOW_MENU_TAB, tab);

export const toggleCreatorMenuHidden = () => createAction(TOGGLE_CREATOR_MENU_HIDDEN);
