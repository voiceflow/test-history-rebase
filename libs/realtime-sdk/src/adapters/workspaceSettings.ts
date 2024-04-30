import { createMultiAdapter } from 'bidirectional-adapter';

import type { DBWorkspaceProperties, WorkspaceSettings } from '@/models';

// TODO: use smart adapter to handle default values

const workspaceSettingsAdapter = createMultiAdapter<DBWorkspaceProperties, WorkspaceSettings>(
  ({ settingsAiAssist, settingsDashboardKanban }) => ({
    aiAssist: settingsAiAssist == null ? true : settingsAiAssist,
    dashboardKanban: settingsDashboardKanban == null ? true : settingsDashboardKanban,
  }),
  ({ aiAssist, dashboardKanban }) => ({ settingsAiAssist: aiAssist, settingsDashboardKanban: dashboardKanban })
);

export default workspaceSettingsAdapter;
