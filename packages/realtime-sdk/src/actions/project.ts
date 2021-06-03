import { ProjectPrivacy } from '@voiceflow/api-sdk';

import { AWARENESS_KEY, PROJECT_KEY } from '../constants';
import { Viewer } from '../types';
import { createAction, typeFactory } from './utils';

const projectType = typeFactory(PROJECT_KEY);
const projectAwarenessType = typeFactory(PROJECT_KEY, AWARENESS_KEY);

export const identifyViewer = createAction<{ tabID: string; viewer: Viewer }>(projectAwarenessType('IDENTIFY_VIEWER'));
export const forgetViewer = createAction<{ tabID: string }>(projectAwarenessType('FORGET_VIEWER'));

export const setName = createAction<{ projectID: string; name: string }>(projectType('SET_NAME'));
export const setImage = createAction<{ projectID: string; image: string }>(projectType('SET_IMAGE'));
export const setPrivacy = createAction<{ projectID: string; privacy: ProjectPrivacy }>(projectType('SET_PRIVACY'));
