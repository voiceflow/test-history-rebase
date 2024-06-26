import { createCRUDActions } from '@realtime-sdk/actions/utils';
import type { AnyProject, DBProject, ProjectMember } from '@realtime-sdk/models';
import type { BaseProjectPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import type { Optional } from 'utility-types';

import { projectType } from './utils';

export * as awareness from './awareness';
export * as member from './member';
export * from './platform';
export * from './utils';

export const EjectUsersReason = {
  BACKUP_RESTORE: 'BACKUP_RESTORE',
} as const;

type EjectUsersReason = (typeof EjectUsersReason)[keyof typeof EjectUsersReason];
export interface CreateProjectPayload extends BaseWorkspacePayload {
  data: Partial<Pick<DBProject, 'teamID' | 'name' | 'image' | '_version'>>;
  listID?: string;
  members?: ProjectMember[];
  templateID: string;
}

export interface EjectUsersPayload extends BaseProjectPayload {
  creatorID: number;
  reason?: EjectUsersReason;
}

export interface DuplicateProjectPayload extends BaseProjectPayload {
  data: Optional<Pick<DBProject, 'teamID' | 'name' | '_version' | 'platform'>, 'name' | 'platform'>;
  listID?: string;
}

export interface AddManyCustomThemesPayload extends BaseProjectPayload {
  values: DBProject['customThemes'];
}

export interface ImportProjectPayload extends BaseWorkspacePayload {
  project: AnyProject;
}

export interface PatchPlatformDataPayload extends BaseProjectPayload {
  platformData: Record<string, unknown>;
}

export interface ToggleWorkspaceProjectsAiAssistOffPayload extends BaseWorkspacePayload {}

export const crud = createCRUDActions<AnyProject, BaseWorkspacePayload>(projectType);

export const create = Utils.protocol.createAsyncAction<CreateProjectPayload, AnyProject>(projectType('CREATE'));

export const duplicate = Utils.protocol.createAsyncAction<DuplicateProjectPayload, AnyProject>(
  projectType('DUPLICATE')
);

export const ejectUsers = Utils.protocol.createAction<EjectUsersPayload>(projectType('KICK_USERS'));

export const patchPlatformData = Utils.protocol.createAction<PatchPlatformDataPayload>(
  projectType('PATCH_PLATFORM_DATA')
);

export const addManyCustomThemes = Utils.protocol.createAction<AddManyCustomThemesPayload>(
  projectType('ADD_MANY_CUSTOM_THEMES')
);

export const toggleWorkspaceProjectsAiAssistOff =
  Utils.protocol.createAction<ToggleWorkspaceProjectsAiAssistOffPayload>(
    projectType('TOGGLE_WORKSPACE_PROJECTS_AI_ASSIST_OFF')
  );
