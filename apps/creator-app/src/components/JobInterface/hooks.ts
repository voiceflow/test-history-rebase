import React from 'react';

import type { Job } from '@/models';
import type { StageContent, StageContentMap } from '@/platforms/types';

export const createUseJobInterfaceContent =
  <J extends Job<any>>(contentMap: StageContentMap<J>) =>
  (stage?: J['stage']['type']): StageContent<Job<J['stage']>> | null => {
    return React.useMemo(() => (stage && contentMap[stage]) || null, [stage]);
  };
