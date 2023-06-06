import { ControlScheme, ZoomType } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';
import { Action } from '@/store/types';

import { createAction } from '../utils';

export enum UIAction {
  TOGGLE_BLOCK_MENU_SECTION = 'UI:BLOCK_MENU:TOGGLE_SECTION',
  TOGGLE_CREATOR_MENU_HIDDEN = 'UI:CREATOR_MENU:TOGGLE_HIDDEN',
  SET_CANVAS_NAVIGATION = 'UI:SET_CANVAS_NAVIGATION',
  SET_ZOOM_TYPE = 'UI:SET_ZOOM_TYPE',
  TOGGLE_CANVAS_GRID = 'UI:TOGGLE_CANVAS_GRID',
  SHOW_CREATOR_MENU = 'UI:CREATOR_MENU:SHOW',
  HIDE_CREATOR_MENU = 'UI:CREATOR_MENU:HIDE',
  TOGGLE_CANVAS_ONLY = 'UI:TOGGLE_CANVAS_ONLY',
  SET_LOADING_PROJECTS = 'UI:SET_LOADING_PROJECTS',
  TOGGLE_COMMENT_VISIBILITY = 'UI:TOGGLE_COMMENT_VISIBILITY',
  TOGGLE_MENTIONED_THREADS_ONLY = 'UI:TOGGLE_MENTIONED_THREADS_ONLY',
  TOGGLE_FULL_SCREEN_MODE = 'UI:TOGGLE_FULL_SCREEN_MODE',
}

// action types

export type ToggleBlockMenuSection = Action<UIAction.TOGGLE_BLOCK_MENU_SECTION, BlockCategory>;

export type ToggleCreatorMenuHidden = Action<UIAction.TOGGLE_CREATOR_MENU_HIDDEN>;

export type ShowCreatorMenu = Action<UIAction.SHOW_CREATOR_MENU>;

export type HideCreatorMenu = Action<UIAction.HIDE_CREATOR_MENU>;

export type SetCanvasNavigation = Action<UIAction.SET_CANVAS_NAVIGATION, ControlScheme>;

export type SetZoomType = Action<UIAction.SET_ZOOM_TYPE, ZoomType>;

export type ToggleCanvasGrid = Action<UIAction.TOGGLE_CANVAS_GRID, boolean>;

export type ToggleCanvasOnly = Action<UIAction.TOGGLE_CANVAS_ONLY>;

export type SetLoadingProjects = Action<UIAction.SET_LOADING_PROJECTS, boolean>;

export type ToggleCommentVisibility = Action<UIAction.TOGGLE_COMMENT_VISIBILITY>;

export type ToggleMentionedThreadsOnly = Action<UIAction.TOGGLE_MENTIONED_THREADS_ONLY>;

export type ToggleFullScreenMode = Action<UIAction.TOGGLE_FULL_SCREEN_MODE>;

export type AnyUIAction =
  | ToggleBlockMenuSection
  | ToggleCreatorMenuHidden
  | SetCanvasNavigation
  | HideCreatorMenu
  | ShowCreatorMenu
  | ToggleCanvasOnly
  | SetZoomType
  | SetLoadingProjects
  | ToggleCommentVisibility
  | ToggleMentionedThreadsOnly
  | ToggleCanvasGrid
  | ToggleFullScreenMode;

//  action creators

export const toggleBlockMenuSection = (section: BlockCategory): ToggleBlockMenuSection => createAction(UIAction.TOGGLE_BLOCK_MENU_SECTION, section);

export const toggleCreatorMenuHidden = (): ToggleCreatorMenuHidden => createAction(UIAction.TOGGLE_CREATOR_MENU_HIDDEN);

export const toggleFullScreenMode = (): ToggleFullScreenMode => createAction(UIAction.TOGGLE_FULL_SCREEN_MODE);

export const showCreatorMenu = (): ShowCreatorMenu => createAction(UIAction.SHOW_CREATOR_MENU);

export const hideCreatorMenu = (): HideCreatorMenu => createAction(UIAction.HIDE_CREATOR_MENU);

export const setCanvasNavigation = (canvasNavigation: ControlScheme): SetCanvasNavigation =>
  createAction(UIAction.SET_CANVAS_NAVIGATION, canvasNavigation);

export const setZoomType = (zoomType: ZoomType): SetZoomType => createAction(UIAction.SET_ZOOM_TYPE, zoomType);

export const toggleCanvasOnly = (): ToggleCanvasOnly => createAction(UIAction.TOGGLE_CANVAS_ONLY);

export const toggleCanvasGrid = (): ToggleCanvasGrid => createAction(UIAction.TOGGLE_CANVAS_GRID);

export const setLoadingProjects = (isLoadingProjects: boolean): SetLoadingProjects => createAction(UIAction.SET_LOADING_PROJECTS, isLoadingProjects);

export const toggleCommentVisibility = (): ToggleCommentVisibility => createAction(UIAction.TOGGLE_COMMENT_VISIBILITY);

export const toggleMentionedThreadsOnly = (): ToggleMentionedThreadsOnly => createAction(UIAction.TOGGLE_MENTIONED_THREADS_ONLY);
