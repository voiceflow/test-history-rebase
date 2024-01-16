import { useAtomValue } from 'jotai';
import React from 'react';

import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { useIntentCMSManager } from '../../CMSIntent.hook';

export const CMSIntentTableNavigation: React.FC = () => {
  const cmsManager = useIntentCMSManager();
  const count = useAtomValue(cmsManager.dataToRenderSize);

  return (
    <CMSTableNavigation
      label={`All intents (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
