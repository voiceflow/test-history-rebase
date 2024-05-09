import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { CMSWorkflowTableNavigationButtonDelete } from './CMSWorkflowTableNavigationButtonDelete.component';

export const CMSWorkflowTableNavigation: React.FC = () => {
  return (
    <CMSTableNavigation
      label="All workflows"
      actions={
        <>
          <CMSResourceActions.CreateFolder />
          <CMSResourceActions.MoveToFolder />
          <CMSWorkflowTableNavigationButtonDelete />
        </>
      }
    />
  );
};
