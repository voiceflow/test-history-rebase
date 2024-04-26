import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnFlowCreate } from '../../CMSFlow.hook';

export const CMSFlowHeader: React.FC = () => {
  const onCreate = useOnFlowCreate();

  return (
    <CMSHeader
      searchPlaceholder="Search components"
      rightActions={<Header.Button.Primary label="New component" onClick={() => onCreate()} />}
    />
  );
};
