import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { CMSVariableTableNavigationButtonDelete } from './CMSVariableTableNavigationButtonDelete';

export const CMSVariableTableNavigation: React.FC = () => {
  return (
    <CMSTableNavigation
      label="All variables"
      actions={
        <>
          <CMSResourceActions.CreateFolder />
          <CMSResourceActions.MoveToFolder />
          <CMSVariableTableNavigationButtonDelete />
        </>
      }
    />
  );
};
