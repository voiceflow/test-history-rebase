import React from 'react';

import { AiAssistSection, DashboardModeSection, DeleteWorkspaceSection, WorkspaceDataSection } from '../components';

const GeneralSettingsPage: React.FC = () => {
  return (
    <>
      <WorkspaceDataSection />

      <AiAssistSection />

      <DashboardModeSection />

      <DeleteWorkspaceSection />
    </>
  );
};

export default GeneralSettingsPage;
