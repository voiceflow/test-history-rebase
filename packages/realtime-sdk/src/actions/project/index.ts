import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { AnyProject, DBProject } from '@realtime-sdk/models';
import { BaseProjectPayload, BaseWorkspacePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { Optional } from 'utility-types';

import { projectType } from './utils';

export * as awareness from './awareness';
export * from './platform';

export interface ImportProjectFromFilePayload extends BaseWorkspacePayload {
  data: string;
  vfVersion: number;
}

export interface DuplicateProjectPayload extends BaseProjectPayload {
  data: Optional<Pick<DBProject, 'teamID' | 'name' | '_version'>, 'name'>;
  listID?: string;
}

export interface CreateProjectPayload extends BaseWorkspacePayload {
  data: Partial<Pick<DBProject, 'teamID' | 'name' | 'image' | '_version'>>;
  channel: string;
  listID?: string;
  platform: Constants.PlatformType;
  language?: string;
  onboarding: boolean;
  templateID: string;
}

export const importFromFile = Utils.protocol.createAction.async<ImportProjectFromFilePayload, AnyProject>(projectType('IMPORT_FROM_FILE'));

export const duplicate = Utils.protocol.createAction.async<DuplicateProjectPayload, AnyProject>(projectType('DUPLICATE'));

export const create = Utils.protocol.createAction.async<CreateProjectPayload, AnyProject>(projectType('CREATE'));

export const crud = createCRUDActions<BaseWorkspacePayload, AnyProject>(projectType);
