import React from 'react';

import { Job } from '@/models';
import { StageContent, StageContentMap } from '@/platforms/types';

export const createUseJobInterfaceContent =
  <J extends Job<any>>(contentMap: StageContentMap<J>) =>
  (stage?: J['stage']['type']): StageContent<Job<J['stage']>> | null => {
    return React.useMemo(() => (stage && contentMap[stage]) || null, [stage]);
  };
