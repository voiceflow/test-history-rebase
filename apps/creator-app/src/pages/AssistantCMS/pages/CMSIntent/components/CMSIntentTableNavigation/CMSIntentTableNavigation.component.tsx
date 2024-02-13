import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSIntentTableNavigation: React.FC = () => {
  return (
    <CMSTableNavigation
      label="All intents"
      actions={
        <>
          <CMSResourceActions.CreateFolder />
          <CMSResourceActions.MoveToFolder />
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
