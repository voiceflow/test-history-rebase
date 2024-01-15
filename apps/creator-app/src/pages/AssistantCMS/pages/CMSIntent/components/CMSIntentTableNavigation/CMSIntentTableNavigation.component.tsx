import { useAtomValue } from 'jotai';
import React from 'react';

import { Path } from '@/config/routes';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';
import { useIntentCMSManager } from '../../CMSIntent.hook';

export const CMSIntentTableNavigation: React.FC = () => {
  const cmsManager = useIntentCMSManager();
  const count = useAtomValue(cmsManager.dataToRenderSize);

  return (
    <CMSTableNavigation
      path={Path.CMS_INTENT}
      label={`All intents (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
