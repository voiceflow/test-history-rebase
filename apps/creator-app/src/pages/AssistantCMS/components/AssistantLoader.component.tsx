import React from 'react';

import { CMSLayout } from './CMSLayout/CMSLayout.component';
import { CMSPageLoader } from './CMSPageLoader.component';

export const AssistantLoader: React.FC = () => {
  return (
    <>
      <CMSLayout>
        <CMSPageLoader />
      </CMSLayout>
    </>
  );
};
