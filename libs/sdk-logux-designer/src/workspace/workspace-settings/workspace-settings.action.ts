import { Utils } from '@voiceflow/common';

import type { WorkspaceAction } from '../workspace.action';
import { workspaceAction } from '../workspace.action';
import type { WorkspaceSettings } from './workspace-settings.interface';

const workspaceSettingsType = Utils.protocol.typeFactory(workspaceAction('settings'));

export interface Patch extends WorkspaceAction {
  settings: Partial<WorkspaceSettings>;
}

export const Patch = Utils.protocol.createAction<Patch>(workspaceSettingsType('PATCH'));
