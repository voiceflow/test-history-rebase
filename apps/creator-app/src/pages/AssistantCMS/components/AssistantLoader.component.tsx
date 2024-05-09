import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { AssistantLayout } from '@/components/Assistant/AssistantLayout/AssistantLayout.component';

import { CMSLayout } from './CMSLayout/CMSLayout.component';
import { CMSPageLoader } from './CMSPageLoader.component';

interface IAssistantLoader {
  isCMS?: boolean;
}

export const AssistantLoader: React.FC<IAssistantLoader> = ({ isCMS }) => {
  return (
    <>
      {isCMS ? (
        <CMSLayout>
          <CMSPageLoader />
        </CMSLayout>
      ) : (
        <AssistantLayout>
          <TabLoader variant="dark" />
        </AssistantLayout>
      )}
    </>
  );
};
