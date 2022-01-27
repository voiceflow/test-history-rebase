import { FullSpinner } from '@voiceflow/ui';
import React from 'react';

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

  return children();
}

export default LoadingGate;
