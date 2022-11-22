import { AWARENESS_KEY } from '@realtime-sdk/constants';
import { BaseProjectPayload, BaseWorkspacePayload, Viewer } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { projectType } from './utils';

const awarenessType = Utils.protocol.typeFactory(projectType(AWARENESS_KEY));

export interface LoadViewersPayload extends BaseWorkspacePayload {
  viewers: Record<string, Record<string, Viewer[]>>;
}

export interface UpdateViewersPayload extends BaseProjectPayload {
  viewers: Record<string, Viewer[]>;
}

export interface UpdateDiagramViewersPayload extends BaseProjectPayload {
  viewers: Viewer[];
  diagramID: string;
}

export const loadViewers = Utils.protocol.createAction<LoadViewersPayload>(awarenessType('LOAD_VIEWERS'));
export const updateViewers = Utils.protocol.createAction<UpdateViewersPayload>(awarenessType('UPDATE_VIEWERS'));
export const updateDiagramViewers = Utils.protocol.createAction<UpdateDiagramViewersPayload>(awarenessType('UPDATE_DIAGRAM_VIEWERS'));
