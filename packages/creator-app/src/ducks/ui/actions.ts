import { ControlScheme, ZoomType } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';
import { Action } from '@/store/types';

import { createAction } from '../utils';

export enum UIAction {
  TOGGLE_BLOCK_MENU_SECTION = 'UI:BLOCK_MENU:TOGGLE_SECTION',
  SET_ACTIVE_CREATOR_MENU = 'UI:CREATOR_MENU:SET_ACTIVE_MENU',
  TOGGLE_CREATOR_MENU_HIDDEN = 'UI:CREATOR_MENU:TOGGLE_HIDDEN',
  SET_CANVAS_NAVIGATION = 'UI:SET_CANVAS_NAVIGATION',
  SET_ZOOM_TYPE = 'UI:SET_ZOOM_TYPE',
  SHOW_CREATOR_MENU = 'UI:CREATOR_MENU:SHOW',
  HIDE_CREATOR_MENU = 'UI:CREATOR_MENU:HIDE',
  TOGGLE_CANVAS_ONLY = 'UI:TOGGLE_CANVAS_ONLY',
  SET_VIEWING_VERSION = 'UI:SET_VIEWING_VERSION',
  SET_LOADING_PROJECTS = 'UI:SET_LOADING_PROJECTS',
}

// action types

export type ToggleBlockMenuSection = Action<UIAction.TOGGLE_BLOCK_MENU_SECTION, BlockCategory>;

export type SetActiveCreatorMenu = Action<UIAction.SET_ACTIVE_CREATOR_MENU, string>;

export type ToggleCreatorMenuHidden = Action<UIAction.TOGGLE_CREATOR_MENU_HIDDEN>;

export type ShowCreatorMenu = Action<UIAction.SHOW_CREATOR_MENU>;

export type HideCreatorMenu = Action<UIAction.HIDE_CREATOR_MENU>;

export type SetCanvasNavigation = Action<UIAction.SET_CANVAS_NAVIGATION, ControlScheme>;

export type SetZoomType = Action<UIAction.SET_ZOOM_TYPE, ZoomType>;

export type ToggleCanvasOnly = Action<UIAction.TOGGLE_CANVAS_ONLY>;

export type SetPreviewingVersion = Action<UIAction.SET_VIEWING_VERSION, boolean>;

export type SetLoadingProjects = Action<UIAction.SET_LOADING_PROJECTS, boolean>;

export type AnyUIAction =
  | ToggleBlockMenuSection
  | SetActiveCreatorMenu
  | ToggleCreatorMenuHidden
  | SetCanvasNavigation
  | HideCreatorMenu
  | ShowCreatorMenu
  | ToggleCanvasOnly
  | SetPreviewingVersion
  | SetZoomType
  | SetLoadingProjects;

//  action creators

export const toggleBlockMenuSection = (section: BlockCategory): ToggleBlockMenuSection => createAction(UIAction.TOGGLE_BLOCK_MENU_SECTION, section);

export const setActiveCreatorMenu = (menu: string): SetActiveCreatorMenu => createAction(UIAction.SET_ACTIVE_CREATOR_MENU, menu);

export const toggleCreatorMenuHidden = (): ToggleCreatorMenuHidden => createAction(UIAction.TOGGLE_CREATOR_MENU_HIDDEN);

export const showCreatorMenu = (): ShowCreatorMenu => createAction(UIAction.SHOW_CREATOR_MENU);

export const hideCreatorMenu = (): HideCreatorMenu => createAction(UIAction.HIDE_CREATOR_MENU);

export const setCanvasNavigation = (canvasNavigation: ControlScheme): SetCanvasNavigation =>
  createAction(UIAction.SET_CANVAS_NAVIGATION, canvasNavigation);

export const setZoomType = (zoomType: ZoomType): SetZoomType => createAction(UIAction.SET_ZOOM_TYPE, zoomType);

export const toggleCanvasOnly = (): ToggleCanvasOnly => createAction(UIAction.TOGGLE_CANVAS_ONLY);

export const setPreviewingVersion = (previewing: boolean): SetPreviewingVersion => createAction(UIAction.SET_VIEWING_VERSION, previewing);

export const setLoadingProjects = (isLoadingProjects: boolean): SetLoadingProjects => createAction(UIAction.SET_LOADING_PROJECTS, isLoadingProjects);
