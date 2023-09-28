import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { CMSResourceActions } from '@/pages/AssistantCMS/components/CMSResourceActions';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

export const CMSKnowledgeBaseTableNavigation: React.FC = () => {
  const count = useSelector(Designer.Intent.selectors.count);

  return (
    <CMSTableNavigation
      label={`All data sources (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
