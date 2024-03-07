import { Utils } from '@voiceflow/common';
import type { VersionSettings } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type { DesignerAction } from '@/types';

const versionAction = createCRUD('version');

/**
 * user-sent events
 */

/* UpdateSettings */

export interface UpdateSettings extends DesignerAction {
  settings: Partial<VersionSettings>;
}

export const UpdateSettings = Utils.protocol.createAction<UpdateSettings>(versionAction('UPDATE_SETTINGS'));
