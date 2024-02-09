import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnVariableCreate } from '../../CMSVariable.hook';

export const CMSVariableHeader: React.FC = () => {
  const onCreate = useOnVariableCreate();

  return (
    <CMSHeader
      searchPlaceholder="Search variables"
      rightActions={<Header.Button.Primary label="New variable" onClick={() => onCreate()} testID={tid(HEADER_TEST_ID, 'new-variable')} />}
    />
  );
};
