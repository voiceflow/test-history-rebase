import React from 'react';

import { AiAssistSection, DeleteWorkspaceSection, WorkspaceDataSection } from '../components';

const GeneralSettingsPage: React.FC = () => {
  return (
    <>
      <WorkspaceDataSection />

      <AiAssistSection />

      <DeleteWorkspaceSection />
    </>
  );
};

export default GeneralSettingsPage;
