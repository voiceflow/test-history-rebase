import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnResponseCreate } from '../../CMSResponse.hook';

export const CMSResponseHeader: React.FC = () => {
  const onCreate = useOnResponseCreate();

  return <CMSHeader searchPlaceholder="Search responses" rightActions={<Header.Button.Primary label="New response" onClick={() => onCreate()} />} />;
};
