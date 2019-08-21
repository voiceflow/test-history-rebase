import React from 'react';

import { FullSpinner } from '@/components/Spinner';

// import ErrorBoundary from '@/components/ErrorBoundary';

function LoadingGate({ label, isLoaded, load, unload, children }) {
  React.useEffect(() => {
    if (!isLoaded) {
      load();
    }

    return unload;
  }, [isLoaded]);

  if (!isLoaded) {
    return <FullSpinner name={label || 'data'} />;
  }

  // return <ErrorBoundary>{children()}</ErrorBoundary>;
  return children();
}

export default LoadingGate;
