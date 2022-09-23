import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { AnyProject, DBProject } from '@realtime-sdk/models';
import { BaseProjectPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { Optional } from 'utility-types';

import { projectType } from './utils';

export * as awareness from './awareness';
export * from './platform';
export * from './utils';

export interface CreateProjectPayload extends BaseWorkspacePayload {
  data: Partial<Pick<DBProject, 'teamID' | 'name' | 'image' | '_version'>>;
  channel: string;
  listID?: string;
  platform: VoiceflowConstants.PlatformType;
  language?: string;
  onboarding: boolean;
  templateID: string;
}

export interface EjectUsersPayload extends BaseProjectPayload {
  key: string;
  creatorID: number;
}

export interface MergeProjectsPayload extends BaseWorkspacePayload {
  sourceProjectID: string;
  targetProjectID: string;
}

export interface DuplicateProjectPayload extends BaseProjectPayload {
  data: Optional<Pick<DBProject, 'teamID' | 'name' | '_version' | 'platform'>, 'name' | 'platform'>;
  listID?: string;
}

export interface AddManyCustomThemesPayload extends BaseProjectPayload {
  values: DBProject['customThemes'];
}

export interface ImportProjectFromFilePayload extends BaseWorkspacePayload {
  data: string;
  vfVersion: number;
}

export interface PatchPlatformDataPayload extends BaseProjectPayload {
  platformData: Record<string, unknown>;
}

export const crud = createCRUDActions<AnyProject, BaseWorkspacePayload>(projectType);

export const merge = Utils.protocol.createAsyncAction<MergeProjectsPayload, void>(projectType('MERGE'));

export const create = Utils.protocol.createAsyncAction<CreateProjectPayload, AnyProject>(projectType('CREATE'));

export const duplicate = Utils.protocol.createAsyncAction<DuplicateProjectPayload, AnyProject>(projectType('DUPLICATE'));

export const ejectUsers = Utils.protocol.createAction<EjectUsersPayload>(projectType('KICK_USERS'));

export const importFromFile = Utils.protocol.createAsyncAction<ImportProjectFromFilePayload, AnyProject>(projectType('IMPORT_FROM_FILE'));

export const addManyCustomThemes = Utils.protocol.createAction<AddManyCustomThemesPayload>(projectType('ADD_MANY_CUSTOM_THEMES'));

export const patchPlatformData = Utils.protocol.createAction<PatchPlatformDataPayload>(projectType('PATCH_PLATFORM_DATA'));
