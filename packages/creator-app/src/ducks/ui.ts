import { IS_MAC } from '@voiceflow/ui';
import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import { createSelector } from 'reselect';

import { ControlScheme } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';
import { Action, Reducer, RootReducer } from '@/store/types';
import { withoutValue } from '@/utils/array';

import { createAction, createRootSelector } from './utils';

export interface UIState {
  creatorMenu: {
    activeMenu: string | null;
    isHidden: boolean;
  };
  blockMenu: {
    openSections: BlockCategory[];
  };
  local: Record<string, any>;
  canvasNavigation: ControlScheme;
  canvasOnly: boolean;
}

export const STATE_KEY = 'ui';
export const INITIAL_STATE = {
  creatorMenu: {
    activeMenu: null,
    isHidden: false,
  },
  blockMenu: {
    openSections: [BlockCategory.RESPONSE, BlockCategory.USER_INPUT],
  },
  local: {},
  canvasNavigation: IS_MAC ? ControlScheme.TRACKPAD : ControlScheme.MOUSE,
  canvasOnly: false,
};

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
  blacklist: ['canvasOnly'],
};

export enum UIAction {
  TOGGLE_BLOCK_MENU_SECTION = 'UI:BLOCK_MENU:TOGGLE_SECTION',
  SET_ACTIVE_CREATOR_MENU = 'UI:CREATOR_MENU:SET_ACTIVE_MENU',
  TOGGLE_CREATOR_MENU_HIDDEN = 'UI:CREATOR_MENU:TOGGLE_HIDDEN',
  SET_CANVAS_NAVIGATION = 'UI:SET_CANVAS_NAVIGATION',
  SHOW_CREATOR_MENU = 'UI:CREATOR_MENU:SHOW',
  HIDE_CREATOR_MENU = 'UI:CREATOR_MENU:HIDE',
  TOGGLE_CANVAS_ONLY = 'UI:TOGGLE_CANVAS_ONLY',
}

// action types

export type ToggleBlockMenuSection = Action<UIAction.TOGGLE_BLOCK_MENU_SECTION, BlockCategory>;

export type SetActiveCreatorMenu = Action<UIAction.SET_ACTIVE_CREATOR_MENU, string>;

export type ToggleCreatorMenuHidden = Action<UIAction.TOGGLE_CREATOR_MENU_HIDDEN>;

export type ShowCreatorMenu = Action<UIAction.SHOW_CREATOR_MENU>;

export type HideCreatorMenu = Action<UIAction.HIDE_CREATOR_MENU>;

export type SetCanvasNavigation = Action<UIAction.SET_CANVAS_NAVIGATION, ControlScheme>;

export type ToggleCanvasOnly = Action<UIAction.TOGGLE_CANVAS_ONLY>;

type AnyUIAction =
  | ToggleBlockMenuSection
  | SetActiveCreatorMenu
  | ToggleCreatorMenuHidden
  | SetCanvasNavigation
  | HideCreatorMenu
  | ShowCreatorMenu
  | ToggleCanvasOnly;

// reducers

export const toggleBlockMenuSectionReducer: Reducer<UIState, ToggleBlockMenuSection> = (state, { payload: section }) => {
  const { openSections } = state.blockMenu;

  return {
    ...state,
    blockMenu: {
      ...state.blockMenu,
      openSections: openSections.includes(section) ? withoutValue(openSections, section) : [...openSections, section],
    },
  };
};

export const setActiveCreatorMenuReducer: Reducer<UIState, SetActiveCreatorMenu> = (state, { payload: activeMenu }) => ({
  ...state,
  creatorMenu: { ...state.creatorMenu, activeMenu },
});

export const toggleCreatorMenuHiddenReducer: Reducer<UIState> = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: !state.creatorMenu.isHidden,
  },
});

export const hideCreatorMenuReducer: Reducer<UIState> = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: true,
  },
});

export const showCreatorMenuReducer: Reducer<UIState> = (state) => ({
  ...state,
  creatorMenu: {
    ...state.creatorMenu,
    isHidden: false,
  },
});

export const setNavigationReducer: Reducer<UIState, SetCanvasNavigation> = (state, { payload: canvasNavigation }) => ({
  ...state,
  canvasNavigation,
});

export const toggleCanvasOnlyReducer: Reducer<UIState> = (state) => ({
  ...state,
  canvasOnly: !state.canvasOnly,
});

const uiReducer: RootReducer<UIState, AnyUIAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UIAction.TOGGLE_BLOCK_MENU_SECTION:
      return toggleBlockMenuSectionReducer(state, action);
    case UIAction.SET_ACTIVE_CREATOR_MENU:
      return setActiveCreatorMenuReducer(state, action);
    case UIAction.SET_CANVAS_NAVIGATION:
      return setNavigationReducer(state, action);
    case UIAction.TOGGLE_CREATOR_MENU_HIDDEN:
      return toggleCreatorMenuHiddenReducer(state);
    case UIAction.HIDE_CREATOR_MENU:
      return hideCreatorMenuReducer(state);
    case UIAction.SHOW_CREATOR_MENU:
      return showCreatorMenuReducer(state);
    case UIAction.TOGGLE_CANVAS_ONLY:
      return toggleCanvasOnlyReducer(state);
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

export const canvasNavigationSelector = createSelector(rootSelector, ({ canvasNavigation }) => canvasNavigation);

export const isCanvasOnlyShowingSelector = createSelector(rootSelector, ({ canvasOnly }) => canvasOnly);

//  action creators

export const toggleBlockMenuSection = (section: BlockCategory): ToggleBlockMenuSection => createAction(UIAction.TOGGLE_BLOCK_MENU_SECTION, section);

export const setActiveCreatorMenu = (menu: string): SetActiveCreatorMenu => createAction(UIAction.SET_ACTIVE_CREATOR_MENU, menu);

export const toggleCreatorMenuHidden = (): ToggleCreatorMenuHidden => createAction(UIAction.TOGGLE_CREATOR_MENU_HIDDEN);

export const showCreatorMenu = (): ShowCreatorMenu => createAction(UIAction.SHOW_CREATOR_MENU);

export const hideCreatorMenu = (): HideCreatorMenu => createAction(UIAction.HIDE_CREATOR_MENU);

export const setCanvasNavigation = (canvasNavigation: ControlScheme): SetCanvasNavigation =>
  createAction(UIAction.SET_CANVAS_NAVIGATION, canvasNavigation);

export const toggleCanvasOnly = (): ToggleCanvasOnly => createAction(UIAction.TOGGLE_CANVAS_ONLY);
