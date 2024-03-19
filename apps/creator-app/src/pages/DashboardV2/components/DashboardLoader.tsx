import { type ITabLoader, TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import Page from '@/components/Page';

import Sidebar from './Sidebar';
import WorkspaceSelector from './WorkspaceSelector';

const DashboardLoader: React.FC<ITabLoader> = (props) => {
  return (
    <Page
      renderHeader={() => (
        <Page.Header>
          <WorkspaceSelector />
        </Page.Header>
      )}
      renderSidebar={() => <Sidebar />}
      white
    >
      <TabLoader variant="dark" {...props} />
    </Page>
  );
};

export default DashboardLoader;
