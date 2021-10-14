import { AWARENESS_KEY } from '../../constants';
import { BaseProjectPayload, Viewer } from '../../types';
import { createAction, typeFactory } from '../utils';
import { projectType } from './utils';

const awarenessType = typeFactory(projectType(AWARENESS_KEY));

export interface LoadViewersPayload extends BaseProjectPayload {
  viewers: { [diagramID: string]: Viewer[] };
}

export interface UpdateViewersPayload extends BaseProjectPayload {
  viewers: Viewer[];
  diagramID: string;
}

export const loadViewers = createAction<LoadViewersPayload>(awarenessType('LOAD_VIEWERS'));
export const updateViewers = createAction<UpdateViewersPayload>(awarenessType('UPDATE_VIEWERS'));
