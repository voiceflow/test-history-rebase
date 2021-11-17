import { Utils } from '@voiceflow/common';

import { AWARENESS_KEY } from '../../constants';
import { BaseProjectPayload, Viewer } from '../../types';
import { projectType } from './utils';

const awarenessType = Utils.protocol.typeFactory(projectType(AWARENESS_KEY));

export interface LoadViewersPayload extends BaseProjectPayload {
  viewers: { [diagramID: string]: Viewer[] };
}

export interface UpdateViewersPayload extends BaseProjectPayload {
  viewers: Viewer[];
  diagramID: string;
}

export const loadViewers = Utils.protocol.createAction<LoadViewersPayload>(awarenessType('LOAD_VIEWERS'));
export const updateViewers = Utils.protocol.createAction<UpdateViewersPayload>(awarenessType('UPDATE_VIEWERS'));
