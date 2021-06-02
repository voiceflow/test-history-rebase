import React from 'react';

import setupAdmin from '@/admin/setup';

const LifecycleProvider: React.FC = ({ children }) => {
  React.useEffect(() => {
    setupAdmin();
  }, []);

  return <>{children}</>;
};

export default LifecycleProvider;
