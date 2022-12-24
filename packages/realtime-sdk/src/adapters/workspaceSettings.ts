import { DBWorkspaceProperties, WorkspaceSettings } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

const workspaceSettingsAdapter = createMultiAdapter<DBWorkspaceProperties, WorkspaceSettings>(
  ({ settingsAiAssist = true }) => ({ aiAssist: settingsAiAssist }),
  ({ aiAssist }) => ({ settingsAiAssist: aiAssist })
);

export default workspaceSettingsAdapter;
