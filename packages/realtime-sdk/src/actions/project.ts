import { ProjectPrivacy } from '@voiceflow/api-sdk';

import { AWARENESS_KEY, LOCAL_KEY, PROJECT_KEY } from '../constants';
import { ProjectPayload, Viewer } from '../types';
import { createAction, typeFactory } from './utils';

const projectType = typeFactory(PROJECT_KEY);
const projectLocalType = typeFactory(PROJECT_KEY, LOCAL_KEY);
const projectAwarenessType = typeFactory(PROJECT_KEY, AWARENESS_KEY);

export const loadViewers = createAction<ProjectPayload<{ viewers: Record<string, Viewer[]> }>>(projectAwarenessType('LOAD_VIEWERS'));
export const updateViewers = createAction<ProjectPayload<{ diagramID: string; viewers: Viewer[] }>>(projectAwarenessType('UPDATE_VIEWERS'));

export const setName = createAction<ProjectPayload<{ name: string }>>(projectType('SET_NAME'));
export const setImage = createAction<ProjectPayload<{ image: string }>>(projectType('SET_IMAGE'));
export const setPrivacy = createAction<ProjectPayload<{ privacy: ProjectPrivacy }>>(projectType('SET_PRIVACY'));

export const local = {
  reset: createAction<ProjectPayload>(projectLocalType('RESET')),
};
