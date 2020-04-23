import React from 'react';

import { FullSpinner, Spinner } from '@/components/Spinner';

export type LoadingGateProps = {
  isLoaded: boolean;
  load: () => void | Promise<void>;
  unload?: () => void;
  label?: string;
  full?: boolean;
  zIndex?: number;
  backgroundColor?: string;
  children: React.ReactElement | (() => React.ReactElement);
};

const LoadingGate: React.FC<LoadingGateProps> = ({ label, isLoaded, load, unload, full = true, children, zIndex, backgroundColor }) => {
  React.useEffect(() => {
    if (isLoaded) {
      return unload;
    }

    load();

    return undefined;
  }, [isLoaded]);

  if (!isLoaded) {
    const SpinnerComponent = full ? FullSpinner : Spinner;
    return <SpinnerComponent name={label || 'Data'} zIndex={zIndex} backgroundColor={backgroundColor} />;
  }

  return typeof children === 'function' ? children() : (children as React.ReactElement);
};

export default LoadingGate;
