import { PROJECT_LIST_KEY } from '@realtime-sdk/constants';
import type { ProjectList } from '@realtime-sdk/models';
import type { BaseProjectPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from './utils';

const projectListType = Utils.protocol.typeFactory(PROJECT_LIST_KEY);

// Other

export interface BaseProjectListPayload extends BaseProjectPayload {
  listID: string;
}

export interface AddProjectToListPayload extends BaseProjectListPayload {
  addToStart?: boolean;
}

export interface TransplantProjectBetweenListsPayload extends BaseWorkspacePayload {
  to: { listID: string; index: number };
  from: { listID: string; projectID: string };
}

export const addProjectToList = Utils.protocol.createAction<AddProjectToListPayload>(projectListType('ADD_PROJECT'));

export const removeProjectFromList = Utils.protocol.createAction<BaseProjectListPayload>(
  projectListType('REMOVE_PROJECT')
);

export const transplantProjectBetweenLists = Utils.protocol.createAction<TransplantProjectBetweenListsPayload>(
  projectListType('TRANSPLANT_PROJECT')
);

export const crud = createCRUDActions<ProjectList, BaseWorkspacePayload>(projectListType);
