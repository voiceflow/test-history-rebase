import { AWARENESS_KEY, PROJECT_KEY } from '../constants';
import { AnyProject } from '../models';
import { BaseProjectPayload, BaseWorkspacePayload, Viewer } from '../types';
import { createAction, createCrudActions, typeFactory } from './utils';

const projectType = typeFactory(PROJECT_KEY);
const projectAwarenessType = typeFactory(projectType(AWARENESS_KEY));

// Awareness

export interface AwarenessLoadViewersPayload extends BaseProjectPayload {
  viewers: { [diagramID: string]: Viewer[] };
}

export interface AwarenessUpdateViewersPayload extends BaseProjectPayload {
  viewers: Viewer[];
  diagramID: string;
}

export interface ImportProjectFromFile extends BaseWorkspacePayload {
  data: string;
}

export const awarenessLoadViewers = createAction<AwarenessLoadViewersPayload>(projectAwarenessType('LOAD_VIEWERS'));
export const awarenessUpdateViewers = createAction<AwarenessUpdateViewersPayload>(projectAwarenessType('UPDATE_VIEWERS'));

// Other

export const crudActions = createCrudActions<BaseWorkspacePayload, AnyProject>(projectType);
export const importProjectFromFile = createAction<ImportProjectFromFile>(projectType('IMPORT_PROJECT_FROM_FILE'));
