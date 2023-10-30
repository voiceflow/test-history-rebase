import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSFunctionTableNavigation: React.FC = () => {
  const count = useSelector(Designer.Function.selectors.count);

  return (
    <CMSTableNavigation
      label={`All functions (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
