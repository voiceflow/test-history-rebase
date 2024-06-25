import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnEntityCreate } from '../../CMSEntity.hook';

export const CMSEntityHeader: React.FC = () => {
  const onCreate = useOnEntityCreate();

  return (
    <CMSHeader
      searchPlaceholder="Search entities"
      rightActions={
        <Header.Button.Primary
          label="New entity"
          onClick={() => onCreate()}
          testID={tid(HEADER_TEST_ID, 'new-entity')}
        />
      }
    />
  );
};
