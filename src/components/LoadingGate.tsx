import React from 'react';

import { FullSpinner, Spinner } from '@/components/Spinner';

export type LoadingGateProps = {
  isLoaded: boolean;
  load: () => unknown | Promise<any>;
  unload?: () => void;
  label?: string;
  full?: boolean;
  zIndex?: number;
  backgroundColor?: string;
  children?: React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined | (() => React.ReactNode);
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

  return <>{typeof children === 'function' ? (children as any)() : children}</>;
};

export default LoadingGate;
