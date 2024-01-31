import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnIntentCreate } from '../../CMSIntent.hook';

export const CMSIntentHeader: React.FC = () => {
  const onCreate = useOnIntentCreate();

  return (
    <CMSHeader
      searchPlaceholder="Search intents"
      rightActions={<Header.Button.Primary label="New intent" onClick={() => onCreate()} testID="cms-header__new-intent" />}
    />
  );
};
