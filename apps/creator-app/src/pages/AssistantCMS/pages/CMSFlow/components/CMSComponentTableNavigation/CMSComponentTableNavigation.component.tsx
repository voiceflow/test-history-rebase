import { useAtomValue } from 'jotai';
import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { useFlowCMSManager } from '../../CMSFlow.hook';

export const CMSFlowTableNavigation: React.FC = () => {
  const cmsManager = useFlowCMSManager();
  const count = useAtomValue(cmsManager.dataToRenderSize);

  return (
    <CMSTableNavigation
      label={`All components (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
