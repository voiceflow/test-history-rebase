import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSMessageTableNavigation: React.FC = () => {
  return (
    <CMSTableNavigation
      label="All messages"
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
