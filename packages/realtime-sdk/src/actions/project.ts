import { ProjectPrivacy } from '@voiceflow/api-sdk';

import { AWARENESS_KEY, LOCAL_KEY, PROJECT_KEY } from '../constants';
import { ProjectPayload, Viewer } from '../types';
import { createAction, typeFactory } from './utils';

const projectType = typeFactory(PROJECT_KEY);
const projectLocalType = typeFactory(PROJECT_KEY, LOCAL_KEY);
const projectAwarenessType = typeFactory(PROJECT_KEY, AWARENESS_KEY);

export const identifyViewer = createAction<ProjectPayload<{ tabID: string; viewer: Viewer }>>(projectAwarenessType('IDENTIFY_VIEWER'));
export const forgetViewer = createAction<ProjectPayload<{ tabID: string }>>(projectAwarenessType('FORGET_VIEWER'));

export const setName = createAction<ProjectPayload<{ name: string }>>(projectType('SET_NAME'));
export const setImage = createAction<ProjectPayload<{ image: string }>>(projectType('SET_IMAGE'));
export const setPrivacy = createAction<ProjectPayload<{ privacy: ProjectPrivacy }>>(projectType('SET_PRIVACY'));

export const local = {
  reset: createAction<ProjectPayload>(projectLocalType('RESET')),
};
