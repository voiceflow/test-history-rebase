import { Nullable } from '@voiceflow/common';
import React from 'react';

import { DomainMapContext } from '@/pages/Canvas/contexts';

export const useGoToDomain = (domainID: Nullable<string>) => {
  const domainMap = React.useContext(DomainMapContext)!;

  return domainID ? domainMap[domainID] : null;
};
