import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSResponseTableNavigation: React.FC = () => {
  return (
    <CMSTableNavigation
      label="All responses"
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
