import { FullSpinner, Spinner } from '@voiceflow/ui';
import React from 'react';

import { DEBUG_LOADING_GATES } from '@/config';
import logger from '@/utils/logger';

const log = logger.child('LoadingGate');

export interface LoadingGateProps {
  full?: boolean;
  load?: null | (() => void);
  label?: string;
  internalName: string;
  zIndex?: number;
  unload?: () => void;
  isLoaded: boolean;
  withoutSpinner?: boolean;
  backgroundColor?: string;
  borderless?: boolean;
  hasLabel?: boolean;
  fillContainer?: boolean;
}

const LoadingGate: React.FC<LoadingGateProps> = ({
  full = true,
  load,
  label,
  internalName,
  unload,
  zIndex,
  children,
  isLoaded,
  withoutSpinner,
  backgroundColor,
  borderless,
  hasLabel = true,
  fillContainer = false,
}) => {
  React.useEffect(() => {
    if (isLoaded) {
      return unload;
    }

    if (DEBUG_LOADING_GATES) {
      log.info('loading', log.bold(internalName));
    }

    load?.();

    return undefined;
  }, [isLoaded]);

  if (!isLoaded) {
    const SpinnerComponent = full ? FullSpinner : Spinner;

    return withoutSpinner ? null : (
      <SpinnerComponent
        name={hasLabel ? label || 'Data' : ''}
        zIndex={zIndex}
        backgroundColor={backgroundColor}
        borderLess={borderless}
        fillContainer={fillContainer}
      />
    );
  }

  return <>{children}</>;
};

export default LoadingGate;
