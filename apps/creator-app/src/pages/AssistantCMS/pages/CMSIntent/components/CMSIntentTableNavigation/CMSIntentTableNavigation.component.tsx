import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSIntentTableNavigation: React.FC = () => {
  const count = useSelector(Designer.Intent.selectors.count);

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
