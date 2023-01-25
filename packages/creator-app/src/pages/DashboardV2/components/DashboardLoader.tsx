import { FullSpinner, FullSpinnerProps } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

import Sidebar from './Sidebar';
import WorkspaceSelector from './WorkspaceSelector';

const DashboardLoader: React.FC<FullSpinnerProps> = () => (
  <Page
    renderHeader={() => (
      <Page.Header>
        <WorkspaceSelector />
      </Page.Header>
    )}
    renderSidebar={() => <Sidebar />}
    white
  >
    <FullSpinner isAbs borderLess />
  </Page>
);

export default DashboardLoader;
