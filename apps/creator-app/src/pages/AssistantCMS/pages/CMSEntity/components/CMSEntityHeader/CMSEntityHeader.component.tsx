import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnEntityCreate } from '../../CMSEntity.hook';

export const CMSEntityHeader: React.FC = () => {
  const onCreate = useOnEntityCreate();

  return (
    <CMSHeader
      searchPlaceholder="Search entities"
      rightActions={<Header.Button.Primary label="New entity" onClick={() => onCreate()} testID="cms-header__new-entity" />}
    />
  );
};
