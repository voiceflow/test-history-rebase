import { createAction } from '@/ducks/utils';

// actions

export const SET_ACTIVE_SKILL = 'SKILL:SET_ACTIVE';
export const SET_ACTIVE_PLATFORM = 'SKILL:SET_ACTIVE_PLATFORM';
export const UPDATE_ACTIVE_SKILL = 'SKILL:UPDATE_ACTIVE';
export const UPDATE_DIAGRAM_ID = 'SKILL:UPDATE_DIAGRAM_ID';
export const ADD_GLOBAL_VARIABLE = 'SKILL:GLOBAL_VARIABLE:ADD';
export const REPLACE_GLOBAL_VARIABLES = 'SKILL:GLOBAL_VARIABLES:REPLACE';
export const REMOVE_GLOBAL_VARIABLE = 'SKILL:GLOBAL_VARIABLE:REMOVE';

// action creators

export const setActiveSkill = (skill, diagramID) => createAction(SET_ACTIVE_SKILL, { skill, diagramID });

export const updateActiveSkill = (properties, meta) => createAction(UPDATE_ACTIVE_SKILL, { ...properties }, meta);

export const updateDiagramID = (diagramID) => createAction(UPDATE_DIAGRAM_ID, diagramID);

export const setActivePlatform = (platform) => createAction(UPDATE_ACTIVE_SKILL, { platform });

export const replaceGlobalVariables = (variables, meta) => createAction(REPLACE_GLOBAL_VARIABLES, variables, meta);

export const removeGlobalVariable = (variable) => createAction(REMOVE_GLOBAL_VARIABLE, variable);
