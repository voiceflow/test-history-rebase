import { DBWorkspaceProperties, WorkspaceSettings } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

// TODO: use smart adapter to handle default values

const workspaceSettingsAdapter = createMultiAdapter<DBWorkspaceProperties, WorkspaceSettings>(
  ({ settingsAiAssist }) => ({
    aiAssist: settingsAiAssist == null ? true : settingsAiAssist,
  }),
  ({ aiAssist }) => ({ settingsAiAssist: aiAssist })
);

export default workspaceSettingsAdapter;
