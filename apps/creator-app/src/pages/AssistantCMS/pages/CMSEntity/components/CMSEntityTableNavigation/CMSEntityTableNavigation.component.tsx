import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSEntityTableNavigation: React.FC = () => {
  const count = useSelector(Designer.Entity.selectors.count);

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
