import { FullSpinner, FullSpinnerProps } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

import Sidebar from './Sidebar';
import WorkspaceSelector from './WorkspaceSelector';

const DashboardLoader: React.OldFC<FullSpinnerProps> = (props) => (
  <Page
    renderHeader={() => (
      <Page.Header>
        <WorkspaceSelector />
      </Page.Header>
    )}
    renderSidebar={() => <Sidebar />}
  >
    <FullSpinner isAbs {...props} />
  </Page>
);

export default DashboardLoader;
