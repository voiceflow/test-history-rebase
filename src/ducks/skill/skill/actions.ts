import { PlatformType } from '@/constants';
import { createAction } from '@/ducks/utils';
import { Skill } from '@/models';
import { Action } from '@/store/types';

// actions

export enum SkillAction {
  SET_ACTIVE_SKILL = 'SKILL:SET_ACTIVE',
  UPDATE_ACTIVE_SKILL = 'SKILL:UPDATE_ACTIVE',
  UPDATE_DIAGRAM_ID = 'SKILL:UPDATE_DIAGRAM_ID',
  ADD_GLOBAL_VARIABLE = 'SKILL:GLOBAL_VARIABLE:ADD',
  REPLACE_GLOBAL_VARIABLES = 'SKILL:GLOBAL_VARIABLES:REPLACE',
  REMOVE_GLOBAL_VARIABLE = 'SKILL:GLOBAL_VARIABLE:REMOVE',
  SET_EXPORTING_CANVAS = 'SKILL:SET_EXPORTING_CANVAS',
  SET_CANVAS_ONLY = 'SKILL:SET_CANVAS_ONLY',
}

// action types

export type SetActiveSkillAction = Action<SkillAction.SET_ACTIVE_SKILL, { skill: Skill; diagramID: string }>;

export type UpdateActiveSkillAction = Action<SkillAction.UPDATE_ACTIVE_SKILL, Partial<Skill>, object | undefined>;

export type UpdateDiagramIDAction = Action<SkillAction.UPDATE_DIAGRAM_ID, string>;

export type ReplaceGlobalVariablesAction = Action<SkillAction.REPLACE_GLOBAL_VARIABLES, string[], object | undefined>;

export type AddGlobalVariablesAction = Action<SkillAction.ADD_GLOBAL_VARIABLE, string>;

export type RemoveGlobalVariablesAction = Action<SkillAction.REMOVE_GLOBAL_VARIABLE, string>;

export type SetExportingCanvasAction = Action<SkillAction.SET_EXPORTING_CANVAS, boolean>;

export type AnySkillAction =
  | SetActiveSkillAction
  | UpdateActiveSkillAction
  | UpdateDiagramIDAction
  | ReplaceGlobalVariablesAction
  | RemoveGlobalVariablesAction
  | AddGlobalVariablesAction
  | SetExportingCanvasAction;

// action creators

export const setActiveSkill = (skill: Skill, diagramID: string): SetActiveSkillAction =>
  createAction(SkillAction.SET_ACTIVE_SKILL, { skill, diagramID });

export const updateActiveSkill = (properties: Partial<Skill>, meta?: object): UpdateActiveSkillAction =>
  createAction(SkillAction.UPDATE_ACTIVE_SKILL, { ...properties }, meta);

export const updateDiagramID = (diagramID: string): UpdateDiagramIDAction => createAction(SkillAction.UPDATE_DIAGRAM_ID, diagramID);

export const setActivePlatform = (platform: PlatformType): UpdateActiveSkillAction => createAction(SkillAction.UPDATE_ACTIVE_SKILL, { platform });

export const replaceGlobalVariables = (variables: string[], meta?: object): ReplaceGlobalVariablesAction =>
  createAction(SkillAction.REPLACE_GLOBAL_VARIABLES, variables, meta);

export const addGlobalVariableAC = (variable: string): AddGlobalVariablesAction => createAction(SkillAction.ADD_GLOBAL_VARIABLE, variable);

export const removeGlobalVariable = (variable: string): RemoveGlobalVariablesAction => createAction(SkillAction.REMOVE_GLOBAL_VARIABLE, variable);

export const setExportingCanvas = (exporting: boolean): SetExportingCanvasAction => createAction(SkillAction.SET_EXPORTING_CANVAS, exporting);
