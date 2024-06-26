import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnFunctionCreate } from '../../CMSFunction.hook';

export const CMSFunctionHeader: React.FC = () => {
  const onCreate = useOnFunctionCreate();
  return (
    <CMSHeader
      searchPlaceholder="Search functions"
      rightActions={
        <Header.Button.Primary
          label="New function"
          onClick={() => onCreate()}
          testID={tid(HEADER_TEST_ID, 'new-function')}
        />
      }
    />
  );
};
