import { FullSpinner, Spinner } from '@voiceflow/ui';
import React from 'react';

export interface LoadingGateProps {
  full?: boolean;
  load?: null | (() => void);
  label?: string;
  zIndex?: number;
  unload?: () => void;
  isLoaded: boolean;
  withoutSpinner?: boolean;
  backgroundColor?: string;
}

const LoadingGate: React.FC<LoadingGateProps> = ({
  full = true,
  load,
  label,
  unload,
  zIndex,
  children,
  isLoaded,
  withoutSpinner,
  backgroundColor,
}) => {
  React.useEffect(() => {
    if (isLoaded) {
      return unload;
    }

    load?.();

    return undefined;
  }, [isLoaded]);

  if (!isLoaded) {
    const SpinnerComponent = full ? FullSpinner : Spinner;

    return withoutSpinner ? null : <SpinnerComponent name={label || 'Data'} zIndex={zIndex} backgroundColor={backgroundColor} />;
  }

  return <>{children}</>;
};

export default LoadingGate;
