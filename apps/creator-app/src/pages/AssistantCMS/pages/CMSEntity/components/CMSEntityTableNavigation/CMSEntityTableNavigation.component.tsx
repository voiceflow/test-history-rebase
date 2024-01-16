import { useAtomValue } from 'jotai';
import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { useEntityCMSManager } from '../../CMSEntity.hook';

export const CMSEntityTableNavigation: React.FC = () => {
  const cmsManager = useEntityCMSManager();
  const count = useAtomValue(cmsManager.dataToRenderSize);

  return (
    <CMSTableNavigation
      label={`All entities (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
