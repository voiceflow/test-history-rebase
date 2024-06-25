import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnResponseCreate } from '../../CMSMessage.hook';

export const CMSMessageHeader: React.FC = () => {
  const onCreate = useOnResponseCreate();

  return (
    <CMSHeader
      searchPlaceholder="Search messages"
      rightActions={<Header.Button.Primary label="New message" onClick={() => onCreate()} />}
    />
  );
};
