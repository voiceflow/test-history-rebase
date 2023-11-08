import React from 'react';

import { DashboardModeSection, DeleteWorkspaceSection, WorkspaceDataSection } from '../components';

const GeneralSettingsPage: React.FC = () => {
  return (
    <>
      <WorkspaceDataSection />

      <DashboardModeSection />

      <DeleteWorkspaceSection />
    </>
  );
};

export default GeneralSettingsPage;
