import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnComponentCreate } from '../../CMSComponent.hook';

export const CMSComponentHeader: React.FC = () => {
  const onCreate = useOnComponentCreate();

  return (
    <CMSHeader searchPlaceholder="Search components" rightActions={<Header.Button.Primary label="New component" onClick={() => onCreate()} />} />
  );
};
