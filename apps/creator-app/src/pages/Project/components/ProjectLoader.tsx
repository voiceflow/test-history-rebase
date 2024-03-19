import { ITabLoader, TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import Page from '@/components/Page';

import { LogoOnlyHeader } from './Header/components';
import { LogoOffsetSidebar } from './Sidebar/components';

const ProjectLoader: React.FC<ITabLoader> = (props) => {
  return (
    <Page renderHeader={() => <LogoOnlyHeader />} renderSidebar={() => <LogoOffsetSidebar />}>
      <TabLoader variant="dark" {...props} />
    </Page>
  );
};

export default ProjectLoader;
