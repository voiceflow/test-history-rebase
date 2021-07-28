import { FullSpinner, Spinner } from '@voiceflow/ui';
import isFunction from 'lodash/isFunction';
import React from 'react';

export interface LoadingGateProps {
  full?: boolean;
  load?: null | (() => void);
  label?: string;
  zIndex?: number;
  unload?: () => void;
  isLoaded: boolean;
  children?: React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined | (() => React.ReactNode);
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

  return <>{isFunction(children) ? children() : children}</>;
};

export default LoadingGate;
