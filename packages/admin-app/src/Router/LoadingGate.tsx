import { FullSpinner } from '@voiceflow/ui';
import React from 'react';

interface LoadingGateProps {
  load: VoidFunction;
  label?: string;
  unload?: VoidFunction;
  isLoaded?: boolean;
}

const LoadingGate: React.FC<LoadingGateProps> = ({ load, label, unload, isLoaded, children }) => {
  React.useEffect(() => {
    if (!isLoaded) {
      load();
    }

    return unload;
  }, [isLoaded]);

  if (!isLoaded) {
    return <FullSpinner name={label || 'data'} />;
  }

  return <>{children}</>;
};

export default LoadingGate;
