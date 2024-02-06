import { useAtomValue } from 'jotai';
import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { useComponentCMSManager } from '../../CMSComponent.hook';

export const CMSComponentTableNavigation: React.FC = () => {
  const cmsManager = useComponentCMSManager();
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
