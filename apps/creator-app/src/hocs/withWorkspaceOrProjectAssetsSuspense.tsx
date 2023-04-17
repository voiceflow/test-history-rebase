import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import WorkspaceOrProjectLoader from '@/gates/WorkspaceOrProjectLoader';

export const withWorkspaceOrProjectAssetsSuspense = (Component: React.FC, label = 'Assets') =>
  setDisplayName(wrapDisplayName(Component, 'withWorkspaceOrProjectAssetsSuspense'))(() => (
    <React.Suspense fallback={<WorkspaceOrProjectLoader name={label} />}>
      <Component />
    </React.Suspense>
  ));
