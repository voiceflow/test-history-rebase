import React from 'react';

import { FullSpinner } from '@/components/Spinner';

const LazyLoadSpinner = () => {
  React.useEffect(() => window.location.reload(), []);

  return <FullSpinner />;
};

// eslint-disable-next-line import/prefer-default-export
export const lazy = (fetchComponent: () => Promise<{ default: any }>) =>
  React.lazy(() =>
    fetchComponent().catch(() => ({
      default: LazyLoadSpinner,
    }))
  );
