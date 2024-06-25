import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { STATE_KEY } from './knowledge-base.state';

export const type = Utils.protocol.typeFactory(STATE_KEY);

export interface SetSettings {
  settings: BaseModels.Project.KnowledgeBaseSettings;
}

export const SetSettings = Utils.protocol.createAction<SetSettings>(type('SET_SETTINGS'));

export interface PatchSettings {
  patch: Partial<BaseModels.Project.KnowledgeBaseSettings>;
}

export const PatchSettings = Utils.protocol.createAction<PatchSettings>(type('PATCH_SETTINGS'));
