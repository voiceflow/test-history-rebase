import { useAtomValue } from 'jotai';
import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { useVariableCMSManager } from '../../CMSVariable.hook';

export const CMSVariableTableNavigation: React.FC = () => {
  const cmsManager = useVariableCMSManager();
  const count = useAtomValue(cmsManager.dataToRenderSize);

  return (
    <CMSTableNavigation
      label={`All variables (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
