import { DBWorkspaceProperties, WorkspaceSettings } from '@realtime-sdk/models';
import { createMultiAdapter } from 'bidirectional-adapter';

// TODO: use smart adapter to handle default values

const workspaceSettingsAdapter = createMultiAdapter<DBWorkspaceProperties, WorkspaceSettings>(
  ({ settingsAiAssist, settingsDashboardKanban }) => ({
    aiAssist: settingsAiAssist == null ? true : settingsAiAssist,
    dashboardKanban: settingsDashboardKanban == null ? true : settingsDashboardKanban,
  }),
  ({ aiAssist, dashboardKanban }) => ({
    settingsAiAssist: aiAssist ?? undefined,
    settingsDashboardKanban: dashboardKanban ?? undefined,
  })
);

export default workspaceSettingsAdapter;
